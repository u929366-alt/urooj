/**
 * Load the course content in src/data/lms into the database.
 *
 * Safe to run against a live site, and safe to run repeatedly:
 *
 *   - Nothing is ever deleted. Students, enrolments, grades and payments are
 *     not touched, and neither is any course whose slug is not in the content
 *     files.
 *   - A record that already exists is matched by slug (courses, lessons) or by
 *     title within its parent (modules, quizzes, assignments), and updated in
 *     place, so enrolments and progress survive a re-import.
 *   - Lesson bodies and quiz questions are only written when the record is
 *     first created. Once staff have edited a lesson in /admin, a later import
 *     leaves their wording alone — pass --overwrite-content to force it back
 *     to what is in the repository.
 *
 * Usage:
 *   npm run import:courses                    all courses
 *   npm run import:courses -- digital-marketing graphic-design
 *   npm run import:courses -- --overwrite-content
 *   npm run import:courses -- --dry-run
 */
import "dotenv/config";
import { getPayload, type Payload } from "payload";
import {
  convertMarkdownToLexical,
  editorConfigFactory,
} from "@payloadcms/richtext-lexical";
import config from "../payload.config.ts";
import { categoryContent, courseContent } from "../src/data/lms/index.ts";
import type { CourseContent, ModuleContent } from "../src/data/lms/types.ts";
import type { Lesson } from "../src/payload-types.ts";
import { slugify } from "../src/collections/fields/slug.ts";

/** The editor's stored shape, shared by every rich text field here. */
type RichText = NonNullable<Lesson["content"]>;
type ToRichText = (markdown: string) => Promise<RichText>;

const args = process.argv.slice(2);
const overwriteContent = args.includes("--overwrite-content");
const dryRun = args.includes("--dry-run");
const only = args.filter((arg) => !arg.startsWith("--"));

let created = 0;
let updated = 0;
let skipped = 0;

/** The course's instructor, or an admin, so the record is never orphaned. */
async function pickInstructor(payload: Payload): Promise<number | undefined> {
  for (const role of ["instructor", "admin"] as const) {
    const found = await payload.find({
      collection: "users",
      where: { role: { equals: role } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (found.docs[0]) return found.docs[0].id;
  }
  return undefined;
}

async function importModule(
  payload: Payload,
  toRichText: ToRichText,
  courseId: number,
  mod: ModuleContent,
  order: number,
) {
  const existing = await payload.find({
    collection: "modules",
    where: { and: [{ course: { equals: courseId } }, { title: { equals: mod.title } }] },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  const data = { title: mod.title, course: courseId, order, summary: mod.summary };
  let moduleId: number;

  if (existing.docs[0]) {
    moduleId = existing.docs[0].id;
    if (!dryRun) {
      await payload.update({ collection: "modules", id: moduleId, data, overrideAccess: true });
    }
    updated += 1;
  } else {
    if (dryRun) return;
    const doc = await payload.create({ collection: "modules", data, overrideAccess: true });
    moduleId = doc.id;
    created += 1;
  }

  let lastLessonId: number | undefined;

  for (const [index, lesson] of mod.lessons.entries()) {
    const slug = slugify(lesson.title);
    const found = await payload.find({
      collection: "lessons",
      where: { and: [{ course: { equals: courseId } }, { slug: { equals: slug } }] },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });

    // Staff edits win over the repository unless we are told otherwise.
    const writeBody = !found.docs[0] || overwriteContent;
    const base = {
      title: lesson.title,
      slug,
      module: moduleId,
      course: courseId,
      order: index + 1,
      preview: lesson.preview ?? false,
      durationMinutes: lesson.minutes,
      videoUrl: lesson.video?.url,
    };
    const data = writeBody ? { ...base, content: await toRichText(lesson.body) } : base;

    if (found.docs[0]) {
      lastLessonId = found.docs[0].id;
      if (!dryRun) {
        await payload.update({
          collection: "lessons",
          id: lastLessonId,
          data,
          overrideAccess: true,
        });
      }
      updated += 1;
      if (!writeBody) skipped += 1;
    } else if (!dryRun) {
      const doc = await payload.create({ collection: "lessons", data, overrideAccess: true });
      lastLessonId = doc.id;
      created += 1;
    }
  }

  if (mod.quiz && lastLessonId && !dryRun) {
    const found = await payload.find({
      collection: "quizzes",
      where: { and: [{ course: { equals: courseId } }, { title: { equals: mod.quiz.title } }] },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    const data = {
      title: mod.quiz.title,
      course: courseId,
      lesson: lastLessonId,
      description: mod.quiz.description,
      passingScore: mod.quiz.passingScore ?? 60,
      maxAttempts: 0,
      questions: mod.quiz.questions.map((question) => ({
        prompt: question.prompt,
        type: question.type ?? "single",
        options: question.options.map((option) => ({
          text: option.text,
          correct: option.correct ?? false,
        })),
        explanation: question.explanation,
      })),
    };

    if (found.docs[0]) {
      // Rewriting questions would void attempts already marked against them.
      if (overwriteContent) {
        await payload.update({
          collection: "quizzes",
          id: found.docs[0].id,
          data,
          overrideAccess: true,
        });
        updated += 1;
      } else {
        skipped += 1;
      }
    } else {
      await payload.create({ collection: "quizzes", data, overrideAccess: true });
      created += 1;
    }
  }

  if (mod.assignment && lastLessonId && !dryRun) {
    const found = await payload.find({
      collection: "assignments",
      where: {
        and: [{ course: { equals: courseId } }, { title: { equals: mod.assignment.title } }],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    const data = {
      title: mod.assignment.title,
      slug: slugify(`${mod.assignment.title}-${courseId}`),
      course: courseId,
      lesson: lastLessonId,
      instructions: await toRichText(mod.assignment.instructions),
      maxPoints: mod.assignment.maxPoints ?? 100,
      allowFiles: true,
      acceptingSubmissions: true,
    };

    if (found.docs[0]) {
      if (overwriteContent) {
        await payload.update({
          collection: "assignments",
          id: found.docs[0].id,
          data,
          overrideAccess: true,
        });
        updated += 1;
      } else {
        skipped += 1;
      }
    } else {
      await payload.create({ collection: "assignments", data, overrideAccess: true });
      created += 1;
    }
  }
}

async function importCourse(
  payload: Payload,
  toRichText: ToRichText,
  instructor: number | undefined,
  course: CourseContent,
  categoryIds: Map<string, number>,
) {
  const found = await payload.find({
    collection: "courses",
    where: { slug: { equals: course.slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  const data = {
    title: course.title,
    slug: course.slug,
    summary: course.summary,
    description: await toRichText(course.description),
    sector: course.sector,
    courseCode: course.courseCode,
    nvqfLevel: course.nvqfLevel,
    recognition: course.recognition,
    level: course.level,
    language: course.language,
    durationWeeks: course.durationWeeks,
    price: course.price,
    programSlug: course.programSlug,
    prerequisites: course.prerequisites,
    targetLearners: course.targetLearners,
    objectives: course.objectives.map((text) => ({ text })),
    outcomes: course.outcomes.map((text) => ({ text })),
    careers: course.careers.map((text) => ({ text })),
    category: course.categorySlug ? categoryIds.get(course.categorySlug) : undefined,
    skills: (course.skills ?? []).map((text) => ({ text })),
    learningHours: course.learningHours,
    finalProject: course.finalProject,
    assessmentMethod: course.assessmentMethod,
    certificateCriteria: course.certificateCriteria,
    resources: course.resources ?? [],
    curriculumSource: course.curriculumSource,
  };

  let courseId: number;
  if (found.docs[0]) {
    courseId = found.docs[0].id;
    console.log(`  updating "${course.title}"`);
    if (!dryRun) {
      await payload.update({ collection: "courses", id: courseId, data, overrideAccess: true });
    }
    updated += 1;
  } else {
    console.log(`  creating "${course.title}"`);
    if (dryRun) return;
    // New courses start as drafts: staff decide when a course is ready to sell.
    const doc = await payload.create({
      collection: "courses",
      data: { ...data, status: "draft", enrollmentOpen: true, instructor },
      overrideAccess: true,
    });
    courseId = doc.id;
    created += 1;
  }

  for (const [index, mod] of course.modules.entries()) {
    await importModule(payload, toRichText, courseId, mod, index + 1);
  }
}

async function run() {
  const payload = await getPayload({ config });
  const editorConfig = await editorConfigFactory.default({ config: payload.config });
  const toRichText: ToRichText = async (markdown) =>
    convertMarkdownToLexical({ editorConfig, markdown }) as RichText;

  // Categories first: courses point at them.
  const categoryIds = new Map<string, number>();
  for (const category of categoryContent) {
    const found = await payload.find({
      collection: "categories",
      where: { slug: { equals: category.slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    const data = {
      title: category.title,
      slug: category.slug,
      order: category.order,
      summary: category.summary,
      description: await toRichText(category.description),
      icon: category.icon,
    };
    if (found.docs[0]) {
      if (!dryRun) {
        await payload.update({
          collection: "categories",
          id: found.docs[0].id,
          data,
          overrideAccess: true,
        });
      }
      categoryIds.set(category.slug, found.docs[0].id);
      updated += 1;
    } else if (!dryRun) {
      const doc = await payload.create({ collection: "categories", data, overrideAccess: true });
      categoryIds.set(category.slug, doc.id);
      created += 1;
    }
  }

  const instructor = await pickInstructor(payload);
  if (!instructor) {
    console.warn(
      "No admin or instructor account exists yet — courses will be imported without one.\n" +
        "Create your account at /admin, then run this again to attach it.",
    );
  }

  const wanted = only.length
    ? courseContent.filter((course) => only.includes(course.slug))
    : courseContent;

  if (only.length && wanted.length !== only.length) {
    const missing = only.filter((slug) => !courseContent.some((c) => c.slug === slug));
    console.error(`Unknown course slug: ${missing.join(", ")}`);
    process.exit(1);
  }

  console.log(
    `${dryRun ? "Would import" : "Importing"} ${wanted.length} course(s)` +
      `${overwriteContent ? ", overwriting existing lesson and quiz content" : ""}`,
  );

  for (const course of wanted) {
    await importCourse(payload, toRichText, instructor, course, categoryIds);
  }

  console.log(`\nDone. ${created} created, ${updated} updated, ${skipped} left as they were.`);
  if (!dryRun) {
    console.log("New courses are drafts — publish them in /admin when you are ready.");
  }
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
