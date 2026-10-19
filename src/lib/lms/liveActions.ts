"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";
import { getCurrentUser } from "./auth";
import { canJoinSession, getSessionByRoom } from "./queries";
import type { FormState } from "./actions";

/**
 * The live lecture actions.
 *
 * Every one of these re-checks who is asking. The lecture room page checks
 * too, but a page check only governs what is drawn; these govern what is
 * written, and a form post does not have to come from the page.
 */

const sessionSchema = z.object({
  title: z.string().trim().min(3, "Give the class a title."),
  courseId: z.string().trim().optional(),
  description: z.string().trim().optional(),
  startsAt: z.string().trim().min(1, "Pick a date and time."),
  durationMinutes: z.coerce.number().int().min(5).max(480),
  // Minutes the scheduler's clock is behind UTC, as getTimezoneOffset reports
  // it. Pakistan is -300.
  tzOffset: z.coerce.number().int().min(-840).max(840).optional(),
});

/** Pakistan is UTC+5 and has no daylight saving, so this never drifts. */
const PAKISTAN_OFFSET_MINUTES = -300;

/**
 * The instant meant by a wall-clock time typed into a date picker.
 *
 * A `datetime-local` value carries no zone, so reading it with `new Date()`
 * on the server silently interprets it in the server's own zone. The hosting
 * runs on UTC and the instructors are in Pakistan, which would put every class
 * five hours out — scheduled for 7pm, opening at midnight.
 */
function toInstant(wallClock: string, offsetMinutes: number | undefined): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(wallClock);
  if (!match) {
    const loose = new Date(wallClock);
    return Number.isNaN(loose.getTime()) ? null : loose;
  }
  const [, year, month, day, hour, minute] = match;
  const asIfUtc = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  );
  const offset = offsetMinutes ?? PAKISTAN_OFFSET_MINUTES;
  return new Date(asIfUtc + offset * 60_000);
}

function flatten(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}

/** Schedule a lecture. Instructors and admins only. */
export async function createSessionAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "instructor")) {
    return { error: "Only instructors can schedule a class." };
  }

  const parsed = sessionSchema.safeParse({
    title: formData.get("title"),
    courseId: formData.get("courseId") || undefined,
    description: formData.get("description") || undefined,
    startsAt: formData.get("startsAt"),
    durationMinutes: formData.get("durationMinutes") ?? 60,
    tzOffset: formData.get("tzOffset") ?? undefined,
  });
  if (!parsed.success) return { fieldErrors: flatten(parsed.error) };

  const startsAt = toInstant(parsed.data.startsAt, parsed.data.tzOffset);
  if (!startsAt) {
    return { fieldErrors: { startsAt: "That date did not make sense." } };
  }

  const payload = await getPayload({ config });
  await payload.create({
    collection: "live-sessions",
    data: {
      title: parsed.data.title,
      course: parsed.data.courseId ? Number(parsed.data.courseId) : undefined,
      description: parsed.data.description,
      startsAt: startsAt.toISOString(),
      durationMinutes: parsed.data.durationMinutes,
      instructor: user.id,
      status: "scheduled",
    },
    overrideAccess: true,
  });

  revalidatePath("/learn/teach/live");
  revalidatePath("/learn/live");
  redirect("/learn/teach/live?created=1");
}

const statusSchema = z.enum(["scheduled", "live", "ended", "cancelled"]);

/** Start, end or cancel a lecture. Only the instructor leading it, or an admin. */
export async function setSessionStatusAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/learn/login");

  const roomName = String(formData.get("roomName") || "");
  const parsed = statusSchema.safeParse(formData.get("status"));
  if (!parsed.success) redirect("/learn/teach/live?error=status");

  const session = await getSessionByRoom(roomName);
  if (!session) redirect("/learn/teach/live?error=missing");

  const instructorId =
    typeof session.instructor === "object" ? session.instructor?.id : session.instructor;
  const mayChange = user.role === "admin" || String(instructorId) === String(user.id);
  if (!mayChange) redirect("/learn/teach/live?error=forbidden");

  const payload = await getPayload({ config });
  await payload.update({
    collection: "live-sessions",
    id: session.id,
    data: { status: parsed.data },
    overrideAccess: true,
  });

  revalidatePath("/learn/teach/live");
  revalidatePath("/learn/live");
  revalidatePath(`/learn/live/${roomName}`);
  redirect(parsed.data === "live" ? `/learn/live/${roomName}` : "/learn/teach/live");
}

/**
 * Record that someone walked into the room.
 *
 * Called by the lecture page itself once the call is joined, not by a button,
 * so the register reflects who actually arrived rather than who clicked. Safe
 * to call twice: the second call updates the first row instead of adding one.
 */
export async function recordAttendanceAction(roomName: string, minutesPresent = 0) {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const };

  const session = await getSessionByRoom(roomName);
  if (!session) return { ok: false as const };

  const verdict = await canJoinSession(session, user);
  if (!verdict.ok) return { ok: false as const };

  const payload = await getPayload({ config });
  const existing = await payload.find({
    collection: "live-attendance",
    where: {
      and: [{ session: { equals: session.id } }, { student: { equals: user.id } }],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  if (existing.docs[0]) {
    await payload.update({
      collection: "live-attendance",
      id: existing.docs[0].id,
      data: {
        minutesPresent: Math.max(existing.docs[0].minutesPresent ?? 0, minutesPresent),
        leftAt: minutesPresent > 0 ? new Date().toISOString() : existing.docs[0].leftAt,
      },
      overrideAccess: true,
    });
    return { ok: true as const };
  }

  await payload.create({
    collection: "live-attendance",
    data: {
      session: session.id,
      student: user.id,
      joinedAt: new Date().toISOString(),
      minutesPresent,
    },
    overrideAccess: true,
  });

  // Kept on the session as well, so the instructor's list can show a count
  // without reading every attendance row for every class.
  await payload.update({
    collection: "live-sessions",
    id: session.id,
    data: { attendanceCount: (session.attendanceCount ?? 0) + 1 },
    overrideAccess: true,
  });

  return { ok: true as const };
}

/** Attach a recording link to a finished class. */
export async function setRecordingUrlAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "instructor")) {
    redirect("/learn/teach/live?error=forbidden");
  }

  const roomName = String(formData.get("roomName") || "");
  const url = String(formData.get("recordingUrl") || "").trim();
  const session = await getSessionByRoom(roomName);
  if (!session) redirect("/learn/teach/live?error=missing");

  const payload = await getPayload({ config });
  await payload.update({
    collection: "live-sessions",
    id: session.id,
    data: { recordingUrl: url || null },
    overrideAccess: true,
  });

  revalidatePath("/learn/teach/live");
  redirect("/learn/teach/live?saved=1");
}
