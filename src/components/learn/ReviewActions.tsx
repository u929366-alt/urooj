"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, X } from "lucide-react";
import { approveRegistrationAction, declineRegistrationAction } from "@/lib/lms/workshopReview";

function Pending({ children, className }: { children: React.ReactNode; className: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? "Working…" : children}
    </button>
  );
}

/**
 * Approve or turn down one registration.
 *
 * Approving sends the confirmation email, so it asks first — there is no
 * taking it back once the registrant has been told they have a place.
 */
export function ReviewActions({ id, name }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false);
  const [declining, setDeclining] = useState(false);

  if (declining) {
    return (
      <form action={declineRegistrationAction} className="rounded-xl bg-amber-50 p-4">
        <input type="hidden" name="id" value={id} />
        <label htmlFor={`reason-${id}`} className="block text-sm font-semibold text-amber-900">
          What should we tell {name.split(" ")[0]}?
        </label>
        <textarea
          id={`reason-${id}`}
          name="reason"
          rows={2}
          defaultValue="We could not match your payment to our bank account."
          className="mt-2 w-full rounded-lg border border-amber-200 px-3 py-2 text-sm outline-none focus:border-amber-400"
        />
        <p className="mt-1 text-xs text-amber-800">
          This goes to them by email, and they can reply to it.
        </p>
        <div className="mt-3 flex gap-2">
          <Pending className="rounded-full bg-amber-600 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60">
            Send and mark unconfirmed
          </Pending>
          <button
            type="button"
            onClick={() => setDeclining(false)}
            className="rounded-full px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  if (confirming) {
    return (
      <form action={approveRegistrationAction} className="rounded-xl bg-accent-50 p-4">
        <input type="hidden" name="id" value={id} />
        <p className="text-sm text-gray-800">
          Approve <strong>{name}</strong>? This emails them a confirmation with the joining link,
          and marks the payment received.
        </p>
        <div className="mt-3 flex gap-2">
          <Pending className="inline-flex items-center gap-1.5 rounded-full bg-accent-600 px-5 py-2 text-sm font-semibold text-white hover:bg-accent-700 disabled:opacity-60">
            <Check className="h-4 w-4" aria-hidden />
            Yes, approve and send
          </Pending>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="rounded-full px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center gap-1.5 rounded-full bg-accent-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-700"
      >
        <Check className="h-4 w-4" aria-hidden />
        Payment verified — approve
      </button>
      <button
        type="button"
        onClick={() => setDeclining(true)}
        className="inline-flex items-center gap-1.5 rounded-full border-2 border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        <X className="h-4 w-4" aria-hidden />
        Something&apos;s wrong
      </button>
    </div>
  );
}
