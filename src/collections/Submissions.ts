import type { CollectionConfig } from "payload";

/**
 * A student's answer to an assignment, plus the instructor's mark.
 *
 * The grading fields carry their own field-level access so a student cannot
 * write a grade for themselves even though they own the row and need to be
 * able to edit their submission before it is marked.
 */
const staffOnly = ({ req: { user } }: { req: { user?: { role?: string } | null } }) =>
  user?.role === "admin" || user?.role === "instructor";

export const Submissions: CollectionConfig = {
  slug: "submissions",
  admin: {
    useAsTitle: "id",
    defaultColumns: ["student", "assignment", "status", "grade", "submittedAt"],
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
      if (user.role === "admin" || user.role === "instructor") return true;
      // Students may revise their own work; the grade fields stay locked.
      return { student: { equals: user.id } };
    },
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  hooks: {
    beforeValidate: [
      ({ data, req, operation }) => {
        if (!data) return data;
        if (operation === "create") {
          if (req.user?.role === "student") data.student = req.user.id;
          data.submittedAt = data.submittedAt ?? new Date().toISOString();
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
      name: "assignment",
      type: "relationship",
      relationTo: "assignments",
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
    { name: "text", type: "textarea" },
    {
      name: "files",
      type: "relationship",
      relationTo: "submission-files",
      hasMany: true,
    },
    { name: "submittedAt", type: "date", admin: { position: "sidebar" } },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "submitted",
      options: [
        { label: "Submitted", value: "submitted" },
        { label: "Graded", value: "graded" },
        { label: "Returned for revision", value: "returned" },
      ],
      access: { update: staffOnly },
      admin: { position: "sidebar" },
    },
    {
      name: "grade",
      type: "number",
      min: 0,
      access: { update: staffOnly },
      admin: { position: "sidebar", description: "Points awarded." },
    },
    {
      name: "feedback",
      type: "textarea",
      access: { update: staffOnly },
    },
    {
      name: "gradedBy",
      type: "relationship",
      relationTo: "users",
      access: { update: staffOnly },
      admin: { position: "sidebar", readOnly: true },
    },
    {
      name: "gradedAt",
      type: "date",
      access: { update: staffOnly },
      admin: { position: "sidebar", readOnly: true },
    },
  ],
};
