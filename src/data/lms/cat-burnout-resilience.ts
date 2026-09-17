import { scaffold } from "./scaffold.ts";
import type { CourseContent, QuizContent } from "./types.ts";
import type { ModuleSpec } from "./scaffold.ts";

const BURN = "burnout-prevention";
const RES = "resilience-and-workplace-wellbeing";
const SOURCE =
  "Syllabus developed by Hunarsaaz. No NAVTTC qualification was consulted — navttc.gov.pk is unreachable from this environment — and no NAVTTC claim is made.";

const NOTICE = `
**This is an educational course, not healthcare.** Burnout and sustained stress can become health problems. This course does not diagnose or treat, and does not replace a doctor or mental health professional.

If exhaustion is affecting your health, please see a qualified professional.
`.trim();

const CERT =
  "Complete every lesson, pass the quizzes at 60%, and submit the reflection. This certificate records attendance at an educational course. It is not a clinical or counselling qualification.";

function mod(
  title: string,
  summary: string,
  lessons: [string, string, string[]][],
  quiz: QuizContent["questions"],
  activity?: { title: string; instructions: string },
): ModuleSpec {
  return {
    title,
    summary,
    lessons: lessons.map(([lessonTitle, objective, covers], index) => ({
      title: lessonTitle,
      minutes: 20,
      preview: index === 0 && title.startsWith("Module 1"),
      objective,
      covers,
    })),
    quiz,
    activity: activity ? { ...activity, maxPoints: 100 } : undefined,
  };
}

export const burnoutCourses: CourseContent[] = [
  scaffold({
    slug: "understanding-burnout",
    title: "Understanding Burnout",
    categorySlug: BURN,
    courseCode: "HS-BO-01",
    summary: "What burnout actually is, how it develops, and how to recognise it early — in yourself and in others.",
    description: `
${NOTICE}

Burnout is not ordinary tiredness and it is not a character weakness. It develops over months from sustained demand without adequate recovery or control, and it has recognisable stages.

This course covers what it is, what causes it, how it differs from stress and depression, and — most usefully — how to notice it in the stage where something can still be done relatively easily.
`.trim(),
    level: "beginner",
    durationWeeks: 4,
    learningHours: 16,
    prerequisites: "None.",
    targetLearners: "Anyone in sustained demanding work, managers responsible for others, and people who suspect this describes them.",
    objectives: [
      "Define burnout and distinguish it from stress and depression.",
      "Describe its dimensions and how it develops.",
      "Recognise early warning signs.",
      "Identify the workplace conditions that cause it.",
      "Know what helps and when professional help is needed.",
    ],
    outcomes: [
      "Explain exhaustion, cynicism and reduced efficacy as its three dimensions.",
      "Describe the stages from over-commitment to breakdown.",
      "Recognise early signs in yourself and colleagues.",
      "Name the six workplace factors most associated with burnout.",
      "Explain why it is a workplace problem rather than an individual failing.",
      "Identify when professional help is needed.",
    ],
    careers: ["Applies to everyone", "Managers", "Healthcare and teaching", "High-demand roles", "HR staff"],
    skills: ["Burnout literacy", "Early recognition", "Self-assessment", "Workplace analysis"],
    finalProject: "Assess your own or a described workplace against the six factors. Identify the two largest risks, what would reduce them, and who would have to act. Submit conclusions only.",
    certificateCriteria: CERT,
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — What Burnout Is", "Definition, dimensions and development.", [
        ["Burnout, Stress and Depression", "Distinguish three things often confused.", ["Burnout as a response to sustained workplace demand", "How it differs from acute stress", "Overlap with depression, and why a professional should distinguish them"]],
        ["The Three Dimensions", "Recognise its shape.", ["Exhaustion that rest does not resolve", "Cynicism and detachment from work and people", "Reduced sense of accomplishment"]],
        ["How It Develops", "See the stages.", ["Over-commitment and enthusiasm as a starting point", "Gradual withdrawal and neglect of needs", "Why it is usually noticed far too late"]],
      ], [
        { prompt: "Burnout is a response to:", options: [{ text: "Sustained demand without adequate recovery or control", correct: true }, { text: "A single stressful event" }, { text: "Personal weakness" }, { text: "Poor time management alone" }] },
        { prompt: "Which are the three dimensions of burnout?", options: [{ text: "Exhaustion, cynicism, reduced efficacy", correct: true }, { text: "Stress, anxiety, depression" }, { text: "Tiredness, anger, absence" }, { text: "Workload, hours, pay" }] },
        { prompt: "Exhaustion in burnout is distinguished by:", options: [{ text: "Rest does not resolve it", correct: true }, { text: "Its severity" }, { text: "Occurring only at work" }, { text: "Coming on suddenly" }] },
      ]),
      mod("Module 2 — Causes and Recognition", "Where it comes from and how to spot it.", [
        ["The Workplace Factors", "Understand the six conditions.", ["Workload, control, reward, community, fairness, values", "Which matter most, and why control is central", "Why individual resilience training alone does not fix it"]],
        ["Early Warning Signs", "Notice it while it is still easy to address.", ["Dreading work, irritability, withdrawal", "Physical signs: sleep, illness, appetite", "Doing more hours and producing less"]],
        ["Recognising It in Others", "Notice in colleagues and staff.", ["Changes in behaviour and output", "Raising it without accusing or diagnosing", "What a manager can and cannot do"]],
      ], [
        { prompt: "Which workplace factor is most consistently linked to burnout?", options: [{ text: "Lack of control over one's own work", correct: true }, { text: "Salary level" }, { text: "Office layout" }, { text: "Company size" }] },
        { prompt: "Why is resilience training alone insufficient?", options: [{ text: "It places responsibility on the individual while the causes remain in the work", correct: true }, { text: "It is too expensive" }, { text: "People dislike it" }, { text: "It is always ineffective" }] },
        { prompt: "Which are early warning signs?", type: "multiple", options: [{ text: "Dreading the working day", correct: true }, { text: "Working longer and achieving less", correct: true }, { text: "Withdrawing from colleagues", correct: true }, { text: "Enjoying a holiday" }] },
      ], { title: "Reflection — Six-factor assessment", instructions: "Assess your own workplace, or one you know well, against the six factors. Rate each and give an example. Identify the two largest risks, what would reduce them, and who would have to act. Submit conclusions only." }),
      mod("Module 3 — Recovery and Help", "What helps, and where education ends.", [
        ["What Actually Helps", "Address cause as well as symptom.", ["Recovery: real rest, and how much is needed", "Changing conditions — the part that lasts", "Why a holiday alone does not fix burnout"]],
        ["Talking About It", "Raise it at work.", ["Talking to a manager constructively", "What to ask for specifically", "When the answer is that the job must change"]],
        ["Professional Help", "Know when to go.", ["Signs that it needs a professional", "What a doctor or psychologist can offer", "Acting early rather than at collapse"]],
      ], [
        { prompt: "Why does a holiday alone rarely resolve burnout?", options: [{ text: "The conditions that caused it are unchanged on return", correct: true }, { text: "Holidays are too short" }, { text: "It does resolve it" }, { text: "Rest is not relevant" }] },
        { prompt: "What should someone ask a manager for?", options: [{ text: "Specific changes to workload, control or expectations", correct: true }, { text: "Sympathy" }, { text: "Time off only" }, { text: "Nothing — it is a personal matter" }] },
        { prompt: "When should professional help be sought?", options: [{ text: "When exhaustion persists, health is affected, or functioning is impaired", correct: true }, { text: "Only after leaving the job" }, { text: "Only in crisis" }, { text: "After trying everything else" }] },
      ]),
    ],
  }),

  scaffold({
    slug: "preventing-workplace-burnout",
    title: "Preventing Workplace Burnout",
    categorySlug: BURN,
    courseCode: "HS-BO-02",
    summary: "What organisations and managers can change — because burnout is caused by conditions, not by insufficient resilience.",
    description: `
${NOTICE}

Most organisational responses to burnout put the responsibility on the person suffering it: a wellbeing session, a mindfulness app, advice on sleep. These do not address workload, control or fairness, which is where the problem lives.

This course is for managers and employers. It covers designing work that does not exhaust people, spotting risk across a team, and the specific changes that reduce burnout — most of which cost little.
`.trim(),
    level: "intermediate",
    durationWeeks: 5,
    learningHours: 20,
    prerequisites: "Understanding Burnout, or equivalent knowledge. Most useful for those responsible for others' work.",
    targetLearners: "Managers, supervisors, business owners, HR staff, and team leads.",
    objectives: [
      "Identify burnout risk within a team.",
      "Design workload and roles that are sustainable.",
      "Increase the control people have over their own work.",
      "Build recognition and fairness into ordinary practice.",
      "Respond appropriately to someone who is struggling.",
    ],
    outcomes: [
      "Run a team assessment against the six factors.",
      "Redistribute workload using evidence rather than impression.",
      "Increase autonomy without losing accountability.",
      "Recognise contribution specifically and regularly.",
      "Hold a supportive conversation without diagnosing.",
      "Make a case to senior management for a change.",
    ],
    careers: ["Manager", "Supervisor", "HR", "Business owner", "Team lead"],
    skills: ["Workload design", "Team assessment", "Autonomy", "Recognition", "Supportive management"],
    finalProject: "Produce a burnout risk assessment for a real team with three specific changes, their cost, who must approve them, and how you would measure whether they worked.",
    certificateCriteria: CERT,
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — Burnout as a Design Problem", "Where the causes actually sit.", [
        ["Why Individual Solutions Fail", "Understand why wellbeing perks do not work.", ["Wellbeing initiatives beside unchanged workloads", "The message sent when the response is a yoga class", "Where responsibility properly sits"]],
        ["Assessing Your Team", "Find out rather than assume.", ["Asking in a way that gets honest answers", "Signals visible in data: absence, turnover, overtime, errors", "Anonymity, and why it matters"]],
        ["Workload That Is Sustainable", "Set demand people can meet.", ["Realistic capacity, including the invisible work", "Peaks, and recovery after them", "Chronic understaffing described as efficiency"]],
      ], [
        { prompt: "Why do wellbeing perks alone fail to reduce burnout?", options: [{ text: "They leave workload, control and fairness unchanged", correct: true }, { text: "Employees do not use them" }, { text: "They are too expensive" }, { text: "They do reduce it" }] },
        { prompt: "Which data signal team burnout risk?", type: "multiple", options: [{ text: "Rising absence", correct: true }, { text: "Increasing turnover", correct: true }, { text: "Sustained overtime", correct: true }, { text: "Use of annual leave" }] },
        { prompt: "How should a team be asked about burnout risk?", options: [{ text: "Anonymously, so answers can be honest", correct: true }, { text: "In a team meeting" }, { text: "By each manager individually" }, { text: "It should not be asked" }] },
      ]),
      mod("Module 2 — The Changes That Work", "Control, reward, fairness and community.", [
        ["Giving People Control", "Increase autonomy without losing accountability.", ["Deciding how, not only what", "Flexibility where the work permits", "Consulting on changes that affect people"]],
        ["Recognition and Fairness", "Make effort visible and treat people equally.", ["Specific recognition rather than general praise", "Perceived unfairness as a strong burnout driver", "Transparency in workload, pay and promotion"]],
        ["Community at Work", "Build relationships that sustain people.", ["Isolation in remote and hybrid teams", "Conflict left unaddressed", "Time for colleagues to be colleagues"]],
      ], [
        { prompt: "Which is the more powerful form of recognition?", options: [{ text: "Specific praise for a particular contribution", correct: true }, { text: "A general team thank-you" }, { text: "An annual award" }, { text: "A bonus alone" }] },
        { prompt: "Perceived unfairness at work is:", options: [{ text: "One of the strongest drivers of burnout", correct: true }, { text: "A minor irritation" }, { text: "Unrelated to burnout" }, { text: "Only about pay" }] },
        { prompt: "Increasing autonomy means:", options: [{ text: "Letting people decide how the work is done", correct: true }, { text: "Removing accountability" }, { text: "Reducing supervision entirely" }, { text: "Fewer hours" }] },
      ], { title: "Practical — Team risk assessment", instructions: "Assess a real team against the six factors, using data where you have it. Propose three specific changes with cost, approval needed, and how you would measure success." }),
      mod("Module 3 — Responding to Individuals", "When someone is already struggling.", [
        ["Noticing and Raising It", "Approach someone appropriately.", ["Describing what you have observed, not diagnosing", "A private conversation, without pressure", "Listening rather than offering solutions"]],
        ["What You Can Offer", "Make practical adjustments.", ["Temporary workload changes", "Flexibility, leave, and reallocating work", "Following up rather than treating it as closed"]],
        ["Limits and Escalation", "Know what is not yours to handle.", ["When to involve HR or occupational health", "Confidentiality and its limits", "Your own wellbeing as a manager"]],
      ], [
        { prompt: "A team member seems exhausted and withdrawn. How should you raise it?", options: [{ text: "Privately, describing what you have observed, and listening", correct: true }, { text: "In a team meeting" }, { text: "By reducing their work without discussion" }, { text: "By suggesting they may be burnt out" }] },
        { prompt: "What should a manager avoid doing?", options: [{ text: "Diagnosing a mental health condition", correct: true }, { text: "Adjusting workload temporarily" }, { text: "Offering flexibility" }, { text: "Following up later" }] },
        { prompt: "After making an adjustment, what matters most?", options: [{ text: "Following up to see whether it helped", correct: true }, { text: "Recording it formally" }, { text: "Informing the team" }, { text: "Nothing further" }] },
      ]),
    ],
  }),

  scaffold({
    slug: "managing-workload-and-energy",
    title: "Managing Workload and Energy",
    categorySlug: BURN,
    courseCode: "HS-BO-03",
    summary: "Working with your energy rather than against it — prioritising, protecting attention, and recovering properly.",
    description: `
${NOTICE}

Time management assumes every hour is equal. They are not. An hour of clear focus is worth several of depleted attention, and most advice ignores this entirely.

This course covers managing energy as well as time: knowing when you work best, protecting attention from constant interruption, prioritising when everything is urgent, and building recovery into the working week rather than hoping for it at the weekend.
`.trim(),
    level: "beginner",
    durationWeeks: 5,
    learningHours: 20,
    prerequisites: "None.",
    targetLearners: "Anyone with more work than time — knowledge workers, freelancers, managers, students.",
    objectives: [
      "Understand energy as a resource distinct from time.",
      "Identify your own patterns of focus.",
      "Prioritise when everything appears urgent.",
      "Protect attention from interruption.",
      "Build recovery into the working day and week.",
    ],
    outcomes: [
      "Map your energy across a typical day and week.",
      "Match demanding work to your best hours.",
      "Apply a prioritisation method to a real list.",
      "Reduce interruptions and context switching.",
      "Take breaks that actually restore.",
      "Recognise chronic overload that no method will fix.",
    ],
    careers: ["Applies to everyone", "Knowledge workers", "Freelancers", "Managers", "Students"],
    skills: ["Energy management", "Prioritisation", "Focus", "Interruption management", "Recovery"],
    finalProject: "Map your energy for two weeks, restructure one week around it, and report what changed — including whether the constraint turned out to be workload rather than method.",
    certificateCriteria: CERT,
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — Energy, Not Just Time", "A different way of looking at capacity.", [
        ["Why Time Management Is Not Enough", "See the limits of the usual advice.", ["Hours are not interchangeable", "Four types of energy: physical, mental, emotional, purpose", "Why a full diary can still produce nothing"]],
        ["Mapping Your Energy", "Find your own pattern.", ["Tracking focus and energy across a fortnight", "Identifying your best hours", "Patterns across a week, and after particular activities"]],
        ["Matching Work to Energy", "Use your best hours for the work that needs them.", ["Demanding work in peak hours", "Administrative work in the troughs", "Protecting peak hours from meetings"]],
      ], [
        { prompt: "Why is time management alone insufficient?", options: [{ text: "Hours differ in the quality of attention available", correct: true }, { text: "There is never enough time" }, { text: "Diaries are unreliable" }, { text: "It is sufficient" }] },
        { prompt: "What should be scheduled in your highest-energy hours?", options: [{ text: "The most cognitively demanding work", correct: true }, { text: "Email and admin" }, { text: "Meetings" }, { text: "Whatever arrived first" }] },
        { prompt: "How long should energy be tracked to find a pattern?", options: [{ text: "At least two weeks", correct: true }, { text: "One day" }, { text: "Three months" }, { text: "It cannot be tracked" }] },
      ]),
      mod("Module 2 — Prioritising and Focusing", "Deciding what not to do, and protecting the doing.", [
        ["Prioritising Properly", "Decide when everything seems urgent.", ["Urgent and important separated", "Saying no, and offering an alternative", "What happens if this is not done — the clarifying question"]],
        ["Protecting Attention", "Reduce the cost of interruption.", ["What context switching actually costs", "Notifications, open-plan offices, and the phone", "Blocks of protected time, defended"]],
        ["Single-Tasking", "Do one thing at a time, properly.", ["Why multitasking is switching, not parallel work", "Batching similar work", "Finishing rather than accumulating started work"]],
      ], [
        { prompt: "What is the clarifying question when everything seems urgent?", options: [{ text: "What actually happens if this is not done?", correct: true }, { text: "Who asked for it first?" }, { text: "Which takes least time?" }, { text: "Which is most interesting?" }] },
        { prompt: "What does context switching cost?", options: [{ text: "Time and accuracy, as attention reorients each time", correct: true }, { text: "Nothing measurable" }, { text: "Only a few seconds" }, { text: "It improves variety" }] },
        { prompt: "Which protect focus?", type: "multiple", options: [{ text: "Turning off notifications", correct: true }, { text: "Blocks of defended time", correct: true }, { text: "Batching similar tasks", correct: true }, { text: "Keeping email open" }] },
      ], { title: "Practical — Restructure one week", instructions: "After mapping your energy for two weeks, restructure one week to match: demanding work in peak hours, protected blocks, batched admin. Report what changed and what got in the way." }),
      mod("Module 3 — Recovery and Limits", "Restoring, and recognising what method cannot fix.", [
        ["Recovery Within the Day", "Build it into working hours.", ["Short breaks that restore, and ones that do not", "Movement and stepping away from the screen", "Why working through lunch reduces output"]],
        ["Weekly and Longer Recovery", "Recover across longer cycles.", ["Protecting at least one full day", "Taking leave properly", "Sleep as the foundation"]],
        ["When the Problem Is the Workload", "Recognise the limit of self-management.", ["Signs that no method will fix it", "Raising it with evidence", "Why more efficiency can make overload worse"]],
      ], [
        { prompt: "Working through lunch usually:", options: [{ text: "Reduces total output through the afternoon", correct: true }, { text: "Increases output" }, { text: "Has no effect" }, { text: "Is the mark of commitment" }] },
        { prompt: "When is the workload itself the problem?", options: [{ text: "When good prioritisation and focus still leave essential work undone", correct: true }, { text: "Whenever you feel busy" }, { text: "Whenever there is overtime" }, { text: "It never is" }] },
        { prompt: "Why can improving efficiency make overload worse?", options: [{ text: "The capacity created is filled with more work", correct: true }, { text: "Efficiency causes errors" }, { text: "It does not" }, { text: "It reduces quality" }] },
      ]),
    ],
  }),

  scaffold({
    slug: "healthy-boundaries-at-work",
    title: "Healthy Boundaries at Work",
    categorySlug: BURN,
    courseCode: "HS-BO-04",
    summary: "Saying no, protecting your time, and handling the people who do not accept limits — without damaging your position.",
    description: `
${NOTICE}

Most advice on boundaries assumes you can simply decline. In a workplace with real hierarchy and real economic pressure, that advice is useless without the specific words and the judgement of when to use them.

This course is practical. It covers what boundaries are, how to set them clearly, what to say in the situations that recur, and what to do when they are ignored — including recognising when the job itself is the problem.
`.trim(),
    level: "beginner",
    durationWeeks: 4,
    learningHours: 16,
    prerequisites: "None.",
    targetLearners: "Anyone who struggles to decline requests, junior staff, freelancers, and people whose work has expanded without limit.",
    objectives: [
      "Understand what boundaries are and why they are not selfish.",
      "Identify where your own are being crossed.",
      "Decline requests clearly without damaging relationships.",
      "Hold a boundary when it is tested.",
      "Recognise when a boundary cannot be held in a given job.",
    ],
    outcomes: [
      "Distinguish boundaries from rigidity.",
      "Identify your own limits on time, workload and availability.",
      "Use specific language to decline and to negotiate.",
      "Respond when a boundary is ignored.",
      "Handle the guilt that follows saying no.",
      "Recognise a workplace where boundaries are not possible.",
    ],
    careers: ["Applies to everyone", "Junior staff", "Freelancers", "Caring professions", "Remote workers"],
    skills: ["Assertiveness", "Declining requests", "Negotiation", "Availability limits", "Self-advocacy"],
    finalProject: "Identify three boundaries you need. Write the exact words for each. Use at least one in a real situation and report what happened — including if it went badly.",
    certificateCriteria: CERT,
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — What Boundaries Are", "Limits, not walls.", [
        ["Boundaries and Why They Matter", "Understand the purpose.", ["A limit on what you will do, not a rejection of people", "Why their absence leads to resentment and exhaustion", "Boundaries as something others can rely on"]],
        ["Finding Where Yours Are", "Identify your own limits.", ["Noticing resentment as a signal", "Time, workload, availability, behaviour", "Limits that are yours versus ones you absorbed"]],
        ["Why Saying No Is Hard", "Understand the obstacles honestly.", ["Hierarchy and job security", "Cultural expectations of accommodation", "The fear of being seen as uncooperative"]],
      ], [
        { prompt: "A boundary is:", options: [{ text: "A limit on what you will do", correct: true }, { text: "A rejection of the person asking" }, { text: "A refusal to cooperate" }, { text: "A rule for others" }] },
        { prompt: "What does persistent resentment usually signal?", options: [{ text: "A boundary being crossed", correct: true }, { text: "A personality problem" }, { text: "Too much work" }, { text: "Dislike of a colleague" }] },
        { prompt: "What happens when boundaries are consistently absent?", options: [{ text: "Resentment and exhaustion build", correct: true }, { text: "Relationships improve" }, { text: "Nothing" }, { text: "Promotion follows" }] },
      ]),
      mod("Module 2 — Setting and Holding Them", "The words, and what to do when they are tested.", [
        ["How to Say No", "Decline clearly without damaging the relationship.", ["Being clear rather than vague — vagueness invites another attempt", "Offering an alternative where you can", "Explaining briefly, and not over-justifying"]],
        ["Negotiating Instead", "Find the middle where refusal is impossible.", ["Yes, and what drops off the list?", "Renegotiating a deadline with evidence", "Partial help with a stated limit"]],
        ["When They Are Ignored", "Respond to repeated crossing.", ["Restating calmly rather than escalating emotion", "Putting it in writing", "Escalating, and when"]],
      ], [
        { prompt: "Why is a vague refusal a problem?", options: [{ text: "It invites another attempt, and the pressure repeats", correct: true }, { text: "It is impolite" }, { text: "It takes longer" }, { text: "It is not a problem" }] },
        { prompt: "A manager adds work to a full list. What is the useful response?", options: [{ text: "Ask which existing item should move, and let them choose", correct: true }, { text: "Accept and work later" }, { text: "Refuse outright" }, { text: "Accept and miss a deadline silently" }] },
        { prompt: "A boundary is repeatedly ignored. What comes next?", options: [{ text: "Restate it calmly and put it in writing", correct: true }, { text: "Raise your voice" }, { text: "Give up on it" }, { text: "Resign" }] },
      ], { title: "Practical — Use one boundary", instructions: "Identify three boundaries you need at work. Write the exact words for each. Use at least one in a real situation and report what you said, what happened, and how you felt afterwards — including if it went badly." }),
      mod("Module 3 — Living With Them", "Guilt, relationships and limits you cannot hold.", [
        ["Handling Guilt", "Expect discomfort and continue anyway.", ["Guilt as habit rather than evidence of wrongdoing", "Discomfort reducing with practice", "Distinguishing guilt from genuinely being unreasonable"]],
        ["Boundaries and Relationships", "Maintain both.", ["Why clear limits usually improve working relationships", "Consistency, and the cost of exceptions", "Colleagues who respond badly, and what that tells you"]],
        ["When the Job Makes Them Impossible", "Recognise the situation honestly.", ["Workplaces where limits are punished", "Chronic understaffing that no boundary solves", "Deciding whether to stay, and preparing if not"]],
      ], [
        { prompt: "Guilt after setting a reasonable boundary usually indicates:", options: [{ text: "Habit and unfamiliarity, not that you were wrong", correct: true }, { text: "That you were unreasonable" }, { text: "That the boundary was too strict" }, { text: "That you should apologise" }] },
        { prompt: "What does clear, consistent boundary-setting usually do to working relationships?", options: [{ text: "Improves them — people know where they stand", correct: true }, { text: "Damages them" }, { text: "Has no effect" }, { text: "Ends them" }] },
        { prompt: "A workplace punishes anyone who sets limits. What does this suggest?", options: [{ text: "The problem is the workplace, and staying has a cost worth weighing", correct: true }, { text: "Your boundaries are wrong" }, { text: "You need better wording" }, { text: "You should try harder" }] },
      ]),
    ],
  }),

  scaffold({
    slug: "sustainable-productivity",
    title: "Sustainable Productivity",
    categorySlug: BURN,
    courseCode: "HS-BO-05",
    summary: "Getting good work done over years rather than months — pace, systems and a definition of enough.",
    description: `
${NOTICE}

Productivity advice mostly optimises for a sprint. Careers are not sprints, and the person who produces brilliantly for eighteen months and then cannot work at all has not been productive.

This course is about pace. It covers systems that survive a bad week, deciding what "enough" means, working with your own limits rather than against them, and measuring output in a way that does not reward exhaustion.
`.trim(),
    level: "intermediate",
    durationWeeks: 5,
    learningHours: 20,
    prerequisites: "None. Managing Workload and Energy is a useful companion.",
    targetLearners: "Freelancers, knowledge workers, business owners, and anyone who has already burnt out once.",
    objectives: [
      "Define productivity in terms that do not reward overwork.",
      "Build systems that survive a bad week.",
      "Set a sustainable pace and hold it.",
      "Decide what enough looks like.",
      "Measure output honestly.",
    ],
    outcomes: [
      "Distinguish output from hours worked.",
      "Build a system that works when motivation is absent.",
      "Set a weekly pace you could maintain for a year.",
      "Define enough for a day, a week and a year.",
      "Identify the productivity advice that is really about working more.",
      "Plan a career at a pace that lasts.",
    ],
    careers: ["Freelancers", "Knowledge workers", "Business owners", "Managers", "Anyone recovering from burnout"],
    skills: ["Sustainable pace", "Systems design", "Realistic planning", "Output measurement", "Long-term thinking"],
    finalProject: "Design and run a sustainable working week for a month. Define enough in advance, track output and energy, and report whether you could maintain it for a year.",
    certificateCriteria: CERT,
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — Rethinking Productivity", "What we are actually measuring.", [
        ["Output, Not Hours", "Change the measure.", ["Why hours are a poor proxy for value", "Presenteeism, and being seen to be busy", "What your work is actually judged on"]],
        ["The Cost of Sprinting", "Understand what intensity borrows.", ["Short-term intensity against long-term capacity", "Recovery debt", "Why the exhausted high performer is not a model"]],
        ["Defining Enough", "Decide in advance what finished means.", ["Enough for a day, a week, a year", "Perfectionism, and diminishing returns", "Stopping when the work is good enough"]],
      ], [
        { prompt: "Why are hours worked a poor measure of productivity?", options: [{ text: "Output per hour falls sharply with fatigue", correct: true }, { text: "Hours are hard to record" }, { text: "They are a good measure" }, { text: "Employers ignore them" }] },
        { prompt: "What is the effect of defining 'enough' in advance?", options: [{ text: "You can stop, and the work has a recognisable end", correct: true }, { text: "Standards fall" }, { text: "You do less valuable work" }, { text: "Nothing" }] },
        { prompt: "Sustained intensity without recovery:", options: [{ text: "Borrows capacity from later, and it is repaid with interest", correct: true }, { text: "Builds endurance" }, { text: "Has no lasting cost" }, { text: "Is the mark of a strong worker" }] },
      ]),
      mod("Module 2 — Systems That Hold", "Working when motivation is absent.", [
        ["Systems Over Motivation", "Build something that does not depend on feeling like it.", ["Motivation as unreliable", "Routines and defaults that carry you", "Reducing the decisions each day requires"]],
        ["Designing for a Bad Week", "Plan for the weeks that go wrong.", ["A minimum viable week", "What to drop first, decided in advance", "Recovering without abandoning the system"]],
        ["Planning Realistically", "Plan for the person you actually are.", ["The planning fallacy — everyone underestimates", "Building in slack deliberately", "Reviewing estimates against outcomes"]],
      ], [
        { prompt: "Why build systems rather than rely on motivation?", options: [{ text: "Motivation is unreliable; systems work on bad days too", correct: true }, { text: "Motivation is not real" }, { text: "Systems are faster" }, { text: "Motivation is for beginners" }] },
        { prompt: "When should you decide what to drop in a difficult week?", options: [{ text: "In advance, while thinking clearly", correct: true }, { text: "During the week" }, { text: "Afterwards" }, { text: "Nothing should be dropped" }] },
        { prompt: "What is the planning fallacy?", options: [{ text: "Consistently underestimating how long work will take", correct: true }, { text: "Planning too much detail" }, { text: "Failing to plan" }, { text: "Over-planning" }] },
      ], { title: "Practical — A sustainable month", instructions: "Design a working week you believe you could maintain for a year. Define enough for each day. Run it for four weeks, tracking output and energy. Report whether it held, and what you would change." }),
      mod("Module 3 — Pace Over Years", "Careers, seasons and honest measurement.", [
        ["Seasons of Work", "Accept that capacity varies.", ["Periods of high output and periods of consolidation", "Life events, illness, family", "Planning for variation rather than constant peak"]],
        ["Measuring Honestly", "Track what matters.", ["Output and progress, not hours or activity", "Reviewing weekly and monthly", "Noticing decline early"]],
        ["The Long View", "Think in years.", ["Compounding skill over time", "Choosing work you can sustain", "Recognising that the pace you set now is the one you keep"]],
      ], [
        { prompt: "Capacity varying across months is:", options: [{ text: "Normal, and worth planning for", correct: true }, { text: "A sign of poor discipline" }, { text: "Avoidable with better systems" }, { text: "Rare" }] },
        { prompt: "What should be tracked instead of hours?", options: [{ text: "Output and meaningful progress", correct: true }, { text: "Tasks completed" }, { text: "Messages answered" }, { text: "Time at the desk" }] },
        { prompt: "Which productivity advice deserves scepticism?", options: [{ text: "Anything whose real content is working more hours", correct: true }, { text: "Advice about systems" }, { text: "Advice about rest" }, { text: "Advice about prioritisation" }] },
      ]),
    ],
  }),
];

export const resilienceCourses: CourseContent[] = [
  scaffold({
    slug: "building-personal-resilience",
    title: "Building Personal Resilience",
    categorySlug: RES,
    courseCode: "HS-RS-01",
    summary: "Recovering from setbacks — a set of learnable skills, not a personality trait you either have or lack.",
    description: `
${NOTICE}

Resilience is often described as toughness, which is unhelpful and slightly insulting to people going through genuinely difficult things.

It is better understood as a set of skills: how you interpret what has happened, what support you arranged before you needed it, how you look after yourself under load, and how you recover. All of those can be built.
`.trim(),
    level: "beginner",
    durationWeeks: 5,
    learningHours: 20,
    prerequisites: "None.",
    targetLearners: "Anyone facing difficulty or wanting to prepare for it — students, workers, people in insecure employment.",
    objectives: [
      "Understand resilience as skills rather than character.",
      "Recognise the thinking patterns that make setbacks worse.",
      "Build the support and habits that sustain you.",
      "Recover from setbacks deliberately.",
      "Know when difficulty needs professional help.",
    ],
    outcomes: [
      "Describe the components of resilience.",
      "Identify unhelpful thinking patterns in yourself.",
      "Reframe a setback accurately rather than optimistically.",
      "Map your own support network and its gaps.",
      "Apply a deliberate recovery process after a setback.",
      "Recognise when professional support is needed.",
    ],
    careers: ["Applies to everyone", "Insecure or high-pressure work", "Students", "Entrepreneurs", "Carers"],
    skills: ["Reframing", "Support networks", "Recovery", "Self-awareness", "Perspective"],
    finalProject: "Take a real setback. Analyse it: what you told yourself, which thinking patterns appeared, what support you used, and how you recovered. Then write what you would do differently. Submit conclusions only.",
    certificateCriteria: CERT,
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — What Resilience Is", "Skills, not character.", [
        ["Resilience as Learnable", "Replace the toughness idea.", ["Why 'be resilient' is unhelpful advice", "The components: thinking, support, self-care, meaning", "Resilience is not enduring bad conditions indefinitely"]],
        ["How We Interpret Setbacks", "Notice the story you tell.", ["The interpretation, not the event, drives the reaction", "Permanent, pervasive, personal — the three traps", "Testing an interpretation against evidence"]],
        ["Unhelpful Thinking Patterns", "Recognise the common ones.", ["All-or-nothing thinking, catastrophising", "Mind-reading and fortune-telling", "Noticing a pattern rather than arguing with yourself"]],
      ], [
        { prompt: "Resilience is best understood as:", options: [{ text: "A set of skills that can be built", correct: true }, { text: "A personality trait" }, { text: "Toughness" }, { text: "The ability to endure any conditions" }] },
        { prompt: "'I failed this, so I fail at everything' is which trap?", options: [{ text: "Pervasive — spreading one setback across all areas", correct: true }, { text: "Permanent" }, { text: "Personal" }, { text: "None" }] },
        { prompt: "What drives the reaction to a setback?", options: [{ text: "How it is interpreted", correct: true }, { text: "Its severity alone" }, { text: "Personality" }, { text: "How others respond" }] },
      ]),
      mod("Module 2 — Building the Foundations", "Support, habits and meaning.", [
        ["Your Support Network", "Build it before you need it.", ["Different people for different kinds of support", "Mapping who you actually have", "Asking for help as a skill, not a weakness"]],
        ["Physical Foundations", "Protect what everything else rests on.", ["Sleep, food and movement under pressure", "Why these fail first when they are needed most", "Small consistent habits over ideal ones"]],
        ["Purpose and Meaning", "Know what you are enduring for.", ["Connecting difficulty to something you value", "Meaning at work, and where it cannot be found", "Values as a guide under pressure"]],
      ], [
        { prompt: "When should a support network be built?", options: [{ text: "Before difficulty arrives", correct: true }, { text: "During a crisis" }, { text: "Afterwards" }, { text: "It cannot be built deliberately" }] },
        { prompt: "What typically happens to sleep and activity under pressure?", options: [{ text: "They are dropped first, exactly when they are most needed", correct: true }, { text: "They improve" }, { text: "They stay constant" }, { text: "They become easier" }] },
        { prompt: "Asking for help is:", options: [{ text: "A skill that can be practised", correct: true }, { text: "A weakness" }, { text: "A last resort" }, { text: "An imposition" }] },
      ], { title: "Reflection — Map your support", instructions: "Map your support network: who you would go to for practical help, for advice, and for simply being heard. Identify the gaps and one thing you will do about them. Submit conclusions only." }),
      mod("Module 3 — Recovering and Growing", "After the setback.", [
        ["Recovering Deliberately", "Make recovery a process rather than an accident.", ["Allowing the initial reaction", "Separating what you control from what you do not", "The first small action that restores agency"]],
        ["Learning Without Blaming", "Take the lesson, not the punishment.", ["What was in your control and what was not", "Avoiding both self-blame and denial", "Recording the lesson before it fades"]],
        ["Knowing Your Limits", "Recognise when resilience is not the answer.", ["When a situation should be left rather than endured", "When difficulty needs professional help", "Resilience is not tolerating harm"]],
      ], [
        { prompt: "What is the first useful step after a setback?", options: [{ text: "Allowing the initial reaction rather than suppressing it", correct: true }, { text: "Immediately planning the next move" }, { text: "Analysing what went wrong" }, { text: "Telling everyone" }] },
        { prompt: "Resilience does NOT mean:", options: [{ text: "Tolerating harmful conditions indefinitely", correct: true }, { text: "Recovering from setbacks" }, { text: "Asking for support" }, { text: "Learning from difficulty" }] },
        { prompt: "How should a setback be reviewed?", options: [{ text: "Separating what was in your control from what was not", correct: true }, { text: "Identifying who was at fault" }, { text: "Moving on without review" }, { text: "Accepting full responsibility" }] },
      ]),
    ],
  }),

  scaffold({
    slug: "workplace-resilience",
    title: "Workplace Resilience",
    categorySlug: RES,
    courseCode: "HS-RS-02",
    summary: "Coping with difficulty at work — setbacks, criticism, insecurity and pressure — without absorbing what is not yours.",
    description: `
${NOTICE}

Workplace resilience is frequently used to mean putting up with things. This course does not take that view. It covers handling genuine difficulty — a failed project, hard criticism, an uncertain job, a demanding period — while being clear that some workplace conditions are not a resilience problem at all.
`.trim(),
    level: "beginner",
    durationWeeks: 5,
    learningHours: 20,
    prerequisites: "None. Building Personal Resilience is a useful companion.",
    targetLearners: "Employees at any level, people in insecure work, and anyone recovering from a difficult period at work.",
    objectives: [
      "Handle setbacks and criticism at work constructively.",
      "Cope with job insecurity and organisational change.",
      "Maintain performance through demanding periods.",
      "Recover after a difficult episode.",
      "Distinguish personal resilience from conditions that must change.",
    ],
    outcomes: [
      "Respond to a failure without either collapse or denial.",
      "Take criticism and extract what is useful.",
      "Manage uncertainty about your own job.",
      "Sustain performance through a demanding period and recover after it.",
      "Rebuild confidence after a serious setback.",
      "Recognise conditions that resilience should not be asked to absorb.",
    ],
    careers: ["Applies to everyone", "Insecure employment", "Project work", "Client-facing roles", "Managers"],
    skills: ["Handling criticism", "Managing uncertainty", "Recovery", "Confidence", "Perspective"],
    finalProject: "Analyse a real workplace difficulty you faced: what happened, how you responded, what helped, and what you would do differently. State honestly whether it was a resilience matter or a conditions matter.",
    certificateCriteria: CERT,
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — Setbacks and Criticism", "The two hardest ordinary events.", [
        ["When Work Goes Wrong", "Respond to failure usefully.", ["The first reaction, and not acting on it", "Separating the mistake from your worth", "Reporting a failure promptly and well"]],
        ["Receiving Criticism", "Take what is useful from it.", ["Listening past the delivery", "Asking for specifics", "Deciding what to act on and what to set aside"]],
        ["Rebuilding Confidence", "Recover after something serious.", ["Confidence following evidence, not preceding it", "Small successes deliberately arranged", "The internal commentary, noticed and corrected"]],
      ], [
        { prompt: "What is the right first response to a serious mistake at work?", options: [{ text: "Report it promptly with the facts and a proposed remedy", correct: true }, { text: "Fix it quietly" }, { text: "Wait to see if it is noticed" }, { text: "Explain why it was not your fault" }] },
        { prompt: "How is confidence rebuilt after a setback?", options: [{ text: "Through small successes that provide evidence", correct: true }, { text: "By deciding to feel confident" }, { text: "By avoiding similar work" }, { text: "Through reassurance from others" }] },
        { prompt: "Criticism delivered harshly but containing a fair point should be:", options: [{ text: "Separated — act on the substance, set aside the delivery", correct: true }, { text: "Rejected entirely" }, { text: "Accepted entirely" }, { text: "Reported" }] },
      ]),
      mod("Module 2 — Uncertainty and Pressure", "Insecurity, change and demanding periods.", [
        ["Job Insecurity and Change", "Cope with not knowing.", ["Uncertainty as its own stressor", "Controlling what you can — skills, savings, network", "Deciding how much energy to spend worrying"]],
        ["Demanding Periods", "Get through a genuinely heavy stretch.", ["Sustaining a sprint, and its limits", "Protecting the minimum: sleep, food, one relationship", "Planning recovery before the period starts"]],
        ["Difficult People", "Work with people who make it harder.", ["What you can and cannot change in a colleague", "Limiting exposure where possible", "When behaviour becomes something to report"]],
      ], [
        { prompt: "During uncertainty about your job, what deserves your energy?", options: [{ text: "What you control — skills, savings, network", correct: true }, { text: "Predicting the outcome" }, { text: "Seeking reassurance repeatedly" }, { text: "Nothing" }] },
        { prompt: "When should recovery after a demanding period be planned?", options: [{ text: "Before the period begins", correct: true }, { text: "Once it is over" }, { text: "When exhaustion appears" }, { text: "It cannot be planned" }] },
        { prompt: "A colleague's behaviour crosses into harassment. What is this?", options: [{ text: "Not a resilience matter — it should be reported", correct: true }, { text: "A test of resilience" }, { text: "Something to endure" }, { text: "A personality clash" }] },
      ], { title: "Reflection — A real difficulty", instructions: "Take a real workplace difficulty. Describe what happened, your response, what helped and what did not. State whether it was a resilience matter or a conditions matter, and why." }),
      mod("Module 3 — The Limits of Resilience", "What should not be absorbed.", [
        ["Conditions Versus Coping", "Tell the difference.", ["Problems resilience can address, and problems it cannot", "Chronic overload, unsafe work, discrimination", "When 'be more resilient' is being used to avoid a fix"]],
        ["Raising Problems Properly", "Address the conditions.", ["Evidence rather than complaint", "Whom to raise it with", "Documenting appropriately"]],
        ["Deciding to Leave", "Consider it clearly.", ["Weighing the cost of staying", "Preparing before deciding", "Leaving well, whatever the reason"]],
      ], [
        { prompt: "Which should NOT be treated as a resilience problem?", type: "multiple", options: [{ text: "Discrimination", correct: true }, { text: "Unsafe working conditions", correct: true }, { text: "Chronic understaffing", correct: true }, { text: "A demanding but temporary project" }] },
        { prompt: "'Be more resilient' offered in response to chronic overload is:", options: [{ text: "Usually a way of avoiding a fix that costs money", correct: true }, { text: "Sound advice" }, { text: "A development opportunity" }, { text: "Neutral" }] },
        { prompt: "How should a conditions problem be raised?", options: [{ text: "With evidence, to someone who can change it", correct: true }, { text: "As a complaint to colleagues" }, { text: "Anonymously only" }, { text: "It should not be raised" }] },
      ]),
    ],
  }),

  scaffold({
    slug: "managing-change-and-uncertainty",
    title: "Managing Change and Uncertainty",
    categorySlug: RES,
    courseCode: "HS-RS-03",
    summary: "Working through change you did not choose — organisational restructuring, new technology, and an uncertain future.",
    description: `
${NOTICE}

Change at work is usually done to people rather than with them, and the resulting difficulty is often treated as resistance rather than a reasonable response to loss of control.

This course covers what change does to people, how to work through it, and — for those leading change — how to do it in a way that does not needlessly damage the people affected.
`.trim(),
    level: "intermediate",
    durationWeeks: 5,
    learningHours: 20,
    prerequisites: "None.",
    targetLearners: "Anyone going through organisational change, managers implementing it, and people worried about technology changing their role.",
    objectives: [
      "Understand how people typically respond to change.",
      "Work through change you did not choose.",
      "Manage uncertainty without being consumed by it.",
      "Support others through change.",
      "Lead a change in a way that respects those affected.",
    ],
    outcomes: [
      "Describe the common stages of response to change.",
      "Identify what you control during a change.",
      "Manage anxiety about an uncertain future.",
      "Adapt skills when a role changes.",
      "Support a colleague through change.",
      "Communicate a change honestly as a manager.",
    ],
    careers: ["Applies to everyone", "Managers leading change", "Roles affected by automation", "Restructured organisations"],
    skills: ["Adaptability", "Uncertainty tolerance", "Change communication", "Reskilling", "Supporting others"],
    finalProject: "Analyse a real change you experienced or led: what was communicated, how people responded, what helped, and what you would do differently. Include an honest account of your own response.",
    certificateCriteria: CERT,
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — How People Respond to Change", "The pattern, and why it is not resistance.", [
        ["The Response to Change", "Recognise the stages.", ["Shock, resistance, exploration, acceptance", "Why people move at different speeds", "Resistance as a reasonable response to loss of control"]],
        ["What Change Takes Away", "Understand the loss involved.", ["Competence, relationships, certainty, status", "Why even improvements are experienced as loss", "Grieving a way of working"]],
        ["What You Control", "Find agency within it.", ["Separating the decision from your response to it", "Where influence exists, and where it does not", "Spending energy where it can achieve something"]],
      ], [
        { prompt: "Resistance to change is best understood as:", options: [{ text: "A reasonable response to loss of control and competence", correct: true }, { text: "Obstruction" }, { text: "Fear of work" }, { text: "Poor attitude" }] },
        { prompt: "Why is even a positive change often experienced as loss?", options: [{ text: "Competence, relationships and certainty are given up regardless", correct: true }, { text: "People dislike novelty" }, { text: "It is not" }, { text: "Communication is always poor" }] },
        { prompt: "During imposed change, where should energy go?", options: [{ text: "Into what you can influence", correct: true }, { text: "Into opposing the decision" }, { text: "Into predicting outcomes" }, { text: "Nowhere" }] },
      ]),
      mod("Module 2 — Working Through It", "Uncertainty, skills and support.", [
        ["Managing Uncertainty", "Function without knowing the outcome.", ["Tolerating not knowing", "Limiting rumour and speculation", "Planning for more than one outcome"]],
        ["Adapting Your Skills", "Respond to a changing role.", ["Identifying what transfers", "Learning quickly under pressure", "Technology changing a role rather than removing it"]],
        ["Supporting Others", "Help colleagues through it.", ["Listening without false reassurance", "Not passing on rumour", "Recognising when someone is struggling badly"]],
      ], [
        { prompt: "What is the effect of rumour during organisational change?", options: [{ text: "It increases anxiety and usually misinforms", correct: true }, { text: "It fills an information gap usefully" }, { text: "It has no effect" }, { text: "It speeds acceptance" }] },
        { prompt: "How should you support a worried colleague?", options: [{ text: "Listen, without promising outcomes you cannot guarantee", correct: true }, { text: "Reassure them it will be fine" }, { text: "Share what you have heard" }, { text: "Avoid the subject" }] },
        { prompt: "When technology changes a role, what is usually most useful?", options: [{ text: "Identifying which of your skills transfer, and building on them", correct: true }, { text: "Waiting to see what happens" }, { text: "Opposing the technology" }, { text: "Changing career entirely" }] },
      ], { title: "Reflection — A change you lived through", instructions: "Describe a real change at work or in study: what was communicated and how, how people responded, what helped, and what you would do differently. Include your own response honestly." }),
      mod("Module 3 — Leading Change Well", "For those implementing it.", [
        ["Communicating Change", "Say it honestly and early.", ["Explaining why, not only what", "Saying what is not yet decided rather than going quiet", "Never promising what you cannot guarantee"]],
        ["Involving People", "Give back some control.", ["Consulting where there is genuine choice", "Not staging consultation on settled decisions", "Letting people shape implementation"]],
        ["Supporting Through Transition", "Get people to the other side.", ["Training and time to become competent again", "Expecting a dip in performance", "Acknowledging what is being lost"]],
      ], [
        { prompt: "What should a manager do about a decision not yet made?", options: [{ text: "Say plainly that it is undecided and when it will be known", correct: true }, { text: "Say nothing until it is decided" }, { text: "Suggest a likely outcome" }, { text: "Deny that it is under consideration" }] },
        { prompt: "Performance during a major change typically:", options: [{ text: "Dips before recovering, which should be expected and planned for", correct: true }, { text: "Improves immediately" }, { text: "Stays constant" }, { text: "Never recovers" }] },
        { prompt: "Consulting on a decision already made:", options: [{ text: "Destroys trust once discovered", correct: true }, { text: "Softens the impact" }, { text: "Is standard practice" }, { text: "Has no effect" }] },
      ]),
    ],
  }),

  scaffold({
    slug: "positive-workplace-culture",
    title: "Positive Workplace Culture",
    categorySlug: RES,
    courseCode: "HS-RS-04",
    summary: "What makes a workplace good to be in — and the specific things anyone, at any level, can do about it.",
    description: `
${NOTICE}

Culture is not the posters or the annual dinner. It is what actually happens: whether people admit mistakes, whether credit goes to the right person, whether a new employee is helped or left to struggle.

This course covers what culture is made of, how it is set by behaviour rather than statements, and what both managers and ordinary colleagues can change.
`.trim(),
    level: "beginner",
    durationWeeks: 5,
    learningHours: 20,
    prerequisites: "None.",
    targetLearners: "Managers, team leads, HR staff, and any employee wanting to improve the place they work.",
    objectives: [
      "Describe what workplace culture actually consists of.",
      "Identify the behaviours that shape it.",
      "Contribute to a better culture at any level.",
      "Recognise and address harmful patterns.",
      "Build inclusion into everyday practice.",
    ],
    outcomes: [
      "Distinguish stated values from actual behaviour.",
      "Identify the behaviours a workplace rewards in practice.",
      "Contribute specifically — recognition, help, honesty about mistakes.",
      "Recognise exclusion and act on it.",
      "Address a harmful pattern appropriately.",
      "Assess a culture during a job interview.",
    ],
    careers: ["Managers", "HR", "Team leads", "Any employee", "Business owners"],
    skills: ["Culture assessment", "Inclusion", "Recognition", "Speaking up", "Psychological safety"],
    finalProject: "Assess a workplace culture you know: the stated values, the actual behaviours rewarded, the gap between them, and three specific changes with who would have to act.",
    certificateCriteria: CERT,
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — What Culture Actually Is", "Behaviour, not statements.", [
        ["Stated Values and Real Behaviour", "Look at what happens, not what is claimed.", ["The gap between the poster and the practice", "What is actually rewarded and tolerated", "How a new employee learns the real rules"]],
        ["Psychological Safety", "The single most important element.", ["Whether people can admit a mistake or ask a question", "What happens to a team without it", "How a leader's reaction sets it"]],
        ["Small Behaviours That Add Up", "Recognise where culture is made.", ["How mistakes are received", "Where credit goes", "How the newest and most junior person is treated"]],
      ], [
        { prompt: "Workplace culture is best assessed by:", options: [{ text: "What behaviour is actually rewarded and tolerated", correct: true }, { text: "The stated values" }, { text: "The staff handbook" }, { text: "The annual survey" }] },
        { prompt: "What is the effect of low psychological safety?", options: [{ text: "Mistakes are hidden until they become serious", correct: true }, { text: "Performance improves" }, { text: "Fewer errors occur" }, { text: "Nothing measurable" }] },
        { prompt: "Where is culture most visibly set?", options: [{ text: "In how a leader reacts when something goes wrong", correct: true }, { text: "In the values statement" }, { text: "At the annual event" }, { text: "In the induction pack" }] },
      ]),
      mod("Module 2 — Contributing to It", "What anyone can do.", [
        ["What You Can Do at Any Level", "Act without authority.", ["Recognising colleagues' work specifically", "Helping without being asked", "Admitting your own mistakes openly"]],
        ["Inclusion in Practice", "Make it real rather than stated.", ["Who speaks in meetings, and who does not", "Practical inclusion for women and for disabled colleagues", "Assumptions about who does which work"]],
        ["Speaking Up", "Raise something safely.", ["Choosing the moment and the person", "Describing behaviour and its effect", "When to escalate, and how"]],
      ], [
        { prompt: "Which improves culture and requires no authority?", type: "multiple", options: [{ text: "Recognising a colleague's contribution specifically", correct: true }, { text: "Admitting your own mistakes openly", correct: true }, { text: "Helping a new colleague unprompted", correct: true }, { text: "Waiting for management to act" }] },
        { prompt: "In a meeting where the same people always speak, what helps?", options: [{ text: "Deliberately inviting quieter colleagues to contribute", correct: true }, { text: "Shorter meetings" }, { text: "Fewer attendees" }, { text: "Nothing — people speak if they wish" }] },
        { prompt: "How should a concern about someone's behaviour be raised?", options: [{ text: "Describing the behaviour and its effect, to the right person", correct: true }, { text: "As a judgement of their character" }, { text: "With colleagues first" }, { text: "Anonymously always" }] },
      ], { title: "Practical — Culture assessment", instructions: "Assess a workplace you know. Compare its stated values with what is actually rewarded. Identify the largest gap and three specific changes, naming who would have to act on each." }),
      mod("Module 3 — Harmful Patterns", "Recognising and addressing what damages people.", [
        ["Recognising Harm", "Name what is happening.", ["Bullying, exclusion and persistent undermining", "Blame cultures", "Favouritism and its effects"]],
        ["Addressing It", "Act appropriately.", ["What can be addressed directly and what cannot", "Formal routes and documentation", "Supporting someone affected"]],
        ["Choosing a Workplace", "Assess culture before joining.", ["Questions that reveal culture at interview", "What turnover and how they answer tell you", "Deciding to leave a culture that will not change"]],
      ], [
        { prompt: "Which should go through a formal route rather than an informal conversation?", options: [{ text: "Bullying or harassment", correct: true }, { text: "A disagreement about priorities" }, { text: "Different working styles" }, { text: "A missed deadline" }] },
        { prompt: "Which interview question best reveals culture?", options: [{ text: "What happens here when something goes wrong?", correct: true }, { text: "What are the company values?" }, { text: "Is there a good atmosphere?" }, { text: "Do people enjoy working here?" }] },
        { prompt: "In a blame culture, what happens to problems?", options: [{ text: "They are concealed until they cannot be", correct: true }, { text: "They are solved faster" }, { text: "They reduce" }, { text: "Accountability improves" }] },
      ]),
    ],
  }),

  scaffold({
    slug: "resilience-productivity-and-wellbeing",
    title: "Resilience, Productivity and Wellbeing",
    categorySlug: RES,
    courseCode: "HS-RS-05",
    summary: "Bringing it together — sustaining good work and a life worth living over a career, not a quarter.",
    description: `
${NOTICE}

This is the concluding course of the wellbeing categories. It assumes the ground covered elsewhere and puts it together into something you can actually run your working life by.

It covers the relationship between wellbeing and output, designing work you can sustain, reviewing honestly, and making decisions about your career that account for the whole of your life rather than only the next promotion.
`.trim(),
    level: "intermediate",
    durationWeeks: 5,
    learningHours: 20,
    prerequisites: "Most useful after at least one other course from the wellbeing, burnout or resilience categories.",
    targetLearners: "Anyone building a long career, managers responsible for others, and people rebuilding after burnout.",
    objectives: [
      "Explain how wellbeing and productivity relate.",
      "Design work that is sustainable over years.",
      "Review your own working life honestly and regularly.",
      "Make career decisions that account for wellbeing.",
      "Support others in doing the same.",
    ],
    outcomes: [
      "Describe how wellbeing affects output, and the limits of that relationship.",
      "Design a sustainable working pattern.",
      "Run an honest personal review.",
      "Assess a role or opportunity against wellbeing as well as pay.",
      "Recognise a trajectory heading towards burnout.",
      "Set a personal working standard and hold it.",
    ],
    careers: ["Applies to everyone", "Managers", "Long-term career planning", "Recovery after burnout"],
    skills: ["Sustainable work design", "Self-review", "Career decisions", "Wellbeing awareness", "Long-term planning"],
    finalProject: "Produce a personal sustainability plan: your working pattern, your non-negotiables, your early warning signs, your review schedule, and the conditions under which you would change job.",
    certificateCriteria: CERT,
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — How They Connect", "Wellbeing and output, honestly.", [
        ["Wellbeing and Performance", "Understand the relationship without overstating it.", ["Why poor wellbeing reduces output, and by how much", "Why 'happy workers are productive' is too simple", "What the relationship does not justify"]],
        ["The Cost of Ignoring It", "See the long-term account.", ["Turnover, absence, errors and lost knowledge", "The individual cost, which matters regardless of the business case", "Why the business case should not be the only argument"]],
        ["What Sustainable Looks Like", "Define it for yourself.", ["Work you could do at this pace for years", "Good weeks, bad weeks, and the average", "Your own non-negotiables"]],
      ], [
        { prompt: "'Happy workers are productive workers' is:", options: [{ text: "Too simple — the relationship exists but is not that direct", correct: true }, { text: "Entirely correct" }, { text: "Entirely false" }, { text: "Irrelevant" }] },
        { prompt: "Why should the business case not be the only argument for wellbeing?", options: [{ text: "People's health matters regardless of its effect on output", correct: true }, { text: "The business case is weak" }, { text: "Managers dislike it" }, { text: "It cannot be measured" }] },
        { prompt: "Sustainable work is best defined as:", options: [{ text: "A pace you could hold for years, allowing for good and bad weeks", correct: true }, { text: "An easy workload" }, { text: "Fixed hours" }, { text: "Never feeling tired" }] },
      ]),
      mod("Module 2 — Designing It", "Building the working life you can keep.", [
        ["Your Working Pattern", "Design deliberately.", ["Hours, rhythm and recovery designed rather than inherited", "Building around your own energy", "Accounting for family and caring responsibilities"]],
        ["Non-Negotiables and Early Warnings", "Decide in advance.", ["Three things that do not get sacrificed", "Your own early warning signs, written down", "What you will do when you see them"]],
        ["Reviewing Honestly", "Check regularly rather than at crisis.", ["A monthly and annual review of your own working life", "Asking someone who will tell you the truth", "Acting on what the review shows"]],
      ], [
        { prompt: "When should early warning signs be identified?", options: [{ text: "In advance, while thinking clearly", correct: true }, { text: "When they appear" }, { text: "After a crisis" }, { text: "They cannot be identified in advance" }] },
        { prompt: "What makes a personal review useful?", options: [{ text: "Acting on what it shows", correct: true }, { text: "Doing it frequently" }, { text: "Recording it thoroughly" }, { text: "Sharing it with a manager" }] },
        { prompt: "How many non-negotiables are realistic?", options: [{ text: "A small number — around three", correct: true }, { text: "As many as possible" }, { text: "One" }, { text: "None; everything is negotiable" }] },
      ], { title: "Practical — A sustainability plan", instructions: "Write your personal sustainability plan: working pattern, three non-negotiables, your early warning signs, what you will do when you notice them, your review schedule, and the conditions under which you would change job." }),
      mod("Module 3 — Careers and Others", "Long-term decisions, and supporting people.", [
        ["Career Decisions and Wellbeing", "Weigh the whole picture.", ["Assessing an opportunity beyond pay and title", "Promotions that cost more than they return", "Turning something down deliberately"]],
        ["Supporting Others", "Help colleagues sustain themselves.", ["Modelling it rather than recommending it", "Noticing a trajectory early", "What a manager can change, and what needs escalating"]],
        ["The Long View", "Think in decades.", ["Skill compounding over a long career", "Recovering from a period of burnout", "Defining success in terms you actually hold"]],
      ], [
        { prompt: "How should a promotion be assessed?", options: [{ text: "Against the whole picture — demands, control, and what it costs outside work", correct: true }, { text: "On pay and title" }, { text: "On what others expect" }, { text: "It should always be accepted" }] },
        { prompt: "What is the most effective way for a manager to promote sustainable working?", options: [{ text: "Modelling it — taking leave, keeping hours, admitting limits", correct: true }, { text: "Recommending it in meetings" }, { text: "Providing wellbeing resources" }, { text: "Mentioning it at review time" }] },
        { prompt: "Recovery after a period of burnout typically requires:", options: [{ text: "Time, and changed conditions — not only rest", correct: true }, { text: "A holiday" }, { text: "Greater discipline" }, { text: "Changing jobs" }] },
      ]),
    ],
  }),
];
