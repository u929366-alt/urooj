import type { Metadata } from "next";
import { Banknote, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { requireStaff } from "@/lib/lms/auth";
import { formatRupees, listPayments } from "@/lib/lms/payments";
import { cancelPaymentAction, confirmPaymentAction } from "@/lib/lms/paymentActions";
import type { Course } from "@/payload-types";

export const metadata: Metadata = {
  title: "Payments",
  robots: { index: false, follow: false },
};

function when(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<{ confirmed?: string; cancelled?: string }>;
}) {
  await requireStaff("/learn/finance");
  const { confirmed, cancelled } = await searchParams;

  const [pending, done] = await Promise.all([
    listPayments("pending"),
    listPayments("confirmed"),
  ]);

  const total = done.reduce((sum, payment) => sum + (payment.amount ?? 0), 0);

  return (
    <Container className="py-12">
      <h1 className="font-display text-3xl font-bold text-primary-900">Payments</h1>
      <p className="mt-2 text-gray-600">
        Donations and course fees. Confirm a payment once it appears on the bank
        statement — that is what issues the receipt and opens a paid course.
      </p>

      {confirmed && (
        <p role="status" className="mt-6 rounded-xl bg-accent-50 px-4 py-3 text-sm text-accent-800">
          Payment confirmed and a receipt emailed.
        </p>
      )}
      {cancelled && (
        <p role="status" className="mt-6 rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-700">
          Payment cancelled.
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-gray-500">Awaiting transfer</p>
          <p className="mt-1 font-display text-3xl font-bold text-primary-900">{pending.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500">Confirmed</p>
          <p className="mt-1 font-display text-3xl font-bold text-accent-600">{done.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500">Total received</p>
          <p className="mt-1 font-display text-3xl font-bold text-primary-900">
            {formatRupees(total)}
          </p>
        </Card>
      </div>

      <h2 className="mt-12 font-display text-xl font-semibold text-primary-900">
        Awaiting transfer ({pending.length})
      </h2>

      {pending.length === 0 ? (
        <Card className="mt-4 p-8 text-center text-gray-600">
          <Banknote className="mx-auto h-9 w-9 text-primary-300" aria-hidden />
          <p className="mt-3">Nothing outstanding.</p>
        </Card>
      ) : (
        <div className="mt-4 space-y-4">
          {pending.map((payment) => {
            const course =
              typeof payment.course === "object" && payment.course
                ? (payment.course as Course)
                : null;
            return (
              <Card key={payment.id} className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-lg font-bold text-secondary-700">
                      {payment.reference}
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      {payment.payerName} · {payment.payerEmail}
                      {payment.payerPhone ? ` · ${payment.payerPhone}` : ""}
                    </p>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {payment.purpose === "course"
                        ? `Course fee — ${course?.title ?? "course"}`
                        : `Donation — ${payment.cause ?? "general"}`}{" "}
                      · raised {when(payment.createdAt)}
                    </p>
                    {payment.message && (
                      <p className="mt-2 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-700">
                        {payment.message}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-bold text-primary-900">
                      {formatRupees(payment.amount)}
                    </p>
                    <Badge tone="neutral">{payment.purpose}</Badge>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-end gap-3 border-t border-gray-100 pt-5">
                  <form action={confirmPaymentAction} className="flex flex-1 flex-wrap items-end gap-3">
                    <input type="hidden" name="reference" value={payment.reference} />
                    <div className="min-w-[200px] flex-1">
                      <label
                        htmlFor={`bank-${payment.id}`}
                        className="block text-sm font-semibold text-gray-800"
                      >
                        Bank transaction ID (optional)
                      </label>
                      <input
                        id={`bank-${payment.id}`}
                        name="bankReference"
                        className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 font-semibold text-white hover:bg-accent-600"
                    >
                      <CheckCircle2 className="h-4 w-4" aria-hidden />
                      Mark received
                    </button>
                  </form>
                  <form action={cancelPaymentAction}>
                    <input type="hidden" name="reference" value={payment.reference} />
                    <button
                      type="submit"
                      className="rounded-full border border-gray-200 px-5 py-2.5 font-semibold text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {done.length > 0 && (
        <>
          <h2 className="mt-12 font-display text-xl font-semibold text-primary-900">
            Confirmed ({done.length})
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="py-2 pr-4">Receipt</th>
                  <th className="py-2 pr-4">Reference</th>
                  <th className="py-2 pr-4">Payer</th>
                  <th className="py-2 pr-4">For</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2">Confirmed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {done.map((payment) => (
                  <tr key={payment.id}>
                    <td className="py-2.5 pr-4 font-mono text-gray-900">
                      {payment.receiptNumber ?? "—"}
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-gray-600">{payment.reference}</td>
                    <td className="py-2.5 pr-4 text-gray-800">{payment.payerName}</td>
                    <td className="py-2.5 pr-4 text-gray-600">{payment.purpose}</td>
                    <td className="py-2.5 pr-4 font-semibold text-gray-900">
                      {formatRupees(payment.amount)}
                    </td>
                    <td className="py-2.5 text-gray-500">{when(payment.confirmedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Container>
  );
}
