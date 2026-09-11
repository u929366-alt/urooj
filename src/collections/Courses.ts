import type { CollectionConfig, Where } from "payload";
import { slugField } from "./fields/slug.ts";

/**
 * A course a student can enrol in and work through.
 *
 * Distinct from `src/data/programs.ts`, which describes the vocational
 * programmes on the public marketing pages. A course is the online, trackable
 * version; `programSlug` links the two so a programme page can point at it.
 */
export const Courses: CollectionConfig = {
  slug: "courses",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "instructor", "status"],
    group: "Learning",
  },
  access: {
    // Published courses are browsable by anyone — that is the catalogue.
    read: ({ req: { user } }) => {
      if (user?.role === "admin") return true;
      const published: Where = { status: { equals: "published" } };
      if (user?.role === "instructor") {
        const ownOrPublished: Where = {
          or: [published, { instructor: { equals: user.id } }],
        };
        return ownOrPublished;
      }
      return published;
    },
    create: ({ req: { user } }) =>
      user?.role === "admin" || user?.role === "instructor",
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === "admin") return true;
      if (user.role === "instructor") return { instructor: { equals: user.id } };
      return false;
    },
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    { name: "title", type: "text", required: true },
    slugField(),
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Archived", value: "archived" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
      maxLength: 300,
      admin: { description: "One or two sentences for the course card." },
    },
    { name: "description", type: "richText" },
    { name: "coverImage", type: "upload", relationTo: "media" },
    {
      name: "instructor",
      type: "relationship",
      relationTo: "users",
      hasMany: false,
      filterOptions: () => ({ role: { in: ["instructor", "admin"] } }),
      admin: { position: "sidebar" },
    },
    {
      name: "level",
      type: "select",
      defaultValue: "beginner",
      options: [
        { label: "Beginner", value: "beginner" },
        { label: "Intermediate", value: "intermediate" },
        { label: "Advanced", value: "advanced" },
      ],
    },
    {
      name: "language",
      type: "select",
      defaultValue: "urdu",
      options: [
        { label: "Urdu", value: "urdu" },
        { label: "English", value: "english" },
        { label: "Urdu & English", value: "both" },
      ],
    },
    {
      name: "durationWeeks",
      type: "number",
      min: 0,
      admin: { description: "Approximate length in weeks." },
    },
    {
      name: "programSlug",
      type: "text",
      admin: {
        position: "sidebar",
        description:
          "Optional. The slug of the matching programme in src/data/programs.ts, so the public programme page can link here.",
      },
    },
    {
      name: "price",
      type: "number",
      required: true,
      defaultValue: 0,
      min: 0,
      admin: {
        position: "sidebar",
        description:
          "Fee in rupees. 0 makes the course free, which enrols a student immediately.",
      },
    },
    {
      name: "enrollmentOpen",
      type: "checkbox",
      defaultValue: true,
      admin: {
        position: "sidebar",
        description: "Uncheck to keep the course visible but closed to new students.",
      },
    },
  ],
};
