import type { CollectionConfig } from "payload";
import { slugField } from "./fields/slug.ts";

/**
 * A one-off paid workshop or seminar, the kind announced on a flyer.
 *
 * Separate from courses: a workshop happens once, at a fixed time, is open to
 * people who have no account on the portal, and is paid for on its own rather
 * than through enrolment. The registration page is public for that reason —
 * an attendee may be a working psychologist who has never heard of the LMS.
 *
 * Everything on the flyer lives here as a field so the next one can be set up
 * in the admin without anybody writing code.
 */
export const Workshops: CollectionConfig = {
  slug: "workshops",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "startsAt", "status", "registrationCount"],
    group: "Workshops",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === "admin" || user?.role === "instructor",
    update: ({ req: { user } }) => user?.role === "admin" || user?.role === "instructor",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  defaultSort: "-startsAt",
  fields: [
    { name: "title", type: "text", required: true },
    slugField("title"),
    {
      name: "tagline",
      type: "text",
      admin: { description: "The line under the title on the flyer." },
    },
    {
      name: "summary",
      type: "textarea",
      admin: { description: "A paragraph for the top of the page and for search results." },
    },
    {
      type: "collapsible",
      label: "Who is presenting",
      fields: [
        { name: "presenterName", type: "text" },
        { name: "presenterTitle", type: "text", admin: { description: "e.g. Consultant Clinical Psychologist" } },
        { name: "presenterOrg", type: "text" },
        { name: "presenterPhoto", type: "upload", relationTo: "media" },
        {
          name: "presenterPhotoUrl",
          type: "text",
          admin: {
            description:
              "Used when no photo is uploaded above. A path to a picture already on the site, such as /team/asma-ahmed.jpg.",
          },
        },
      ],
    },
    {
      type: "collapsible",
      label: "When and where",
      fields: [
        {
          name: "startsAt",
          type: "date",
          required: true,
          index: true,
          admin: { date: { pickerAppearance: "dayAndTime" }, description: "Pakistan time." },
        },
        {
          name: "endsAt",
          type: "date",
          admin: { date: { pickerAppearance: "dayAndTime" } },
        },
        {
          name: "platform",
          type: "text",
          defaultValue: "Zoom",
          admin: { description: "Zoom, Google Meet, or the name of a venue." },
        },
        {
          name: "joinUrl",
          type: "text",
          admin: {
            description:
              "The meeting link. NEVER shown on the public page — it is emailed to people who have registered, so the session cannot be crashed by anyone who finds the flyer.",
          },
        },
      ],
    },
    {
      type: "collapsible",
      label: "Fees",
      fields: [
        {
          name: "priceProfessional",
          type: "number",
          defaultValue: 0,
          min: 0,
          admin: { description: "Rupees. 0 means free for professionals." },
        },
        {
          name: "priceStudent",
          type: "number",
          defaultValue: 0,
          min: 0,
          admin: { description: "Rupees. 0 means free for students." },
        },
        {
          name: "feeNote",
          type: "text",
          admin: { description: "e.g. Early bird discount available for groups of 5–6 participants." },
        },
      ],
    },
    {
      name: "outcomes",
      type: "array",
      labels: { singular: "Outcome", plural: "Outcomes" },
      fields: [{ name: "text", type: "text", required: true }],
      admin: { description: "What attendees will gain." },
    },
    {
      name: "audience",
      type: "array",
      labels: { singular: "Audience", plural: "Who can attend" },
      fields: [{ name: "text", type: "text", required: true }],
      admin: { description: "Who the workshop is for." },
    },
    {
      name: "includes",
      type: "array",
      labels: { singular: "Item", plural: "Items" },
      fields: [{ name: "text", type: "text", required: true }],
      admin: { description: "What the session includes — handout, certificate, Q&A." },
    },
    { name: "contactName", type: "text" },
    { name: "contactEmail", type: "email" },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "open",
      options: [
        { label: "Draft — not visible", value: "draft" },
        { label: "Open for registration", value: "open" },
        { label: "Registration closed", value: "closed" },
        { label: "Finished", value: "finished" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "capacity",
      type: "number",
      min: 0,
      admin: {
        position: "sidebar",
        description: "Leave empty for no limit. Registration closes itself once this is reached.",
      },
    },
    {
      name: "registrationCount",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar", readOnly: true },
    },
  ],
};
