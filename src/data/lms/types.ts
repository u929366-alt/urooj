/**
 * Course content as plain data, kept in the repository rather than typed into
 * the admin panel.
 *
 * A whole syllabus is hundreds of records. Authoring it here means it can be
 * reviewed in a diff, corrected in bulk, and re-imported onto a fresh server,
 * none of which is true of content that only exists in the database. Staff can
 * still edit anything afterwards in /admin — the importer never overwrites a
 * lesson body that already exists.
 *
 * Run `npm run import:courses` to load these into the database.
 */

export type VideoRef = {
  /**
   * The lesson's video.
   *
   * Every URL here was taken from a real search result, never composed by
   * hand — but none has been played, because youtube.com is not reachable from
   * the environment these courses were written in. Treat a filled-in url as a
   * candidate that still needs one person to open it and confirm it plays,
   * teaches this lesson, and is not blocked from embedding.
   */
  url?: string;
  /** The video's title as the search returned it, so a wrong one is obvious. */
  title?: string;
  /** What to search for, where no url is set yet. */
  search: string;
};

export type LessonContent = {
  title: string;
  /** Rough study time, used for the course length shown to students. */
  minutes: number;
  /** Readable without enrolling. Use it for the first lesson or two. */
  preview?: boolean;
  video?: VideoRef;
  /**
   * Markdown, converted to the editor's format on import.
   *
   * Headings, lists, bold, links, quotes and code all work. **Tables do not** —
   * the editor has no table node, so a markdown table arrives as a row of
   * literal pipe characters on the page. Use a list instead.
   *
   * These bodies are template literals, so a backtick for inline code has to
   * be escaped. Plain prose is usually the better choice anyway.
   */
  body: string;
};

export type QuizQuestion = {
  prompt: string;
  type?: "single" | "multiple";
  options: { text: string; correct?: boolean }[];
  explanation?: string;
};

export type QuizContent = {
  title: string;
  description?: string;
  passingScore?: number;
  questions: QuizQuestion[];
};

export type AssignmentContent = {
  title: string;
  /** Markdown. */
  instructions: string;
  maxPoints?: number;
};

export type ModuleContent = {
  title: string;
  summary: string;
  lessons: LessonContent[];
  /** Sits at the end of the module's last lesson. */
  quiz?: QuizContent;
  assignment?: AssignmentContent;
};

export type CategoryContent = {
  slug: string;
  title: string;
  order: number;
  summary: string;
  description: string;
  icon:
    | "monitor"
    | "sparkles"
    | "laptop"
    | "message"
    | "compass"
    | "trending"
    | "heart"
    | "battery"
    | "shield"
    | "book";
};

export type CourseContent = {
  slug: string;
  title: string;
  /** Slug of the category this belongs to. */
  categorySlug?: string;
  /** One or two sentences for the course card. Max 300 characters. */
  summary: string;
  /** Markdown, shown on the course page. */
  description: string;

  sector: string;
  courseCode?: string;
  nvqfLevel?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
  /**
   * Never set "navttc_recognised" for a course NAVTTC has not actually
   * accredited — a student reads it as what their certificate is worth.
   */
  recognition: "navttc_recognised" | "navttc_aligned" | "hunarsaaz";

  level: "beginner" | "intermediate" | "advanced";
  language: "urdu" | "english" | "both";
  durationWeeks: number;
  /** Rupees. 0 enrols a student immediately, with no payment step. */
  price: number;
  /** Slug of the matching programme in src/data/programs.ts, if there is one. */
  programSlug?: string;

  prerequisites: string;
  targetLearners: string;
  objectives: string[];
  outcomes: string[];
  careers: string[];
  /** Short skill names, shown as tags. */
  skills?: string[];
  /** Estimated total study hours, separate from durationWeeks. */
  learningHours?: number;
  finalProject?: string;
  assessmentMethod?: string;
  certificateCriteria?: string;
  resources?: { label: string; url?: string }[];
  /**
   * Internal note on where the syllabus came from, never shown to learners.
   * Required, because `recognition` is a claim about a learner's certificate
   * and it should never be possible to find one without the other.
   */
  curriculumSource: string;

  modules: ModuleContent[];
};
