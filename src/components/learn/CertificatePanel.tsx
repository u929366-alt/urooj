"use client";

import { useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Award, Eye, Send } from "lucide-react";
import { issueCertificatesAction } from "@/lib/lms/workshopReview";
import type { Eligible } from "@/lib/lms/workshopCertificates";

function Pending({ children, className }: { children: React.ReactNode; className: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? "Issuing…" : children}
    </button>
  );
}

/**
 * Issuing certificates, to the people you choose.
 *
 * It used to be one button that wrote to everybody on the register, which is
 * wrong twice over: people miss sessions they paid for, and a certificate
 * cannot be withdrawn once it is in somebody's inbox. So this is a list you
 * tick, defaulting to everyone who has not got one yet — the common case —
 * but with each person there to untick.
 *
 * Hidden until the session has finished. A certificate for a workshop that
 * has not happened is not a mistake worth being one click away.
 */
export function CertificatePanel({
  workshopId,
  title,
  people,
  ended,
  unnamed,
}: {
  workshopId: string;
  title: string;
  people: Eligible[];
  ended: boolean;
  /** Paid places nobody ever put a name to. */
  unnamed: number;
}) {
  const waiting = people.filter((person) => !person.serial);
  const [chosen, setChosen] = useState<Set<string>>(
    () => new Set(waiting.map((person) => person.seat)),
  );
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (!ended || people.length === 0) return null;

  const toggle = (seat: string) =>
    setChosen((current) => {
      const next = new Set(current);
      if (next.has(seat)) next.delete(seat);
      else next.add(seat);
      return next;
    });

  const issued = people.length - waiting.length;

  return (
    <div className="mt-6 rounded-2xl border-2 border-accent-200 bg-accent-50/60 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Award className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" aria-hidden />
          <div>
            <p className="text-sm font-bold text-primary-900">Certificates — {title}</p>
            <p className="mt-1 text-sm text-gray-700">
              {waiting.length > 0 ? (
                <>
                  <strong>
                    {waiting.length} {waiting.length === 1 ? "person has" : "people have"}
                  </strong>{" "}
                  no certificate yet
                  {issued > 0 && <> ({issued} already issued)</>}.
                </>
              ) : (
                <>
                  All {issued} {issued === 1 ? "certificate has" : "certificates have"} been
                  issued.
                </>
              )}
            </p>
            {unnamed > 0 && (
              <p className="mt-1.5 text-sm text-amber-700">
                {unnamed} paid {unnamed === 1 ? "place has" : "places have"} no name against{" "}
                {unnamed === 1 ? "it" : "them"} — a certificate needs somebody to be made out
                to. Add the names under Attendees first.
              </p>
            )}
          </div>
        </div>

        <Link
          href={`/learn/workshops/preview?workshop=${encodeURIComponent(workshopId)}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <Eye className="h-4 w-4" aria-hidden />
          Review the certificate
        </Link>
      </div>

      {waiting.length > 0 && !open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-700"
        >
          <Award className="h-4 w-4" aria-hidden />
          Choose who gets one
        </button>
      )}

      {open && (
        <form action={issueCertificatesAction} className="mt-4">
          <input type="hidden" name="workshopId" value={workshopId} />

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-accent-200 pb-2">
            <p className="text-sm font-semibold text-primary-900">
              Who attended? {chosen.size} of {waiting.length} ticked
            </p>
            <div className="flex gap-3 text-sm">
              <button
                type="button"
                onClick={() => setChosen(new Set(waiting.map((p) => p.seat)))}
                className="font-semibold text-primary-600 hover:underline"
              >
                Tick all
              </button>
              <button
                type="button"
                onClick={() => setChosen(new Set())}
                className="font-semibold text-gray-500 hover:underline"
              >
                Clear
              </button>
            </div>
          </div>

          <ul className="mt-2 max-h-80 space-y-0.5 overflow-y-auto">
            {people.map((person) => {
              const done = Boolean(person.serial);
              return (
                <li key={person.seat}>
                  <label
                    className={`flex items-start gap-3 rounded-lg px-2 py-2 text-sm ${
                      done ? "opacity-55" : "cursor-pointer hover:bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="seat"
                      value={person.seat}
                      checked={!done && chosen.has(person.seat)}
                      disabled={done}
                      onChange={() => toggle(person.seat)}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-accent-600 focus:ring-accent-500"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="font-medium text-gray-900">{person.name}</span>
                      <span className="ml-2 text-gray-500">{person.email ?? "no email"}</span>
                      <span className="mt-0.5 block font-mono text-xs text-gray-400">
                        {person.seat}
                        {person.bookedBy !== person.name && (
                          <span className="font-sans"> · booked by {person.bookedBy}</span>
                        )}
                      </span>
                    </span>
                    {done && (
                      <span className="shrink-0 text-xs font-semibold text-accent-700">
                        issued
                      </span>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>

          {!person_has_email(people, chosen) && (
            <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Some of the people you have ticked have no email address. Their certificates
              will be created, but there is nowhere to send them.
            </p>
          )}

          {confirming ? (
            <div className="mt-3 rounded-xl bg-white p-4">
              <p className="text-sm text-gray-800">
                Issue <strong>{chosen.size}</strong>{" "}
                {chosen.size === 1 ? "certificate" : "certificates"} and email each one as a
                PDF attachment? A certificate cannot be withdrawn once it is sent.
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
                  Back
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                disabled={chosen.size === 0}
                onClick={() => setConfirming(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Award className="h-4 w-4" aria-hidden />
                Issue {chosen.size} {chosen.size === 1 ? "certificate" : "certificates"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}

/** True when everybody ticked has somewhere for their certificate to go. */
function person_has_email(people: Eligible[], chosen: Set<string>): boolean {
  return people
    .filter((person) => chosen.has(person.seat) && !person.serial)
    .every((person) => Boolean(person.email));
}
