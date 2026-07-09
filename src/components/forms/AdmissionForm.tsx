"use client";

import { FormEvent, useState } from "react";
import { z } from "zod";
import { Send } from "lucide-react";
import { Label, Input, Textarea, Select, ErrorText, FieldGroup } from "@/components/forms/Field";
import { Honeypot, HONEYPOT_FIELD } from "@/components/forms/Honeypot";
import { FormStatusBanner } from "@/components/forms/FormStatusBanner";
import { useFormSubmit } from "@/components/forms/useFormSubmit";
import { Button } from "@/components/ui/Button";
import { programs } from "@/data/programs";

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  fatherName: z.string().min(2, "Please enter your father's name"),
  cnic: z.string().min(5, "Please enter a valid CNIC / B-Form number"),
  dateOfBirth: z.string().min(2, "Please enter your date of birth"),
  gender: z.enum(["male", "female", "other"], { message: "Please select a gender" }),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter your address"),
  education: z.string().min(1, "Please select your education level"),
  program: z.string().min(1, "Please select a program"),
  message: z.string().optional(),
});

type FormErrors = Partial<Record<keyof z.infer<typeof schema>, string>>;

export function AdmissionForm({ defaultProgram }: { defaultProgram?: string }) {
  const [errors, setErrors] = useState<FormErrors>({});
  const { status, message, submit } = useFormSubmit("/api/admission");

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

      <h3 className="mb-4 font-display text-lg font-semibold text-primary-900">
        Personal Information
      </h3>
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="a-fullName" required>Full Name</Label>
          <Input id="a-fullName" name="fullName" placeholder="As per CNIC / B-Form" />
          <ErrorText>{errors.fullName}</ErrorText>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="a-fatherName" required>Father&apos;s Name</Label>
          <Input id="a-fatherName" name="fatherName" placeholder="Father's full name" />
          <ErrorText>{errors.fatherName}</ErrorText>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="a-cnic" required>CNIC / B-Form Number</Label>
          <Input id="a-cnic" name="cnic" placeholder="XXXXX-XXXXXXX-X" />
          <ErrorText>{errors.cnic}</ErrorText>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="a-dob" required>Date of Birth</Label>
          <Input id="a-dob" name="dateOfBirth" type="date" />
          <ErrorText>{errors.dateOfBirth}</ErrorText>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="a-gender" required>Gender</Label>
          <Select id="a-gender" name="gender" defaultValue="">
            <option value="" disabled>Select gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </Select>
          <ErrorText>{errors.gender}</ErrorText>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="a-education" required>Highest Education Level</Label>
          <Select id="a-education" name="education" defaultValue="">
            <option value="" disabled>Select education level</option>
            <option>No formal education</option>
            <option>Primary</option>
            <option>Middle</option>
            <option>Matric</option>
            <option>Intermediate</option>
            <option>Bachelor&apos;s or higher</option>
          </Select>
          <ErrorText>{errors.education}</ErrorText>
        </FieldGroup>
      </div>

      <h3 className="mb-4 mt-6 font-display text-lg font-semibold text-primary-900">
        Contact Information
      </h3>
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
        <FieldGroup>
          <Label htmlFor="a-email" required>Email Address</Label>
          <Input id="a-email" name="email" type="email" placeholder="you@example.com" />
          <ErrorText>{errors.email}</ErrorText>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="a-phone" required>Phone Number</Label>
          <Input id="a-phone" name="phone" type="tel" placeholder="+92 300 1234567" />
          <ErrorText>{errors.phone}</ErrorText>
        </FieldGroup>
      </div>
      <FieldGroup>
        <Label htmlFor="a-address" required>Home Address</Label>
        <Input id="a-address" name="address" placeholder="House #, Street, Area, City" />
        <ErrorText>{errors.address}</ErrorText>
      </FieldGroup>

      <h3 className="mb-4 mt-6 font-display text-lg font-semibold text-primary-900">
        Program Selection
      </h3>
      <FieldGroup>
        <Label htmlFor="a-program" required>Choose a Program</Label>
        <Select id="a-program" name="program" defaultValue={defaultProgram ?? ""}>
          <option value="" disabled>Select a program</option>
          {programs.map((p) => (
            <option key={p.slug} value={p.slug}>{p.title}</option>
          ))}
        </Select>
        <ErrorText>{errors.program}</ErrorText>
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="a-message">Anything else we should know?</Label>
        <Textarea id="a-message" name="message" rows={4} placeholder="Optional message" />
      </FieldGroup>

      <Button type="submit" disabled={status === "submitting"} className="w-full">
        <Send className="h-4 w-4" />
        {status === "submitting" ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}
