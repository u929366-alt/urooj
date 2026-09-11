"use server";

import { headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { confirmPayment } from "./payments";
import type { User } from "@/payload-types";

/**
 * Mark a transfer as received.
 *
 * Restricted to staff, and the check is here rather than only in the UI —
 * hiding the button would not stop anyone posting the form directly.
 */
export async function confirmPaymentAction(formData: FormData) {
  const payload = await getPayload({ config });
  const requestHeaders = await nextHeaders();
  const { user } = await payload.auth({ headers: requestHeaders });
  const staff = (user as User | null) ?? null;

  if (!staff) redirect("/learn/login?next=%2Flearn%2Ffinance");
  if (staff.role !== "admin" && staff.role !== "instructor") redirect("/learn");

  const reference = String(formData.get("reference") || "");
  const bankReference = String(formData.get("bankReference") || "").trim();
  if (!reference) redirect("/learn/finance");

  await confirmPayment(reference, staff, bankReference || undefined);

  revalidatePath("/learn/finance");
  redirect("/learn/finance?confirmed=1");
}

/** Cancel a payment that will never arrive, freeing the record from the queue. */
export async function cancelPaymentAction(formData: FormData) {
  const payload = await getPayload({ config });
  const requestHeaders = await nextHeaders();
  const { user } = await payload.auth({ headers: requestHeaders });
  const staff = (user as User | null) ?? null;

  if (!staff) redirect("/learn/login?next=%2Flearn%2Ffinance");
  if (staff.role !== "admin" && staff.role !== "instructor") redirect("/learn");

  const reference = String(formData.get("reference") || "");
  if (!reference) redirect("/learn/finance");

  const found = await payload.find({
    collection: "payments",
    where: { reference: { equals: reference } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  const payment = found.docs[0];
  // A confirmed payment is a financial record; cancelling it would rewrite
  // history, so only a pending one can be cancelled.
  if (!payment || payment.status !== "pending") redirect("/learn/finance");

  await payload.update({
    collection: "payments",
    id: payment.id,
    overrideAccess: true,
    data: { status: "cancelled" },
  });

  revalidatePath("/learn/finance");
  redirect("/learn/finance?cancelled=1");
}
