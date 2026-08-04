"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

// Bump this key whenever the flyer image changes so returning visitors
// who dismissed the previous one see the new announcement.
const SEEN_KEY = "hs-promo-2026-08-computer-basic";

export function PromoModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return;
    const t = setTimeout(() => setOpen(true), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    sessionStorage.setItem(SEEN_KEY, "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Admissions announcement"
      onClick={close}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close announcement"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
        >
          <X className="h-5 w-5" />
        </button>
        <Link href="/admissions" onClick={close} className="block">
          <Image
            src="/promo-flyer.jpg"
            alt="Hunar Saaz — Computer Basic Training. Free course, admissions open till 10 August, classes start 15 August. Apply now."
            width={1024}
            height={1536}
            priority
            onError={() => setOpen(false)}
            className="h-auto w-full"
          />
        </Link>
        <div className="flex items-center justify-between gap-3 border-t border-gray-100 p-4">
          <p className="text-sm text-gray-500">Admissions open — limited seats</p>
          <Link
            href="/admissions"
            onClick={close}
            className="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
}
