export type Program = {
  slug: string;
  title: string;
  category: "Technology" | "Creative" | "Trade Skills" | "Life Skills";
  icon: string;
  summary: string;
  description: string;
  duration: string;
  eligibility: string;
  fee: string;
  scheduleNote: string;
  curriculum: string[];
  careerOpportunities: string[];
  faqs: { question: string; answer: string }[];
};

export const programs: Program[] = [
  {
    slug: "computer-it-skills",
    title: "Computer & IT Skills",
    category: "Technology",
    icon: "Monitor",
    summary: "Foundational computing, MS Office, and internet skills for the modern workplace.",
    description:
      "This program builds core digital literacy from the ground up — operating systems, MS Office (Word, Excel, PowerPoint), email, and safe internet use — preparing graduates for office, retail, and administrative roles.",
    duration: "3 months",
    eligibility: "Matric pass, ages 16+",
    fee: "Free of cost",
    scheduleNote: "Morning & evening batches, 3 days/week",
    curriculum: [
      "Computer fundamentals & operating systems",
      "MS Word, Excel & PowerPoint",
      "Internet, email & online safety",
      "Typing speed & accuracy",
      "Basic troubleshooting",
    ],
    careerOpportunities: ["Office Assistant", "Data Entry Operator", "Admin Support", "Customer Service"],
    faqs: [
      { question: "Do I need my own laptop?", answer: "No, our computer lab is fully equipped for all enrolled students." },
      { question: "Is a certificate provided?", answer: "Yes, a Hunarsaaz-certified completion certificate is issued after passing the final assessment." },
    ],
  },
  {
    slug: "graphic-design",
    title: "Graphic Design",
    category: "Creative",
    icon: "Palette",
    summary: "Master Adobe Photoshop, Illustrator, and Canva to launch a design career or freelance business.",
    description:
      "Learn visual design principles, branding, and industry-standard tools to create logos, social media content, and print materials — with a portfolio-building final project.",
    duration: "4 months",
    eligibility: "Matric/Intermediate, basic computer literacy",
    fee: "Free of cost",
    scheduleNote: "Evening batches, 4 days/week",
    curriculum: [
      "Design principles & color theory",
      "Adobe Photoshop & Illustrator",
      "Canva for social media",
      "Logo & brand identity design",
      "Portfolio development",
    ],
    careerOpportunities: ["Graphic Designer", "Social Media Designer", "Freelance Designer", "Print Design Assistant"],
    faqs: [
      { question: "Can I freelance during the course?", answer: "Yes, we introduce freelancing platforms in the final month." },
    ],
  },
  {
    slug: "web-development",
    title: "Web Development",
    category: "Technology",
    icon: "Code",
    summary: "Build responsive websites with HTML, CSS, JavaScript, and modern frameworks.",
    description:
      "A hands-on program covering front-end fundamentals through to deploying real projects, preparing students for junior developer and freelance web work.",
    duration: "5 months",
    eligibility: "Intermediate/FSc, basic English & computer skills",
    fee: "Free of cost",
    scheduleNote: "Evening batches, 5 days/week",
    curriculum: [
      "HTML5, CSS3 & responsive design",
      "JavaScript fundamentals",
      "Git & GitHub",
      "Intro to React",
      "Deploying live projects",
    ],
    careerOpportunities: ["Junior Web Developer", "Freelance Developer", "WordPress Developer"],
    faqs: [
      { question: "Do I need prior coding experience?", answer: "No prior experience required — we start from the basics." },
    ],
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    category: "Technology",
    icon: "Megaphone",
    summary: "Social media marketing, SEO, and content strategy for small businesses and freelancers.",
    description:
      "Covers organic and paid social media marketing, basic SEO, content creation, and analytics — enabling graduates to manage marketing for local businesses or freelance clients.",
    duration: "3 months",
    eligibility: "Matric pass, basic computer literacy",
    fee: "Free of cost",
    scheduleNote: "Morning & evening batches, 3 days/week",
    curriculum: [
      "Social media marketing (Facebook, Instagram, TikTok)",
      "Content creation & scheduling",
      "Basic SEO & Google Business Profile",
      "Meta Ads fundamentals",
      "Analytics & reporting",
    ],
    careerOpportunities: ["Social Media Manager", "Digital Marketing Assistant", "Freelance Marketer"],
    faqs: [
      { question: "Will I manage real accounts during training?", answer: "Yes, students run a live campaign for a partner small business as their capstone project." },
    ],
  },
  {
    slug: "tailoring-fashion-design",
    title: "Tailoring & Fashion Design",
    category: "Trade Skills",
    icon: "Scissors",
    summary: "Stitching, pattern-making, and fashion design for a career or home-based business.",
    description:
      "From basic stitching to advanced pattern cutting and boutique-level finishing, this program equips women with skills to start a tailoring business or join the garment industry.",
    duration: "6 months",
    eligibility: "No formal education required, ages 15+",
    fee: "Free of cost",
    scheduleNote: "Morning batches, 5 days/week",
    curriculum: [
      "Hand & machine stitching basics",
      "Pattern making & cutting",
      "Embroidery & finishing",
      "Boutique-level garment construction",
      "Costing & small business basics",
    ],
    careerOpportunities: ["Tailor", "Boutique Owner", "Garment Factory Worker", "Home-Based Entrepreneur"],
    faqs: [
      { question: "Will I get a sewing machine after graduating?", answer: "Top-performing graduates receive a subsidized sewing machine through our alumni support program." },
    ],
  },
  {
    slug: "beautician-training",
    title: "Beautician Training",
    category: "Trade Skills",
    icon: "Sparkles",
    summary: "Professional salon skills including hairstyling, skincare, and bridal makeup.",
    description:
      "A comprehensive beauty and salon program covering skincare, hairstyling, makeup application, and bridal packages — a popular pathway to self-employment for women.",
    duration: "4 months",
    eligibility: "No formal education required, ages 16+",
    fee: "Free of cost",
    scheduleNote: "Morning batches, 4 days/week",
    curriculum: [
      "Skincare & facials",
      "Hairstyling & hair care",
      "Makeup application & bridal packages",
      "Manicure & pedicure",
      "Salon hygiene & customer service",
    ],
    careerOpportunities: ["Salon Professional", "Freelance Makeup Artist", "Salon Owner"],
    faqs: [
      { question: "Are practice kits provided?", answer: "Yes, a starter kit is provided for hands-on practice throughout the course." },
    ],
  },
  {
    slug: "electrical-technician",
    title: "Electrical Technician",
    category: "Trade Skills",
    icon: "Zap",
    summary: "Household and industrial wiring, safety, and electrical maintenance.",
    description:
      "Practical training in electrical wiring, circuit installation, and safety standards, preparing students for jobs as domestic or industrial electricians.",
    duration: "4 months",
    eligibility: "Middle pass, ages 16+",
    fee: "Free of cost",
    scheduleNote: "Morning batches, 5 days/week",
    curriculum: [
      "Electrical safety & tools",
      "House wiring & circuit design",
      "Motor & appliance repair",
      "Industrial wiring basics",
      "Troubleshooting & maintenance",
    ],
    careerOpportunities: ["Electrician", "Maintenance Technician", "Self-Employed Contractor"],
    faqs: [
      { question: "Is this course hands-on?", answer: "Yes, over 70% of class time is spent in our practical electrical lab." },
    ],
  },
  {
    slug: "plumbing",
    title: "Plumbing",
    category: "Trade Skills",
    icon: "Wrench",
    summary: "Pipefitting, fixture installation, and residential plumbing systems.",
    description:
      "Covers pipe fitting, water supply and drainage systems, fixture installation, and repair — a steady-demand trade skill for local and overseas employment.",
    duration: "3 months",
    eligibility: "No formal education required, ages 16+",
    fee: "Free of cost",
    scheduleNote: "Morning batches, 5 days/week",
    curriculum: [
      "Pipefitting & tools",
      "Water supply systems",
      "Drainage & sanitation",
      "Fixture installation & repair",
      "Job-site safety",
    ],
    careerOpportunities: ["Plumber", "Maintenance Worker", "Self-Employed Contractor"],
    faqs: [
      { question: "Can this lead to overseas work?", answer: "Many graduates pursue certification for overseas plumbing jobs after gaining local experience." },
    ],
  },
  {
    slug: "welding",
    title: "Welding",
    category: "Trade Skills",
    icon: "Flame",
    summary: "Arc and gas welding techniques for construction and fabrication industries.",
    description:
      "Hands-on training in arc welding, gas welding, and metal fabrication with a strong focus on workplace safety — a high-demand skill in construction and manufacturing.",
    duration: "3 months",
    eligibility: "No formal education required, ages 18+",
    fee: "Free of cost",
    scheduleNote: "Morning batches, 5 days/week",
    curriculum: [
      "Welding safety & equipment",
      "Arc welding techniques",
      "Gas welding & cutting",
      "Metal fabrication basics",
      "Blueprint reading",
    ],
    careerOpportunities: ["Welder", "Fabricator", "Construction Site Worker"],
    faqs: [
      { question: "Is protective gear provided?", answer: "Yes, all safety equipment is provided for lab sessions." },
    ],
  },
  {
    slug: "mobile-phone-repair",
    title: "Mobile Phone Repair",
    category: "Trade Skills",
    icon: "Smartphone",
    summary: "Diagnose and repair smartphones — hardware, software, and micro-soldering basics.",
    description:
      "Learn to diagnose and fix common smartphone issues, from screen and battery replacement to software troubleshooting and basic micro-soldering.",
    duration: "3 months",
    eligibility: "Matric pass, ages 16+",
    fee: "Free of cost",
    scheduleNote: "Evening batches, 4 days/week",
    curriculum: [
      "Mobile hardware fundamentals",
      "Screen, battery & component replacement",
      "Software flashing & troubleshooting",
      "Basic micro-soldering",
      "Customer service & shop management",
    ],
    careerOpportunities: ["Mobile Repair Technician", "Shop Owner", "After-Sales Service Technician"],
    faqs: [
      { question: "Do I need my own tools?", answer: "A basic toolkit is issued to every enrolled student to keep after graduation." },
    ],
  },
  {
    slug: "auto-mechanic",
    title: "Auto Mechanic",
    category: "Trade Skills",
    icon: "Car",
    summary: "Engine repair, diagnostics, and vehicle maintenance for cars and motorbikes.",
    description:
      "Covers engine mechanics, electrical systems, and routine maintenance for cars and motorbikes, preparing students for garage employment or self-employment.",
    duration: "4 months",
    eligibility: "No formal education required, ages 16+",
    fee: "Free of cost",
    scheduleNote: "Morning batches, 5 days/week",
    curriculum: [
      "Engine fundamentals",
      "Vehicle electrical systems",
      "Brake & suspension systems",
      "Diagnostics & troubleshooting",
      "Routine maintenance & servicing",
    ],
    careerOpportunities: ["Auto Mechanic", "Garage Technician", "Self-Employed Mechanic"],
    faqs: [
      { question: "Do we work on real vehicles?", answer: "Yes, students train on donated vehicles in our workshop." },
    ],
  },
  {
    slug: "carpentry",
    title: "Carpentry",
    category: "Trade Skills",
    icon: "Hammer",
    summary: "Furniture making, wood finishing, and construction carpentry skills.",
    description:
      "Practical instruction in woodworking tools, furniture construction, and finishing techniques for careers in carpentry workshops or independent furniture-making.",
    duration: "4 months",
    eligibility: "No formal education required, ages 16+",
    fee: "Free of cost",
    scheduleNote: "Morning batches, 5 days/week",
    curriculum: [
      "Hand & power tools",
      "Furniture construction",
      "Wood finishing & polishing",
      "Measurement & blueprint reading",
      "Workshop safety",
    ],
    careerOpportunities: ["Carpenter", "Furniture Maker", "Construction Carpentry"],
    faqs: [
      { question: "Can graduates sell their own furniture?", answer: "Yes, we support top graduates with starter tool kits to begin independent work." },
    ],
  },
  {
    slug: "english-language",
    title: "English Language",
    category: "Life Skills",
    icon: "BookOpen",
    summary: "Spoken and written English for the workplace and daily communication.",
    description:
      "Builds confidence in spoken and written English through conversational practice, grammar, and workplace communication skills — a foundation for all other programs.",
    duration: "2 months",
    eligibility: "Open to all, ages 14+",
    fee: "Free of cost",
    scheduleNote: "Flexible batches, 3 days/week",
    curriculum: [
      "Basic grammar & vocabulary",
      "Conversational practice",
      "Workplace & interview English",
      "Reading & comprehension",
      "Presentation skills",
    ],
    careerOpportunities: ["Improved employability across all sectors"],
    faqs: [
      { question: "Can I take this alongside another program?", answer: "Yes, most students pair this with a technical program." },
    ],
  },
  {
    slug: "entrepreneurship",
    title: "Entrepreneurship",
    category: "Life Skills",
    icon: "Lightbulb",
    summary: "Business planning, budgeting, and marketing to launch your own venture.",
    description:
      "Guides graduates of our technical programs through business registration, budgeting, marketing, and customer service to launch and sustain a small business.",
    duration: "6 weeks",
    eligibility: "Open to Hunarsaaz graduates & alumni",
    fee: "Free of cost",
    scheduleNote: "Weekend workshops",
    curriculum: [
      "Business idea validation",
      "Budgeting & pricing",
      "Marketing your business",
      "Basic bookkeeping",
      "Micro-financing & loan access",
    ],
    careerOpportunities: ["Small Business Owner", "Home-Based Entrepreneur"],
    faqs: [
      { question: "Do you help with funding?", answer: "We connect graduates with microfinance partners such as Akhuwat." },
    ],
  },
  {
    slug: "freelancing",
    title: "Freelancing",
    category: "Life Skills",
    icon: "Globe",
    summary: "Set up profiles on Fiverr and Upwork and win your first international clients.",
    description:
      "Teaches graduates of our design, development, and marketing programs how to build freelance profiles, write proposals, and manage international clients and payments.",
    duration: "4 weeks",
    eligibility: "Open to Hunarsaaz graduates with a marketable skill",
    fee: "Free of cost",
    scheduleNote: "Weekend workshops",
    curriculum: [
      "Building a winning profile",
      "Proposal writing",
      "Client communication",
      "Payment platforms (Payoneer, etc.)",
      "Reputation & reviews management",
    ],
    careerOpportunities: ["Freelancer", "Remote Contractor"],
    faqs: [
      { question: "Do I need a laptop to freelance?", answer: "Access to our computer lab continues to be available to alumni for freelance work." },
    ],
  },
  {
    slug: "financial-literacy",
    title: "Financial Literacy",
    category: "Life Skills",
    icon: "PiggyBank",
    summary: "Budgeting, saving, and understanding banking and micro-finance.",
    description:
      "Practical money-management training covering budgeting, saving, banking basics, and responsible use of microfinance — essential for household and business stability.",
    duration: "3 weeks",
    eligibility: "Open to all",
    fee: "Free of cost",
    scheduleNote: "Weekend workshops",
    curriculum: [
      "Personal budgeting",
      "Saving strategies",
      "Banking & mobile wallets",
      "Understanding microfinance & loans",
      "Avoiding financial fraud",
    ],
    careerOpportunities: ["Improved household & business financial management"],
    faqs: [
      { question: "Is this only for entrepreneurs?", answer: "No, it's designed for anyone managing a household or personal budget." },
    ],
  },
];

export const programCategories = ["All", "Technology", "Creative", "Trade Skills", "Life Skills"] as const;
