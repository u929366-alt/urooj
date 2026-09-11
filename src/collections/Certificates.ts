import type { CollectionConfig } from "payload";

/**
 * Proof that a student finished a course.
 *
 * Issued server-side by `issueCertificateIfComplete()` once every lesson on
 * the course is ticked off — never created from the browser. Each one carries
 * a public serial so an employer can check it at /verify/[serial] without
 * needing an account; that page deliberately shows only the name, course and
 * date, and no contact details.
 */
export const Certificates: CollectionConfig = {
  slug: "certificates",
  admin: {
    useAsTitle: "serial",
    defaultColumns: ["serial", "student", "course", "issuedAt"],
    group: "Learning",
  },
  access: {
    // Verification is public, by design — see the route note above.
    read: () => true,
    create: () => false,
    update: () => false,
    delete: ({ req: { user } }) => user?.role === "admin",
  },
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
      name: "student",
      type: "relationship",
      relationTo: "users",
      required: true,
      index: true,
    },
    {
      name: "course",
      type: "relationship",
      relationTo: "courses",
      required: true,
      index: true,
    },
    { name: "studentName", type: "text", required: true },
    { name: "courseTitle", type: "text", required: true },
    { name: "issuedAt", type: "date", required: true },
  ],
};
