/**
 * Renders a YouTube or Vimeo link as an embedded player.
 *
 * Only those two hosts are embedded; anything else falls back to a plain link
 * rather than putting an arbitrary URL inside an iframe on our own origin.
 */
function toEmbedUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtube.com" || host === "m.youtube.com") {
    const id = url.searchParams.get("v");
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === "youtu.be") {
    const id = url.pathname.slice(1);
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === "vimeo.com") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
  }
  return null;
}

export function LessonVideo({ url, title }: { url: string; title: string }) {
  const embed = toEmbedUrl(url);

  if (!embed) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex rounded-xl bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-700 hover:bg-primary-100"
      >
        Open the video for this lesson ↗
      </a>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
      <iframe
        src={embed}
        title={`${title} — video`}
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="h-full w-full border-0"
      />
    </div>
  );
}
