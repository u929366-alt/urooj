import { Hero } from "@/components/home/Hero";
import { AboutSummary } from "@/components/home/AboutSummary";
import { ProgramsPreview } from "@/components/home/ProgramsPreview";
import { LearnOnline } from "@/components/home/LearnOnline";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { NewsEvents } from "@/components/home/NewsEvents";
import { PartnersMarquee } from "@/components/home/PartnersMarquee";
import { CTASection } from "@/components/home/CTASection";
import { ContactSection } from "@/components/home/ContactSection";
import { PromoModal } from "@/components/home/PromoModal";

export default function Home() {
  return (
    <>
      <PromoModal />
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
