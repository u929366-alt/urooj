"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Award, Send } from "lucide-react";
import { issueCertificatesAction } from "@/lib/lms/workshopReview";

function Pending({ children, className }: { children: React.ReactNode; className: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? "Issuing…" : children}
    </button>
  );
}

/**
 * Issuing certificates for a workshop, once it has happened.
 *
 * Hidden until the session has finished. A certificate saying somebody
 * attended a workshop that has not taken place yet is not a mistake you want
 * to be able to make with one click, and there is no unissuing.
 */
export function CertificatePanel({
  workshopId,
  title,
  eligible,
  issued,
  unnamed,
  ended,
}: {
  workshopId: string;
  title: string;
  /** People on the register who should hold one. */
  eligible: number;
  /** How many already do. */
  issued: number;
  /** Paid places nobody ever put a name to. */
  unnamed: number;
  ended: boolean;
}) {
  const [confirming, setConfirming] = useState(false);
  const waiting = Math.max(0, eligible - issued);

  if (!ended || eligible === 0) return null;

  if (confirming) {
    return (
      <form
        action={issueCertificatesAction}
        className="mt-6 rounded-2xl border-2 border-accent-300 bg-accent-50 p-5"
      >
        <input type="hidden" name="workshopId" value={workshopId} />
        <p className="text-sm text-gray-800">
          Issue certificates to the <strong>{waiting}</strong>{" "}
          {waiting === 1 ? "person" : "people"} on the register who do not have one, and email
          each of them a link? Certificates already issued are left alone.
        </p>
        <p className="mt-2 text-sm text-gray-700">
          A certificate cannot be withdrawn once it is issued, so check the register first if
          anyone did not turn up.
        </p>
        <div className="mt-3 flex gap-2">
          <Pending className="inline-flex items-center gap-1.5 rounded-full bg-accent-600 px-5 py-2 text-sm font-semibold text-white hover:bg-accent-700 disabled:opacity-60">
            <Send className="h-4 w-4" aria-hidden />
            Yes, issue and send
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
    <div className="mt-6 rounded-2xl border-2 border-accent-200 bg-accent-50/60 p-5">
      <div className="flex items-start gap-3">
        <Award className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" aria-hidden />
        <div className="min-w-0">
          <p className="text-sm font-bold text-primary-900">Certificates — {title}</p>
          <p className="mt-1 text-sm text-gray-700">
            {waiting > 0 ? (
              <>
                <strong>
                  {waiting} {waiting === 1 ? "person has" : "people have"}
                </strong>{" "}
                no certificate yet
                {issued > 0 && <> ({issued} already issued)</>}.
              </>
            ) : (
              <>
                All {issued} {issued === 1 ? "certificate has" : "certificates have"} been
                issued and sent.
              </>
            )}
          </p>
          {unnamed > 0 && (
            <p className="mt-1.5 text-sm text-amber-700">
              {unnamed} paid {unnamed === 1 ? "place has" : "places have"} no name against{" "}
              {unnamed === 1 ? "it" : "them"} — a certificate needs somebody to be made out
              to, so {unnamed === 1 ? "that place gets" : "those places get"} nothing. Add the
              names under Attendees first if you want them included.
            </p>
          )}
        </div>
      </div>

      {waiting > 0 && (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-700"
        >
          <Award className="h-4 w-4" aria-hidden />
          Issue {waiting} {waiting === 1 ? "certificate" : "certificates"}
        </button>
      )}
    </div>
  );
}
