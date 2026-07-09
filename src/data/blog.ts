export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: "News" | "Success Story" | "Event" | "Announcement";
  author: string;
  date: string;
  readTime: string;
};

export const posts: Post[] = [
  {
    slug: "new-web-development-lab-launch",
    title: "Hunarsaaz Launches New Web Development Lab in Taxila",
    excerpt: "Thanks to generous donor support, our newest computer lab is now open, doubling our capacity for the Web Development and IT programs.",
    content: [
      "Hunarsaaz is proud to announce the opening of a new, fully-equipped web development lab at our Taxila campus.",
      "The 20-seat lab features modern workstations, high-speed internet, and dedicated software licenses, allowing us to double enrollment capacity for our Web Development and Computer & IT Skills programs.",
      "This expansion was made possible through the generous support of our donors and corporate partners. Applications for the next batch open this month.",
    ],
    category: "Announcement",
    author: "Hunarsaaz Communications Team",
    date: "2026-06-15",
    readTime: "3 min read",
  },
  {
    slug: "womens-empowerment-batch-graduation",
    title: "120 Women Graduate from Tailoring & Beautician Programs",
    excerpt: "Our largest women's empowerment graduation ceremony yet celebrated 120 graduates ready to launch their own businesses.",
    content: [
      "In a ceremony filled with pride and celebration, 120 women graduated from our Tailoring & Fashion Design and Beautician Training programs this spring.",
      "Many of the graduates plan to start home-based businesses, while others have already secured positions at local boutiques and salons.",
      "Chief guest and local philanthropist Mrs. Nasreen Butt praised the program's impact on household incomes across Taxila.",
    ],
    category: "Success Story",
    author: "Hunarsaaz Communications Team",
    date: "2026-05-20",
    readTime: "4 min read",
  },
  {
    slug: "partnership-with-local-industry",
    title: "Hunarsaaz Signs Job Placement Partnership with Local Manufacturers",
    excerpt: "A new partnership guarantees interviews for Electrical Technician and Welding graduates with three Taxila-based manufacturers.",
    content: [
      "Hunarsaaz has signed a memorandum of understanding with three local manufacturing companies to guarantee interviews for graduates of our Electrical Technician and Welding programs.",
      "This partnership reflects our continued commitment to bridging the gap between vocational education and real employment outcomes.",
    ],
    category: "News",
    author: "Hunarsaaz Communications Team",
    date: "2026-04-02",
    readTime: "2 min read",
  },
  {
    slug: "annual-fundraising-dinner-2026",
    title: "Save the Date: Annual Fundraising Dinner, September 2026",
    excerpt: "Join us for an evening celebrating our students and graduates, with proceeds supporting scholarships for the next academic year.",
    content: [
      "Hunarsaaz's Annual Fundraising Dinner returns this September, bringing together donors, partners, and alumni to celebrate a year of impact.",
      "All proceeds directly fund scholarships for the 2026-27 academic year. Sponsorship packages and individual tickets are available now.",
    ],
    category: "Event",
    author: "Hunarsaaz Events Team",
    date: "2026-07-01",
    readTime: "2 min read",
  },
];
