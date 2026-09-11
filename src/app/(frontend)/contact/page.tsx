import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { ContactForm } from "@/components/forms/ContactForm";
import { MapEmbed } from "@/components/MapEmbed";
import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "@/components/ui/SocialIcons";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Hunarsaaz in Taxila, Punjab. Find our address, phone, email, working hours, and send us a message directly.",
};

const socialLinks = [
  { icon: FacebookIcon, label: "Facebook" },
  { icon: InstagramIcon, label: "Instagram" },
  { icon: LinkedinIcon, label: "LinkedIn" },
  { icon: YoutubeIcon, label: "YouTube" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        breadcrumb="Contact"
        eyebrow="Get In Touch"
        title="We'd Love to Hear From You"
        description="Whether you have a question about admissions, donations, or volunteering — reach out anytime."
      />

      <section className="py-12">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <Card className="flex items-start gap-4 p-5">
                  <MapPin className="mt-0.5 h-6 w-6 shrink-0 text-primary-600" />
                  <div>
                    <h3 className="font-semibold text-primary-900">Address</h3>
                    <p className="mt-1 text-sm text-gray-600">{siteConfig.address}</p>
                  </div>
                </Card>
                <Card className="flex items-start gap-4 p-5">
                  <Phone className="mt-0.5 h-6 w-6 shrink-0 text-primary-600" />
                  <div>
                    <h3 className="font-semibold text-primary-900">Phone</h3>
                    <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="mt-1 block text-sm text-gray-600 hover:text-primary-700">
                      {siteConfig.phone}
                    </a>
                  </div>
                </Card>
                <Card className="flex items-start gap-4 p-5">
                  <Mail className="mt-0.5 h-6 w-6 shrink-0 text-primary-600" />
                  <div>
                    <h3 className="font-semibold text-primary-900">Email</h3>
                    <a href={`mailto:${siteConfig.email}`} className="mt-1 block text-sm text-gray-600 hover:text-primary-700">
                      {siteConfig.email}
                    </a>
                  </div>
                </Card>
                <Card className="flex items-start gap-4 p-5">
                  <Clock className="mt-0.5 h-6 w-6 shrink-0 text-primary-600" />
                  <div>
                    <h3 className="font-semibold text-primary-900">Working Hours</h3>
                    <p className="mt-1 text-sm text-gray-600">{siteConfig.hours}</p>
                  </div>
                </Card>
                <Card className="flex items-start gap-4 p-5">
                  <MessageCircle className="mt-0.5 h-6 w-6 shrink-0 text-accent-600" />
                  <div>
                    <h3 className="font-semibold text-primary-900">WhatsApp</h3>
                    <a
                      href={`https://wa.me/${siteConfig.whatsapp.replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-sm text-gray-600 hover:text-primary-700"
                    >
                      Chat with us on WhatsApp
                    </a>
                  </div>
                </Card>
                <div className="flex gap-3 pt-2">
                  {socialLinks.map(({ icon: Icon, label }) => (
                    <span
                      key={label}
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-700"
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                  ))}
                </div>
              </div>
              <MapEmbed className="mt-6 aspect-[4/3] w-full" />
            </div>

            <Card className="p-6 sm:p-10 lg:col-span-3">
              <h2 className="font-display text-2xl font-bold text-primary-900">Send Us a Message</h2>
              <p className="mt-2 text-sm text-gray-600">
                Fill out the form and our team will get back to you within 1-2 business days.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
