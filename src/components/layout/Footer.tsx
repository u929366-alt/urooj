import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
  XIcon,
} from "@/components/ui/SocialIcons";
import { siteConfig, footerPrograms } from "@/lib/site";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

const quickLinks = [
  { label: "About Us", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Policy & Advisory", href: "/advisory" },
  { label: "Admissions", href: "/admissions" },
  { label: "Volunteer", href: "/volunteer" },
  { label: "Donate", href: "/donate" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
  { label: "Impact & Reports", href: "/impact" },
];

const socialLinks = [
  { icon: FacebookIcon, label: "Facebook" },
  { icon: InstagramIcon, label: "Instagram" },
  { icon: LinkedinIcon, label: "LinkedIn" },
  { icon: YoutubeIcon, label: "YouTube" },
  { icon: XIcon, label: "X / Twitter" },
];

export function Footer() {
  return (
    <footer className="bg-primary-900 text-primary-100">
      <div className="border-b border-primary-800">
        <Container className="flex flex-col items-center justify-between gap-6 py-10 lg:flex-row">
          <div className="text-center lg:text-left">
            <h2 className="font-display text-xl font-bold text-white">Stay Updated</h2>
            <p className="mt-1 text-sm text-primary-200">
              Subscribe for news on programs, events, and success stories.
            </p>
          </div>
          <NewsletterForm className="w-full max-w-md" />
        </Container>
      </div>
      <Container className="grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="inline-flex">
            <Image
              src="/logo-lockup.svg"
              alt={siteConfig.name}
              width={224}
              height={96}
              className="h-24 w-auto rounded-xl bg-white p-2"
            />
          </Link>
          <p className="mt-4 text-sm leading-6 text-primary-200">
            Empowering youth, women, and marginalized communities in Taxila through
            vocational education, entrepreneurship, and digital skills.
          </p>
          <div className="mt-6 flex gap-3">
            {socialLinks.map(({ icon: Icon, label }) => (
              <span
                key={label}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-800 text-white"
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-primary-200 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
            Popular Programs
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {footerPrograms.map((program) => (
              <li key={program}>
                <Link href="/programs" className="text-primary-200 hover:text-white">
                  {program}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
            Contact Us
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-primary-200">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary-400" />
              <span>{siteConfig.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-secondary-400" />
              <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="hover:text-white">
                {siteConfig.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-secondary-400" />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                {siteConfig.email}
              </a>
            </li>
            <li className="text-primary-300">{siteConfig.hours}</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-primary-800">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-primary-300 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/about#policies" className="hover:text-white">
              Policies
            </Link>
            <Link href="/impact#reports" className="hover:text-white">
              Annual Reports
            </Link>
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
