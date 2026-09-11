"use server";

import { cookies, headers as nextHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getPayload } from "payload";
import config from "@payload-config";
import { getCurrentUser } from "./auth";
import { issueCertificateIfComplete } from "./completion";
import { grantsAccess } from "./queries";
import { createPendingPayment, sendPaymentInstructions } from "./payments";

const AUTH_COOKIE = "payload-token";

export type FormState = { error?: string; fieldErrors?: Record<string, string> } | null;

const registerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Use at least 8 characters."),
  phone: z.string().trim().optional(),
  city: z.string().trim().optional(),
});

const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
});

function flatten(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}

/** Store Payload's JWT in an httpOnly cookie so server components can read it. */
async function setAuthCookie(token: string, expiresInSeconds: number) {
  const jar = await cookies();
  jar.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: expiresInSeconds,
  });
}

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone") || undefined,
    city: formData.get("city") || undefined,
  });
  if (!parsed.success) return { fieldErrors: flatten(parsed.error) };

  const payload = await getPayload({ config });
  const { email, password, name, phone, city } = parsed.data;

  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: email.toLowerCase() } },
    limit: 1,
    overrideAccess: true,
  });
  if (existing.totalDocs > 0) {
    return { fieldErrors: { email: "An account with this email already exists." } };
  }

  try {
    // `role` is deliberately not passed: the Users beforeValidate hook forces
    // "student" for anyone not created by an admin.
    await payload.create({
      collection: "users",
      data: { email: email.toLowerCase(), password, name, phone, city, role: "student" },
    });
  } catch {
    return { error: "We could not create your account. Please try again." };
  }

  const result = await payload.login({
    collection: "users",
    data: { email: email.toLowerCase(), password },
  });
  if (result.token) {
    await setAuthCookie(result.token, result.exp ? result.exp - Math.floor(Date.now() / 1000) : 60 * 60 * 24 * 7);
  }

  const next = String(formData.get("next") || "/learn");
  redirect(next.startsWith("/") ? next : "/learn");
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { fieldErrors: flatten(parsed.error) };

  const payload = await getPayload({ config });
  try {
    const result = await payload.login({
      collection: "users",
      data: { email: parsed.data.email.toLowerCase(), password: parsed.data.password },
    });
    if (!result.token) return { error: "Email or password is incorrect." };
    await setAuthCookie(
      result.token,
      result.exp ? result.exp - Math.floor(Date.now() / 1000) : 60 * 60 * 24 * 7,
    );
  } catch {
    // Deliberately vague: do not reveal whether the address exists.
    return { error: "Email or password is incorrect." };
  }

  const next = String(formData.get("next") || "/learn");
  redirect(next.startsWith("/") ? next : "/learn");
}

const forgotSchema = z.object({ email: z.email("Please enter a valid email address.") });

const resetSchema = z
  .object({
    token: z.string().min(1, "This reset link is not valid."),
    password: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The two passwords do not match.",
    path: ["confirmPassword"],
  });

/**
 * Send a reset link.
 *
 * Always reports success, even when no account exists, so the form cannot be
 * used to discover which addresses are registered.
 */
export async function forgotPasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = forgotSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { fieldErrors: flatten(parsed.error) };

  const payload = await getPayload({ config });
  try {
    await payload.forgotPassword({
      collection: "users",
      data: { email: parsed.data.email.toLowerCase() },
      disableEmail: false,
    });
  } catch {
    // Swallowed deliberately — see the note above.
  }

  redirect("/learn/forgot-password?sent=1");
}

export async function resetPasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = resetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { fieldErrors: flatten(parsed.error) };

  const payload = await getPayload({ config });
  let token: string | undefined;
  try {
    const result = await payload.resetPassword({
      collection: "users",
      data: { token: parsed.data.token, password: parsed.data.password },
      overrideAccess: true,
    });
    token = result.token;
  } catch {
    return {
      error:
        "This reset link has expired or has already been used. Please request a new one.",
    };
  }

  // Signed in straight away, so they are not asked to log in again.
  if (token) await setAuthCookie(token, 60 * 60 * 24 * 7);
  redirect("/learn");
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(AUTH_COOKIE);
  redirect("/learn/login");
}

export async function enrollAction(formData: FormData) {
  const user = await getCurrentUser();
  const courseSlug = String(formData.get("courseSlug") || "");
  if (!user) redirect(`/learn/login?next=${encodeURIComponent(`/learn/courses/${courseSlug}`)}`);

  const payload = await getPayload({ config });
  const courseResult = await payload.find({
    collection: "courses",
    where: { slug: { equals: courseSlug } },
    limit: 1,
    overrideAccess: true,
  });
  const course = courseResult.docs[0];
  if (!course || course.status !== "published" || !course.enrollmentOpen) {
    redirect(`/learn/courses/${courseSlug}?error=closed`);
  }

  const existing = await payload.find({
    collection: "enrollments",
    where: {
      and: [{ student: { equals: user.id } }, { course: { equals: course.id } }],
    },
    limit: 1,
    overrideAccess: true,
  });

  // A priced course is held until the fee is confirmed; a free one opens now.
  const price = course.price ?? 0;
  const startingStatus = price > 0 ? "pending_payment" : "active";

  if (existing.docs[0]) {
    if (existing.docs[0].status === "withdrawn") {
      await payload.update({
        collection: "enrollments",
        id: existing.docs[0].id,
        data: { status: startingStatus },
        overrideAccess: true,
      });
    } else if (existing.docs[0].status === "pending_payment") {
      // Already waiting on a transfer — send them back to the instructions
      // rather than raising a second payment for the same place.
      const open = await payload.find({
        collection: "payments",
        where: {
          and: [
            { payer: { equals: user.id } },
            { course: { equals: course.id } },
            { status: { equals: "pending" } },
          ],
        },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      });
      if (open.docs[0]) redirect(`/learn/pay/${open.docs[0].reference}`);
    }
  } else {
    await payload.create({
      collection: "enrollments",
      data: {
        student: user.id,
        course: course.id,
        status: startingStatus,
        enrolledAt: new Date().toISOString(),
      },
      overrideAccess: true,
    });
  }

  if (price > 0) {
    const payment = await createPendingPayment({
      purpose: "course",
      amount: price,
      payerName: user.name,
      payerEmail: user.email,
      payerPhone: user.phone ?? undefined,
      payerId: user.id,
      courseId: course.id,
    });
    await sendPaymentInstructions(payment);
    redirect(`/learn/pay/${payment.reference}`);
  }

  revalidatePath(`/learn/courses/${courseSlug}`);
  revalidatePath("/learn");
  redirect(`/learn/courses/${courseSlug}`);
}

export async function toggleLessonCompleteAction(formData: FormData) {
  const requestHeaders = await nextHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: requestHeaders });
  if (!user) redirect("/learn/login");

  const lessonId = formData.get("lessonId");
  const courseId = formData.get("courseId");
  const completed = formData.get("completed") === "true";
  const returnTo = String(formData.get("returnTo") || "/learn");
  if (!lessonId || !courseId) redirect(returnTo);

  // Only act on a lesson the student can actually reach.
  const enrollment = await payload.find({
    collection: "enrollments",
    where: {
      and: [{ student: { equals: user.id } }, { course: { equals: courseId } }],
    },
    limit: 1,
    overrideAccess: true,
  });
  if (!grantsAccess(enrollment.docs[0])) {
    redirect(returnTo);
  }

  const existing = await payload.find({
    collection: "lesson-progress",
    where: {
      and: [{ student: { equals: user.id } }, { lesson: { equals: lessonId } }],
    },
    limit: 1,
    overrideAccess: true,
  });

  if (existing.docs[0]) {
    await payload.update({
      collection: "lesson-progress",
      id: existing.docs[0].id,
      data: { completed, completedAt: completed ? new Date().toISOString() : null },
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: "lesson-progress",
      data: {
        student: user.id,
        lesson: Number(lessonId),
        course: Number(courseId),
        completed,
        completedAt: completed ? new Date().toISOString() : null,
      },
      overrideAccess: true,
    });
  }

  // Finishing the last lesson closes the enrolment and issues a certificate.
  // Recounted from the database inside, so ticking a lesson cannot fake it.
  if (completed) {
    await issueCertificateIfComplete(user.id, Number(courseId));
  }

  revalidatePath(returnTo);
  revalidatePath("/learn");
  redirect(returnTo);
}
