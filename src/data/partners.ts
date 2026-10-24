export const partners = [
  "National Vocational and Technical Training Commission (NAVTTC)",
];

export const galleryCategories = ["All", "Classrooms", "Workshops", "Students", "Graduation", "Events", "Community Outreach"] as const;

export type GalleryItem = {
  id: string;
  category: (typeof galleryCategories)[number];
  caption: string;
  /**
   * A real photograph. Without one the grid shows a gradient stand-in, so a
   * category can be listed before there is anything to show for it — and a
   * photograph arriving later is one line here.
   */
  src?: string;
};

/**
 * Photographs first, stand-ins after. Somebody opening the gallery should see
 * the place as it actually is before they see anything we have not shot yet.
 */
export const galleryItems: GalleryItem[] = [
  {
    id: "p1",
    category: "Classrooms",
    caption: "The Hunarsaaz centre, Taxila",
    src: "/photos/campus-building.jpg",
  },
  {
    id: "p2",
    category: "Classrooms",
    caption: "A class in the IT lab",
    src: "/photos/computer-lab-class.jpg",
  },
  {
    id: "p3",
    category: "Students",
    caption: "Typing up a letter in Word",
    src: "/photos/student-typing-application.jpg",
  },
  {
    id: "p4",
    category: "Students",
    caption: "Working from handwritten notes",
    src: "/photos/students-word-processing.jpg",
  },
  {
    id: "p5",
    category: "Classrooms",
    caption: "Word processing practice",
    src: "/photos/student-practising-typing.jpg",
  },
  {
    id: "p6",
    category: "Students",
    caption: "At the keyboard",
    src: "/photos/student-at-keyboard.jpg",
  },
  {
    id: "p7",
    category: "Classrooms",
    caption: "In the computer lab",
    src: "/photos/students-in-the-lab.jpg",
  },
  { id: "g2", category: "Workshops", caption: "Students practicing electrical wiring" },
  { id: "g4", category: "Graduation", caption: "Cohort 8 graduation ceremony" },
  { id: "g5", category: "Events", caption: "Annual fundraising dinner 2025" },
  { id: "g6", category: "Community Outreach", caption: "Financial literacy session in the community" },
  { id: "g7", category: "Workshops", caption: "Tailoring & Fashion Design workshop" },
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
