import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, BookOpen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  countLessonsByCourse,
  getCategoryBySlug,
  listCategories,
  listInstructors,
  listPublishedCourses,
} from "@/lib/lms/queries";
import { siteConfig } from "@/lib/site";
import type { Category, User } from "@/payload-types";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const categories = await listCategories();
  return categories.map((category) => ({ slug: category.slug ?? "" }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: category.title,
    description: category.summary,
    alternates: { canonical: `${siteConfig.url}/learn/categories/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [allCourses, lessonCounts, allInstructors] = await Promise.all([
    listPublishedCourses(),
    countLessonsByCourse(),
    listInstructors(),
  ]);

  const courses = allCourses.filter((course) => {
    const id = typeof course.category === "object" ? course.category?.id : course.category;
    return id === category.id;
  });

  // Instructors either assigned to this category, or teaching a course in it.
  const courseInstructorIds = new Set(
    courses
      .map((course) => (typeof course.instructor === "object" ? course.instructor?.id : course.instructor))
      .filter(Boolean),
  );
  const instructors = allInstructors.filter((person) => {
    if (courseInstructorIds.has(person.id)) return true;
    const taught = (person.teachingCategories ?? []) as (number | Category)[];
    return taught.some((entry) => (typeof entry === "object" ? entry.id : entry) === category.id);
  });

  return (
    <Container className="py-12">
      <Link href="/learn/courses" className="text-sm font-semibold text-primary-600 hover:underline">
        ← All courses
      </Link>
      <h1 className="mt-3 font-display text-3xl font-bold text-primary-900 sm:text-4xl">
        {category.title}
      </h1>
      <p className="mt-3 max-w-3xl text-lg text-gray-600">{category.summary}</p>

      <h2 className="mt-12 font-display text-xl font-semibold text-primary-900">
        {courses.length} {courses.length === 1 ? "course" : "courses"}
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col p-6">
            <div className="flex flex-wrap gap-2">
              {course.level && <Badge tone="primary" className="capitalize">{course.level}</Badge>}
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold text-primary-900">
              <Link href={`/learn/courses/${course.slug}`} className="hover:underline">
                {course.title}
              </Link>
            </h3>
            <p className="mt-2 line-clamp-3 text-sm text-gray-600">{course.summary}</p>
            <div className="flex-1" />
            <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500">
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
                <dd>{lessonCounts[String(course.id)] ?? 0} lessons</dd>
              </div>
            </dl>
          </Card>
        ))}
      </div>

      <section className="mt-14">
        <h2 className="font-display text-xl font-semibold text-primary-900">Our instructors</h2>
        {instructors.length === 0 ? (
          <Card className="mt-4 p-6 text-sm text-gray-600">
            No instructor has been assigned to this subject yet. Courses are open to enrol in the
            meantime, and the instructor will appear here once one is assigned in the admin panel.
          </Card>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {instructors.map((person) => (
              <InstructorRow key={person.id} person={person} courses={courses} />
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}

function InstructorRow({ person, courses }: { person: User; courses: { id: number; title: string; slug?: string | null; instructor?: unknown }[] }) {
  const avatar = typeof person.avatar === "object" && person.avatar?.url ? person.avatar.url : null;
  const expertise = (person.expertise ?? []).map((row) => row.text).filter(Boolean);
  const taught = courses.filter((course) => {
    const id = typeof course.instructor === "object" && course.instructor
      ? (course.instructor as { id: number }).id
      : course.instructor;
    return id === person.id;
  });

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        {avatar ? (
          <Image
            src={avatar}
            alt={person.name}
            width={72}
            height={72}
            className="h-18 w-18 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-primary-100 font-display text-2xl font-bold text-primary-700"
          >
            {person.name.trim().charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="font-semibold text-primary-900">{person.name}</h3>
          {person.headline && <p className="mt-0.5 text-sm text-secondary-600">{person.headline}</p>}
          {person.organisation && <p className="mt-0.5 text-sm text-gray-500">{person.organisation}</p>}
          {person.isPlaceholder && (
            <Badge tone="neutral" className="mt-2">Example profile — not a real person</Badge>
          )}
        </div>
      </div>

      {person.bio && <p className="mt-4 text-sm leading-6 text-gray-600">{person.bio}</p>}

      {expertise.length > 0 && (
        <p className="mt-3 text-sm text-gray-600">
          <span className="font-semibold text-primary-900">Expertise: </span>
          {expertise.join(" | ")}
        </p>
      )}

      {taught.length > 0 && (
        <div className="mt-3 text-sm text-gray-600">
          <span className="font-semibold text-primary-900">Courses: </span>
          {taught.map((course, index) => (
            <span key={course.id}>
              {index > 0 && ", "}
              <Link href={`/learn/courses/${course.slug}`} className="text-primary-600 hover:underline">
                {course.title}
              </Link>
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
