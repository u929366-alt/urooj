"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site";
import { HONEYPOT_FIELD } from "@/components/forms/Honeypot";

type Status = "idle" | "submitting" | "success" | "error";

// When built for static hosting (no server to receive submissions),
// forms hand the visitor over to WhatsApp with a pre-filled message.
const STATIC_FORMS = process.env.NEXT_PUBLIC_STATIC_FORMS === "1";

const FORM_LABELS: Record<string, string> = {
  "/api/contact": "Contact message",
  "/api/admission": "Admission application",
  "/api/donation": "Donation pledge",
  "/api/volunteer": "Volunteer application",
  "/api/newsletter": "Newsletter signup",
};

const FIELD_LABELS: Record<string, string> = {
  fullName: "Name",
  name: "Name",
  fatherName: "Father's name",
  cnic: "CNIC / B-Form",
  dateOfBirth: "Date of birth",
  gender: "Gender",
  email: "Email",
  phone: "Phone",
  address: "Address",
  education: "Education",
  program: "Program",
  subject: "Subject",
  message: "Message",
  amount: "Amount (PKR)",
  cause: "Cause",
  method: "Payment method",
  interest: "Area of interest",
  availability: "Availability",
  motivation: "Motivation",
};

function buildWhatsAppUrl(endpoint: string, data: Record<string, unknown>) {
  const lines = [`*${FORM_LABELS[endpoint] ?? "Form submission"} — hunarsaaz.pk*`];
  for (const [key, value] of Object.entries(data)) {
    if (key === HONEYPOT_FIELD || value === undefined || value === null) continue;
    const text = String(value).trim();
    if (!text) continue;
    lines.push(`${FIELD_LABELS[key] ?? key}: ${text}`);
  }
  const number = siteConfig.whatsapp.replace(/[^\d]/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function useFormSubmit(endpoint: string) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  async function submit(data: Record<string, unknown>) {
    setStatus("submitting");
    setMessage("");

    if (STATIC_FORMS) {
      if (String(data[HONEYPOT_FIELD] ?? "").trim()) {
        setStatus("success");
        setMessage("Thank you!");
        return true;
      }
      window.open(buildWhatsAppUrl(endpoint, data), "_blank", "noopener");
      setStatus("success");
      setMessage(
        "We've opened WhatsApp with your details — press Send there to complete your submission. If WhatsApp didn't open, message us directly at " +
          siteConfig.phone +
          "."
      );
      return true;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(body.message ?? "Something went wrong. Please try again.");
        return false;
      }
      setStatus("success");
      setMessage(body.message ?? "Thank you! We received your submission.");
      return true;
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
      return false;
    }
  }

  return { status, message, submit, reset: () => setStatus("idle") };
}
