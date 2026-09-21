import type { CourseContent, ModuleContent, QuizContent } from "./types.ts";

/**
 * A compact way to define a course whose lesson text has not been written yet.
 *
 * The three courses written out in full (Digital Marketing, E-Commerce,
 * Graphic Design) each run to hundreds of lines. Writing forty more that way
 * before anyone has seen the catalogue would be a poor use of the effort, so
 * the rest are defined here as a complete syllabus — every module, every
 * lesson title, what each lesson covers, its quiz and its assessment — with
 * lesson bodies generated as a clearly marked outline.
 *
 * What a learner sees on a scaffolded lesson is the objective and the outline,
 * plus a line saying the video and full notes are still being produced. That
 * is honest: it does not pretend to be a finished lesson, and it is enough for
 * staff to record against. Replacing it is ordinary editing in /admin, or
 * filling in the `body` here and re-importing.
 */

export type LessonSpec = {
  title: string;
  minutes: number;
  preview?: boolean;
  /** One sentence: what this lesson is for. */
  objective: string;
  /** The points the lesson covers, in order. */
  covers: string[];
};

export type ModuleSpec = {
  title: string;
  summary: string;
  lessons: LessonSpec[];
  /** Questions for the module quiz. Omit for a module with no quiz. */
  quiz?: QuizContent["questions"];
  /** Practical activity, marked by an instructor. */
  activity?: { title: string; instructions: string; maxPoints?: number };
};

export type CourseSpec = {
  slug: string;
  title: string;
  categorySlug: string;
  summary: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  durationWeeks: number;
  learningHours: number;
  prerequisites: string;
  targetLearners: string;
  objectives: string[];
  outcomes: string[];
  careers: string[];
  skills: string[];
  finalProject: string;
  assessmentMethod?: string;
  certificateCriteria?: string;
  resources?: { label: string; url?: string }[];
  /** Where this syllabus came from. Never shown to learners. */
  curriculumSource: string;
  courseCode?: string;
  modules: ModuleSpec[];
};

const DEFAULT_ASSESSMENT = `
Module quizzes must each be passed at 60% or above. Attempts are unlimited — the quiz is there to check understanding, not to catch you out.

Practical activities are marked by an instructor against the brief given with each one. The final project carries the most weight and is marked on the process as well as the result.
`.trim();

const DEFAULT_CERTIFICATE = `
A Hunarsaaz certificate is issued when every lesson is marked complete, every module quiz is passed, and the final project has been submitted and marked.

The certificate carries a unique ID and can be checked by anyone at /learn/verify. It is issued by Hunarsaaz and states the course and completion date.
`.trim();

function lessonBody(lesson: LessonSpec): string {
  const covers = lesson.covers.map((point) => `- ${point}`).join("\n");
  // No "video coming soon" notice: Hunarsaaz does not want lessons announcing
  // that they are unfinished. Lessons already imported still carry it in the
  // database and it is dropped when rendered — see src/lib/lms/lessonContent.ts.
  return `
## What this lesson is for

${lesson.objective}

## What it covers

${covers}

## What to do with this

Work through the points above using the suggested resources on the course page,
and bring anything you could not follow to the course discussion. Your
instructor reads it.
`.trim();
}

function buildModule(spec: ModuleSpec): ModuleContent {
  return {
    title: spec.title,
    summary: spec.summary,
    lessons: spec.lessons.map((lesson) => ({
      title: lesson.title,
      minutes: lesson.minutes,
      preview: lesson.preview,
      video: { search: `${lesson.title} tutorial` },
      body: lessonBody(lesson),
    })),
    quiz: spec.quiz
      ? {
          title: `${spec.title} — Quiz`,
          description: "Pass mark 60%. Unlimited attempts.",
          passingScore: 60,
          questions: spec.quiz,
        }
      : undefined,
    assignment: spec.activity
      ? {
          title: spec.activity.title,
          instructions: spec.activity.instructions,
          maxPoints: spec.activity.maxPoints ?? 100,
        }
      : undefined,
  };
}

/** Turn a compact spec into a full course record for the importer. */
export function scaffold(spec: CourseSpec): CourseContent {
  return {
    slug: spec.slug,
    title: spec.title,
    categorySlug: spec.categorySlug,
    summary: spec.summary,
    description: spec.description,
    sector: "",
    courseCode: spec.courseCode,
    // Never NAVTTC-aligned by default. A claim about what a certificate is
    // worth has to be made deliberately, against a document someone has read.
    recognition: "hunarsaaz",
    curriculumSource: spec.curriculumSource,
    level: spec.level,
    language: "both",
    durationWeeks: spec.durationWeeks,
    learningHours: spec.learningHours,
    price: 0,
    prerequisites: spec.prerequisites,
    targetLearners: spec.targetLearners,
    objectives: spec.objectives,
    outcomes: spec.outcomes,
    careers: spec.careers,
    skills: spec.skills,
    finalProject: spec.finalProject,
    assessmentMethod: spec.assessmentMethod ?? DEFAULT_ASSESSMENT,
    certificateCriteria: spec.certificateCriteria ?? DEFAULT_CERTIFICATE,
    resources: spec.resources,
    modules: spec.modules.map(buildModule),
  };
}
