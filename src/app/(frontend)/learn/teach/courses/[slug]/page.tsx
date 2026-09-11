import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { requireStaff } from "@/lib/lms/auth";
import { getCourseBySlug } from "@/lib/lms/queries";
import { getCourseRoster } from "@/lib/lms/completion";
import type { User } from "@/payload-types";

export const metadata: Metadata = {
  title: "Course students",
  robots: { index: false, follow: false },
};

function idOf(value: unknown): number | string | null {
  if (value == null) return null;
  if (typeof value === "object") return (value as { id?: number | string }).id ?? null;
  return value as number | string;
}

export default async function CourseRosterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const staff = await requireStaff(`/learn/teach/courses/${slug}`);
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  // An instructor may only inspect their own course.
  if (staff.role === "instructor" && String(idOf(course.instructor)) !== String(staff.id)) {
    redirect("/learn/teach/courses");
  }

  const { rows, lessonCount } = await getCourseRoster(course.id);

  return (
    <Container className="py-12">
      <Link
        href="/learn/teach/courses"
        className="text-sm font-semibold text-primary-600 hover:underline"
      >
        ← My courses
      </Link>
      <h1 className="mt-3 font-display text-3xl font-bold text-primary-900">{course.title}</h1>
      <p className="mt-2 text-gray-600">
        {rows.length} {rows.length === 1 ? "student" : "students"} · {lessonCount} lessons
      </p>

      {rows.length === 0 ? (
        <Card className="mt-8 p-8 text-center text-gray-600">
          Nobody has enrolled on this course yet.
        </Card>
      ) : (
        <Card className="mt-8 overflow-x-auto p-0">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50/70 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Progress</th>
                <th className="px-5 py-3">Best quiz</th>
                <th className="px-5 py-3">Submitted</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map(({ enrolment, done, percent, bestQuiz, submitted, graded }) => {
                const student = enrolment.student as User | null;
                return (
                  <tr key={enrolment.id}>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-gray-900">{student?.name ?? "—"}</p>
                      <p className="text-xs text-gray-500">{student?.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-accent-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">
                          {done}/{lessonCount}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-800">
                      {bestQuiz === null ? "—" : `${bestQuiz}%`}
                    </td>
                    <td className="px-5 py-3 text-gray-800">
                      {submitted === 0 ? "—" : `${graded}/${submitted} graded`}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          enrolment.status === "completed"
                            ? "rounded-full bg-accent-50 px-2.5 py-1 text-xs font-semibold text-accent-700"
                            : "rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600"
                        }
                      >
                        {enrolment.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </Container>
  );
}
