import type { CollectionConfig } from "payload";
import { slugify } from "./fields/slug.ts";

/** Six characters of randomness, so a room name cannot be guessed from a title. */
function roomSuffix(): string {
  const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (const byte of bytes) out += alphabet[byte % alphabet.length];
  return out;
}

/**
 * A scheduled live lecture.
 *
 * The portal does not carry the video itself — that is a Jitsi server on its
 * own machine, because routing a hundred camera streams needs CPU and
 * bandwidth that shared hosting does not have. What lives here is everything
 * around the call: when it is, which course it belongs to, who may join, who
 * did join, and where the recording ended up afterwards.
 *
 * `roomName` is what the portal hands Jitsi. It is derived from the title and
 * must be unique across the whole site, because a Jitsi room name is global:
 * two lectures sharing one would put both classes in the same call.
 */
export const LiveSessions: CollectionConfig = {
  slug: "live-sessions",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "course", "startsAt", "status"],
    group: "Live Classes",
  },
  access: {
    // Anyone may see that a lecture exists and when it is. Whether they may
    // join it is a separate question, answered in the portal rather than here,
    // because it depends on enrolment.
    read: () => true,
    create: ({ req: { user } }) => user?.role === "admin" || user?.role === "instructor",
    update: ({ req: { user } }) => user?.role === "admin" || user?.role === "instructor",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  defaultSort: "-startsAt",
  hooks: {
    beforeValidate: [
      ({ data, req, operation }) => {
        if (!data) return data;
        // An instructor creating a lecture is teaching it unless told
        // otherwise, which saves picking yourself from a list every time.
        if (operation === "create" && !data.instructor && req.user) {
          data.instructor = req.user.id;
        }
        return data;
      },
    ],
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "roomName",
      type: "text",
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description:
          "The room on the video server. Generated automatically, with random characters on the end so nobody can walk into a class by guessing its name. Changing it mid-class would split the room in two.",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (typeof value === "string" && value.trim()) return slugify(value);
            const title = typeof data?.title === "string" ? slugify(data.title) : "lecture";
            // Jitsi takes the room name from a URL path, so keep it short and
            // plain: no spaces, no punctuation, nothing to escape.
            return `${title.slice(0, 40) || "lecture"}-${roomSuffix()}`;
          },
        ],
      },
    },
    {
      name: "course",
      type: "relationship",
      relationTo: "courses",
      index: true,
      admin: {
        description:
          "The course this lecture belongs to. Only students enrolled on it can join. Leave empty for an open session any signed-in student may attend.",
      },
    },
    {
      name: "instructor",
      type: "relationship",
      relationTo: "users",
      required: true,
      index: true,
      admin: { description: "Who leads the call. They join as moderator; everyone else does not." },
    },
    {
      name: "description",
      type: "textarea",
      admin: { description: "What the lecture covers. Shown to students before they join." },
    },
    {
      name: "startsAt",
      type: "date",
      required: true,
      index: true,
      admin: {
        date: { pickerAppearance: "dayAndTime" },
        description: "Pakistan time. Students see it in their own device's time zone.",
      },
    },
    {
      name: "durationMinutes",
      type: "number",
      required: true,
      defaultValue: 60,
      min: 5,
      max: 480,
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "scheduled",
      options: [
        { label: "Scheduled", value: "scheduled" },
        { label: "Live now", value: "live" },
        { label: "Ended", value: "ended" },
        { label: "Cancelled", value: "cancelled" },
      ],
      admin: {
        position: "sidebar",
        description:
          "Set by the instructor from the portal when they start and end the class. Cancelling tells students not to turn up.",
      },
    },
    {
      name: "externalUrl",
      type: "text",
      admin: {
        description:
          "Only for a lecture held somewhere other than the Hunarsaaz video server — a Zoom or Meet link, for instance. Set this and students are sent there instead of into the built-in room.",
      },
    },
    {
      name: "recordingUrl",
      type: "text",
      admin: {
        description: "Link to the recording, added after the class. Shown to enrolled students.",
      },
    },
    {
      name: "attendanceCount",
      type: "number",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "How many students joined. Counted by the portal as people arrive.",
      },
    },
  ],
};
