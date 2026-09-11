import type { Metadata } from "next";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { AuthForm } from "@/components/learn/AuthForm";
import { forgotPasswordAction } from "@/lib/lms/actions";

export const metadata: Metadata = {
  title: "Reset your password",
  robots: { index: false, follow: false },
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        {sent ? (
          <>
            <MailCheck className="h-10 w-10 text-accent-500" aria-hidden />
            <h1 className="mt-4 font-display text-2xl font-bold text-primary-900">
              Check your email
            </h1>
            <p className="mt-3 text-sm text-gray-600">
              If an account exists for that address, we have sent a link to choose a new
              password. It expires in one hour.
            </p>
            <p className="mt-3 text-sm text-gray-600">
              Nothing arrived? Check your spam folder, or{" "}
              <Link href="/learn/forgot-password" className="font-semibold text-primary-600 hover:underline">
                try again
              </Link>
              .
            </p>
            <Link
              href="/learn/login"
              className="mt-6 inline-block text-sm font-semibold text-primary-600 hover:underline"
            >
              ← Back to sign in
            </Link>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-bold text-primary-900">
              Forgotten your password?
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter the email address you registered with and we will send you a link to
              choose a new password.
            </p>

            <div className="mt-6">
              <AuthForm
                action={forgotPasswordAction}
                submitLabel="Send reset link"
                fields={[
                  {
                    name: "email",
                    label: "Email",
                    type: "email",
                    required: true,
                    autoComplete: "email",
                  },
                ]}
              />
            </div>

            <p className="mt-6 text-sm text-gray-600">
              Remembered it?{" "}
              <Link href="/learn/login" className="font-semibold text-primary-600 hover:underline">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </Container>
  );
}
