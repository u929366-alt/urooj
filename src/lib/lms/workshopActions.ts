"use server";

import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";
import { createPendingPayment, formatRupees, bankInstructions } from "./payments";
import { getWorkshopBySlug, priceFor, registrationState } from "./workshops";
import { siteConfig } from "@/lib/site";
import type { Workshop } from "@/payload-types";

/**
 * Workshop registration, for members of the public.
 *
 * Nobody needs an account. That is the point: a working psychologist who saw
 * the flyer should be able to book a place in one screen, without being asked
 * to create a login for a learning portal they will never use again.
 *
 * Because it is open to the internet, everything is validated here and the
 * row is written with overrideAccess — the collection itself refuses creation
 * so this is the only door.
 */

export type RegistrationState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: {
    name: string;
    reference: string | null;
    amount: number;
    email: string;
  };
} | null;

const schema = z.object({
  slug: z.string().trim().min(1),
  name: z.string().trim().min(2, "Please enter your full name."),
  email: z.email("Please enter a valid email address."),
  phone: z.string().trim().min(7, "Please enter a phone number we can reach you on."),
  city: z.string().trim().optional(),
  category: z.enum(["professional", "student"]),
  organisation: z.string().trim().optional(),
  groupSize: z.coerce.number().int().min(1).max(20).default(1),
  notes: z.string().trim().max(2000).optional(),
});

function flatten(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}

function confirmationHTML(
  workshop: Workshop,
  args: { name: string; amount: number; reference: string | null; places: number },
) {
  const bank = bankInstructions();
  const when = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Karachi",
  }).format(new Date(workshop.startsAt));

  const payable =
    args.amount > 0
      ? `
  <h2 style="font-size:16px;color:#0b2c49;margin:24px 0 8px">Paying the fee</h2>
  <p style="margin:0 0 12px">
    Your place is held. To confirm it, transfer <strong>${formatRupees(args.amount)}</strong>
    and quote this reference so we can match the payment to you:
  </p>
  <p style="margin:0 0 16px;font-size:20px;font-weight:bold;letter-spacing:1px;color:#0b2c49">
    ${args.reference ?? "—"}
  </p>
  <table style="border-collapse:collapse;font-size:14px;margin:0 0 16px">
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Bank</td><td style="padding:4px 0">${bank.bankName}</td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Account title</td><td style="padding:4px 0">${bank.accountTitle}</td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">IBAN</td><td style="padding:4px 0;font-family:monospace">${bank.iban}</td></tr>
  </table>
  <p style="margin:0 0 16px">
    Once you have paid, send us the receipt and we will confirm your place:
  </p>
  <p style="margin:0 0 16px">
    <a href="${siteConfig.portalUrl}/workshops/receipt/${args.reference ?? ""}"
       style="display:inline-block;background:#0b5394;color:#ffffff;text-decoration:none;
              padding:12px 24px;border-radius:999px;font-weight:bold">
      Attach your payment receipt
    </a>
  </p>
  <p style="margin:0 0 12px;font-size:13px;color:#6b7280">
    If the button does not work, open this link:<br>
    ${siteConfig.portalUrl}/workshops/receipt/${args.reference ?? ""}
  </p>
  <p style="margin:0 0 12px">
    You can also email the receipt to ${workshop.contactEmail ?? siteConfig.email}. The joining
    link is sent once the fee is received.
  </p>`
      : `
  <p style="margin:0 0 12px">
    Your place is confirmed. The joining link will be emailed to you before the session.
  </p>`;

  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1f2937">
  <h1 style="font-size:20px;color:#0b2c49;margin:0 0 16px">You are registered for ${workshop.title}</h1>
  <p style="margin:0 0 12px">Dear ${args.name},</p>
  <p style="margin:0 0 20px">
    Thank you for registering${args.places > 1 ? ` ${args.places} places` : ""} for
    <strong>${workshop.title}</strong>${workshop.tagline ? ` — ${workshop.tagline}` : ""}.
  </p>
  <table style="border-collapse:collapse;font-size:14px;margin:0 0 8px">
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">When</td><td style="padding:4px 0"><strong>${when}</strong> (Pakistan time)</td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Where</td><td style="padding:4px 0">${workshop.platform ?? "Online"}</td></tr>
    ${workshop.presenterName ? `<tr><td style="padding:4px 16px 4px 0;color:#6b7280">Presented by</td><td style="padding:4px 0">${workshop.presenterName}</td></tr>` : ""}
  </table>
  ${payable}
  <p style="margin:24px 0 0;font-size:13px;color:#6b7280">
    Questions? ${workshop.contactName ? `${workshop.contactName} — ` : ""}${workshop.contactEmail ?? siteConfig.email}
  </p>
</div>`;
}

export async function registerForWorkshopAction(
  _prev: RegistrationState,
  formData: FormData,
): Promise<RegistrationState> {
  const parsed = schema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    city: formData.get("city") || undefined,
    category: formData.get("category"),
    organisation: formData.get("organisation") || undefined,
    groupSize: formData.get("groupSize") ?? 1,
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) return { fieldErrors: flatten(parsed.error) };

  const workshop = await getWorkshopBySlug(parsed.data.slug);
  if (!workshop) return { error: "That workshop could not be found." };

  const state = registrationState(workshop);
  if (!state.open) {
    return {
      error:
        state.reason === "full"
          ? "This workshop is now full."
          : state.reason === "past"
            ? "This workshop has already taken place."
            : "Registration for this workshop has closed.",
    };
  }

  const payload = await getPayload({ config });

  // Someone pressing the button twice, or coming back a week later unsure
  // whether it went through, should not end up registered twice.
  const existing = await payload.find({
    collection: "workshop-registrations",
    where: {
      and: [
        { workshop: { equals: workshop.id } },
        { email: { equals: parsed.data.email.toLowerCase() } },
      ],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  if (existing.docs[0]) {
    return {
      success: {
        name: existing.docs[0].name,
        reference: existing.docs[0].paymentReference ?? null,
        amount: existing.docs[0].amountDue ?? 0,
        email: existing.docs[0].email,
      },
    };
  }

  const unit = priceFor(workshop, parsed.data.category);
  const amount = unit * parsed.data.groupSize;

  let reference: string | null = null;
  if (amount > 0) {
    try {
      const payment = await createPendingPayment({
        purpose: "workshop",
        amount,
        payerName: parsed.data.name,
        payerEmail: parsed.data.email,
        payerPhone: parsed.data.phone,
        cause: workshop.title,
        message:
          parsed.data.groupSize > 1
            ? `${parsed.data.groupSize} places, ${parsed.data.category}`
            : parsed.data.category,
      });
      reference = payment.reference;
    } catch {
      // A failure to allocate a reference must not lose the registration —
      // the person is far more valuable than the payment row, and staff can
      // raise an invoice by hand from the admin.
      reference = null;
    }
  }

  await payload.create({
    collection: "workshop-registrations",
    data: {
      workshop: workshop.id,
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone,
      city: parsed.data.city,
      category: parsed.data.category,
      organisation: parsed.data.organisation,
      groupSize: parsed.data.groupSize,
      notes: parsed.data.notes,
      status: amount > 0 ? "pending" : "confirmed",
      paymentReference: reference,
      amountDue: amount,
    },
    overrideAccess: true,
  });

  await payload.update({
    collection: "workshops",
    id: workshop.id,
    data: { registrationCount: (workshop.registrationCount ?? 0) + parsed.data.groupSize },
    overrideAccess: true,
  });

  // Best effort. A mail server that is down should not make the registrant
  // think their booking failed, because it did not.
  try {
    await payload.sendEmail({
      to: parsed.data.email,
      subject: `You are registered — ${workshop.title}`,
      html: confirmationHTML(workshop, {
        name: parsed.data.name,
        amount,
        reference,
        places: parsed.data.groupSize,
      }),
    });
  } catch (error) {
    console.error("[workshops] confirmation email failed:", error);
  }

  revalidatePath(`/workshops/${workshop.slug}`);
  return {
    success: { name: parsed.data.name, reference, amount, email: parsed.data.email },
  };
}
