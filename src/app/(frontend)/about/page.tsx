import type { Metadata } from "next";
import { CheckCircle2, Download, FileText, Play, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { coreValues } from "@/data/stats";
import Image from "next/image";
import { officeBearers, team, type Person } from "@/data/team";
import { credentials, trainingHighlights } from "@/data/highlights";
import { siteConfig } from "@/lib/site";
import { Users, Target, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Hunarsaaz's mission, vision, history, leadership, and the values that guide our vocational training programs in Taxila, Punjab.",
};

const objectives = [
  "Provide accessible, affordable vocational and technical education.",
  "Prioritize inclusion of women and marginalized communities.",
  "Align curricula with real, local employer demand.",
  "Support graduates into employment or self-employment.",
  "Promote financial literacy and entrepreneurship.",
  "Maintain transparency in operations and finances.",
];

const policies = [
  { title: "Child & Student Protection Policy", description: "Safeguarding standards for all students under 18." },
  { title: "Code of Conduct", description: "Standards of behavior for staff, volunteers, and trainers." },
  { title: "Anti-Harassment Policy", description: "Zero-tolerance policy for harassment of any kind." },
  { title: "Financial Transparency Policy", description: "Guidelines for donation handling and reporting." },
  { title: "Data Privacy Policy", description: "How we collect, use, and protect personal information." },
];

function PeopleGrid({ people }: { people: Person[] }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      {people.map((person) => (
        <Card key={person.name} className="p-6">
          <div className="flex items-start gap-4">
            {person.photo ? (
              <Image
                src={person.photo}
                alt={person.name}
                width={80}
                height={80}
                className="h-20 w-20 shrink-0 rounded-xl object-cover"
              />
            ) : (
              <PlaceholderImage
                label={person.name}
                icon={Users}
                seed={person.name}
                className="h-20 w-20 shrink-0 rounded-xl"
              />
            )}
            <div>
              <h4 className="font-semibold text-primary-900">{person.name}</h4>
              <p className="mt-0.5 text-sm text-secondary-600">{person.role}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-gray-600">{person.bio}</p>
        </Card>
      ))}
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        breadcrumb="About"
        eyebrow="About Hunarsaaz"
        title="Bridging Education and Employment"
        description="We believe every person deserves the dignity of a skill and a sustainable livelihood."
      />

      <section className="py-14">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Card className="p-8">
              <Target className="h-8 w-8 text-primary-600" />
              <h2 className="mt-4 text-xl font-bold text-primary-900">Our Mission</h2>
              <p className="mt-2 text-gray-600">
                To empower youth, women, and marginalized communities in Taxila and
                beyond by providing quality vocational and technical education,
                entrepreneurship training, digital skills, and employment
                opportunities — bridging the gap between education and employment.
              </p>
            </Card>
            <Card className="p-8">
              <Eye className="h-8 w-8 text-accent-600" />
              <h2 className="mt-4 text-xl font-bold text-primary-900">Our Vision</h2>
              <p className="mt-2 text-gray-600">
                A Pakistan where every individual has access to the skills and
                opportunities needed to earn a dignified, sustainable
                livelihood.
              </p>
            </Card>
          </div>

          <div className="mt-12">
            <SectionHeading eyebrow="What Drives Us" title="Our Core Values" align="left" />
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {coreValues.map((value) => (
                <div key={value.title} className="rounded-2xl bg-primary-50 p-5">
                  <h3 className="font-semibold text-primary-900">{value.title}</h3>
                  <p className="mt-1.5 text-sm text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow="Our Purpose" title="Objectives" align="left" />
              <ul className="mt-6 space-y-3">
                {objectives.map((obj) => (
                  <li key={obj} className="flex items-start gap-2 text-gray-600">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-500" />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
            <PlaceholderImage
              src="/photos/students-in-the-lab.jpg"
              label="A student at a Hunarsaaz computer, working from handwritten notes beside the keyboard"
              icon={Users}
              seed="objectives"
              position="center 35%"
              className="aspect-[4/3] w-full rounded-3xl"
            />
          </div>
        </Container>
      </section>

      <section className="bg-gray-50 py-14">
        <Container>
          <SectionHeading eyebrow="Governance" title="Leadership" />
          <div className="mt-10">
            <h3 className="font-display text-lg font-semibold text-primary-900">Office Bearers</h3>
            <PeopleGrid people={officeBearers} />
          </div>
          <div className="mt-14">
            <h3 className="font-display text-lg font-semibold text-primary-900">Our Team</h3>
            <PeopleGrid people={team} />
          </div>
        </Container>
      </section>

      <section id="registration" className="scroll-mt-24 py-14">
        <Container>
          <SectionHeading
            eyebrow="Credentials"
            title="Registration & Certification"
            description="Who we are on paper, and the documents to show for it."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {credentials.map((credential) => (
              <Card key={credential.reference} className="overflow-hidden">
                <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-[180px_minmax(0,1fr)]">
                  {credential.preview && (
                    <a
                      href={credential.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block shrink-0"
                    >
                      <Image
                        src={credential.preview}
                        alt={`${credential.title} certificate`}
                        width={180}
                        height={255}
                        className="w-full rounded-xl border border-gray-200 object-cover transition-shadow group-hover:shadow-md sm:w-[180px]"
                      />
                    </a>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" aria-hidden />
                      <h3 className="font-display text-lg font-bold text-primary-900">
                        {credential.title}
                      </h3>
                    </div>

                    <dl className="mt-3 space-y-1.5 text-sm">
                      <div className="flex gap-2">
                        <dt className="w-24 shrink-0 text-gray-500">Issued by</dt>
                        <dd className="min-w-0 text-gray-800">{credential.issuer}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="w-24 shrink-0 text-gray-500">Reference</dt>
                        <dd className="font-mono text-gray-800">{credential.reference}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="w-24 shrink-0 text-gray-500">Dated</dt>
                        <dd className="text-gray-800">{credential.issued}</dd>
                      </div>
                    </dl>

                    <p className="mt-3 text-sm leading-6 text-gray-600">{credential.summary}</p>

                    {credential.redacted && (
                      <p className="mt-2 text-xs italic text-gray-500">{credential.redacted}</p>
                    )}

                    <a
                      href={credential.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-primary-200 px-5 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50"
                    >
                      <Download className="h-4 w-4" aria-hidden />
                      View the document
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section id="highlights" className="scroll-mt-24 bg-gray-50 py-14">
        <Container>
          <SectionHeading
            eyebrow="In the room"
            title="Training Highlights"
            description="Short clips from THRIVE 360, our workshop on mental wellbeing across life, education and the workplace."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {trainingHighlights.map((clip) => (
              <figure key={clip.src}>
                {/* Plain video, no player library: these are short files on
                    our own domain, and preload="none" means nothing is
                    fetched until somebody presses play. */}
                <video
                  controls
                  preload="none"
                  poster={clip.poster}
                  playsInline
                  className="w-full rounded-2xl border border-gray-200 bg-black shadow-sm"
                >
                  <source src={clip.src} type="video/mp4" />
                  Your browser cannot play this clip.{" "}
                  <a href={clip.src}>Download it instead.</a>
                </video>

                <figcaption className="mt-3">
                  <div className="flex items-baseline gap-2">
                    <Play className="h-3.5 w-3.5 shrink-0 translate-y-0.5 text-secondary-500" aria-hidden />
                    <h3 className="font-semibold text-primary-900">{clip.title}</h3>
                    <span className="ml-auto shrink-0 text-xs text-gray-500">
                      {clip.seconds}s
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-gray-600">{clip.description}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="mt-8 text-sm text-gray-600">
            THRIVE 360 is delivered by Ms. Asma Ahmed, Consultant Clinical Psychologist.{" "}
            {/* Absolute, not a route: on the marketing site /workshops does
                not exist — the listing is served by the portal, which is the
                only half that can read the database. */}
            <a
              href={`${siteConfig.portalUrl}/workshops`}
              className="font-semibold text-primary-600 hover:underline"
            >
              See upcoming workshops
            </a>
            .
          </p>
        </Container>
      </section>

      <section id="policies" className="scroll-mt-24 bg-primary-900 py-14 text-white">
        <Container>
          <SectionHeading
            eyebrow="Transparency"
            title="Policies & Governance Documents"
            className="[&_h2]:text-white [&_p]:text-primary-200"
          />
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {policies.map((policy) => (
              <div key={policy.title} className="flex items-start gap-4 rounded-2xl bg-primary-800 p-5">
                <FileText className="mt-0.5 h-6 w-6 shrink-0 text-secondary-400" />
                <div>
                  <h3 className="font-semibold text-white">{policy.title}</h3>
                  <p className="mt-1 text-sm text-primary-200">{policy.description}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-primary-300">
            Full policy documents are available on request at {" "}
            <a href="mailto:ceo@hunarsaaz.pk" className="underline hover:text-white">
              ceo@hunarsaaz.pk
            </a>
            . See our <a href="/impact#reports" className="underline hover:text-white">Annual Reports</a> for financial transparency.
          </p>
        </Container>
      </section>
    </>
  );
}
