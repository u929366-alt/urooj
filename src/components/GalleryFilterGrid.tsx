"use client";

import { useState } from "react";
import { Images } from "lucide-react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { galleryItems, galleryCategories } from "@/data/partners";
import { cn } from "@/lib/utils";

export function GalleryFilterGrid() {
  const [category, setCategory] = useState<(typeof galleryCategories)[number]>("All");

  const filtered =
    category === "All" ? galleryItems : galleryItems.filter((g) => g.category === category);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter gallery by category">
        {galleryCategories.map((cat) => (
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
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((item) => (
          <PlaceholderImage
            key={item.id}
            label={item.caption}
            icon={Images}
            seed={item.id}
            className="aspect-square w-full rounded-2xl"
          />
        ))}
      </div>
    </div>
  );
}
