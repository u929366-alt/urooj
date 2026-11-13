import "server-only";

import { cache } from "react";
import { getPayloadClient } from "./auth";
import type { Workshop, WorkshopCertificate, WorkshopRegistration } from "@/payload-types";

/**
 * Certificates for workshop attendees.
 *
 * A workshop is not a course: nobody enrols, nobody ticks off lessons, and
 * there is nothing to complete. What there is, is a register — who held a
 * paid place — and that is what a certificate here attests. It is therefore
 * issued by a person, in a batch, after the session, rather than falling out
 * of a progress calculation.
 *
 * One per seat. The seat is the key that makes the batch repeatable: run it
 * again next week for the three people you confirmed late and the ones
 * already holding a certificate are skipped, not duplicated.
 */

/** Same shape and alphabet as a course certificate's serial. */
function makeSerial(): string {
  // Ambiguous characters removed so a serial can be read off a printout.
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(8);
  globalThis.crypto.getRandomValues(bytes);
  let body = "";
  for (const byte of bytes) body += alphabet[byte % alphabet.length];
  return `HS-${new Date().getFullYear()}-${body}`;
}

/**
 * A serial has to mean one thing, so it is checked against both kinds before
 * being used. Collisions are vanishingly unlikely — 32^8 — but a duplicate
 * would make the verification page lie, which is the one thing it must not do.
 */
async function freeSerial(): Promise<string> {
  const payload = await getPayloadClient();
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const serial = makeSerial();
    const [workshops, courses] = await Promise.all([
      payload.find({
        collection: "workshop-certificates",
        where: { serial: { equals: serial } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      }),
      payload.find({
        collection: "certificates",
        where: { serial: { equals: serial } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      }),
    ]);
    if (workshops.totalDocs === 0 && courses.totalDocs === 0) return serial;
  }
  throw new Error("Could not allocate a certificate serial.");
}

/** Public lookup for the verification and certificate pages. */
export const getWorkshopCertificateBySerial = cache(
  async (serial: string): Promise<WorkshopCertificate | null> => {
    if (!serial.trim()) return null;
    const payload = await getPayloadClient();
    const found = await payload.find({
      collection: "workshop-certificates",
      where: { serial: { equals: serial.trim().toUpperCase() } },
      limit: 1,
      depth: 1,
      overrideAccess: true,
    });
    return found.docs[0] ?? null;
  },
);

/**
 * Everyone who should hold a certificate for this workshop: each named
 * attendee on a confirmed booking, and the person who paid.
 *
 * Mirrors how the joining link is addressed, with one difference — a place
 * with no name against it gets nothing, because a certificate needs somebody
 * to be made out to and "Guest of Muskaan Jawed" is not a certificate.
 */
export function holdersOf(
  registration: WorkshopRegistration,
): { name: string; email?: string; seat: string }[] {
  const out: { name: string; email?: string; seat: string }[] = [];
  const seen = new Set<string>();

  for (const attendee of registration.attendees ?? []) {
    const name = attendee.name?.trim();
    const seat = attendee.seat?.trim();
    if (!name || !seat) continue;
    if (seen.has(seat)) continue;
    seen.add(seat);
    out.push({
      name,
      email: attendee.email?.trim().toLowerCase() || registration.email.trim().toLowerCase(),
      seat,
    });
  }

  // A booking made before the attendee list existed has no rows at all. The
  // person who registered still attended, so they still get one, against the
  // booking's own reference.
  if (out.length === 0) {
    const seat = registration.paymentReference?.trim();
    if (seat) {
      out.push({
        name: registration.name,
        email: registration.email.trim().toLowerCase(),
        seat,
      });
    }
  }

  return out;
}

export type IssueResult = {
  issued: WorkshopCertificate[];
  skipped: number;
  unnamed: number;
};

/**
 * Issue a certificate to everyone on the register who has not got one.
 *
 * Nothing is emailed from here — the caller does that, so a mail failure
 * leaves the certificate standing rather than rolling it back. A certificate
 * that exists but has not been sent can be sent again; one that was never
 * issued because the mail server hiccuped is a person left out.
 */
export async function issueWorkshopCertificates(workshopId: string): Promise<IssueResult> {
  const payload = await getPayloadClient();

  const workshop = (await payload.findByID({
    collection: "workshops",
    id: workshopId,
    depth: 0,
    overrideAccess: true,
  })) as Workshop | null;
  if (!workshop) throw new Error("That workshop could not be found.");

  const confirmed = await payload.find({
    collection: "workshop-registrations",
    where: {
      and: [{ workshop: { equals: workshopId } }, { status: { equals: "confirmed" } }],
    },
    limit: 1000,
    depth: 0,
    overrideAccess: true,
  });

  const existing = await payload.find({
    collection: "workshop-certificates",
    where: { workshop: { equals: workshopId } },
    limit: 2000,
    depth: 0,
    overrideAccess: true,
  });
  const taken = new Set(
    existing.docs
      .map((row) => row.seat?.trim())
      .filter((seat): seat is string => Boolean(seat)),
  );

  const presenterLine = [workshop.presenterName, workshop.presenterTitle]
    .filter(Boolean)
    .join(", ");

  const issued: WorkshopCertificate[] = [];
  let skipped = 0;
  let unnamed = 0;

  for (const registration of confirmed.docs) {
    const holders = holdersOf(registration);

    // Places on a group booking that nobody ever put a name to.
    const places = registration.groupSize ?? 1;
    if (places > holders.length) unnamed += places - holders.length;

    for (const holder of holders) {
      if (taken.has(holder.seat)) {
        skipped += 1;
        continue;
      }
      const certificate = await payload.create({
        collection: "workshop-certificates",
        data: {
          serial: await freeSerial(),
          workshop: workshop.id,
          registration: registration.id,
          seat: holder.seat,
          holderName: holder.name,
          holderEmail: holder.email,
          workshopTitle: workshop.title,
          presenterLine: presenterLine || undefined,
          issuedAt: new Date().toISOString(),
        },
        overrideAccess: true,
      });
      taken.add(holder.seat);
      issued.push(certificate);
    }
  }

  return { issued, skipped, unnamed };
}

/** What the Workshops page shows before anybody presses anything. */
export async function certificateStandings(workshopId: string): Promise<{
  eligible: number;
  issued: number;
  unnamed: number;
  ended: boolean;
}> {
  const payload = await getPayloadClient();

  // Worked out here rather than in the page: reading the clock during render
  // is impure, and whether a workshop has finished is this module's business
  // anyway, since it is the condition for issuing at all.
  const workshop = await payload.findByID({
    collection: "workshops",
    id: workshopId,
    depth: 0,
    overrideAccess: true,
  });
  const ended = Boolean(
    workshop?.endsAt && new Date(workshop.endsAt).getTime() < Date.now(),
  );

  const confirmed = await payload.find({
    collection: "workshop-registrations",
    where: {
      and: [{ workshop: { equals: workshopId } }, { status: { equals: "confirmed" } }],
    },
    limit: 1000,
    depth: 0,
    overrideAccess: true,
  });

  const existing = await payload.find({
    collection: "workshop-certificates",
    where: { workshop: { equals: workshopId } },
    limit: 0,
    depth: 0,
    overrideAccess: true,
  });

  let eligible = 0;
  let unnamed = 0;
  for (const registration of confirmed.docs) {
    const holders = holdersOf(registration);
    eligible += holders.length;
    const places = registration.groupSize ?? 1;
    if (places > holders.length) unnamed += places - holders.length;
  }

  return { eligible, issued: existing.totalDocs, unnamed, ended };
}
