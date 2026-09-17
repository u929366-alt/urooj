"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  FileQuestion,
  Lock,
  PlayCircle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

export type CurriculumLesson = {
  id: number;
  title: string;
  slug: string;
  durationMinutes: number | null;
  preview: boolean;
  hasVideo: boolean;
  done: boolean;
};

export type CurriculumModule = {
  id: number;
  title: string;
  summary: string | null;
  lessons: CurriculumLesson[];
  quizTitle: string | null;
  assignmentTitle: string | null;
};

/**
 * The course syllabus, one collapsible panel per module.
 *
 * The first module opens by default so the page is never a wall of closed
 * bars, and a module a student is part-way through opens too — otherwise they
 * arrive at their own course and have to hunt for where they were.
 */
export function CourseCurriculum({
  modules,
  courseSlug,
  enrolled,
}: {
  modules: CurriculumModule[];
  courseSlug: string;
  enrolled: boolean;
}) {
  const initiallyOpen = new Set(
    modules
      .filter((module, index) => index === 0 || module.lessons.some((lesson) => !lesson.done && module.lessons.some((l) => l.done)))
      .map((module) => module.id),
  );
  const [open, setOpen] = useState<Set<number>>(initiallyOpen);

  function toggle(id: number) {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0);

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          {modules.length} modules · {totalLessons} lessons
        </p>
        <button
          type="button"
          onClick={() =>
            setOpen((current) =>
              current.size === modules.length ? new Set() : new Set(modules.map((m) => m.id)),
            )
          }
          className="text-sm font-semibold text-primary-600 hover:underline"
        >
          {open.size === modules.length ? "Collapse all" : "Expand all"}
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {modules.map((module) => {
          const isOpen = open.has(module.id);
          const doneCount = module.lessons.filter((lesson) => lesson.done).length;
          return (
            <Card key={module.id} className="overflow-hidden">
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(module.id)}
                  aria-expanded={isOpen}
                  aria-controls={`module-${module.id}`}
                  className="flex w-full items-center gap-3 bg-gray-50/70 px-5 py-4 text-left hover:bg-gray-100"
                >
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-primary-600 transition-transform ${isOpen ? "" : "-rotate-90"}`}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-primary-900">{module.title}</span>
                    {module.summary && (
                      <span className="mt-0.5 block text-sm font-normal text-gray-600">
                        {module.summary}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 text-xs text-gray-500">
                    {doneCount > 0 ? `${doneCount}/${module.lessons.length}` : `${module.lessons.length} lessons`}
                  </span>
                </button>
              </h3>

              {isOpen && (
                <ul id={`module-${module.id}`} className="divide-y divide-gray-50">
                  {module.lessons.map((lesson) => {
                    const canOpen = enrolled || lesson.preview;
                    const Icon = lesson.done ? CheckCircle2 : canOpen ? PlayCircle : Lock;
                    return (
                      <li key={lesson.id} className="flex items-center gap-3 px-5 py-3">
                        <Icon
                          className={
                            lesson.done
                              ? "h-5 w-5 shrink-0 text-accent-500"
                              : canOpen
                                ? "h-5 w-5 shrink-0 text-primary-500"
                                : "h-5 w-5 shrink-0 text-gray-300"
                          }
                          aria-hidden
                        />
                        <span className="flex-1 text-sm text-gray-800">
                          {canOpen ? (
                            <Link
                              href={`/learn/courses/${courseSlug}/${lesson.slug}`}
                              className="hover:underline"
                            >
                              {lesson.title}
                            </Link>
                          ) : (
                            lesson.title
                          )}
                          {lesson.preview && !enrolled && (
                            <span className="ml-2 rounded-full bg-accent-50 px-2 py-0.5 text-xs font-semibold text-accent-700">
                              Free preview
                            </span>
                          )}
                          {!lesson.hasVideo && (
                            <span className="ml-2 text-xs text-gray-400">Video coming soon</span>
                          )}
                        </span>
                        {lesson.durationMinutes ? (
                          <span className="shrink-0 text-xs text-gray-500">
                            {lesson.durationMinutes} min
                          </span>
                        ) : null}
                      </li>
                    );
                  })}

                  {module.quizTitle && (
                    <li className="flex items-center gap-3 bg-primary-50/40 px-5 py-3">
                      <FileQuestion className="h-5 w-5 shrink-0 text-primary-500" aria-hidden />
                      <span className="flex-1 text-sm font-medium text-primary-900">
                        {module.quizTitle}
                      </span>
                    </li>
                  )}
                  {module.assignmentTitle && (
                    <li className="flex items-center gap-3 bg-secondary-50/40 px-5 py-3">
                      <ClipboardList className="h-5 w-5 shrink-0 text-secondary-500" aria-hidden />
                      <span className="flex-1 text-sm font-medium text-primary-900">
                        {module.assignmentTitle}
                      </span>
                    </li>
                  )}

                  {module.lessons.length === 0 && (
                    <li className="px-5 py-3 text-sm text-gray-500">No lessons yet.</li>
                  )}
                </ul>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
