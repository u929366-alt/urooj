import type { Metadata } from "next";
import { PlayCircle } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { GalleryFilterGrid } from "@/components/GalleryFilterGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse photos and videos from Hunarsaaz classrooms, workshops, graduation ceremonies, and community outreach events in Taxila.",
};

const videoGallery = [
  { id: "v1", title: "Hunarsaaz Campus Tour 2026" },
  { id: "v2", title: "Cohort 8 Graduation Highlights" },
  { id: "v3", title: "Student Success Stories" },
];

export default function GalleryPage() {
  return (
    <>
      <PageHero
        breadcrumb="Gallery"
        eyebrow="Media"
        title="Photo & Video Gallery"
        description="A glimpse into classrooms, workshops, graduations, and the community we serve."
      />

      <section className="py-16">
        <Container>
          <SectionHeading eyebrow="Photos" title="Photo Gallery" />
          <div className="mt-10">
            <GalleryFilterGrid />
          </div>
        </Container>
      </section>

      <section className="bg-gray-50 py-16">
        <Container>
          <SectionHeading eyebrow="Watch" title="Video Gallery" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {videoGallery.map((video) => (
              <div key={video.id} className="group relative overflow-hidden rounded-2xl">
                <PlaceholderImage
                  label={video.title}
                  icon={PlayCircle}
                  seed={video.id}
                  className="aspect-video w-full"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                  <PlayCircle className="h-14 w-14 text-white" />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-gray-500">
            Video content is being finalized — check back soon or visit our{" "}
            <a href="https://youtube.com/@hunarsaaz" target="_blank" rel="noopener noreferrer" className="font-medium text-primary-600 hover:underline">
              YouTube channel
            </a>.
          </p>
        </Container>
      </section>
    </>
  );
}
