import { Container } from "@/components/ui/Container";
import { partners } from "@/data/partners";

export function PartnersMarquee() {
  return (
    <section className="border-y border-gray-100 py-12">
      <Container>
        <p className="text-center text-sm font-semibold uppercase tracking-wide text-gray-400">
          Our Partners & Sponsors
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-6">
          {partners.map((partner) => (
            <span
              key={partner}
              className="flex items-center rounded-xl border border-gray-100 px-6 py-3 text-sm font-semibold text-gray-500"
            >
              {partner}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
