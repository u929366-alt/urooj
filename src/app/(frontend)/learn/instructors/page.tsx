import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { listCategories, listInstructors, listPublishedCourses } from "@/lib/lms/queries";
import { siteConfig } from "@/lib/site";
import type { Category, Course, User } from "@/payload-types";

export const metadata: Metadata = {
  title: "Our Instructors",
  description:
    "The people who teach Hunarsaaz courses — their background, expertise and the courses they lead.",
  alternates: { canonical: `${siteConfig.url}/learn/instructors` },
};

function idOf(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === "object") return (value as { id?: number }).id ?? null;
  return value as number;
}

export default async function InstructorsPage() {
  const [instructors, courses, categories] = await Promise.all([
    listInstructors(),
    listPublishedCourses(),
    listCategories(),
  ]);

  return (
    <Container className="py-12">
      <SectionHeading
        eyebrow="Who teaches here"
        title="Our Instructors"
        description="Every course is led by a named person. Their background is here so you know who you are learning from before you enrol."
      />

      {instructors.length === 0 ? (
        <Card className="mt-10 p-8 text-center text-gray-600">
          <p>No instructor profiles have been published yet.</p>
          <p className="mt-2 text-sm">
            Staff can add them in the admin panel under Users, then assign each to a course.
          </p>
        </Card>
      ) : (
        <div className="mt-10 space-y-6">
          {instructors.map((person) => (
            <InstructorProfile
              key={person.id}
              person={person}
              courses={courses.filter((course) => idOf(course.instructor) === person.id)}
              categories={categories}
            />
          ))}
        </div>
      )}
    </Container>
  );
}

function InstructorProfile({
  person,
  courses,
  categories,
}: {
  person: User;
  courses: Course[];
  categories: Category[];
}) {
  const avatar = typeof person.avatar === "object" && person.avatar?.url ? person.avatar.url : null;
  const expertise = (person.expertise ?? []).map((row) => row.text).filter(Boolean);
  const qualifications = (person.qualifications ?? []).map((row) => row.text).filter(Boolean);
  const taughtCategoryIds = new Set(
    ((person.teachingCategories ?? []) as (number | Category)[]).map((entry) => idOf(entry)),
  );
  const taughtCategories = categories.filter((category) => taughtCategoryIds.has(category.id));

  return (
    <Card className="p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[auto_minmax(0,1fr)]">
        <div>
          {avatar ? (
            <Image
              src={avatar}
              alt={person.name}
              width={120}
              height={120}
              className="h-30 w-30 rounded-2xl object-cover"
            />
          ) : (
            <span
              aria-hidden
              className="flex h-[120px] w-[120px] items-center justify-center rounded-2xl bg-primary-100 font-display text-4xl font-bold text-primary-700"
            >
              {person.name.trim().charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-xl font-bold text-primary-900">{person.name}</h2>
            {person.isPlaceholder && (
              <Badge tone="neutral">Example profile — not a real person</Badge>
            )}
          </div>
          {person.headline && <p className="mt-1 text-secondary-600">{person.headline}</p>}
          {person.organisation && <p className="mt-0.5 text-sm text-gray-500">{person.organisation}</p>}

          {person.bio ? (
            <p className="mt-4 whitespace-pre-line text-sm leading-6 text-gray-600">{person.bio}</p>
          ) : (
            <p className="mt-4 text-sm text-gray-500">Biography still being written.</p>
          )}

          <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {expertise.length > 0 && (
              <Detail label="Areas of expertise">
                <div className="flex flex-wrap gap-1.5">
                  {expertise.map((item) => (
                    <span key={item} className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-800">
                      {item}
                    </span>
                  ))}
                </div>
              </Detail>
            )}

            {qualifications.length > 0 && (
              <Detail label="Qualifications">
                <ul className="space-y-1 text-sm text-gray-600">
                  {qualifications.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Detail>
            )}

            {person.experience && (
              <Detail label="Professional experience">
                <p className="text-sm text-gray-600">{person.experience}</p>
              </Detail>
            )}

            {taughtCategories.length > 0 && (
              <Detail label="Teaches in">
                <ul className="space-y-1 text-sm">
                  {taughtCategories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/learn/categories/${category.slug}`}
                        className="text-primary-600 hover:underline"
                      >
                        {category.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Detail>
            )}
          </dl>

          {courses.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Courses</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {courses.map((course) => (
                  <li key={course.id}>
                    <Link
                      href={`/learn/courses/${course.slug}`}
                      className="inline-flex rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-primary-800 hover:bg-gray-50"
                    >
                      {course.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {person.linkedin && (
            <a
              href={person.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:underline"
            >
              View profile
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1.5">{children}</dd>
    </div>
  );
}
