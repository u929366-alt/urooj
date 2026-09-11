import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Signal } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { listPublishedCourses } from "@/lib/lms/queries";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Online Course Catalogue",
  description:
    "Browse Hunarsaaz online courses. Enrol free, learn at your own pace, and track your progress.",
  alternates: { canonical: `${siteConfig.url}/learn/courses` },
};

const levelLabels: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default async function CourseCataloguePage() {
  const courses = await listPublishedCourses();

  return (
    <Container className="py-12">
      <SectionHeading
        eyebrow="Learn online"
        title="Course Catalogue"
        description="Enrol free and study at your own pace. Your progress is saved as you go."
      />

      {courses.length === 0 ? (
        <Card className="mt-10 p-8 text-center text-gray-600">
          No courses have been published yet. Please check back soon.
        </Card>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col p-6">
              <div className="flex flex-wrap items-center gap-2">
                {course.level && <Badge tone="primary">{levelLabels[course.level] ?? course.level}</Badge>}
                {!course.enrollmentOpen && <Badge tone="neutral">Enrolment closed</Badge>}
              </div>

              <h2 className="mt-3 font-display text-lg font-semibold text-primary-900">
                <Link href={`/learn/courses/${course.slug}`} className="hover:underline">
                  {course.title}
                </Link>
              </h2>
              <p className="mt-2 line-clamp-3 text-sm text-gray-600">{course.summary}</p>

              <div className="mt-4 flex-1" />
              <dl className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-gray-500">
                {course.durationWeeks ? (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    <dt className="sr-only">Duration</dt>
                    <dd>{course.durationWeeks} weeks</dd>
                  </div>
                ) : null}
                {course.language ? (
                  <div className="flex items-center gap-1.5">
                    <Signal className="h-3.5 w-3.5" aria-hidden />
                    <dt className="sr-only">Language</dt>
                    <dd className="capitalize">
                      {course.language === "both" ? "Urdu & English" : course.language}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
