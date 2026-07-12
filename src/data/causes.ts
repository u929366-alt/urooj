export type Cause = {
  slug: string;
  title: string;
  description: string;
};

export const causes: Cause[] = [
  {
    slug: "general-fund",
    title: "General Fund",
    description: "Support wherever the need is greatest across all Hunarsaaz programs.",
  },
  {
    slug: "sponsor-a-student",
    title: "Sponsor a Student",
    description: "Fully fund one student's tuition, materials, and certification for a program.",
  },
  {
    slug: "womens-scholarships",
    title: "Women's Scholarships",
    description: "Fund scholarships for women in Tailoring, Beautician, and IT programs.",
  },
  {
    slug: "new-trade-lab",
    title: "New Trade Skills Lab",
    description: "Help us build a new welding and electrical workshop for hands-on training.",
  },
];
