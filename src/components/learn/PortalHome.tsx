import Link from "next/link";
import {
  ArrowRight,
  Award,
  Battery,
  BookOpen,
  Compass,
  Heart,
  Laptop,
  MessageSquare,
  Monitor,
  Shield,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
  Wifi,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Category, Course } from "@/payload-types";

/** The category icons, mapped from the fixed list on the collection. */
const ICONS = {
  monitor: Monitor,
  sparkles: Sparkles,
  laptop: Laptop,
  message: MessageSquare,
  compass: Compass,
  trending: TrendingUp,
  heart: Heart,
  battery: Battery,
  shield: Shield,
  book: BookOpen,
} as const;

/**
 * Sequences worth following, rather than picking courses at random.
 * Defined here because they are editorial judgement about what to learn in
 * what order, not data anyone would maintain in the admin panel.
 */
const PATHWAYS = [
  {
    title: "Digital skills to earning",
    description: "Start with a marketable skill, then learn to sell it and work with clients.",
    steps: ["microsoft-excel", "graphic-design", "freelancing-fundamentals"],
  },
  {
    title: "Understanding AI, then using it",
    description: "Begin with what AI actually is before going anywhere near the technical courses.",
    steps: ["ai-for-everyone", "ai-and-data-science", "ai-and-machine-learning"],
  },
  {
    title: "Selling online",
    description: "Marketing, then the shop, then the business sense to keep it running.",
    steps: ["digital-marketing", "e-commerce", "small-business-finance"],
  },
] as const;

const REASONS = [
  { icon: BookOpen, title: "Practical, not theoretical", text: "Every course ends in work you have actually produced — a campaign, a shop, a portfolio, a report." },
  { icon: Wifi, title: "Built for how you connect", text: "Text-first lessons that load on a slow connection, and video where it genuinely helps." },
  { icon: UserPlus, title: "Enrol in minutes", text: "Register, pick a course and start the same day. No entry test and no waiting for a new intake." },
  { icon: Compass, title: "Learn at your own pace", text: "Your progress is saved as you go, on any device. Stop and continue whenever you can." },
  { icon: Award, title: "A certificate you can verify", text: "Complete a course and get a certificate with an ID anyone can check online." },
  { icon: Users, title: "Written for Pakistan", text: "Rupees, local platforms, local employers, and the obstacles that actually come up here." },
];

export function PortalHome({
  categories,
  courses,
  courseCounts,
  instructorCount,
}: {
  categories: Category[];
  courses: Course[];
  courseCounts: Record<string, number>;
  instructorCount: number;
}) {
  const bySlug = new Map(courses.map((course) => [course.slug ?? "", course]));
  const featured = courses.filter((course) => (course.level ?? "") === "beginner").slice(0, 6);

  return (
    <>
      <section className="bg-gradient-to-br from-primary-900 to-primary-700 py-16 text-white sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <Badge tone="secondary">Hunarsaaz Learning</Badge>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
              Learn skills. Build your future.
            </h1>
            <p className="mt-5 text-lg text-primary-100">
              Practical, market-oriented courses in digital skills, AI, freelancing, business and
              wellbeing — studied at your own pace, and written for the way people actually work in
              Pakistan.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/learn/courses"
                className="inline-flex items-center gap-2 rounded-full bg-secondary-500 px-7 py-3.5 font-semibold text-white hover:bg-secondary-600"
              >
                Explore courses
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/learn/register"
                className="inline-flex items-center rounded-full border-2 border-white/40 px-7 py-3.5 font-semibold text-white hover:bg-white/10"
              >
                Start learning
              </Link>
            </div>
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              <Stat value={String(courses.length)} label="courses" />
              <Stat value={String(categories.length)} label="subject areas" />
            </dl>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <h2 className="font-display text-2xl font-bold text-primary-900">Browse by subject</h2>
          <p className="mt-2 text-gray-600">Nine areas, five courses in each.</p>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = ICONS[(category.icon ?? "book") as keyof typeof ICONS] ?? BookOpen;
              const count = courseCounts[String(category.id)] ?? 0;
              return (
                <Link
                  key={category.id}
                  href={`/learn/categories/${category.slug}`}
                  className="group rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                >
                  <Card className="h-full p-6 transition group-hover:shadow-md">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-semibold text-primary-900 group-hover:underline">
                      {category.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">{category.summary}</p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-secondary-600">
                      {count} {count === 1 ? "course" : "courses"}
                    </p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {featured.length > 0 && (
        <section className="bg-gray-50 py-14">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-primary-900">Good places to start</h2>
                <p className="mt-2 text-gray-600">Beginner courses that assume nothing.</p>
              </div>
              <Link href="/learn/courses" className="text-sm font-semibold text-primary-600 hover:underline">
                See all {courses.length} courses →
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((course) => (
                <Card key={course.id} className="flex flex-col p-6">
                  <Badge tone="primary" className="w-fit capitalize">{course.level}</Badge>
                  <h3 className="mt-3 font-display text-lg font-semibold text-primary-900">
                    <Link href={`/learn/courses/${course.slug}`} className="hover:underline">
                      {course.title}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-gray-600">{course.summary}</p>
                  <div className="flex-1" />
                  <p className="mt-4 text-xs text-gray-500">
                    {course.durationWeeks ? `${course.durationWeeks} weeks` : ""}
                    {course.learningHours ? ` · ${course.learningHours} hours` : ""}
                  </p>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="py-14">
        <Container>
          <h2 className="font-display text-2xl font-bold text-primary-900">Learning pathways</h2>
          <p className="mt-2 text-gray-600">
            Courses in an order that builds. Each one assumes the one before it.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {PATHWAYS.map((pathway) => {
              const steps = pathway.steps.map((slug) => bySlug.get(slug)).filter(Boolean) as Course[];
              if (steps.length === 0) return null;
              return (
                <Card key={pathway.title} className="p-6">
                  <h3 className="font-display text-lg font-semibold text-primary-900">{pathway.title}</h3>
                  <p className="mt-1.5 text-sm text-gray-600">{pathway.description}</p>
                  <ol className="mt-5 space-y-3">
                    {steps.map((course, index) => (
                      <li key={course.id} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-800">
                          {index + 1}
                        </span>
                        <Link
                          href={`/learn/courses/${course.slug}`}
                          className="text-sm font-medium text-gray-800 hover:text-primary-700 hover:underline"
                        >
                          {course.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-gray-50 py-14">
        <Container>
          <h2 className="font-display text-2xl font-bold text-primary-900">Why learn with Hunarsaaz</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {REASONS.map((reason) => (
              <div key={reason.title} className="rounded-2xl bg-white p-6 shadow-sm">
                <reason.icon className="h-7 w-7 text-secondary-500" aria-hidden />
                <h3 className="mt-3 font-semibold text-primary-900">{reason.title}</h3>
                <p className="mt-1.5 text-sm text-gray-600">{reason.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <Card className="flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-primary-900">
                {instructorCount > 0 ? "Learn from our instructors" : "Our instructors"}
              </h2>
              <p className="mt-2 max-w-xl text-gray-600">
                {instructorCount > 0
                  ? "Every course is taught by a named instructor whose background you can read before you enrol."
                  : "Instructor profiles are being added. Courses are open to enrol in the meantime."}
              </p>
            </div>
            <Link
              href="/learn/instructors"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary-700 px-6 py-3 font-semibold text-white hover:bg-primary-800"
            >
              <Users className="h-4 w-4" aria-hidden />
              Meet the instructors
            </Link>
          </Card>
        </Container>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="font-display text-3xl font-bold text-white">{value}</dd>
      <p className="text-sm text-primary-200">{label}</p>
    </div>
  );
}
