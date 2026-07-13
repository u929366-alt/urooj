import { Container } from "@/components/ui/Container";
import { partners } from "@/data/partners";

export function PartnersMarquee() {
  // the marquee loops by sliding -50%, so the track must hold the same
  // sequence twice; repeat a short partner list until the row fills the screen
  const row: string[] = [];
  while (row.length < 4) row.push(...partners);
  const doubled = [...row, ...row];

  return (
    <section className="border-y border-gray-100 py-12">
      <Container>
        <p className="text-center text-sm font-semibold uppercase tracking-wide text-gray-400">
          Our Partners & Sponsors
        </p>
      </Container>
      <div className="relative mt-8 overflow-hidden">
        <div className="flex w-max animate-marquee gap-10">
          {doubled.map((partner, i) => (
            <span
              key={`${partner}-${i}`}
              aria-hidden={i >= row.length || undefined}
              className="flex items-center whitespace-nowrap rounded-xl border border-gray-100 px-6 py-3 text-sm font-semibold text-gray-500"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
