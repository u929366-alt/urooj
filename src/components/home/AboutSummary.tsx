import { Target, Eye, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { StatCounter } from "@/components/ui/StatCounter";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { stats } from "@/data/stats";
import { Users } from "lucide-react";

export function AboutSummary() {
  return (
    <section className="py-20">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <PlaceholderImage
            label="Hunarsaaz campus and students"
            icon={Users}
            seed="about"
            className="aspect-[4/3] w-full rounded-3xl"
          />
          <div>
            <span className="inline-block rounded-full bg-primary-50 px-4 py-1 text-sm font-semibold uppercase tracking-wide text-primary-700">
              About Hunarsaaz
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary-900 sm:text-4xl">
              Bridging the Gap Between Education and Employment
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Hunarsaaz opens skills training to those most often left out of
              it — equipping women and men with practical, industry-relevant
              capability that improves livelihoods and strengthens our
              community.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex gap-3 rounded-xl bg-primary-50 p-4">
                <Target className="h-6 w-6 shrink-0 text-primary-600" />
                <div>
                  <h3 className="font-semibold text-primary-900">Our Mission</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Empower communities through quality vocational education.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 rounded-xl bg-accent-50 p-4">
                <Eye className="h-6 w-6 shrink-0 text-accent-600" />
                <div>
                  <h3 className="font-semibold text-primary-900">Our Vision</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    A Pakistan where every person can earn a dignified living.
                  </p>
                </div>
              </div>
            </div>
            <Button href="/about" variant="outline" className="mt-8">
              Learn More About Us
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <dl className="mt-20 grid grid-cols-2 gap-8 rounded-3xl bg-primary-900 px-6 py-12 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-display text-3xl font-bold text-white sm:text-4xl">
                <StatCounter value={stat.value} suffix={stat.suffix} />
              </dd>
              <p className="mt-2 text-sm text-primary-200">{stat.label}</p>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
