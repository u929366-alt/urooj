import type { Metadata } from "next";
import { CheckCircle2, FileText } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { coreValues } from "@/data/stats";
import Image from "next/image";
import { officeBearers, team } from "@/data/team";
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

export default function AboutPage() {
  return (
    <>
      <PageHero
        breadcrumb="About"
        eyebrow="About Hunarsaaz"
        title="Bridging Education and Employment"
        description="We believe every person deserves the dignity of a skill and a sustainable livelihood."
      />

      <section className="py-20">
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

          <div className="mt-16">
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

          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
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
              label="Hunarsaaz trainers and students"
              icon={Users}
              seed="objectives"
              className="aspect-[4/3] w-full rounded-3xl"
            />
          </div>
        </Container>
      </section>

      <section className="bg-gray-50 py-20">
        <Container>
          <SectionHeading eyebrow="Governance" title="Leadership & Board Members" />
          <div className="mt-12">
            <h3 className="font-display text-lg font-semibold text-primary-900">Office Bearers</h3>
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {officeBearers.map((person) => (
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
          </div>
          <div className="mt-14">
            <h3 className="font-display text-lg font-semibold text-primary-900">Our Team</h3>
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {team.map((person) => (
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
          </div>
        </Container>
      </section>

      <section id="policies" className="scroll-mt-24 bg-primary-900 py-20 text-white">
        <Container>
          <SectionHeading
            eyebrow="Transparency"
            title="Policies & Governance Documents"
            className="[&_h2]:text-white [&_p]:text-primary-200"
          />
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <a href="mailto:info@hunarsaaz.org" className="underline hover:text-white">
              info@hunarsaaz.org
            </a>
            . See our <a href="/impact#reports" className="underline hover:text-white">Annual Reports</a> for financial transparency.
          </p>
        </Container>
      </section>
    </>
  );
}
