import { CalendarClock, FileUp, Paperclip } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { submitAssignmentAction } from "@/lib/lms/assessmentActions";
import type { Assignment, Submission, SubmissionFile } from "@/payload-types";

function formatDate(value?: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function AssignmentBlock({
  assignment,
  submission,
  returnTo,
  notice,
}: {
  assignment: Assignment;
  submission: Submission | null;
  returnTo: string;
  notice?: string;
}) {
  const due = formatDate(assignment.dueDate);
  const graded = submission?.status === "graded";
  const files = (submission?.files ?? []).filter(
    (file): file is SubmissionFile => typeof file === "object" && file !== null,
  );

  return (
    <section className="mt-12">
      <h2 className="font-display text-xl font-semibold text-primary-900">
        Assignment: {assignment.title}
      </h2>
      <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
        <span>Worth {assignment.maxPoints} points</span>
        {due && (
          <span className="inline-flex items-center gap-1">
            <CalendarClock className="h-3.5 w-3.5" aria-hidden />
            Due {due}
          </span>
        )}
      </p>

      {notice === "saved" && (
        <p role="status" className="mt-4 rounded-xl bg-accent-50 px-4 py-3 text-sm text-accent-800">
          Your work has been submitted.
        </p>
      )}
      {notice === "empty" && (
        <p role="alert" className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Add some text or attach a file before submitting.
        </p>
      )}
      {notice === "graded" && (
        <p role="alert" className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          This work has already been graded and can no longer be changed.
        </p>
      )}
      {notice === "closed" && (
        <p role="alert" className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          This assignment is no longer accepting submissions.
        </p>
      )}

      {graded && (
        <Card className="mt-4 border-accent-200 bg-accent-50/50 p-6">
          <p className="font-semibold text-accent-800">
            Graded: {submission?.grade ?? 0} / {assignment.maxPoints}
          </p>
          {submission?.feedback && (
            <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{submission.feedback}</p>
          )}
        </Card>
      )}

      <Card className="mt-4 p-6">
        {submission && !graded && (
          <p className="mb-4 rounded-xl bg-gray-50 px-4 py-2.5 text-sm text-gray-600">
            Submitted{submission.submittedAt ? ` on ${formatDate(submission.submittedAt)}` : ""}.
            You can revise it until it is graded.
          </p>
        )}

        {files.length > 0 && (
          <ul className="mb-4 space-y-1.5 text-sm">
            {files.map((file) => (
              <li key={file.id} className="flex items-center gap-2 text-gray-700">
                <Paperclip className="h-4 w-4 text-gray-400" aria-hidden />
                {file.filename}
              </li>
            ))}
          </ul>
        )}

        {graded || !assignment.acceptingSubmissions ? (
          !graded && (
            <p className="text-sm text-gray-600">This assignment is closed for submissions.</p>
          )
        ) : (
          <form action={submitAssignmentAction} className="space-y-4">
            <input type="hidden" name="assignmentId" value={String(assignment.id)} />
            <input type="hidden" name="returnTo" value={returnTo} />

            <div>
              <label htmlFor="text" className="block text-sm font-semibold text-gray-800">
                Your answer
              </label>
              <textarea
                id="text"
                name="text"
                rows={6}
                defaultValue={submission?.text ?? ""}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>

            {assignment.allowFiles && (
              <div>
                <label
                  htmlFor="file"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Attach a file (optional)
                </label>
                <input
                  id="file"
                  name="file"
                  type="file"
                  className="mt-1.5 block w-full text-sm text-gray-600 file:mr-3 file:rounded-full file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-700 hover:file:bg-primary-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Only you and your instructor can open files you upload here.
                </p>
              </div>
            )}

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700"
            >
              <FileUp className="h-4 w-4" aria-hidden />
              {submission ? "Update submission" : "Submit work"}
            </button>
          </form>
        )}
      </Card>
    </section>
  );
}
