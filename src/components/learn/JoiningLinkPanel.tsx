"use client";

import { useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { AlertTriangle, Send, Video } from "lucide-react";
import { sendJoiningLinksAction } from "@/lib/lms/workshopReview";

function Pending({ children, className }: { children: React.ReactNode; className: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? "Sending…" : children}
    </button>
  );
}

/**
 * Sending the joining link to everybody holding a place.
 *
 * Separate from approving, because the two happen weeks apart: places are
 * confirmed as the money arrives, the link is made a day or two before. By
 * then most registrants have had a letter promising the link would follow,
 * and nothing was following it.
 *
 * It asks before sending, and says how many emails that is. There is no
 * unsending, and some of these are people who paid.
 */
export function JoiningLinkPanel({
  workshopId,
  title,
  hasLink,
  platform,
  waiting,
  people,
  alreadySent,
}: {
  workshopId: string;
  title: string;
  hasLink: boolean;
  platform: string;
  /** Confirmed bookings that have not been sent the link. */
  waiting: number;
  /** How many emails that is, counting named attendees separately. */
  people: number;
  /** Confirmed bookings that have had it. */
  alreadySent: number;
}) {
  const [confirming, setConfirming] = useState<"new" | "all" | null>(null);

  if (!hasLink) {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50 p-5">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
        <div className="text-sm">
          <p className="font-semibold text-amber-900">No joining link set for {title}</p>
          <p className="mt-1 text-amber-900">
            Everyone confirmed so far has been told the link will follow by email, and it
            cannot be sent until there is one. Put it in{" "}
            <Link href="/admin/collections/workshops" className="font-semibold underline">
              Workshops
            </Link>{" "}
            → {title} → <strong>Join URL</strong>, then come back here.
          </p>
        </div>
      </div>
    );
  }

  if (confirming) {
    const everyone = confirming === "all";
    return (
      <form
        action={sendJoiningLinksAction}
        className="mt-6 rounded-2xl border-2 border-primary-300 bg-primary-50 p-5"
      >
        <input type="hidden" name="workshopId" value={workshopId} />
        <input type="hidden" name="mode" value={everyone ? "all" : "new"} />
        <p className="text-sm text-gray-800">
          {everyone ? (
            <>
              Send the {platform} link to <strong>everyone confirmed</strong>, including the{" "}
              {alreadySent} {alreadySent === 1 ? "booking" : "bookings"} that already had it?
            </>
          ) : (
            <>
              Send the {platform} link to the {waiting}{" "}
              {waiting === 1 ? "booking" : "bookings"} that have not had it — {people}{" "}
              {people === 1 ? "person" : "people"}?
            </>
          )}{" "}
          This cannot be unsent.
        </p>
        <div className="mt-3 flex gap-2">
          <Pending className="inline-flex items-center gap-1.5 rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
            <Send className="h-4 w-4" aria-hidden />
            Yes, send now
          </Pending>
          <button
            type="button"
            onClick={() => setConfirming(null)}
            className="rounded-full px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border-2 border-primary-200 bg-primary-50 p-5">
      <div className="flex items-start gap-3">
        <Video className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" aria-hidden />
        <div className="min-w-0">
          <p className="text-sm font-bold text-primary-900">Joining link — {title}</p>
          <p className="mt-1 text-sm text-gray-700">
            {waiting > 0 ? (
              <>
                <strong>
                  {waiting} {waiting === 1 ? "booking has" : "bookings have"}
                </strong>{" "}
                not been sent the link — {people} {people === 1 ? "person" : "people"}. Each
                attendee is written to separately, so nobody has to forward it.
              </>
            ) : alreadySent > 0 ? (
              <>
                Everyone confirmed has had the link ({alreadySent}{" "}
                {alreadySent === 1 ? "booking" : "bookings"}). Confirm another place and it
                appears here to send.
              </>
            ) : (
              <>Nobody is confirmed yet, so there is nobody to send to.</>
            )}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {waiting > 0 && (
          <button
            type="button"
            onClick={() => setConfirming("new")}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            <Send className="h-4 w-4" aria-hidden />
            Send to the {waiting} not yet sent
          </button>
        )}
        {alreadySent > 0 && (
          <button
            type="button"
            onClick={() => setConfirming("all")}
            className="rounded-full border-2 border-primary-300 px-5 py-2.5 text-sm font-semibold text-primary-800 hover:bg-primary-100"
          >
            Send to everyone again
          </button>
        )}
      </div>
    </div>
  );
}
