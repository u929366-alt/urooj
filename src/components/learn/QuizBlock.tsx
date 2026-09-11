import { CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { submitQuizAction } from "@/lib/lms/assessmentActions";
import type { StudentQuiz } from "@/lib/lms/assessment";
import type { QuizAttempt } from "@/payload-types";

/**
 * Quiz form. Receives only a `StudentQuiz`, which has had the correct answers
 * stripped — this component is never given the real quiz document.
 */
export function QuizBlock({
  quiz,
  attempts,
  returnTo,
  notice,
}: {
  quiz: StudentQuiz;
  attempts: QuizAttempt[];
  returnTo: string;
  notice?: string;
}) {
  const best = attempts.reduce<QuizAttempt | null>(
    (top, attempt) => (!top || attempt.scorePercent > top.scorePercent ? attempt : top),
    null,
  );
  const outOfAttempts = quiz.maxAttempts > 0 && attempts.length >= quiz.maxAttempts;

  return (
    <section className="mt-12">
      <h2 className="font-display text-xl font-semibold text-primary-900">{quiz.title}</h2>
      {quiz.description && <p className="mt-1 text-sm text-gray-600">{quiz.description}</p>}
      <p className="mt-1 text-xs text-gray-500">
        Pass mark {quiz.passingScore}%.{" "}
        {quiz.maxAttempts > 0
          ? `Attempt ${Math.min(attempts.length + 1, quiz.maxAttempts)} of ${quiz.maxAttempts}.`
          : "Unlimited attempts."}
      </p>

      {notice === "limit" && (
        <p role="alert" className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You have used all your attempts for this quiz.
        </p>
      )}

      {best && (
        <div
          className={
            best.passed
              ? "mt-4 flex items-center gap-2 rounded-xl bg-accent-50 px-4 py-3 text-sm text-accent-800"
              : "mt-4 flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800"
          }
        >
          {best.passed ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden />
          ) : (
            <XCircle className="h-5 w-5 shrink-0" aria-hidden />
          )}
          <span>
            Best score <strong>{best.scorePercent}%</strong> ({best.correctCount} of{" "}
            {best.questionCount} correct) — {best.passed ? "passed" : "not yet passed"}.
          </span>
        </div>
      )}

      {!outOfAttempts && (
        <Card className="mt-4 p-6">
          <form action={submitQuizAction} className="space-y-6">
            <input type="hidden" name="quizId" value={String(quiz.id)} />
            <input type="hidden" name="returnTo" value={returnTo} />

            {quiz.questions.map((question, index) => (
              <fieldset key={index} className="border-0 p-0">
                <legend className="font-semibold text-gray-900">
                  {index + 1}. {question.prompt}
                </legend>
                {question.type === "multiple" && (
                  <p className="mt-0.5 text-xs text-gray-500">Select all that apply.</p>
                )}
                <div className="mt-3 space-y-2">
                  {question.options.map((option, optionIndex) => {
                    const id = `q${index}-o${optionIndex}`;
                    return (
                      <label
                        key={optionIndex}
                        htmlFor={id}
                        className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50"
                      >
                        <input
                          id={id}
                          type={question.type === "multiple" ? "checkbox" : "radio"}
                          name={`q${index}`}
                          value={optionIndex}
                          className="mt-0.5 h-4 w-4 accent-primary-600"
                        />
                        <span>{option.text}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            <button
              type="submit"
              className="rounded-full bg-primary-600 px-6 py-3 font-semibold text-white hover:bg-primary-700"
            >
              {attempts.length > 0 ? "Try again" : "Submit answers"}
            </button>
          </form>
        </Card>
      )}
    </section>
  );
}
