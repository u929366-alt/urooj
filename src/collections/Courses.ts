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
      name: "category",
      type: "relationship",
      relationTo: "categories",
      index: true,
      admin: { position: "sidebar", description: "Where this sits in the catalogue." },
    },
    {
      name: "skills",
      type: "array",
      labels: { singular: "Skill", plural: "Skills you will gain" },
      fields: [{ name: "text", type: "text", required: true }],
      admin: { description: "Short skill names, shown as tags on the course page." },
    },
    {
      name: "learningHours",
      type: "number",
      min: 0,
      admin: {
        position: "sidebar",
        description: "Estimated total study hours, separate from the calendar length in weeks.",
      },
    },
    {
      name: "finalProject",
      type: "textarea",
      admin: { description: "The practical piece of work that demonstrates the whole course." },
    },
    {
      name: "assessmentMethod",
      type: "textarea",
      admin: { description: "How the learner is assessed, and what each part is worth." },
    },
    {
      name: "certificateCriteria",
      type: "textarea",
      admin: {
        description:
          "What a learner must complete to earn the certificate. Shown to them before they enrol, so it has to match what the portal actually enforces.",
      },
    },
    {
      name: "resources",
      type: "array",
      labels: { singular: "Resource", plural: "Suggested resources" },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "url", type: "text" },
      ],
    },
    {
      name: "curriculumSource",
      type: "textarea",
      admin: {
        position: "sidebar",
        description:
          "Internal only, never shown to learners. Where this syllabus came from — a NAVTTC qualification code and document URL, another published curriculum, or 'developed by Hunarsaaz'. This is the record behind the recognition claim above, so keep it accurate.",
      },
    },
    {
      name: "sector",
      type: "text",
      admin: {
        description:
          'The NAVTTC industry sector this sits in, e.g. "Information Technology".',
      },
    },
    {
      name: "courseCode",
      type: "text",
      admin: { position: "sidebar", description: "Optional internal or NAVTTC code." },
    },
    {
      name: "nvqfLevel",
      type: "select",
      options: ["1", "2", "3", "4", "5", "6", "7", "8"].map((n) => ({
        label: `Level ${n}`,
        value: n,
      })),
      admin: {
        position: "sidebar",
        description: "Pakistan's National Vocational Qualifications Framework level.",
      },
    },
    {
      name: "recognition",
      type: "select",
      required: true,
      defaultValue: "hunarsaaz",
      options: [
        { label: "NAVTTC-recognised / accredited", value: "navttc_recognised" },
        { label: "Aligned to a NAVTTC curriculum (not accredited)", value: "navttc_aligned" },
        { label: "Developed by Hunarsaaz", value: "hunarsaaz" },
      ],
      admin: {
        position: "sidebar",
        description:
          "Claiming accreditation Hunarsaaz does not hold misleads students about what their certificate is worth. Only pick the first option for a programme NAVTTC has actually accredited, and keep the paperwork.",
      },
    },
    {
      name: "prerequisites",
      type: "textarea",
      admin: { description: "What a student needs before starting. Say \"None\" if there is nothing." },
    },
    { name: "targetLearners", type: "textarea" },
    {
      name: "objectives",
      type: "array",
      labels: { singular: "Objective", plural: "Learning objectives" },
      fields: [{ name: "text", type: "text", required: true }],
    },
    {
      name: "outcomes",
      type: "array",
      labels: { singular: "Outcome", plural: "Learning outcomes" },
      fields: [{ name: "text", type: "text", required: true }],
      admin: { description: "What the student can do by the end — one statement each." },
    },
    {
      name: "careers",
      type: "array",
      labels: { singular: "Career", plural: "Career opportunities" },
      fields: [{ name: "text", type: "text", required: true }],
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
