import type { CollectionConfig } from "payload";
import { slugField } from "./fields/slug.ts";

/**
 * One unit of study: some combination of video, written content and files.
 *
 * Lesson bodies are only ever sent to enrolled students — the portal reads
 * them through `src/lib/lms/queries.ts`, which checks enrolment first. A
 * lesson marked `preview` is readable by anyone, for the course sales page.
 */
export const Lessons: CollectionConfig = {
  slug: "lessons",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "module", "order"],
    group: "Learning",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) =>
      user?.role === "admin" || user?.role === "instructor",
    update: ({ req: { user } }) =>
      user?.role === "admin" || user?.role === "instructor",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  defaultSort: "order",
  fields: [
    { name: "title", type: "text", required: true },
    slugField(),
    {
      name: "module",
      type: "relationship",
      relationTo: "modules",
      required: true,
      index: true,
    },
    {
      name: "course",
      type: "relationship",
      relationTo: "courses",
      required: true,
      index: true,
      admin: {
        description:
          "Kept alongside the module so the player can list a whole course in one query.",
      },
    },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 1,
      admin: { description: "Lowest first, within the module." },
    },
    {
      name: "preview",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Free sample: readable without enrolling.",
      },
    },
    {
      name: "videoUrl",
      type: "text",
      admin: { description: "YouTube or Vimeo link. Leave blank for a text-only lesson." },
    },
    {
      name: "durationMinutes",
      type: "number",
      min: 0,
      admin: { position: "sidebar" },
    },
    { name: "content", type: "richText" },
    {
      name: "attachments",
      type: "array",
      labels: { singular: "Attachment", plural: "Attachments" },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "file", type: "upload", relationTo: "media", required: true },
      ],
    },
  ],
};
