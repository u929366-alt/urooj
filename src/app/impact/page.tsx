import type { Metadata } from "next";
import { Download, FileBarChart } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { StatCounter } from "@/components/ui/StatCounter";
import { stats } from "@/data/stats";
import { financialBreakdown, annualReports, caseStudyHighlights } from "@/data/impact";

export const metadata: Metadata = {
  title: "Impact & Transparency",
  description:
    "Explore Hunarsaaz's impact statistics, case studies, financial transparency, and annual reports documenting our vocational training outcomes.",
};

export default function ImpactPage() {
  return (
    <>
      <PageHero
        breadcrumb="Impact"
        eyebrow="Our Impact"
        title="Measuring What Matters"
        description="Transparency and accountability guide everything we do — here's a look at our reach and results."
      />

      <section className="py-16">
        <Container>
          <dl className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-primary-50 py-8 text-center">
                <dd className="font-display text-3xl font-bold text-primary-900">
                  <StatCounter value={stat.value} suffix={stat.suffix} />
                </dd>
                <dt className="mt-2 text-sm text-gray-600">{stat.label}</dt>
              </div>
            ))}
          </dl>

          <div className="mt-16">
            <SectionHeading eyebrow="Case Studies" title="Where We're Making a Difference" />
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {caseStudyHighlights.map((item) => (
                <Card key={item.title} className="p-8 text-center">
                  <p className="font-display text-4xl font-bold text-secondary-500">{item.stat}</p>
                  <h3 className="mt-3 font-semibold text-primary-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-gray-50 py-16">
        <Container>
          <SectionHeading eyebrow="Financial Transparency" title="How We Use Every Rupee" />
          <Card className="mx-auto mt-10 max-w-2xl p-8">
            <ul className="space-y-5">
              {financialBreakdown.map((item) => (
                <li key={item.label}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{item.label}</span>
                    <span className="font-semibold text-primary-900">{item.percent}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </Container>
      </section>

      <section id="reports" className="scroll-mt-24 py-16">
        <Container>
          <SectionHeading eyebrow="Downloads" title="Annual Reports" />
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
            {annualReports.map((report) => (
              <Card key={report.year} className="flex items-start gap-4 p-5">
                <FileBarChart className="mt-0.5 h-8 w-8 shrink-0 text-primary-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-primary-900">{report.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{report.summary}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-gray-400">
                    <Download className="h-4 w-4" /> PDF available on request
                  </span>
                </div>
              </Card>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-gray-500">
            Full audited financial statements are available on request at{" "}
            <a href="mailto:info@hunarsaaz.org" className="font-medium text-primary-600 hover:underline">
              info@hunarsaaz.org
            </a>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
