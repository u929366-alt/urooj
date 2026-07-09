"use client";

import { useState } from "react";
import { ProgramCard } from "@/components/ProgramCard";
import { programs, programCategories } from "@/data/programs";
import { cn } from "@/lib/utils";

export function ProgramsGrid() {
  const [category, setCategory] = useState<(typeof programCategories)[number]>("All");

  const filtered =
    category === "All" ? programs : programs.filter((p) => p.category === category);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter programs by category">
        {programCategories.map((cat) => (
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
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((program) => (
          <ProgramCard key={program.slug} program={program} />
        ))}
      </div>
    </div>
  );
}
