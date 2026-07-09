import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { BlogList } from "@/components/BlogList";

export const metadata: Metadata = {
  title: "Blog & News",
  description:
    "Read the latest news, success stories, and updates from Hunarsaaz's vocational training programs in Taxila, Punjab.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        breadcrumb="Blog"
        eyebrow="Blog & News"
        title="Stories, Updates & Announcements"
        description="Stay up to date with what's happening at Hunarsaaz."
      />
      <section className="py-16">
        <Container>
          <BlogList />
        </Container>
      </section>
    </>
  );
}
