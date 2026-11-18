import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye, Printer } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { WorkshopCertificate } from "@/components/learn/WorkshopCertificate";
import { requireStaff, getPayloadClient } from "@/lib/lms/auth";
import type { Workshop, WorkshopCertificate as CertificateDoc } from "@/payload-types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Certificate preview",
  robots: { index: false, follow: false },
};

/**
 * What a certificate will look like, before a single one is issued.
 *
 * Nothing is written and nothing is sent: the record below exists only for
 * the length of this request. Issuing is the irreversible step — a name
 * misspelled on the workshop record becomes a hundred certificates with the
 * tagline wrong — so there needs to be somewhere to look first.
 *
 * Shown with a long-ish name on purpose, because that is the case most
 * likely to break the layout.
 */
export default async function CertificatePreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ workshop?: string; name?: string }>;
}) {
  await requireStaff("/learn/workshops");
  const { workshop: workshopId, name } = await searchParams;
  if (!workshopId) notFound();

  const payload = await getPayloadClient();
  const workshop = (await payload.findByID({
    collection: "workshops",
    id: workshopId,
    depth: 0,
    overrideAccess: true,
  })) as Workshop | null;
  if (!workshop) notFound();

  const sample: CertificateDoc = {
    id: 0,
    serial: "HS-0000-PREVIEW0",
    workshop: workshop.id,
    seat: null,
    holderName: name?.trim() || "Muhammad Abdul Rehman",
    holderEmail: null,
    workshopTitle: workshop.title,
    presenterLine: null,
    issuedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  } as CertificateDoc;

  return (
    <Container className="certificate-print py-10">
      <div className="no-print mb-6">
        <Link
          href="/learn/workshops"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to registrations
        </Link>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-primary-900">
              Certificate preview
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-600">
              Nothing has been issued and nobody has been emailed. This is a sample with a
              made-up name and serial, drawn from the {workshop.title} record — so if the
              tagline, date, time or presenter is wrong here, fix it in{" "}
              <Link
                href="/admin/collections/workshops"
                className="font-semibold text-primary-600 hover:underline"
              >
                Workshops
              </Link>{" "}
              before you issue.
            </p>
          </div>
          <p className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-800">
            <Printer className="h-4 w-4" aria-hidden />
            Ctrl/Cmd + P to see the printed sheet
          </p>
        </div>

        <form className="mt-4 flex flex-wrap items-end gap-3" action="/learn/workshops/preview">
          <input type="hidden" name="workshop" value={String(workshop.id)} />
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-primary-900">
              Try another name
            </label>
            <input
              id="name"
              name="name"
              defaultValue={name ?? ""}
              placeholder="A long name, to check it fits"
              className="mt-1 w-72 rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-primary-400"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Eye className="h-4 w-4" aria-hidden />
            Preview
          </button>
        </form>
      </div>

      <div className="certificate-frame rounded-xl shadow-sm">
        <WorkshopCertificate certificate={sample} workshop={workshop} preview />
      </div>

      <p className="no-print mt-6 text-sm text-gray-500">
The QR square is drawn empty here because this serial does not exist. On a real
        certificate it carries a code that scans through to the verification page.
      </p>
    </Container>
  );
}
