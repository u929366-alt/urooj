import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Download, Printer, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { WorkshopCertificate } from "@/components/learn/WorkshopCertificate";
import { getWorkshopCertificateBySerial } from "@/lib/lms/workshopCertificates";
import { siteConfig } from "@/lib/site";
import type { Workshop } from "@/payload-types";

export const dynamic = "force-dynamic";

/**
 * Somebody's workshop certificate, opened from the link in their email.
 *
 * No account and no sign-in, because a workshop attendee has neither — they
 * registered through a public form and will never log in here. The serial is
 * what stands in for a login: it is long, random, and nothing is shown that
 * is not already printed on the certificate itself. Anyone who has the link
 * has the certificate, which is the same as anyone holding the paper.
 *
 * Not indexed, so the certificates do not end up in search results.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ serial: string }>;
}): Promise<Metadata> {
  const { serial } = await params;
  const certificate = await getWorkshopCertificateBySerial(serial);
  return {
    title: certificate
      ? `Certificate — ${certificate.holderName}`
      : "Certificate not found",
    robots: { index: false, follow: false },
  };
}

export default async function WorkshopCertificatePage({
  params,
}: {
  params: Promise<{ serial: string }>;
}) {
  const { serial } = await params;
  const certificate = await getWorkshopCertificateBySerial(serial);
  if (!certificate) notFound();

  const workshop =
    typeof certificate.workshop === "object" ? (certificate.workshop as Workshop) : null;

  return (
    <Container className="certificate-print py-10">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary-900">
            Your certificate
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {certificate.holderName} — {certificate.workshopTitle}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`/certificates/${certificate.serial}/pdf`}
            className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700"
          >
            <Download className="h-4 w-4" aria-hidden />
            Download PDF
          </a>
          <p className="hidden items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-800 sm:inline-flex">
            <Printer className="h-4 w-4" aria-hidden />
            or Ctrl/Cmd + P to print
          </p>
        </div>
      </div>

      <div className="certificate-scroll">
        <div className="certificate-frame rounded-xl shadow-sm">
          <WorkshopCertificate certificate={certificate} workshop={workshop} />
        </div>
      </div>
      <p className="no-print mt-2 text-xs text-gray-500 sm:hidden">
        Scroll sideways to see the whole certificate, or download the PDF above.
      </p>

      <p className="no-print mt-6 flex items-start gap-2 text-sm text-gray-600">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" aria-hidden />
        <span>
          Certificate number <strong className="font-mono">{certificate.serial}</strong>. Anyone
          can confirm it is genuine at{" "}
          <span className="font-semibold">
            {siteConfig.portalUrl.replace(/^https?:\/\//, "")}/verify/{certificate.serial}
          </span> —
          that page shows only the name, the workshop and the date.
        </span>
      </p>
    </Container>
  );
}
