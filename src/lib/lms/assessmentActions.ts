"use server";

import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { canGrade, markQuiz } from "./assessment";
import { grantsAccess } from "./queries";
import type { Submission, User } from "@/payload-types";

async function currentUser() {
  const payload = await getPayload({ config });
  const requestHeaders = await nextHeaders();
  const { user } = await payload.auth({ headers: requestHeaders });
  return { payload, user: (user as User | null) ?? null };
}

async function isEnrolled(
  payload: Awaited<ReturnType<typeof getPayload>>,
  userId: number | string,
  courseId: number | string,
) {
  const result = await payload.find({
    collection: "enrollments",
    where: { and: [{ student: { equals: userId } }, { course: { equals: courseId } }] },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  return grantsAccess(result.docs[0]);
}

/**
 * Mark a quiz attempt.
 *
 * The browser sends only which options were chosen. The score is computed here
 * against the stored answers and written with overrideAccess; `quiz-attempts`
 * refuses creates from anyone else, so a score cannot be forged by posting one.
 */
export async function submitQuizAction(formData: FormData) {
  const { payload, user } = await currentUser();
  const returnTo = String(formData.get("returnTo") || "/learn");
  if (!user) redirect(`/learn/login?next=${encodeURIComponent(returnTo)}`);

  const quizId = formData.get("quizId");
  if (!quizId) redirect(returnTo);

  const quiz = await payload.findByID({
    collection: "quizzes",
    id: String(quizId),
    depth: 0,
    overrideAccess: true,
  });
  if (!quiz) redirect(returnTo);

  const courseId =
    typeof quiz.course === "object" && quiz.course ? quiz.course.id : quiz.course;
  if (!courseId || !(await isEnrolled(payload, user.id, courseId))) {
    redirect(returnTo);
  }

  // Attempt cap.
  if (quiz.maxAttempts && quiz.maxAttempts > 0) {
    const taken = await payload.count({
      collection: "quiz-attempts",
      where: { and: [{ student: { equals: user.id } }, { quiz: { equals: quiz.id } }] },
      overrideAccess: true,
    });
    if (taken.totalDocs >= quiz.maxAttempts) redirect(`${returnTo}?quiz=limit`);
  }

  // Collect answers: fields are named q0, q1 … each possibly repeated.
  const selections = new Map<number, Set<number>>();
  (quiz.questions ?? []).forEach((_question, index) => {
    const raw = formData.getAll(`q${index}`);
    const chosen = new Set<number>();
    for (const value of raw) {
      const parsed = Number(value);
      if (Number.isInteger(parsed) && parsed >= 0) chosen.add(parsed);
    }
    selections.set(index, chosen);
  });

  const marked = markQuiz(quiz, selections);

  await payload.create({
    collection: "quiz-attempts",
    overrideAccess: true,
    data: {
      student: user.id,
      quiz: quiz.id,
      course: courseId,
      scorePercent: marked.scorePercent,
      correctCount: marked.correctCount,
      questionCount: marked.questionCount,
      passed: marked.passed,
      submittedAt: new Date().toISOString(),
      responses: marked.responses,
    },
  });

  revalidatePath(returnTo);
  redirect(`${returnTo}?quiz=done`);
}

/** Create or revise a submission. Students cannot touch the grading fields. */
export async function submitAssignmentAction(formData: FormData) {
  const { payload, user } = await currentUser();
  const returnTo = String(formData.get("returnTo") || "/learn");
  if (!user) redirect(`/learn/login?next=${encodeURIComponent(returnTo)}`);

  const assignmentId = formData.get("assignmentId");
  if (!assignmentId) redirect(returnTo);

  const assignment = await payload.findByID({
    collection: "assignments",
    id: String(assignmentId),
    depth: 0,
    overrideAccess: true,
  });
  if (!assignment || !assignment.acceptingSubmissions) redirect(`${returnTo}?work=closed`);

  const courseId =
    typeof assignment.course === "object" && assignment.course
      ? assignment.course.id
      : assignment.course;
  if (!courseId || !(await isEnrolled(payload, user.id, courseId))) redirect(returnTo);

  const text = String(formData.get("text") || "").trim();

  // Optional attachment.
  const fileIds: number[] = [];
  const upload = formData.get("file");
  if (assignment.allowFiles && upload instanceof File && upload.size > 0) {
    const buffer = Buffer.from(await upload.arrayBuffer());
    const created = await payload.create({
      collection: "submission-files",
      overrideAccess: true,
      data: { owner: user.id },
      file: {
        data: buffer,
        name: upload.name,
        mimetype: upload.type,
        size: upload.size,
      },
    });
    fileIds.push(created.id);
  }

  if (!text && fileIds.length === 0) redirect(`${returnTo}?work=empty`);

  const existing = await payload.find({
    collection: "submissions",
    where: {
      and: [{ student: { equals: user.id } }, { assignment: { equals: assignment.id } }],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  const current = existing.docs[0];
  if (current) {
    if (current.status === "graded") redirect(`${returnTo}?work=graded`);
    const keptFiles = (current.files ?? []).map((file) =>
      typeof file === "object" && file ? file.id : (file as number),
    );
    await payload.update({
      collection: "submissions",
      id: current.id,
      overrideAccess: true,
      data: {
        text,
        files: [...keptFiles, ...fileIds],
        submittedAt: new Date().toISOString(),
        status: "submitted",
      },
    });
  } else {
    await payload.create({
      collection: "submissions",
      overrideAccess: true,
      data: {
        student: user.id,
        assignment: assignment.id,
        course: courseId,
        text,
        files: fileIds,
        submittedAt: new Date().toISOString(),
        status: "submitted",
      },
    });
  }

  revalidatePath(returnTo);
  redirect(`${returnTo}?work=saved`);
}

/** Record a grade. Instructors are limited to their own courses. */
export async function gradeSubmissionAction(formData: FormData) {
  const { payload, user } = await currentUser();
  if (!user) redirect("/learn/login");
  if (user.role !== "admin" && user.role !== "instructor") redirect("/learn");

  const submissionId = formData.get("submissionId");
  if (!submissionId) redirect("/learn/teach");

  const submission = (await payload.findByID({
    collection: "submissions",
    id: String(submissionId),
    depth: 1,
    overrideAccess: true,
  })) as Submission | null;
  if (!submission) redirect("/learn/teach");

  if (!(await canGrade(user, submission))) redirect("/learn/teach");

  const assignment =
    typeof submission.assignment === "object" && submission.assignment
      ? submission.assignment
      : null;
  const maxPoints = assignment?.maxPoints ?? 100;

  const rawGrade = Number(formData.get("grade"));
  const grade = Number.isFinite(rawGrade)
    ? Math.min(Math.max(rawGrade, 0), maxPoints)
    : undefined;
  const feedback = String(formData.get("feedback") || "").trim();
  const status = String(formData.get("status") || "graded");

  await payload.update({
    collection: "submissions",
    id: submission.id,
    overrideAccess: true,
    data: {
      grade,
      feedback,
      status: status === "returned" ? "returned" : "graded",
      gradedBy: user.id,
      gradedAt: new Date().toISOString(),
    },
  });

  revalidatePath("/learn/teach");
  redirect("/learn/teach?graded=1");
}
