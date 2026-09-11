import type { CollectionConfig } from "payload";

/**
 * Everyone who can sign in: students, instructors and staff.
 *
 * Payload provides the auth itself (hashed passwords, login, password reset,
 * the session cookie). `role` is what the rest of the LMS gates on.
 */
/**
 * Read at call time, and deliberately NOT named NEXT_PUBLIC_*: Next inlines
 * variables with that prefix at build time, so a value set on the server would
 * be ignored and every reset link would point wherever the build was made.
 */
function siteUrl(): string {
  return process.env.SITE_URL?.trim() || "https://hunarsaaz.pk";
}

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    // Payload's default reset email points at the CMS admin. Students never
    // go there, so send them to the portal's own reset page instead.
    forgotPassword: {
      generateEmailSubject: () => "Reset your Hunarsaaz password",
      generateEmailHTML: (args) => {
        const token = args?.token ?? "";
        const name = (args?.user as { name?: string } | undefined)?.name;
        const link = `${siteUrl()}/learn/reset-password?token=${encodeURIComponent(token)}`;
        return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1f2937">
  <h1 style="font-size:20px;color:#0b2c49;margin:0 0 16px">Reset your password</h1>
  <p style="margin:0 0 12px">${name ? `Hello ${name},` : "Hello,"}</p>
  <p style="margin:0 0 20px">
    We received a request to reset the password for your Hunarsaaz learning
    account. Click the button below to choose a new one.
  </p>
  <p style="margin:0 0 24px">
    <a href="${link}"
       style="background:#f28c28;color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px;display:inline-block;font-weight:bold">
      Choose a new password
    </a>
  </p>
  <p style="margin:0 0 12px;font-size:13px;color:#6b7280">
    This link can only be used once, and expires in one hour.
  </p>
  <p style="margin:0 0 12px;font-size:13px;color:#6b7280">
    If you did not ask for this, you can ignore this email — your password
    will stay as it is.
  </p>
  <p style="margin:24px 0 0;font-size:12px;color:#9ca3af">
    If the button does not work, copy this address into your browser:<br>
    ${link}
  </p>
</div>`;
      },
    },
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "email", "role"],
    group: "People",
  },
  access: {
    // Anyone may register — but only ever as a student; see the hook below.
    create: () => true,
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === "admin" || user.role === "instructor") return true;
      // Students can only read their own record.
      return { id: { equals: user.id } };
    },
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === "admin") return true;
      return { id: { equals: user.id } };
    },
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        if (!data || operation !== "create") return data;

        // The very first account to exist has to be an admin, otherwise the
        // admin-only `role` field below would lock everyone out permanently.
        const { totalDocs } = await req.payload.count({
          collection: "users",
          overrideAccess: true,
        });
        if (totalDocs === 0) {
          data.role = "admin";
          return data;
        }

        // After that, anyone who is not an admin — including self-service
        // registration, where there is no req.user at all — gets "student"
        // regardless of what was posted.
        if (req.user?.role !== "admin") {
          data.role = "student";
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "student",
      options: [
        { label: "Student", value: "student" },
        { label: "Instructor", value: "instructor" },
        { label: "Admin", value: "admin" },
      ],
      access: {
        // Only an admin may set or change a role. Without this, a self-service
        // registration could POST role: "admin" and escalate itself.
        create: ({ req: { user } }) => user?.role === "admin",
        update: ({ req: { user } }) => user?.role === "admin",
      },
      admin: {
        description: "Only admins can change this.",
      },
    },
    {
      name: "phone",
      type: "text",
    },
    {
      name: "city",
      type: "text",
    },
    {
      name: "bio",
      type: "textarea",
      admin: {
        description: "Shown on instructor profiles.",
      },
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
    },
  ],
};
