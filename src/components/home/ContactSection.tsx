import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import { MapEmbed } from "@/components/MapEmbed";
import { siteConfig } from "@/lib/site";

export function ContactSection() {
  return (
    <section className="bg-gray-50 py-20">
      <Container>
        <SectionHeading eyebrow="Get In Touch" title="Contact Hunarsaaz" />
        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <MapEmbed className="aspect-[4/3] w-full rounded-2xl" />
            <ul className="mt-6 space-y-4 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
                {siteConfig.address}
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-primary-600" />
                <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>{siteConfig.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-primary-600" />
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 shrink-0 text-primary-600" />
                {siteConfig.hours}
              </li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-3 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
