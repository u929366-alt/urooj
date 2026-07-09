export const financialBreakdown = [
  { label: "Program Delivery & Training", percent: 68, color: "bg-primary-600" },
  { label: "Student Scholarships", percent: 15, color: "bg-secondary-500" },
  { label: "Facilities & Equipment", percent: 9, color: "bg-accent-500" },
  { label: "Administration", percent: 5, color: "bg-primary-300" },
  { label: "Fundraising & Outreach", percent: 3, color: "bg-secondary-300" },
];

export type AnnualReport = {
  year: string;
  title: string;
  summary: string;
};

export const annualReports: AnnualReport[] = [
  { year: "2025", title: "Annual Report 2025", summary: "1,100 students trained, 4 new programs launched, 82% employment rate." },
  { year: "2024", title: "Annual Report 2024", summary: "950 students trained, new Web Development lab opened." },
  { year: "2023", title: "Annual Report 2023", summary: "780 students trained, first job-placement partnerships signed." },
  { year: "2022", title: "Annual Report 2022", summary: "600 students trained, crossed 2,500 lifetime graduates." },
];

export const caseStudyHighlights = [
  { title: "Women's Economic Independence", stat: "72%", description: "of female graduates report new or increased personal income within 6 months." },
  { title: "Youth Employment", stat: "78%", description: "of graduates are employed or self-employed within 3 months of graduating." },
  { title: "Community Reach", stat: "12", description: "community outreach sessions held annually across Taxila and nearby areas." },
];
