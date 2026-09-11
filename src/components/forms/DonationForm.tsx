"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Send } from "lucide-react";
import { Label, Input, Select, ErrorText, FieldGroup } from "@/components/forms/Field";
import { Honeypot, HONEYPOT_FIELD } from "@/components/forms/Honeypot";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import { useFormSubmit } from "@/components/forms/useFormSubmit";
import { Button } from "@/components/ui/Button";
import { causes } from "@/data/causes";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  amount: z.coerce.number().positive("Please enter an amount greater than 0"),
  cause: z.string().min(1, "Please select a cause"),
  message: z.string().max(2000).optional(),
});

type FormErrors = Partial<Record<keyof z.infer<typeof schema>, string>>;

const presetAmounts = [1000, 2500, 5000, 10000];

export function DonationForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [amount, setAmount] = useState<number | "">(2500);
  const { status, message, submit } = useFormSubmit("/api/donation");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Held onto now: React nulls currentTarget once the handler returns, so
    // reading it after an await silently throws and skips everything after.
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as keyof FormErrors] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    const result = await submit({ ...parsed.data, [HONEYPOT_FIELD]: data[HONEYPOT_FIELD] });
    if (!result) return;
    form.reset();

    // The server allocates the reference; send the donor straight to the
    // instructions page that shows it.
    const redirectTo = typeof result.redirectTo === "string" ? result.redirectTo : null;
    if (redirectTo) router.push(redirectTo);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {status !== "idle" && status !== "submitting" && (
        <FormStatusBanner status={status} message={message} />
      )}
      <Honeypot />
      <FieldGroup>
        <Label htmlFor="d-cause" required>Donation Cause</Label>
        <Select id="d-cause" name="cause" defaultValue="general-fund">
          {causes.map((c) => (
            <option key={c.slug} value={c.slug}>{c.title}</option>
          ))}
        </Select>
        <ErrorText>{errors.cause}</ErrorText>
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="d-amount" required>Amount (PKR)</Label>
        <div className="mb-2 flex flex-wrap gap-2">
          {presetAmounts.map((preset) => (
            <button
              type="button"
              key={preset}
              onClick={() => setAmount(preset)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                amount === preset
                  ? "border-secondary-500 bg-secondary-50 text-secondary-700"
                  : "border-gray-200 text-gray-600 hover:border-secondary-300"
              }`}
            >
              {preset.toLocaleString()}
            </button>
          ))}
        </div>
        <Input
          id="d-amount"
          name="amount"
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder="Enter custom amount"
        />
        <ErrorText>{errors.amount}</ErrorText>
      </FieldGroup>

      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="d-name" required>Full Name</Label>
          <Input id="d-name" name="name" placeholder="Your full name" />
          <ErrorText>{errors.name}</ErrorText>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="d-email" required>Email Address</Label>
          <Input id="d-email" name="email" type="email" placeholder="you@example.com" />
          <ErrorText>{errors.email}</ErrorText>
        </FieldGroup>
      </div>

      <FieldGroup>
        <Label htmlFor="d-phone">Phone Number</Label>
        <Input id="d-phone" name="phone" type="tel" placeholder="+92 300 1234567" />
      </FieldGroup>

      <FieldGroup>
        <Label htmlFor="d-message">Message (optional)</Label>
        <Input id="d-message" name="message" placeholder="In memory of…, or a note for our team" />
        <ErrorText>{errors.message}</ErrorText>
      </FieldGroup>

      <Button type="submit" disabled={status === "submitting"} className="w-full">
        <Send className="h-4 w-4" />
        {status === "submitting" ? "Please wait…" : "Continue to payment details"}
      </Button>
      <p className="mt-3 text-center text-xs text-gray-500">
        Donations are made by bank transfer. The next page gives you our account
        details and a reference to quote, which we also email to you.
      </p>
    </form>
  );
}
