import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, degrees, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import QRCode from "qrcode";
import { siteConfig } from "@/lib/site";
import type { Workshop, WorkshopCertificate } from "@/payload-types";

/**
 * The certificate as a PDF, drawn on the server.
 *
 * The page at /certificates/<serial> is the same certificate in HTML, and
 * that is what gets printed by anybody who wants paper. This exists because
 * a certificate people are told to expect "attached" has to actually be
 * attached, and shared hosting has no browser to print one with.
 *
 * So it is drawn rather than rendered: same artwork, same proportions, laid
 * out in points instead of pixels. The design is 1754 x 1240 — A4 landscape
 * at 150dpi — and every measurement below is in those design pixels, scaled
 * on the way out by K. That way the two versions can be compared side by
 * side without arithmetic.
 *
 * Fonts are the ones every PDF reader already has. Georgia is not among
 * them; Times is its closest standard relative and is what the web version
 * falls back to anyway.
 */

const DESIGN_W = 1754;
// A4 landscape in points.
const PAGE_W = 841.89;
const PAGE_H = 595.28;
const K = PAGE_W / DESIGN_W;

const NAVY = rgb(0x0b / 255, 0x2c / 255, 0x49 / 255);
const NAVY_DEEP = rgb(0x03 / 255, 0x35 / 255, 0x62 / 255);
const NAVY_MID = rgb(0x0a / 255, 0x4d / 255, 0x8c / 255);
const GOLD = rgb(0xf5 / 255, 0xb2 / 255, 0x1d / 255);
const ORANGE = rgb(0xf2 / 255, 0x8c / 255, 0x28 / 255);
const MUTED = rgb(0x6b / 255, 0x72 / 255, 0x80 / 255);
const WHITE = rgb(1, 1, 1);
const RULE = rgb(0xdb / 255, 0xe6 / 255, 0xf1 / 255);
const BAND_TEXT = rgb(0xcf / 255, 0xe0 / 255, 0xef / 255);

const ZONE = "Asia/Karachi";

/** Design pixels to points. */
const u = (px: number) => px * K;
/** Design y (from the top) to PDF y (from the bottom). */
const y = (px: number) => PAGE_H - px * K;

function day(value?: string | null): string {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: ZONE,
  }).format(new Date(value));
}

function clock(value?: string | null): string {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: ZONE,
  }).format(new Date(value));
}

function duration(workshop: Workshop | null): string {
  if (!workshop?.startsAt || !workshop.endsAt) return "";
  const hours =
    (new Date(workshop.endsAt).getTime() - new Date(workshop.startsAt).getTime()) / 3600000;
  if (!Number.isFinite(hours) || hours <= 0) return "";
  const rounded = Math.round(hours * 2) / 2;
  if (rounded === 1) return "One hour";
  if (rounded === 2) return "Two hours";
  if (rounded === 3) return "Three hours";
  return `${rounded} hours`;
}

function splitTitle(title: string): [string, string | null] {
  const match = title.match(/^(.*?)(\s+[0-9][0-9A-Za-z]*)$/);
  if (!match) return [title, null];
  return [match[1], match[2].trim()];
}

/** A signature line carries the name, not the courtesy title. */
function withoutHonorific(name: string): string {
  return name.replace(/^(?:Ms|Mrs|Miss|Mr|Dr|Prof|Professor|Sir|Madam)\.?\s+/i, "").trim();
}

type Drawn = { page: PDFPage; font: PDFFont; bold: PDFFont; serif: PDFFont; serifBold: PDFFont };

function centre(
  { page }: Drawn,
  text: string,
  font: PDFFont,
  sizePx: number,
  topPx: number,
  colour = NAVY,
) {
  const size = u(sizePx);
  const width = font.widthOfTextAtSize(text, size);
  page.drawText(text, {
    x: (PAGE_W - width) / 2,
    y: y(topPx) - size,
    size,
    font,
    color: colour,
  });
}

/** Letter-spaced small caps, for the kicker under the logo. */
function centreTracked(
  { page }: Drawn,
  text: string,
  font: PDFFont,
  sizePx: number,
  topPx: number,
  trackPx: number,
  colour: ReturnType<typeof rgb>,
) {
  const size = u(sizePx);
  const track = u(trackPx);
  const letters = [...text];
  const width =
    letters.reduce((sum, ch) => sum + font.widthOfTextAtSize(ch, size), 0) +
    track * (letters.length - 1);
  let x = (PAGE_W - width) / 2;
  const baseline = y(topPx) - size;
  for (const ch of letters) {
    page.drawText(ch, { x, y: baseline, size, font, color: colour });
    x += font.widthOfTextAtSize(ch, size) + track;
  }
}

async function asset(name: string): Promise<Buffer> {
  return readFile(path.join(process.cwd(), "public", "certificates", name));
}

export async function certificatePdf(
  certificate: WorkshopCertificate,
  workshop: Workshop | null,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`${certificate.workshopTitle} — ${certificate.holderName}`);
  doc.setAuthor(siteConfig.name);
  doc.setSubject(`Certificate ${certificate.serial}`);
  doc.setProducer(siteConfig.name);

  const page = doc.addPage([PAGE_W, PAGE_H]);
  const d: Drawn = {
    page,
    font: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
    serif: await doc.embedFont(StandardFonts.TimesRoman),
    serifBold: await doc.embedFont(StandardFonts.TimesRomanBold),
  };

  // The navy sheet, and the white page inside it with its gold edge.
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: NAVY });
  page.drawRectangle({
    x: u(26),
    y: u(26),
    width: PAGE_W - u(52),
    height: PAGE_H - u(52),
    color: WHITE,
    borderColor: GOLD,
    borderWidth: u(3),
  });

  // The flyer's dotted diagonal, faint, on both shoulders.
  for (const left of [u(64), PAGE_W - u(64) - u(128)]) {
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 5; col += 1) {
        page.drawCircle({
          x: left + u(3 + col * 30),
          y: y(140 + 3 + row * 30),
          size: u(3),
          color: NAVY_MID,
          opacity: 0.22,
        });
      }
    }
  }

  // Logo.
  const logo = await doc.embedPng(await asset("logo.png"));
  const logoH = u(104);
  const logoW = (logo.width / logo.height) * logoH;
  page.drawImage(logo, { x: (PAGE_W - logoW) / 2, y: y(44) - logoH, width: logoW, height: logoH });

  centreTracked(d, siteConfig.name.toUpperCase(), d.bold, 15, 170, 7, ORANGE);

  centre(d, "Certificate of Completion", d.serifBold, 58, 196, NAVY);

  // Gold rule with a diamond in the middle.
  const ruleY = y(286);
  for (const dir of [-1, 1]) {
    page.drawLine({
      start: { x: PAGE_W / 2 + dir * u(14), y: ruleY },
      end: { x: PAGE_W / 2 + dir * u(164), y: ruleY },
      thickness: u(2),
      color: GOLD,
      opacity: 0.85,
    });
  }
  page.drawRectangle({
    x: PAGE_W / 2 - u(5.5),
    y: ruleY - u(5.5),
    width: u(11),
    height: u(11),
    color: GOLD,
    rotate: degrees(45),
  });

  centre(d, "This is to certify that", d.font, 21, 400, MUTED);

  // The name, shrinking rather than wrapping.
  const name = certificate.holderName.trim();
  const nameSize = name.length > 34 ? 52 : name.length > 24 ? 64 : 82;
  centre(d, name, d.serifBold, nameSize, 430, NAVY_DEEP);

  // Its underline, as wide as the name needs but never past the margins.
  const nameWidth = d.serifBold.widthOfTextAtSize(name, u(nameSize));
  const underline = Math.min(Math.max(nameWidth + u(80), u(780)), u(1300));
  page.drawLine({
    start: { x: (PAGE_W - underline) / 2, y: y(430) - u(nameSize) - u(16) },
    end: { x: (PAGE_W + underline) / 2, y: y(430) - u(nameSize) - u(16) },
    thickness: u(2),
    color: RULE,
  });

  centre(d, "has attended the live online workshop", d.font, 21, 572, MUTED);

  // The workshop, with its trailing number picked out in gold.
  const [head, tail] = splitTitle(certificate.workshopTitle);
  const titleSize = u(62);
  const headW = d.serifBold.widthOfTextAtSize(head, titleSize);
  const tailW = tail ? d.serifBold.widthOfTextAtSize(` ${tail}`, titleSize) : 0;
  let x = (PAGE_W - (headW + tailW)) / 2;
  const titleBaseline = y(606) - titleSize;
  page.drawText(head, { x, y: titleBaseline, size: titleSize, font: d.serifBold, color: NAVY });
  if (tail) {
    x += headW;
    page.drawText(` ${tail}`, {
      x,
      y: titleBaseline,
      size: titleSize,
      font: d.serifBold,
      color: GOLD,
    });
  }

  if (workshop?.tagline) {
    centre(d, workshop.tagline, d.font, 22, 690, NAVY_MID);
  }

  const facts = [
    day(workshop?.startsAt),
    workshop?.startsAt && workshop.endsAt
      ? `${clock(workshop.startsAt)}–${clock(workshop.endsAt)} PKT`
      : "",
    duration(workshop),
    workshop?.platform ? `Live on ${workshop.platform}` : "",
  ].filter(Boolean);
  if (facts.length) {
    centre(d, facts.join("   ·   "), d.font, 18, 730, rgb(0.12, 0.16, 0.22));
  }

  // The band across the foot: a signature either side, the proof between.
  const footTop = 905;
  page.drawLine({
    start: { x: u(122), y: y(footTop) },
    end: { x: PAGE_W - u(122), y: y(footTop) },
    thickness: u(1),
    color: rgb(0xe8 / 255, 0xee / 255, 0xf5 / 255),
  });

  const signatures: [string, string, string, number][] = [
    [
      "signature-facilitator.png",
      withoutHonorific(workshop?.presenterName ?? "Asma Ahmed"),
      workshop?.presenterTitle ?? "Consultant Clinical Psychologist",
      PAGE_W * 0.25,
    ],
    ["signature-president.png", "Ahsan Ali Mangi", "President", PAGE_W * 0.75],
  ];

  for (const [file, who, what, centreX] of signatures) {
    const ink = await doc.embedPng(await asset(file));
    const inkH = u(92);
    const inkW = Math.min((ink.width / ink.height) * inkH, u(330));
    page.drawImage(ink, {
      x: centreX - inkW / 2,
      y: y(1050) ,
      width: inkW,
      height: (inkW / ink.width) * ink.height,
    });

    page.drawLine({
      start: { x: centreX - u(165), y: y(1050) },
      end: { x: centreX + u(165), y: y(1050) },
      thickness: u(1.5),
      color: NAVY,
    });

    const whoSize = u(21);
    page.drawText(who, {
      x: centreX - d.bold.widthOfTextAtSize(who, whoSize) / 2,
      y: y(1050) - u(12) - whoSize,
      size: whoSize,
      font: d.bold,
      color: NAVY,
    });

    const whatSize = u(15);
    const lines = file.startsWith("signature-facilitator")
      ? [what, "Workshop Facilitator"]
      : [what, siteConfig.name];
    lines.forEach((line, index) => {
      page.drawText(line, {
        x: centreX - d.font.widthOfTextAtSize(line, whatSize) / 2,
        y: y(1050) - u(12) - whoSize - u(8) - whatSize * (index + 1) * 1.35,
        size: whatSize,
        font: d.font,
        color: MUTED,
      });
    });
  }

  /**
   * The proof, between the signatures: a QR that opens the verification
   * page, and the serial underneath for anyone typing it in by hand.
   */
  /**
   * The verification page lives on the portal, not on the marketing site —
   * hunarsaaz.pk is a static export and has no database to check a serial
   * against. A QR pointing there would 404 on every certificate we issue.
   */
  const portal = (process.env.SITE_URL?.trim() || siteConfig.portalUrl).replace(/\/+$/, "");
  const verifyUrl = `${portal}/verify/${certificate.serial}`;
  const qrPng = await QRCode.toBuffer(verifyUrl, {
    type: "png",
    margin: 1,
    width: 420,
    errorCorrectionLevel: "M",
    color: { dark: "#0b2c49ff", light: "#ffffffff" },
  });
  const qr = await doc.embedPng(qrPng);
  const qrSize = u(128);
  page.drawImage(qr, {
    x: PAGE_W / 2 - qrSize / 2,
    y: y(1012),
    width: qrSize,
    height: qrSize,
  });

  const serialSize = u(16);
  page.drawText(certificate.serial, {
    x: PAGE_W / 2 - d.bold.widthOfTextAtSize(certificate.serial, serialSize) / 2,
    y: y(1012) - u(10) - serialSize,
    size: serialSize,
    font: d.bold,
    color: NAVY,
  });

  const verifyLabel = `Scan to verify at ${portal.replace(/^https?:\/\//, "")}`;
  const verifySize = u(12.5);
  page.drawText(verifyLabel, {
    x: PAGE_W / 2 - d.font.widthOfTextAtSize(verifyLabel, verifySize) / 2,
    y: y(1012) - u(10) - serialSize - u(5) - verifySize,
    size: verifySize,
    font: d.font,
    color: MUTED,
  });

  /**
   * The seal, on the right shoulder beside the workshop block.
   *
   * Not down by the signatures, where it either sits on somebody's ink or
   * crowds it, and not floating in the left margin where it read as an
   * afterthought. Here it balances the dotted motif opposite and leans into
   * the only empty quarter the layout has.
   */
  const stamp = await doc.embedPng(await asset("stamp.png"));
  const stampW = u(185);
  page.drawImage(stamp, {
    x: u(1269),
    y: u(420),
    width: stampW,
    height: (stampW / stamp.width) * stamp.height,
    rotate: degrees(9),
    opacity: 0.85,
  });

  // The issued-by band along the bottom.
  const bandH = u(46);
  page.drawRectangle({ x: u(26), y: u(26), width: PAGE_W - u(52), height: bandH, color: NAVY });
  const issued = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: ZONE,
  }).format(new Date(certificate.issuedAt));
  const bandText = `Issued by ${siteConfig.name} on ${issued}`;
  const bandSize = u(13.5);
  page.drawText(bandText, {
    x: PAGE_W / 2 - d.font.widthOfTextAtSize(bandText, bandSize) / 2,
    y: u(26) + bandH / 2 - bandSize * 0.36,
    size: bandSize,
    font: d.font,
    color: BAND_TEXT,
  });

  return doc.save();
}

/** What the attachment is called when it lands in somebody's inbox. */
export function certificateFileName(certificate: WorkshopCertificate): string {
  const slug = certificate.holderName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const workshop = certificate.workshopTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${workshop}-certificate-${slug || "attendee"}.pdf`;
}
