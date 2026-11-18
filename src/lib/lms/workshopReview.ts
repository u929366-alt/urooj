"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { requireStaff } from "./auth";
import { certificateHTML, declineHTML, followUpHTML, joiningHTML } from "./workshopEmails";
import { issueWorkshopCertificates } from "./workshopCertificates";
import { certificateFileName, certificatePdf } from "./certificatePdf";
import { siteConfig } from "@/lib/site";
import type { Workshop } from "@/payload-types";

/**
 * Approving a workshop registration.
 *
 * Someone has transferred a fee and sent a photograph of the slip. A member
 * of staff looks at it against the bank account and either approves it — at
 * which point the registrant finally gets their letter — or turns it down.
 *
 * Approving here does one thing: it sets the status to confirmed. The letter
 * and the payment record are the collection's own afterChange hook, so that
 * confirming a place in the admin, or confirming its payment, does exactly
 * the same as pressing the button here. There is no second way to grant a
 * place that forgets to tell anybody.
 */

/** Approve a registration. The collection hook does the rest. */
export async function approveRegistrationAction(formData: FormData) {
  const staff = await requireStaff("/learn/workshops");
  const id = String(formData.get("id") || "");
  if (!id) redirect("/learn/workshops?error=missing");

  const payload = await getPayload({ config });

  await payload.update({
    collection: "workshop-registrations",
    id,
    data: {
      status: "confirmed",
      verifiedAt: new Date().toISOString(),
      verifiedBy: staff.id,
    },
    overrideAccess: true,
  });

  revalidatePath("/learn/workshops");
  redirect("/learn/workshops?approved=1");
}

/** Turn one down, with a reason the registrant can act on. */
export async function declineRegistrationAction(formData: FormData) {
  const staff = await requireStaff("/learn/workshops");
  const id = String(formData.get("id") || "");
  const reason =
    String(formData.get("reason") || "").trim() ||
    "We could not match your payment to our bank account.";
  if (!id) redirect("/learn/workshops?error=missing");

  const payload = await getPayload({ config });
  const registration = await payload.findByID({
    collection: "workshop-registrations",
    id,
    depth: 1,
    overrideAccess: true,
  });
  if (!registration) redirect("/learn/workshops?error=missing");

  const workshop =
    typeof registration.workshop === "object" ? (registration.workshop as Workshop) : null;

  await payload.update({
    collection: "workshop-registrations",
    id,
    data: { status: "cancelled", verifiedAt: new Date().toISOString(), verifiedBy: staff.id },
    overrideAccess: true,
  });

  if (workshop) {
    try {
      await payload.sendEmail({
        to: registration.email,
        subject: `About your registration — ${workshop.title}`,
        html: declineHTML(workshop, registration, reason),
      });
    } catch (error) {
      console.error("[workshops] decline email failed:", error);
    }
  }

  revalidatePath("/learn/workshops");
  redirect("/learn/workshops?declined=1");
}

/**
 * Send the joining link to everybody who holds a place.
 *
 * The confirmation letter carries the link, but only if the link existed
 * when the letter went out — and it rarely does. Places are confirmed as the
 * money comes in, over weeks; the Zoom link is made a day or two before. So
 * most confirmed registrants have been told the link will follow, and this
 * is what follows.
 *
 * It goes per person, not per booking: a party of five gets five emails,
 * each addressed to that person and carrying their seat, so the person who
 * paid is not left forwarding anything. An attendee with no email of their
 * own is covered by the booker's copy, as they are everywhere else.
 *
 * Each booking is stamped when its emails go, so pressing the button again
 * after three more people are confirmed writes only to those three. "Send
 * to everyone again" is there because people do lose emails.
 */
export async function sendJoiningLinksAction(formData: FormData) {
  await requireStaff("/learn/workshops");
  const workshopId = String(formData.get("workshopId") || "");
  const resendAll = String(formData.get("mode") || "") === "all";
  if (!workshopId) redirect("/learn/workshops?error=missing");

  const payload = await getPayload({ config });

  const workshop = (await payload.findByID({
    collection: "workshops",
    id: workshopId,
    depth: 0,
    overrideAccess: true,
  })) as Workshop | null;

  // Refusing is the whole point of the check: an email whose button goes
  // nowhere is worse than no email, and it cannot be unsent.
  if (!workshop?.joinUrl?.trim()) {
    redirect("/learn/workshops?error=nolink");
  }

  const confirmed = await payload.find({
    collection: "workshop-registrations",
    where: {
      and: [{ workshop: { equals: workshopId } }, { status: { equals: "confirmed" } }],
    },
    limit: 1000,
    depth: 0,
    overrideAccess: true,
  });

  const targets = resendAll
    ? confirmed.docs
    : confirmed.docs.filter((row) => !row.joiningSentAt);

  // One address, one email, however many bookings or places it appears on.
  const already = new Set<string>();
  let sent = 0;
  let failed = 0;

  for (const registration of targets) {
    const people: { name: string; email: string; seat?: string | null }[] = [];

    for (const attendee of registration.attendees ?? []) {
      const email = attendee.email?.trim().toLowerCase();
      if (!email) continue;
      people.push({ name: attendee.name, email, seat: attendee.seat });
    }

    // The booker always gets one, even when they are not attending: they
    // paid, and they are the one the others will ask.
    const bookerEmail = registration.email.trim().toLowerCase();
    if (!people.some((person) => person.email === bookerEmail)) {
      const self = registration.attendees?.find((row) => !row.email?.trim());
      people.push({
        name: registration.name,
        email: bookerEmail,
        seat: self?.seat ?? registration.paymentReference,
      });
    }

    let delivered = 0;
    for (const person of people) {
      if (already.has(person.email)) continue;
      already.add(person.email);
      try {
        await payload.sendEmail({
          to: person.email,
          subject: `Your joining link — ${workshop.title}`,
          html: joiningHTML(workshop, person.name, person.seat),
        });
        delivered += 1;
        sent += 1;
      } catch (error) {
        failed += 1;
        console.error(`[workshops] joining link to ${person.email} failed:`, error);
      }
    }

    // Stamped only if something actually went, so a mail server that was
    // down leaves the booking in the queue rather than silently dropping it.
    if (delivered > 0) {
      try {
        await payload.update({
          collection: "workshop-registrations",
          id: registration.id,
          data: { joiningSentAt: new Date().toISOString() },
          overrideAccess: true,
        });
      } catch (error) {
        console.error(`[workshops] could not stamp registration ${registration.id}:`, error);
      }
    }
  }

  revalidatePath("/learn/workshops");
  redirect(`/learn/workshops?joining=${sent}${failed > 0 ? `&failed=${failed}` : ""}`);
}

/**
 * Issue certificates to everyone on the register, and email them out.
 *
 * Issuing and sending are deliberately separate: a certificate is created
 * first and emailed second, so a mail server having a bad morning leaves
 * people holding certificates that can be sent again rather than leaving
 * them with nothing. Pressing the button a second time issues nothing new —
 * one per seat — and writes only to whoever has not been told yet.
 */
export async function issueCertificatesAction(formData: FormData) {
  await requireStaff("/learn/workshops");
  const workshopId = String(formData.get("workshopId") || "");
  if (!workshopId) redirect("/learn/workshops?error=missing");

  // Which seats were ticked. None ticked is a mistake, not "everybody".
  const seats = formData
    .getAll("seat")
    .map((value) => String(value).trim())
    .filter(Boolean);
  if (seats.length === 0) redirect("/learn/workshops?error=nobody");

  const payload = await getPayload({ config });

  const workshop = (await payload.findByID({
    collection: "workshops",
    id: workshopId,
    depth: 0,
    overrideAccess: true,
  })) as Workshop | null;
  if (!workshop) redirect("/learn/workshops?error=missing");

  let issued: Awaited<ReturnType<typeof issueWorkshopCertificates>>;
  try {
    issued = await issueWorkshopCertificates(workshopId, seats);
  } catch (error) {
    console.error("[workshops] could not issue certificates:", error);
    redirect("/learn/workshops?error=certificates");
  }

  // The portal is on learn.; the certificate page lives there too.
  const base = (process.env.SITE_URL?.trim() || siteConfig.portalUrl).replace(/\/+$/, "");

  /**
   * The office keeps a copy of every award. Configurable without a
   * deployment, because who should be copied is not a code decision.
   */
  const bcc = (process.env.CERTIFICATE_BCC?.trim()
    ? process.env.CERTIFICATE_BCC.split(",")
    : siteConfig.certificateBcc
  )
    .map((address) => address.trim())
    .filter(Boolean);

  let sent = 0;
  let failed = 0;
  for (const certificate of issued.issued) {
    if (!certificate.holderEmail) continue;
    try {
      /**
       * The certificate goes as an attachment, because that is what the
       * email promises and because a PDF in an inbox outlives any link.
       * Drawn here rather than printed from the page: shared hosting has no
       * browser to print with. A certificate whose PDF will not draw is
       * still sent, with the link alone — it exists either way, and the
       * person should hear about it.
       */
      let attachments: { filename: string; content: Buffer; contentType: string }[] | undefined;
      try {
        const pdf = await certificatePdf(certificate, workshop);
        attachments = [
          {
            filename: certificateFileName(certificate),
            content: Buffer.from(pdf),
            contentType: "application/pdf",
          },
        ];
      } catch (error) {
        console.error(`[workshops] could not draw the PDF for ${certificate.serial}:`, error);
      }

      await payload.sendEmail({
        to: certificate.holderEmail,
        bcc: bcc.length > 0 ? bcc : undefined,
        replyTo: workshop.contactEmail ?? siteConfig.email,
        subject: `Your certificate — ${workshop.title}`,
        html: certificateHTML(
          workshop,
          certificate.holderName,
          certificate.serial,
          `${base}/certificates/${certificate.serial}`,
        ),
        attachments,
      });
      sent += 1;
    } catch (error) {
      failed += 1;
      console.error(`[workshops] certificate email to ${certificate.holderEmail} failed:`, error);
    }
  }

  revalidatePath("/learn/workshops");
  const query = new URLSearchParams({
    certificates: String(issued.issued.length),
    emailed: String(sent),
  });
  if (failed > 0) query.set("failed", String(failed));
  if (issued.skipped > 0) query.set("already", String(issued.skipped));
  redirect(`/learn/workshops?${query.toString()}`);
}

/**
 * Write to everyone who attended: the feedback form, the handout, whatever
 * follows the session.
 *
 * Addressed per person, like the joining link, so each attendee in a group
 * gets their own — the whole reason their names were collected. An attendee
 * with no address of their own is covered by the booker's copy, and one
 * address appearing on several bookings still gets one email.
 *
 * Nothing is stamped on the registration: unlike the joining link this is
 * not a thing you send once, and whether a second round is wanted is the
 * sender's judgement, not ours. The screen says how many it will go to and
 * asks before sending, which is the guard that matters.
 */
export async function sendFollowUpAction(formData: FormData) {
  const staff = await requireStaff("/learn/workshops");

  const workshopId = String(formData.get("workshopId") || "");
  const heading = String(formData.get("heading") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const feedbackUrl = String(formData.get("feedbackUrl") || "").trim();
  const feedbackLabel = String(formData.get("feedbackLabel") || "").trim();
  const handoutUrl = String(formData.get("handoutUrl") || "").trim();
  const handoutLabel = String(formData.get("handoutLabel") || "").trim();
  const subject = String(formData.get("subject") || "").trim();

  if (!workshopId) redirect("/learn/workshops?error=missing");
  if (!body || !subject) redirect("/learn/workshops?error=followupempty");

  // A link that is not a link would render as a dead button.
  for (const url of [feedbackUrl, handoutUrl]) {
    if (url && !/^https?:\/\//i.test(url)) {
      redirect("/learn/workshops?error=followupurl");
    }
  }

  const payload = await getPayload({ config });

  const workshop = (await payload.findByID({
    collection: "workshops",
    id: workshopId,
    depth: 0,
    overrideAccess: true,
  })) as Workshop | null;
  if (!workshop) redirect("/learn/workshops?error=missing");

  const confirmed = await payload.find({
    collection: "workshop-registrations",
    where: {
      and: [{ workshop: { equals: workshopId } }, { status: { equals: "confirmed" } }],
    },
    limit: 1000,
    depth: 0,
    overrideAccess: true,
  });

  const already = new Set<string>();
  const recipients: string[] = [];
  let sent = 0;
  let failed = 0;

  for (const registration of confirmed.docs) {
    const people: { name: string; email: string }[] = [];

    for (const attendee of registration.attendees ?? []) {
      const email = attendee.email?.trim().toLowerCase();
      if (!email || !attendee.name?.trim()) continue;
      people.push({ name: attendee.name, email });
    }

    const bookerEmail = registration.email.trim().toLowerCase();
    if (!people.some((person) => person.email === bookerEmail)) {
      people.push({ name: registration.name, email: bookerEmail });
    }

    for (const person of people) {
      if (already.has(person.email)) continue;
      already.add(person.email);
      try {
        await payload.sendEmail({
          to: person.email,
          subject,
          // Replies go to a person who reads email, not to the mailbox the
          // server authenticates as.
          replyTo: workshop.contactEmail ?? staff.email,
          html: followUpHTML(workshop, person.name, {
            heading: heading || subject,
            body,
            feedbackUrl: feedbackUrl || undefined,
            feedbackLabel: feedbackLabel || undefined,
            handoutUrl: handoutUrl || undefined,
            handoutLabel: handoutLabel || undefined,
          }),
        });
        recipients.push(`${person.name} <${person.email}>`);
        sent += 1;
      } catch (error) {
        failed += 1;
        console.error(`[workshops] follow-up to ${person.email} failed:`, error);
      }
    }
  }

  /**
   * A copy for whoever sent it.
   *
   * Mail sent over SMTP does not appear in anybody's Sent Items — that
   * folder is written by the mail client that composed the message, and here
   * there isn't one. So the portal sends the record itself: the email
   * exactly as it went out, with every address it went to listed at the top.
   * File it wherever you keep sent mail.
   */
  if (sent > 0) {
    try {
      await payload.sendEmail({
        to: staff.email,
        subject: `[Copy] ${subject}`,
        replyTo: workshop.contactEmail ?? staff.email,
        html: `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:580px;margin:0 auto;padding:16px 24px 0;color:#1f2937;line-height:1.5">
  <p style="margin:0 0 8px;padding:12px 16px;background:#f3f4f6;border-radius:8px;font-size:13px">
    <strong>Your copy.</strong> Sent ${sent} ${sent === 1 ? "email" : "emails"} for
    ${workshop.title}${failed > 0 ? `, ${failed} failed` : ""}. Below is the message exactly as
    each person received it, addressed to them by name.
  </p>
  <details style="margin:0 0 4px;font-size:13px;color:#374151">
    <summary style="cursor:pointer;padding:6px 0"><strong>Who it went to (${recipients.length})</strong></summary>
    <div style="padding:6px 0 0;white-space:pre-line">${recipients.map((line) => line.replace(/</g, "&lt;").replace(/>/g, "&gt;")).join("\n")}</div>
  </details>
</div>
<hr style="max-width:580px;margin:12px auto;border:0;border-top:1px solid #e5e7eb">
${followUpHTML(workshop, staff.name ?? "there", {
  heading: heading || subject,
  body,
  feedbackUrl: feedbackUrl || undefined,
  feedbackLabel: feedbackLabel || undefined,
  handoutUrl: handoutUrl || undefined,
  handoutLabel: handoutLabel || undefined,
})}`,
      });
    } catch (error) {
      console.error("[workshops] sender's copy failed:", error);
    }
  }

  const query = new URLSearchParams({ followup: String(sent) });
  if (failed > 0) query.set("failed", String(failed));
  redirect(`/learn/workshops?${query.toString()}`);
}
