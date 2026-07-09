"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Newspaper, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { posts } from "@/data/blog";
import { cn } from "@/lib/utils";

const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogList() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = category === "All" || post.category === category;
      const matchesQuery =
        query.trim() === "" ||
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter posts by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                category === cat
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <label htmlFor="blog-search" className="sr-only">Search articles</label>
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full rounded-full border border-gray-200 py-2 pl-9 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="flex h-full flex-col overflow-hidden">
              <PlaceholderImage
                label={post.title}
                icon={Newspaper}
                seed={post.slug}
                className="aspect-[16/9] w-full"
              />
              <div className="flex flex-1 flex-col p-6">
                <Badge tone="secondary">{post.category}</Badge>
                <h3 className="mt-3 font-semibold text-primary-900">{post.title}</h3>
                <p className="mt-2 flex-1 text-sm text-gray-600">{post.excerpt}</p>
                <p className="mt-4 text-xs text-gray-500">
                  {formatDate(post.date)} · {post.readTime}
                </p>
              </div>
            </Card>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-gray-500">No articles match your search.</p>
        )}
      </div>
    </div>
  );
}
