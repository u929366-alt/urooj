import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Receipt } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { ReceiptUpload } from "@/components/learn/ReceiptUpload";
import { getPayloadClient } from "@/lib/lms/auth";
import { bankInstructions, formatRupees } from "@/lib/lms/payments";
import { siteConfig } from "@/lib/site";
import type { Workshop } from "@/payload-types";

type Params = { params: Promise<{ reference: string }> };

export const metadata: Metadata = {
  title: "Send your payment receipt",
  // Keyed on a payment reference. Nothing here should be indexed.
  robots: { index: false, follow: false },
};

export default async function ReceiptPage({ params }: Params) {
  const { reference } = await params;
  const code = decodeURIComponent(reference).trim().toUpperCase();

  const payload = await getPayloadClient();
  const found = await payload.find({
    collection: "workshop-registrations",
    where: { paymentReference: { equals: code } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  });
  const registration = found.docs[0];
  if (!registration) notFound();

  const workshop =
    typeof registration.workshop === "object" ? (registration.workshop as Workshop) : null;
  const bank = bankInstructions();
  const paid = registration.status === "confirmed";
  const alreadySent = Boolean(registration.receiptUploadedAt);
  const contactEmail = workshop?.contactEmail ?? siteConfig.email;

  return (
    <Container className="py-14">
      <div className="mx-auto max-w-xl">
        <Card className="p-8">
          <Receipt className="h-8 w-8 text-primary-500" aria-hidden />
          <h1 className="mt-4 font-display text-2xl font-bold text-primary-900">
            {paid ? "Your place is confirmed" : "Send us your payment receipt"}
          </h1>
          {workshop && (
            <p className="mt-1 text-gray-600">
              {workshop.title}
              {workshop.tagline ? ` — ${workshop.tagline}` : ""}
            </p>
          )}

          {/*
            Deliberately no name, email or phone on this page. It is reachable
            with nothing but a payment reference, so it shows only enough for
            the payer to know they are in the right place.
          */}
          <dl className="mt-6 space-y-2 border-y border-gray-100 py-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Reference</dt>
              <dd className="font-mono font-bold text-primary-900">{code}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Amount</dt>
              <dd className="font-semibold text-gray-800">
                {formatRupees(registration.amountDue ?? 0)}
              </dd>
            </div>
          </dl>

          {paid ? (
            <div className="mt-6 flex items-start gap-3 rounded-xl bg-accent-50 p-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" aria-hidden />
              <p className="text-sm text-gray-700">
                We have received your payment. The joining link will be emailed to you before the
                session — nothing else is needed.
              </p>
            </div>
          ) : (
            <>
              {alreadySent && (
                <p className="mt-6 rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-900">
                  You have already sent a receipt and we are checking it. You can send another if
                  the first was hard to read.
                </p>
              )}

              <div className="mt-6">
                <ReceiptUpload reference={code} />
              </div>

              <div className="mt-8 rounded-xl bg-gray-50 p-5 text-sm">
                <p className="font-semibold text-primary-900">Not paid yet?</p>
                <p className="mt-1 text-gray-600">
                  Transfer {formatRupees(registration.amountDue ?? 0)} quoting{" "}
                  <strong>{code}</strong>, then come back here.
                </p>
                <dl className="mt-3 space-y-1">
                  <div className="flex gap-2">
                    <dt className="w-28 shrink-0 text-gray-500">Bank</dt>
                    <dd className="text-gray-800">{bank.bankName}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-28 shrink-0 text-gray-500">Account title</dt>
                    <dd className="text-gray-800">{bank.accountTitle}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-28 shrink-0 text-gray-500">IBAN</dt>
                    <dd className="font-mono text-gray-800">{bank.iban}</dd>
                  </div>
                </dl>
              </div>
            </>
          )}

          <p className="mt-6 text-sm text-gray-500">
            Any trouble? Email{" "}
            <a href={`mailto:${contactEmail}`} className="font-semibold text-primary-600">
              {contactEmail}
            </a>
            .
          </p>

          {workshop?.slug && (
            <Link
              href={`/workshops/${workshop.slug}`}
              className="mt-4 inline-block text-sm font-semibold text-primary-600 hover:underline"
            >
              ← Back to the workshop
            </Link>
          )}
        </Card>
      </div>
    </Container>
  );
}
