"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { requireStaff } from "./auth";
import { declineHTML, joiningHTML } from "./workshopEmails";
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
