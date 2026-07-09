"use client";

import { FormEvent, useState } from "react";
import { z } from "zod";
import { Send } from "lucide-react";
import { Label, Input, Textarea, ErrorText, FieldGroup } from "@/components/forms/Field";
import { Honeypot, HONEYPOT_FIELD } from "@/components/forms/Honeypot";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import { useFormSubmit } from "@/components/forms/useFormSubmit";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Please enter a subject"),
  message: z.string().min(10, "Message should be at least 10 characters"),
});

type FormErrors = Partial<Record<keyof z.infer<typeof schema>, string>>;

export function ContactForm() {
  const [errors, setErrors] = useState<FormErrors>({});
  const { status, message, submit } = useFormSubmit("/api/contact");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as keyof FormErrors] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    const ok = await submit({ ...parsed.data, [HONEYPOT_FIELD]: data[HONEYPOT_FIELD] });
    if (ok) e.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {status !== "idle" && status !== "submitting" && (
        <FormStatusBanner status={status} message={message} />
      )}
      <Honeypot />
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="name" required>
            Full Name
          </Label>
          <Input id="name" name="name" placeholder="Your full name" />
          <ErrorText>{errors.name}</ErrorText>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="email" required>
            Email Address
          </Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" />
          <ErrorText>{errors.email}</ErrorText>
        </FieldGroup>
      </div>
      <FieldGroup>
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" name="phone" type="tel" placeholder="+92 300 1234567" />
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="subject" required>
          Subject
        </Label>
        <Input id="subject" name="subject" placeholder="How can we help?" />
        <ErrorText>{errors.subject}</ErrorText>
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="message" required>
          Message
        </Label>
        <Textarea id="message" name="message" rows={5} placeholder="Write your message..." />
        <ErrorText>{errors.message}</ErrorText>
      </FieldGroup>
      <Button type="submit" disabled={status === "submitting"} className="w-full sm:w-auto">
        <Send className="h-4 w-4" />
        {status === "submitting" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
