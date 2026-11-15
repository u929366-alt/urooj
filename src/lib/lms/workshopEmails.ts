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

/**
 * The joining link, on its own.
 *
 * The confirmation letter carries the link, but only if there was one to
 * carry when it was sent — and there usually is not. A place is confirmed as
 * soon as the money is matched, which can be weeks out, while the Zoom link
 * is made a day or two before. Those registrants were told the link would
 * follow by email, and this is that email.
 *
 * It goes to each person attending, not to each booking, so somebody who
 * booked five places does not have to forward anything.
 */
export function joiningHTML(
  workshop: Workshop,
  recipientName: string,
  seat?: string | null,
): string {
  const topic = workshop.tagline ? `${workshop.title}: ${workshop.tagline}` : workshop.title;

  const time = workshop.endsAt
    ? `${formatClock(workshop.startsAt)} – ${formatClock(workshop.endsAt)} (Pakistan time)`
    : `${formatClock(workshop.startsAt)} (Pakistan time)`;

  const first = recipientName.trim().split(/\s+/)[0] || recipientName;

  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:580px;margin:0 auto;padding:24px;color:#1f2937;line-height:1.55">
  <h1 style="font-size:20px;color:#0b2c49;margin:0 0 14px">Your joining link</h1>

  <p style="margin:0 0 14px">Dear ${esc(first)},</p>
  <p style="margin:0 0 18px">
    Here is the link to join <strong>${esc(topic)}</strong>. Keep this email — it is
    the only place the link is sent.
  </p>

  <table style="border-collapse:collapse;font-size:14px;margin:0 0 20px">
    ${detailRow("Date", esc(formatDay(workshop.startsAt)))}
    ${detailRow("Time", esc(time))}
    ${detailRow("Platform", esc(workshop.platform ?? "Online"))}
    ${seat ? detailRow("Your reference", esc(seat)) : ""}
  </table>

  <p style="margin:0 0 18px">
    <a href="${esc(workshop.joinUrl ?? "")}"
       style="display:inline-block;background:#0b5394;color:#ffffff;text-decoration:none;
              padding:14px 28px;border-radius:999px;font-weight:bold;font-size:16px">
      Join on ${esc(workshop.platform ?? "the day")}
    </a>
  </p>
  <p style="margin:0 0 18px;font-size:13px;color:#6b7280">
    If the button does not work, copy this link into your browser:<br>
    ${esc(workshop.joinUrl ?? "")}
  </p>

  <p style="margin:0 0 14px;padding:12px 16px;background:#f3f4f6;border-radius:8px;font-size:14px">
    Please join a few minutes early so we can start on time. Joining from a laptop,
    with headphones, makes the interactive parts much easier.
  </p>

  <p style="margin:24px 0 0;font-size:13px;color:#6b7280">
    Any trouble joining? ${esc(workshop.contactName ? `${workshop.contactName} — ` : "")}${esc(workshop.contactEmail ?? siteConfig.email)}
  </p>
</div>`;
}

/**
 * "Here is your certificate."
 *
 * A link rather than an attachment. The portal has no PDF renderer — shared
 * hosting will not run one — and more to the point a link keeps working: the
 * certificate is a page that can be printed or saved as PDF whenever they
 * need it, and the serial on it can be checked by anyone they show it to.
 */
export function certificateHTML(
  workshop: Workshop,
  holderName: string,
  serial: string,
  url: string,
): string {
  const topic = workshop.tagline ? `${workshop.title}: ${workshop.tagline}` : workshop.title;
  const first = holderName.trim().split(/\s+/)[0] || holderName;

  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:580px;margin:0 auto;padding:24px;color:#1f2937;line-height:1.55">
  <h1 style="font-size:20px;color:#0b2c49;margin:0 0 14px">Your certificate</h1>

  <p style="margin:0 0 14px">Dear ${esc(first)},</p>
  <p style="margin:0 0 18px">
    Thank you for attending <strong>${esc(topic)}</strong>. Your certificate of
    completion is ready.
  </p>

  <p style="margin:0 0 18px">
    <a href="${esc(url)}"
       style="display:inline-block;background:#0b5394;color:#ffffff;text-decoration:none;
              padding:14px 28px;border-radius:999px;font-weight:bold;font-size:16px">
      View your certificate
    </a>
  </p>
  <p style="margin:0 0 18px;font-size:13px;color:#6b7280">
    If the button does not work, copy this link into your browser:<br>${esc(url)}
  </p>

  <p style="margin:0 0 14px;padding:12px 16px;background:#f3f4f6;border-radius:8px;font-size:14px">
    To keep a copy, open the link and press <strong>Ctrl + P</strong> (or <strong>Cmd + P</strong>
    on a Mac), then choose "Save as PDF". The link does not expire.
  </p>

  <p style="margin:0 0 14px;font-size:14px">
    Your certificate number is <strong>${esc(serial)}</strong>. Anyone you show the
    certificate to — an employer, a university — can confirm it is genuine using that
    number, and they will see only your name, the workshop and the date.
  </p>

  <p style="margin:24px 0 0;font-size:13px;color:#6b7280">
    Questions? ${esc(workshop.contactName ? `${workshop.contactName} — ` : "")}${esc(workshop.contactEmail ?? siteConfig.email)}
  </p>
</div>`;
}

/**
 * Somebody tried to register who is already on the list.
 *
 * Usually a double-click, in which case this is noise and you ignore it. But
 * it is also what happens when somebody who registered alone comes back to
 * book places for colleagues, and that one is a booking you would otherwise
 * never hear about — the form can only hold one registration per address per
 * workshop, so the second attempt has to reach a person instead.
 */
export function repeatAttemptHTML(
  workshop: Workshop,
  existing: WorkshopRegistration,
  attempt: {
    places: number;
    amount: number;
    receiptAttached: boolean;
    hadReceiptAlready: boolean;
  },
): string {
  const interesting =
    attempt.places > (existing.groupSize ?? 1) || attempt.receiptAttached;

  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:580px;margin:0 auto;padding:24px;color:#1f2937;line-height:1.55">
  <h1 style="font-size:19px;color:#0b2c49;margin:0 0 14px">
    ${interesting ? "Someone has tried to book again — worth a look" : "Repeat registration (probably a double-click)"}
  </h1>

  <p style="margin:0 0 14px">
    <strong>${esc(existing.name)}</strong> (${esc(existing.email)}) filled in the form for
    <strong>${esc(workshop.title)}</strong> again. They are already registered, so nothing new
    was created — there can only be one registration per email address per workshop.
  </p>

  <table style="border-collapse:collapse;font-size:14px;margin:0 0 18px">
    ${detailRow("Already registered for", `${existing.groupSize ?? 1} place(s)`)}
    ${detailRow("This time they asked for", `<strong>${attempt.places} place(s)</strong>`)}
    ${detailRow("Amount they were quoted", formatRupees(attempt.amount))}
    ${existing.paymentReference ? detailRow("Their reference", esc(existing.paymentReference)) : ""}
    ${detailRow(
      "Receipt",
      attempt.receiptAttached
        ? "<strong>A new receipt was attached to their registration</strong>"
        : attempt.hadReceiptAlready
          ? "They already had one on file; the new one was not kept"
          : "None attached",
    )}
  </table>

  ${
    attempt.places > (existing.groupSize ?? 1)
      ? `<p style="margin:0 0 14px;padding:12px 16px;background:#fffbeb;border-radius:8px;font-size:14px">
    They have asked for <strong>more places than they are registered for</strong>. That is
    very likely a group booking they could not make through the form. Open their registration,
    put the extra places and names under Attendees, and check the money against the bank.
  </p>`
      : ""
  }

  <p style="margin:0 0 14px;font-size:14px">
    Their registration: open <strong>Workshop Registrations</strong> in the admin and search
    for ${esc(existing.email)}.
  </p>
</div>`;
}

/**
 * A follow-up to everyone who attended: the feedback form, the handout,
 * whatever else comes after a session.
 *
 * The body is written by staff at the time rather than fixed here, because
 * what follows a workshop is never the same twice — slides one week, a
 * reading list the next, a reminder about certificates the week after. What
 * is fixed is the shape: who it is from, who it is to, and that the links
 * are buttons rather than something to squint at.
 */
export function followUpHTML(
  workshop: Workshop,
  recipientName: string,
  content: {
    heading: string;
    body: string;
    feedbackUrl?: string;
    feedbackLabel?: string;
    handoutUrl?: string;
    handoutLabel?: string;
  },
): string {
  const first = recipientName.trim().split(/\s+/)[0] || recipientName;

  const button = (href: string, label: string, primary: boolean) => `
  <p style="margin:0 0 12px">
    <a href="${esc(href)}"
       style="display:inline-block;${
         primary
           ? "background:#0b5394;color:#ffffff;"
           : "background:#ffffff;color:#0b5394;border:2px solid #0b5394;"
       }text-decoration:none;padding:13px 26px;border-radius:999px;font-weight:bold;font-size:15px">
      ${esc(label)}
    </a>
  </p>`;

  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:580px;margin:0 auto;padding:24px;color:#1f2937;line-height:1.55">
  <h1 style="font-size:20px;color:#0b2c49;margin:0 0 14px">${esc(content.heading)}</h1>

  <p style="margin:0 0 14px">Dear ${esc(first)},</p>
  ${paragraphs(content.body)}

  ${content.feedbackUrl ? button(content.feedbackUrl, content.feedbackLabel?.trim() || "Fill in the feedback form", true) : ""}
  ${content.handoutUrl ? button(content.handoutUrl, content.handoutLabel?.trim() || "Download the handout", false) : ""}

  ${
    content.feedbackUrl || content.handoutUrl
      ? `<p style="margin:14px 0 0;font-size:13px;color:#6b7280">
    If the buttons do not work, these are the links:<br>
    ${content.feedbackUrl ? `${esc(content.feedbackUrl)}<br>` : ""}
    ${content.handoutUrl ? esc(content.handoutUrl) : ""}
  </p>`
      : ""
  }

  <p style="margin:24px 0 0;font-size:13px;color:#6b7280">
    ${esc(workshop.title)} · ${esc(workshop.contactName ? `${workshop.contactName} — ` : "")}${esc(workshop.contactEmail ?? siteConfig.email)}
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
