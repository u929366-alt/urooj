"use client";

import { FormEvent, useState } from "react";
import { z } from "zod";
import { Send } from "lucide-react";
import { Label, Input, Textarea, Select, ErrorText, FieldGroup } from "@/components/forms/Field";
import { Honeypot, HONEYPOT_FIELD } from "@/components/forms/Honeypot";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import { useFormSubmit } from "@/components/forms/useFormSubmit";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  city: z.string().min(2, "Please enter your city"),
  interest: z.string().min(1, "Please select an area of interest"),
  availability: z.string().min(1, "Please select your availability"),
  motivation: z.string().min(10, "Please share a little more (10+ characters)"),
});

type FormErrors = Partial<Record<keyof z.infer<typeof schema>, string>>;

export function VolunteerForm() {
  const [errors, setErrors] = useState<FormErrors>({});
  const { status, message, submit } = useFormSubmit("/api/volunteer");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as keyof FormErrors] = issue.message;
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
          <Label htmlFor="v-name" required>Full Name</Label>
          <Input id="v-name" name="name" placeholder="Your full name" />
          <ErrorText>{errors.name}</ErrorText>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="v-email" required>Email Address</Label>
          <Input id="v-email" name="email" type="email" placeholder="you@example.com" />
          <ErrorText>{errors.email}</ErrorText>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="v-phone" required>Phone Number</Label>
          <Input id="v-phone" name="phone" type="tel" placeholder="+92 300 1234567" />
          <ErrorText>{errors.phone}</ErrorText>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="v-city" required>City</Label>
          <Input id="v-city" name="city" placeholder="Taxila" />
          <ErrorText>{errors.city}</ErrorText>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="v-interest" required>Area of Interest</Label>
          <Select id="v-interest" name="interest" defaultValue="">
            <option value="" disabled>Select an area</option>
            <option>Teaching / Training</option>
            <option>Mentorship</option>
            <option>Event Support</option>
            <option>Fundraising</option>
            <option>Marketing & Social Media</option>
            <option>Administrative Support</option>
          </Select>
          <ErrorText>{errors.interest}</ErrorText>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="v-availability" required>Availability</Label>
          <Select id="v-availability" name="availability" defaultValue="">
            <option value="" disabled>Select availability</option>
            <option>Weekdays</option>
            <option>Weekends</option>
            <option>Evenings</option>
            <option>Flexible</option>
          </Select>
          <ErrorText>{errors.availability}</ErrorText>
        </FieldGroup>
      </div>
      <FieldGroup>
        <Label htmlFor="v-motivation" required>Why do you want to volunteer with Hunarsaaz?</Label>
        <Textarea id="v-motivation" name="motivation" rows={4} placeholder="Tell us a bit about yourself..." />
        <ErrorText>{errors.motivation}</ErrorText>
      </FieldGroup>
      <Button type="submit" disabled={status === "submitting"} className="w-full sm:w-auto">
        <Send className="h-4 w-4" />
        {status === "submitting" ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}
