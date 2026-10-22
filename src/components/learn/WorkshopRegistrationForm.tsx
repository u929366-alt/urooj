"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Clock, Upload } from "lucide-react";
import { registerForWorkshopAction, type RegistrationState } from "@/lib/lms/workshopActions";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-secondary-500 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-secondary-600 disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? "Sending…" : label}
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
  const [chosen, setChosen] = useState<string | null>(null);

  const unit = category === "student" ? priceStudent : priceProfessional;
  const total = unit * places;
  const money = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;

  if (state?.success) {
    const { success } = state;
    return (
      <div className="rounded-2xl border border-accent-200 bg-accent-50 p-6">
        <CheckCircle2 className="h-8 w-8 text-accent-600" aria-hidden />
        <h2 className="mt-3 font-display text-xl font-bold text-primary-900">
          Thank you, {success.name.split(" ")[0]}
        </h2>
        <p className="mt-2 text-sm text-gray-700">
          We have your registration and your payment proof. Nothing more is needed from you.
        </p>

        <div className="mt-5 flex items-start gap-3 rounded-xl bg-white p-5">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" aria-hidden />
          <div className="text-sm text-gray-700">
            <p className="font-semibold text-primary-900">Your place is not confirmed yet</p>
            <p className="mt-1">
              We check every payment against our bank account by hand. Once yours is matched we
              will write to <strong>{success.email}</strong> to confirm your place, and the
              joining details come with it. That is the only email you will get from us, so do
              look out for it.
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          Anything wrong?{" "}
          <a href={`mailto:${contactEmail}`} className="font-semibold text-primary-600">
            {contactEmail}
          </a>
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="slug" value={slug} />

      {state?.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}

      {/* The fee comes first, because the receipt for it is part of the
          form. There is one form and one submit: nobody is registered
          halfway. */}
      <div className="rounded-2xl border-2 border-primary-200 bg-primary-50 p-5">
        <p className="text-sm font-bold text-primary-900">What to pay</p>
        <p className="mt-1 text-sm text-gray-700">
          Transfer the fee, then fill in the rest of this form and attach your receipt to it.
        </p>

        <fieldset className="mt-4">
          <legend className="text-sm font-semibold text-primary-900">I am registering as</legend>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {(["professional", "student"] as const).map((value) => (
              <label
                key={value}
                className={`cursor-pointer rounded-xl border-2 bg-white px-4 py-3 text-center transition-colors ${
                  category === value
                    ? "border-primary-600 ring-2 ring-primary-100"
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

        <div className="mt-4">
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
            className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 outline-none focus:border-primary-400"
          />
        </div>

        {total > 0 && (
          <>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-white px-4 py-3">
              <span className="text-sm text-primary-900">
                {places > 1 ? `${places} places × ${money(unit)}` : "Amount to transfer"}
              </span>
              <span className="font-display text-xl font-bold text-primary-900">
                {money(total)}
              </span>
            </div>

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
                <dd className="font-mono text-xs text-gray-800 sm:text-sm">{bank.iban}</dd>
              </div>
            </dl>
          </>
        )}
      </div>

      <div className="rounded-2xl border-2 border-gray-200 p-5">
        <p className="text-sm font-bold text-primary-900">Your details</p>

        <div className="mt-4 space-y-4">
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
              hint="Your confirmation and joining link go here"
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              name="organisation"
              label={category === "student" ? "Institution" : "Organisation"}
            />
            <Field name="city" label="City" autoComplete="address-level2" />
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
        </div>
      </div>

      {total > 0 && (
        <div className="rounded-2xl border-2 border-secondary-200 bg-secondary-50/50 p-5">
          <p className="text-sm font-bold text-primary-900">
            Your payment proof <span className="text-secondary-700">(required)</span>
          </p>
          <p className="mt-1 text-sm text-gray-700">
            A photo of the transfer slip, a screenshot from your banking app, or the bank&apos;s
            PDF. <strong>Your registration is not complete without it</strong> — this form will
            not send until one is attached.
          </p>

          <label
            htmlFor="receipt"
            className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-secondary-300 bg-white px-4 py-5 text-center text-sm font-medium text-gray-600 hover:border-secondary-500 hover:bg-secondary-50"
          >
            <Upload className="h-4 w-4 shrink-0" aria-hidden />
            {chosen ?? "Choose your receipt"}
          </label>
          <input
            id="receipt"
            name="receipt"
            type="file"
            accept="image/*,application/pdf"
            required
            className="sr-only"
            onChange={(event) => setChosen(event.target.files?.[0]?.name ?? null)}
          />
          {state?.fieldErrors?.receipt && (
            <p className="mt-2 text-sm text-red-600">{state.fieldErrors.receipt}</p>
          )}
          <p className="mt-2 text-xs text-gray-500">Up to 8 MB.</p>
        </div>
      )}

      <Submit label={total > 0 ? `Complete registration — ${money(total)} paid` : "Register"} />
      <p className="text-center text-xs text-gray-500">
        We check every payment by hand. Your place is confirmed by email once we have matched it.
      </p>
    </form>
  );
}
