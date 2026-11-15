"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Download, Mail, Send } from "lucide-react";
import { sendFollowUpAction } from "@/lib/lms/workshopReview";

function Pending({ children, className }: { children: React.ReactNode; className: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? "Sending…" : children}
    </button>
  );
}

function Field({
  name,
  label,
  hint,
  defaultValue,
  placeholder,
  type = "text",
}: {
  name: string;
  label: string;
  hint?: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-primary-900">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
      />
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

/**
 * Writing to everyone who attended, after the fact.
 *
 * Deliberately a compose box rather than a fixed template: what follows a
 * session is different every time — the feedback form this week, slides the
 * next, a note about certificates after that. The two link fields are there
 * because those two are what gets sent most, and a button is easier to press
 * than a URL is to copy.
 */
export function FollowUpPanel({
  workshopId,
  workshopSlug,
  title,
  people,
}: {
  workshopId: string;
  workshopSlug: string;
  title: string;
  /** How many emails this will send. */
  people: number;
}) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (people === 0) return null;

  return (
    <div className="mt-6 rounded-2xl border-2 border-gray-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" aria-hidden />
          <div>
            <p className="text-sm font-bold text-primary-900">Write to everyone — {title}</p>
            <p className="mt-1 text-sm text-gray-700">
              The feedback form, the handout, anything else after the session. Goes to all{" "}
              <strong>{people}</strong> {people === 1 ? "person" : "people"} on the register,
              each addressed by name.
            </p>
          </div>
        </div>

        <a
          href={`/learn/workshops/attendees?workshop=${encodeURIComponent(workshopSlug)}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          download
        >
          <Download className="h-4 w-4" aria-hidden />
          Download the list
        </a>
      </div>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
        >
          <Mail className="h-4 w-4" aria-hidden />
          Write an email
        </button>
      ) : (
        <form action={sendFollowUpAction} className="mt-4 space-y-4">
          <input type="hidden" name="workshopId" value={workshopId} />

          <Field
            name="subject"
            label="Subject"
            defaultValue={`Thank you for attending ${title}`}
          />
          <Field
            name="heading"
            label="Heading inside the email"
            defaultValue="Thank you for joining us"
            hint="Leave blank to reuse the subject."
          />

          <div>
            <label htmlFor="body" className="block text-sm font-semibold text-primary-900">
              Message
            </label>
            <textarea
              id="body"
              name="body"
              rows={7}
              required
              defaultValue={`Thank you for joining us for ${title}. We hope you found it useful.

We would be grateful if you could spare two minutes to tell us what you thought — your feedback shapes how we run the next one.

The handout from the session is below, yours to keep and to share with colleagues.

Your certificate will follow by email shortly.`}
              className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
            <p className="mt-1 text-xs text-gray-500">
              A blank line starts a new paragraph. Their first name is added above this
              automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              name="feedbackUrl"
              label="Feedback form link"
              type="url"
              placeholder="https://forms.gle/…"
              hint="Becomes a blue button. Leave blank for none."
            />
            <Field
              name="feedbackLabel"
              label="Button wording"
              placeholder="Fill in the feedback form"
            />
            <Field
              name="handoutUrl"
              label="Handout link"
              type="url"
              placeholder="https://drive.google.com/…"
              hint="Drive, Dropbox, anywhere the file is readable without a login."
            />
            <Field
              name="handoutLabel"
              label="Button wording"
              placeholder="Download the handout"
            />
          </div>

          {confirming ? (
            <div className="rounded-xl bg-primary-50 p-4">
              <p className="text-sm text-gray-800">
                Send to all <strong>{people}</strong> {people === 1 ? "person" : "people"}?
                This cannot be unsent.
              </p>
              <div className="mt-3 flex gap-2">
                <Pending className="inline-flex items-center gap-1.5 rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
                  <Send className="h-4 w-4" aria-hidden />
                  Yes, send now
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
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
              >
                <Send className="h-4 w-4" aria-hidden />
                Send to {people} {people === 1 ? "person" : "people"}
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
