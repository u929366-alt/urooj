import type { Metadata } from "next";
import { Briefcase, MapPin, Clock, Mail } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { jobOpenings } from "@/data/partners";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Explore job openings and internship opportunities at Hunarsaaz in Taxila, Punjab, and join our mission to empower communities through skills training.",
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        breadcrumb="Careers"
        eyebrow="Join Our Team"
        title="Build Your Career at Hunarsaaz"
        description="We're always looking for passionate people to help us empower more students across Taxila."
      />

      <section className="py-12">
        <Container>
          <SectionHeading eyebrow="Open Positions" title="Current Openings" />
          <div className="mx-auto mt-10 max-w-3xl space-y-5">
            {jobOpenings.map((job) => (
              <Card key={job.slug} className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-primary-900">{job.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" /> {job.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> {job.location}
                      </span>
                    </div>
                  </div>
                  <Badge tone={job.type === "Internship" ? "accent" : "primary"}>{job.type}</Badge>
                </div>
                <p className="mt-4 text-sm text-gray-600">{job.description}</p>
                <h4 className="mt-4 text-sm font-semibold text-primary-900">Requirements</h4>
                <ul className="mt-2 space-y-1.5 text-sm text-gray-600">
                  {job.requirements.map((req) => (
                    <li key={req} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary-500" /> {req}
                    </li>
                  ))}
                </ul>
                <a
                  href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(
                    `Application: ${job.title}`
                  )}`}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                >
                  <Mail className="h-4 w-4" />
                  Apply via Email
                </a>
              </Card>
            ))}
          </div>

          <Card className="mx-auto mt-10 max-w-3xl p-6 text-center">
            <Clock className="mx-auto h-8 w-8 text-accent-600" />
            <h3 className="mt-3 font-semibold text-primary-900">Don&apos;t see the right role?</h3>
            <p className="mt-2 text-sm text-gray-600">
              We accept general applications and internship inquiries year-round.
              Send your CV to{" "}
              <a href={`mailto:${siteConfig.email}`} className="font-medium text-primary-600 hover:underline">
                {siteConfig.email}
              </a>
              .
            </p>
          </Card>
        </Container>
      </section>
    </>
  );
}
