import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Printer } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Certificate } from "@/components/learn/Certificate";
import { getCurrentUser, isStaff } from "@/lib/lms/auth";
import { getCertificateBySerial } from "@/lib/lms/completion";

export const metadata: Metadata = {
  title: "Your certificate",
  robots: { index: false, follow: false },
};

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ serial: string }>;
}) {
  const { serial } = await params;
  const certificate = await getCertificateBySerial(serial);
  if (!certificate) notFound();

  const user = await getCurrentUser();
  if (!user) redirect(`/learn/login?next=${encodeURIComponent(`/learn/certificates/${serial}`)}`);

  // The full view is for the holder and staff. Anyone else can still confirm
  // it is genuine on the public /verify page.
  const holderId =
    typeof certificate.student === "object" && certificate.student
      ? certificate.student.id
      : certificate.student;
  if (String(holderId) !== String(user.id) && !isStaff(user)) {
    redirect(`/verify/${serial}`);
  }

  return (
    <Container className="py-12">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/learn" className="text-sm font-semibold text-primary-600 hover:underline">
          ← My Learning
        </Link>
        <p className="inline-flex items-center gap-2 text-sm text-gray-600">
          <Printer className="h-4 w-4" aria-hidden />
          Press Ctrl/Cmd + P to print or save as PDF.
        </p>
      </div>

      <Certificate certificate={certificate} />
    </Container>
  );
}
