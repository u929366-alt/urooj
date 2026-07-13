import type { Metadata } from "next";
import { Landmark, CreditCard, GraduationCap } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DonationForm } from "@/components/forms/DonationForm";
import { causes } from "@/data/causes";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support Hunarsaaz's vocational training programs in Taxila. Sponsor a student, fund a cause, or donate via bank transfer or card.",
};

export default function DonatePage() {
  return (
    <>
      <PageHero
        breadcrumb="Donate"
        eyebrow="Support Our Mission"
        title="Your Donation Changes a Life"
        description="Every rupee directly funds scholarships, training materials, and equipment for students who could not otherwise afford vocational education."
      />

      <section className="py-12">
        <Container>
          <SectionHeading eyebrow="Where It Goes" title="Donation Causes" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {causes.map((cause) => (
              <Card key={cause.slug} className="p-6">
                <h3 className="font-semibold text-primary-900">{cause.title}</h3>
                <p className="mt-1.5 text-sm text-gray-600">{cause.description}</p>
              </Card>
            ))}
          </div>

          <Card className="mt-10 flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
            <GraduationCap className="h-10 w-10 shrink-0 text-secondary-500" />
            <div>
              <h3 className="font-semibold text-primary-900">Sponsor a Student</h3>
              <p className="mt-1 text-sm text-gray-600">
                For as little as PKR 15,000, you can fully sponsor one student&apos;s
                tuition, materials, and certification for an entire program.
              </p>
            </div>
          </Card>
        </Container>
      </section>

      <section className="bg-gray-50 py-12">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <SectionHeading eyebrow="Give Now" title="Make a Donation" align="left" />
              <Card className="mt-8 p-6 sm:p-8">
                <DonationForm />
              </Card>
            </div>
            <div className="lg:col-span-2">
              <SectionHeading eyebrow="Other Ways to Give" title="Payment Details" align="left" />
              <div className="mt-8 space-y-4">
                <Card className="flex gap-4 p-5">
                  <Landmark className="h-6 w-6 shrink-0 text-primary-600" />
                  <div className="text-sm">
                    <h3 className="font-semibold text-primary-900">Bank Transfer</h3>
                    <p className="mt-1 text-gray-600">{siteConfig.bankDetails.bankName}</p>
                    <p className="text-gray-600">Account Title: {siteConfig.bankDetails.accountTitle}</p>
                    <p className="text-gray-600">IBAN: {siteConfig.bankDetails.iban}</p>
                  </div>
                </Card>
                <Card className="flex gap-4 p-5">
                  <CreditCard className="h-6 w-6 shrink-0 text-accent-600" />
                  <div className="text-sm">
                    <h3 className="font-semibold text-primary-900">Credit / Debit Card & PayPal</h3>
                    <p className="mt-1 text-gray-600">
                      Card and PayPal donations are processed securely after you submit
                      the form — our team will send a payment link.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
