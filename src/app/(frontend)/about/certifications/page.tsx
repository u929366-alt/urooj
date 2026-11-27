import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Download, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { credentials } from "@/data/highlights";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Certifications & Registration",
  description:
    "Hunarsaaz is registered with NAVTTC as a TVET institute, certified by the Pakistan Centre for Philanthropy, and registered as a society under the Societies Registration Act 1860. Every certificate is published here.",
};

/**
 * What Hunarsaaz is on paper, with the paperwork.
 *
 * A page of its own rather than a section buried in About: this is what a
 * donor's finance team, a partner organisation or a parent checking an
 * institute actually comes looking for, and it should be linkable on its
 * own. Only credentials we can show a document for are listed — an
 * organisation that claims an accreditation it cannot evidence invites
 * exactly the question it was hoping to avoid.
 */
export default function CertificationsPage() {
  return (
    <>
      <PageHero
        breadcrumb="Certifications"
        eyebrow="Credentials"
        title="Certifications & Registration"
        description="Who we are on paper, and the documents to show for it."
      />

      <section className="py-14">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
                      <h2 className="font-display text-lg font-bold text-primary-900">
                        {credential.title}
                      </h2>
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

          <p className="mt-10 text-sm leading-6 text-gray-600">
            Each issuing body will confirm these independently — we have published the
            reference numbers for exactly that reason. For anything else about our governance,
            see{" "}
            <Link href="/about#policies" className="font-semibold text-primary-600 hover:underline">
              our policies
            </Link>{" "}
            and{" "}
            <Link href="/reports" className="font-semibold text-primary-600 hover:underline">
              audited accounts
            </Link>
            , or write to{" "}
            <a href={`mailto:${siteConfig.email}`} className="font-semibold text-primary-600 hover:underline">
              {siteConfig.email}
            </a>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
