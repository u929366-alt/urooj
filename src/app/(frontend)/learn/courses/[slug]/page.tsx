import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/learn/ProgressBar";
import { getCurrentUser } from "@/lib/lms/auth";
import { enrollAction } from "@/lib/lms/actions";
import {
  getCompletedLessonIds,
  getCourseBySlug,
  getCourseOutline,
  getEnrollment,
} from "@/lib/lms/queries";
import { siteConfig } from "@/lib/site";
import type { User } from "@/payload-types";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Course not found" };
  return {
    title: course.title,
    description: course.summary,
    alternates: { canonical: `${siteConfig.url}/learn/courses/${course.slug}` },
  };
}

export default async function CoursePage({ params }: Params) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const outline = await getCourseOutline(course.id);
  if (!outline) notFound();

  const user = await getCurrentUser();
  const enrollment = user ? await getEnrollment(user.id, course.id) : null;
  const enrolled = Boolean(enrollment && enrollment.status !== "withdrawn");
  const completed = user ? await getCompletedLessonIds(user.id, course.id) : new Set<string>();

  const lessons = outline.modules.flatMap((entry) => entry.lessons);
  const doneCount = lessons.filter((lesson) => completed.has(String(lesson.id))).length;
  const instructor = course.instructor as User | null;
  const firstLesson = lessons[0];

  return (
    <Container className="py-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <Link href="/learn/courses" className="text-sm font-semibold text-primary-600 hover:underline">
            ← All courses
          </Link>
          <h1 className="mt-3 font-display text-3xl font-bold text-primary-900 sm:text-4xl">
            {course.title}
          </h1>
          <p className="mt-3 text-lg text-gray-600">{course.summary}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {course.level && <Badge tone="primary" className="capitalize">{course.level}</Badge>}
            {course.durationWeeks ? <Badge tone="neutral">{course.durationWeeks} weeks</Badge> : null}
            {instructor?.name && <Badge tone="secondary">Taught by {instructor.name}</Badge>}
          </div>

          <h2 className="mt-10 font-display text-xl font-semibold text-primary-900">
            What you will cover
          </h2>
          <div className="mt-4 space-y-4">
            {outline.modules.length === 0 && (
              <Card className="p-6 text-sm text-gray-600">
                The syllabus for this course is being prepared.
              </Card>
            )}
            {outline.modules.map(({ module, lessons: moduleLessons }) => (
              <Card key={module.id} className="overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50/70 px-5 py-3">
                  <h3 className="font-semibold text-primary-900">{module.title}</h3>
                  {module.summary && (
                    <p className="mt-0.5 text-sm text-gray-600">{module.summary}</p>
                  )}
                </div>
                <ul className="divide-y divide-gray-50">
                  {moduleLessons.map((lesson) => {
                    const isDone = completed.has(String(lesson.id));
                    const canOpen = enrolled || lesson.preview;
                    const Icon = isDone ? CheckCircle2 : canOpen ? PlayCircle : Lock;
                    return (
                      <li key={lesson.id} className="flex items-center gap-3 px-5 py-3">
                        <Icon
                          className={
                            isDone
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
                              href={`/learn/courses/${course.slug}/${lesson.slug}`}
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
                        </span>
                        {lesson.durationMinutes ? (
                          <span className="text-xs text-gray-500">{lesson.durationMinutes} min</span>
                        ) : null}
                      </li>
                    );
                  })}
                  {moduleLessons.length === 0 && (
                    <li className="px-5 py-3 text-sm text-gray-500">No lessons yet.</li>
                  )}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="p-6">
            {enrolled ? (
              <>
                <p className="text-sm font-semibold text-accent-700">You are enrolled</p>
                <ProgressBar completed={doneCount} total={lessons.length} className="mt-4" />
                {firstLesson && (
                  <Link
                    href={`/learn/courses/${course.slug}/${
                      (lessons.find((lesson) => !completed.has(String(lesson.id))) ?? firstLesson).slug
                    }`}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-secondary-500 px-6 py-3 font-semibold text-white hover:bg-secondary-600"
                  >
                    {doneCount === 0 ? "Start course" : "Continue"}
                  </Link>
                )}
              </>
            ) : (
              <>
                <p className="font-display text-lg font-semibold text-primary-900">
                  Enrol for free
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Create an account or sign in to enrol. Your progress is saved as you go.
                </p>
                {course.enrollmentOpen ? (
                  user ? (
                    <form action={enrollAction} className="mt-5">
                      <input type="hidden" name="courseSlug" value={course.slug ?? ""} />
                      <button
                        type="submit"
                        className="w-full rounded-full bg-secondary-500 px-6 py-3 font-semibold text-white hover:bg-secondary-600"
                      >
                        Enrol now
                      </button>
                    </form>
                  ) : (
                    <Link
                      href={`/learn/login?next=${encodeURIComponent(`/learn/courses/${course.slug}`)}`}
                      className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-secondary-500 px-6 py-3 font-semibold text-white hover:bg-secondary-600"
                    >
                      Sign in to enrol
                    </Link>
                  )
                ) : (
                  <p className="mt-5 rounded-xl bg-gray-50 px-4 py-3 text-center text-sm text-gray-600">
                    Enrolment is currently closed.
                  </p>
                )}
              </>
            )}

            <dl className="mt-6 space-y-2 border-t border-gray-100 pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Lessons</dt>
                <dd className="font-semibold text-gray-800">{lessons.length}</dd>
              </div>
              {course.durationWeeks ? (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Duration</dt>
                  <dd className="font-semibold text-gray-800">{course.durationWeeks} weeks</dd>
                </div>
              ) : null}
              {course.language ? (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Language</dt>
                  <dd className="font-semibold capitalize text-gray-800">
                    {course.language === "both" ? "Urdu & English" : course.language}
                  </dd>
                </div>
              ) : null}
            </dl>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
