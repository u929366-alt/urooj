import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isHoneypotTriggered, isRateLimited, jsonError } from "@/lib/api-helpers";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  amount: z.coerce.number().positive("Please enter a donation amount greater than 0"),
  cause: z.string().min(2),
  method: z.enum(["bank", "easypaisa", "jazzcash", "card"]),
});

export async function POST(request: NextRequest) {
  if (isRateLimited(request)) {
    return jsonError("Too many submissions. Please try again in a minute.", 429);
  }

  const body = await request.json().catch(() => null);
  if (!body) return jsonError("Invalid request body.", 400);
  if (isHoneypotTriggered(body)) {
    return NextResponse.json({ message: "Thank you for your generosity." });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid submission.", 422);
  }

  // NOTE: This stub does not process real payments. A production build
  // must integrate a licensed payment gateway (e.g. EasyPaisa/JazzCash
  // merchant APIs, Stripe for cards) — see README "Backend & CMS scope".
  console.log("[donation] Pledge received:", parsed.data);

  return NextResponse.json({
    message:
      "Thank you for your pledge! Our development team will contact you with payment instructions.",
  });
}
