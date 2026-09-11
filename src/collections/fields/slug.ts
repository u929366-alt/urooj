import type { Field } from "payload";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * URL segment for a document, derived from `sourceField` when left blank so
 * authors never have to think about it, but still editable when they want a
 * specific URL.
 */
export function slugField(sourceField = "title"): Field {
  return {
    name: "slug",
    type: "text",
    unique: true,
    index: true,
    admin: {
      position: "sidebar",
      description: "Leave blank to generate from the title.",
    },
    hooks: {
      beforeValidate: [
        ({ value, data }) => {
          if (typeof value === "string" && value.trim()) return slugify(value);
          const source = data?.[sourceField];
          return typeof source === "string" ? slugify(source) : value;
        },
      ],
    },
  };
}
