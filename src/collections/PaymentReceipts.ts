import type { CollectionConfig } from "payload";

/**
 * A bank transfer receipt sent in by someone who registered for a workshop.
 *
 * Kept out of `public/uploads` deliberately. Anything under public is served
 * straight off disk by Next, so the URL alone would hand the file to anyone
 * who guessed it — and these are photographs of bank transfers, with account
 * numbers and names on them. Files here go outside the public directory and
 * are served only through Payload's own route, which applies the rule below:
 * staff and nobody else.
 *
 * Nothing can be created through the API either. Receipts arrive through the
 * upload form, which checks the reference and the file before writing, and is
 * the only door.
 */
export const PaymentReceipts: CollectionConfig = {
  slug: "payment-receipts",
  admin: {
    group: "Workshops",
    useAsTitle: "filename",
    defaultColumns: ["filename", "reference", "createdAt"],
    hidden: ({ user }) => user?.role === "student",
  },
  access: {
    read: ({ req: { user } }) => user?.role === "admin" || user?.role === "instructor",
    create: () => false,
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  upload: {
    // NOT under public/ — see the note above.
    staticDir: "private-uploads/receipts",
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"],
  },
  fields: [
    {
      name: "registration",
      type: "relationship",
      relationTo: "workshop-registrations",
      index: true,
      admin: { readOnly: true },
    },
    {
      name: "reference",
      type: "text",
      index: true,
      admin: { readOnly: true, description: "The payment reference this was sent against." },
    },
  ],
};
