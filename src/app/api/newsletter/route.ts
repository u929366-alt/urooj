import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isHoneypotTriggered, isRateLimited, jsonError } from "@/lib/api-helpers";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  if (isRateLimited(request)) {
    return jsonError("Too many submissions. Please try again in a minute.", 429);
  }

  const body = await request.json().catch(() => null);
  if (!body) return jsonError("Invalid request body.", 400);
  if (isHoneypotTriggered(body)) {
    return NextResponse.json({ message: "Subscribed!" });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid email address.", 422);
  }

  console.log("[newsletter] New subscriber:", parsed.data.email);

  return NextResponse.json({ message: "You're subscribed! Watch your inbox for updates." });
}
