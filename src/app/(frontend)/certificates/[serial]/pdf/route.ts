import { NextResponse } from "next/server";
import { getWorkshopCertificateBySerial } from "@/lib/lms/workshopCertificates";
import { certificateFileName, certificatePdf } from "@/lib/lms/certificatePdf";
import type { Workshop } from "@/payload-types";

export const dynamic = "force-dynamic";

/**
 * The certificate as a PDF, on demand.
 *
 * The same file that is attached to the email, drawn fresh rather than
 * stored — so somebody who deleted the email, or who is reading it on a
 * phone where a 1754-pixel-wide page is a postage stamp, can get the real
 * thing with one tap.
 *
 * Public, like the page it sits under: the serial is the key, and a PDF
 * shows nothing the certificate itself does not.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ serial: string }> },
) {
  const { serial } = await params;
  const certificate = await getWorkshopCertificateBySerial(serial);
  if (!certificate) {
    return NextResponse.json({ error: "No such certificate." }, { status: 404 });
  }

  const workshop =
    typeof certificate.workshop === "object" ? (certificate.workshop as Workshop) : null;

  try {
    const pdf = await certificatePdf(certificate, workshop);
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${certificateFileName(certificate)}"`,
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch (error) {
    console.error(`[workshops] could not draw the PDF for ${certificate.serial}:`, error);
    return NextResponse.json(
      { error: "The certificate could not be drawn. Please tell us and we will send it." },
      { status: 500 },
    );
  }
}
