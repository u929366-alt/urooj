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
