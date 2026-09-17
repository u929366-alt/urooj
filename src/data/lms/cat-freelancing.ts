import { scaffold } from "./scaffold.ts";
import type { CourseContent } from "./types.ts";

const CAT = "freelancing-and-remote-work";
const SOURCE = "Syllabus developed by Hunarsaaz from current freelance-market practice. NAVTTC qualifications were not consulted — navttc.gov.pk is unreachable from this environment. No NAVTTC claim is made.";

export const freelancingCourses: CourseContent[] = [
  scaffold({
    slug: "freelancing-fundamentals",
    title: "Freelancing Fundamentals",
    categorySlug: CAT,
    courseCode: "HS-FL-01",
    summary:
      "The business of freelancing — finding clients, quoting properly, writing proposals that win, and getting paid in Pakistan.",
    description: `
Most freelancers who fail are not bad at their craft. They are bad at pricing, at saying no, at writing a proposal, and at getting money out of a client who has gone quiet.

This course is about that half of the job. It covers building a profile that gets shortlisted, finding work beyond the crowded marketplaces, quoting a number you can defend, and the payment routes that actually work from Pakistan.

Bring a skill you already have. This course sells it.
`.trim(),
    level: "beginner",
    durationWeeks: 8,
    learningHours: 32,
    prerequisites:
      "One marketable skill you can already perform — design, writing, development, video, data entry, anything. A CNIC and a bank account in your own name for the payments module.",
    targetLearners: "Anyone starting freelance work, students building income alongside study, and women seeking work that fits around home responsibilities.",
    objectives: [
      "Identify which of your skills people will actually pay for.",
      "Build a profile and portfolio that gets you shortlisted.",
      "Find clients on and off the marketplaces.",
      "Write proposals that answer the client's problem.",
      "Price work properly and get paid reliably.",
    ],
    outcomes: [
      "Write a positioning statement naming who you help and how.",
      "Build a portfolio with three pieces, including self-initiated work.",
      "Complete a marketplace profile that passes review.",
      "Write a proposal that opens with the client's problem.",
      "Quote using hourly, fixed and retainer models and justify the choice.",
      "Set up a compliant payment route and invoice correctly.",
    ],
    careers: ["Freelancer on Upwork or Fiverr", "Direct-client freelancer", "Remote contractor", "Home-based service business"],
    skills: ["Positioning", "Portfolio", "Proposal writing", "Pricing", "Client communication", "Invoicing"],
    finalProject:
      "Submit a complete freelance package: positioning statement, portfolio of three pieces, a finished marketplace profile, three real proposals you have sent, and your rate card with the arithmetic behind it.",
    curriculumSource: SOURCE,
    modules: [
      {
        title: "Module 1 — What You Sell and Who Buys It",
        summary: "Positioning, portfolio and profile.",
        lessons: [
          { title: "Understanding Freelancing", minutes: 16, preview: true, objective: "Know what you are taking on before you start.", covers: ["Freelance, contract and employment compared", "Income that is irregular by nature", "The hours nobody pays you for, and pricing for them"] },
          { title: "Identifying Marketable Skills", minutes: 20, objective: "Find what people will actually pay for.", covers: ["Skill, service and outcome are three different things", "Specialising beats being available for anything", "Testing demand before committing"] },
          { title: "Portfolio and Profile", minutes: 24, objective: "Build evidence when you have no clients yet.", covers: ["Self-initiated work as real evidence", "Three good pieces beat twenty weak ones", "Marketplace profile: headline, overview, rate, tests"] },
        ],
        quiz: [
          { prompt: "You have no clients yet. What goes in the portfolio?", options: [{ text: "Self-initiated work done to a real brief you wrote", correct: true }, { text: "Nothing — wait for a client" }, { text: "Other people's work, uncredited" }, { text: "A list of your skills" }] },
          { prompt: "Why does specialising usually beat generalising?", options: [{ text: "A specialist is shortlisted and can charge more for the same hours", correct: true }, { text: "There is less competition in every niche" }, { text: "Marketplaces require it" }, { text: "It is easier" }] },
          { prompt: "Which hours must your rate cover?", type: "multiple", options: [{ text: "Time spent finding clients", correct: true }, { text: "Unpaid revisions and admin", correct: true }, { text: "Periods with no work", correct: true }, { text: "Only the hours you bill" }] },
        ],
      },
      {
        title: "Module 2 — Finding Work and Winning It",
        summary: "Where clients come from, and what makes them choose you.",
        lessons: [
          { title: "Finding Clients", minutes: 22, objective: "Build more than one route to work.", covers: ["Marketplaces: fast start, brutal competition", "Direct outreach and local businesses", "Referrals — eventually the main source"] },
          { title: "Proposal Writing", minutes: 24, objective: "Write something a client actually reads.", covers: ["Open with their problem, not your CV", "Show you read the brief — specifics beat templates", "One relevant sample, one clear next step"] },
          { title: "Client Communication", minutes: 22, objective: "Keep a client through the work.", covers: ["Response times and setting expectations", "Asking questions early rather than guessing", "Saying no, and handling scope creep"] },
        ],
        quiz: [
          { prompt: "How should a proposal open?", options: [{ text: "With the client's problem, shown to be understood", correct: true }, { text: "With your qualifications" }, { text: "With your price" }, { text: "With a greeting template" }] },
          { prompt: "A client keeps adding small extra tasks. What is this and what do you do?", options: [{ text: "Scope creep — name it politely and quote for the additions", correct: true }, { text: "Normal service; absorb it" }, { text: "Stop replying" }, { text: "Finish the job and invoice more without saying so" }] },
          { prompt: "What most commonly loses a freelancer a client?", options: [{ text: "Silence and missed deadlines", correct: true }, { text: "Charging too much" }, { text: "Technical quality" }, { text: "Being too specialised" }] },
        ],
        activity: {
          title: "Practical — Three real proposals",
          instructions: "Find three genuine job postings or approach three real businesses. Write and send a proposal to each, each one specific to that client. Submit all three, plus any replies, and a paragraph on what you would change about the weakest one.",
        },
      },
      {
        title: "Module 3 — Money, Projects and Lasting Clients",
        summary: "Pricing, payment, delivery and keeping the work coming.",
        lessons: [
          { title: "Pricing Your Work", minutes: 24, objective: "Arrive at a number you can defend.", covers: ["Hourly, fixed and retainer", "Working backwards from what you must earn per month", "Raising rates, and when"] },
          { title: "Getting Paid from Pakistan", minutes: 22, objective: "Receive money reliably and lawfully.", covers: ["Payoneer, Wise, bank transfer and marketplace payouts", "Advance payment and milestones", "Invoices, records, and declaring income"] },
          { title: "Delivery and Long-Term Clients", minutes: 22, objective: "Turn one job into several.", covers: ["Scope in writing before starting", "Managing several projects without dropping one", "The follow-up that produces repeat work"] },
        ],
        quiz: [
          { prompt: "What advance is normal before starting with a new client?", options: [{ text: "Around 50%", correct: true }, { text: "Nothing — invoice at the end" }, { text: "The full amount, always" }, { text: "It varies too much to say" }] },
          { prompt: "Why work backwards from monthly earnings when setting a rate?", options: [{ text: "It accounts for unpaid hours and gaps between work", correct: true }, { text: "Clients expect it" }, { text: "It produces a lower rate" }, { text: "It is required for tax" }] },
          { prompt: "What should be agreed in writing before work starts?", type: "multiple", options: [{ text: "Scope and deliverables", correct: true }, { text: "Number of revisions included", correct: true }, { text: "Payment terms and schedule", correct: true }, { text: "The client's personal details" }] },
        ],
      },
    ],
  }),

  scaffold({
    slug: "content-writing",
    title: "Content Writing",
    categorySlug: CAT,
    courseCode: "HS-CW-01",
    summary:
      "Write for the web so people finish reading — articles, product copy, scripts and emails, with research and editing that hold up.",
    description: `
Content writing is not creative writing. The reader is busy, sceptical and one tap from leaving. The job is to be clear, useful and finished quickly.

This course covers research that goes beyond the first search result, structures that keep people reading, writing for search without writing for robots, and the editing that separates publishable work from a first draft.

It also covers AI honestly: what it drafts well, what it invents, and why a writer who cannot tell the difference is unemployable.
`.trim(),
    level: "beginner",
    durationWeeks: 8,
    learningHours: 32,
    prerequisites: "Good written English or Urdu. A computer. No professional writing experience needed.",
    targetLearners: "Aspiring writers, marketing staff, students, and freelancers adding a service that needs no software licence.",
    objectives: [
      "Research a subject properly before writing about it.",
      "Structure writing so readers reach the end.",
      "Adapt tone and format to the audience and platform.",
      "Write for search without damaging the writing.",
      "Edit your own work to a professional standard.",
    ],
    outcomes: [
      "Produce a brief and outline before drafting.",
      "Write articles, product descriptions, emails and video scripts.",
      "Apply on-page SEO naturally.",
      "Edit for clarity, length and accuracy.",
      "Use AI as a drafting aid and catch what it invents.",
      "Work to a client brief and handle feedback.",
    ],
    careers: ["Content Writer", "Copywriter", "SEO Writer", "Social Media Writer", "Freelance writer"],
    skills: ["Research", "Structure", "SEO writing", "Editing", "Brief handling"],
    finalProject:
      "Produce a portfolio of four pieces in different formats for one real business, each with its brief, and a short note on the research behind each.",
    curriculumSource: SOURCE,
    modules: [
      {
        title: "Module 1 — Research and Structure",
        summary: "The work before the writing.",
        lessons: [
          { title: "What Content Writing Is", minutes: 16, preview: true, objective: "Understand the job and its standards.", covers: ["Content, copy and journalism compared", "Writing for a busy, sceptical reader", "Who the client is really trying to reach"] },
          { title: "Researching Properly", minutes: 22, objective: "Know more than your reader before you write.", covers: ["Primary sources over summaries of summaries", "Judging whether a source is trustworthy", "Taking notes you can cite later"] },
          { title: "Structure and Outlining", minutes: 20, objective: "Plan a piece that holds together.", covers: ["Answer first, detail after", "Sub-headings that let it be skimmed", "The outline that makes drafting fast"] },
        ],
        quiz: [
          { prompt: "Where should an article answer the question in the title?", options: [{ text: "In the first paragraph", correct: true }, { text: "In the conclusion" }, { text: "Halfway down" }, { text: "It should not answer it directly" }] },
          { prompt: "Which is the stronger source?", options: [{ text: "The original report itself", correct: true }, { text: "A blog summarising a news story about the report" }, { text: "A social media post about it" }, { text: "An AI summary" }] },
          { prompt: "What does outlining before drafting achieve?", options: [{ text: "Faster drafting and a piece that holds together", correct: true }, { text: "A higher word count" }, { text: "Better search ranking on its own" }, { text: "Nothing useful" }] },
        ],
      },
      {
        title: "Module 2 — Writing for Formats",
        summary: "Articles, product copy, email and scripts each work differently.",
        lessons: [
          { title: "Articles and Blog Posts", minutes: 22, objective: "Write long-form that gets finished.", covers: ["Openings that earn the next paragraph", "Length driven by the question, not a word count", "Endings that give the reader somewhere to go"] },
          { title: "Product and Sales Copy", minutes: 22, objective: "Write words that help someone decide.", covers: ["Benefits led by features as proof", "Answering objections in the copy", "Honesty — overselling causes returns"] },
          { title: "Email and Scripts", minutes: 20, objective: "Write for the inbox and the ear.", covers: ["Subject lines and preview text", "Short paragraphs, one action", "Scripts: written to be spoken, not read"] },
        ],
        quiz: [
          { prompt: "Which is a benefit rather than a feature?", options: [{ text: "Survives a hundred washes", correct: true }, { text: "100% cotton" }, { text: "Double-stitched" }, { text: "Four colours available" }] },
          { prompt: "How should a video script differ from an article?", options: [{ text: "Written to be spoken aloud — shorter sentences, plainer words", correct: true }, { text: "Longer and more formal" }, { text: "With more sub-headings" }, { text: "There is no difference" }] },
          { prompt: "What decides whether a marketing email is read?", options: [{ text: "The subject line", correct: true }, { text: "The images" }, { text: "The length" }, { text: "The send time alone" }] },
        ],
        activity: {
          title: "Practical — One subject, four formats",
          instructions: "Take one subject and write it four ways: a 700-word article, a product description, a marketing email, and a 60-second video script. Submit all four with a paragraph on what changed between them and why.",
        },
      },
      {
        title: "Module 3 — SEO, Editing and Working With Clients",
        summary: "Being found, being correct, and being paid.",
        lessons: [
          { title: "Writing for Search", minutes: 22, objective: "Rank without writing badly.", covers: ["Keyword research and search intent", "Titles, meta descriptions, headings", "Why keyword stuffing now fails"] },
          { title: "Editing Your Own Work", minutes: 22, objective: "Turn a draft into publishable writing.", covers: ["Cutting the first two paragraphs", "Clarity, rhythm and reading aloud", "Fact-checking every name, number and date"] },
          { title: "AI, Briefs and Feedback", minutes: 22, objective: "Work professionally with tools and clients.", covers: ["What AI drafts well and what it invents", "Disclosure, and the client's own policy", "Taking feedback without rewriting everything"] },
        ],
        quiz: [
          { prompt: "Why does keyword stuffing fail now?", options: [{ text: "Search engines detect it and readers distrust it", correct: true }, { text: "It is against the law" }, { text: "It slows the page" }, { text: "It does not fail" }] },
          { prompt: "What must a writer always do with AI-drafted text?", options: [{ text: "Check every fact, name, number and citation", correct: true }, { text: "Publish it as-is if it reads well" }, { text: "Change a few words" }, { text: "Run it through a second AI" }] },
          { prompt: "A first draft opens with two paragraphs of background. What usually improves it?", options: [{ text: "Deleting them and starting at the third", correct: true }, { text: "Adding a summary above them" }, { text: "Making them longer" }, { text: "Moving them to the end" }] },
        ],
      },
    ],
  }),

  scaffold({
    slug: "remote-work-and-digital-professionalism",
    title: "Remote Work and Digital Professionalism",
    categorySlug: CAT,
    courseCode: "HS-RW-01",
    summary:
      "Work well with people you never meet — communication, tools, time zones, trust and the habits that keep remote jobs.",
    description: `
Remote work is an opportunity for Pakistan: skills can be sold anywhere without leaving home. It is also a set of habits nobody is taught, and people lose remote jobs for reasons that have nothing to do with ability.

This course covers written communication that prevents misunderstanding, working across time zones, being visible without being watched, the tools every remote team uses, and the security expectations a serious client will have.
`.trim(),
    level: "beginner",
    durationWeeks: 6,
    learningHours: 24,
    prerequisites: "Reliable internet and a computer. Working English for international clients.",
    targetLearners: "Anyone working remotely or wanting to, freelancers with overseas clients, and people moving from an office to home work.",
    objectives: [
      "Communicate in writing so you are understood first time.",
      "Work productively without supervision.",
      "Handle time zones and asynchronous work.",
      "Use the standard remote toolset competently.",
      "Meet the security and professionalism a client expects.",
    ],
    outcomes: [
      "Write updates, messages and emails that need no clarification.",
      "Run and take part in a video meeting properly.",
      "Manage your own time and report progress without being asked.",
      "Use shared documents, chat and project tools.",
      "Set up a workspace and routine that is sustainable.",
      "Apply basic security: passwords, two-factor, safe file handling.",
    ],
    careers: ["Remote employee", "Virtual Assistant", "Remote Customer Support", "Freelancer with overseas clients", "Distributed team member"],
    skills: ["Written communication", "Async work", "Time management", "Collaboration tools", "Digital security"],
    finalProject:
      "Run a one-week simulation: keep a daily written update, deliver one piece of work to a deadline, hold one recorded video meeting, and submit a reflection on what went wrong and what you changed.",
    curriculumSource: SOURCE,
    modules: [
      {
        title: "Module 1 — Communicating Without a Room",
        summary: "Writing clearly is the core remote skill.",
        lessons: [
          { title: "Written Communication That Works", minutes: 22, preview: true, objective: "Be understood the first time.", covers: ["Context, request, deadline — in that order", "Tone without body language, and how it is misread", "When to write and when to call"] },
          { title: "Meetings and Video Calls", minutes: 20, objective: "Run and attend calls that are worth the time.", covers: ["Agenda, or no meeting", "Camera, audio, background, and being on time across zones", "Notes and actions afterwards"] },
          { title: "Asynchronous Work", minutes: 20, objective: "Work well when nobody is online at the same time.", covers: ["Writing so nobody has to wait for an answer", "Handover notes at end of day", "Respecting others' working hours"] },
        ],
        quiz: [
          { prompt: "What should a work message contain?", options: [{ text: "Context, the specific request, and the deadline", correct: true }, { text: "A greeting and the request" }, { text: "As much detail as possible" }, { text: "Only the request" }] },
          { prompt: "Why do written messages get misread more than spoken ones?", options: [{ text: "There is no tone of voice or body language to soften them", correct: true }, { text: "People read too quickly" }, { text: "Translation errors" }, { text: "They do not" }] },
          { prompt: "You finish your day with work half-done and colleagues asleep. What do you do?", options: [{ text: "Write a handover note saying where it stands and what is next", correct: true }, { text: "Wait and explain tomorrow" }, { text: "Message them anyway" }, { text: "Nothing" }] },
        ],
      },
      {
        title: "Module 2 — Managing Yourself",
        summary: "Structure, visibility and sustainability without a manager in the room.",
        lessons: [
          { title: "Time and Task Management", minutes: 22, objective: "Get work done without supervision.", covers: ["Planning a day and protecting focused time", "Estimating, and why everyone underestimates", "Distraction at home, handled practically"] },
          { title: "Being Visible Without Being Watched", minutes: 20, objective: "Show progress so nobody has to chase you.", covers: ["Proactive updates before being asked", "Raising a delay early, which is always forgiven late", "Recording what you delivered"] },
          { title: "Workspace and Sustainability", minutes: 20, objective: "Set up so you can keep doing this.", covers: ["Physical setup on a small budget", "Separating work and home when they share a room", "Load shedding and connectivity contingencies"] },
        ],
        quiz: [
          { prompt: "You will miss a deadline by two days. When do you say so?", options: [{ text: "As soon as you know", correct: true }, { text: "On the deadline" }, { text: "After it passes, with the finished work" }, { text: "Only if asked" }] },
          { prompt: "What is the purpose of proactive updates?", options: [{ text: "Nobody has to chase you, which is what builds trust remotely", correct: true }, { text: "To appear busy" }, { text: "To fill the chat" }, { text: "They are not necessary" }] },
          { prompt: "Which are sensible contingencies for a Pakistani remote worker?", type: "multiple", options: [{ text: "A backup internet connection or mobile data", correct: true }, { text: "A UPS or charged laptop for load shedding", correct: true }, { text: "Telling clients your real availability", correct: true }, { text: "Promising 24-hour availability" }] },
        ],
        activity: {
          title: "Practical — A week of working remotely",
          instructions: "For five working days: plan each morning, send a daily written update to someone real, deliver one thing to a deadline you set publicly, and keep a log of interruptions. Submit the updates, the log, and what you changed by Friday.",
        },
      },
      {
        title: "Module 3 — Tools, Security and Professionalism",
        summary: "The toolset and the standards a serious client assumes.",
        lessons: [
          { title: "The Remote Toolset", minutes: 22, objective: "Use what distributed teams actually use.", covers: ["Chat, video, shared documents, project boards", "File naming and version control for non-developers", "Choosing tools the client already has"] },
          { title: "Digital Security", minutes: 22, objective: "Meet the security a client expects.", covers: ["Password managers and two-factor authentication", "Handling client files and access", "Public Wi-Fi, shared computers, and device security"] },
          { title: "Professional Conduct Online", minutes: 20, objective: "Conduct yourself so you are trusted at a distance.", covers: ["Your public profile as part of your CV", "Confidentiality, and what you may show in a portfolio", "Cultural differences in directness and hierarchy"] },
        ],
        quiz: [
          { prompt: "Why is two-factor authentication important for remote work?", options: [{ text: "A stolen password alone no longer gives access to client systems", correct: true }, { text: "It speeds up login" }, { text: "Clients require it by law" }, { text: "It encrypts files" }] },
          { prompt: "Can you put client work in your public portfolio?", options: [{ text: "Only with permission, or where the agreement allows it", correct: true }, { text: "Always — you made it" }, { text: "Never" }, { text: "Only after a year" }] },
          { prompt: "Which file name is better for shared work?", options: [{ text: "proposal-hunarsaaz-2026-03-14-v2.docx", correct: true }, { text: "final.docx" }, { text: "final FINAL real.docx" }, { text: "doc1.docx" }] },
        ],
      },
    ],
  }),
];
