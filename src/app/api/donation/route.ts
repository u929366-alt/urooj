import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isHoneypotTriggered, isRateLimited, jsonError } from "@/lib/api-helpers";
import { createPendingPayment, sendPaymentInstructions } from "@/lib/lms/payments";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  amount: z.coerce.number().positive("Please enter a donation amount greater than 0"),
  cause: z.string().min(2),
  message: z.string().max(2000).optional(),
});

/**
 * Records a donation and returns the reference the donor must quote.
 *
 * There is no payment gateway: the money arrives by bank transfer, and a staff
 * member confirms it against the statement. Nothing here claims the donation
 * has been collected — `status` stays "pending" until a human says otherwise.
 */
export async function POST(request: NextRequest) {
  if (isRateLimited(request)) {
    return jsonError("Too many submissions. Please try again in a minute.", 429);
  }

  const body = await request.json().catch(() => null);
  if (!body) return jsonError("Invalid request body.", 400);
  if (isHoneypotTriggered(body)) {
    // Silently accept, so a bot cannot tell it was caught.
    return NextResponse.json({ message: "Thank you for your generosity." });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid submission.", 422);
  }

  const { name, email, phone, amount, cause, message } = parsed.data;

  try {
    const payment = await createPendingPayment({
      purpose: "donation",
      amount,
      payerName: name,
      payerEmail: email,
      payerPhone: phone,
      cause,
      message,
    });

    await sendPaymentInstructions(payment);

    return NextResponse.json({
      message: "Thank you. Please complete your transfer using the reference below.",
      reference: payment.reference,
      redirectTo: `/learn/pay/${payment.reference}`,
    });
  } catch (error) {
    console.error("[donation] could not record the donation:", error);
    return jsonError(
      "We could not record your donation just now. Please try again, or email us.",
      500,
    );
  }
}
