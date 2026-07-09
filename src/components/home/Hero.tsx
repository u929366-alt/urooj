import { ArrowRight, Heart, Compass } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { GraduationCap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white">
      <Container className="grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
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
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <dt className="text-2xl font-bold text-primary-900">4,200+</dt>
              <dd className="text-sm text-gray-500">Students Trained</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold text-primary-900">16</dt>
              <dd className="text-sm text-gray-500">Programs Offered</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold text-primary-900">78%</dt>
              <dd className="text-sm text-gray-500">Employment Rate</dd>
            </div>
          </dl>
        </div>
        <div className="relative">
          <PlaceholderImage
            label="Students in a vocational training workshop"
            icon={GraduationCap}
            seed="hero"
            className="aspect-[4/3] w-full rounded-3xl shadow-2xl shadow-primary-900/20"
          />
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-4 shadow-xl sm:block">
            <p className="text-sm font-semibold text-primary-900">
              &ldquo;A stable trade changed my family&apos;s life.&rdquo;
            </p>
            <p className="mt-1 text-xs text-gray-500">— Asif, Electrical Technician Graduate</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
