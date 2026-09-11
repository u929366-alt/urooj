import type { CollectionConfig } from "payload";

/**
 * One row per student per lesson, written when they mark a lesson complete.
 *
 * `course` is denormalised so a course's progress can be counted in a single
 * query instead of fanning out over its lessons.
 */
export const LessonProgress: CollectionConfig = {
  slug: "lesson-progress",
  admin: {
    useAsTitle: "id",
    defaultColumns: ["student", "lesson", "completed", "completedAt"],
    group: "Learning",
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === "admin" || user.role === "instructor") return true;
      return { student: { equals: user.id } };
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === "admin") return true;
      return { student: { equals: user.id } };
    },
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  hooks: {
    beforeValidate: [
      ({ data, req, operation }) => {
        if (!data) return data;
        const user = req.user;
        // Students can only ever write progress rows for themselves.
        if (operation === "create" && user && user.role === "student") {
          data.student = user.id;
        }
        if (data.completed && !data.completedAt) {
          data.completedAt = new Date().toISOString();
        }
        if (data.completed === false) {
          data.completedAt = null;
        }
        return data;
      },
    ],
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
      name: "lesson",
      type: "relationship",
      relationTo: "lessons",
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
    { name: "completed", type: "checkbox", defaultValue: false },
    { name: "completedAt", type: "date" },
  ],
};
