import type { CollectionConfig } from "payload";

/**
 * Uploads: lesson attachments, course cover images, avatars, assignment files.
 *
 * Files land in `public/uploads` so they are served directly by Next. Anything
 * that must not be public (assignment submissions) is kept out of this
 * collection — see `submissions`.
 */
export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Content",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) =>
      user?.role === "admin" || user?.role === "instructor",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  upload: {
    staticDir: "public/uploads",
    /**
     * Documents as well as pictures: a workshop handout or a feedback form
     * is a Word file more often than not, and emailing people a link to one
     * on our own domain beats a shared Drive folder that can be moved,
     * revoked or made private by somebody tidying up.
     *
     * Word only in its modern, macro-free form — .docm carries executable
     * macros and has no business being handed out from our own domain.
     */
    mimeTypes: [
      "image/*",
      "application/pdf",
      "video/*",
      "audio/*",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      admin: {
        description: "Describe the image for screen readers. Leave blank for non-images.",
      },
    },
  ],
};
