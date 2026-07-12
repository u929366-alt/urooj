import Link from "next/link";
import { ArrowRight, Heart, Compass, BookOpen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { StatCounter } from "@/components/ui/StatCounter";
import { GraduationCap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white">
      <Container className="grid grid-cols-1 items-center gap-10 py-12 lg:grid-cols-2 lg:py-12">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary-50 px-4 py-1.5 text-sm font-semibold text-secondary-700">
            <Heart className="h-4 w-4" />
            Vocational Training Institute, Taxila
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-primary-900 sm:text-5xl lg:text-6xl">
            Empowering Skills.
            <br />
            <span className="text-secondary-500">Transforming Lives.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Hunarsaaz is dedicated to empowering youth and women through
            vocational education, technical training, entrepreneurship, and
            digital skills — bridging the gap between education and
            employment in Taxila, Punjab.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/admissions" size="lg">
              Apply Now
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/donate" variant="secondary" size="lg">
              <Heart className="h-4 w-4" />
              Donate
            </Button>
            <Button href="/programs" variant="outline" size="lg">
              <Compass className="h-4 w-4" />
              Explore Programs
            </Button>
          </div>
          <Link
            href="/programs"
            className="group mt-10 inline-flex items-center gap-4 rounded-2xl border border-primary-100 bg-white/80 px-6 py-4 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white">
              <BookOpen className="h-6 w-6" />
            </span>
            <span>
              <span className="block font-display text-3xl font-bold leading-none text-primary-900">
                <StatCounter value={16} duration={2000} />
              </span>
              <span className="mt-1 block text-sm font-medium text-gray-500">
                Programs Offered
              </span>
            </span>
            <ArrowRight className="h-5 w-5 text-primary-300 transition-all group-hover:translate-x-1 group-hover:text-primary-600" />
          </Link>
        </div>
        <div className="relative">
          <PlaceholderImage
            label="Students in a vocational training workshop"
            icon={GraduationCap}
            seed="hero"
            className="aspect-[4/3] w-full rounded-3xl shadow-2xl shadow-primary-900/20"
          />
        </div>
      </Container>
    </section>
  );
}
