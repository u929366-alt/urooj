import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  CalendarClock,
  Download,
  GraduationCap,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "NAVTTC Training",
  description:
    "E-Commerce and Certificate in IT (Web Development) — three-month courses at Hunarsaaz, a NAVTTC-registered institute. Register your interest for the next batch.",
};

/**
 * The NAVTTC-registered courses.
 *
 * Was a hand-written online-training.html sitting beside the site with its
 * own header, footer and colours. The content was right; it just looked like
 * somebody else's website. Same information, same links, in the site's own
 * design and menu.
 */
const courses = [
  {
    id: "e-commerce",
    title: "E-Commerce",
    duration: "3 months",
    summary: "Learn how to plan, launch, and run an e-commerce store.",
    outcomes: [
      "Choose products and identify your customers",
      "Create product listings and set prices",
      "Plan payment, delivery, and returns",
    ],
    plan: "https://navttc.gov.pk/wp-content/uploads/2026/08/LessonPlans/2026_PMYSDP_BATCH_03/InforationTechnology/E_COMMERCE.rar",
    register: "/training-interest.php?course=e-commerce",
  },
  {
    id: "web-development",
    title: "Certificate in IT (Web Development)",
    duration: "3 months",
    summary: "Learn to build responsive websites using HTML, CSS, and JavaScript.",
    outcomes: [
      "Structure pages with HTML",
      "Style pages for phones and desktops",
      "Add interactive features and build a project",
    ],
    plan: "https://navttc.gov.pk/wp-content/uploads/2026/08/LessonPlans/2026_PMYSDP_BATCH_03/InforationTechnology/CIT_%28Web_Development%29.rar",
    register: "/training-interest.php?course=web-development",
  },
];

const eligibility = [
  {
    label: "Education",
    detail:
      "Intermediate (FSc, ICS, or FA) or equivalent. Applicants with an IT-related background are preferred.",
  },
  { label: "Age", detail: "18 to 35 years at the time of application." },
  { label: "Nationality", detail: "Pakistani citizen with a valid CNIC." },
  {
    label: "Computer skills",
    detail: "Familiarity with basic computer operations and internet browsing.",
  },
];

export default function OnlineTrainingPage() {
  return (
    <>
      <PageHero
        breadcrumb="NAVTTC"
        eyebrow="NAVTTC-Registered Courses"
        title="E-Commerce and Web Development Training"
        description="Three-month courses taught in person at our Taxila campus, by a NAVTTC-registered institute. Register your interest to hear when the next batch opens."
      />

      <section id="courses" className="scroll-mt-24 py-14">
        <Container>
          <SectionHeading
            eyebrow="What we teach"
            title="The Courses"
            description="Both are taught on campus in Taxila — classroom teaching with tutors, not online study."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {courses.map((course) => (
              <Card key={course.id} className="flex flex-col scroll-mt-24 p-7">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="inline-flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-secondary-500" aria-hidden />
                    <span className="text-sm font-bold text-secondary-700">{course.duration}</span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary-500" aria-hidden />
                    <span className="text-sm font-semibold text-primary-700">
                      On campus, Taxila
                    </span>
                  </span>
                </div>

                <h2 className="mt-3 font-display text-2xl font-bold text-primary-900">
                  {course.title}
                </h2>
                <p className="mt-2 text-gray-600">{course.summary}</p>

                <ul className="mt-5 space-y-2">
                  {course.outcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <GraduationCap
                        className="mt-0.5 h-4 w-4 shrink-0 text-primary-500"
                        aria-hidden
                      />
                      {outcome}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <a
                    href={course.register}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-secondary-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-secondary-600"
                  >
                    Register your interest
                  </a>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                    <a
                      href={course.plan}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold text-primary-600 hover:underline"
                    >
                      <Download className="h-4 w-4" aria-hidden />
                      Course plan (RAR)
                    </a>
                    <a
                      href="#eligibility"
                      className="font-semibold text-primary-600 hover:underline"
                    >
                      Eligibility
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="eligibility" className="scroll-mt-24 bg-gray-50 py-14">
        <Container>
          <SectionHeading
            eyebrow="Who can apply"
            title="Eligibility"
            description="The same criteria apply to both courses."
          />

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {eligibility.map((item) => (
              <div key={item.label} className="flex items-start gap-4 rounded-2xl bg-white p-5">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" aria-hidden />
                <div>
                  <h3 className="font-semibold text-primary-900">{item.label}</h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="where" className="scroll-mt-24 py-14">
        <Container>
          <div className="flex flex-col gap-5 rounded-2xl border-2 border-gray-200 p-7 sm:flex-row sm:items-start sm:p-9">
            <MapPin className="h-6 w-6 shrink-0 text-secondary-500" aria-hidden />
            <div className="min-w-0">
              <h2 className="font-display text-xl font-bold text-primary-900">
                Where the classes are held
              </h2>
              <p className="mt-2 text-gray-700">
                Both courses are taught in person at the Hunarsaaz campus in Taxila. Students
                attend scheduled classes with a tutor and work on the practical exercises in our
                computer lab — this is not a distance-learning course.
              </p>
              <p className="mt-3 text-sm text-gray-600">
                {siteConfig.address} &middot; {siteConfig.hours}
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-primary-200 px-5 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50"
              >
                Find us on the map
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section id="navttc-registration" className="scroll-mt-24 py-14">
        <Container>
          <div className="rounded-2xl border-2 border-primary-200 bg-primary-50 p-7 sm:p-9">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-accent-600" aria-hidden />
              <div className="min-w-0">
                <h2 className="font-display text-xl font-bold text-primary-900">
                  A NAVTTC-registered institute
                </h2>
                <p className="mt-2 text-gray-700">
                  Hunarsaaz is registered with the National Vocational &amp; Technical Training
                  Commission to offer E-Commerce and Certificate in IT (Web Development).
                </p>
                <p className="mt-3 text-sm text-gray-600">
                  Registration number{" "}
                  <strong className="font-mono text-primary-900">NAVTTC-3(4)-NIRC-24-2455</strong>
                  {" — "}
                  <Link
                    href="/about/certifications"
                    className="font-semibold text-primary-600 hover:underline"
                  >
                    see the certificate
                  </Link>
                  .
                </p>

                <p className="mt-5 rounded-xl bg-white px-5 py-4 text-gray-700">
                  When NAVTTC announces a funded batch at Hunarsaaz, eligible candidates can apply
                  for <strong className="text-accent-700">free training</strong>. Register your
                  interest and we will email you when applications open, with the eligibility
                  criteria and how to apply.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
