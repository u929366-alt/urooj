import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, MessageSquare } from "lucide-react";
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
  getCourseAssessments,
  getEnrollment,
  grantsAccess,
} from "@/lib/lms/queries";
import { formatRupees } from "@/lib/lms/payments";
import { CourseCurriculum } from "@/components/learn/CourseCurriculum";
import { mediaPath } from "@/lib/lms/media";
import { SHOW_COURSE_FEES, siteConfig } from "@/lib/site";
import type { User } from "@/payload-types";

type Params = { params: Promise<{ slug: string }> };

// Said plainly, because a student reads this as "what is my certificate worth".
const RECOGNITION: Record<string, { label: string; detail: string }> = {
  navttc_recognised: {
    label: "NAVTTC-recognised",
    detail:
      "This programme is accredited by the National Vocational and Technical Training Commission.",
  },
  navttc_aligned: {
    label: "Aligned to the NAVTTC curriculum",
    detail:
      "The syllabus follows NAVTTC's published curriculum for this trade. The course itself is not NAVTTC-accredited, and the certificate is issued by Hunarsaaz.",
  },
  hunarsaaz: {
    label: "Hunarsaaz course",
    detail: "Written by Hunarsaaz. The certificate is issued by Hunarsaaz.",
  },
};

function SyllabusList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h2 className="font-display text-xl font-semibold text-primary-900">{title}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-gray-600">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-500" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const textsOf = (rows: { text: string }[] | null | undefined): string[] =>
  (rows ?? []).map((row) => row.text).filter(Boolean);

/**
 * Who is teaching this, for a student deciding whether to enrol.
 *
 * Deliberately reads only name, headline, bio and avatar off the user. The
 * record also carries an email, a phone number and a city, and none of that
 * belongs on a page anyone can open.
 */
function InstructorCard({ person }: { person: User }) {
  const avatar = mediaPath(person.avatar);

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        {avatar ? (
          <Image
            src={avatar}
            alt={person.name}
            width={80}
            height={80}
            className="h-20 w-20 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-100 font-display text-2xl font-bold text-primary-700"
          >
            {person.name.trim().charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="font-semibold text-primary-900">{person.name}</h3>
          {person.headline && (
            <p className="mt-0.5 text-sm text-secondary-600">{person.headline}</p>
          )}
          {!person.bio && (
            <p className="mt-2 text-sm text-gray-500">
              Profile still being written.
            </p>
          )}
        </div>
      </div>
      {person.bio && (
        <p className="mt-4 whitespace-pre-line text-sm leading-6 text-gray-600">{person.bio}</p>
      )}
    </Card>
  );
}

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
  const enrolled = grantsAccess(enrollment);
  const awaitingPayment = enrollment?.status === "pending_payment";
  // A stored price is only charged while fees are switched on. With them off,
  // a student enrols and is invoiced separately, so nothing about money is
  // shown here at all.
  const chargeable = SHOW_COURSE_FEES && (course.price ?? 0) > 0;
  const completed = user ? await getCompletedLessonIds(user.id, course.id) : new Set<string>();
  const assessments = await getCourseAssessments(course.id);

  const lessons = outline.modules.flatMap((entry) => entry.lessons);
  const doneCount = lessons.filter((lesson) => completed.has(String(lesson.id))).length;
  const instructor = course.instructor as User | null;
  const firstLesson = lessons[0];
  const recognition = RECOGNITION[course.recognition];
  const objectives = textsOf(course.objectives);
  const outcomes = textsOf(course.outcomes);
  const careers = textsOf(course.careers);

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
            {course.sector && <Badge tone="neutral">{course.sector}</Badge>}
            {course.level && <Badge tone="primary" className="capitalize">{course.level}</Badge>}
            {course.nvqfLevel && <Badge tone="neutral">NVQF Level {course.nvqfLevel}</Badge>}
            {course.durationWeeks ? <Badge tone="neutral">{course.durationWeeks} weeks</Badge> : null}
            {instructor?.name && <Badge tone="secondary">Taught by {instructor.name}</Badge>}
          </div>

          {recognition && (
            <p className="mt-4 rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-900">
              <span className="font-semibold">{recognition.label}.</span>{" "}
              <span className="text-primary-800">{recognition.detail}</span>
            </p>
          )}

          {(course.targetLearners || course.prerequisites) && (
            <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {course.targetLearners && (
                <div className="rounded-2xl bg-gray-50 p-5">
                  <dt className="font-semibold text-primary-900">Who this is for</dt>
                  <dd className="mt-1 text-sm text-gray-600">{course.targetLearners}</dd>
                </div>
              )}
              {course.prerequisites && (
                <div className="rounded-2xl bg-gray-50 p-5">
                  <dt className="font-semibold text-primary-900">What you need first</dt>
                  <dd className="mt-1 text-sm text-gray-600">{course.prerequisites}</dd>
                </div>
              )}
            </dl>
          )}

          <div className="mt-10 space-y-8">
            <SyllabusList title="What this course sets out to do" items={objectives} />
            <SyllabusList title="What you will be able to do" items={outcomes} />
          </div>

          <h2 className="mt-10 font-display text-xl font-semibold text-primary-900">
            What you will cover
          </h2>
          {outline.modules.length === 0 ? (
            <Card className="mt-4 p-6 text-sm text-gray-600">
              The syllabus for this course is being prepared.
            </Card>
          ) : (
            <CourseCurriculum
              courseSlug={course.slug ?? ""}
              enrolled={enrolled}
              modules={outline.modules.map(({ module, lessons: moduleLessons }) => ({
                id: module.id,
                title: module.title,
                summary: module.summary ?? null,
                quizTitle: assessments[String(module.id)]?.quiz ?? null,
                assignmentTitle: assessments[String(module.id)]?.assignment ?? null,
                lessons: moduleLessons.map((lesson) => ({
                  id: lesson.id,
                  title: lesson.title,
                  slug: lesson.slug ?? "",
                  durationMinutes: lesson.durationMinutes ?? null,
                  preview: lesson.preview ?? false,
                  done: completed.has(String(lesson.id)),
                })),
              }))}
            />
          )}

          {instructor && (
            <div className="mt-10">
              <h2 className="font-display text-xl font-semibold text-primary-900">
                Your instructor
              </h2>
              <div className="mt-4">
                <InstructorCard person={instructor} />
              </div>
            </div>
          )}

          {careers.length > 0 && (
            <div className="mt-10">
              <SyllabusList title="Where this can lead" items={careers} />
              <p className="mt-3 text-sm text-gray-500">
                These are the roles the skills apply to. Hunarsaaz does not guarantee
                employment.
              </p>
            </div>
          )}
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
                  {chargeable ? formatRupees(course.price ?? 0) : "Enrol in this course"}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  {awaitingPayment
                    ? "Your place is held. It opens as soon as we confirm your bank transfer."
                    : chargeable
                      ? "Pay by bank transfer. We confirm within a working day, then the course opens."
                      : "Create an account or sign in to enrol. Your progress is saved as you go."}
                </p>
                {course.enrollmentOpen ? (
                  user ? (
                    <form action={enrollAction} className="mt-5">
                      <input type="hidden" name="courseSlug" value={course.slug ?? ""} />
                      <button
                        type="submit"
                        className="w-full rounded-full bg-secondary-500 px-6 py-3 font-semibold text-white hover:bg-secondary-600"
                      >
                        {awaitingPayment
                          ? "View payment details"
                          : chargeable
                            ? "Enrol and pay"
                            : "Enrol now"}
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

            {enrolled && (
              <Link
                href={`/learn/courses/${course.slug}/discussion`}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-primary-600 px-6 py-2.5 text-sm font-semibold text-primary-600 hover:bg-primary-50"
              >
                <MessageSquare className="h-4 w-4" aria-hidden />
                Discussion
              </Link>
            )}

            <dl className="mt-6 space-y-2 border-t border-gray-100 pt-5 text-sm">
              {SHOW_COURSE_FEES && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Fee</dt>
                  <dd className="font-semibold text-gray-800">
                    {formatRupees(course.price ?? 0)}
                  </dd>
                </div>
              )}
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
              {course.nvqfLevel ? (
                <div className="flex justify-between">
                  <dt className="text-gray-500">NVQF level</dt>
                  <dd className="font-semibold text-gray-800">{course.nvqfLevel}</dd>
                </div>
              ) : null}
              {course.courseCode ? (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Course code</dt>
                  <dd className="font-semibold text-gray-800">{course.courseCode}</dd>
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
