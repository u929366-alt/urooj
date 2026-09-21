import { Hero } from "@/components/home/Hero";
import { AboutSummary } from "@/components/home/AboutSummary";
import { ProgramsPreview } from "@/components/home/ProgramsPreview";
import { LearnOnline } from "@/components/home/LearnOnline";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { NewsEvents } from "@/components/home/NewsEvents";
import { PartnersMarquee } from "@/components/home/PartnersMarquee";
import { CTASection } from "@/components/home/CTASection";
import { ContactSection } from "@/components/home/ContactSection";
// The promo modal is switched off. The flyer image itself reads "Free course"
// and carries dates from August, and neither can be edited from here — it needs
// a new flyer. Put <PromoModal /> back at the top of the page once there is one,
// and bump SEEN_KEY in the component so people who dismissed the old one see it.
// import { PromoModal } from "@/components/home/PromoModal";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSummary />
      <ProgramsPreview />
      <LearnOnline />
      <GalleryPreview />
      <NewsEvents />
      <PartnersMarquee />
      <CTASection />
      <ContactSection />
    </>
  );
}
