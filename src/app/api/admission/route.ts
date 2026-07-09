import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isHoneypotTriggered, isRateLimited, jsonError } from "@/lib/api-helpers";

const schema = z.object({
  fullName: z.string().min(2),
  fatherName: z.string().min(2),
  cnic: z.string().min(5),
  dateOfBirth: z.string().min(2),
  gender: z.enum(["male", "female", "other"]),
  email: z.string().email(),
  phone: z.string().min(7),
  address: z.string().min(5),
  education: z.string().min(2),
  program: z.string().min(2),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  if (isRateLimited(request)) {
    return jsonError("Too many submissions. Please try again in a minute.", 429);
  }

  const body = await request.json().catch(() => null);
  if (!body) return jsonError("Invalid request body.", 400);
  if (isHoneypotTriggered(body)) {
    return NextResponse.json({ message: "Application received." });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid submission.", 422);
  }

  console.log("[admission] New application:", parsed.data);

  return NextResponse.json({
    message:
      "Your application has been received! Our admissions team will contact you within 3-5 business days.",
  });
}
