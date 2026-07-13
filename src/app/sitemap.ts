export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { programs } from "@/data/programs";
import { posts } from "@/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
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
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const programRoutes = programs.map((program) => ({
    url: `${siteConfig.url}/programs/${program.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogRoutes = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...programRoutes, ...blogRoutes];
}
