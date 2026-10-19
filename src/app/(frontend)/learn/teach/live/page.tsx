import type { Metadata } from "next";
import Link from "next/link";
import { Radio, Users, Video } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScheduleClassForm } from "@/components/learn/ScheduleClassForm";
import { requireStaff } from "@/lib/lms/auth";
import { listPublishedCourses, listSessionsByInstructor } from "@/lib/lms/queries";
import { setRecordingUrlAction, setSessionStatusAction } from "@/lib/lms/liveActions";
import { formatWhen } from "@/lib/lms/time";
import { isVideoConfigured, jitsiDomain } from "@/lib/lms/video";
import type { Course } from "@/payload-types";

export const metadata: Metadata = {
  title: "My Live Classes",
  robots: { index: false, follow: false },
};

export default async function TeachLivePage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; saved?: string; error?: string }>;
}) {
  const staff = await requireStaff("/learn/teach/live");
  const { created, saved, error } = await searchParams;

  const [sessions, courses] = await Promise.all([
    listSessionsByInstructor(staff.id),
    listPublishedCourses(),
  ]);

  const upcoming = sessions.filter(
    (session) => session.status === "scheduled" || session.status === "live",
  );
  const finished = sessions.filter(
    (session) => session.status === "ended" || session.status === "cancelled",
  );

  return (
    <Container className="py-12">
      <h1 className="font-display text-3xl font-bold text-primary-900">My Live Classes</h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        Schedule a lecture, start it when the time comes, and see who turned up.
      </p>

      {created && (
        <p className="mt-4 rounded-xl bg-accent-50 px-4 py-3 text-sm text-accent-800">
          Class scheduled. Students enrolled on the course can now see it.
        </p>
      )}
      {saved && (
        <p className="mt-4 rounded-xl bg-accent-50 px-4 py-3 text-sm text-accent-800">Saved.</p>
      )}
      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          That did not work. {error === "forbidden" ? "It is not your class to change." : ""}
        </p>
      )}

      {!isVideoConfigured() && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <p className="font-semibold">No video server is connected yet.</p>
          <p className="mt-1">
            You can schedule classes, but nobody can join one until{" "}
            <code>JITSI_DOMAIN</code> is set in the portal&apos;s settings file. See the live
            classes section of the deployment notes.
          </p>
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <h2 className="font-display text-xl font-semibold text-primary-900">Coming up</h2>
          {upcoming.length === 0 ? (
            <Card className="mt-4 p-6 text-sm text-gray-600">
              Nothing scheduled. Use the form to add your first class.
            </Card>
          ) : (
            <div className="mt-4 space-y-4">
              {upcoming.map((session) => {
                const course =
                  typeof session.course === "object" ? (session.course as Course | null) : null;
                const live = session.status === "live";
                return (
                  <Card key={session.id} className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      {live ? (
                        <Badge tone="secondary">
                          <Radio className="mr-1 inline h-3 w-3" aria-hidden />
                          Live
                        </Badge>
                      ) : (
                        <Badge tone="neutral">Scheduled</Badge>
                      )}
                      {course && <Badge tone="primary">{course.title}</Badge>}
                    </div>
                    <h3 className="mt-2 font-semibold text-primary-900">{session.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {formatWhen(session.startsAt)} · {session.durationMinutes ?? 60} min
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                      <Users className="h-3.5 w-3.5" aria-hidden />
                      {session.attendanceCount ?? 0} joined
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {live ? (
                        <>
                          <Link
                            href={`/learn/live/${session.roomName}`}
                            className="inline-flex items-center gap-2 rounded-full bg-secondary-500 px-5 py-2 text-sm font-semibold text-white hover:bg-secondary-600"
                          >
                            <Video className="h-4 w-4" aria-hidden />
                            Go to the room
                          </Link>
                          <form action={setSessionStatusAction}>
                            <input type="hidden" name="roomName" value={session.roomName ?? ""} />
                            <input type="hidden" name="status" value="ended" />
                            <button
                              type="submit"
                              className="rounded-full border-2 border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                              End the class
                            </button>
                          </form>
                        </>
                      ) : (
                        <>
                          <form action={setSessionStatusAction}>
                            <input type="hidden" name="roomName" value={session.roomName ?? ""} />
                            <input type="hidden" name="status" value="live" />
                            <button
                              type="submit"
                              className="rounded-full bg-secondary-500 px-5 py-2 text-sm font-semibold text-white hover:bg-secondary-600"
                            >
                              Start the class
                            </button>
                          </form>
                          <form action={setSessionStatusAction}>
                            <input type="hidden" name="roomName" value={session.roomName ?? ""} />
                            <input type="hidden" name="status" value="cancelled" />
                            <button
                              type="submit"
                              className="rounded-full border-2 border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </form>
                        </>
                      )}
                      <Link
                        href={`/learn/teach/live/${session.roomName}`}
                        className="rounded-full px-4 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50"
                      >
                        Register
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {finished.length > 0 && (
            <>
              <h2 className="mt-10 font-display text-xl font-semibold text-primary-900">
                Finished
              </h2>
              <div className="mt-4 space-y-3">
                {finished.map((session) => (
                  <Card key={session.id} className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-primary-900">{session.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {formatWhen(session.startsAt)} ·{" "}
                          {session.status === "cancelled"
                            ? "Cancelled"
                            : `${session.attendanceCount ?? 0} attended`}
                        </p>
                      </div>
                      <Link
                        href={`/learn/teach/live/${session.roomName}`}
                        className="text-sm font-semibold text-primary-600 hover:underline"
                      >
                        Register
                      </Link>
                    </div>

                    {session.status === "ended" && (
                      <form action={setRecordingUrlAction} className="mt-3 flex gap-2">
                        <input type="hidden" name="roomName" value={session.roomName ?? ""} />
                        <input
                          name="recordingUrl"
                          type="url"
                          defaultValue={session.recordingUrl ?? ""}
                          placeholder="Link to the recording"
                          className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-400"
                        />
                        <button
                          type="submit"
                          className="rounded-xl border-2 border-primary-600 px-4 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50"
                        >
                          Save
                        </button>
                      </form>
                    )}
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold text-primary-900">
              Schedule a class
            </h2>
            <div className="mt-4">
              <ScheduleClassForm
                courses={courses.map((course) => ({ id: course.id, title: course.title }))}
              />
            </div>
          </Card>

          {isVideoConfigured() && (
            <p className="mt-4 text-xs text-gray-500">
              Classes run on {jitsiDomain}. Students join from inside the portal — they never need
              an account there, and nothing is installed on their phone.
            </p>
          )}
        </aside>
      </div>
    </Container>
  );
}
