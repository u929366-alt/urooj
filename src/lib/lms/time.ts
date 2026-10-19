/**
 * Dates for people, not for machines.
 *
 * Rendered on the server so every student sees the same string, which means
 * one fixed zone rather than the viewer's. Pakistan Standard Time, because
 * that is where the classes are held and where almost everyone watching them
 * is sitting.
 */
const ZONE = "Asia/Karachi";

export function formatWhen(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: ZONE,
    timeZoneName: "short",
  }).format(date);
}

export function formatDayOnly(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: ZONE,
  }).format(date);
}

/**
 * "in 2 hours", "in 3 days", or null once it has started.
 *
 * Rounded deliberately coarsely: this is rendered on the server and will be
 * stale the moment it reaches the browser, so a figure to the minute would be
 * a lie told precisely.
 */
export function startsIn(value: string | Date): string | null {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return null;
  const ms = date.getTime() - Date.now();
  if (ms <= 0) return null;

  const minutes = Math.round(ms / 60_000);
  if (minutes < 60) return `in ${minutes} minute${minutes === 1 ? "" : "s"}`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `in ${hours} hour${hours === 1 ? "" : "s"}`;
  const days = Math.round(hours / 24);
  return `in ${days} day${days === 1 ? "" : "s"}`;
}

/** Is the class on now, or close enough that the room should be open? */
export function isJoinable(
  startsAt: string | Date,
  durationMinutes: number | null | undefined,
): boolean {
  const start = typeof startsAt === "string" ? new Date(startsAt) : startsAt;
  if (Number.isNaN(start.getTime())) return false;
  // Open fifteen minutes early, so nobody is locked out by a slow clock, and
  // stay open to the end plus a little.
  const from = start.getTime() - 15 * 60_000;
  const until = start.getTime() + ((durationMinutes ?? 60) + 15) * 60_000;
  const now = Date.now();
  return now >= from && now <= until;
}
