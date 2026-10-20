import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, CheckCircle2, Clock, Sparkles, Users, Video } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { WorkshopRegistrationForm } from "@/components/learn/WorkshopRegistrationForm";
import { getWorkshopBySlug, registrationState } from "@/lib/lms/workshops";
import { bankInstructions } from "@/lib/lms/payments";
import { mediaPath } from "@/lib/lms/media";
import { siteConfig } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

const ZONE = "Asia/Karachi";

/** First letter of the actual name, skipping Ms/Mr/Dr and the like. */
function initialOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const word = parts.find((part) => !/^(ms|mr|mrs|miss|dr|prof|engr)\.?$/i.test(part)) ?? parts[0];
  return (word ?? "?").charAt(0).toUpperCase();
}

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

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const workshop = await getWorkshopBySlug(slug);
  if (!workshop) return { title: "Workshop not found" };
  return {
    title: workshop.title,
    description: workshop.summary ?? workshop.tagline ?? undefined,
    alternates: { canonical: `${siteConfig.portalUrl}/workshops/${workshop.slug}` },
    openGraph: {
      title: workshop.title,
      description: workshop.tagline ?? undefined,
      type: "website",
    },
  };
}

export default async function WorkshopPage({ params }: Params) {
  const { slug } = await params;
  const workshop = await getWorkshopBySlug(slug);
  if (!workshop) notFound();

  const state = registrationState(workshop);
  const photo = mediaPath(workshop.presenterPhoto) ?? workshop.presenterPhotoUrl ?? null;
  const outcomes = (workshop.outcomes ?? []).map((row) => row.text).filter(Boolean);
  const includes = (workshop.includes ?? []).map((row) => row.text).filter(Boolean);
  const audience = (workshop.audience ?? []).map((row) => row.text).filter(Boolean);
  const contactEmail = workshop.contactEmail ?? siteConfig.email;

  const money = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;

  return (
    <>
      <section className="bg-gradient-to-br from-primary-900 to-primary-700 py-14 text-white">
        <Container>
          <div className="max-w-3xl">
            {workshop.platform && (
              <Badge tone="secondary">
                <Video className="mr-1 inline h-3 w-3" aria-hidden />
                Live on {workshop.platform}
              </Badge>
            )}
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
              {workshop.title}
            </h1>
            {workshop.tagline && (
              <p className="mt-3 text-lg text-primary-100">{workshop.tagline}</p>
            )}

            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
              <div className="flex items-center gap-2.5">
                <CalendarDays className="h-5 w-5 shrink-0 text-secondary-400" aria-hidden />
                <div>
                  <dt className="sr-only">Date</dt>
                  <dd className="font-semibold">{formatDate(workshop.startsAt)}</dd>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-5 w-5 shrink-0 text-secondary-400" aria-hidden />
                <div>
                  <dt className="sr-only">Time</dt>
                  <dd className="font-semibold">
                    {formatTime(workshop.startsAt)}
                    {workshop.endsAt ? ` – ${formatTime(workshop.endsAt)}` : ""}
                    <span className="ml-1.5 font-normal text-primary-200">Pakistan time</span>
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </Container>
      </section>

      <Container className="py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            {workshop.summary && (
              <p className="text-lg leading-relaxed text-gray-700">{workshop.summary}</p>
            )}

            {workshop.presenterName && (
              <Card className="mt-8 p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Presented by
                </p>
                <div className="mt-3 flex items-start gap-4">
                  {photo ? (
                    <Image
                      src={photo}
                      alt={workshop.presenterName}
                      width={88}
                      height={88}
                      className="h-22 w-22 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-100 font-display text-2xl font-bold text-primary-700"
                    >
                      {initialOf(workshop.presenterName)}
                    </span>
                  )}
                  <div>
                    <h2 className="font-display text-xl font-semibold text-primary-900">
                      {workshop.presenterName}
                    </h2>
                    {workshop.presenterTitle && (
                      <p className="mt-0.5 text-secondary-600">{workshop.presenterTitle}</p>
                    )}
                    {workshop.presenterOrg && (
                      <p className="mt-0.5 text-sm text-gray-600">{workshop.presenterOrg}</p>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {outcomes.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-2xl font-bold text-primary-900">
                  What you will gain
                </h2>
                <ol className="mt-5 space-y-3">
                  {outcomes.map((text, index) => (
                    <li key={text} className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                        {index + 1}
                      </span>
                      <span className="pt-0.5 text-gray-700">{text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {audience.length > 0 && (
              <div className="mt-10">
                <h2 className="font-display text-2xl font-bold text-primary-900">
                  Who can attend
                </h2>
                <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
                  {audience.map((text) => (
                    <li key={text} className="flex items-start gap-2 text-gray-700">
                      <Users className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary-500" aria-hidden />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {includes.length > 0 && (
              <div className="mt-10 rounded-2xl bg-gray-50 p-6">
                <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-primary-900">
                  <Sparkles className="h-5 w-5 text-secondary-500" aria-hidden />
                  Your learning experience
                </h2>
                <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
                  {includes.map((text) => (
                    <li key={text} className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2
                        className="mt-0.5 h-4.5 w-4.5 shrink-0 text-accent-500"
                        aria-hidden
                      />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(workshop.contactName || workshop.contactEmail) && (
              <p className="mt-10 text-sm text-gray-600">
                For more information:{" "}
                {workshop.contactName ? `${workshop.contactName} · ` : ""}
                <a href={`mailto:${contactEmail}`} className="font-semibold text-primary-600">
                  {contactEmail}
                </a>
              </p>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <Card className="p-6">
              {state.open ? (
                <>
                  <h2 className="font-display text-xl font-bold text-primary-900">
                    Register for this workshop
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                    <p className="text-gray-700">
                      Professionals{" "}
                      <strong className="text-primary-900">
                        {money(workshop.priceProfessional ?? 0)}
                      </strong>
                    </p>
                    <p className="text-gray-700">
                      Students{" "}
                      <strong className="text-primary-900">
                        {money(workshop.priceStudent ?? 0)}
                      </strong>
                    </p>
                  </div>
                  {workshop.feeNote && (
                    <p className="mt-2 text-xs text-gray-500">{workshop.feeNote}</p>
                  )}
                  <div className="mt-6">
                    <WorkshopRegistrationForm
                      slug={workshop.slug ?? slug}
                      priceProfessional={workshop.priceProfessional ?? 0}
                      priceStudent={workshop.priceStudent ?? 0}
                      bank={bankInstructions()}
                      contactEmail={contactEmail}
                    />
                  </div>
                </>
              ) : (
                <div className="py-4 text-center">
                  <h2 className="font-display text-xl font-bold text-primary-900">
                    {state.reason === "full"
                      ? "This workshop is full"
                      : state.reason === "past"
                        ? "This workshop has taken place"
                        : "Registration has closed"}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    {state.reason === "full"
                      ? "Every place has been taken. Write to us and we will tell you when it runs again."
                      : "Write to us and we will let you know when the next one is scheduled."}
                  </p>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="mt-4 inline-block font-semibold text-primary-600 hover:underline"
                  >
                    {contactEmail}
                  </a>
                </div>
              )}
            </Card>
          </aside>
        </div>
      </Container>
    </>
  );
}
