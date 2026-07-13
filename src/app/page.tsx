import { Hero } from "@/components/home/Hero";
import { AboutSummary } from "@/components/home/AboutSummary";
import { ProgramsPreview } from "@/components/home/ProgramsPreview";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { NewsEvents } from "@/components/home/NewsEvents";
import { PartnersMarquee } from "@/components/home/PartnersMarquee";
import { CTASection } from "@/components/home/CTASection";
import { ContactSection } from "@/components/home/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSummary />
      <ProgramsPreview />
      <GalleryPreview />
      <NewsEvents />
      <PartnersMarquee />
      <CTASection />
      <ContactSection />
    </>
  );
}
