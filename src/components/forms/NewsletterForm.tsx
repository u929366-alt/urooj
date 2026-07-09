"use client";

import { FormEvent, useState } from "react";
import { z } from "zod";
import { Send } from "lucide-react";
import { Honeypot, HONEYPOT_FIELD } from "@/components/forms/Honeypot";
import { useFormSubmit } from "@/components/forms/useFormSubmit";

const schema = z.object({ email: z.string().email("Please enter a valid email address") });

export function NewsletterForm({ className }: { className?: string }) {
  const [error, setError] = useState("");
  const { status, message, submit } = useFormSubmit("/api/newsletter");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }
    setError("");
    const ok = await submit({ ...parsed.data, [HONEYPOT_FIELD]: data[HONEYPOT_FIELD] });
    if (ok) e.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={className}>
      <Honeypot name="companyWebsiteNewsletter" />
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="Enter your email"
          className="w-full rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-primary-200 focus:border-secondary-400 focus:outline-none focus:ring-2 focus:ring-secondary-400"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-secondary-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-secondary-600 disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          {status === "submitting" ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
      {error && <p className="mt-2 text-xs font-medium text-secondary-200">{error}</p>}
      {status === "success" && <p className="mt-2 text-xs font-medium text-accent-300">{message}</p>}
      {status === "error" && <p className="mt-2 text-xs font-medium text-secondary-200">{message}</p>}
    </form>
  );
}
