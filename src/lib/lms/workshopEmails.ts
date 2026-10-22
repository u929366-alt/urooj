import { siteConfig } from "../site.ts";
import type { Workshop, WorkshopRegistration } from "../../payload-types.ts";

/**
 * Every email the workshop flow sends.
 *
 * Three of them, and only one goes to the person registering:
 *
 *   confirmation  the letter. Sent when, and only when, a member of staff
 *                 has marked the registration confirmed — from the Workshops
 *                 page, from the registration in the admin, or by confirming
 *                 the payment. Registering sends the candidate nothing at
 *                 all; they are told on screen that we will write when the
 *                 payment has been checked.
 *   staff alert   to whoever checks payments, so no registration sits unseen.
 *   decline       when the payment could not be matched.
 *
 * They live here, away from the actions, for two reasons. The actions are
 * "use server" modules, which may only export async functions, so a plain
 * template function cannot sit in one and still be reachable from anywhere
 * else — and the collection's own hook needs the confirmation letter too.
 * Nothing here imports anything server-only, so it can be pulled into the
 * Payload config safely.
 *
 * Registrants type their own names, so anything of theirs that goes into the
 * markup is escaped.
 */

const ZONE = "Asia/Karachi";

/**
 * Local rather than imported: ./payments is server-only and this file is not,
 * because the Payload config pulls it in. Same formatting, to the character.
 */
function formatRupees(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDay(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: ZONE,
  }).format(new Date(value));
}

function formatClock(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: ZONE,
  }).format(new Date(value));
}

/** People put all sorts into a name field; none of it should become markup. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * The presenter writes the letter as plain text in the admin. Blank lines
 * separate paragraphs; single line breaks are kept, which is what makes a
 * sign-off of four short lines come out as four short lines.
 */
function paragraphs(text: string | null | undefined): string {
  if (!text?.trim()) return "";
  return text
    .trim()
    .split(/\n\s*\n/)
    .map(
      (block) =>
        `<p style="margin:0 0 14px">${esc(block.trim()).replace(/\n/g, "<br>")}</p>`,
    )
    .join("\n  ");
}

function detailRow(label: string, value: string): string {
  return `<tr>
      <td style="padding:5px 16px 5px 0;color:#6b7280;vertical-align:top;white-space:nowrap">${label}</td>
      <td style="padding:5px 0">${value}</td>
    </tr>`;
}

/**
 * Once there is a link to give out, that is the venue. Until then it is
 * whatever the workshop record says will happen instead — "will be shared by
 * email on the 10th", or the bare platform name if nobody has said.
 *
 * Both emails use this, so they cannot promise different things.
 */
function venueLine(workshop: Workshop, withLink: boolean): string {
  if (workshop.joinUrl && withLink) {
    return `${esc(workshop.platform ?? "Online")} — <a href="${esc(workshop.joinUrl)}" style="color:#0b5394">join here</a>`;
  }
  if (workshop.joinUrl) return esc(workshop.platform ?? "Online");
  return esc(workshop.venueNote?.trim() || workshop.platform || "Online");
}

export function confirmationHTML(workshop: Workshop, registration: WorkshopRegistration) {
  const topic = workshop.tagline
    ? `${workshop.title}: ${workshop.tagline}`
    : workshop.title;

  const time = workshop.endsAt
    ? `${formatClock(workshop.startsAt)} – ${formatClock(workshop.endsAt)} (Pakistan time)`
    : `${formatClock(workshop.startsAt)} (Pakistan time)`;

  const venue = venueLine(workshop, true);

  const speaker = [workshop.presenterName, workshop.presenterTitle]
    .filter(Boolean)
    .map((part) => esc(String(part)))
    .join(", ");

  const intro =
    paragraphs(workshop.confirmationIntro) ||
    `<p style="margin:0 0 14px">Thank you for registering for <strong>${esc(topic)}</strong>. We are delighted to welcome you.</p>`;

  const closing =
    paragraphs(workshop.confirmationClosing) ||
    `<p style="margin:0 0 14px">Further details and joining instructions will be shared with you before the session.</p>`;

  const joining = workshop.joinUrl
    ? `
  <p style="margin:0 0 18px">
    <a href="${esc(workshop.joinUrl)}"
       style="display:inline-block;background:#0b5394;color:#ffffff;text-decoration:none;
              padding:12px 24px;border-radius:999px;font-weight:bold">
      Join on ${esc(workshop.platform ?? "the day")}
    </a>
  </p>
  <p style="margin:0 0 18px;font-size:13px;color:#6b7280">
    If the button does not work, open this link:<br>${esc(workshop.joinUrl)}
  </p>`
    : "";

  const places = registration.groupSize ?? 1;

  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:580px;margin:0 auto;padding:24px;color:#1f2937;line-height:1.55">
  <h1 style="font-size:20px;color:#0b2c49;margin:0 0 14px">Your place is confirmed</h1>

  <p style="margin:0 0 20px;padding:12px 16px;background:#ecfdf5;border-radius:8px;font-size:14px">
    We have received your payment of <strong>${formatRupees(registration.amountDue ?? 0)}</strong>${
      places > 1 ? ` for <strong>${places} places</strong>` : ""
    }.${registration.paymentReference ? ` Your reference is ${esc(registration.paymentReference)}.` : ""}
  </p>

  <p style="margin:0 0 14px">Dear ${esc(registration.name)},</p>
  ${intro}

  <h2 style="font-size:16px;color:#0b2c49;margin:24px 0 8px">Workshop Details</h2>
  <table style="border-collapse:collapse;font-size:14px;margin:0 0 20px">
    ${detailRow("Topic", esc(topic))}
    ${detailRow("Date", esc(formatDay(workshop.startsAt)))}
    ${detailRow("Time", esc(time))}
    ${detailRow("Venue/Platform", venue)}
    ${speaker ? detailRow("Speaker", speaker) : ""}
  </table>
  ${joining}
  ${closing}

  <p style="margin:24px 0 0;font-size:13px;color:#6b7280">
    Questions? ${esc(workshop.contactName ? `${workshop.contactName} — ` : "")}${esc(workshop.contactEmail ?? siteConfig.email)}
  </p>
</div>`;
}

export function declineHTML(workshop: Workshop, registration: WorkshopRegistration, reason: string) {
  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1f2937">
  <h1 style="font-size:20px;color:#0b2c49;margin:0 0 16px">About your registration</h1>
  <p style="margin:0 0 12px">Dear ${esc(registration.name)},</p>
  <p style="margin:0 0 16px">
    Thank you for registering for <strong>${esc(workshop.title)}</strong>. We have not been able to
    confirm your place yet:
  </p>
  <p style="margin:0 0 16px;padding:12px 16px;background:#fef3c7;border-radius:8px">${esc(reason)}</p>
  <p style="margin:0 0 12px">
    Reply to this email and we will sort it out — your registration is still here.
  </p>
  <p style="margin:24px 0 0;font-size:13px;color:#6b7280">
    ${workshop.contactName ? `${workshop.contactName} — ` : ""}${workshop.contactEmail ?? siteConfig.email}
  </p>
</div>`;
}


/** What staff get the moment a registration arrives, so none sits unseen. */
export function staffAlertHTML(
  workshop: Workshop,
  args: { name: string; email: string; phone: string; amount: number; category: string; places: number },
) {
  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;color:#1f2937">
  <h1 style="font-size:18px;color:#0b2c49;margin:0 0 12px">New registration awaiting your check</h1>
  <p style="margin:0 0 16px"><strong>${esc(args.name)}</strong> has registered for ${esc(workshop.title)} and attached a receipt.</p>
  <table style="border-collapse:collapse;font-size:14px;margin:0 0 16px">
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Email</td><td style="padding:4px 0">${esc(args.email)}</td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Phone</td><td style="padding:4px 0">${esc(args.phone)}</td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Category</td><td style="padding:4px 0">${esc(args.category)}${args.places > 1 ? ` · ${args.places} places` : ""}</td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Amount claimed</td><td style="padding:4px 0"><strong>${formatRupees(args.amount)}</strong></td></tr>
  </table>
  <p style="margin:0 0 12px">
    Open <a href="${siteConfig.portalUrl}/learn/workshops">${siteConfig.portalUrl}/learn/workshops</a>,
    look at the receipt, and approve it to send their confirmation.
  </p>
</div>`;
}
