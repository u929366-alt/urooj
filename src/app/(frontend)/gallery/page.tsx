import type { Metadata } from "next";
import { Play } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryFilterGrid } from "@/components/GalleryFilterGrid";
import { trainingHighlights } from "@/data/highlights";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse photos and videos from Hunarsaaz classrooms, workshops, graduation ceremonies, and community outreach events in Taxila.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        breadcrumb="Gallery"
        eyebrow="Media"
        title="Photo & Video Gallery"
        description="A glimpse into classrooms, workshops, graduations, and the community we serve."
      />

      <section className="py-12">
        <Container>
          <SectionHeading eyebrow="Photos" title="Photo Gallery" />
          <div className="mt-10">
            <GalleryFilterGrid />
          </div>
        </Container>
      </section>

      <section id="training-videos" className="scroll-mt-24 bg-gray-50 py-12">
        <Container>
          <SectionHeading
            eyebrow="Watch"
            title="Training Highlights"
            description="Short clips from THRIVE 360, our workshop on mental wellbeing across life, education and the workplace."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {trainingHighlights.map((clip) => (
              <figure key={clip.src}>
                {/* Plain video, no player library: these are short files on
                    our own domain, and preload="none" means nothing is
                    fetched until somebody presses play. */}
                <video
                  controls
                  preload="none"
                  poster={clip.poster}
                  playsInline
                  className="w-full rounded-2xl border border-gray-200 bg-black shadow-sm"
                >
                  <source src={clip.src} type="video/mp4" />
                  Your browser cannot play this clip.{" "}
                  <a href={clip.src}>Download it instead.</a>
                </video>

                <figcaption className="mt-3">
                  <div className="flex items-baseline gap-2">
                    <Play
                      className="h-3.5 w-3.5 shrink-0 translate-y-0.5 text-secondary-500"
                      aria-hidden
                    />
                    <h3 className="font-semibold text-primary-900">{clip.title}</h3>
                    <span className="ml-auto shrink-0 text-xs text-gray-500">{clip.seconds}s</span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-gray-600">{clip.description}</p>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="mt-8 text-sm text-gray-600">
            THRIVE 360 is delivered by Ms. Asma Ahmed, Consultant Clinical Psychologist.{" "}
            <a
              href={`${siteConfig.portalUrl}/workshops`}
              className="font-semibold text-primary-600 hover:underline"
            >
              See upcoming workshops
            </a>
            , or watch more on our{" "}
            <a
              href={siteConfig.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary-600 hover:underline"
            >
              YouTube channel
            </a>
            .
          </p>
        </Container>
      </section>

    </>
  );
}
