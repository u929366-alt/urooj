import "server-only";

import { randomBytes } from "crypto";
import { cache } from "react";
import { getPayloadClient } from "./auth";
import type { Certificate } from "@/payload-types";

/**
 * Course completion and certificates.
 *
 * A certificate is only ever written by `issueCertificateIfComplete`, which
 * recounts the lessons and the student's progress from the database first.
 * The `certificates` collection refuses creates from every other route, so
 * one cannot be conjured by posting to the API.
 */

function idOf(value: unknown): number | string | null {
  if (value == null) return null;
  if (typeof value === "object") return (value as { id?: number | string }).id ?? null;
  return value as number | string;
}

function makeSerial(): string {
  // Ambiguous characters removed so a serial can be read off a printout.
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(8);
  let body = "";
  for (const byte of bytes) body += alphabet[byte % alphabet.length];
  return `HS-${new Date().getFullYear()}-${body}`;
}

export const getCertificate = cache(
  async (userId: number | string, courseId: number | string): Promise<Certificate | null> => {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "certificates",
      where: {
        and: [{ student: { equals: userId } }, { course: { equals: courseId } }],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    return result.docs[0] ?? null;
  },
);

export const getCertificateBySerial = cache(
  async (serial: string): Promise<Certificate | null> => {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "certificates",
      where: { serial: { equals: serial } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    return result.docs[0] ?? null;
  },
);

export const listMyCertificates = cache(async (userId: number | string) => {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "certificates",
    where: { student: { equals: userId } },
    sort: "-issuedAt",
    limit: 100,
    depth: 0,
    overrideAccess: true,
  });
  return result.docs;
});

/**
 * Called after a lesson is ticked off. If every lesson on the course is now
 * complete, marks the enrolment finished and issues a certificate.
 * Returns the certificate when one was issued or already existed.
 */
export async function issueCertificateIfComplete(
  userId: number | string,
  courseId: number | string,
): Promise<Certificate | null> {
  const payload = await getPayloadClient();

  const [lessons, progress] = await Promise.all([
    payload.count({
      collection: "lessons",
      where: { course: { equals: courseId } },
      overrideAccess: true,
    }),
    payload.count({
      collection: "lesson-progress",
      where: {
        and: [
          { student: { equals: userId } },
          { course: { equals: courseId } },
          { completed: { equals: true } },
        ],
      },
      overrideAccess: true,
    }),
  ]);

  if (lessons.totalDocs === 0 || progress.totalDocs < lessons.totalDocs) return null;

  const existing = await getCertificate(userId, courseId);
  if (existing) return existing;

  const [student, course] = await Promise.all([
    payload.findByID({ collection: "users", id: userId, depth: 0, overrideAccess: true }),
    payload.findByID({ collection: "courses", id: courseId, depth: 0, overrideAccess: true }),
  ]);
  if (!student || !course) return null;

  // Close off the enrolment too.
  const enrolment = await payload.find({
    collection: "enrollments",
    where: { and: [{ student: { equals: userId } }, { course: { equals: courseId } }] },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  if (enrolment.docs[0] && enrolment.docs[0].status !== "completed") {
    await payload.update({
      collection: "enrollments",
      id: enrolment.docs[0].id,
      overrideAccess: true,
      data: { status: "completed", completedAt: new Date().toISOString() },
    });
  }

  // Serials are random; retry on the vanishingly unlikely collision.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await payload.create({
        collection: "certificates",
        overrideAccess: true,
        data: {
          serial: makeSerial(),
          student: student.id,
          course: course.id,
          studentName: student.name,
          courseTitle: course.title,
          issuedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      // Another request may have issued one in the meantime.
      const raced = await getCertificate(userId, courseId);
      if (raced) return raced;
      if (attempt === 4) throw error;
    }
  }
  return null;
}

/** Per-student progress figures for an instructor's course view. */
export async function getCourseRoster(courseId: number | string) {
  const payload = await getPayloadClient();

  const [enrolments, lessonCount, progressRows, attempts, submissions] = await Promise.all([
    payload.find({
      collection: "enrollments",
      where: { course: { equals: courseId } },
      sort: "-enrolledAt",
      limit: 500,
      depth: 1,
      overrideAccess: true,
    }),
    payload.count({
      collection: "lessons",
      where: { course: { equals: courseId } },
      overrideAccess: true,
    }),
    payload.find({
      collection: "lesson-progress",
      where: {
        and: [{ course: { equals: courseId } }, { completed: { equals: true } }],
      },
      limit: 5000,
      depth: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: "quiz-attempts",
      where: { course: { equals: courseId } },
      limit: 5000,
      depth: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: "submissions",
      where: { course: { equals: courseId } },
      limit: 5000,
      depth: 0,
      overrideAccess: true,
    }),
  ]);

  const doneByStudent = new Map<string, number>();
  for (const row of progressRows.docs) {
    const key = String(idOf(row.student));
    doneByStudent.set(key, (doneByStudent.get(key) ?? 0) + 1);
  }

  const bestQuizByStudent = new Map<string, number>();
  for (const attempt of attempts.docs) {
    const key = String(idOf(attempt.student));
    const best = bestQuizByStudent.get(key) ?? 0;
    if (attempt.scorePercent > best) bestQuizByStudent.set(key, attempt.scorePercent);
  }

  const submittedByStudent = new Map<string, number>();
  const gradedByStudent = new Map<string, number>();
  for (const submission of submissions.docs) {
    const key = String(idOf(submission.student));
    submittedByStudent.set(key, (submittedByStudent.get(key) ?? 0) + 1);
    if (submission.status === "graded") {
      gradedByStudent.set(key, (gradedByStudent.get(key) ?? 0) + 1);
    }
  }

  return {
    lessonCount: lessonCount.totalDocs,
    rows: enrolments.docs.map((enrolment) => {
      const key = String(idOf(enrolment.student));
      const done = doneByStudent.get(key) ?? 0;
      return {
        enrolment,
        done,
        percent: lessonCount.totalDocs > 0 ? Math.round((done / lessonCount.totalDocs) * 100) : 0,
        bestQuiz: bestQuizByStudent.get(key) ?? null,
        submitted: submittedByStudent.get(key) ?? 0,
        graded: gradedByStudent.get(key) ?? 0,
      };
    }),
  };
}

/** Courses this staff member is responsible for. */
export async function listTeachingCourses(staff: {
  id: number | string;
  role?: string | null;
}) {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "courses",
    where: staff.role === "admin" ? {} : { instructor: { equals: staff.id } },
    sort: "title",
    limit: 200,
    depth: 0,
    overrideAccess: true,
  });

  return Promise.all(
    result.docs.map(async (course) => {
      const [enrolled, completed] = await Promise.all([
        payload.count({
          collection: "enrollments",
          where: { course: { equals: course.id } },
          overrideAccess: true,
        }),
        payload.count({
          collection: "enrollments",
          where: {
            and: [{ course: { equals: course.id } }, { status: { equals: "completed" } }],
          },
          overrideAccess: true,
        }),
      ]);
      return { course, enrolled: enrolled.totalDocs, completed: completed.totalDocs };
    }),
  );
}
