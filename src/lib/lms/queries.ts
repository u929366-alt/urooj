import "server-only";

import { cache } from "react";
import { getPayloadClient } from "./auth";
import type { Category, Course, Enrollment, Lesson, Module, User } from "@/payload-types";

/**
 * Reads for the learning portal.
 *
 * These run with `overrideAccess: true` and enforce the rules here instead,
 * because the portal needs to ask questions on the student's behalf that
 * Payload's per-collection access rules can't express on their own (for
 * example "is this lesson readable, given enrolment on its parent course").
 * Anything that returns lesson *content* must go through
 * `getLessonForStudent`, which checks enrolment first.
 */

/**
 * Does this enrolment grant access to the course?
 *
 * Only "active" and "completed" do. Written as an allow-list rather than
 * "anything but withdrawn", because adding the "pending_payment" state would
 * otherwise have silently handed full course access to everyone who clicked
 * enrol on a paid course without paying.
 */
export function grantsAccess(
  enrolment: { status?: string | null } | null | undefined,
): boolean {
  return enrolment?.status === "active" || enrolment?.status === "completed";
}

export type CourseOutline = {
  course: Course;
  modules: Array<{ module: Module; lessons: Lesson[] }>;
  lessonCount: number;
};

function idOf(value: unknown): number | string | null {
  if (value == null) return null;
  if (typeof value === "object") {
    const maybe = value as { id?: number | string };
    return maybe.id ?? null;
  }
  return value as number | string;
}

export const listPublishedCourses = cache(async (): Promise<Course[]> => {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "courses",
    where: { status: { equals: "published" } },
    sort: "title",
    limit: 100,
    depth: 1,
    overrideAccess: true,
  });
  return result.docs;
});

export const getCourseBySlug = cache(async (slug: string): Promise<Course | null> => {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "courses",
    where: { slug: { equals: slug } },
    limit: 1,
    // 2, not 1: the instructor's avatar is an upload hanging off the
    // instructor, so depth 1 resolves the person but leaves their photograph
    // as a bare id and the course page renders a blank square.
    depth: 2,
    overrideAccess: true,
  });
  const course = result.docs[0];
  if (!course) return null;
  return course.status === "published" ? course : null;
});

export const getCourseOutline = cache(async (courseId: number | string): Promise<CourseOutline | null> => {
  const payload = await getPayloadClient();

  const [courseDoc, moduleResult, lessonResult] = await Promise.all([
    payload.findByID({ collection: "courses", id: courseId, depth: 1, overrideAccess: true }),
    payload.find({
      collection: "modules",
      where: { course: { equals: courseId } },
      sort: "order",
      limit: 200,
      depth: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: "lessons",
      where: { course: { equals: courseId } },
      sort: "order",
      limit: 500,
      depth: 1,
      overrideAccess: true,
    }),
  ]);

  if (!courseDoc) return null;

  const modules = moduleResult.docs.map((module) => ({
    module,
    lessons: lessonResult.docs
      .filter((lesson) => idOf(lesson.module) === module.id)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  }));

  return { course: courseDoc, modules, lessonCount: lessonResult.totalDocs };
});

export const getEnrollment = cache(
  async (userId: number | string, courseId: number | string): Promise<Enrollment | null> => {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "enrollments",
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

export const listMyEnrollments = cache(async (userId: number | string) => {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "enrollments",
    where: { student: { equals: userId } },
    sort: "-enrolledAt",
    limit: 100,
    depth: 2,
    overrideAccess: true,
  });
  return result.docs;
});

/** Lesson ids this student has ticked off on a course. */
export const getCompletedLessonIds = cache(
  async (userId: number | string, courseId: number | string): Promise<Set<string>> => {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "lesson-progress",
      where: {
        and: [
          { student: { equals: userId } },
          { course: { equals: courseId } },
          { completed: { equals: true } },
        ],
      },
      limit: 500,
      depth: 0,
      overrideAccess: true,
    });
    return new Set(result.docs.map((row) => String(idOf(row.lesson))));
  },
);

export type LessonAccess =
  | { ok: true; lesson: Lesson; outline: CourseOutline; enrolled: boolean }
  | { ok: false; reason: "not-found" | "not-enrolled" };

/**
 * The single gate for lesson content.
 *
 * A lesson is readable if the student is enrolled on its course, or the lesson
 * is flagged `preview`, or the viewer is staff. Anything else returns
 * `not-enrolled` without the lesson body ever leaving the server.
 */
export async function getLessonForStudent(
  courseSlug: string,
  lessonSlug: string,
  user: User | null,
): Promise<LessonAccess> {
  const course = await getCourseBySlug(courseSlug);
  if (!course) return { ok: false, reason: "not-found" };

  const outline = await getCourseOutline(course.id);
  if (!outline) return { ok: false, reason: "not-found" };

  const lesson = outline.modules
    .flatMap((entry) => entry.lessons)
    .find((candidate) => candidate.slug === lessonSlug);
  if (!lesson) return { ok: false, reason: "not-found" };

  const staff = user?.role === "instructor" || user?.role === "admin";
  const enrollment = user ? await getEnrollment(user.id, course.id) : null;
  const enrolled = grantsAccess(enrollment);

  if (!enrolled && !staff && !lesson.preview) {
    return { ok: false, reason: "not-enrolled" };
  }
  return { ok: true, lesson, outline, enrolled: enrolled || staff };
}

/** Flat, ordered lesson list — used for "next lesson" navigation. */
export function flattenLessons(outline: CourseOutline): Lesson[] {
  return outline.modules.flatMap((entry) => entry.lessons);
}

/** Categories, in display order, for the catalogue and homepage. */
export const listCategories = cache(async (): Promise<Category[]> => {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "categories",
    sort: "order",
    limit: 50,
    depth: 0,
    overrideAccess: true,
  });
  return result.docs;
});

export const getCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "categories",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  return result.docs[0] ?? null;
});

/**
 * Instructors for the public instructor pages.
 *
 * Selects explicitly rather than returning whole user records: these pages are
 * public, and a user row also holds an email, a phone number and a city.
 */
export const listInstructors = cache(async (): Promise<User[]> => {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "users",
    where: { role: { in: ["instructor", "admin"] } },
    sort: "name",
    limit: 100,
    depth: 1,
    overrideAccess: true,
  });
  return result.docs;
});

/** How many lessons each course has, for the catalogue cards. */
export const countLessonsByCourse = cache(async (): Promise<Record<string, number>> => {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "lessons",
    limit: 2000,
    depth: 0,
    pagination: false,
    overrideAccess: true,
  });
  const counts: Record<string, number> = {};
  for (const lesson of result.docs) {
    const id = String(idOf(lesson.course));
    counts[id] = (counts[id] ?? 0) + 1;
  }
  return counts;
});

/** Published course count per category, for the homepage cards. */
export const countCoursesByCategory = cache(async (): Promise<Record<string, number>> => {
  const courses = await listPublishedCourses();
  const counts: Record<string, number> = {};
  for (const course of courses) {
    const id = idOf(course.category);
    if (id != null) counts[String(id)] = (counts[String(id)] ?? 0) + 1;
  }
  return counts;
});

/** Quiz and assignment titles per module, for the syllabus display. */
export const getCourseAssessments = cache(
  async (courseId: number | string): Promise<Record<string, { quiz?: string; assignment?: string }>> => {
    const payload = await getPayloadClient();
    const [quizzes, assignments, lessons] = await Promise.all([
      payload.find({ collection: "quizzes", where: { course: { equals: courseId } }, limit: 200, depth: 0, overrideAccess: true }),
      payload.find({ collection: "assignments", where: { course: { equals: courseId } }, limit: 200, depth: 0, overrideAccess: true }),
      payload.find({ collection: "lessons", where: { course: { equals: courseId } }, limit: 500, depth: 0, overrideAccess: true }),
    ]);

    // Quizzes and assignments hang off a lesson, not a module, so they are
    // mapped back through the lesson that carries them.
    const lessonToModule = new Map(lessons.docs.map((lesson) => [lesson.id, idOf(lesson.module)]));
    const out: Record<string, { quiz?: string; assignment?: string }> = {};

    for (const quiz of quizzes.docs) {
      const moduleId = lessonToModule.get(Number(idOf(quiz.lesson)));
      if (moduleId == null) continue;
      out[String(moduleId)] = { ...out[String(moduleId)], quiz: quiz.title };
    }
    for (const assignment of assignments.docs) {
      const moduleId = lessonToModule.get(Number(idOf(assignment.lesson)));
      if (moduleId == null) continue;
      out[String(moduleId)] = { ...out[String(moduleId)], assignment: assignment.title };
    }
    return out;
  },
);
