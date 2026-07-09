import { GraduationCap, HeartHandshake, HandCoins, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const ctas = [
  {
    icon: GraduationCap,
    title: "Become a Student",
    description: "Apply for one of our 16 vocational programs and start building your future.",
    cta: "Apply Now",
    href: "/admissions",
  },
  {
    icon: HeartHandshake,
    title: "Become a Volunteer",
    description: "Share your time and expertise to mentor and teach the next generation.",
    cta: "Volunteer With Us",
    href: "/volunteer",
  },
  {
    icon: HandCoins,
    title: "Become a Donor",
    description: "Your contribution directly funds scholarships, labs, and student support.",
    cta: "Donate Today",
    href: "/donate",
  },
];

export function CTASection() {
  return (
    <section className="bg-secondary-500 py-20">
      <Container>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Join the Hunarsaaz Community
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-secondary-50">
            There are many ways to be part of transforming lives through skills.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {ctas.map(({ icon: Icon, title, description, cta, href }) => (
            <div key={title} className="rounded-2xl bg-white p-6 text-center shadow-xl">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-50 text-secondary-600">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-semibold text-primary-900">{title}</h3>
              <p className="mt-2 text-sm text-gray-600">{description}</p>
              <Button href={href} variant="secondary" size="sm" className="mt-5 w-full">
                {cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
