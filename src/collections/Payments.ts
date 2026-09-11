import type { CollectionConfig } from "payload";

/**
 * Every payment, whether a donation or a course fee.
 *
 * Deliberately a record of intent plus a human confirmation, not an
 * integration. Hunarsaaz has no payment gateway account, so money arrives by
 * bank transfer: the payer is given a reference, and a staff member marks the
 * payment confirmed once it appears on the statement. Nothing here ever
 * touches card details.
 *
 * `status` is the only thing that grants anything. A pending payment unlocks
 * no course access, and only a staff member can move it to confirmed — the
 * field rejects writes from everyone else, so a payer cannot mark their own
 * transfer as received.
 */
const staffOnly = ({ req: { user } }: { req: { user?: { role?: string } | null } }) =>
  user?.role === "admin" || user?.role === "instructor";

export const Payments: CollectionConfig = {
  slug: "payments",
  admin: {
    useAsTitle: "reference",
    defaultColumns: ["reference", "purpose", "amount", "status", "payerName", "createdAt"],
    group: "Finance",
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === "admin" || user.role === "instructor") return true;
      // A student can see their own course payments.
      return { payer: { equals: user.id } };
    },
    // Written server-side only. Donations come from an anonymous form, so
    // letting the API create these directly would invite junk records.
    create: () => false,
    update: staffOnly,
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    {
      name: "reference",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: "Quoted by the payer on their bank transfer.",
      },
    },
    {
      name: "purpose",
      type: "select",
      required: true,
      options: [
        { label: "Donation", value: "donation" },
        { label: "Course fee", value: "course" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      options: [
        { label: "Awaiting payment", value: "pending" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Cancelled", value: "cancelled" },
      ],
      access: { update: staffOnly },
      admin: {
        position: "sidebar",
        description: "Set to Confirmed only once the money is on the statement.",
      },
    },
    {
      name: "method",
      type: "select",
      required: true,
      defaultValue: "bank_transfer",
      options: [
        { label: "Bank transfer", value: "bank_transfer" },
        { label: "Cash / in person", value: "cash" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "amount",
      type: "number",
      required: true,
      min: 1,
      admin: { description: "In Pakistani rupees." },
    },
    { name: "currency", type: "text", defaultValue: "PKR", admin: { position: "sidebar" } },

    { name: "payerName", type: "text", required: true },
    { name: "payerEmail", type: "email", required: true },
    { name: "payerPhone", type: "text" },
    {
      name: "payer",
      type: "relationship",
      relationTo: "users",
      index: true,
      admin: { description: "Set when the payer was signed in — course fees always are." },
    },

    {
      name: "course",
      type: "relationship",
      relationTo: "courses",
      index: true,
      admin: { condition: (data) => data?.purpose === "course" },
    },
    {
      name: "cause",
      type: "text",
      admin: {
        condition: (data) => data?.purpose === "donation",
        description: "What the donor chose to support.",
      },
    },
    { name: "message", type: "textarea", admin: { description: "Note from the payer." } },

    {
      name: "bankReference",
      type: "text",
      access: { update: staffOnly },
      admin: { description: "Transaction ID from the bank statement, once matched." },
    },
    {
      name: "receiptNumber",
      type: "text",
      index: true,
      access: { update: staffOnly },
      admin: { readOnly: true, position: "sidebar", description: "Issued on confirmation." },
    },
    {
      name: "confirmedAt",
      type: "date",
      access: { update: staffOnly },
      admin: { readOnly: true, position: "sidebar" },
    },
    {
      name: "confirmedBy",
      type: "relationship",
      relationTo: "users",
      access: { update: staffOnly },
      admin: { readOnly: true, position: "sidebar" },
    },
  ],
};
