import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getIcon } from "@/lib/icons";
import { whyChooseUs } from "@/data/stats";

export function WhyChooseUs() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Why Hunarsaaz"
          title="Why Choose Hunarsaaz"
          description="A learning experience built for real-world results, backed by experienced trainers and community support."
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseUs.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-100 p-6 transition-colors hover:border-primary-200 hover:bg-primary-50/40"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-semibold text-primary-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
