import "server-only";

import { randomBytes } from "crypto";
import { cache } from "react";
import { getPayloadClient } from "./auth";
import { siteConfig } from "@/lib/site";
import type { Payment, User } from "@/payload-types";

/**
 * Payment records, references and receipts.
 *
 * There is no gateway: money arrives by bank transfer against a reference, and
 * a staff member confirms it. Everything that grants access reads `status`,
 * which only staff can change.
 *
 * Adding a gateway later means one new function that takes a Payment and
 * returns a redirect URL, plus a callback route that verifies the gateway's
 * signature and calls `confirmPayment`. Nothing else here needs to change.
 */

export function formatRupees(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Short, unambiguous, and safe to read down a phone line. */
function makeReference(purpose: "donation" | "course"): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  let body = "";
  for (const byte of bytes) body += alphabet[byte % alphabet.length];
  const tag = purpose === "donation" ? "D" : "C";
  return `HS-${tag}-${body}`;
}

type CreateArgs = {
  purpose: "donation" | "course";
  amount: number;
  payerName: string;
  payerEmail: string;
  payerPhone?: string;
  payerId?: number;
  courseId?: number;
  cause?: string;
  message?: string;
};

export async function createPendingPayment(args: CreateArgs): Promise<Payment> {
  const payload = await getPayloadClient();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const reference = makeReference(args.purpose);
    try {
      return await payload.create({
        collection: "payments",
        overrideAccess: true,
        data: {
          reference,
          purpose: args.purpose,
          status: "pending",
          method: "bank_transfer",
          amount: args.amount,
          currency: "PKR",
          payerName: args.payerName,
          payerEmail: args.payerEmail.toLowerCase(),
          payerPhone: args.payerPhone,
          payer: args.payerId,
          course: args.courseId,
          cause: args.cause,
          message: args.message,
        },
      });
    } catch (error) {
      // Reference collision is the only expected failure; retry with a new one.
      if (attempt === 4) throw error;
    }
  }
  throw new Error("Could not allocate a payment reference.");
}

export const getPaymentByReference = cache(
  async (reference: string): Promise<Payment | null> => {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "payments",
      where: { reference: { equals: reference } },
      limit: 1,
      depth: 1,
      overrideAccess: true,
    });
    return result.docs[0] ?? null;
  },
);

export async function listPayments(status?: "pending" | "confirmed" | "cancelled") {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "payments",
    where: status ? { status: { equals: status } } : {},
    sort: "-createdAt",
    limit: 200,
    depth: 1,
    overrideAccess: true,
  });
  return result.docs;
}

/** Bank details shown to a payer, and repeated in their email. */
export function bankInstructions() {
  return {
    bankName: siteConfig.bankDetails.bankName,
    accountTitle: siteConfig.bankDetails.accountTitle,
    iban: siteConfig.bankDetails.iban,
  };
}

function paymentEmailHTML(payment: Payment, opts: { confirmed: boolean }) {
  const bank = bankInstructions();
  const amount = formatRupees(payment.amount);
  const what =
    payment.purpose === "donation"
      ? `your donation${payment.cause ? ` towards ${payment.cause}` : ""}`
      : "your course fee";

  if (opts.confirmed) {
    return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1f2937">
  <h1 style="font-size:20px;color:#0b2c49;margin:0 0 16px">Payment received — thank you</h1>
  <p style="margin:0 0 12px">Dear ${payment.payerName},</p>
  <p style="margin:0 0 20px">
    We have received ${amount} for ${what}. Thank you for supporting Hunarsaaz.
  </p>
  <table style="border-collapse:collapse;margin:0 0 20px;font-size:14px">
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Receipt number</td>
        <td style="padding:4px 0;font-weight:bold">${payment.receiptNumber ?? "—"}</td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Reference</td>
        <td style="padding:4px 0;font-weight:bold">${payment.reference}</td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Amount</td>
        <td style="padding:4px 0;font-weight:bold">${amount}</td></tr>
  </table>
  ${
    payment.purpose === "course"
      ? `<p style="margin:0 0 20px">Your place is confirmed. Sign in at
         ${siteUrl()}/learn to start the course.</p>`
      : ""
  }
  <p style="margin:0;font-size:13px;color:#6b7280">
    Please keep this email as your receipt. Questions: ${siteConfig.email}
  </p>
</div>`;
  }

  return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1f2937">
  <h1 style="font-size:20px;color:#0b2c49;margin:0 0 16px">How to complete your payment</h1>
  <p style="margin:0 0 12px">Dear ${payment.payerName},</p>
  <p style="margin:0 0 20px">
    Thank you for ${what}. To complete it, transfer <strong>${amount}</strong> to the
    account below, <strong>quoting the reference</strong> so we can match it to you.
  </p>
  <table style="border-collapse:collapse;margin:0 0 20px;font-size:14px">
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Bank</td>
        <td style="padding:4px 0;font-weight:bold">${bank.bankName}</td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Account title</td>
        <td style="padding:4px 0;font-weight:bold">${bank.accountTitle}</td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">IBAN</td>
        <td style="padding:4px 0;font-weight:bold">${bank.iban}</td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#6b7280">Amount</td>
        <td style="padding:4px 0;font-weight:bold">${amount}</td></tr>
    <tr><td style="padding:8px 16px 4px 0;color:#6b7280">Reference</td>
        <td style="padding:8px 0;font-weight:bold;font-size:16px">${payment.reference}</td></tr>
  </table>
  ${
    payment.purpose === "course"
      ? `<p style="margin:0 0 20px">Your place is held. The course opens as soon as we
         confirm the transfer, usually within one working day.</p>`
      : ""
  }
  <p style="margin:0;font-size:13px;color:#6b7280">
    We will email a receipt once the transfer arrives. Questions: ${siteConfig.email}
  </p>
</div>`;
}

function siteUrl(): string {
  return process.env.SITE_URL?.trim() || siteConfig.url;
}

/** Instructions to the payer, and a heads-up to the organisation. */
export async function sendPaymentInstructions(payment: Payment): Promise<void> {
  const payload = await getPayloadClient();
  const amount = formatRupees(payment.amount);

  try {
    await payload.sendEmail({
      to: payment.payerEmail,
      subject: `Your Hunarsaaz payment reference ${payment.reference}`,
      html: paymentEmailHTML(payment, { confirmed: false }),
    });
  } catch (error) {
    // A failed email must not lose the payment record — the reference is
    // still shown on screen, and staff can see the record in the admin.
    console.error("[payments] could not email instructions:", error);
  }

  try {
    await payload.sendEmail({
      to: siteConfig.email,
      subject: `New ${payment.purpose} pending: ${amount} (${payment.reference})`,
      html: `<p>${payment.payerName} (${payment.payerEmail}) has been asked to transfer
             ${amount}, reference <strong>${payment.reference}</strong>.</p>
             <p>Confirm it in the admin once it appears on the statement.</p>`,
    });
  } catch (error) {
    console.error("[payments] could not notify the organisation:", error);
  }
}

/**
 * Mark a payment received, issue a receipt number, email the payer, and — for
 * a course fee — activate the enrolment that was waiting on it.
 */
export async function confirmPayment(
  reference: string,
  staff: User,
  bankReference?: string,
): Promise<Payment | null> {
  const payload = await getPayloadClient();
  const existing = await getPaymentByReference(reference);
  if (!existing) return null;
  if (existing.status === "confirmed") return existing;

  const year = new Date().getFullYear();
  const count = await payload.count({
    collection: "payments",
    where: { status: { equals: "confirmed" } },
    overrideAccess: true,
  });
  const receiptNumber = `HS-R-${year}-${String(count.totalDocs + 1).padStart(5, "0")}`;

  const updated = await payload.update({
    collection: "payments",
    id: existing.id,
    overrideAccess: true,
    data: {
      status: "confirmed",
      receiptNumber,
      confirmedAt: new Date().toISOString(),
      confirmedBy: staff.id,
      bankReference: bankReference || existing.bankReference,
    },
  });

  // Release the course place this payment was holding.
  if (updated.purpose === "course") {
    const courseId =
      typeof updated.course === "object" && updated.course ? updated.course.id : updated.course;
    const payerId =
      typeof updated.payer === "object" && updated.payer ? updated.payer.id : updated.payer;

    if (courseId && payerId) {
      const enrolment = await payload.find({
        collection: "enrollments",
        where: {
          and: [{ student: { equals: payerId } }, { course: { equals: courseId } }],
        },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      });
      if (enrolment.docs[0] && enrolment.docs[0].status === "pending_payment") {
        await payload.update({
          collection: "enrollments",
          id: enrolment.docs[0].id,
          overrideAccess: true,
          data: { status: "active" },
        });
      }
    }
  }

  try {
    await payload.sendEmail({
      to: updated.payerEmail,
      subject: `Receipt ${receiptNumber} — thank you`,
      html: paymentEmailHTML(updated, { confirmed: true }),
    });
  } catch (error) {
    console.error("[payments] could not email the receipt:", error);
  }

  return updated;
}
