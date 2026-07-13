import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumb: string;
}) {
  return (
    <section className="bg-gradient-to-b from-primary-50 to-white py-12">
      <Container>
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary-700">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-primary-700">{breadcrumb}</span>
        </nav>
        {eyebrow && (
          <span className="mt-4 inline-block rounded-full bg-secondary-50 px-4 py-1 text-sm font-semibold text-secondary-700">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-primary-900 sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-lg text-gray-600">{description}</p>
        )}
      </Container>
    </section>
  );
}
