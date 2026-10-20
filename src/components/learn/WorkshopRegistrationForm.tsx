"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Copy } from "lucide-react";
import { ReceiptUpload } from "@/components/learn/ReceiptUpload";
import {
  registerForWorkshopAction,
  type RegistrationState,
} from "@/lib/lms/workshopActions";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-secondary-500 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-secondary-600 disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? "Registering…" : label}
    </button>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  hint,
  error,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-primary-900">
        {label}
        {!required && <span className="font-normal text-gray-500"> (optional)</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
      />
      {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function WorkshopRegistrationForm({
  slug,
  priceProfessional,
  priceStudent,
  bank,
  contactEmail,
}: {
  slug: string;
  priceProfessional: number;
  priceStudent: number;
  bank: { bankName: string; accountTitle: string; iban: string };
  contactEmail: string;
}) {
  const [state, action] = useActionState<RegistrationState, FormData>(
    registerForWorkshopAction,
    null,
  );
  const [category, setCategory] = useState<"professional" | "student">("professional");
  const [places, setPlaces] = useState(1);
  const [copied, setCopied] = useState(false);

  const unit = category === "student" ? priceStudent : priceProfessional;
  const total = unit * places;
  const money = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;

  if (state?.success) {
    const { success } = state;
    return (
      <div className="rounded-2xl border border-accent-200 bg-accent-50 p-6">
        <CheckCircle2 className="h-8 w-8 text-accent-600" aria-hidden />
        <h2 className="mt-3 font-display text-xl font-bold text-primary-900">
          You are registered, {success.name.split(" ")[0]}
        </h2>
        <p className="mt-2 text-sm text-gray-700">
          A confirmation has gone to <strong>{success.email}</strong>. If it is not there in a few
          minutes, check your spam folder.
        </p>

        {success.amount > 0 && (
          <div className="mt-5 rounded-xl bg-white p-5">
            <p className="text-sm text-gray-700">
              Your place is held. To confirm it, transfer{" "}
              <strong>{money(success.amount)}</strong> quoting this reference:
            </p>
            {success.reference && (
              <div className="mt-3 flex items-center gap-3">
                <code className="rounded-lg bg-primary-50 px-4 py-2 font-mono text-lg font-bold tracking-wider text-primary-900">
                  {success.reference}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard?.writeText(success.reference ?? "");
                    setCopied(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            )}
            <dl className="mt-4 space-y-1 text-sm">
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
            <p className="mt-4 text-sm text-gray-600">
              The joining link is emailed once the fee is received.
            </p>
          </div>
        )}

        {success.amount > 0 && success.reference && (
          <div className="mt-4 rounded-xl bg-white p-5">
            <h3 className="font-display text-base font-semibold text-primary-900">
              Already paid? Attach your receipt
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Fastest way to get your place confirmed. You can also come back to this later —
              there is a link in your email.
            </p>
            <div className="mt-4">
              <ReceiptUpload reference={success.reference} compact />
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Or email it to{" "}
              <a href={`mailto:${contactEmail}`} className="font-semibold text-primary-600">
                {contactEmail}
              </a>
              .
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="slug" value={slug} />

      {state?.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}

      <Field
        name="name"
        label="Full name"
        required
        autoComplete="name"
        error={state?.fieldErrors?.name}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          name="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          hint="Your joining link goes here"
          error={state?.fieldErrors?.email}
        />
        <Field
          name="phone"
          label="Phone / WhatsApp"
          type="tel"
          required
          autoComplete="tel"
          error={state?.fieldErrors?.phone}
        />
      </div>

      <fieldset>
        <legend className="block text-sm font-semibold text-primary-900">I am registering as</legend>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {(["professional", "student"] as const).map((value) => (
            <label
              key={value}
              className={`cursor-pointer rounded-xl border-2 px-4 py-3 text-center transition-colors ${
                category === value
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="category"
                value={value}
                checked={category === value}
                onChange={() => setCategory(value)}
                className="sr-only"
              />
              <span className="block text-sm font-semibold capitalize text-primary-900">
                {value}
              </span>
              <span className="mt-0.5 block text-sm text-gray-600">
                {money(value === "student" ? priceStudent : priceProfessional)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          name="organisation"
          label={category === "student" ? "Institution" : "Organisation"}
        />
        <Field name="city" label="City" autoComplete="address-level2" />
      </div>

      <div>
        <label htmlFor="groupSize" className="block text-sm font-semibold text-primary-900">
          Number of places
        </label>
        <input
          id="groupSize"
          name="groupSize"
          type="number"
          min={1}
          max={20}
          value={places}
          onChange={(event) => setPlaces(Math.max(1, Number(event.target.value) || 1))}
          className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
        <p className="mt-1 text-xs text-gray-500">
          Booking for a group? Put the number of places here and we will contact you about the
          group rate.
        </p>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-semibold text-primary-900">
          Anything we should know? <span className="font-normal text-gray-500">(optional)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={2}
          className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
      </div>

      {total > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-primary-50 px-4 py-3">
          <span className="text-sm text-primary-900">
            {places > 1 ? `${places} places × ${money(unit)}` : "Fee"}
          </span>
          <span className="font-display text-lg font-bold text-primary-900">{money(total)}</span>
        </div>
      )}

      <Submit label={total > 0 ? `Register — ${money(total)}` : "Register"} />
      <p className="text-center text-xs text-gray-500">
        Nothing is paid on this page. You get a reference and bank details to transfer the fee.
      </p>
    </form>
  );
}
