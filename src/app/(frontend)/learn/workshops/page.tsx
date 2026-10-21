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
import type { PaymentReceipt, Workshop } from "@/payload-types";

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

export default async function WorkshopReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ approved?: string; declined?: string; error?: string }>;
}) {
  await requireStaff("/learn/workshops");
  const { approved, declined, error } = await searchParams;

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

  return (
    <Container className="py-12">
      <h1 className="font-display text-3xl font-bold text-primary-900">
        Workshop registrations
      </h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        Check each receipt against the bank, then approve it. Approving is what sends the
        registrant their confirmation and the joining link — nothing else does.
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
