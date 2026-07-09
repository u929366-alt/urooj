export type EventItem = {
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
};

export const events: EventItem[] = [
  {
    slug: "annual-fundraising-dinner-2026",
    title: "Annual Fundraising Dinner",
    date: "2026-09-12",
    time: "7:00 PM",
    location: "Taxila Marquee Hall, Taxila",
    description: "An evening celebrating our students and graduates, raising funds for next year's scholarships.",
  },
  {
    slug: "web-dev-batch-12-orientation",
    title: "Web Development Batch 12 — Orientation Day",
    date: "2026-08-03",
    time: "10:00 AM",
    location: "Hunarsaaz Campus, Main GT Road, Taxila",
    description: "Orientation session for newly admitted Web Development students, including lab tour and trainer introductions.",
  },
  {
    slug: "womens-entrepreneurship-workshop",
    title: "Women's Entrepreneurship Workshop",
    date: "2026-07-28",
    time: "11:00 AM",
    location: "Hunarsaaz Campus, Main GT Road, Taxila",
    description: "A free workshop for women graduates on turning their skills into a home-based or registered small business.",
  },
  {
    slug: "graduation-ceremony-cohort-9",
    title: "Graduation Ceremony — Cohort 9",
    date: "2026-08-20",
    time: "4:00 PM",
    location: "Hunarsaaz Campus, Main GT Road, Taxila",
    description: "Celebrating the graduation of over 200 students across all vocational programs.",
  },
];
