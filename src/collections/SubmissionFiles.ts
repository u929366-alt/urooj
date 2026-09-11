import type { CollectionConfig } from "payload";

/**
 * Files a student attaches to an assignment submission.
 *
 * Deliberately separate from `media`. Media is written into `public/uploads`,
 * which Next serves directly — anyone with the URL gets the file, whatever
 * Payload's access rules say. Student work must not be public, so these land
 * outside the public directory and are served only through Payload's own file
 * route, which does apply the `read` rule below.
 */
export const SubmissionFiles: CollectionConfig = {
  slug: "submission-files",
  admin: {
    group: "Learning",
    hidden: ({ user }) => user?.role === "student",
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === "admin" || user.role === "instructor") return true;
      return { owner: { equals: user.id } };
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  upload: {
    // NOT under public/ — see the note above.
    staticDir: "private-uploads/submissions",
    mimeTypes: [
      "image/*",
      "application/pdf",
      "application/zip",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
  hooks: {
    beforeValidate: [
      ({ data, req, operation }) => {
        if (data && operation === "create" && req.user) {
          data.owner = req.user.id;
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: "owner",
      type: "relationship",
      relationTo: "users",
      index: true,
      admin: { readOnly: true },
    },
  ],
};
