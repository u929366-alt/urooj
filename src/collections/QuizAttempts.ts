import type { CollectionConfig } from "payload";

/**
 * One recorded sitting of a quiz, written by `submitQuizAction` after the
 * server has marked it. Nothing here is writable from the browser directly:
 * `create` is closed to students so a score cannot be posted in by hand.
 */
export const QuizAttempts: CollectionConfig = {
  slug: "quiz-attempts",
  admin: {
    useAsTitle: "id",
    defaultColumns: ["student", "quiz", "scorePercent", "passed", "submittedAt"],
    group: "Learning",
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === "admin" || user.role === "instructor") return true;
      return { student: { equals: user.id } };
    },
    // Written server-side only, with overrideAccess.
    create: () => false,
    update: () => false,
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    {
      name: "student",
      type: "relationship",
      relationTo: "users",
      required: true,
      index: true,
    },
    {
      name: "quiz",
      type: "relationship",
      relationTo: "quizzes",
      required: true,
      index: true,
    },
    {
      name: "course",
      type: "relationship",
      relationTo: "courses",
      required: true,
      index: true,
    },
    { name: "scorePercent", type: "number", required: true },
    { name: "correctCount", type: "number", required: true },
    { name: "questionCount", type: "number", required: true },
    { name: "passed", type: "checkbox", defaultValue: false },
    { name: "submittedAt", type: "date", required: true },
    {
      name: "responses",
      type: "array",
      admin: { description: "What the student chose, for review." },
      fields: [
        { name: "questionIndex", type: "number", required: true },
        { name: "selected", type: "text", admin: { description: "Chosen option indexes, comma separated." } },
        { name: "correct", type: "checkbox", defaultValue: false },
      ],
    },
  ],
};
