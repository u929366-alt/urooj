import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PaymentInstructions } from "@/components/learn/PaymentInstructions";
import { getCurrentUser, isStaff } from "@/lib/lms/auth";
import { getPaymentByReference } from "@/lib/lms/payments";
import type { Course } from "@/payload-types";

export const metadata: Metadata = {
  title: "Complete your payment",
  robots: { index: false, follow: false },
};

export default async function PayPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const payment = await getPaymentByReference(reference);
  if (!payment) notFound();

  // A course payment belongs to a signed-in student, so it is only shown to
  // them or to staff. Donations are made by people with no account, so their
  // page is reachable by anyone holding the reference — it shows nothing the
  // payer did not just type in themselves.
  if (payment.purpose === "course") {
    const user = await getCurrentUser();
    if (!user) redirect(`/learn/login?next=${encodeURIComponent(`/learn/pay/${reference}`)}`);
    const payerId =
      typeof payment.payer === "object" && payment.payer ? payment.payer.id : payment.payer;
    if (String(payerId) !== String(user.id) && !isStaff(user)) notFound();
  }

  const course =
    typeof payment.course === "object" && payment.course ? (payment.course as Course) : null;

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-xl">
        {course && (
          <Link
            href={`/learn/courses/${course.slug}`}
            className="text-sm font-semibold text-primary-600 hover:underline"
          >
            ← {course.title}
          </Link>
        )}
        <h1 className="mt-3 font-display text-3xl font-bold text-primary-900">
          {payment.purpose === "course" ? "Secure your place" : "Complete your donation"}
        </h1>

        <div className="mt-6">
          <PaymentInstructions payment={payment} />
        </div>

        {payment.purpose === "course" && payment.status === "pending" && (
          <p className="mt-6 text-sm text-gray-600">
            Your place is held in the meantime — you can see it on{" "}
            <Link href="/learn" className="font-semibold text-primary-600 hover:underline">
              My Learning
            </Link>
            .
          </p>
        )}
      </div>
    </Container>
  );
}
