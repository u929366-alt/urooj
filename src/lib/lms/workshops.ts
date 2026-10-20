import "server-only";

import { cache } from "react";
import { getPayloadClient } from "./auth";
import type { Workshop, WorkshopRegistration } from "@/payload-types";

/** Workshops anyone may see: everything but drafts. */
export const listWorkshops = cache(async (): Promise<Workshop[]> => {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "workshops",
    where: { status: { not_equals: "draft" } },
    sort: "-startsAt",
    limit: 50,
    depth: 1,
    overrideAccess: true,
  });
  return result.docs;
});

export const getWorkshopBySlug = cache(async (slug: string): Promise<Workshop | null> => {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "workshops",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  });
  const workshop = result.docs[0];
  if (!workshop) return null;
  return workshop.status === "draft" ? null : workshop;
});

export const listRegistrations = cache(
  async (workshopId: number | string): Promise<WorkshopRegistration[]> => {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "workshop-registrations",
      where: { workshop: { equals: workshopId } },
      sort: "-createdAt",
      limit: 500,
      depth: 0,
      overrideAccess: true,
    });
    return result.docs;
  },
);

/**
 * Is registration actually open?
 *
 * Four things can close it: the status, the capacity, the start time having
 * passed, and nobody having set a price yet. Kept in one place so the page,
 * the form and the action all agree.
 */
export function registrationState(
  workshop: Workshop,
): { open: true } | { open: false; reason: "closed" | "full" | "past" } {
  if (workshop.status === "closed") return { open: false, reason: "closed" };
  if (workshop.status === "finished") return { open: false, reason: "past" };

  const start = new Date(workshop.startsAt);
  if (!Number.isNaN(start.getTime()) && start.getTime() < Date.now()) {
    return { open: false, reason: "past" };
  }
  if (workshop.capacity && (workshop.registrationCount ?? 0) >= workshop.capacity) {
    return { open: false, reason: "full" };
  }
  return { open: true };
}

/** What one place costs for this person. */
export function priceFor(workshop: Workshop, category: "professional" | "student"): number {
  return category === "student"
    ? (workshop.priceStudent ?? 0)
    : (workshop.priceProfessional ?? 0);
}
