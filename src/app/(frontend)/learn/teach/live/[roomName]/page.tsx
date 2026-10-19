import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { requireStaff } from "@/lib/lms/auth";
import { getSessionByRoom, listAttendance } from "@/lib/lms/queries";
import { formatWhen } from "@/lib/lms/time";
import type { Course, User } from "@/payload-types";

export const metadata: Metadata = {
  title: "Class register",
  robots: { index: false, follow: false },
};

type Params = { params: Promise<{ roomName: string }> };

export default async function RegisterPage({ params }: Params) {
  await requireStaff("/learn/teach/live");
  const { roomName } = await params;

  const session = await getSessionByRoom(roomName);
  if (!session) notFound();

  const rows = await listAttendance(session.id);
  const course = typeof session.course === "object" ? (session.course as Course | null) : null;

  return (
    <Container className="py-12">
      <Link
        href="/learn/teach/live"
        className="text-sm font-semibold text-primary-600 hover:underline"
      >
        ← My live classes
      </Link>

      <h1 className="mt-4 font-display text-2xl font-bold text-primary-900">{session.title}</h1>
      <p className="mt-1 text-gray-600">
        {formatWhen(session.startsAt)}
        {course ? ` · ${course.title}` : ""}
      </p>

      <Card className="mt-8 overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="font-semibold text-primary-900">
            Who attended{rows.length > 0 ? ` — ${rows.length}` : ""}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Recorded when each student entered the room. A blank &ldquo;left&rdquo; means their
            browser closed without telling us, not that they stayed to the end.
          </p>
        </div>

        {rows.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-600">
            Nobody has joined this class.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Student</th>
                  <th className="px-6 py-3 font-semibold">Joined</th>
                  <th className="px-6 py-3 font-semibold">Left</th>
                  <th className="px-6 py-3 font-semibold">Minutes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => {
                  const student =
                    typeof row.student === "object" ? (row.student as User | null) : null;
                  return (
                    <tr key={row.id}>
                      <td className="px-6 py-3 font-medium text-gray-800">
                        {student?.name ?? "Unknown"}
                      </td>
                      <td className="px-6 py-3 text-gray-600">{formatWhen(row.joinedAt)}</td>
                      <td className="px-6 py-3 text-gray-600">
                        {row.leftAt ? formatWhen(row.leftAt) : "—"}
                      </td>
                      <td className="px-6 py-3 text-gray-600">{row.minutesPresent ?? 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </Container>
  );
}
