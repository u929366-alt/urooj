"use server";

import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { identifyUpload, MAX_RECEIPT_BYTES } from "./uploads";
import { siteConfig } from "@/lib/site";
import type { Workshop } from "@/payload-types";

/**
 * Receiving a bank transfer receipt from someone who has no account.
 *
 * They registered, went to the bank, and have come back with a photograph.
 * The only thing identifying them is the payment reference they were given,
 * so that is what this is keyed on.
 *
 * Open to the internet, which shapes every decision here: the reference must
 * match a real registration, the file is size-limited, and the type is checked
 * against the bytes rather than the name or the type the browser claims. A
 * file called receipt.jpg that is not an image does not get written to disk.
 */

export type ReceiptState =
  | { error: string }
  | { success: true; filename: string }
  | null;

export async function uploadReceiptAction(
  _prev: ReceiptState,
  formData: FormData,
): Promise<ReceiptState> {
  const reference = String(formData.get("reference") || "").trim().toUpperCase();
  if (!reference) return { error: "No payment reference was given." };

  const payload = await getPayload({ config });

  const found = await payload.find({
    collection: "workshop-registrations",
    where: { paymentReference: { equals: reference } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  });
  const registration = found.docs[0];
  if (!registration) {
    return {
      error:
        "That reference was not recognised. Check it against your confirmation email, or write to us and we will sort it out.",
    };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose the receipt file first." };
  }
  if (file.size > MAX_RECEIPT_BYTES) {
    return { error: "That file is larger than 8 MB. A photo of the receipt is enough." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const kind = identifyUpload(buffer);
  if (!kind) {
    return {
      error:
        "That does not look like a photo or a PDF. Send a screenshot, a photograph of the slip, or the bank's PDF receipt.",
    };
  }

  try {
    const safe = `${reference}-${Date.now()}.${kind.ext}`;
    const created = await payload.create({
      collection: "payment-receipts",
      data: { registration: registration.id, reference },
      file: { data: buffer, mimetype: kind.mime, name: safe, size: buffer.length },
      overrideAccess: true,
    });

    await payload.update({
      collection: "workshop-registrations",
      id: registration.id,
      data: { receipt: created.id, receiptUploadedAt: new Date().toISOString() },
      overrideAccess: true,
    });

    // Tell whoever runs the workshop, so a receipt does not sit unnoticed.
    const workshop =
      typeof registration.workshop === "object" ? (registration.workshop as Workshop) : null;
    const to = workshop?.contactEmail ?? siteConfig.email;
    try {
      await payload.sendEmail({
        to,
        subject: `Payment receipt received — ${registration.name}`,
        html: `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;color:#1f2937">
  <p><strong>${registration.name}</strong> has sent in a receipt for
  ${workshop?.title ?? "a workshop"}.</p>
  <table style="border-collapse:collapse;font-size:14px">
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Reference</td><td style="padding:4px 0"><strong>${reference}</strong></td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Amount</td><td style="padding:4px 0">Rs ${(registration.amountDue ?? 0).toLocaleString("en-PK")}</td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Email</td><td style="padding:4px 0">${registration.email}</td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Phone</td><td style="padding:4px 0">${registration.phone ?? "—"}</td></tr>
  </table>
  <p>Open it in the admin under Workshop Registrations, check it against the
  bank, then confirm the payment in Payments.</p>
</div>`,
      });
    } catch (error) {
      console.error("[workshops] could not notify staff about a receipt:", error);
    }

    revalidatePath(`/workshops/receipt/${reference}`);
    return { success: true, filename: file.name };
  } catch (error) {
    console.error("[workshops] receipt upload failed:", error);
    return { error: "We could not save that file. Please try again, or email it to us." };
  }
}
