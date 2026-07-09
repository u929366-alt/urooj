export const partners = [
  "Akhuwat Foundation",
  "Punjab TEVTA",
  "Taxila Chamber of Commerce",
  "British Council Pakistan",
  "National Vocational Council",
  "Community Health Trust",
  "Local Industry Alliance",
  "Digital Skills Pakistan",
];

export const galleryCategories = ["All", "Classrooms", "Workshops", "Students", "Graduation", "Events", "Community Outreach"] as const;

export type GalleryItem = {
  id: string;
  category: (typeof galleryCategories)[number];
  caption: string;
};

export const galleryItems: GalleryItem[] = [
  { id: "g1", category: "Classrooms", caption: "IT Skills classroom in session" },
  { id: "g2", category: "Workshops", caption: "Students practicing electrical wiring" },
  { id: "g3", category: "Students", caption: "Web Development cohort at work" },
  { id: "g4", category: "Graduation", caption: "Cohort 8 graduation ceremony" },
  { id: "g5", category: "Events", caption: "Annual fundraising dinner 2025" },
  { id: "g6", category: "Community Outreach", caption: "Financial literacy session in the community" },
  { id: "g7", category: "Workshops", caption: "Tailoring & Fashion Design workshop" },
  { id: "g8", category: "Students", caption: "Beautician training practical class" },
  { id: "g9", category: "Classrooms", caption: "English Language conversation practice" },
  { id: "g10", category: "Graduation", caption: "Scholarship award ceremony" },
  { id: "g11", category: "Events", caption: "Women's Entrepreneurship Workshop" },
  { id: "g12", category: "Community Outreach", caption: "Career counseling for local youth" },
];

export type JobOpening = {
  slug: string;
  title: string;
  type: "Full-time" | "Part-time" | "Internship";
  location: string;
  description: string;
  requirements: string[];
};

export const jobOpenings: JobOpening[] = [
  {
    slug: "web-development-trainer",
    title: "Web Development Trainer",
    type: "Full-time",
    location: "Taxila Campus",
    description: "Deliver our Web Development curriculum to student cohorts, mentor students on capstone projects, and support job-placement partnerships.",
    requirements: ["3+ years of web development experience", "Prior teaching or mentoring experience preferred", "Fluent in Urdu and English"],
  },
  {
    slug: "admissions-coordinator",
    title: "Admissions Coordinator",
    type: "Full-time",
    location: "Taxila Campus",
    description: "Manage the student application pipeline, conduct eligibility interviews, and support orientation for new cohorts.",
    requirements: ["Bachelor's degree in any field", "Strong communication and organizational skills", "Experience with CRM or spreadsheet tools"],
  },
  {
    slug: "development-intern",
    title: "Fundraising & Development Intern",
    type: "Internship",
    location: "Taxila Campus / Remote",
    description: "Support the Development team with donor research, grant-writing assistance, and social media content for fundraising campaigns.",
    requirements: ["Currently enrolled in or recent graduate of a relevant degree program", "Strong writing skills", "Interest in the nonprofit sector"],
  },
];
