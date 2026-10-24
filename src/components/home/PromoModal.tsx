"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { siteConfig } from "@/lib/site";

/**
 * The flyer, shown once when somebody lands on the home page.
 *
 * Bump SEEN_KEY whenever the flyer changes, so people who dismissed the last
 * one are shown the new announcement rather than nothing.
 *
 * ENDS_AT is the point at which this stops appearing by itself. The previous
 * flyer sat on the home page advertising a course whose closing date had
 * passed, and had to be taken down by hand — which is exactly the sort of
 * thing that only gets noticed by a visitor. Set it to the end of the event
 * and it retires itself.
 */
const SEEN_KEY = "hs-promo-thrive-360";
const ENDS_AT = Date.parse("2026-11-14T12:00:00Z"); // 5pm, Saturday 14 November, Pakistan time
const REGISTER_URL = `${siteConfig.portalUrl}/workshops/thrive-360`;

export function PromoModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (Date.now() > ENDS_AT) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {
      // Private browsing can refuse storage. Showing the flyer anyway is the
      // right way to fail: worst case somebody sees it twice.
    }
    const timer = setTimeout(() => setOpen(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Nothing to do; it will show again next time, which is survivable.
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Workshop announcement"
      onClick={close}
      className="animate-promo-fade fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="animate-promo-pop relative flex max-h-[94vh] w-full max-w-sm flex-col overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close announcement"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
        >
          <X className="h-5 w-5" />
        </button>

        <a href={REGISTER_URL} onClick={close} className="block">
          <Image
            src="/thrive-360-flyer.jpg"
            alt="THRIVE 360 — Strengthening Mental Wellbeing Across Life, Education and Workplace. A live Zoom workshop presented by Ms. Asma Ahmed, Consultant Clinical Psychologist, on Saturday 14 November 2026, 3pm to 5pm. Rs 2,000 for professionals, Rs 1,000 for students."
            width={1122}
            height={1910}
            priority
            onError={() => setOpen(false)}
            className="h-auto w-full"
          />
        </a>

        <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-gray-100 bg-white p-4">
          <p className="flex items-center gap-1.5 text-sm text-gray-600">
            <CalendarDays className="h-4 w-4 shrink-0 text-secondary-500" aria-hidden />
            Sat 14 Nov · 3–5pm
          </p>
          <a
            href={REGISTER_URL}
            onClick={close}
            className="shrink-0 rounded-full bg-secondary-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-secondary-600"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
}
