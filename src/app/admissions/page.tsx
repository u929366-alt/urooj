import type { Metadata } from "next";
import { FileCheck2, ListChecks, Wallet, HelpCircle } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AdmissionForm } from "@/components/forms/AdmissionForm";

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "Apply to Hunarsaaz's vocational training programs in Taxila. Learn about required documents, the admission process, fee structure, and scholarships.",
};

const requiredDocuments = [
  "Copy of CNIC / B-Form",
  "2 recent passport-size photographs",
  "Copy of last educational certificate (if applicable)",
  "Proof of residence (utility bill or similar)",
  "Income certificate (for scholarship applicants)",
];

const admissionSteps = [
  { step: "1", title: "Submit Application", description: "Complete the online form below or visit our campus." },
  { step: "2", title: "Eligibility Interview", description: "A short interview to understand your goals and confirm eligibility." },
  { step: "3", title: "Document Verification", description: "Submit required documents for verification." },
  { step: "4", title: "Batch Assignment", description: "Get assigned to the next available batch for your program." },
  { step: "5", title: "Orientation & Start", description: "Attend orientation day and begin your training." },
];

const faqs = [
  { question: "Is there an application fee?", answer: "No, applying to Hunarsaaz is completely free." },
  { question: "How long does the admission process take?", answer: "Typically 3-5 business days from application to batch confirmation." },
  { question: "Can I apply for more than one program?", answer: "Yes, but we recommend focusing on one program at a time for the best learning outcomes." },
  { question: "What if I can't afford the program fee?", answer: "Most programs are heavily subsidized, and scholarships are available — mention this in your application." },
];

export default async function AdmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ program?: string }>;
}) {
  const { program } = await searchParams;

  return (
    <>
      <PageHero
        breadcrumb="Admissions"
        eyebrow="Join Hunarsaaz"
        title="Start Your Application Today"
        description="Applying is free, straightforward, and the first step toward a new skill and career."
      />

      <section className="py-12">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Card className="p-6">
              <ListChecks className="h-7 w-7 text-primary-600" />
              <h2 className="mt-3 font-semibold text-primary-900">Admission Process</h2>
              <ol className="mt-3 space-y-3">
                {admissionSteps.map((s) => (
                  <li key={s.step} className="flex gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                      {s.step}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800">{s.title}</p>
                      <p className="text-gray-500">{s.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
            <Card className="p-6">
              <FileCheck2 className="h-7 w-7 text-secondary-600" />
              <h2 className="mt-3 font-semibold text-primary-900">Required Documents</h2>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                {requiredDocuments.map((doc) => (
                  <li key={doc} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary-500" />
                    {doc}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-6">
              <Wallet className="h-7 w-7 text-accent-600" />
              <h2 className="mt-3 font-semibold text-primary-900">Fees & Scholarships</h2>
              <p className="mt-3 text-sm text-gray-600">
                All programs are heavily subsidized (PKR 0 – 6,000). Full scholarships
                are available for women, orphans, and students from
                low-income households — need is assessed during the
                eligibility interview, no separate application required.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      <section className="bg-gray-50 py-12">
        <Container>
          <SectionHeading eyebrow="Apply Now" title="Online Application Form" />
          <Card className="mx-auto mt-10 max-w-3xl p-6 sm:p-10">
            <AdmissionForm defaultProgram={program} />
          </Card>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <SectionHeading eyebrow="Questions" title="Admissions FAQs" />
          <div className="mx-auto mt-10 max-w-2xl space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.question} className="flex gap-3 p-5">
                <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                <div>
                  <h3 className="font-semibold text-primary-900">{faq.question}</h3>
                  <p className="mt-1 text-sm text-gray-600">{faq.answer}</p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
