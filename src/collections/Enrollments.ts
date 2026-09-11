import type { CollectionConfig } from "payload";

/**
 * A student's place on a course.
 *
 * One row per student per course; the unique pair is enforced in a hook
 * because Payload has no compound-unique index.
 */
export const Enrollments: CollectionConfig = {
  slug: "enrollments",
  admin: {
    useAsTitle: "id",
    defaultColumns: ["student", "course", "status", "enrolledAt"],
    group: "Learning",
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === "admin" || user.role === "instructor") return true;
      return { student: { equals: user.id } };
    },
    // Students enrol themselves; the hook below pins the row to them.
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === "admin" || user.role === "instructor") return true;
      return { student: { equals: user.id } };
    },
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  hooks: {
    beforeValidate: [
      async ({ data, req, operation, originalDoc }) => {
        if (!data) return data;

        // A student may only ever enrol themselves. Staff can enrol anyone.
        const user = req.user;
        if (operation === "create" && user && user.role === "student") {
          data.student = user.id;
        }
        if (operation === "create") {
          data.enrolledAt = data.enrolledAt ?? new Date().toISOString();
        }

        const studentId = data.student ?? originalDoc?.student;
        const courseId = data.course ?? originalDoc?.course;
        if (operation === "create" && studentId && courseId) {
          const existing = await req.payload.find({
            collection: "enrollments",
            where: {
              and: [
                { student: { equals: studentId } },
                { course: { equals: courseId } },
              ],
            },
            limit: 1,
            depth: 0,
            overrideAccess: true,
          });
          if (existing.totalDocs > 0) {
            throw new Error("This student is already enrolled on this course.");
          }
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
      name: "course",
      type: "relationship",
      relationTo: "courses",
      required: true,
      index: true,
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "active",
      options: [
        { label: "Active", value: "active" },
        { label: "Completed", value: "completed" },
        { label: "Withdrawn", value: "withdrawn" },
      ],
    },
    { name: "enrolledAt", type: "date", admin: { position: "sidebar" } },
    { name: "completedAt", type: "date", admin: { position: "sidebar" } },
  ],
};
