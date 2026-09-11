import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { AuthForm } from "@/components/learn/AuthForm";
import { loginAction } from "@/lib/lms/actions";
import { getCurrentUser } from "@/lib/lms/auth";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Hunarsaaz learning account to continue your course.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getCurrentUser();
  const { next } = await searchParams;
  if (user) redirect(next?.startsWith("/") ? next : "/learn");

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-primary-900">Sign in</h1>
        <p className="mt-2 text-sm text-gray-600">
          Continue where you left off in your course.
        </p>

        <div className="mt-6">
          <AuthForm
            action={loginAction}
            submitLabel="Sign in"
            next={next}
            fields={[
              { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
              {
                name: "password",
                label: "Password",
                type: "password",
                required: true,
                autoComplete: "current-password",
              },
            ]}
          />
        </div>

        <p className="mt-6 text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/learn/register" className="font-semibold text-primary-600 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </Container>
  );
}
