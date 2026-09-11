import type { CollectionConfig, Where } from "payload";

/**
 * A question or discussion thread on a course.
 *
 * Read access is scoped by enrolment: the rule below looks up which courses
 * the requester is enrolled on and limits the query to those. Without it any
 * signed-in user could read every course's discussions through the REST API,
 * even courses they never joined.
 */
async function enrolledCourseFilter(req: {
  user?: { id: number | string; role?: string } | null;
  payload: { find: (args: Record<string, unknown>) => Promise<{ docs: Array<{ course: unknown }> }> };
}): Promise<boolean | Where> {
  const user = req.user;
  if (!user) return false;
  if (user.role === "admin" || user.role === "instructor") return true;

  const enrolments = await req.payload.find({
    collection: "enrollments",
    where: { student: { equals: user.id } },
    limit: 200,
    depth: 0,
    overrideAccess: true,
  });

  const courseIds = enrolments.docs
    .map((row) =>
      typeof row.course === "object" && row.course
        ? (row.course as { id: number | string }).id
        : (row.course as number | string),
    )
    .filter((value): value is number | string => value != null);

  if (courseIds.length === 0) return false;
  return { course: { in: courseIds } };
}

export const Discussions: CollectionConfig = {
  slug: "discussions",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "course", "author", "createdAt"],
    group: "Learning",
  },
  access: {
    read: ({ req }) => enrolledCourseFilter(req as never),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === "admin" || user.role === "instructor") return true;
      return { author: { equals: user.id } };
    },
    delete: ({ req: { user } }) =>
      user?.role === "admin" || user?.role === "instructor",
  },
  hooks: {
    beforeValidate: [
      ({ data, req, operation }) => {
        if (data && operation === "create" && req.user) {
          data.author = req.user.id;
        }
        return data;
      },
    ],
  },
  fields: [
    { name: "title", type: "text", required: true, maxLength: 160 },
    { name: "body", type: "textarea", required: true },
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
      admin: { description: "Optional: ties the thread to one lesson." },
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      required: true,
      index: true,
      admin: { readOnly: true },
    },
    {
      name: "pinned",
      type: "checkbox",
      defaultValue: false,
      access: {
        update: ({ req: { user } }) =>
          user?.role === "admin" || user?.role === "instructor",
      },
      admin: { position: "sidebar" },
    },
    {
      name: "locked",
      type: "checkbox",
      defaultValue: false,
      access: {
        update: ({ req: { user } }) =>
          user?.role === "admin" || user?.role === "instructor",
      },
      admin: { position: "sidebar", description: "Stops new replies." },
    },
  ],
};

export const DiscussionReplies: CollectionConfig = {
  slug: "discussion-replies",
  admin: {
    useAsTitle: "id",
    defaultColumns: ["discussion", "author", "createdAt"],
    group: "Learning",
  },
  access: {
    read: ({ req }) => enrolledCourseFilter(req as never),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === "admin") return true;
      return { author: { equals: user.id } };
    },
    delete: ({ req: { user } }) =>
      user?.role === "admin" || user?.role === "instructor",
  },
  hooks: {
    beforeValidate: [
      ({ data, req, operation }) => {
        if (data && operation === "create" && req.user) {
          data.author = req.user.id;
        }
        return data;
      },
    ],
  },
  fields: [
    { name: "body", type: "textarea", required: true },
    {
      name: "discussion",
      type: "relationship",
      relationTo: "discussions",
      required: true,
      index: true,
    },
    {
      name: "course",
      type: "relationship",
      relationTo: "courses",
      required: true,
      index: true,
      admin: { description: "Denormalised so the read rule can scope by enrolment." },
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      required: true,
      index: true,
      admin: { readOnly: true },
    },
  ],
};
