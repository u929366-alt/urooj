import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/learn/ProgressBar";
import { requireUser } from "@/lib/lms/auth";
import { getCompletedLessonIds, getCourseOutline, listMyEnrollments } from "@/lib/lms/queries";
import type { Course } from "@/payload-types";

export const metadata: Metadata = {
  title: "My Learning",
  description: "Your enrolled courses and progress.",
  robots: { index: false, follow: false },
};

export default async function LearnDashboard() {
  const user = await requireUser("/learn");
  const enrollments = await listMyEnrollments(user.id);

  const cards = await Promise.all(
    enrollments.map(async (enrollment) => {
      const course = enrollment.course as Course;
      if (!course || typeof course !== "object") return null;
      const outline = await getCourseOutline(course.id);
      const completed = await getCompletedLessonIds(user.id, course.id);
      const lessons = outline ? outline.modules.flatMap((entry) => entry.lessons) : [];
      const nextLesson = lessons.find((lesson) => !completed.has(String(lesson.id)));
      return {
        enrollment,
        course,
        total: lessons.length,
        done: lessons.filter((lesson) => completed.has(String(lesson.id))).length,
        nextLesson,
      };
    }),
  );

  const active = cards.filter((card) => card !== null);

  return (
    <Container className="py-12">
      <h1 className="font-display text-3xl font-bold text-primary-900">
        Welcome back, {user.name?.split(" ")[0] ?? "learner"}
      </h1>
      <p className="mt-2 text-gray-600">
        {active.length > 0
          ? "Pick up where you left off."
          : "You have not enrolled in a course yet."}
      </p>

      {active.length === 0 ? (
        <Card className="mt-8 p-8 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-primary-300" />
          <h2 className="mt-4 font-display text-xl font-semibold text-primary-900">
            Browse the course catalogue
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
            Choose a course to begin. Your progress is saved automatically, so you can
            stop and continue on any device.
          </p>
          <Button href="/learn/courses" className="mt-6">
            Browse courses
          </Button>
        </Card>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {active.map(({ enrollment, course, total, done, nextLesson }) => (
            <Card key={enrollment.id} className="flex flex-col p-6">
              <h2 className="font-display text-lg font-semibold text-primary-900">
                <Link href={`/learn/courses/${course.slug}`} className="hover:underline">
                  {course.title}
                </Link>
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">{course.summary}</p>

              <ProgressBar completed={done} total={total} className="mt-4" />

              <div className="mt-5 flex-1" />
              {enrollment.status === "completed" || (total > 0 && done === total) ? (
                <p className="rounded-xl bg-accent-50 px-4 py-2.5 text-center text-sm font-semibold text-accent-700">
                  Course complete
                </p>
              ) : nextLesson ? (
                <Button
                  href={`/learn/courses/${course.slug}/${nextLesson.slug}`}
                  size="sm"
                  className="w-full"
                >
                  {done === 0 ? "Start course" : "Continue"}
                </Button>
              ) : (
                <p className="text-center text-sm text-gray-500">No lessons published yet.</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
