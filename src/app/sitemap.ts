import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { programs } from "@/data/programs";
import { posts } from "@/data/blog";

// Read per request so the URLs match whichever host is serving it.
//
// Next requires this to be a literal, and rejects "force-dynamic" outright in
// an export build, so scripts/build-static.sh rewrites the line to
// "force-static" for that build and puts it back afterwards.
export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL?.trim() || siteConfig.url;
  const marketing = process.env.MARKETING_SITE_URL?.trim() || siteConfig.url;

  // On the portal subdomain, list only the portal. The marketing pages belong
  // to the main site and are listed in its own sitemap.
  if (base !== marketing) {
    return ["/learn/courses", "/donate"].map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  }

  const staticRoutes = [
    "",
    "/about",
    "/advisory",
    "/programs",
    "/admissions",
    "/donate",
    "/volunteer",
    "/gallery",
    "/blog",
    "/impact",
    "/careers",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const programRoutes = programs.map((program) => ({
    url: `${base}/programs/${program.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogRoutes = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...programRoutes, ...blogRoutes];
}
