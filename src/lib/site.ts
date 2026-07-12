export const siteConfig = {
  name: "Hunarsaaz",
  tagline: "Empowering Skills. Transforming Lives.",
  description:
    "Hunarsaaz is a Pakistani NGO based in Taxila, Punjab, empowering youth, women, and marginalized communities through vocational and technical education, entrepreneurship training, digital skills, and employment opportunities.",
  url: "https://www.hunarsaaz.org",
  email: "ceo@hunarsaaz.pk",
  admissionsEmail: "ceo@hunarsaaz.pk",
  phone: "+92 300 8154597",
  whatsapp: "+923008154597",
  address: "Main GT Road, Taxila, Punjab, Pakistan",
  hours: "Monday – Saturday, 9:00 AM – 5:00 PM",
  bankDetails: {
    bankName: "Habib Bank Limited (HBL)",
    accountTitle: "Hunarsaaz Welfare Foundation",
    accountNumber: "1234-5678901-234",
    iban: "PK00HABB0001234567890123",
    branch: "Taxila Branch, Punjab",
  },
  easypaisa: "0300-1234567",
  jazzcash: "0300-1234567",
};

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
      { label: "Donate", href: "/donate", description: "Support our mission" },
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
