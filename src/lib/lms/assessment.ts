import "server-only";

import { cache } from "react";
import { getPayloadClient } from "./auth";
import type { Assignment, Quiz, QuizAttempt, Submission, User } from "@/payload-types";

/**
 * Reads and marking for quizzes and assignments.
 *
 * `getQuizForStudent` is the only shape of a quiz that may reach a browser:
 * it removes the `correct` flag from every option. The portal queries with
 * overrideAccess, which bypasses Payload's field-level rules, so stripping
 * here is what actually protects the answers.
 */

export type StudentQuizOption = { text: string };
export type StudentQuizQuestion = {
  prompt: string;
  type: "single" | "multiple";
  options: StudentQuizOption[];
};
export type StudentQuiz = {
  id: number | string;
  title: string;
  description?: string | null;
  passingScore: number;
  maxAttempts: number;
  questions: StudentQuizQuestion[];
};

function idOf(value: unknown): number | string | null {
  if (value == null) return null;
  if (typeof value === "object") return (value as { id?: number | string }).id ?? null;
  return value as number | string;
}

/** Strip everything a student must not see. */
export function toStudentQuiz(quiz: Quiz): StudentQuiz {
  return {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    passingScore: quiz.passingScore,
    maxAttempts: quiz.maxAttempts,
    questions: (quiz.questions ?? []).map((question) => ({
      prompt: question.prompt,
      type: (question.type ?? "single") as "single" | "multiple",
      // Note: no `correct`, and no `explanation` until after submission.
      options: (question.options ?? []).map((option) => ({ text: option.text })),
    })),
  };
}

export const getQuizForLesson = cache(async (lessonId: number | string): Promise<Quiz | null> => {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "quizzes",
    where: { lesson: { equals: lessonId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  return result.docs[0] ?? null;
});

export const getAttemptsForQuiz = cache(
  async (userId: number | string, quizId: number | string): Promise<QuizAttempt[]> => {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "quiz-attempts",
      where: {
        and: [{ student: { equals: userId } }, { quiz: { equals: quizId } }],
      },
      sort: "-submittedAt",
      limit: 50,
      depth: 0,
      overrideAccess: true,
    });
    return result.docs;
  },
);

export type MarkedQuiz = {
  correctCount: number;
  questionCount: number;
  scorePercent: number;
  passed: boolean;
  responses: Array<{ questionIndex: number; selected: string; correct: boolean }>;
};

/**
 * Mark a set of answers against the stored quiz.
 *
 * `selections` maps a question index to the option indexes the student chose.
 * A "multiple" question is correct only on an exact match of the correct set,
 * so partial guesses score nothing.
 */
export function markQuiz(quiz: Quiz, selections: Map<number, Set<number>>): MarkedQuiz {
  const questions = quiz.questions ?? [];
  const responses: MarkedQuiz["responses"] = [];
  let correctCount = 0;

  questions.forEach((question, index) => {
    const chosen = selections.get(index) ?? new Set<number>();
    const correctSet = new Set<number>();
    (question.options ?? []).forEach((option, optionIndex) => {
      if (option.correct) correctSet.add(optionIndex);
    });

    const isCorrect =
      correctSet.size > 0 &&
      chosen.size === correctSet.size &&
      [...chosen].every((value) => correctSet.has(value));

    if (isCorrect) correctCount += 1;
    responses.push({
      questionIndex: index,
      selected: [...chosen].sort((a, b) => a - b).join(","),
      correct: isCorrect,
    });
  });

  const questionCount = questions.length;
  const scorePercent = questionCount > 0 ? Math.round((correctCount / questionCount) * 100) : 0;

  return {
    correctCount,
    questionCount,
    scorePercent,
    passed: scorePercent >= (quiz.passingScore ?? 0),
    responses,
  };
}

export const getAssignmentsForLesson = cache(
  async (lessonId: number | string): Promise<Assignment[]> => {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "assignments",
      where: { lesson: { equals: lessonId } },
      sort: "createdAt",
      limit: 20,
      depth: 0,
      overrideAccess: true,
    });
    return result.docs;
  },
);

export const getMySubmission = cache(
  async (userId: number | string, assignmentId: number | string): Promise<Submission | null> => {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "submissions",
      where: {
        and: [{ student: { equals: userId } }, { assignment: { equals: assignmentId } }],
      },
      limit: 1,
      depth: 1,
      overrideAccess: true,
    });
    return result.docs[0] ?? null;
  },
);

/** Submissions an instructor is allowed to grade: their own courses only. */
export async function listSubmissionsToGrade(staff: User) {
  const payload = await getPayloadClient();

  let courseIds: Array<number | string> | null = null;
  if (staff.role === "instructor") {
    const courses = await payload.find({
      collection: "courses",
      where: { instructor: { equals: staff.id } },
      limit: 200,
      depth: 0,
      overrideAccess: true,
    });
    courseIds = courses.docs.map((course) => course.id);
    if (courseIds.length === 0) return [];
  }

  const result = await payload.find({
    collection: "submissions",
    where: courseIds ? { course: { in: courseIds } } : {},
    sort: "-submittedAt",
    limit: 100,
    depth: 2,
    overrideAccess: true,
  });
  return result.docs;
}

/** Whether this staff member may act on a given submission. */
export async function canGrade(staff: User, submission: Submission): Promise<boolean> {
  if (staff.role === "admin") return true;
  if (staff.role !== "instructor") return false;

  const payload = await getPayloadClient();
  const courseId = idOf(submission.course);
  if (!courseId) return false;
  const course = await payload.findByID({
    collection: "courses",
    id: courseId,
    depth: 0,
    overrideAccess: true,
  });
  return idOf(course?.instructor) === staff.id;
}
