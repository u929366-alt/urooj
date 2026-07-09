import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProgramCard } from "@/components/ProgramCard";
import { programs } from "@/data/programs";

export function ProgramsPreview() {
  const featured = programs.slice(0, 8);

  return (
    <section className="bg-gray-50 py-20">
      <Container>
        <SectionHeading
          eyebrow="Our Programs"
          title="Skills Training for Real Careers"
          description="16 industry-relevant programs across technology, creative, trade, and life skills — designed with employer input."
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((program) => (
            <ProgramCard key={program.slug} program={program} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button href="/programs" variant="outline">
            View All Programs
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Container>
    </section>
  );
}
