import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { ProgramsGrid } from "@/components/ProgramsGrid";

export const metadata: Metadata = {
  title: "Training Programs",
  description:
    "Explore all 16 vocational and technical training programs offered by Hunarsaaz in Taxila — from IT and web development to tailoring, electrical work, and entrepreneurship.",
};

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        breadcrumb="Programs"
        eyebrow="Training Programs"
        title="16 Programs. One Goal: Your Future."
        description="Every program is designed with employer input, taught by experienced trainers, and backed by job placement support."
      />
      <section className="py-16">
        <Container>
          <ProgramsGrid />
        </Container>
      </section>
    </>
  );
}
