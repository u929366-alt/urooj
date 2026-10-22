import type { Metadata } from "next";
import Link from "next/link";
import { Download, FileText, Mail, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { reports } from "@/data/reports";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reports & Accounts",
  description:
    "Hunarsaaz's audited financial statements and published reports. Every rupee entrusted to us is accounted for, independently and in public.",
};

export default function ReportsPage() {
  return (
    <>
      <PageHero
        breadcrumb="Reports"
        eyebrow="Accountability"
        title="Reports & Accounts"
        description="Money given to us belongs to the people it was given for. These are the documents that show where it went — audited independently, and published in full rather than summarised."
      />

      <section className="py-12">
        <Container>
          <div className="space-y-6">
            {reports.map((report) => (
              <Card key={report.href} className="p-6 sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-50"
                    aria-hidden
                  >
                    <FileText className="h-7 w-7 text-primary-600" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <Badge tone="secondary">{report.kind}</Badge>
                    <h2 className="mt-3 font-display text-2xl font-bold text-primary-900">
                      {report.title}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-gray-500">{report.period}</p>
                    <p className="mt-3 text-gray-700">{report.summary}</p>

                    {report.preparedBy && (
                      <p className="mt-3 inline-flex items-center gap-2 text-sm text-gray-600">
                        <ShieldCheck className="h-4 w-4 shrink-0 text-accent-600" aria-hidden />
                        Audited by {report.preparedBy}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                      <a
                        href={report.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-secondary-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-secondary-600"
                      >
                        <Download className="h-4 w-4" aria-hidden />
                        Read the report
                      </a>
                      <span className="text-sm text-gray-500">
                        PDF · {report.pages} pages · {report.size}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="mt-10 p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-primary-900">
              Something you cannot find?
            </h2>
            <p className="mt-2 max-w-2xl text-gray-700">
              We are a young organisation and this list is short by honest arithmetic rather than
              by choice — there is one year of accounts because there has been one year. More goes
              up as it is produced. If there is a figure or a document you want in the meantime,
              ask us for it.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center gap-2 font-semibold text-primary-600 hover:underline"
              >
                <Mail className="h-4 w-4" aria-hidden />
                {siteConfig.email}
              </a>
              <Link href="/impact" className="font-semibold text-primary-600 hover:underline">
                How we plan to use every rupee →
              </Link>
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}
