import Image from "next/image";
import { siteConfig } from "@/lib/site";
import type { Certificate as CertificateDoc } from "@/payload-types";

/**
 * The printable certificate. Sized for A4 landscape; the print rules in
 * globals.css hide the site chrome so Ctrl+P produces just this.
 */
export function Certificate({ certificate }: { certificate: CertificateDoc }) {
  const issued = new Date(certificate.issuedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="certificate mx-auto w-full max-w-4xl rounded-2xl border-4 border-primary-900 bg-white p-10 text-center shadow-sm sm:p-14">
      <Image
        src="/logo-lockup.svg"
        alt={siteConfig.name}
        width={220}
        height={94}
        className="mx-auto h-20 w-auto"
      />

      <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-secondary-600">
        Certificate of Completion
      </p>

      <p className="mt-8 text-sm text-gray-600">This is to certify that</p>
      <p className="mt-2 font-display text-3xl font-bold text-primary-900 sm:text-4xl">
        {certificate.studentName}
      </p>

      <p className="mt-6 text-sm text-gray-600">has successfully completed the course</p>
      <p className="mt-2 font-display text-xl font-semibold text-primary-800 sm:text-2xl">
        {certificate.courseTitle}
      </p>

      <div className="mx-auto mt-10 grid max-w-lg grid-cols-2 gap-6 border-t border-gray-200 pt-6 text-left text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Date issued</p>
          <p className="mt-0.5 font-semibold text-gray-800">{issued}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Certificate number</p>
          <p className="mt-0.5 font-mono font-semibold text-gray-800">{certificate.serial}</p>
        </div>
      </div>

      <p className="mt-8 text-xs text-gray-500">
        Verify this certificate at {siteConfig.url.replace(/^https?:\/\//, "")}/verify/
        {certificate.serial}
      </p>
    </div>
  );
}
