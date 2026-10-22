"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { requireStaff } from "./auth";
import { declineHTML } from "./workshopEmails";
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
