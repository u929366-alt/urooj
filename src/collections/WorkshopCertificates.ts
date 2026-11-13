import type { CollectionConfig } from "payload";

/**
 * Proof that somebody attended a workshop.
 *
 * Separate from `certificates`, which is for students finishing a course, and
 * deliberately so. That collection requires a student account and a course,
 * and both columns are NOT NULL on a database that already holds real
 * certificates. A workshop attendee has neither — they registered through a
 * public form and never made an account — and relaxing those constraints in
 * SQLite means rebuilding the table underneath live records. A table of its
 * own costs one more lookup on the verification page and risks nothing.
 *
 * The two share a serial format, and serials are checked against both before
 * being issued, so a number means the same thing whichever kind it is.
 *
 * Issued server-side, in a batch, by staff. Nobody can create one through the
 * API: a certificate that can be requested is not worth having. Reading is
 * public because that is the whole point of a serial — an employer holding a
 * printout can check it without an account, and sees only the name, the
 * workshop and the date.
 */
export const WorkshopCertificates: CollectionConfig = {
  slug: "workshop-certificates",
  admin: {
    useAsTitle: "serial",
    defaultColumns: ["serial", "holderName", "workshop", "issuedAt"],
    group: "Workshops",
  },
  access: {
    read: () => true,
    create: () => false,
    update: () => false,
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  defaultSort: "-issuedAt",
  fields: [
    {
      name: "serial",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { readOnly: true },
    },
    {
      name: "workshop",
      type: "relationship",
      relationTo: "workshops",
      required: true,
      index: true,
    },
    {
      name: "registration",
      type: "relationship",
      relationTo: "workshop-registrations",
      index: true,
      admin: { description: "The booking this person came in on." },
    },
    {
      /**
       * The attendee's seat, which is what makes issuing repeatable: run the
       * batch twice and the second run finds this already taken and skips it,
       * so nobody ends up holding two certificates for one workshop.
       */
      name: "seat",
      type: "text",
      index: true,
      admin: {
        readOnly: true,
        description: "The seat this certificate was issued against.",
      },
    },
    { name: "holderName", type: "text", required: true },
    {
      name: "holderEmail",
      type: "email",
      admin: { description: "Where their copy was sent." },
    },
    { name: "workshopTitle", type: "text", required: true },
    {
      name: "presenterLine",
      type: "text",
      admin: {
        readOnly: true,
        description: "The presenter as they were at the time, kept so a later edit cannot rewrite history.",
      },
    },
    { name: "issuedAt", type: "date", required: true },
  ],
};
