import type { CollectionConfig } from "payload";

/** A titled section of a course, holding an ordered run of lessons. */
export const Modules: CollectionConfig = {
  slug: "modules",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "course", "order"],
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
    {
      name: "course",
      type: "relationship",
      relationTo: "courses",
      required: true,
      index: true,
    },
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 1,
      admin: { description: "Lowest first." },
    },
    { name: "summary", type: "textarea" },
  ],
};
