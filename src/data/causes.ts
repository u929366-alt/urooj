export type Cause = {
  slug: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
};

export const causes: Cause[] = [
  {
    slug: "general-fund",
    title: "General Fund",
    description: "Support wherever the need is greatest across all Hunarsaaz programs.",
    goal: 5000000,
    raised: 3150000,
  },
  {
    slug: "sponsor-a-student",
    title: "Sponsor a Student",
    description: "Fully fund one student's tuition, materials, and certification for a program.",
    goal: 2000000,
    raised: 1240000,
  },
  {
    slug: "womens-scholarships",
    title: "Women's Scholarships",
    description: "Fund scholarships for women in Tailoring, Beautician, and IT programs.",
    goal: 1500000,
    raised: 980000,
  },
  {
    slug: "new-trade-lab",
    title: "New Trade Skills Lab",
    description: "Help us build a new welding and electrical workshop for hands-on training.",
    goal: 3000000,
    raised: 760000,
  },
];
