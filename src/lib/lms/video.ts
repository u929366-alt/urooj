import "server-only";

import { createHmac } from "node:crypto";
import type { LiveSession, User } from "@/payload-types";

/**
 * Talking to the Hunarsaaz video server.
 *
 * The video runs on a Jitsi machine of its own — `JITSI_DOMAIN`, e.g.
 * meet.hunarsaaz.pk. The portal never carries media; it decides who is allowed
 * into which room, and hands the browser a room name and, where the server
 * asks for one, a token.
 *
 * The token is a plain HS256 JWT signed here with Node's own crypto. No
 * library: the portal is deployed by unzipping it onto shared hosting where
 * nobody can run an install, so a dependency that is not already in the bundle
 * is a dependency that will not be there.
 */

export const jitsiDomain = process.env.JITSI_DOMAIN?.trim() || "";

const appId = process.env.JITSI_APP_ID?.trim() || "";
const appSecret = process.env.JITSI_APP_SECRET || "";

/** Is a video server configured at all? Without one, lectures cannot be held. */
export function isVideoConfigured(): boolean {
  return jitsiDomain.length > 0;
}

/**
 * Does the server demand a token?
 *
 * A Jitsi install with authentication switched off lets anyone with the room
 * name in. That is fine for a server nobody knows about and wrong for one on
 * a public domain, so the install guide turns authentication on and sets these
 * two values.
 */
export function isTokenRequired(): boolean {
  return appId.length > 0 && appSecret.length > 0;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export type JitsiIdentity = {
  name: string;
  email?: string | null;
  moderator: boolean;
};

/**
 * A token admitting one person to one room for one class.
 *
 * Scoped to the room, so it cannot be reused to walk into another lecture, and
 * expired shortly after the class ends, so a copied link is worthless the next
 * day. `moderator` is what lets the instructor mute people, admit from the
 * lobby and stop the class; students never get it.
 */
export function createJitsiToken(
  roomName: string,
  identity: JitsiIdentity,
  expiresAt: Date,
): string | null {
  if (!isTokenRequired()) return null;

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    aud: appId,
    iss: appId,
    sub: jitsiDomain,
    room: roomName,
    // A minute of slack before the start, so a clock a little out of step on
    // either machine does not lock the instructor out of their own class.
    nbf: now - 60,
    exp: Math.max(Math.floor(expiresAt.getTime() / 1000), now + 300),
    context: {
      user: {
        name: identity.name,
        email: identity.email ?? undefined,
        moderator: identity.moderator,
      },
      features: {
        // Only a moderator may record or stream the class, and only from the
        // instructor's side. A student cannot start a recording of the room.
        recording: identity.moderator,
        livestreaming: identity.moderator,
        "outbound-call": false,
        transcription: false,
      },
    },
  };

  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
  const signature = base64url(createHmac("sha256", appSecret).update(signingInput).digest());
  return `${signingInput}.${signature}`;
}

/** When a lecture's token should stop working: the end of class, plus slack. */
export function tokenExpiryFor(session: Pick<LiveSession, "startsAt" | "durationMinutes">): Date {
  const start = new Date(session.startsAt);
  const minutes = (session.durationMinutes ?? 60) + 30;
  return new Date(start.getTime() + minutes * 60_000);
}

/** How the person appears in the call, taken from their portal account. */
export function identityFor(user: User, moderator: boolean): JitsiIdentity {
  return { name: user.name, email: user.email, moderator };
}
