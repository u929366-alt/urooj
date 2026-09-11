"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { FormState } from "@/lib/lms/actions";

type Field = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-secondary-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-secondary-600 disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? "Please wait…" : label}
    </button>
  );
}

export function AuthForm({
  action,
  fields,
  submitLabel,
  next,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  fields: Field[];
  submitLabel: string;
  next?: string;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(action, null);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {next && <input type="hidden" name="next" value={next} />}

      {state?.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      {fields.map((field) => {
        const fieldError = state?.fieldErrors?.[field.name];
        const errorId = `${field.name}-error`;
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-semibold text-gray-800">
              {field.label}
              {field.required && <span className="ml-1 text-red-600">*</span>}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type ?? "text"}
              required={field.required}
              autoComplete={field.autoComplete}
              aria-invalid={fieldError ? true : undefined}
              aria-describedby={fieldError ? errorId : undefined}
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
            {field.hint && !fieldError && (
              <p className="mt-1 text-xs text-gray-500">{field.hint}</p>
            )}
            {fieldError && (
              <p id={errorId} role="alert" className="mt-1 text-sm text-red-700">
                {fieldError}
              </p>
            )}
          </div>
        );
      })}

      <SubmitButton label={submitLabel} />
    </form>
  );
}
