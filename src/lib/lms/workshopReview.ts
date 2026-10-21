"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { requireStaff } from "./auth";
import { confirmPayment } from "./payments";
import { confirmationHTML, declineHTML } from "./workshopEmails";
import type { Workshop } from "@/payload-types";

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
 *
 * The wording of both emails is in ./workshopEmails.
 */

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
        subject: `Your place is confirmed — ${workshop.title}`,
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
