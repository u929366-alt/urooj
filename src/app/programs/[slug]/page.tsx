import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  Users,
  Wallet,
  CalendarClock,
  CheckCircle2,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { programs } from "@/data/programs";
import { getIcon } from "@/lib/icons";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = programs.find((p) => p.slug === slug);
  if (!program) return {};
  return {
    title: program.title,
    description: program.summary,
    openGraph: { title: program.title, description: program.summary },
  };
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = programs.find((p) => p.slug === slug);
  if (!program) notFound();

  const Icon = getIcon(program.icon);

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: program.title,
    description: program.description,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      sameAs: siteConfig.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <PageHero breadcrumb={program.title} eyebrow={program.category} title={program.title} description={program.summary} />

      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PlaceholderImage
                label={program.title}
                icon={Icon}
                seed={program.slug}
                className="aspect-[16/9] w-full rounded-3xl"
              />

              <h2 className="mt-10 font-display text-2xl font-bold text-primary-900">Overview</h2>
              <p className="mt-3 text-gray-600">{program.description}</p>

              <h2 className="mt-10 font-display text-2xl font-bold text-primary-900">Curriculum</h2>
              <ul className="mt-4 space-y-3">
                {program.curriculum.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-600">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-500" />
                    {item}
                  </li>
                ))}
              </ul>

              <h2 className="mt-10 font-display text-2xl font-bold text-primary-900">Career Opportunities</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {program.careerOpportunities.map((career) => (
                  <span key={career} className="flex items-center gap-1.5 rounded-full bg-accent-50 px-4 py-2 text-sm text-accent-700">
                    <Briefcase className="h-3.5 w-3.5" /> {career}
                  </span>
                ))}
              </div>

              <h2 className="mt-10 font-display text-2xl font-bold text-primary-900">Instructor</h2>
              <Card className="mt-4 flex items-center gap-4 p-5">
                <PlaceholderImage
                  label={program.instructor.name}
                  icon={Users}
                  seed={program.instructor.name}
                  className="h-16 w-16 shrink-0 rounded-full"
                />
                <div>
                  <p className="font-semibold text-primary-900">{program.instructor.name}</p>
                  <p className="text-sm text-gray-600">{program.instructor.bio}</p>
                </div>
              </Card>

              <h2 className="mt-10 font-display text-2xl font-bold text-primary-900">
                Frequently Asked Questions
              </h2>
              <div className="mt-4 space-y-4">
                {program.faqs.map((faq) => (
                  <Card key={faq.question} className="p-5">
                    <h3 className="font-semibold text-primary-900">{faq.question}</h3>
                    <p className="mt-1.5 text-sm text-gray-600">{faq.answer}</p>
                  </Card>
                ))}
              </div>

              <h2 className="mt-10 font-display text-2xl font-bold text-primary-900">Gallery</h2>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[1, 2, 3].map((n) => (
                  <PlaceholderImage
                    key={n}
                    label={`${program.title} in practice`}
                    icon={Icon}
                    seed={`${program.slug}-${n}`}
                    className="aspect-square rounded-xl"
                  />
                ))}
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <Card className="p-6">
                <Badge tone="primary">{program.category}</Badge>
                <dl className="mt-5 space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                    <div>
                      <dt className="font-semibold text-primary-900">Duration</dt>
                      <dd className="text-gray-600">{program.duration}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                    <div>
                      <dt className="font-semibold text-primary-900">Eligibility</dt>
                      <dd className="text-gray-600">{program.eligibility}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Wallet className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                    <div>
                      <dt className="font-semibold text-primary-900">Fee</dt>
                      <dd className="text-gray-600">{program.fee}</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                    <div>
                      <dt className="font-semibold text-primary-900">Schedule</dt>
                      <dd className="text-gray-600">{program.scheduleNote}</dd>
                    </div>
                  </div>
                </dl>
                <Button href={`/admissions?program=${program.slug}`} className="mt-6 w-full">
                  Apply for This Program
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Link
                  href="/programs"
                  className="mt-4 block text-center text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  ← Back to all programs
                </Link>
              </Card>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
