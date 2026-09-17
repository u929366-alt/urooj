import type { Metadata } from "next";
import { BadgeCheck, SearchX } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCertificateBySerial } from "@/lib/lms/completion";
import { siteConfig } from "@/lib/site";
import type { Course, User } from "@/payload-types";

export const metadata: Metadata = {
  title: "Verify a Certificate",
  description:
    "Check that a Hunarsaaz certificate is genuine. Enter the certificate ID printed on it to see the holder, the course and the date it was issued.",
  alternates: { canonical: `${siteConfig.url}/learn/verify` },
};

type Params = { searchParams: Promise<{ id?: string }> };

/**
 * Public certificate check, for an employer holding a printed certificate.
 *
 * Deliberately shows only what is on the certificate itself — holder's name,
 * course, date, issuing organisation. No email, no marks, no progress. The
 * serial is unguessable, but a verification page is still not a licence to
 * expose the rest of someone's record.
 */
export default async function VerifyCertificatePage({ searchParams }: Params) {
  const { id } = await searchParams;
  const serial = id?.trim();
  const certificate = serial ? await getCertificateBySerial(serial) : null;

  return (
    <Container className="py-12">
      <SectionHeading
        eyebrow="Certificate check"
        title="Verify a Certificate"
        description="Enter the certificate ID printed on a Hunarsaaz certificate to confirm it is genuine."
      />

      <Card className="mx-auto mt-10 max-w-2xl p-6 sm:p-8">
        <form method="get" className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label htmlFor="id" className="block text-sm font-semibold text-primary-900">
              Certificate ID
            </label>
            <input
              id="id"
              name="id"
              type="text"
              defaultValue={serial ?? ""}
              required
              autoComplete="off"
              placeholder="For example HS-C-2026-00042"
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <button
            type="submit"
            className="self-end rounded-full bg-secondary-500 px-7 py-3 font-semibold text-white hover:bg-secondary-600"
          >
            Verify
          </button>
        </form>

        {serial && certificate && (
          <div className="mt-8 rounded-2xl border-2 border-accent-200 bg-accent-50 p-6">
            <p className="flex items-center gap-2 font-semibold text-accent-800">
              <BadgeCheck className="h-6 w-6" aria-hidden />
              This certificate is genuine
            </p>
            <dl className="mt-5 space-y-3 text-sm">
              <Row label="Issued to" value={certificate.studentName} />
              <Row
                label="Course"
                value={
                  certificate.courseTitle ||
                  (typeof certificate.course === "object" ? (certificate.course as Course).title : "—")
                }
              />
              <Row
                label="Date issued"
                value={new Date(certificate.issuedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              />
              <Row label="Certificate ID" value={certificate.serial} />
              <Row label="Issued by" value="Hunarsaaz" />
            </dl>
            <p className="mt-5 text-xs text-accent-900">
              This confirms the named person completed the named course with Hunarsaaz. It is not a
              statement about any other qualification.
            </p>
          </div>
        )}

        {serial && !certificate && (
          <div className="mt-8 rounded-2xl border-2 border-gray-200 bg-gray-50 p-6">
            <p className="flex items-center gap-2 font-semibold text-primary-900">
              <SearchX className="h-6 w-6 text-gray-500" aria-hidden />
              No certificate found with that ID
            </p>
            <p className="mt-3 text-sm text-gray-600">
              Check the ID for typing errors — they are easy to mistake, particularly between the
              digit 0 and the letter O. If it still does not match, the certificate was not issued
              by Hunarsaaz, and you are welcome to contact us at{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-primary-600 underline">
                {siteConfig.email}
              </a>
              .
            </p>
          </div>
        )}
      </Card>

      <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-gray-500">
        Every Hunarsaaz certificate carries a unique ID. Only the holder&rsquo;s name, the course
        and the date are shown here — nothing else from their record.
      </p>
    </Container>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap gap-x-3">
      <dt className="w-32 shrink-0 text-accent-700">{label}</dt>
      <dd className="font-semibold text-primary-900">{value}</dd>
    </div>
  );
}
