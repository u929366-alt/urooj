import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, Lock, Radio, Video } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LectureRoom } from "@/components/learn/LectureRoom";
import { getCurrentUser } from "@/lib/lms/auth";
import { canJoinSession, getSessionByRoom } from "@/lib/lms/queries";
import { recordAttendanceAction } from "@/lib/lms/liveActions";
import {
  createJitsiToken,
  identityFor,
  isVideoConfigured,
  jitsiDomain,
  tokenExpiryFor,
} from "@/lib/lms/video";
import { formatWhen, startsIn } from "@/lib/lms/time";
import type { Course } from "@/payload-types";

type Params = { params: Promise<{ roomName: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { roomName } = await params;
  const session = await getSessionByRoom(roomName);
  return {
    title: session ? session.title : "Live class",
    // A lecture room is for the people in it, not for search engines.
    robots: { index: false, follow: false },
  };
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <Container className="py-12">
      <Link href="/learn/live" className="text-sm font-semibold text-primary-600 hover:underline">
        ← All live classes
      </Link>
      <div className="mt-4">{children}</div>
    </Container>
  );
}

export default async function LectureRoomPage({ params }: Params) {
  const { roomName } = await params;
  const session = await getSessionByRoom(roomName);
  if (!session) notFound();

  const user = await getCurrentUser();
  const verdict = await canJoinSession(session, user);
  const course = typeof session.course === "object" ? (session.course as Course | null) : null;
  const when = formatWhen(session.startsAt);

  if (!verdict.ok) {
    const message = {
      "signed-out": {
        title: "Sign in to join",
        body: "Live classes are for enrolled students. Sign in and come back to this page.",
        action: { href: `/learn/login?next=/learn/live/${roomName}`, label: "Sign in" },
      },
      "not-enrolled": {
        title: "This class is for students on the course",
        body: course
          ? `Enrol on ${course.title} and you can join this and every other class on it.`
          : "You are not enrolled on the course this class belongs to.",
        action: course
          ? { href: `/learn/courses/${course.slug}`, label: "See the course" }
          : { href: "/learn/courses", label: "Browse courses" },
      },
      cancelled: {
        title: "This class was cancelled",
        body: "Your instructor called it off. Check the live classes page for the next one.",
        action: { href: "/learn/live", label: "Upcoming classes" },
      },
      finished: {
        title: "This class has ended",
        body: session.recordingUrl
          ? "A recording is available below."
          : "If a recording is made, it will appear on the course page.",
        action: { href: "/learn/live", label: "Upcoming classes" },
      },
    }[verdict.reason];

    return (
      <Shell>
        <Card className="p-8 text-center">
          <Lock className="mx-auto h-8 w-8 text-gray-400" aria-hidden />
          <h1 className="mt-4 font-display text-2xl font-bold text-primary-900">{message.title}</h1>
          <p className="mx-auto mt-2 max-w-lg text-gray-600">{message.body}</p>
          {verdict.reason === "finished" && session.recordingUrl && (
            <a
              href={session.recordingUrl}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-secondary-500 px-6 py-3 font-semibold text-white hover:bg-secondary-600"
            >
              <Video className="h-4 w-4" aria-hidden />
              Watch the recording
            </a>
          )}
          <Link
            href={message.action.href}
            className="mt-4 block text-sm font-semibold text-primary-600 hover:underline"
          >
            {message.action.label}
          </Link>
        </Card>
      </Shell>
    );
  }

  // Held somewhere else — Zoom, Meet — so the portal's job ends at the door.
  if (session.externalUrl) {
    return (
      <Shell>
        <Card className="p-8 text-center">
          <h1 className="font-display text-2xl font-bold text-primary-900">{session.title}</h1>
          <p className="mt-2 text-gray-600">{when}</p>
          <a
            href={session.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-secondary-500 px-7 py-3.5 font-semibold text-white hover:bg-secondary-600"
          >
            Join the class
          </a>
          <p className="mt-3 text-xs text-gray-500">This class opens in another service.</p>
        </Card>
      </Shell>
    );
  }

  if (!isVideoConfigured()) {
    return (
      <Shell>
        <Card className="p-8">
          <h1 className="font-display text-2xl font-bold text-primary-900">{session.title}</h1>
          <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
            No video server is configured yet, so this class cannot start. Whoever runs the site
            needs to set <code>JITSI_DOMAIN</code> in the portal&apos;s settings.
          </p>
        </Card>
      </Shell>
    );
  }

  const waiting = session.status === "scheduled";
  const countdown = startsIn(session.startsAt);

  return (
    <Shell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {session.status === "live" ? (
              <Badge tone="secondary">
                <Radio className="mr-1 inline h-3 w-3" aria-hidden />
                Live now
              </Badge>
            ) : (
              <Badge tone="neutral">Scheduled</Badge>
            )}
            {verdict.moderator && <Badge tone="primary">You are the host</Badge>}
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold text-primary-900 sm:text-3xl">
            {session.title}
          </h1>
          <p className="mt-1 text-gray-600">
            {when}
            {course ? ` · ${course.title}` : ""}
          </p>
        </div>
      </div>

      {session.description && (
        <p className="mt-4 max-w-3xl whitespace-pre-line text-gray-600">{session.description}</p>
      )}

      {waiting && !verdict.moderator ? (
        <Card className="mt-6 p-8 text-center">
          <CalendarClock className="mx-auto h-8 w-8 text-primary-400" aria-hidden />
          <p className="mt-4 font-semibold text-primary-900">
            {countdown ? `This class starts ${countdown}.` : "This class has not started yet."}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Leave this page open — it does not refresh itself, so reload when the time comes and
            the room will be here.
          </p>
        </Card>
      ) : (
        <div className="mt-6">
          <LectureRoom
            domain={jitsiDomain}
            roomName={session.roomName ?? roomName}
            token={createJitsiToken(
              session.roomName ?? roomName,
              identityFor(user!, verdict.moderator),
              tokenExpiryFor(session),
            )}
            displayName={user!.name}
            email={user!.email}
            moderator={verdict.moderator}
            subject={session.title}
            onAttendance={recordAttendanceAction}
          />
          {verdict.moderator && (
            <p className="mt-3 text-sm text-gray-500">
              Students arrive muted with cameras off, and only a few video feeds are sent at once
              so a large class does not overwhelm the server. Mark the class ended from{" "}
              <Link href="/learn/teach/live" className="font-semibold text-primary-600 hover:underline">
                your classes
              </Link>{" "}
              when you finish.
            </p>
          )}
        </div>
      )}
    </Shell>
  );
}
