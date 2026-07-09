export type SuccessStory = {
  slug: string;
  name: string;
  program: string;
  journey: string;
  skillsLearned: string[];
  currentEmployment: string;
  quote: string;
};

export const successStories: SuccessStory[] = [
  {
    slug: "sana-web-development",
    name: "Sana Bibi",
    program: "Web Development",
    journey:
      "Sana joined Hunarsaaz after finishing intermediate, with no prior coding experience and few opportunities in her village near Taxila. Within five months she was building full websites.",
    skillsLearned: ["HTML/CSS/JavaScript", "React basics", "Git & deployment"],
    currentEmployment: "Freelance Web Developer, earning through Fiverr",
    quote: "Hunarsaaz didn't just teach me to code — it taught me I could build a future on my own terms.",
  },
  {
    slug: "asif-electrical",
    name: "Asif Mehmood",
    program: "Electrical Technician",
    journey:
      "After dropping out of school to support his family, Asif enrolled in the Electrical Technician program and completed his training while working part-time.",
    skillsLearned: ["House wiring", "Industrial wiring basics", "Appliance repair"],
    currentEmployment: "Site Electrician at a construction firm in Rawalpindi",
    quote: "I went from odd jobs to a stable trade. My family's life changed because Hunarsaaz gave me a real skill.",
  },
  {
    slug: "rabia-tailoring",
    name: "Rabia Yousaf",
    program: "Tailoring & Fashion Design",
    journey:
      "A mother of three, Rabia enrolled in the fully-sponsored Tailoring program to support her household. She now runs a home-based boutique.",
    skillsLearned: ["Pattern cutting", "Boutique finishing", "Small business basics"],
    currentEmployment: "Owner, Rabia's Stitching Corner (home-based business)",
    quote: "I earn my own income now. I no longer have to ask anyone for money — that dignity is priceless.",
  },
  {
    slug: "usman-mobile-repair",
    name: "Usman Ali",
    program: "Mobile Phone Repair",
    journey:
      "Usman was unemployed for over a year before joining Hunarsaaz. The hands-on repair lab gave him practical, marketable skills within three months.",
    skillsLearned: ["Hardware diagnostics", "Screen & battery replacement", "Customer service"],
    currentEmployment: "Technician at a mobile repair shop in Taxila Bazaar",
    quote: "The trainers believed in me even when I doubted myself. Now I have a trade I'm proud of.",
  },
];

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

export const testimonials: Testimonial[] = [
  { name: "Sana Bibi", role: "Web Development Graduate", quote: "Hunarsaaz gave me the skills and confidence to build my own freelance career." },
  { name: "Dr. Farah Naz", role: "Partner, Community Health Trust", quote: "Their graduates consistently show professionalism and strong technical grounding." },
  { name: "Asif Mehmood", role: "Electrical Technician Graduate", quote: "A stable trade changed my family's life completely." },
  { name: "Zainab Khan", role: "Parent of a Beautician Program Graduate", quote: "My daughter found independence and income through this program." },
];
