export const siteConfig = {
  name: "Hunarsaaz",
  tagline: "Empowering Skills. Transforming Lives.",
  description:
    "Hunarsaaz is a Pakistani NGO based in Taxila, Punjab, empowering youth, women, and marginalized communities through vocational and technical education, entrepreneurship training, digital skills, and employment opportunities.",
  url: "https://hunarsaaz.pk",
  /**
   * The learning portal, which is a separate Node application on its own
   * subdomain. The marketing site is a static export and cannot read the
   * portal's database, so the two are joined by links rather than merged.
   *
   * Donations point here too: a donation has to create a payment record with
   * a reference, and only the portal can do that.
   */
  portalUrl: "https://learn.hunarsaaz.pk",
  email: "ceo@hunarsaaz.pk",
  admissionsEmail: "ceo@hunarsaaz.pk",
  phone: "+92 300 8154597",
  whatsapp: "+923008154597",
  address: "Main GT Road, Taxila, Punjab, Pakistan",
  hours: "Monday – Saturday, 9:00 AM – 5:00 PM",
  bankDetails: {
    bankName: "Allied Bank Limited",
    accountTitle: "Hunar Saaz",
    iban: "PK46ABPA0010154495590018",
  },
};

/**
 * Course fees are not shown anywhere and enrolment never asks for payment.
 * A student enrols, and Hunarsaaz invoices them separately where anything is
 * owed.
 *
 * The price on a course record is still stored and the payments system still
 * works — this only stops fees being displayed and stops enrolment raising a
 * charge. Donations are a separate flow and are unaffected.
 *
 * Setting this back to true restores the fee line, the "pay by bank transfer"
 * step and the awaiting-payment hold on enrolment.
 */
export const SHOW_COURSE_FEES = false;

export type NavLink = {
  label: string;
  href: string;
  description?: string;
  children?: NavLink[];
};

export const mainNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Learn Online",
    href: "https://learn.hunarsaaz.pk/learn",
    description: "Online courses — enrol and study at your own pace",
  },
  {
    label: "Programs",
    href: "/programs",
    description: "Browse all vocational training programs",
  },
  {
    label: "Policy & Advisory",
    href: "/advisory",
    description: "Policy, Research, and Institutional Advisory Platform",
  },
  {
    label: "Get Involved",
    href: "/admissions",
    children: [
      { label: "Admissions", href: "/admissions", description: "Apply as a student" },
      { label: "Volunteer", href: "/volunteer", description: "Give your time & skills" },
      {
        label: "Donate",
        href: `${siteConfig.portalUrl}/donate`,
        description: "Support our mission",
      },
      { label: "Careers", href: "/careers", description: "Join our team" },
    ],
  },
  {
    label: "Media",
    href: "/gallery",
    children: [
      { label: "Gallery", href: "/gallery", description: "Photos & videos" },
      { label: "Blog & News", href: "/blog", description: "Latest stories" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export const footerPrograms = [
  "Computer & IT Skills",
  "Graphic Design",
  "Web Development",
  "Tailoring & Fashion Design",
  "Electrical Technician",
  "Mobile Phone Repair",
];
