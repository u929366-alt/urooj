import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

// Read per request, not baked in at build time, so one build can serve the
// main site and the portal subdomain with the right rules for each.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const here = process.env.SITE_URL?.trim() || siteConfig.url;
  const marketing = process.env.MARKETING_SITE_URL?.trim() || siteConfig.url;

  // This bundle carries the marketing pages as well as the portal. When it is
  // deployed to a subdomain such as learn.hunarsaaz.pk, letting search engines
  // index those pages would put a second copy of the whole website online,
  // competing with the real one. Only the portal is crawlable there.
  if (here !== marketing) {
    return {
      rules: {
        userAgent: "*",
        allow: ["/learn/courses", "/donate"],
        disallow: "/",
      },
      sitemap: `${here}/sitemap.xml`,
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/cms-api/", "/admin", "/learn/pay"],
    },
    sitemap: `${here}/sitemap.xml`,
  };
}
