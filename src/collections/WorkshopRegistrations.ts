import type { CollectionConfig } from "payload";
import { confirmationHTML } from "../lib/lms/workshopEmails.ts";
import type { Workshop } from "../payload-types.ts";

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
  hooks: {
    /**
     * Stamp who confirmed it, and when, whoever does the confirming and
     * wherever they do it. Done here rather than afterChange so it is part of
     * the same write and cannot set off a second one.
     */
    beforeChange: [
      ({ data, originalDoc, req }) => {
        const becoming = data.status === "confirmed" && originalDoc?.status !== "confirmed";
        if (becoming && !data.verifiedAt) {
          data.verifiedAt = new Date().toISOString();
          if (!data.verifiedBy && req.user) data.verifiedBy = req.user.id;
        }

        /**
         * Seat numbers, from the booking's own reference: HS-W-ABC123-01,
         * -02, and so on. Two numbers do different jobs here — this one says
         * a person holds a place, and the certificate serial issued later
         * says they attended. Keeping them apart means a no-show never ends
         * up holding a certificate number.
         *
         * Assigned here rather than in the form so that a name typed into
         * the admin months later gets one too.
         */
        const reference = data.paymentReference ?? originalDoc?.paymentReference;
        if (Array.isArray(data.attendees) && reference) {
          const taken = new Set(
            data.attendees
              .map((row: { seat?: string | null }) => row?.seat)
              .filter((seat: unknown): seat is string => typeof seat === "string" && seat !== ""),
          );
          let next = 1;
          data.attendees = data.attendees.map((row: { seat?: string | null }) => {
            if (row?.seat) return row;
            let seat = "";
            do {
              seat = `${reference}-${String(next).padStart(2, "0")}`;
              next += 1;
            } while (taken.has(seat));
            taken.add(seat);
            return { ...row, seat };
          });
        }

        // The number of places and the list of people should not disagree.
        if (Array.isArray(data.attendees) && data.attendees.length > 0) {
          data.groupSize = Math.max(data.groupSize ?? 1, data.attendees.length);
        }

        return data;
      },
    ],

    /**
     * Confirming a registration is what sends the letter — and this is the
     * only place it is sent from.
     *
     * It lives on the collection rather than in the page that approves them
     * because there are three ways a place gets confirmed: the Workshops
     * page, this record in the admin, and confirming the matching payment
     * (which marks its registration confirmed in turn). A letter that only
     * went out from one of them would be a trap, and was.
     *
     * Nothing in here may throw. A failed email must not undo a confirmation
     * that staff have just made.
     */
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        if (operation !== "update") return;
        if (doc.status !== "confirmed" || previousDoc?.status === "confirmed") return;

        const { payload } = req;

        // Mark the money received too, so Payments agrees with the register.
        // Only the status: the receipt number, the timestamp and the
        // signature are the payments collection's own business, and it fills
        // them in when it sees the status change. Its hook then looks back
        // here, finds this registration already confirmed, and stops — which
        // is what keeps the two from calling each other round in circles.
        try {
          if (doc.paymentReference) {
            const found = await payload.find({
              collection: "payments",
              where: { reference: { equals: doc.paymentReference } },
              limit: 1,
              depth: 0,
              overrideAccess: true,
            });
            const payment = found.docs[0];
            if (payment && payment.status !== "confirmed") {
              await payload.update({
                collection: "payments",
                id: payment.id,
                data: { status: "confirmed" },
                overrideAccess: true,
              });
            }
          }
        } catch (error) {
          payload.logger.error(`[workshops] could not mark the payment received: ${error}`);
        }

        try {
          const workshop =
            typeof doc.workshop === "object" && doc.workshop
              ? (doc.workshop as Workshop)
              : await payload.findByID({
                  collection: "workshops",
                  id: doc.workshop,
                  depth: 0,
                  overrideAccess: true,
                });
          if (!workshop) return;

          await payload.sendEmail({
            to: doc.email,
            subject: `Your place is confirmed — ${workshop.title}`,
            html: confirmationHTML(workshop, doc),
          });
          payload.logger.info(`[workshops] confirmation letter sent to ${doc.email}`);
        } catch (error) {
          payload.logger.error(`[workshops] confirmation email failed: ${error}`);
        }
      },
    ],
  },
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
    {
      /**
       * Who is actually coming.
       *
       * A group booking used to be one person and a number, which meant the
       * other places belonged to nobody: no joining link, no certificate, no
       * name on the register. The booking above is still the money — one
       * payer, one reference, one receipt — and this is the people.
       *
       * For a single place this holds one entry, the registrant themselves,
       * so everything downstream can read the same list whatever the size of
       * the booking.
       */
      name: "attendees",
      type: "array",
      labels: { singular: "Attendee", plural: "Attendees" },
      admin: {
        description:
          "One row per person attending. Add the names as they come in — the joining link and the certificate both go to each person here, so a place with no name gets neither.",
        initCollapsed: false,
      },
      fields: [
        {
          name: "seat",
          type: "text",
          admin: {
            readOnly: true,
            width: "30%",
            description: "Set automatically.",
          },
        },
        { name: "name", type: "text", required: true, admin: { width: "35%" } },
        {
          name: "email",
          type: "email",
          admin: {
            width: "35%",
            description: "Where their joining link and certificate go. Leave blank to use the booker's.",
          },
        },
      ],
    },
    { name: "notes", type: "textarea" },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      options: [
        { label: "Awaiting verification", value: "pending" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Cancelled", value: "cancelled" },
      ],
      admin: {
        position: "sidebar",
        description:
          "Setting this to Confirmed — here, or on the Workshops page, or by confirming the payment — emails the registrant their confirmation letter and marks the payment received. It happens once; setting it to Confirmed again sends nothing. Cancelling here sends nothing: use 'Something's wrong' on the Workshops page if you want them told why.",
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
      name: "verifiedAt",
      type: "date",
      admin: { position: "sidebar", readOnly: true, description: "When a person checked the receipt." },
    },
    {
      name: "verifiedBy",
      type: "relationship",
      relationTo: "users",
      admin: { position: "sidebar", readOnly: true, description: "Who checked it." },
    },
    {
      name: "amountDue",
      type: "number",
      admin: { position: "sidebar", readOnly: true, description: "Rupees, at the time of booking." },
    },
    {
      name: "joiningSentAt",
      type: "date",
      admin: {
        position: "sidebar",
        readOnly: true,
        description:
          "When the joining link was emailed out. Blank means this party has not had it — the Workshops page sends to exactly those.",
      },
    },
  ],
};
