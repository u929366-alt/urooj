import type { Metadata } from "next";
import { GraduationCap, Users, Megaphone, HandHeart, Heart, ClipboardList, Clock3 } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VolunteerForm } from "@/components/forms/VolunteerForm";

export const metadata: Metadata = {
  title: "Volunteer",
  description:
    "Give your time and skills to Hunarsaaz. Explore volunteer opportunities in teaching, mentorship, events, and fundraising in Taxila, Punjab.",
};

const opportunities = [
  { icon: GraduationCap, title: "Teaching & Training", description: "Lead or co-teach sessions in your area of expertise." },
  { icon: Users, title: "Mentorship", description: "Guide students and recent graduates in career planning." },
  { icon: Megaphone, title: "Marketing & Outreach", description: "Help us tell our story on social media and in the community." },
  { icon: HandHeart, title: "Event Support", description: "Support graduation ceremonies, workshops, and fundraisers." },
];

const benefits = [
  "Certificate of volunteer service",
  "Hands-on community development experience",
  "Networking with NGO and industry professionals",
  "Flexible scheduling around your availability",
];

const requirements = [
  "Minimum 3-month commitment preferred",
  "Relevant skill or willingness to learn to teach",
  "Reliable communication (WhatsApp/email)",
  "Passion for community development",
];

export default function VolunteerPage() {
  return (
    <>
      <PageHero
        breadcrumb="Volunteer"
        eyebrow="Give Your Time"
        title="Become a Hunarsaaz Volunteer"
        description="Share your skills and time to help train the next generation of skilled professionals in Taxila."
      />

      <section className="py-16">
        <Container>
          <SectionHeading eyebrow="Ways to Help" title="Volunteer Opportunities" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {opportunities.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-semibold text-primary-900">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">{description}</p>
              </Card>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Card className="p-6">
              <Heart className="h-7 w-7 text-secondary-600" />
              <h3 className="mt-3 font-semibold text-primary-900">Benefits</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary-500" /> {b}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-6">
              <ClipboardList className="h-7 w-7 text-primary-600" />
              <h3 className="mt-3 font-semibold text-primary-900">Requirements</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                {requirements.map((r) => (
                  <li key={r} className="flex items-start gap-2">
                    <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" /> {r}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Container>
      </section>

      <section className="bg-gray-50 py-16">
        <Container>
          <SectionHeading eyebrow="Apply Now" title="Volunteer Registration Form" />
          <Card className="mx-auto mt-10 max-w-3xl p-6 sm:p-10">
            <VolunteerForm />
          </Card>
        </Container>
      </section>
    </>
  );
}
