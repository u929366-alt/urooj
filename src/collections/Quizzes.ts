import type { CollectionConfig } from "payload";

/**
 * A short knowledge check attached to a lesson.
 *
 * Marking happens on the server in `submitQuizAction`. The `correct` flag on
 * each option carries field-level read access so Payload strips it from any
 * API response a student sees, and `getQuizForStudent()` strips it again for
 * the portal, which queries with overrideAccess and would otherwise bypass
 * that rule. Two layers on purpose: leaking this field hands over the answers.
 */
export const Quizzes: CollectionConfig = {
  slug: "quizzes",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "course", "lesson"],
    group: "Learning",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) =>
      user?.role === "admin" || user?.role === "instructor",
    update: ({ req: { user } }) =>
      user?.role === "admin" || user?.role === "instructor",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "course",
      type: "relationship",
      relationTo: "courses",
      required: true,
      index: true,
    },
    {
      name: "lesson",
      type: "relationship",
      relationTo: "lessons",
      index: true,
      admin: {
        description: "The lesson this quiz appears at the end of.",
      },
    },
    { name: "description", type: "textarea" },
    {
      name: "passingScore",
      type: "number",
      required: true,
      defaultValue: 60,
      min: 0,
      max: 100,
      admin: { position: "sidebar", description: "Percentage needed to pass." },
    },
    {
      name: "maxAttempts",
      type: "number",
      required: true,
      defaultValue: 0,
      min: 0,
      admin: { position: "sidebar", description: "0 means unlimited attempts." },
    },
    {
      name: "questions",
      type: "array",
      minRows: 1,
      labels: { singular: "Question", plural: "Questions" },
      fields: [
        { name: "prompt", type: "textarea", required: true },
        {
          name: "type",
          type: "select",
          required: true,
          defaultValue: "single",
          options: [
            { label: "One correct answer", value: "single" },
            { label: "Several correct answers", value: "multiple" },
          ],
        },
        {
          name: "options",
          type: "array",
          minRows: 2,
          labels: { singular: "Option", plural: "Options" },
          fields: [
            { name: "text", type: "text", required: true },
            {
              name: "correct",
              type: "checkbox",
              defaultValue: false,
              access: {
                // Students must never receive this.
                read: ({ req: { user } }) =>
                  user?.role === "admin" || user?.role === "instructor",
              },
            },
          ],
        },
        {
          name: "explanation",
          type: "textarea",
          admin: { description: "Shown after the student submits." },
        },
      ],
    },
  ],
};
