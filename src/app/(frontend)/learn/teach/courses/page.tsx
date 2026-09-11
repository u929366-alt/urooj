import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { requireStaff } from "@/lib/lms/auth";
import { listTeachingCourses } from "@/lib/lms/completion";

export const metadata: Metadata = {
  title: "My courses",
  robots: { index: false, follow: false },
};

export default async function TeachingCoursesPage() {
  const staff = await requireStaff("/learn/teach/courses");
  const courses = await listTeachingCourses(staff);

  return (
    <Container className="py-12">
      <h1 className="font-display text-3xl font-bold text-primary-900">My courses</h1>
      <p className="mt-2 text-gray-600">
        {staff.role === "admin"
          ? "Every course on the platform."
          : "Courses you are listed as the instructor for."}
      </p>

      {courses.length === 0 ? (
        <Card className="mt-8 p-8 text-center text-gray-600">
          <Users className="mx-auto h-9 w-9 text-primary-300" aria-hidden />
          <p className="mt-3">
            You are not assigned to any course yet. An admin can set you as the instructor
            on a course in the CMS.
          </p>
        </Card>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map(({ course, enrolled, completed }) => (
            <Card key={course.id} className="p-6">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-display text-lg font-semibold text-primary-900">
                  <Link href={`/learn/teach/courses/${course.slug}`} className="hover:underline">
                    {course.title}
                  </Link>
                </h2>
                <Badge tone={course.status === "published" ? "primary" : "neutral"}>
                  {course.status}
                </Badge>
              </div>
              <dl className="mt-4 flex gap-6 text-sm">
                <div>
                  <dt className="text-gray-500">Enrolled</dt>
                  <dd className="font-display text-2xl font-bold text-primary-900">{enrolled}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Completed</dt>
                  <dd className="font-display text-2xl font-bold text-accent-600">{completed}</dd>
                </div>
              </dl>
              <Link
                href={`/learn/teach/courses/${course.slug}`}
                className="mt-5 inline-block text-sm font-semibold text-primary-600 hover:underline"
              >
                View students →
              </Link>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
