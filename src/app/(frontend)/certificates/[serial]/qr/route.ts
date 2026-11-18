import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { getWorkshopCertificateBySerial } from "@/lib/lms/workshopCertificates";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * The QR square for a certificate, as a PNG.
 *
 * Drawn on request rather than stored: it encodes nothing but the serial's
 * verification URL, so there is nothing worth keeping on disk, and a
 * certificate issued before the QR existed gets one the moment it is viewed.
 *
 * Only for serials that exist. A QR for a made-up number would scan through
 * to a page saying the certificate is not genuine, which is a worse outcome
 * than no image at all.
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

  // The verification page is on the portal; the marketing site is a static
  // export with no database to check a serial against.
  const portal = (process.env.SITE_URL?.trim() || siteConfig.portalUrl).replace(/\/+$/, "");

  const png = await QRCode.toBuffer(`${portal}/verify/${certificate.serial}`, {
    type: "png",
    margin: 1,
    width: 420,
    errorCorrectionLevel: "M",
    color: { dark: "#0b2c49ff", light: "#ffffffff" },
  });

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
