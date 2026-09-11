import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { AuthForm } from "@/components/learn/AuthForm";
import { registerAction } from "@/lib/lms/actions";
import { getCurrentUser } from "@/lib/lms/auth";

export const metadata: Metadata = {
  title: "Create Your Learning Account",
  description:
    "Create a free Hunarsaaz account to enrol in vocational courses and track your progress.",
  robots: { index: false, follow: false },
};

export default async function RegisterPage({
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
        <h1 className="font-display text-2xl font-bold text-primary-900">Create your account</h1>
        <p className="mt-2 text-sm text-gray-600">
          Free to join. Enrol in a course and pick up where you left off, on any device.
        </p>

        <div className="mt-6">
          <AuthForm
            action={registerAction}
            submitLabel="Create account"
            next={next}
            fields={[
              { name: "name", label: "Full name", required: true, autoComplete: "name" },
              { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
              {
                name: "password",
                label: "Password",
                type: "password",
                required: true,
                autoComplete: "new-password",
                hint: "At least 8 characters.",
              },
              { name: "phone", label: "Phone (optional)", type: "tel", autoComplete: "tel" },
              { name: "city", label: "City (optional)", autoComplete: "address-level2" },
            ]}
          />
        </div>

        <p className="mt-6 text-sm text-gray-600">
          Already registered?{" "}
          <Link href="/learn/login" className="font-semibold text-primary-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </Container>
  );
}
