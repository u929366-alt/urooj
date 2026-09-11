import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { CheckCircle2, Circle, Download, Lock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LessonVideo } from "@/components/learn/LessonVideo";
import { ProgressBar } from "@/components/learn/ProgressBar";
import { getCurrentUser } from "@/lib/lms/auth";
import { toggleLessonCompleteAction } from "@/lib/lms/actions";
import {
  flattenLessons,
  getCompletedLessonIds,
  getLessonForStudent,
} from "@/lib/lms/queries";
import type { Media } from "@/payload-types";

type Params = { params: Promise<{ slug: string; lessonSlug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug, lessonSlug } = await params;
  const user = await getCurrentUser();
  const access = await getLessonForStudent(slug, lessonSlug, user);
  return {
    title: access.ok ? access.lesson.title : "Lesson",
    robots: { index: false, follow: false },
  };
}

export default async function LessonPage({ params }: Params) {
  const { slug, lessonSlug } = await params;
  const user = await getCurrentUser();
  const access = await getLessonForStudent(slug, lessonSlug, user);

  if (!access.ok && access.reason === "not-found") notFound();

  if (!access.ok) {
    return (
      <Container className="py-16">
        <Card className="mx-auto max-w-lg p-8 text-center">
          <Lock className="mx-auto h-10 w-10 text-primary-300" />
          <h1 className="mt-4 font-display text-xl font-semibold text-primary-900">
            Enrol to view this lesson
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            This lesson is only available to students enrolled on the course.
          </p>
          <Button href={`/learn/courses/${slug}`} className="mt-6">
            Go to the course
          </Button>
        </Card>
      </Container>
    );
  }

  const { lesson, outline, enrolled } = access;
  const course = outline.course;
  const lessons = flattenLessons(outline);
  const index = lessons.findIndex((item) => item.id === lesson.id);
  const previous = index > 0 ? lessons[index - 1] : null;
  const next = index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null;

  const completedIds = user ? await getCompletedLessonIds(user.id, course.id) : new Set<string>();
  const isDone = completedIds.has(String(lesson.id));
  const doneCount = lessons.filter((item) => completedIds.has(String(item.id))).length;
  const returnTo = `/learn/courses/${slug}/${lessonSlug}`;

  const attachments = (lesson.attachments ?? []).filter(
    (row): row is { label: string; file: Media; id?: string | null } =>
      Boolean(row.file) && typeof row.file === "object",
  );

  return (
    <Container className="py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <article>
          <Link
            href={`/learn/courses/${slug}`}
            className="text-sm font-semibold text-primary-600 hover:underline"
          >
            ← {course.title}
          </Link>
          <h1 className="mt-3 font-display text-3xl font-bold text-primary-900">{lesson.title}</h1>
          {lesson.durationMinutes ? (
            <p className="mt-1 text-sm text-gray-500">{lesson.durationMinutes} min</p>
          ) : null}

          {lesson.videoUrl && (
            <div className="mt-6">
              <LessonVideo url={lesson.videoUrl} title={lesson.title} />
            </div>
          )}

          {lesson.content ? (
            <div className="prose prose-slate mt-8 max-w-none prose-headings:font-display prose-headings:text-primary-900 prose-a:text-primary-600">
              <RichText data={lesson.content as SerializedEditorState} />
            </div>
          ) : (
            !lesson.videoUrl && (
              <p className="mt-8 text-gray-600">
                This lesson has no content yet. Please check back soon.
              </p>
            )
          )}

          {attachments.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-lg font-semibold text-primary-900">
                Lesson materials
              </h2>
              <ul className="mt-3 space-y-2">
                {attachments.map((row, i) => (
                  <li key={row.id ?? i}>
                    <a
                      href={row.file.url ?? "#"}
                      download
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-50"
                    >
                      <Download className="h-4 w-4" aria-hidden />
                      {row.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {enrolled && user?.role === "student" && (
            <form action={toggleLessonCompleteAction} className="mt-10">
              <input type="hidden" name="lessonId" value={String(lesson.id)} />
              <input type="hidden" name="courseId" value={String(course.id)} />
              <input type="hidden" name="completed" value={String(!isDone)} />
              <input type="hidden" name="returnTo" value={returnTo} />
              <button
                type="submit"
                className={
                  isDone
                    ? "inline-flex items-center gap-2 rounded-full border-2 border-accent-500 px-6 py-3 font-semibold text-accent-700 hover:bg-accent-50"
                    : "inline-flex items-center gap-2 rounded-full bg-accent-500 px-6 py-3 font-semibold text-white hover:bg-accent-600"
                }
              >
                {isDone ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" aria-hidden />
                    Completed — mark as not done
                  </>
                ) : (
                  <>
                    <Circle className="h-5 w-5" aria-hidden />
                    Mark as complete
                  </>
                )}
              </button>
            </form>
          )}

          <nav className="mt-10 flex items-center justify-between gap-4 border-t border-gray-100 pt-6">
            {previous ? (
              <Link
                href={`/learn/courses/${slug}/${previous.slug}`}
                className="text-sm font-semibold text-primary-600 hover:underline"
              >
                ← {previous.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/learn/courses/${slug}/${next.slug}`}
                className="text-right text-sm font-semibold text-primary-600 hover:underline"
              >
                {next.title} →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-4">
              <p className="font-semibold text-primary-900">Course content</p>
              {user && <ProgressBar completed={doneCount} total={lessons.length} className="mt-3" />}
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {outline.modules.map(({ module, lessons: moduleLessons }) => (
                <div key={module.id}>
                  <p className="bg-gray-50/70 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {module.title}
                  </p>
                  <ul>
                    {moduleLessons.map((item) => {
                      const active = item.id === lesson.id;
                      const done = completedIds.has(String(item.id));
                      const canOpen = enrolled || item.preview;
                      return (
                        <li key={item.id}>
                          {canOpen ? (
                            <Link
                              href={`/learn/courses/${slug}/${item.slug}`}
                              aria-current={active ? "page" : undefined}
                              className={
                                active
                                  ? "flex items-start gap-2 bg-primary-50 px-5 py-2.5 text-sm font-semibold text-primary-800"
                                  : "flex items-start gap-2 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                              }
                            >
                              {done ? (
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden />
                              ) : (
                                <Circle className="mt-0.5 h-4 w-4 shrink-0 text-gray-300" aria-hidden />
                              )}
                              <span>{item.title}</span>
                            </Link>
                          ) : (
                            <span className="flex items-start gap-2 px-5 py-2.5 text-sm text-gray-400">
                              <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                              {item.title}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
