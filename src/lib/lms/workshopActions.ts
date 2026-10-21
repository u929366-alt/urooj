"use server";

import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";
import { createPendingPayment, formatRupees, bankInstructions } from "./payments";
import { getWorkshopBySlug, priceFor, registrationState } from "./workshops";
import { identifyUpload, MAX_RECEIPT_BYTES } from "./uploads";
import { siteConfig } from "@/lib/site";
import type { Workshop } from "@/payload-types";

/**
 * Workshop registration, for members of the public.
 *
 * Nobody needs an account. That is the point: a working psychologist who saw
 * the flyer should be able to book a place in one screen, without being asked
 * to create a login for a learning portal they will never use again.
 *
 * The fee is paid before registering, not after. The form will not submit
 * without a receipt attached, and a registration is not a place until a
 * member of staff has looked at that receipt and approved it. Until then the
 * registrant gets an acknowledgement, not a confirmation — the two are
 * deliberately different emails, because only one of them promises anything.
 *
 * Open to the internet, so everything is validated here and the rows are
 * written with overrideAccess. The collections themselves refuse creation.
 */

export type RegistrationState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: { name: string; email: string; amount: number };
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

/**
 * "We have your registration and your receipt."
 *
 * Carefully not a confirmation. Their place is not held until someone has
 * checked the payment, and this email must not imply otherwise.
 */
function acknowledgementHTML(
  workshop: Workshop,
  args: { name: string; amount: number; places: number },
) {
  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1f2937">
  <h1 style="font-size:20px;color:#0b2c49;margin:0 0 16px">We have your registration</h1>
  <p style="margin:0 0 12px">Dear ${args.name},</p>
  <p style="margin:0 0 20px">
    Thank you for registering${args.places > 1 ? ` ${args.places} places` : ""} for
    <strong>${workshop.title}</strong>${workshop.tagline ? ` — ${workshop.tagline}` : ""},
    and for sending your payment receipt.
  </p>
  <table style="border-collapse:collapse;font-size:14px;margin:0 0 20px">
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">When</td><td style="padding:4px 0"><strong>${formatWhen(workshop.startsAt)}</strong> (Pakistan time)</td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Where</td><td style="padding:4px 0">${workshop.platform ?? "Online"}</td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Amount sent</td><td style="padding:4px 0">${formatRupees(args.amount)}</td></tr>
  </table>
  <p style="margin:0 0 12px">
    We will check the payment against our bank account and email you to confirm your place.
    <strong>The joining link comes with that confirmation</strong>, not with this message.
  </p>
  <p style="margin:24px 0 0;font-size:13px;color:#6b7280">
    Questions? ${workshop.contactName ? `${workshop.contactName} — ` : ""}${workshop.contactEmail ?? siteConfig.email}
  </p>
</div>`;
}

/** What staff get the moment a registration arrives, so none sits unseen. */
function staffAlertHTML(
  workshop: Workshop,
  args: { name: string; email: string; phone: string; amount: number; category: string; places: number },
) {
  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;color:#1f2937">
  <h1 style="font-size:18px;color:#0b2c49;margin:0 0 12px">New registration awaiting your check</h1>
  <p style="margin:0 0 16px"><strong>${args.name}</strong> has registered for ${workshop.title} and attached a receipt.</p>
  <table style="border-collapse:collapse;font-size:14px;margin:0 0 16px">
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Email</td><td style="padding:4px 0">${args.email}</td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Phone</td><td style="padding:4px 0">${args.phone}</td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Category</td><td style="padding:4px 0">${args.category}${args.places > 1 ? ` · ${args.places} places` : ""}</td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Amount claimed</td><td style="padding:4px 0"><strong>${formatRupees(args.amount)}</strong></td></tr>
  </table>
  <p style="margin:0 0 12px">
    Open <a href="${siteConfig.portalUrl}/learn/workshops">${siteConfig.portalUrl}/learn/workshops</a>,
    look at the receipt, and approve it to send their confirmation.
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

  const unit = priceFor(workshop, parsed.data.category);
  const amount = unit * parsed.data.groupSize;

  // The receipt is part of registering, not a follow-up. Checked before
  // anything is written, so a refused file leaves nothing behind.
  const file = formData.get("receipt");
  let receiptFile: { data: Buffer; mimetype: string; name: string; size: number } | null = null;

  if (amount > 0) {
    if (!(file instanceof File) || file.size === 0) {
      return {
        fieldErrors: {
          receipt: "Please attach your payment receipt — registration needs it.",
        },
      };
    }
    if (file.size > MAX_RECEIPT_BYTES) {
      return {
        fieldErrors: { receipt: "That file is larger than 8 MB. A photo of the receipt is enough." },
      };
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const kind = identifyUpload(buffer);
    if (!kind) {
      return {
        fieldErrors: {
          receipt:
            "That does not look like a photo or a PDF. Send a screenshot, a photograph of the slip, or the bank's PDF receipt.",
        },
      };
    }
    receiptFile = {
      data: buffer,
      mimetype: kind.mime,
      name: `${Date.now()}.${kind.ext}`,
      size: buffer.length,
    };
  }

  const payload = await getPayload({ config });

  // Someone pressing the button twice, or coming back unsure whether it went
  // through, should not end up registered twice.
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
        email: existing.docs[0].email,
        amount: existing.docs[0].amountDue ?? 0,
      },
    };
  }

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
      // the person matters more than the bookkeeping row, and staff can
      // raise one by hand from the admin.
      reference = null;
    }
  }

  const registration = await payload.create({
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
      // Never "confirmed" here, whatever the amount. A place is granted by a
      // person who has looked at the money, not by this form.
      status: "pending",
      paymentReference: reference,
      amountDue: amount,
    },
    overrideAccess: true,
  });

  if (receiptFile) {
    try {
      const receipt = await payload.create({
        collection: "payment-receipts",
        data: { registration: registration.id, reference: reference ?? undefined },
        file: {
          ...receiptFile,
          name: `${reference ?? registration.id}-${receiptFile.name}`,
        },
        overrideAccess: true,
      });
      await payload.update({
        collection: "workshop-registrations",
        id: registration.id,
        data: { receipt: receipt.id, receiptUploadedAt: new Date().toISOString() },
        overrideAccess: true,
      });
    } catch (error) {
      console.error("[workshops] could not store the receipt:", error);
    }
  }

  await payload.update({
    collection: "workshops",
    id: workshop.id,
    data: { registrationCount: (workshop.registrationCount ?? 0) + parsed.data.groupSize },
    overrideAccess: true,
  });

  // Both emails are best effort. A mail server that is down must not make the
  // registrant think their booking failed, because it did not.
  try {
    await payload.sendEmail({
      to: parsed.data.email,
      subject: `We have your registration — ${workshop.title}`,
      html: acknowledgementHTML(workshop, {
        name: parsed.data.name,
        amount,
        places: parsed.data.groupSize,
      }),
    });
  } catch (error) {
    console.error("[workshops] acknowledgement email failed:", error);
  }

  try {
    await payload.sendEmail({
      to: workshop.contactEmail ?? siteConfig.email,
      subject: `New registration to check — ${parsed.data.name}`,
      html: staffAlertHTML(workshop, {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        amount,
        category: parsed.data.category,
        places: parsed.data.groupSize,
      }),
    });
  } catch (error) {
    console.error("[workshops] staff alert failed:", error);
  }

  revalidatePath(`/workshops/${workshop.slug}`);
  revalidatePath("/learn/workshops");
  return {
    success: { name: parsed.data.name, email: parsed.data.email, amount },
  };
}

/** Bank details for the "pay first" panel on the public page. */
export async function workshopBankDetails() {
  return bankInstructions();
}
