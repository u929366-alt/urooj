import type { CollectionConfig } from "payload";
import { slugField } from "./fields/slug.ts";

/** A piece of work a student submits and an instructor grades. */
export const Assignments: CollectionConfig = {
  slug: "assignments",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "course", "dueDate", "maxPoints"],
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
  fields: [
    { name: "title", type: "text", required: true },
    slugField(),
    {
      name: "course",
      type: "relationship",
      relationTo: "courses",
      required: true,
      index: true,
    },
    {
      name: "lesson",
      type: "relationship",
      relationTo: "lessons",
      index: true,
      admin: { description: "Optional. Shows at the end of this lesson." },
    },
    { name: "instructions", type: "richText" },
    {
      name: "dueDate",
      type: "date",
      admin: { position: "sidebar" },
    },
    {
      name: "maxPoints",
      type: "number",
      required: true,
      defaultValue: 100,
      min: 1,
      admin: { position: "sidebar" },
    },
    {
      name: "allowFiles",
      type: "checkbox",
      defaultValue: true,
      admin: { position: "sidebar", description: "Let students attach files." },
    },
    {
      name: "acceptingSubmissions",
      type: "checkbox",
      defaultValue: true,
      admin: { position: "sidebar" },
    },
  ],
};
