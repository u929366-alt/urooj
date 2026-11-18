import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, FileText, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { requireStaff } from "@/lib/lms/auth";
import { getPayloadClient } from "@/lib/lms/auth";
import { formatRupees } from "@/lib/lms/payments";
import { mediaPath } from "@/lib/lms/media";
import { ReviewActions } from "@/components/learn/ReviewActions";
import { JoiningLinkPanel } from "@/components/learn/JoiningLinkPanel";
import { CertificatePanel } from "@/components/learn/CertificatePanel";
import { FollowUpPanel } from "@/components/learn/FollowUpPanel";
import { certificateStandings, eligibleHolders } from "@/lib/lms/workshopCertificates";
import type { PaymentReceipt, Workshop, WorkshopRegistration } from "@/payload-types";

export const metadata: Metadata = {
  title: "Workshop registrations",
  robots: { index: false, follow: false },
};

const ZONE = "Asia/Karachi";

function when(value?: string | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: ZONE,
  }).format(new Date(value));
}

/**
 * Every address one booking's joining link goes to: each named attendee who
 * gave an email, plus the person who paid. Mirrors the send exactly, so the
 * count on the button is not a guess.
 */
function recipientsOf(registration: WorkshopRegistration): string[] {
  const out = new Set<string>();
  for (const attendee of registration.attendees ?? []) {
    const email = attendee.email?.trim().toLowerCase();
    if (email) out.add(email);
  }
  out.add(registration.email.trim().toLowerCase());
  return [...out];
}

export default async function WorkshopReviewPage({
  searchParams,
}: {
  searchParams: Promise<{
    approved?: string;
    declined?: string;
    error?: string;
    joining?: string;
    failed?: string;
    certificates?: string;
    emailed?: string;
    already?: string;
    followup?: string;
  }>;
}) {
  await requireStaff("/learn/workshops");
  const { approved, declined, error, joining, failed, certificates, emailed, already, followup } =
    await searchParams;

  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "workshop-registrations",
    sort: "-createdAt",
    limit: 200,
    depth: 2,
    overrideAccess: true,
  });

  const rows = result.docs;
  const waiting = rows.filter((row) => row.status === "pending");
  const settled = rows.filter((row) => row.status !== "pending");

  /**
   * Who still needs the joining link, by workshop.
   *
   * Counted in people rather than bookings, because that is what gets sent:
   * every named attendee with an email of their own is written to directly,
   * and the booker always gets one. Deduplicated the same way the send is,
   * so the number on the button is the number of emails.
   */
  const joiningByWorkshop = new Map<
    string,
    { workshop: Workshop; waiting: number; recipients: Set<string>; alreadySent: number }
  >();

  for (const row of rows) {
    if (row.status !== "confirmed") continue;
    const workshop = typeof row.workshop === "object" ? (row.workshop as Workshop) : null;
    if (!workshop) continue;

    const key = String(workshop.id);
    const entry = joiningByWorkshop.get(key) ?? {
      workshop,
      waiting: 0,
      recipients: new Set<string>(),
      alreadySent: 0,
    };

    if (row.joiningSentAt) {
      entry.alreadySent += 1;
    } else {
      entry.waiting += 1;
      for (const email of recipientsOf(row)) entry.recipients.add(email);
    }
    joiningByWorkshop.set(key, entry);
  }

  /**
   * Everyone on the register, for the follow-up. Different from the joining
   * count above, which is only those who have not had their link yet: a
   * follow-up goes to the whole room.
   */
  const followUpRecipients = new Map<string, Set<string>>();
  for (const row of rows) {
    if (row.status !== "confirmed") continue;
    const workshop = typeof row.workshop === "object" ? (row.workshop as Workshop) : null;
    if (!workshop) continue;
    const key = String(workshop.id);
    const set = followUpRecipients.get(key) ?? new Set<string>();
    for (const email of recipientsOf(row)) set.add(email);
    followUpRecipients.set(key, set);
  }

  // How many certificates each workshop owes, worked out the same way the
  // issuing does so the number on the button is the number issued.
  const standings = new Map<
    string,
    { eligible: number; issued: number; unnamed: number; ended: boolean }
  >();
  const holders = new Map<string, Awaited<ReturnType<typeof eligibleHolders>>>();
  for (const key of joiningByWorkshop.keys()) {
    standings.set(key, await certificateStandings(key));
    holders.set(key, await eligibleHolders(key));
  }

  return (
    <Container className="py-12">
      <h1 className="font-display text-3xl font-bold text-primary-900">
        Workshop registrations
      </h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        Check each receipt against the bank, then approve it. Approving is what sends the
        registrant their confirmation letter — nothing else does. The joining link goes out
        separately, from the panel below, once there is one to give.
      </p>

      {approved && (
        <p className="mt-4 rounded-xl bg-accent-50 px-4 py-3 text-sm text-accent-800">
          Approved. Their confirmation email has gone out.
        </p>
      )}
      {declined && (
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Marked as not confirmed, and we have written to them.
        </p>
      )}
      {error === "email" && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          The place was approved but the email would not send. Write to them by hand, and check
          the mail settings.
        </p>
      )}
      {error === "nolink" && (
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Nothing was sent: that workshop has no joining link yet. Put it in the admin first.
        </p>
      )}
      {joining && (
        <p className="mt-4 rounded-xl bg-accent-50 px-4 py-3 text-sm text-accent-800">
          Joining link sent to {joining} {joining === "1" ? "person" : "people"}.
          {failed && (
            <>
              {" "}
              <strong className="text-red-700">
                {failed} could not be delivered — check the log and write to those by hand.
              </strong>
            </>
          )}
        </p>
      )}

      {certificates && (
        <p className="mt-4 rounded-xl bg-accent-50 px-4 py-3 text-sm text-accent-800">
          {certificates} {certificates === "1" ? "certificate" : "certificates"} issued
          {emailed && <>, {emailed} emailed</>}
          {already && <> ({already} already had one)</>}.
          {failed && (
            <>
              {" "}
              <strong className="text-red-700">
                {failed} email(s) could not be delivered — the certificates exist, send those
                by hand.
              </strong>
            </>
          )}
        </p>
      )}
      {followup && (
        <p className="mt-4 rounded-xl bg-accent-50 px-4 py-3 text-sm text-accent-800">
          Sent to {followup} {followup === "1" ? "person" : "people"}.
          {failed && (
            <>
              {" "}
              <strong className="text-red-700">{failed} could not be delivered.</strong>
            </>
          )}
        </p>
      )}
      {error === "followupempty" && (
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Nothing was sent: the email needs a subject and a message.
        </p>
      )}
      {error === "followupurl" && (
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Nothing was sent: a link must start with http:// or https://.
        </p>
      )}
      {error === "nobody" && (
        <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Nothing was issued: nobody was ticked.
        </p>
      )}
      {error === "certificates" && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          The certificates could not be issued. Nothing was sent — check the log.
        </p>
      )}

      {[...joiningByWorkshop.values()].map((entry) => (
        <JoiningLinkPanel
          key={entry.workshop.id}
          workshopId={String(entry.workshop.id)}
          title={entry.workshop.title}
          hasLink={Boolean(entry.workshop.joinUrl?.trim())}
          platform={entry.workshop.platform ?? "the session"}
          waiting={entry.waiting}
          people={entry.recipients.size}
          alreadySent={entry.alreadySent}
        />
      ))}

      {[...joiningByWorkshop.entries()].map(([key, entry]) => (
        <FollowUpPanel
          key={`follow-${entry.workshop.id}`}
          workshopId={String(entry.workshop.id)}
          workshopSlug={entry.workshop.slug ?? ""}
          title={entry.workshop.title}
          people={followUpRecipients.get(key)?.size ?? 0}
        />
      ))}

      {[...joiningByWorkshop.entries()].map(([key, entry]) => {
        const standing = standings.get(key);
        if (!standing) return null;
        return (
          <CertificatePanel
            key={`cert-${entry.workshop.id}`}
            workshopId={String(entry.workshop.id)}
            title={entry.workshop.title}
            people={holders.get(key) ?? []}
            unnamed={standing.unnamed}
            ended={standing.ended}
          />
        );
      })}

      <section className="mt-10">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-primary-900">
          <Clock className="h-5 w-5 text-secondary-500" aria-hidden />
          Waiting for you
          {waiting.length > 0 && (
            <span className="rounded-full bg-secondary-500 px-2.5 py-0.5 text-sm font-bold text-white">
              {waiting.length}
            </span>
          )}
        </h2>

        {waiting.length === 0 ? (
          <Card className="mt-4 p-8 text-center text-gray-600">
            <CheckCircle2 className="mx-auto h-8 w-8 text-accent-500" aria-hidden />
            <p className="mt-3">Nothing waiting. Every registration has been dealt with.</p>
          </Card>
        ) : (
          <div className="mt-4 space-y-6">
            {waiting.map((row) => {
              const workshop =
                typeof row.workshop === "object" ? (row.workshop as Workshop) : null;
              const receipt =
                typeof row.receipt === "object" ? (row.receipt as PaymentReceipt | null) : null;
              const file = mediaPath(receipt);
              const isPdf = receipt?.mimeType === "application/pdf";

              return (
                <Card key={row.id} className="overflow-hidden">
                  <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="secondary">Awaiting verification</Badge>
                        {workshop && <Badge tone="primary">{workshop.title}</Badge>}
                        <Badge tone="neutral" className="capitalize">
                          {row.category}
                        </Badge>
                      </div>

                      <h3 className="mt-3 font-display text-xl font-semibold text-primary-900">
                        {row.name}
                      </h3>

                      <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-1.5 text-sm sm:grid-cols-2">
                        <div className="flex gap-2">
                          <dt className="w-24 shrink-0 text-gray-500">Email</dt>
                          <dd className="min-w-0 break-words text-gray-800">{row.email}</dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="w-24 shrink-0 text-gray-500">Phone</dt>
                          <dd className="text-gray-800">{row.phone ?? "—"}</dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="w-24 shrink-0 text-gray-500">Organisation</dt>
                          <dd className="text-gray-800">{row.organisation ?? "—"}</dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="w-24 shrink-0 text-gray-500">City</dt>
                          <dd className="text-gray-800">{row.city ?? "—"}</dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="w-24 shrink-0 text-gray-500">Places</dt>
                          <dd className="flex items-center gap-1.5 text-gray-800">
                            <Users className="h-3.5 w-3.5 text-gray-400" aria-hidden />
                            {row.groupSize ?? 1}
                          </dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="w-24 shrink-0 text-gray-500">Registered</dt>
                          <dd className="text-gray-800">{when(row.createdAt)}</dd>
                        </div>
                      </dl>

                      {/* Who is coming. For a booking of one this is the
                          registrant; for a group it is the whole party, and a
                          place with no name against it gets no joining link
                          and no certificate, so it is worth seeing. */}
                      {(row.attendees?.length ?? 0) > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Attending
                          </p>
                          <ul className="mt-1.5 space-y-1 text-sm">
                            {row.attendees?.map((person) => (
                              <li key={person.id ?? person.seat} className="flex flex-wrap gap-x-3">
                                <span className="font-mono text-xs text-gray-400">
                                  {person.seat ?? "—"}
                                </span>
                                <span className="font-medium text-gray-800">{person.name}</span>
                                <span className="text-gray-500">{person.email ?? row.email}</span>
                              </li>
                            ))}
                          </ul>
                          {(row.groupSize ?? 1) > (row.attendees?.length ?? 0) && (
                            <p className="mt-1.5 text-sm text-amber-700">
                              {(row.groupSize ?? 1) - (row.attendees?.length ?? 0)} place(s) still
                              without a name — ask before the session, or they get no certificate.
                            </p>
                          )}
                        </div>
                      )}

                      {row.notes && (
                        <p className="mt-3 rounded-xl bg-gray-50 px-4 py-2.5 text-sm text-gray-700">
                          {row.notes}
                        </p>
                      )}

                      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl bg-primary-50 px-4 py-3">
                        <div>
                          <p className="text-xs text-gray-500">Amount to match</p>
                          <p className="font-display text-xl font-bold text-primary-900">
                            {formatRupees(row.amountDue ?? 0)}
                          </p>
                        </div>
                        {row.paymentReference && (
                          <div>
                            <p className="text-xs text-gray-500">Our reference</p>
                            <p className="font-mono font-semibold text-primary-900">
                              {row.paymentReference}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="mt-5">
                        <ReviewActions id={String(row.id)} name={row.name} />
                      </div>
                    </div>

                    {/* The receipt, big enough to actually read. */}
                    <div>
                      <p className="text-sm font-semibold text-primary-900">Their receipt</p>
                      {!file ? (
                        <p className="mt-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                          No receipt attached. Ask them to send one before approving.
                        </p>
                      ) : isPdf ? (
                        <a
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-6 text-sm font-semibold text-primary-600 hover:bg-gray-50"
                        >
                          <FileText className="h-5 w-5" aria-hidden />
                          Open the PDF receipt
                        </a>
                      ) : (
                        <a href={file} target="_blank" rel="noopener noreferrer" className="mt-2 block">
                          {/* Plain img, not next/image: these are served by
                              Payload's own route so the optimiser cannot read
                              them off disk, and they must stay access-controlled. */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={file}
                            alt={`Payment receipt from ${row.name}`}
                            className="w-full rounded-xl border border-gray-200 object-contain"
                          />
                          <span className="mt-1.5 block text-xs text-gray-500">
                            Click to open full size
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {settled.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold text-primary-900">Already dealt with</h2>
          <Card className="mt-4 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Name</th>
                    <th className="px-6 py-3 font-semibold">Email</th>
                    <th className="px-6 py-3 font-semibold">Amount</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold">Checked</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {settled.map((row) => (
                    <tr key={row.id}>
                      <td className="px-6 py-3 font-medium text-gray-800">{row.name}</td>
                      <td className="px-6 py-3 text-gray-600">{row.email}</td>
                      <td className="px-6 py-3 text-gray-600">
                        {formatRupees(row.amountDue ?? 0)}
                      </td>
                      <td className="px-6 py-3">
                        {row.status === "confirmed" ? (
                          <span className="font-semibold text-accent-700">Confirmed</span>
                        ) : (
                          <span className="text-gray-500">Not confirmed</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-gray-600">{when(row.verifiedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>
      )}

      <p className="mt-10 text-sm text-gray-500">
        Money arrives in{" "}
        <Link href="/learn/finance" className="font-semibold text-primary-600 hover:underline">
          Payments
        </Link>
        . Approving here marks the payment received there too.
      </p>
    </Container>
  );
}
