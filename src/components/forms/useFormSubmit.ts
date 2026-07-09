"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function useFormSubmit(endpoint: string) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  async function submit(data: Record<string, unknown>) {
    setStatus("submitting");
    setMessage("");
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
