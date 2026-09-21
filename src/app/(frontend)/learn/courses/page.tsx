import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import {
  CourseCatalogue,
  type CatalogueCourse,
} from "@/components/learn/CourseCatalogue";
import {
  countLessonsByCourse,
  listCategories,
  listPublishedCourses,
} from "@/lib/lms/queries";
import { siteConfig } from "@/lib/site";
import type { Category, User } from "@/payload-types";

export const metadata: Metadata = {
  title: "Course Catalogue",
  description:
    "Browse Hunarsaaz online courses across IT and digital skills, AI, freelancing, communication, leadership, entrepreneurship and wellbeing. Enrol and study at your own pace.",
  alternates: { canonical: `${siteConfig.url}/learn/courses` },
};

type Params = { searchParams: Promise<{ category?: string }> };

export default async function CourseCataloguePage({ searchParams }: Params) {
  const { category: categorySlug } = await searchParams;
  const [courses, categories, lessonCounts] = await Promise.all([
    listPublishedCourses(),
    listCategories(),
    countLessonsByCourse(),
  ]);

  const rows: CatalogueCourse[] = courses.map((course) => {
    const category = typeof course.category === "object" ? (course.category as Category) : null;
    const instructor = typeof course.instructor === "object" ? (course.instructor as User) : null;
    return {
      id: course.id,
      slug: course.slug ?? "",
      title: course.title,
      summary: course.summary,
      level: course.level ?? null,
      durationWeeks: course.durationWeeks ?? null,
      learningHours: course.learningHours ?? null,
      categoryId: category?.id ?? null,
      categoryTitle: category?.title ?? null,
      instructorName: instructor?.name ?? null,
      lessonCount: lessonCounts[String(course.id)] ?? 0,
      recognition: course.recognition,
    };
  });

  const instructors = [...new Set(rows.map((row) => row.instructorName).filter(Boolean))] as string[];
  const initialCategory = categorySlug
    ? String(categories.find((entry) => entry.slug === categorySlug)?.id ?? "")
    : undefined;

  return (
    <Container className="py-12">
      <SectionHeading
        eyebrow="Learn online"
        title="Course Catalogue"
        description="Forty-five courses across nine subjects. Study at your own pace, and your progress is saved as you go."
      />

      {rows.length === 0 ? (
        <Card className="mt-10 p-8 text-center text-gray-600">
          No courses have been published yet. Please check back soon.
        </Card>
      ) : (
        <CourseCatalogue
          courses={rows}
          categories={categories.map((entry) => ({
            id: entry.id,
            title: entry.title,
            slug: entry.slug ?? "",
          }))}
          instructors={instructors}
          initialCategory={initialCategory}
        />
      )}
    </Container>
  );
}
