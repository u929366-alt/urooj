import type { CollectionConfig } from "payload";
import { slugField } from "./fields/slug.ts";

/**
 * A learning category — the top level of the catalogue.
 *
 * Categories are browsable by anyone: they are how a visitor finds a course
 * before they have an account. Only staff can change them.
 */
export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "order"],
    group: "Learning",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === "admin",
    update: ({ req: { user } }) => user?.role === "admin",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  defaultSort: "order",
  fields: [
    { name: "title", type: "text", required: true },
    slugField(),
    {
      name: "order",
      type: "number",
      required: true,
      defaultValue: 1,
      admin: { position: "sidebar", description: "Lowest first on the homepage." },
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
      maxLength: 300,
      admin: { description: "One or two sentences for the category card." },
    },
    { name: "description", type: "richText" },
    {
      name: "icon",
      type: "select",
      required: true,
      defaultValue: "book",
      options: [
        // Kept to a fixed list so the front end can map each to a real icon
        // component. A free-text icon name would silently render nothing.
        { label: "Monitor (IT & digital)", value: "monitor" },
        { label: "Sparkles (AI & emerging tech)", value: "sparkles" },
        { label: "Laptop (freelancing & remote)", value: "laptop" },
        { label: "Message (communication)", value: "message" },
        { label: "Compass (leadership)", value: "compass" },
        { label: "Trending up (entrepreneurship)", value: "trending" },
        { label: "Heart (wellbeing)", value: "heart" },
        { label: "Battery (burnout)", value: "battery" },
        { label: "Shield (resilience)", value: "shield" },
        { label: "Book (general)", value: "book" },
      ],
      admin: { position: "sidebar" },
    },
    { name: "coverImage", type: "upload", relationTo: "media" },
  ],
};
