import type { CategoryContent } from "./types.ts";

/** The nine subject areas the catalogue is organised into. */
export const categoryContent: CategoryContent[] = [
  {
    slug: "it-and-digital-skills",
    title: "Information Technology & Digital Skills",
    order: 1,
    icon: "monitor",
    summary:
      "The practical computer skills employers ask for first — spreadsheets, data, design, web and video.",
    description: `
These are the skills that turn a general education into work. Every one of them is asked for in job advertisements across Pakistan, and every one can be practised on a modest laptop at home.

Start with Microsoft Excel if you are unsure — more roles list it than any other single skill, and it makes the rest easier to learn.
`.trim(),
  },
  {
    slug: "ai-and-emerging-technologies",
    title: "Artificial Intelligence & Emerging Technologies",
    order: 2,
    icon: "sparkles",
    summary:
      "What AI actually is, what it can and cannot do, and how to use it in real work rather than talk about it.",
    description: `
A great deal written about artificial intelligence is either sales material or alarm. These courses are neither. They explain how the tools work, where they are genuinely useful, where they fail, and what using them responsibly requires.

Begin with **AI for Everyone** whatever your background. The rest assume it.
`.trim(),
  },
  {
    slug: "freelancing-and-remote-work",
    title: "Freelancing & Remote Work",
    order: 3,
    icon: "laptop",
    summary:
      "Earning from clients at home and abroad — finding them, pricing the work, and getting paid.",
    description: `
Freelancing is how a large number of Pakistanis now earn, and the skill that decides income is rarely the technical one. It is finding clients, quoting properly, communicating clearly and delivering on time.

These courses are about the business of freelancing, not just the craft.
`.trim(),
  },
  {
    slug: "communication-and-professional-skills",
    title: "Communication & Professional Skills",
    order: 4,
    icon: "message",
    summary:
      "Writing, speaking and conducting yourself in a way that gets you taken seriously at work.",
    description: `
Technical ability gets you the interview. How you write an email, run a meeting and handle a disagreement decides what happens afterwards.

These courses are practical and specific — real messages, real meetings, real situations — not general advice about confidence.
`.trim(),
  },
  {
    slug: "leadership-and-employability",
    title: "Leadership & Employability",
    order: 5,
    icon: "compass",
    summary:
      "Getting hired, working well with others, and taking responsibility for more than your own task.",
    description: `
Employability is a set of learnable habits: how you prepare for an interview, how you work in a team, how you make a decision when the information is incomplete.

Useful whether you are applying for a first job or being asked to lead people for the first time.
`.trim(),
  },
  {
    slug: "entrepreneurship-and-financial-literacy",
    title: "Entrepreneurship & Financial Literacy",
    order: 6,
    icon: "trending",
    summary:
      "Starting something of your own, and understanding money well enough to keep it running.",
    description: `
Most small businesses do not fail for lack of effort. They fail because nobody worked out the numbers, or because personal and business money were never separated.

These courses cover both sides: building the idea, and the financial literacy to survive it.
`.trim(),
  },
  {
    slug: "mental-wellbeing",
    title: "Mental Wellbeing & Stress Management",
    order: 7,
    icon: "heart",
    summary:
      "Practical, everyday wellbeing education — understanding stress and looking after yourself.",
    description: `
These are **educational** courses about wellbeing. They are not therapy, they are not diagnosis, and they are not a substitute for care from a qualified professional.

If you are struggling, please speak to a doctor or a mental health professional. These courses sit alongside that, never in place of it.
`.trim(),
  },
  {
    slug: "burnout-prevention",
    title: "Burnout Prevention",
    order: 8,
    icon: "battery",
    summary:
      "Recognising burnout early, and changing the conditions that cause it rather than enduring them.",
    description: `
Burnout is not weakness and it is not solved by working harder. It has recognisable stages, identifiable causes, and practical remedies — most of which are about workload, boundaries and recovery rather than attitude.

Educational, not clinical. If burnout has become a health problem, see a professional.
`.trim(),
  },
  {
    slug: "resilience-and-workplace-wellbeing",
    title: "Resilience & Workplace Wellbeing",
    order: 9,
    icon: "shield",
    summary:
      "Coping with change and pressure, and helping build a workplace where others can too.",
    description: `
Resilience is often described as toughness. It is closer to a set of skills: how you interpret a setback, what support you have arranged in advance, and how you recover.

These courses cover the personal side and the shared one — what a team and a manager can do to make a workplace bearable and productive.
`.trim(),
  },
];
