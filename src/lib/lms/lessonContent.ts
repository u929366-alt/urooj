import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

/**
 * Take the "video is coming" framing out of a lesson.
 *
 * Every scaffolded lesson was imported with two pieces of that framing: an
 * opening paragraph saying the recording was still being produced, and a
 * closing section headed "Before the video is ready". Hunarsaaz does not want
 * lessons announcing that they are unfinished, and with the imported videos
 * now suppressed there is no video on the way for these lessons at all.
 *
 * It sits in 423 lesson records in a live database that also holds the
 * instructors, students and enrolments added since. Rewriting them in place
 * would mean shipping a database over the top of all that, so the change is
 * made here, at render. The stored text is untouched: anyone editing a lesson
 * in the admin still sees it and can rewrite it properly, and deleting this
 * file's two rules puts it back everywhere at once.
 *
 * Only the opening paragraph and that exact heading are touched. The advice
 * underneath the heading is kept — working through the points and asking in
 * the discussion is what a student should do either way.
 */
const OPENING_NOTICE = "video coming soon";
const CLOSING_HEADING = "before the video is ready";
const CLOSING_REPLACEMENT = "What to do with this";

type Node = { type?: string; text?: string; children?: Node[] };

function plainText(node: Node): string {
  if (typeof node.text === "string") return node.text;
  return (node.children ?? []).map(plainText).join("");
}

/** The heading with its first text node retitled, leaving everything else. */
function retitle(node: Node, title: string): Node {
  const children = node.children ?? [];
  const index = children.findIndex((child) => typeof child.text === "string");
  if (index === -1) return node;
  const next = [...children];
  next[index] = { ...next[index], text: title };
  return { ...node, children: next };
}

export function stripVideoNotice(
  content: SerializedEditorState,
): SerializedEditorState {
  const root = (content as unknown as { root?: { children?: Node[] } }).root;
  const children = root?.children;
  if (!Array.isArray(children) || children.length === 0) return content;

  let next = children;

  const first = next[0];
  if (
    first?.type === "paragraph" &&
    plainText(first).trim().toLowerCase().startsWith(OPENING_NOTICE)
  ) {
    next = next.slice(1);
  }

  const headingIndex = next.findIndex(
    (node) =>
      node?.type === "heading" &&
      plainText(node).trim().toLowerCase() === CLOSING_HEADING,
  );
  if (headingIndex !== -1) {
    next = [...next];
    next[headingIndex] = retitle(next[headingIndex], CLOSING_REPLACEMENT);
  }

  if (next === children) return content;
  return { ...content, root: { ...root, children: next } } as SerializedEditorState;
}
