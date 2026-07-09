import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isHoneypotTriggered, isRateLimited, jsonError } from "@/lib/api-helpers";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  city: z.string().min(2),
  interest: z.string().min(2),
  availability: z.string().min(2),
  motivation: z.string().min(10),
});

export async function POST(request: NextRequest) {
  if (isRateLimited(request)) {
    return jsonError("Too many submissions. Please try again in a minute.", 429);
  }

  const body = await request.json().catch(() => null);
  if (!body) return jsonError("Invalid request body.", 400);
  if (isHoneypotTriggered(body)) {
    return NextResponse.json({ message: "Thank you for applying to volunteer." });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid submission.", 422);
  }

  console.log("[volunteer] New application:", parsed.data);

  return NextResponse.json({
    message: "Thank you for applying to volunteer! Our team will reach out within a week.",
  });
}
