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
  hooks: {
    beforeValidate: [
      async ({ data, originalDoc, req, operation }) => {
        const slug = data?.slug;
        const courseRef = data?.course ?? originalDoc?.course;
        if (!slug || !courseRef) return data;

        const courseId = typeof courseRef === "object" ? courseRef.id : courseRef;
        const clash = await req.payload.find({
          collection: "lessons",
          where: { and: [{ course: { equals: courseId } }, { slug: { equals: slug } }] },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        });

        const other = clash.docs.find(
          (doc) => operation === "create" || doc.id !== originalDoc?.id,
        );
        if (other) {
          throw new Error(
            `Another lesson on this course already uses the address "${slug}". Give this one a different title, or set its slug by hand.`,
          );
        }
        return data;
      },
    ],
  },
  fields: [
    { name: "title", type: "text", required: true },
    // Lesson URLs are /learn/courses/<course>/<lesson>, and the player looks a
    // lesson up within its course, so the slug only has to be unique there.
    // Globally unique would be unworkable: "Introduction" belongs in almost
    // every course. The hook below holds the real constraint.
    slugField("title", { unique: false }),
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
        description: "Sample lesson: readable without enrolling.",
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
