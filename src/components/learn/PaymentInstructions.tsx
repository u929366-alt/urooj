import { Banknote, Clock, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/lib/site";
import type { Payment } from "@/payload-types";

function rupees(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * What the payer sees after committing to pay: the amount, the account, and
 * the reference they must quote so their transfer can be matched to them.
 */
export function PaymentInstructions({ payment }: { payment: Payment }) {
  const confirmed = payment.status === "confirmed";
  const bank = siteConfig.bankDetails;

  if (confirmed) {
    return (
      <Card className="border-accent-200 p-8">
        <CheckCircle2 className="h-10 w-10 text-accent-500" aria-hidden />
        <h2 className="mt-4 font-display text-2xl font-bold text-primary-900">
          Payment received
        </h2>
        <p className="mt-2 text-gray-600">
          Thank you. We have confirmed {rupees(payment.amount)}
          {payment.purpose === "course" ? " and your place is now open." : "."}
        </p>
        <dl className="mt-6 space-y-2 border-t border-gray-100 pt-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Receipt number</dt>
            <dd className="font-mono font-semibold text-gray-900">
              {payment.receiptNumber ?? "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Reference</dt>
            <dd className="font-mono font-semibold text-gray-900">{payment.reference}</dd>
          </div>
        </dl>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <Banknote className="h-10 w-10 text-primary-500" aria-hidden />
      <h2 className="mt-4 font-display text-2xl font-bold text-primary-900">
        Transfer {rupees(payment.amount)}
      </h2>
      <p className="mt-2 text-gray-600">
        Send the amount to the account below and{" "}
        <strong>quote the reference</strong> so we can match your transfer.
      </p>

      <dl className="mt-6 divide-y divide-gray-100 border-y border-gray-100 text-sm">
        <div className="flex justify-between gap-4 py-3">
          <dt className="text-gray-500">Bank</dt>
          <dd className="text-right font-semibold text-gray-900">{bank.bankName}</dd>
        </div>
        <div className="flex justify-between gap-4 py-3">
          <dt className="text-gray-500">Account title</dt>
          <dd className="text-right font-semibold text-gray-900">{bank.accountTitle}</dd>
        </div>
        <div className="flex justify-between gap-4 py-3">
          <dt className="text-gray-500">IBAN</dt>
          <dd className="text-right font-mono font-semibold text-gray-900">{bank.iban}</dd>
        </div>
        <div className="flex justify-between gap-4 py-3">
          <dt className="text-gray-500">Amount</dt>
          <dd className="text-right font-semibold text-gray-900">{rupees(payment.amount)}</dd>
        </div>
      </dl>

      <div className="mt-6 rounded-2xl bg-secondary-50 p-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-secondary-700">
          Your reference
        </p>
        <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-secondary-800">
          {payment.reference}
        </p>
      </div>

      <p className="mt-6 flex items-start gap-2 text-sm text-gray-600">
        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden />
        <span>
          We check transfers on working days and email a receipt once yours arrives
          {payment.purpose === "course" ? ", which opens the course" : ""}. These details
          have also been emailed to you. Questions:{" "}
          <a href={`mailto:${siteConfig.email}`} className="font-semibold text-primary-600 hover:underline">
            {siteConfig.email}
          </a>
        </span>
      </p>
    </Card>
  );
}
