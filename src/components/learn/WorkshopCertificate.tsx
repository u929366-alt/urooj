import { siteConfig } from "@/lib/site";
import type { Workshop, WorkshopCertificate as CertificateDoc } from "@/payload-types";

/**
 * The workshop certificate.
 *
 * Drawn at the artwork's own size — 1754 × 1240, which is A4 landscape at
 * 150dpi — and then scaled to fit whatever it is shown in. Everything inside
 * is in fixed pixels, so the page a person prints is the page they saw, and
 * a phone gets the same certificate shrunk rather than a reflowed one.
 *
 * Styles are inline rather than Tailwind on purpose: this has to survive
 * being printed, and a utility class that happens to be purged or overridden
 * by a print rule would quietly ruin it.
 */

const NAVY = "#0b2c49";
const NAVY_DEEP = "#033562";
const NAVY_MID = "#0a4d8c";
const GOLD = "#f5b21d";
const ORANGE = "#f28c28";
const MUTED = "#6b7280";

const ZONE = "Asia/Karachi";

/**
 * The artwork is drawn at 1754 × 1240 — A4 landscape at 150dpi — but it has
 * to come out right on a phone and on a printed sheet, which are neither.
 *
 * So every dimension is expressed as a fraction of the container's width
 * instead of in pixels. `cqw` is 1% of the containing block's width, so a
 * 58px heading on a 1754px design is 3.3058cqw and stays 58px when the frame
 * happens to be 1754 wide. Transform-scaling the whole thing would have been
 * tidier, but CSS cannot divide a length by a number, so `scale(100cqw/1754)`
 * is not a thing — it silently does nothing, which is exactly what it did.
 */
const DESIGN_WIDTH = 1754;

/**
 * A signature line carries the name, not the courtesy title: the workshop
 * record says "Ms. Asma Ahmed" because that is how she is introduced on the
 * public page, but a signed certificate reads "Asma Ahmed".
 */
function withoutHonorific(name: string): string {
  return name.replace(/^(?:Ms|Mrs|Miss|Mr|Dr|Prof|Professor|Sir|Madam)\.?\s+/i, "").trim();
}
function u(px: number): string {
  return `${((px / DESIGN_WIDTH) * 100).toFixed(4)}cqw`;
}

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

/** Hours, when both ends are known and it comes out whole. */
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

/**
 * The title with its trailing number picked out in gold, the way the flyer
 * sets it: THRIVE 360. A title with no trailing number is simply left alone.
 */
function splitTitle(title: string): [string, string | null] {
  const match = title.match(/^(.*?)(\s+[0-9][0-9A-Za-z]*)$/);
  if (!match) return [title, null];
  return [match[1], match[2].trim()];
}

export function WorkshopCertificate({
  certificate,
  workshop,
}: {
  certificate: CertificateDoc;
  workshop: Workshop | null;
}) {
  const name = certificate.holderName.trim();
  // A long name shrinks rather than wrapping awkwardly.
  const nameSize = name.length > 34 ? 52 : name.length > 24 ? 64 : 82;

  const [titleHead, titleTail] = splitTitle(certificate.workshopTitle);

  const facts = [
    day(workshop?.startsAt),
    workshop?.startsAt && workshop.endsAt
      ? `${clock(workshop.startsAt)}–${clock(workshop.endsAt)} PKT`
      : "",
    duration(workshop),
    workshop?.platform ? `Live on ${workshop.platform}` : "",
  ].filter(Boolean);

  const issued = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: ZONE,
  }).format(new Date(certificate.issuedAt));

  const dots: React.CSSProperties = {
    position: "absolute",
    width: u(128),
    height: u(98),
    opacity: 0.22,
    backgroundImage: `radial-gradient(circle at ${u(3)} ${u(3)}, ${NAVY_MID} ${u(3)}, transparent 0)`,
    backgroundSize: `${u(30)} ${u(30)}`,
  };

  const signWhat: React.CSSProperties = {
    marginTop: u(3),
    fontSize: u(15),
    color: MUTED,
    lineHeight: 1.45,
  };

  return (
    <div className="certificate-scale">
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          padding: u(26),
          background: NAVY,
          overflow: "hidden",
          fontFamily: "var(--font-sans, Poppins, Arial, sans-serif)",
          color: "#1f2937",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            background: "#ffffff",
            border: `${u(3)} solid ${GOLD}`,
            overflow: "hidden",
          }}
        >
          <div style={{ ...dots, right: u(64), top: u(140) }} aria-hidden />
          <div style={{ ...dots, left: u(64), top: u(140) }} aria-hidden />

          <div
            style={{
              position: "relative",
              zIndex: 2,
              width: "100%",
              height: "100%",
              padding: `${u(44)} ${u(96)} ${u(96)}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* Plain img, not next/image: this is drawn at a fixed size and
                printed, so there is nothing for the optimiser to do. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/certificates/logo.png"
              alt={siteConfig.name}
              style={{ height: u(104), width: "auto" }}
            />

            <p
              style={{
                marginTop: u(22),
                fontSize: u(15),
                fontWeight: 600,
                letterSpacing: "0.46em",
                textIndent: "0.46em",
                color: ORANGE,
                textTransform: "uppercase",
              }}
            >
              {siteConfig.name}
            </p>

            <h1
              style={{
                marginTop: u(26),
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontWeight: 700,
                fontSize: u(58),
                lineHeight: 1.05,
                color: NAVY,
              }}
            >
              Certificate of Completion
            </h1>

            {/* Gold rule with a diamond in the middle. */}
            <div
              style={{ marginTop: u(16), display: "flex", alignItems: "center", gap: u(14) }}
              aria-hidden
            >
              <span
                style={{
                  display: "block",
                  width: u(150),
                  height: u(2),
                  background: `linear-gradient(90deg, transparent, ${GOLD})`,
                }}
              />
              <i style={{ width: u(11), height: u(11), background: GOLD, transform: "rotate(45deg)" }} />
              <span
                style={{
                  display: "block",
                  width: u(150),
                  height: u(2),
                  background: `linear-gradient(90deg, ${GOLD}, transparent)`,
                }}
              />
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <p style={{ fontSize: u(21), fontWeight: 300, color: MUTED }}>
                This is to certify that
              </p>
              <p
                style={{
                  marginTop: u(6),
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontWeight: 700,
                  fontSize: u(nameSize),
                  lineHeight: 1.12,
                  color: NAVY_DEEP,
                  padding: `0 ${u(40)} ${u(14)}`,
                  borderBottom: `${u(2)} solid #dbe6f1`,
                  minWidth: u(780),
                  maxWidth: u(1300),
                }}
              >
                {name}
              </p>

              <p style={{ marginTop: u(34), fontSize: u(21), fontWeight: 300, color: MUTED }}>
                has attended the live online workshop
              </p>
              <p
                style={{
                  marginTop: u(10),
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontWeight: 900,
                  fontSize: u(62),
                  lineHeight: 1.1,
                  color: NAVY,
                }}
              >
                {titleHead}
                {titleTail && <b style={{ color: GOLD }}> {titleTail}</b>}
              </p>
              {workshop?.tagline && (
                <p style={{ marginTop: u(10), fontSize: u(22), fontWeight: 500, color: NAVY_MID }}>
                  {workshop.tagline}
                </p>
              )}

              {facts.length > 0 && (
                <p style={{ marginTop: u(28), fontSize: u(18) }}>
                  {facts.map((fact, index) => (
                    <span key={fact}>
                      {index > 0 && <em style={{ fontStyle: "normal", color: MUTED, padding: `0 ${u(10)}` }}>·</em>}
                      {fact}
                    </span>
                  ))}
                </p>
              )}
            </div>

            {/* Two signatures with the serial between them. */}
            <div
              style={{
                paddingTop: u(34),
                borderTop: `${u(1)} solid #e8eef5`,
                width: "100%",
                display: "grid",
                gridTemplateColumns: `1fr ${u(280)} 1fr`,
                alignItems: "end",
                gap: u(40),
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ height: u(92), display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/certificates/signature-facilitator.png"
                    alt=""
                    style={{ maxHeight: u(92), maxWidth: u(330), width: "auto", display: "block" }}
                  />
                </div>
                <div style={{ marginTop: u(6), borderTop: `${u(1.5)} solid ${NAVY}`, paddingTop: u(10) }}>
                  <p style={{ fontSize: u(21), fontWeight: 600, color: NAVY }}>
                    {withoutHonorific(workshop?.presenterName ?? "Asma Ahmed")}
                  </p>
                  <p style={signWhat}>
                    {workshop?.presenterTitle ?? "Consultant Clinical Psychologist"}
                    <br />
                    Workshop Facilitator
                  </p>
                </div>
              </div>

              <div style={{ textAlign: "center", paddingBottom: u(6) }}>
                {/* The proof: scanning it opens the verification page.
                    eslint-disable-next-line @next/next/no-img-element */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/certificates/${certificate.serial}/qr`}
                  alt=""
                  style={{
                    width: u(128),
                    height: u(128),
                    display: "block",
                    margin: `0 auto ${u(9)}`,
                  }}
                />
                <p
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    fontSize: u(16),
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    color: NAVY,
                  }}
                >
                  {certificate.serial}
                </p>
                <p style={{ marginTop: u(2), fontSize: u(12.5), color: MUTED }}>
                  Scan to verify at {siteConfig.portalUrl.replace(/^https?:\/\//, "")}
                </p>
              </div>

              <div style={{ textAlign: "center" }}>
                <div style={{ height: 92, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/certificates/signature-president.png"
                    alt=""
                    style={{ maxHeight: 92, maxWidth: 330, width: "auto", display: "block" }}
                  />
                </div>
                <div style={{ marginTop: 6, borderTop: `1.5px solid ${NAVY}`, paddingTop: 10 }}>
                  <p style={{ fontSize: 21, fontWeight: 600, color: NAVY }}>Ahsan Ali Mangi</p>
                  <p style={signWhat}>
                    President
                    <br />
                    {siteConfig.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* The seal, on the right shoulder beside the workshop block —
              balancing the dotted motif opposite, and clear of both
              signatures. Kept in step with the PDF so the printed copy and
              the emailed one are the same certificate. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/certificates/stamp.png"
            alt=""
            style={{
              position: "absolute",
              left: u(1269),
              bottom: u(420),
              width: u(185),
              transform: "rotate(9deg)",
              mixBlendMode: "multiply",
              opacity: 0.85,
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              background: NAVY,
              color: "#cfe0ef",
              fontSize: u(13.5),
              letterSpacing: "0.04em",
              padding: `${u(11)} 0`,
              textAlign: "center",
            }}
          >
            Issued by <b style={{ color: "#ffffff", fontWeight: 600 }}>{siteConfig.name}</b> on{" "}
            {issued}
          </div>
        </div>
      </div>
    </div>
  );
}
