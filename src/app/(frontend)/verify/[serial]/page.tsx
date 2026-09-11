import type { Metadata } from "next";
import { BadgeCheck, XCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { getCertificateBySerial } from "@/lib/lms/completion";
import { siteConfig } from "@/lib/site";

/**
 * Public certificate check, for an employer holding a printout.
 *
 * Deliberately shows only the holder's name, the course and the date — never
 * an email, phone number, grades or progress. Enough to confirm the
 * certificate is genuine, and nothing more.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ serial: string }>;
}): Promise<Metadata> {
  const { serial } = await params;
  return {
    title: `Verify certificate ${serial}`,
    description: `Check whether certificate ${serial} was issued by ${siteConfig.name}.`,
    robots: { index: false, follow: false },
  };
}

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ serial: string }>;
}) {
  const { serial } = await params;
  const certificate = await getCertificateBySerial(serial);

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-xl">
        <h1 className="font-display text-3xl font-bold text-primary-900">
          Certificate verification
        </h1>

        {certificate ? (
          <Card className="mt-6 border-accent-200 p-8">
            <div className="flex items-center gap-3">
              <BadgeCheck className="h-8 w-8 shrink-0 text-accent-500" aria-hidden />
              <p className="font-display text-lg font-semibold text-accent-800">
                This is a genuine {siteConfig.name} certificate.
              </p>
            </div>

            <dl className="mt-6 space-y-3 border-t border-gray-100 pt-5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Awarded to</dt>
                <dd className="text-right font-semibold text-gray-900">
                  {certificate.studentName}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Course</dt>
                <dd className="text-right font-semibold text-gray-900">
                  {certificate.courseTitle}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Date issued</dt>
                <dd className="text-right font-semibold text-gray-900">
                  {new Date(certificate.issuedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Certificate number</dt>
                <dd className="text-right font-mono font-semibold text-gray-900">
                  {certificate.serial}
                </dd>
              </div>
            </dl>
          </Card>
        ) : (
          <Card className="mt-6 p-8">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 shrink-0 text-red-500" aria-hidden />
              <p className="font-display text-lg font-semibold text-gray-900">
                No certificate found with the number{" "}
                <span className="font-mono">{serial}</span>.
              </p>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Check the number for typing mistakes. If it still cannot be found, contact{" "}
              <a href={`mailto:${siteConfig.email}`} className="font-semibold text-primary-600 hover:underline">
                {siteConfig.email}
              </a>
              .
            </p>
          </Card>
        )}
      </div>
    </Container>
  );
}
