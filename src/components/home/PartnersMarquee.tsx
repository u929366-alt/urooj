import { Container } from "@/components/ui/Container";
import { partners } from "@/data/partners";

export function PartnersMarquee() {
  const doubled = [...partners, ...partners];

  return (
    <section className="border-y border-gray-100 py-12">
      <Container>
        <p className="text-center text-sm font-semibold uppercase tracking-wide text-gray-400">
          Our Partners & Sponsors
        </p>
        <div className="relative mt-8 overflow-hidden">
          <div className="flex w-max animate-marquee gap-12">
            {doubled.map((partner, i) => (
              <span
                key={`${partner}-${i}`}
                className="flex items-center whitespace-nowrap rounded-xl border border-gray-100 px-6 py-3 text-sm font-semibold text-gray-500"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
