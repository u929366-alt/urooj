"use server";

import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { z } from "zod";
import { createPendingPayment, bankInstructions } from "./payments";
import { getWorkshopBySlug, priceFor, registrationState } from "./workshops";
import { identifyUpload, MAX_RECEIPT_BYTES } from "./uploads";
import { staffAlertHTML } from "./workshopEmails";
import { siteConfig } from "@/lib/site";

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

  // Nothing goes to the registrant here. The only email they ever get is the
  // letter, and that is sent when a person has confirmed their payment —
  // never by the act of filling in this form. The screen tells them so.
  //
  // Staff are told straight away, best effort: a mail server that is down
  // must not make the registrant think their booking failed, because it has
  // not — the row is already written.
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
