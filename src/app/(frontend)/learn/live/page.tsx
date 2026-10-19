import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, Radio, Video } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCurrentUser } from "@/lib/lms/auth";
import { listMyEnrollments, listUpcomingSessions } from "@/lib/lms/queries";
import { formatWhen, isJoinable, startsIn } from "@/lib/lms/time";
import { siteConfig } from "@/lib/site";
import type { Course, LiveSession, User } from "@/payload-types";

export const metadata: Metadata = {
  title: "Live Classes",
  description:
    "Live lectures on Hunarsaaz courses — when they are, and how to join the ones you are enrolled on.",
  alternates: { canonical: `${siteConfig.portalUrl}/learn/live` },
};

function idOf(value: unknown): number | string | null {
  if (value == null) return null;
  if (typeof value === "object") return (value as { id?: number }).id ?? null;
  return value as number;
}

export default async function LiveClassesPage() {
  const user = await getCurrentUser();
  const sessions = await listUpcomingSessions();

  // Which of these can this person actually walk into? Worked out here so the
  // list can say so plainly rather than making everyone click to find out.
  const enrolments = user ? await listMyEnrollments(user.id) : [];
  const enrolledCourseIds = new Set(
    enrolments
      .filter((row) => row.status === "active" || row.status === "completed")
      .map((row) => String(idOf(row.course))),
  );
  const staff = user?.role === "admin" || user?.role === "instructor";

  function mayJoin(session: LiveSession): boolean {
    if (!user) return false;
    if (staff) return true;
    const courseId = idOf(session.course);
    if (courseId == null) return true;
    return enrolledCourseIds.has(String(courseId));
  }

  return (
    <Container className="py-12">
      <SectionHeading
        eyebrow="Live online"
        title="Live Classes"
        description="Lectures held online with an instructor, at a set time. Join from this page — there is nothing to install."
      />

      {sessions.length === 0 ? (
        <Card className="mt-10 p-8 text-center text-gray-600">
          <CalendarClock className="mx-auto h-8 w-8 text-gray-400" aria-hidden />
          <p className="mt-4 font-semibold text-primary-900">No classes are scheduled yet.</p>
          <p className="mt-2 text-sm">
            Live classes are announced on the course pages. Keep studying at your own pace in the
            meantime.
          </p>
          <Link
            href="/learn/courses"
            className="mt-4 inline-block text-sm font-semibold text-primary-600 hover:underline"
          >
            Browse courses
          </Link>
        </Card>
      ) : (
        <div className="mt-10 space-y-4">
          {sessions.map((session) => {
            const course =
              typeof session.course === "object" ? (session.course as Course | null) : null;
            const instructor =
              typeof session.instructor === "object"
                ? (session.instructor as User | null)
                : null;
            const live = session.status === "live";
            const open = live || isJoinable(session.startsAt, session.durationMinutes);
            const allowed = mayJoin(session);
            const countdown = startsIn(session.startsAt);

            return (
              <Card key={session.id} className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {live ? (
                        <Badge tone="secondary">
                          <Radio className="mr-1 inline h-3 w-3" aria-hidden />
                          Live now
                        </Badge>
                      ) : (
                        <Badge tone="neutral">{countdown ?? "Starting shortly"}</Badge>
                      )}
                      {course && <Badge tone="primary">{course.title}</Badge>}
                    </div>
                    <h2 className="mt-2 font-display text-lg font-semibold text-primary-900">
                      {session.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      {formatWhen(session.startsAt)} · {session.durationMinutes ?? 60} min
                      {instructor?.name ? ` · ${instructor.name}` : ""}
                    </p>
                    {session.description && (
                      <p className="mt-2 max-w-2xl text-sm text-gray-600">{session.description}</p>
                    )}
                  </div>

                  <div className="shrink-0">
                    {!user ? (
                      <Link
                        href={`/learn/login?next=/learn/live/${session.roomName}`}
                        className="inline-flex items-center justify-center rounded-full border-2 border-primary-600 px-6 py-2.5 text-sm font-semibold text-primary-600 hover:bg-primary-50"
                      >
                        Sign in to join
                      </Link>
                    ) : !allowed ? (
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Enrolled students only</p>
                        {course && (
                          <Link
                            href={`/learn/courses/${course.slug}`}
                            className="text-sm font-semibold text-primary-600 hover:underline"
                          >
                            See the course
                          </Link>
                        )}
                      </div>
                    ) : open ? (
                      <Link
                        href={`/learn/live/${session.roomName}`}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-secondary-600"
                      >
                        <Video className="h-4 w-4" aria-hidden />
                        {live ? "Join now" : "Open the room"}
                      </Link>
                    ) : (
                      <Link
                        href={`/learn/live/${session.roomName}`}
                        className="inline-flex items-center justify-center rounded-full border-2 border-primary-600 px-6 py-2.5 text-sm font-semibold text-primary-600 hover:bg-primary-50"
                      >
                        Details
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </Container>
  );
}
