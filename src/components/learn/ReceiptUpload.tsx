"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Upload } from "lucide-react";
import { uploadReceiptAction, type ReceiptState } from "@/lib/lms/receiptActions";

function Submit({ chosen }: { chosen: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || !chosen}
      className="w-full rounded-full bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700 disabled:pointer-events-none disabled:opacity-50"
    >
      {pending ? "Sending…" : "Send the receipt"}
    </button>
  );
}

/**
 * Sending in a bank transfer receipt.
 *
 * Shown straight after registering, and again on its own page from the link in
 * the confirmation email — people pay later, so they have to be able to come
 * back to this without an account.
 */
export function ReceiptUpload({
  reference,
  compact = false,
}: {
  reference: string;
  compact?: boolean;
}) {
  const [state, action] = useActionState<ReceiptState, FormData>(uploadReceiptAction, null);
  const [chosen, setChosen] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  if (state && "success" in state) {
    return (
      <div className="rounded-xl border border-accent-200 bg-accent-50 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" aria-hidden />
          <div>
            <p className="font-semibold text-primary-900">Receipt received</p>
            <p className="mt-1 text-sm text-gray-700">
              We will check it against the bank and email you to confirm your place. Nothing else
              is needed from you.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className={compact ? "" : "space-y-4"}>
      <input type="hidden" name="reference" value={reference} />

      {!compact && (
        <p className="text-sm text-gray-700">
          Already transferred the fee? Attach the receipt and we will confirm your place.
        </p>
      )}

      {state && "error" in state && (
        <p className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}

      <label
        htmlFor={`receipt-${reference}`}
        className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-5 text-center text-sm font-medium text-gray-600 hover:border-primary-400 hover:bg-primary-50/50"
      >
        <Upload className="h-4 w-4 shrink-0" aria-hidden />
        {chosen ?? "Choose a screenshot, photo or PDF"}
      </label>
      <input
        ref={input}
        id={`receipt-${reference}`}
        name="file"
        type="file"
        accept="image/*,application/pdf"
        className="sr-only"
        onChange={(event) => setChosen(event.target.files?.[0]?.name ?? null)}
      />

      <p className="mt-2 text-xs text-gray-500">
        A photo of the transfer slip, a screenshot from your banking app, or the bank&apos;s PDF.
        Up to 8 MB.
      </p>

      <div className="mt-3">
        <Submit chosen={Boolean(chosen)} />
      </div>
    </form>
  );
}
