"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { requireStaff } from "./auth";
import { formatRupees, confirmPayment } from "./payments";
import { siteConfig } from "@/lib/site";
import type { Workshop, WorkshopRegistration } from "@/payload-types";

/**
 * Approving a workshop registration.
 *
 * Someone has transferred a fee and sent a photograph of the slip. A member
 * of staff looks at it against the bank account and either approves it — at
 * which point the registrant finally gets a confirmation and the joining link
 * — or turns it down.
 *
 * The confirmation email is sent from here and nowhere else. That is the
 * whole point of the workflow: nothing promises a place until a person has
 * checked the money.
 */

function formatWhen(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Karachi",
  }).format(new Date(value));
}

function confirmationHTML(workshop: Workshop, registration: WorkshopRegistration) {
  const joining = workshop.joinUrl
    ? `
  <h2 style="font-size:16px;color:#0b2c49;margin:24px 0 8px">Joining the session</h2>
  <p style="margin:0 0 16px">
    <a href="${workshop.joinUrl}"
       style="display:inline-block;background:#0b5394;color:#ffffff;text-decoration:none;
              padding:12px 24px;border-radius:999px;font-weight:bold">
      Join on ${workshop.platform ?? "the day"}
    </a>
  </p>
  <p style="margin:0 0 16px;font-size:13px;color:#6b7280">
    If the button does not work, open this link:<br>${workshop.joinUrl}
  </p>
  <p style="margin:0 0 12px">
    Save this email — it is your way in. Please join a few minutes early.
  </p>`
    : `
  <p style="margin:0 0 12px">
    The joining link will be emailed to you before the session.
  </p>`;

  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1f2937">
  <h1 style="font-size:20px;color:#0b2c49;margin:0 0 16px">Your place is confirmed</h1>
  <p style="margin:0 0 12px">Dear ${registration.name},</p>
  <p style="margin:0 0 20px">
    We have received your payment of
    <strong>${formatRupees(registration.amountDue ?? 0)}</strong> and your place at
    <strong>${workshop.title}</strong> is confirmed${
      (registration.groupSize ?? 1) > 1 ? ` — ${registration.groupSize} places` : ""
    }.
  </p>
  <table style="border-collapse:collapse;font-size:14px;margin:0 0 8px">
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">When</td><td style="padding:4px 0"><strong>${formatWhen(workshop.startsAt)}</strong> (Pakistan time)</td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Where</td><td style="padding:4px 0">${workshop.platform ?? "Online"}</td></tr>
    ${workshop.presenterName ? `<tr><td style="padding:4px 16px 4px 0;color:#6b7280">Presented by</td><td style="padding:4px 0">${workshop.presenterName}</td></tr>` : ""}
  </table>
  ${joining}
  <p style="margin:24px 0 0;font-size:13px;color:#6b7280">
    Questions? ${workshop.contactName ? `${workshop.contactName} — ` : ""}${workshop.contactEmail ?? siteConfig.email}
  </p>
</div>`;
}

function declineHTML(workshop: Workshop, registration: WorkshopRegistration, reason: string) {
  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1f2937">
  <h1 style="font-size:20px;color:#0b2c49;margin:0 0 16px">About your registration</h1>
  <p style="margin:0 0 12px">Dear ${registration.name},</p>
  <p style="margin:0 0 16px">
    Thank you for registering for <strong>${workshop.title}</strong>. We have not been able to
    confirm your place yet:
  </p>
  <p style="margin:0 0 16px;padding:12px 16px;background:#fef3c7;border-radius:8px">${reason}</p>
  <p style="margin:0 0 12px">
    Reply to this email and we will sort it out — your registration is still here.
  </p>
  <p style="margin:24px 0 0;font-size:13px;color:#6b7280">
    ${workshop.contactName ? `${workshop.contactName} — ` : ""}${workshop.contactEmail ?? siteConfig.email}
  </p>
</div>`;
}

/** Approve a registration: mark the fee received and send the confirmation. */
export async function approveRegistrationAction(formData: FormData) {
  const staff = await requireStaff("/learn/workshops");
  const id = String(formData.get("id") || "");
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
    data: {
      status: "confirmed",
      verifiedAt: new Date().toISOString(),
      verifiedBy: staff.id,
    },
    overrideAccess: true,
  });

  // Mark the money received too, so the finance page and the register agree.
  if (registration.paymentReference) {
    try {
      await confirmPayment(registration.paymentReference, staff);
    } catch (error) {
      console.error("[workshops] could not confirm the payment record:", error);
    }
  }

  if (workshop) {
    try {
      await payload.sendEmail({
        to: registration.email,
        subject: `Confirmed — ${workshop.title}`,
        html: confirmationHTML(workshop, registration),
      });
    } catch (error) {
      // The place is confirmed either way; staff can see the failure here and
      // write to the person by hand rather than losing the approval.
      console.error("[workshops] confirmation email failed:", error);
      revalidatePath("/learn/workshops");
      redirect("/learn/workshops?error=email");
    }
  }

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
