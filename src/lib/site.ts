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
  /**
   * Social accounts, as full URLs.
   *
   * An empty string means we are not on that platform, and the icon is not
   * shown at all — better than an icon that goes nowhere, which is what the
   * footer and the contact page used to have. Add a URL here and the link
   * appears in both places at once.
   */
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61594206301217",
    instagram: "https://www.instagram.com/hunarsaaz.pk/",
    linkedin: "https://www.linkedin.com/in/hunar-saaz-b82a3b434/",
    youtube: "https://www.youtube.com/@HunarSaazdotpk",
    // Not on X. Left empty on purpose: the icon is not drawn without a URL.
    x: "",
    tiktok: "",
  } as Record<string, string>,
  /**
   * Blind-copied on every certificate that goes out, so the office keeps a
   * record of what was awarded to whom without anyone having to remember.
   * Override with CERTIFICATE_BCC — a comma-separated list — to change it
   * without a deployment.
   */
  certificateBcc: ["ahsan@hunarsaaz.pk", "ceo@hunarsaaz.pk"],
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
  {
    // A tenth top-level item does not fit a 1280px window, and the three
    // pages under here answer the same question anyway: who are you, and
    // what have you done with the money.
    label: "About",
    href: "/about",
    children: [
      { label: "About Us", href: "/about", description: "Who we are and why we exist" },
      {
        label: "Impact & Transparency",
        href: "/impact",
        description: "How we measure results and spend",
      },
      {
        label: "Reports & Accounts",
        href: "/reports",
        description: "Audited financial statements",
      },
    ],
  },
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
    // Lives on the portal, not here, because this site is exported once and
    // uploaded: a workshop added or closed in the admin would not show up
    // until somebody rebuilt the whole static site.
    label: "Workshops",
    href: `${siteConfig.portalUrl}/workshops`,
    description: "Short live sessions — register and pay online",
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
