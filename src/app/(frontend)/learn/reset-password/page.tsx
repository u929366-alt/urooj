import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ResetPasswordForm } from "@/components/learn/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-primary-900">
          Choose a new password
        </h1>

        {token ? (
          <>
            <p className="mt-2 text-sm text-gray-600">
              Pick something you have not used elsewhere, at least 8 characters long.
            </p>
            <div className="mt-6">
              <ResetPasswordForm token={token} />
            </div>
          </>
        ) : (
          <>
            <p className="mt-3 text-sm text-gray-600">
              This link is missing its security code, so it cannot be used. Reset links
              only work once and expire after an hour.
            </p>
            <Link
              href="/learn/forgot-password"
              className="mt-6 inline-block rounded-full bg-secondary-500 px-6 py-3 font-semibold text-white hover:bg-secondary-600"
            >
              Request a new link
            </Link>
          </>
        )}
      </div>
    </Container>
  );
}
