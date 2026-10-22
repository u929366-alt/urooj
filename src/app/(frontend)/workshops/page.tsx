import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, Clock, Users, Video } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { listWorkshops, registrationState, splitWorkshops } from "@/lib/lms/workshops";
import { mediaPath } from "@/lib/lms/media";
import { siteConfig } from "@/lib/site";
import type { Workshop } from "@/payload-types";

/**
 * Everything on offer, in one page.
 *
 * This is what the Workshops tab on the main site points at. It has to live
 * on the portal rather than being built into the static site, because the
 * static site is exported once and uploaded: a workshop added or closed in
 * the admin would not reach it until somebody rebuilt and re-uploaded the
 * whole thing. Here it is simply true whenever anyone looks.
 */

// Rendered on every request. Nothing here reads cookies or headers, so Next
// would otherwise prerender it once at build time — and a page that exists
// precisely so the list is never stale is the last page that should be.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Workshops",
  description:
    "Live, practical workshops from Hunarsaaz — open to professionals, students and anyone who wants to learn.",
  alternates: { canonical: `${siteConfig.portalUrl}/workshops` },
};

const ZONE = "Asia/Karachi";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: ZONE,
  }).format(new Date(value));
}

function formatTime(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: ZONE,
  }).format(new Date(value));
}

function initialOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const word = parts.find((part) => !/^(ms|mr|mrs|miss|dr|prof|engr)\.?$/i.test(part)) ?? parts[0];
  return (word ?? "?").charAt(0).toUpperCase();
}

function WorkshopCard({ workshop, past }: { workshop: Workshop; past: boolean }) {
  const state = registrationState(workshop);
  const photo = mediaPath(workshop.presenterPhoto) ?? workshop.presenterPhotoUrl ?? null;
  const audience = (workshop.audience ?? []).map((row) => row.text).filter(Boolean);

  return (
    <Card className={`overflow-hidden ${past ? "opacity-75" : ""}`}>
      <div className="p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          {past ? (
            <Badge tone="neutral">Finished</Badge>
          ) : state.open ? (
            <Badge tone="accent">Registration open</Badge>
          ) : (
            <Badge tone="neutral">
              {state.reason === "full" ? "Full" : "Registration closed"}
            </Badge>
          )}
          {workshop.platform && (
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
              <Video className="h-4 w-4 text-primary-500" aria-hidden />
              {workshop.platform}
            </span>
          )}
        </div>

        <h2 className="mt-3 font-display text-2xl font-bold text-primary-900">
          <Link href={`/workshops/${workshop.slug}`} className="hover:text-primary-700">
            {workshop.title}
          </Link>
        </h2>
        {workshop.tagline && <p className="mt-1 text-gray-700">{workshop.tagline}</p>}

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-700">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-secondary-500" aria-hidden />
            {formatDate(workshop.startsAt)}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4 text-secondary-500" aria-hidden />
            {formatTime(workshop.startsAt)}
            {workshop.endsAt ? ` – ${formatTime(workshop.endsAt)}` : ""} PKT
          </span>
        </div>

        {workshop.summary && (
          <p className="mt-4 line-clamp-3 text-gray-700">{workshop.summary}</p>
        )}

        {workshop.presenterName && (
          <div className="mt-5 flex items-center gap-3">
            {photo ? (
              <Image
                src={photo}
                alt={workshop.presenterName}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 font-display text-lg font-bold text-primary-700">
                {initialOf(workshop.presenterName)}
              </span>
            )}
            <div className="text-sm">
              <p className="font-semibold text-primary-900">{workshop.presenterName}</p>
              {workshop.presenterTitle && (
                <p className="text-gray-600">{workshop.presenterTitle}</p>
              )}
            </div>
          </div>
        )}

        {audience.length > 0 && !past && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Users className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
            {audience.map((item) => (
              <span
                key={item}
                className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-800"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6">
          <Link
            href={`/workshops/${workshop.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-secondary-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-secondary-600"
          >
            {past ? "See what it covered" : state.open ? "Register" : "Details"}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </Card>
  );
}

export default async function WorkshopsPage() {
  const { upcoming, past } = splitWorkshops(await listWorkshops());

  return (
    <>
      <section className="bg-primary-900 py-14 text-white sm:py-20">
        <Container>
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Workshops</h1>
          <p className="mt-4 max-w-2xl text-lg text-primary-100">
            Short, live and practical. Run by people who do the work, open to professionals,
            students and anyone who wants to learn — with a certificate, a handout and time for
            your own questions.
          </p>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        {upcoming.length === 0 ? (
          <Card className="p-10 text-center">
            <CalendarDays className="mx-auto h-9 w-9 text-primary-400" aria-hidden />
            <h2 className="mt-4 font-display text-xl font-semibold text-primary-900">
              Nothing scheduled just now
            </h2>
            <p className="mx-auto mt-2 max-w-md text-gray-600">
              New workshops are announced here first. In the meantime, our courses run all year
              and you can start one today.
            </p>
            <Link
              href="/learn/courses"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-secondary-500 px-6 py-3 font-semibold text-white hover:bg-secondary-600"
            >
              Browse the courses
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Card>
        ) : (
          // One workshop in a two-column grid is a card with a hole beside
          // it. Alone, it gets the middle of the page.
          <div
            className={
              upcoming.length === 1
                ? "mx-auto max-w-3xl"
                : "grid grid-cols-1 gap-8 lg:grid-cols-2"
            }
          >
            {upcoming.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} past={false} />
            ))}
          </div>
        )}

        {past.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold text-primary-900">Previously</h2>
            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
              {past.map((workshop) => (
                <WorkshopCard key={workshop.id} workshop={workshop} past />
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
