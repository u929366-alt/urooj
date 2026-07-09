import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isHoneypotTriggered, isRateLimited, jsonError } from "@/lib/api-helpers";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

export async function POST(request: NextRequest) {
  if (isRateLimited(request)) {
    return jsonError("Too many submissions. Please try again in a minute.", 429);
  }

  const body = await request.json().catch(() => null);
  if (!body) return jsonError("Invalid request body.", 400);
  if (isHoneypotTriggered(body)) {
    return NextResponse.json({ message: "Thank you for reaching out." });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid submission.", 422);
  }

  // NOTE: This is a stub handler for the website build. In production, wire
  // this to an email service (e.g. Resend, SendGrid) and/or persist to a
  // database — see README "Backend & CMS scope" for details.
  console.log("[contact] New inquiry:", parsed.data);

  return NextResponse.json({
    message: "Thank you for reaching out! Our team will respond within 1-2 business days.",
  });
}
