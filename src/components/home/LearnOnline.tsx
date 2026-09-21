import { ArrowRight, Award, BookOpen, Laptop, Wallet } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site";

/**
 * Signpost from the marketing site to the learning portal.
 *
 * The two are separate applications — this site is a static export and cannot
 * read the portal's database — so the numbers below are written here rather
 * than counted live. Update them when the catalogue changes substantially.
 */
const CATALOGUE = { courses: 45, subjects: 9 };

const POINTS = [
  { icon: Wallet, text: "Free to enrol" },
  { icon: Laptop, text: "Study at your own pace" },
  { icon: BookOpen, text: "Quizzes and marked assignments" },
  { icon: Award, text: "Certificate on completion" },
];

export function LearnOnline() {
  return (
    <section className="bg-primary-900 py-16 text-white">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary-400">
              Hunarsaaz Learning
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Learn online, wherever you are
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-primary-100">
              {CATALOGUE.courses} free courses across {CATALOGUE.subjects} subjects — digital
              skills, artificial intelligence, freelancing, business and wellbeing. Written for the
              way people actually work in Pakistan.
            </p>

            <ul className="mt-7 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {POINTS.map((point) => (
                <li key={point.text} className="flex items-center gap-2.5 text-primary-100">
                  <point.icon className="h-5 w-5 shrink-0 text-secondary-400" aria-hidden />
                  {point.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 lg:w-64">
            <a
              href={`${siteConfig.portalUrl}/learn`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary-500 px-7 py-3.5 font-semibold text-white hover:bg-secondary-600"
            >
              Explore courses
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a
              href={`${siteConfig.portalUrl}/learn/register`}
              className="inline-flex items-center justify-center rounded-full border-2 border-white/40 px-7 py-3.5 font-semibold text-white hover:bg-white/10"
            >
              Create an account
            </a>
            <p className="text-center text-xs text-primary-300">
              Opens learn.hunarsaaz.pk
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
