"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { resetPasswordAction, type FormState } from "@/lib/lms/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-secondary-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-secondary-600 disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save new password"}
    </button>
  );
}

/** The reset token travels in a hidden field, so it is never typed by hand. */
export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction] = useActionState<FormState, FormData>(resetPasswordAction, null);

  const fields = [
    { name: "password", label: "New password", autoComplete: "new-password" },
    { name: "confirmPassword", label: "Confirm new password", autoComplete: "new-password" },
  ];

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="token" value={token} />

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
            </label>
            <input
              id={field.name}
              name={field.name}
              type="password"
              required
              autoComplete={field.autoComplete}
              aria-invalid={fieldError ? true : undefined}
              aria-describedby={fieldError ? errorId : undefined}
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
            {fieldError && (
              <p id={errorId} role="alert" className="mt-1 text-sm text-red-700">
                {fieldError}
              </p>
            )}
          </div>
        );
      })}

      <SubmitButton />
    </form>
  );
}
