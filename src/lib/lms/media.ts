/**
 * Same-origin path for an uploaded file.
 *
 * Payload builds `url` from the configured serverURL, so it comes back
 * absolute — "https://learn.hunarsaaz.pk/cms-api/media/file/photo.jpg". Handed
 * to next/image that is a *remote* image, and Next refuses to optimise a host
 * that is not listed in images.remotePatterns, so the picture simply fails to
 * load. It is the same server either way, so the host is dropped and only the
 * path is used.
 *
 * Doing it here rather than allowlisting the host keeps this working whatever
 * SITE_URL is set to — including on a staging domain, or before it is set at
 * all, when the absolute URL would point at localhost.
 */
export function mediaPath(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const url = (value as { url?: string | null }).url;
  if (!url) return null;

  if (url.startsWith("/")) return url;

  try {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    // Not a URL we can parse — better to render nothing than a broken image.
    return null;
  }
}
