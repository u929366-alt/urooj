import type { Metadata } from "next";
import { ClipboardCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { requireStaff } from "@/lib/lms/auth";
import { listSubmissionsToGrade } from "@/lib/lms/assessment";
import { gradeSubmissionAction } from "@/lib/lms/assessmentActions";
import type { Assignment, Course, SubmissionFile, User } from "@/payload-types";

export const metadata: Metadata = {
  title: "Grading",
  robots: { index: false, follow: false },
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function TeachPage({
  searchParams,
}: {
  searchParams: Promise<{ graded?: string }>;
}) {
  const staff = await requireStaff("/learn/teach");
  const { graded } = await searchParams;
  const submissions = await listSubmissionsToGrade(staff);

  const pending = submissions.filter((submission) => submission.status !== "graded");
  const done = submissions.filter((submission) => submission.status === "graded");

  return (
    <Container className="py-12">
      <h1 className="font-display text-3xl font-bold text-primary-900">Grading</h1>
      <p className="mt-2 text-gray-600">
        {staff.role === "instructor"
          ? "Submissions from students on the courses you teach."
          : "Submissions from across every course."}
      </p>

      {graded && (
        <p role="status" className="mt-6 rounded-xl bg-accent-50 px-4 py-3 text-sm text-accent-800">
          Grade saved.
        </p>
      )}

      <h2 className="mt-10 font-display text-xl font-semibold text-primary-900">
        Awaiting grading ({pending.length})
      </h2>

      {pending.length === 0 ? (
        <Card className="mt-4 p-8 text-center text-gray-600">
          <ClipboardCheck className="mx-auto h-9 w-9 text-primary-300" aria-hidden />
          <p className="mt-3">Nothing waiting to be graded.</p>
        </Card>
      ) : (
        <div className="mt-4 space-y-4">
          {pending.map((submission) => {
            const assignment = submission.assignment as Assignment;
            const student = submission.student as User;
            const course = submission.course as Course;
            const files = (submission.files ?? []).filter(
              (file): file is SubmissionFile => typeof file === "object" && file !== null,
            );
            return (
              <Card key={submission.id} className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-primary-900">
                      {assignment?.title ?? "Assignment"}
                    </h3>
                    <p className="mt-0.5 text-sm text-gray-600">
                      {student?.name ?? "Student"} · {course?.title ?? "Course"} · submitted{" "}
                      {formatDate(submission.submittedAt)}
                    </p>
                  </div>
                  <Badge tone={submission.status === "returned" ? "secondary" : "neutral"}>
                    {submission.status}
                  </Badge>
                </div>

                {submission.text && (
                  <div className="mt-4 whitespace-pre-wrap rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-800">
                    {submission.text}
                  </div>
                )}

                {files.length > 0 && (
                  <ul className="mt-3 space-y-1 text-sm">
                    {files.map((file) => (
                      <li key={file.id}>
                        <a
                          href={file.url ?? "#"}
                          className="font-semibold text-primary-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {file.filename}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}

                <form
                  action={gradeSubmissionAction}
                  className="mt-5 grid grid-cols-1 gap-3 border-t border-gray-100 pt-5 sm:grid-cols-[120px_1fr_auto] sm:items-end"
                >
                  <input type="hidden" name="submissionId" value={String(submission.id)} />
                  <div>
                    <label
                      htmlFor={`grade-${submission.id}`}
                      className="block text-sm font-semibold text-gray-800"
                    >
                      Grade / {assignment?.maxPoints ?? 100}
                    </label>
                    <input
                      id={`grade-${submission.id}`}
                      name="grade"
                      type="number"
                      min={0}
                      max={assignment?.maxPoints ?? 100}
                      defaultValue={submission.grade ?? ""}
                      required
                      className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`feedback-${submission.id}`}
                      className="block text-sm font-semibold text-gray-800"
                    >
                      Feedback
                    </label>
                    <input
                      id={`feedback-${submission.id}`}
                      name="feedback"
                      defaultValue={submission.feedback ?? ""}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      name="status"
                      value="graded"
                      className="rounded-full bg-primary-600 px-5 py-2.5 font-semibold text-white hover:bg-primary-700"
                    >
                      Save grade
                    </button>
                    <button
                      type="submit"
                      name="status"
                      value="returned"
                      className="rounded-full border-2 border-primary-600 px-5 py-2.5 font-semibold text-primary-600 hover:bg-primary-50"
                    >
                      Return
                    </button>
                  </div>
                </form>
              </Card>
            );
          })}
        </div>
      )}

      {done.length > 0 && (
        <>
          <h2 className="mt-12 font-display text-xl font-semibold text-primary-900">
            Graded ({done.length})
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="py-2 pr-4">Student</th>
                  <th className="py-2 pr-4">Assignment</th>
                  <th className="py-2 pr-4">Grade</th>
                  <th className="py-2">Graded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {done.map((submission) => {
                  const assignment = submission.assignment as Assignment;
                  const student = submission.student as User;
                  return (
                    <tr key={submission.id}>
                      <td className="py-2.5 pr-4 text-gray-800">{student?.name ?? "—"}</td>
                      <td className="py-2.5 pr-4 text-gray-600">{assignment?.title ?? "—"}</td>
                      <td className="py-2.5 pr-4 font-semibold text-gray-900">
                        {submission.grade ?? "—"} / {assignment?.maxPoints ?? 100}
                      </td>
                      <td className="py-2.5 text-gray-500">{formatDate(submission.gradedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Container>
  );
}
