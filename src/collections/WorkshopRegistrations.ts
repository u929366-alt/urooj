import type { CollectionConfig } from "payload";

/**
 * Somebody signing up for a workshop.
 *
 * Holds a name, an email address, a phone number and where they work, for a
 * person who may have no account here at all. That is personal data belonging
 * to a member of the public, so only staff can read it and nobody can create
 * a row through the API: registrations arrive through the portal's own form,
 * which writes them with overrideAccess after validating. Leaving `create`
 * open would hand the internet a way to fill the table with rubbish.
 */
export const WorkshopRegistrations: CollectionConfig = {
  slug: "workshop-registrations",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "workshop", "category", "status", "receiptUploadedAt", "createdAt"],
    group: "Workshops",
  },
  access: {
    read: ({ req: { user } }) => user?.role === "admin" || user?.role === "instructor",
    create: () => false,
    update: ({ req: { user } }) => user?.role === "admin" || user?.role === "instructor",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  defaultSort: "-createdAt",
  fields: [
    {
      name: "workshop",
      type: "relationship",
      relationTo: "workshops",
      required: true,
      index: true,
    },
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true, index: true },
    { name: "phone", type: "text" },
    { name: "city", type: "text" },
    {
      name: "category",
      type: "select",
      required: true,
      defaultValue: "professional",
      options: [
        { label: "Professional", value: "professional" },
        { label: "Student", value: "student" },
      ],
    },
    {
      name: "organisation",
      type: "text",
      admin: { description: "Where they work or study." },
    },
    {
      name: "groupSize",
      type: "number",
      defaultValue: 1,
      min: 1,
      max: 20,
      admin: {
        description:
          "How many places this registration is for. More than one means they are booking for a group.",
      },
    },
    { name: "notes", type: "textarea" },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      options: [
        { label: "Registered — awaiting payment", value: "pending" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Cancelled", value: "cancelled" },
      ],
      admin: {
        position: "sidebar",
        description:
          "Moves to Confirmed when the fee is received. Confirming the payment in Payments does this for you.",
      },
    },
    {
      name: "paymentReference",
      type: "text",
      index: true,
      admin: {
        position: "sidebar",
        description: "The reference the registrant was given to quote on their bank transfer.",
      },
    },
    {
      name: "receipt",
      type: "relationship",
      relationTo: "payment-receipts",
      admin: {
        description:
          "The transfer receipt they sent in. Open it, check it against the bank, then confirm the payment in Payments.",
      },
    },
    {
      name: "receiptUploadedAt",
      type: "date",
      admin: { readOnly: true, description: "When the receipt arrived." },
    },
    {
      name: "amountDue",
      type: "number",
      admin: { position: "sidebar", readOnly: true, description: "Rupees, at the time of booking." },
    },
  ],
};
