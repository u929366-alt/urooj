import { NextResponse } from "next/server";
import { getCurrentUser, isStaff, getPayloadClient } from "@/lib/lms/auth";
import type { Workshop } from "@/payload-types";

export const dynamic = "force-dynamic";

/**
 * The register, as a spreadsheet.
 *
 * One row per person, not per booking, because that is what anyone wants it
 * for: a mail merge, a feedback form, an attendance sheet. The booking
 * details ride along on each row so a group stays identifiable.
 *
 * Staff only, and never cached — it is a list of members of the public with
 * their email addresses and phone numbers on it.
 */

function cell(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  // Excel reads a leading =, +, - or @ as a formula. Prefix with a quote so a
  // name like "-Ali" cannot become one.
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

const ZONE = "Asia/Karachi";

function when(value?: string | null): string {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: ZONE,
  }).format(new Date(value));
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!isStaff(user)) {
    return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  }

  const url = new URL(request.url);
  const workshopSlug = url.searchParams.get("workshop");
  const onlyConfirmed = url.searchParams.get("all") !== "1";

  const payload = await getPayloadClient();

  const registrations = await payload.find({
    collection: "workshop-registrations",
    where: onlyConfirmed ? { status: { equals: "confirmed" } } : {},
    sort: "createdAt",
    limit: 2000,
    depth: 1,
    overrideAccess: true,
  });

  const header = [
    "Name",
    "Email",
    "Seat",
    "Workshop",
    "Category",
    "Organisation",
    "City",
    "Phone",
    "Status",
    "Booking reference",
    "Booked by",
    "Booked by email",
    "Places in booking",
    "Amount due",
    "Registered",
    "Joining link sent",
  ];

  const rows: string[] = [header.map(cell).join(",")];
  let people = 0;

  for (const registration of registrations.docs) {
    const workshop =
      typeof registration.workshop === "object" ? (registration.workshop as Workshop) : null;
    if (workshopSlug && workshop?.slug !== workshopSlug) continue;

    /**
     * Each named attendee is a row. A booking with no attendee rows — made
     * before the group form existed — still produces one row for the person
     * who registered, so nobody is missing from the register.
     */
    const people_ = (registration.attendees ?? []).filter((row) => row.name?.trim());
    const list = people_.length
      ? people_.map((row) => ({
          name: row.name,
          email: row.email?.trim() || registration.email,
          seat: row.seat ?? "",
        }))
      : [
          {
            name: registration.name,
            email: registration.email,
            seat: registration.paymentReference ?? "",
          },
        ];

    for (const person of list) {
      people += 1;
      rows.push(
        [
          person.name,
          person.email,
          person.seat,
          workshop?.title ?? "",
          registration.category,
          registration.organisation ?? "",
          registration.city ?? "",
          registration.phone ?? "",
          registration.status,
          registration.paymentReference ?? "",
          registration.name,
          registration.email,
          registration.groupSize ?? 1,
          registration.amountDue ?? "",
          when(registration.createdAt),
          when(registration.joiningSentAt),
        ]
          .map(cell)
          .join(","),
      );
    }
  }

  const stamp = new Date().toISOString().slice(0, 10);
  const name = `attendees-${workshopSlug ?? "all"}-${stamp}.csv`;

  // A BOM, so Excel opens it as UTF-8 and Pakistani names keep their letters.
  return new NextResponse(`﻿${rows.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "no-store",
      "X-Attendee-Count": String(people),
    },
  });
}
