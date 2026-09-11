import type { CollectionConfig } from "payload";

/**
 * Everyone who can sign in: students, instructors and staff.
 *
 * Payload provides the auth itself (hashed passwords, login, password reset,
 * the session cookie). `role` is what the rest of the LMS gates on.
 */
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role"],
    group: "People",
  },
  access: {
    // Anyone may register — but only ever as a student; see the hook below.
    create: () => true,
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === "admin" || user.role === "instructor") return true;
      // Students can only read their own record.
      return { id: { equals: user.id } };
    },
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === "admin") return true;
      return { id: { equals: user.id } };
    },
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        if (!data || operation !== "create") return data;

        // The very first account to exist has to be an admin, otherwise the
        // admin-only `role` field below would lock everyone out permanently.
        const { totalDocs } = await req.payload.count({
          collection: "users",
          overrideAccess: true,
        });
        if (totalDocs === 0) {
          data.role = "admin";
          return data;
        }

        // After that, anyone who is not an admin — including self-service
        // registration, where there is no req.user at all — gets "student"
        // regardless of what was posted.
        if (req.user?.role !== "admin") {
          data.role = "student";
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "student",
      options: [
        { label: "Student", value: "student" },
        { label: "Instructor", value: "instructor" },
        { label: "Admin", value: "admin" },
      ],
      access: {
        // Only an admin may set or change a role. Without this, a self-service
        // registration could POST role: "admin" and escalate itself.
        create: ({ req: { user } }) => user?.role === "admin",
        update: ({ req: { user } }) => user?.role === "admin",
      },
      admin: {
        description: "Only admins can change this.",
      },
    },
    {
      name: "phone",
      type: "text",
    },
    {
      name: "city",
      type: "text",
    },
    {
      name: "bio",
      type: "textarea",
      admin: {
        description: "Shown on instructor profiles.",
      },
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
    },
  ],
};
