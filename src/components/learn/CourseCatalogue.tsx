"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Clock, Search, Signal, SlidersHorizontal, User as UserIcon, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

/**
 * Browsing, searching and filtering the catalogue.
 *
 * Filtering happens in the browser over the full list rather than by refetching
 * per keystroke. The catalogue is a few dozen courses — small enough that this
 * is instant and works on a poor connection, where a request per filter change
 * would not.
 */

export type CatalogueCourse = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  level: string | null;
  durationWeeks: number | null;
  learningHours: number | null;
  categoryId: number | null;
  categoryTitle: string | null;
  instructorName: string | null;
  lessonCount: number;
  recognition: string;
};

export type CatalogueCategory = { id: number; title: string; slug: string };

const LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const DURATIONS = [
  { value: "short", label: "Under 6 weeks" },
  { value: "medium", label: "6 to 10 weeks" },
  { value: "long", label: "Over 10 weeks" },
];

const SORTS = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest" },
  { value: "title", label: "A to Z" },
  { value: "shortest", label: "Shortest first" },
];

const RECOGNITION_LABEL: Record<string, string> = {
  navttc_recognised: "NAVTTC-recognised",
  navttc_aligned: "NAVTTC-aligned",
  hunarsaaz: "Hunarsaaz course",
};

function durationBucket(weeks: number | null): string | null {
  if (weeks == null) return null;
  if (weeks < 6) return "short";
  if (weeks <= 10) return "medium";
  return "long";
}

export function CourseCatalogue({
  courses,
  categories,
  instructors,
  initialCategory,
}: {
  courses: CatalogueCourse[];
  categories: CatalogueCategory[];
  instructors: string[];
  initialCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory ?? "");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");
  const [instructor, setInstructor] = useState("");
  const [sort, setSort] = useState("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const rows = courses.filter((course) => {
      if (needle) {
        const haystack = `${course.title} ${course.summary} ${course.categoryTitle ?? ""}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      if (category && String(course.categoryId) !== category) return false;
      if (level && course.level !== level) return false;
      if (duration && durationBucket(course.durationWeeks) !== duration) return false;
      if (instructor && course.instructorName !== instructor) return false;
      return true;
    });

    const sorted = [...rows];
    if (sort === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "newest") sorted.sort((a, b) => b.id - a.id);
    else if (sort === "shortest") {
      sorted.sort((a, b) => (a.durationWeeks ?? 999) - (b.durationWeeks ?? 999));
    } else {
      // "Recommended" is beginner-first, then shortest — genuinely the order a
      // newcomer should work through. It is not a popularity ranking: nobody
      // has enrolled yet, and inventing one would be dishonest.
      const rank = { beginner: 0, intermediate: 1, advanced: 2 } as Record<string, number>;
      sorted.sort(
        (a, b) =>
          (rank[a.level ?? ""] ?? 3) - (rank[b.level ?? ""] ?? 3) ||
          (a.durationWeeks ?? 999) - (b.durationWeeks ?? 999),
      );
    }
    return sorted;
  }, [courses, query, category, level, duration, instructor, sort]);

  const activeFilters = [category, level, duration, instructor].filter(Boolean).length;

  function clearAll() {
    setCategory("");
    setLevel("");
    setDuration("");
    setInstructor("");
    setQuery("");
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search courses — try Excel, freelancing, burnout"
            aria-label="Search courses"
            className="w-full rounded-full border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-800 shadow-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <button
          type="button"
          onClick={() => setFiltersOpen((open) => !open)}
          aria-expanded={filtersOpen}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-primary-800 shadow-sm hover:bg-gray-50 sm:w-auto"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          Filters
          {activeFilters > 0 && (
            <span className="rounded-full bg-primary-600 px-2 py-0.5 text-xs font-bold text-white">
              {activeFilters}
            </span>
          )}
        </button>

        <label className="sr-only" htmlFor="catalogue-sort">
          Sort courses
        </label>
        <select
          id="catalogue-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-primary-800 shadow-sm outline-none focus:border-primary-400"
        >
          {SORTS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {filtersOpen && (
        <Card className="mt-4 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Filter label="Category" value={category} onChange={setCategory}
              options={categories.map((c) => ({ value: String(c.id), label: c.title }))} />
            <Filter label="Level" value={level} onChange={setLevel} options={LEVELS} />
            <Filter label="Duration" value={duration} onChange={setDuration} options={DURATIONS} />
            <Filter label="Instructor" value={instructor} onChange={setInstructor}
              options={instructors.map((name) => ({ value: name, label: name }))}
              emptyNote={instructors.length === 0 ? "No instructors assigned yet" : undefined} />
          </div>
          {activeFilters > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:underline"
            >
              <X className="h-4 w-4" aria-hidden />
              Clear all filters
            </button>
          )}
        </Card>
      )}

      <p className="mt-6 text-sm text-gray-600" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "course" : "courses"}
        {activeFilters > 0 || query ? ` of ${courses.length}` : ""}
      </p>

      {filtered.length === 0 ? (
        <Card className="mt-4 p-8 text-center">
          <p className="text-gray-600">Nothing matches that. Try fewer filters or a different word.</p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-4 rounded-full bg-secondary-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-secondary-600"
          >
            Clear filters
          </button>
        </Card>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
  emptyNote,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  emptyNote?: string;
}) {
  const id = `filter-${label.toLowerCase()}`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-primary-900">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={options.length === 0}
        className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-primary-400 disabled:bg-gray-50 disabled:text-gray-400"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {emptyNote && <p className="mt-1 text-xs text-gray-500">{emptyNote}</p>}
    </div>
  );
}

function CourseCard({ course }: { course: CatalogueCourse }) {
  return (
    <Card className="flex flex-col overflow-hidden transition hover:shadow-md">
      {/* No photograph yet: a lettered panel is honest and loads instantly,
          where a stock image would suggest a course that does not exist. */}
      <div className="flex h-24 items-end bg-gradient-to-br from-primary-700 to-primary-900 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary-100">
          {course.categoryTitle ?? "Uncategorised"}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          {course.level && <Badge tone="primary" className="capitalize">{course.level}</Badge>}
          <Badge tone="neutral">{RECOGNITION_LABEL[course.recognition] ?? "Course"}</Badge>
        </div>

        <h2 className="mt-3 font-display text-lg font-semibold text-primary-900">
          <Link href={`/learn/courses/${course.slug}`} className="hover:underline">
            {course.title}
          </Link>
        </h2>
        <p className="mt-2 line-clamp-3 text-sm text-gray-600">{course.summary}</p>

        <div className="mt-4 flex-1" />

        <dl className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500">
          {course.durationWeeks ? (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              <dt className="sr-only">Duration</dt>
              <dd>{course.durationWeeks} weeks</dd>
            </div>
          ) : null}
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" aria-hidden />
            <dt className="sr-only">Lessons</dt>
            <dd>{course.lessonCount} lessons</dd>
          </div>
          {course.learningHours ? (
            <div className="flex items-center gap-1.5">
              <Signal className="h-3.5 w-3.5" aria-hidden />
              <dt className="sr-only">Study hours</dt>
              <dd>{course.learningHours} hours</dd>
            </div>
          ) : null}
          {course.instructorName && (
            <div className="flex items-center gap-1.5">
              <UserIcon className="h-3.5 w-3.5" aria-hidden />
              <dt className="sr-only">Instructor</dt>
              <dd>{course.instructorName}</dd>
            </div>
          )}
        </dl>

        <div className="mt-5 flex items-center justify-end">
          <Link
            href={`/learn/courses/${course.slug}`}
            className="rounded-full bg-secondary-500 px-5 py-2 text-sm font-semibold text-white hover:bg-secondary-600"
          >
            View course
          </Link>
        </div>
      </div>
    </Card>
  );
}
