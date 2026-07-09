export type Person = {
  name: string;
  role: string;
  bio: string;
};

export const boardMembers: Person[] = [
  { name: "Dr. Aslam Khokhar", role: "Chairperson, Board of Trustees", bio: "Public health physician and community development advocate with 20+ years of nonprofit governance experience." },
  { name: "Mrs. Nasreen Butt", role: "Vice Chairperson", bio: "Philanthropist and women's empowerment champion in Taxila." },
  { name: "Mr. Faisal Rehman", role: "Treasurer", bio: "Chartered accountant overseeing Hunarsaaz's financial transparency and audits." },
  { name: "Ms. Amna Siddiqui", role: "Board Member", bio: "Education policy specialist advising on curriculum standards." },
];

export const leadership: Person[] = [
  { name: "Imtiaz Sheikh", role: "Executive Director", bio: "Founded Hunarsaaz in 2016 after a career in technical education administration." },
  { name: "Sadia Rauf", role: "Director of Programs", bio: "Leads curriculum design and trainer development across all 16 programs." },
  { name: "Junaid Aziz", role: "Director of Operations", bio: "Oversees campus operations, admissions, and student services." },
  { name: "Mehwish Tariq", role: "Director of Development", bio: "Leads fundraising, donor relations, and partnership development." },
];
