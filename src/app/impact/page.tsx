import type { Metadata } from "next";
import { FileBarChart } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { financialBreakdown } from "@/data/impact";

export const metadata: Metadata = {
  title: "Impact & Transparency",
  description:
    "How Hunarsaaz measures results and maintains financial transparency as it begins its work in vocational training in Taxila, Punjab.",
};

export default function ImpactPage() {
  return (
    <>
      <PageHero
        breadcrumb="Impact"
        eyebrow="Our Impact"
        title="Measuring What Matters"
        description="Hunarsaaz is at the start of its journey. From day one, we are committed to measuring our results honestly and reporting them transparently."
      />

      <section className="bg-gray-50 py-16">
        <Container>
          <SectionHeading
            eyebrow="Financial Transparency"
            title="How We Plan to Use Every Rupee"
            description="Our target allocation for the funds entrusted to us."
          />
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
          <SectionHeading eyebrow="Accountability" title="Annual Reports" />
          <Card className="mx-auto mt-10 flex max-w-3xl items-start gap-4 p-6">
            <FileBarChart className="mt-0.5 h-8 w-8 shrink-0 text-primary-600" />
            <div>
              <h3 className="font-semibold text-primary-900">
                Our first annual report is on its way
              </h3>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                As a newly established organization, we will publish our first
                annual report — covering enrollment, training outcomes, and
                audited financials — at the close of our first operating year.
                Reports will be available on this page.
              </p>
            </div>
          </Card>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-gray-500">
            Questions about our finances or governance? Reach us at{" "}
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
