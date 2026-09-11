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
    mimeTypes: ["image/*", "application/pdf", "video/*", "audio/*"],
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
