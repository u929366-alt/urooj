import { Hero } from "@/components/home/Hero";
import { AboutSummary } from "@/components/home/AboutSummary";
import { ProgramsPreview } from "@/components/home/ProgramsPreview";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { SuccessStoriesCarousel } from "@/components/home/SuccessStoriesCarousel";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { NewsEvents } from "@/components/home/NewsEvents";
import { PartnersMarquee } from "@/components/home/PartnersMarquee";
import { TestimonialsSlider } from "@/components/home/TestimonialsSlider";
import { CTASection } from "@/components/home/CTASection";
import { ContactSection } from "@/components/home/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSummary />
      <ProgramsPreview />
      <WhyChooseUs />
      <SuccessStoriesCarousel />
      <GalleryPreview />
      <NewsEvents />
      <PartnersMarquee />
      <TestimonialsSlider />
      <CTASection />
      <ContactSection />
    </>
  );
}
