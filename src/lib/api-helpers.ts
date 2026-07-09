import { NextRequest, NextResponse } from "next/server";
import { HONEYPOT_FIELD } from "@/components/forms/Honeypot";

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

// Best-effort in-memory rate limit. Resets on redeploy/restart and is not
// shared across serverless instances — swap for a durable store (Redis,
// Upstash, etc.) before relying on this in production.
const requestLog = new Map<string, number[]>();

export function isRateLimited(request: NextRequest): boolean {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > MAX_REQUESTS_PER_WINDOW;
}

export function isHoneypotTriggered(body: Record<string, unknown>): boolean {
  const value = body[HONEYPOT_FIELD];
  return typeof value === "string" && value.trim().length > 0;
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}
