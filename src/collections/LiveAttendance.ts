import type { CollectionConfig } from "payload";

/**
 * One row per student per live lecture: proof they turned up.
 *
 * Written by the portal when a student opens the lecture room, and updated
 * with how long they stayed when they leave. The leave time is best-effort —
 * a phone that loses signal mid-class never sends one — so treat a missing
 * `leftAt` as "we don't know when they went", not as "they never left".
 *
 * Students may read their own rows and nobody else's: who attended a class is
 * the instructor's business, not the other students'.
 */
export const LiveAttendance: CollectionConfig = {
  slug: "live-attendance",
  admin: {
    useAsTitle: "id",
    defaultColumns: ["session", "student", "joinedAt", "minutesPresent"],
    group: "Live Classes",
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === "admin" || user.role === "instructor") return true;
      return { student: { equals: user.id } };
    },
    // Rows are created by the portal on the student's behalf, with the student
    // pinned to the signed-in user by the hook below.
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === "admin" || user.role === "instructor") return true;
      return { student: { equals: user.id } };
    },
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  defaultSort: "-joinedAt",
  hooks: {
    beforeValidate: [
      ({ data, req, operation }) => {
        if (!data) return data;
        if (operation === "create") {
          if (req.user?.role === "student") data.student = req.user.id;
          data.joinedAt = data.joinedAt ?? new Date().toISOString();
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: "session",
      type: "relationship",
      relationTo: "live-sessions",
      required: true,
      index: true,
    },
    {
      name: "student",
      type: "relationship",
      relationTo: "users",
      required: true,
      index: true,
    },
    { name: "joinedAt", type: "date", required: true },
    {
      name: "leftAt",
      type: "date",
      admin: {
        description:
          "Empty when the student's browser closed without telling us — a dropped connection, a flat battery, a closed laptop.",
      },
    },
    {
      name: "minutesPresent",
      type: "number",
      defaultValue: 0,
      admin: { description: "Counted from the heartbeat the lecture room sends while open." },
    },
  ],
};
