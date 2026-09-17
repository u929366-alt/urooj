import { scaffold } from "./scaffold.ts";
import type { CourseContent, QuizContent } from "./types.ts";
import type { ModuleSpec } from "./scaffold.ts";

const COMMS = "communication-and-professional-skills";
const LEAD = "leadership-and-employability";
const SOURCE =
  "Syllabus developed by Hunarsaaz. No NAVTTC qualification was consulted — navttc.gov.pk is unreachable from this environment — and no NAVTTC claim is made for this course.";

/** Most courses in these two categories share the same three-module shape. */
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

export const communicationCourses: CourseContent[] = [
  scaffold({
    slug: "professional-communication",
    title: "Professional Communication",
    categorySlug: COMMS,
    courseCode: "HS-PC-01",
    summary: "Say what you mean, to the right person, in a way that gets a result — in writing, in person and under pressure.",
    description: `
Technical ability gets you the interview. How you explain a problem, disagree with a manager, or write the email that asks for something decides what happens afterwards.

This course is specific and practical: real messages, real conversations, real situations that go wrong. It covers writing that is read, listening that is more than waiting to speak, and the difficult conversations most people avoid until they become worse.
`.trim(),
    level: "beginner",
    durationWeeks: 6,
    learningHours: 24,
    prerequisites: "None.",
    targetLearners: "Anyone in or entering work — office staff, technicians, teachers, freelancers, new graduates.",
    objectives: [
      "Write messages that are understood and acted on first time.",
      "Listen well enough to answer the actual question.",
      "Give and receive feedback without damaging the relationship.",
      "Handle disagreement and difficult conversations calmly.",
      "Adapt how you communicate to the person and the situation.",
    ],
    outcomes: [
      "Structure an email or message so the request is unmissable.",
      "Summarise a complex matter for someone with two minutes.",
      "Ask questions that surface what someone actually needs.",
      "Give specific feedback about behaviour rather than character.",
      "Raise a problem with a senior person without either aggression or apology.",
      "Recognise when a conversation should not happen in writing.",
    ],
    careers: ["Every role", "Team lead", "Client-facing staff", "Customer support", "Supervisor"],
    skills: ["Written communication", "Active listening", "Feedback", "Difficult conversations", "Summarising"],
    finalProject: "Record or transcribe one real difficult conversation you prepared for using this course, with your preparation notes, what actually happened, and what you would do differently.",
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — Being Understood", "Clarity in writing and speech.", [
        ["What Good Communication Achieves", "Judge communication by its result rather than its politeness.", ["The message received is the only one that counts", "Purpose before medium", "Why more words usually means less clarity"]],
        ["Writing That Gets Read", "Write so the reader knows what to do.", ["Subject lines and opening sentences", "One request per message", "Bullet points, deadlines, and naming who must act"]],
        ["Speaking Clearly", "Explain something complicated to someone who is busy.", ["Headline first, detail on request", "Plain words over jargon", "Checking you were understood rather than assuming"]],
      ], [
        { prompt: "Whose understanding decides whether communication worked?", options: [{ text: "The receiver's", correct: true }, { text: "The sender's" }, { text: "The manager's" }, { text: "Both equally" }] },
        { prompt: "How many clear requests should one message contain?", options: [{ text: "One", correct: true }, { text: "As many as are outstanding" }, { text: "Three" }, { text: "None — let them ask" }] },
        { prompt: "Which opening is stronger for a busy reader?", options: [{ text: "I need approval on the budget by Thursday — details below", correct: true }, { text: "I hope this email finds you well" }, { text: "Following our discussion the other day" }, { text: "Just checking in" }] },
      ], { title: "Practical — Rewrite three messages", instructions: "Find three real work messages that were unclear — yours or ones you received. Rewrite each, and explain in one line what was wrong and what you changed." }),
      mod("Module 2 — Listening and Feedback", "The half of communication most people skip.", [
        ["Active Listening", "Understand before responding.", ["Listening to understand versus waiting to speak", "Questions that open a subject up", "Reflecting back to confirm"]],
        ["Giving Feedback", "Say something useful without causing offence.", ["Behaviour and effect, not character", "Specific and timely beats general and delayed", "Praise in public, correction in private"]],
        ["Receiving Feedback", "Take criticism without defending or collapsing.", ["Listening past the delivery to the substance", "Asking for an example", "Deciding what to act on"]],
      ], [
        { prompt: "Which is useful feedback?", options: [{ text: "The report reached the client two days late and they had to chase us", correct: true }, { text: "You are careless" }, { text: "You need to be more professional" }, { text: "Everyone has noticed" }] },
        { prompt: "What does reflecting back achieve?", options: [{ text: "It confirms you understood before you respond", correct: true }, { text: "It fills silence" }, { text: "It shows agreement" }, { text: "It ends the conversation faster" }] },
        { prompt: "Feedback is delivered badly but contains a fair point. What do you do?", options: [{ text: "Take the substance and set aside the delivery", correct: true }, { text: "Reject it because of how it was said" }, { text: "Accept all of it without question" }, { text: "Complain about the delivery first" }] },
      ]),
      mod("Module 3 — Difficult Conversations", "Disagreement, bad news and pressure.", [
        ["Disagreeing Well", "Argue a position without making an enemy.", ["Separating the problem from the person", "Stating your reasoning, not just your conclusion", "Disagreeing with someone senior"]],
        ["Delivering Bad News", "Say the difficult thing early and clearly.", ["Why delay always makes it worse", "Leading with the fact, then the remedy", "Apologising once, properly"]],
        ["Communication Under Pressure", "Stay useful when things go wrong.", ["Slowing down when everyone is rushing", "Escalating appropriately", "When a conversation must not happen in writing"]],
      ], [
        { prompt: "When should bad news be delivered?", options: [{ text: "As soon as you are confident of the facts", correct: true }, { text: "Once you have a full solution" }, { text: "At the next scheduled meeting" }, { text: "Only if asked" }] },
        { prompt: "Which conversations are usually wrong to have in writing?", type: "multiple", options: [{ text: "Correcting someone's performance", correct: true }, { text: "A serious disagreement", correct: true }, { text: "Anything with strong emotion on either side", correct: true }, { text: "Confirming a meeting time" }] },
        { prompt: "How do you disagree with a senior colleague constructively?", options: [{ text: "State your reasoning and the evidence, and accept their decision", correct: true }, { text: "Stay silent" }, { text: "Raise it with their manager first" }, { text: "Agree publicly and object privately to others" }] },
      ], { title: "Practical — Prepare a difficult conversation", instructions: "Identify a real conversation you have been avoiding. Write: what outcome you want, what the other person likely wants, your opening two sentences, and the three things you will not say. Have the conversation if you can, and report what happened." }),
    ],
  }),

  scaffold({
    slug: "business-english",
    title: "Business English",
    categorySlug: COMMS,
    courseCode: "HS-BE-01",
    summary: "The English actually used at work — emails, meetings, reports and calls — built for Pakistani professionals dealing with international clients.",
    description: `
School English and work English are different languages. This course teaches the second: the phrases, structures and conventions used in professional correspondence and meetings, and the mistakes that most commonly mark a message as amateur.

It is built for people who already read English reasonably but hesitate to write or speak it in front of a client.
`.trim(),
    level: "intermediate",
    durationWeeks: 8,
    learningHours: 32,
    prerequisites: "Reading English comfortably. This is not a beginner English course.",
    targetLearners: "Professionals dealing with international clients or employers, freelancers, and graduates entering multinational workplaces.",
    objectives: [
      "Write professional emails and documents confidently.",
      "Take part in meetings and calls in English.",
      "Use the right level of formality for the situation.",
      "Avoid the errors most common among Urdu speakers writing English.",
      "Present information clearly in writing and speech.",
    ],
    outcomes: [
      "Write enquiry, follow-up, apology and proposal emails.",
      "Chair and contribute to a meeting in English.",
      "Handle a phone or video call with a client.",
      "Write a short report and an executive summary.",
      "Correct the article, tense and preposition errors that most commonly appear.",
      "Adjust register between formal and conversational.",
    ],
    careers: ["Any client-facing role", "Freelancer with overseas clients", "Business Development", "Customer Support", "Administration"],
    skills: ["Business writing", "Meeting English", "Telephone English", "Report writing", "Register"],
    finalProject: "A portfolio of eight pieces of business English — four written, four recorded spoken — each with a scenario, submitted with your own corrections marked.",
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — Written Business English", "Email and documents.", [
        ["Email Structure and Register", "Write an email that reads as professional.", ["Subject lines, openings, closings", "Formal, neutral and friendly registers", "When 'Dear Sir' is wrong"]],
        ["The Emails You Will Send Most", "Handle the common situations confidently.", ["Enquiry, quotation, follow-up", "Chasing without irritating", "Apologising and correcting a mistake"]],
        ["Common Errors", "Fix the mistakes that recur most.", ["Articles: a, an, the", "Tense agreement and reported speech", "Prepositions, and direct translations from Urdu that do not work"]],
      ], [
        { prompt: "Which closing suits a first email to an unknown client?", options: [{ text: "Kind regards", correct: true }, { text: "Cheers" }, { text: "Yours lovingly" }, { text: "Bye" }] },
        { prompt: "Which sentence is correct?", options: [{ text: "I have attached the report for your review.", correct: true }, { text: "I am attaching herewith the report for your kind perusal." }, { text: "Please find the attached report which I am sending." }, { text: "Report is attached herewith please." }] },
        { prompt: "A client has not replied in a week. What is the professional approach?", options: [{ text: "A short, polite follow-up restating the request and the deadline", correct: true }, { text: "Resend the same email" }, { text: "Express disappointment" }, { text: "Wait indefinitely" }] },
      ], { title: "Practical — Four emails", instructions: "Write four emails to given scenarios: an enquiry, a quotation, a follow-up after silence, and an apology for a missed deadline. Mark your own register choices and explain each." }),
      mod("Module 2 — Spoken Business English", "Meetings, calls and presentations.", [
        ["Meeting Language", "Take part without hesitating.", ["Opening, agreeing, disagreeing politely", "Interrupting acceptably", "Summarising and confirming actions"]],
        ["Telephone and Video Calls", "Handle a call you cannot prepare for.", ["Opening and identifying yourself", "Asking for repetition without embarrassment", "Confirming numbers, dates and spellings"]],
        ["Short Presentations", "Present in English for five minutes.", ["Signposting: first, next, finally", "Describing data and trends", "Handling questions"]],
      ], [
        { prompt: "Which is a polite way to disagree in a meeting?", options: [{ text: "I see it slightly differently — may I explain?", correct: true }, { text: "That is wrong." }, { text: "No." }, { text: "Saying nothing and objecting later" }] },
        { prompt: "You did not understand what a client said on a call. What do you do?", options: [{ text: "Ask them to repeat or clarify immediately", correct: true }, { text: "Say yes and work it out afterwards" }, { text: "Change the subject" }, { text: "End the call and email" }] },
        { prompt: "What does signposting do in a presentation?", options: [{ text: "Tells the listener where you are and what is coming", correct: true }, { text: "Makes it longer" }, { text: "Replaces slides" }, { text: "Shows vocabulary range" }] },
      ]),
      mod("Module 3 — Reports and Professional Documents", "Longer writing that must be clear.", [
        ["Report Structure", "Write a report someone reads to the end.", ["Executive summary first", "Findings, then recommendations", "Headings and numbering"]],
        ["Describing Data in Words", "Turn figures into sentences.", ["Increase, decrease, level off, fluctuate", "Approximation and hedging", "Not overstating what the data shows"]],
        ["Proposals and Formal Documents", "Write to persuade formally.", ["Structure of a proposal", "Terms, scope and deliverables in plain English", "Proofreading — and why you cannot proofread on screen alone"]],
      ], [
        { prompt: "What goes at the top of a business report?", options: [{ text: "An executive summary", correct: true }, { text: "The methodology" }, { text: "The appendices" }, { text: "The author's biography" }] },
        { prompt: "Sales went from 100 to 103 units. Which description is honest?", options: [{ text: "Sales rose slightly", correct: true }, { text: "Sales surged" }, { text: "Sales tripled" }, { text: "Sales transformed" }] },
        { prompt: "Which improves proofreading?", type: "multiple", options: [{ text: "Reading it aloud", correct: true }, { text: "Leaving it and returning later", correct: true }, { text: "Printing it or changing the font", correct: true }, { text: "Reading it faster" }] },
      ], { title: "Practical — A one-page report", instructions: "Write a one-page report on a real situation at your work or study, with an executive summary, findings and recommendations. Submit it with a recording of yourself presenting it in two minutes." }),
    ],
  }),

  scaffold({
    slug: "presentation-and-public-speaking",
    title: "Presentation and Public Speaking",
    categorySlug: COMMS,
    courseCode: "HS-PS-01",
    summary: "Stand up, hold a room, and make people remember the point — including when you are nervous, which everyone is.",
    description: `
Fear of speaking in public is not a character flaw and it does not disappear. Good speakers are nervous too; they have prepared in a way that makes nerves survivable.

This course covers structure, delivery, slides that help rather than distract, and handling questions — including the hostile one. It is practical throughout: you will record yourself, which is uncomfortable and by far the fastest way to improve.
`.trim(),
    level: "beginner",
    durationWeeks: 6,
    learningHours: 24,
    prerequisites: "A phone that can record video. Willingness to watch yourself back.",
    targetLearners: "Anyone who must present at work or in study — trainers, managers, students, and those who avoid it.",
    objectives: [
      "Structure a talk so the audience remembers the point.",
      "Deliver with control of voice, pace and body.",
      "Design slides that support rather than compete.",
      "Handle questions, including difficult ones.",
      "Manage nerves practically rather than hoping they pass.",
    ],
    outcomes: [
      "Build a talk around one central message.",
      "Open in a way that earns attention within thirty seconds.",
      "Use pace, pause and volume deliberately.",
      "Make slides that are readable at the back of a room.",
      "Answer a question you do not know the answer to.",
      "Deliver a prepared ten-minute talk.",
    ],
    careers: ["Trainer", "Team lead", "Sales and business development", "Teacher", "Anyone presenting to clients"],
    skills: ["Talk structure", "Delivery", "Slide design", "Q&A handling", "Managing nerves"],
    finalProject: "Deliver and record a ten-minute talk to a real audience, however small, with slides. Submit the recording, the slides, and a self-critique of three things that did not work.",
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — Building the Talk", "Structure decides most of the outcome.", [
        ["One Message", "Decide what the audience should remember.", ["If they remember one sentence, what is it?", "Audience, purpose, and what you want them to do", "Cutting everything that does not serve the message"]],
        ["Structure and Story", "Arrange material so it holds.", ["Opening, three points, close", "Examples and stories over abstract claims", "Signposting so nobody gets lost"]],
        ["Openings and Closings", "Earn attention and finish cleanly.", ["Thirty seconds to earn the room", "Openings that work: a question, a fact, a story", "Ending on the message, not on 'that's it, thanks'"]],
      ], [
        { prompt: "What should a talk be built around?", options: [{ text: "One central message the audience should remember", correct: true }, { text: "As much information as the time allows" }, { text: "The slides" }, { text: "The speaker's experience" }] },
        { prompt: "How long do you have to earn the audience's attention?", options: [{ text: "About thirty seconds", correct: true }, { text: "Five minutes" }, { text: "The whole first half" }, { text: "It does not matter" }] },
        { prompt: "Which closing is strongest?", options: [{ text: "Restating the message and what you want the audience to do", correct: true }, { text: "That's it, thanks" }, { text: "Any questions?" }, { text: "A joke" }] },
      ]),
      mod("Module 2 — Delivery", "Voice, body and nerves.", [
        ["Voice and Pace", "Be heard and be followed.", ["Volume, pace and the power of pausing", "Filler words, and how to reduce them", "Varying tone so attention does not drift"]],
        ["Body and Presence", "Look like someone worth listening to.", ["Standing, moving with purpose, hands", "Eye contact across a room", "What nerves look like from outside, which is less than it feels"]],
        ["Managing Nerves", "Prepare so nerves are survivable.", ["Why rehearsal aloud is not optional", "Breathing and physical technique", "Planning for what goes wrong: technology, blanking, hostile questions"]],
      ], [
        { prompt: "What is the most effective way to reduce nervousness?", options: [{ text: "Rehearsing aloud, repeatedly, ideally recorded", correct: true }, { text: "Reading the slides beforehand" }, { text: "Avoiding eye contact" }, { text: "Speaking faster to finish sooner" }] },
        { prompt: "What does a deliberate pause achieve?", options: [{ text: "It gives a point weight and lets the audience catch up", correct: true }, { text: "It shows uncertainty" }, { text: "It wastes time" }, { text: "It should be avoided" }] },
        { prompt: "How visible are your nerves to an audience?", options: [{ text: "Far less than they feel to you", correct: true }, { text: "Exactly as bad as they feel" }, { text: "Worse than they feel" }, { text: "Completely invisible" }] },
      ], { title: "Practical — Record and watch yourself", instructions: "Record a three-minute talk on any subject. Watch it back and list five specific things: two that worked, three to change. Record it again with the changes and submit both." }),
      mod("Module 3 — Slides and Questions", "Support material and the part you cannot script.", [
        ["Slides That Help", "Design slides that do not compete with you.", ["One idea per slide", "Readable from the back — large type, high contrast", "Why reading your slides aloud loses the room"]],
        ["Handling Questions", "Deal with the unscripted part.", ["Listening to the whole question before answering", "Saying 'I don't know, I'll find out' — which is respected", "The hostile question, answered calmly"]],
        ["Online Presentations", "Present to a screen of names.", ["Camera, framing, lighting", "Holding attention without seeing faces", "Screen sharing that does not go wrong"]],
      ], [
        { prompt: "What is the main fault of a slide full of text?", options: [{ text: "The audience reads instead of listening, and you become unnecessary", correct: true }, { text: "It loads slowly" }, { text: "It is hard to print" }, { text: "There is no fault" }] },
        { prompt: "You are asked a question you cannot answer. What is best?", options: [{ text: "Say so, and offer to find out and follow up", correct: true }, { text: "Guess confidently" }, { text: "Answer a different question" }, { text: "Say the question is not relevant" }] },
        { prompt: "Which matter most in an online presentation?", type: "multiple", options: [{ text: "Clear audio", correct: true }, { text: "Being framed and lit so your face is visible", correct: true }, { text: "Checking screen sharing beforehand", correct: true }, { text: "An elaborate virtual background" }] },
      ]),
    ],
  }),

  scaffold({
    slug: "workplace-communication",
    title: "Workplace Communication",
    categorySlug: COMMS,
    courseCode: "HS-WC-01",
    summary: "Communicating inside an organisation — with managers, colleagues and other departments, including when it is going badly.",
    description: `
Most workplace problems described as personality clashes are communication failures with a structure: unclear expectations, information not passed on, or a disagreement nobody named.

This course covers upward, downward and sideways communication, running meetings that are worth attending, handling conflict before it hardens, and the particular difficulties of hierarchy and indirectness in Pakistani workplaces.
`.trim(),
    level: "beginner",
    durationWeeks: 6,
    learningHours: 24,
    prerequisites: "None. Most useful for people already in a workplace.",
    targetLearners: "Employees at any level, new supervisors, and anyone finding communication at work difficult.",
    objectives: [
      "Communicate upward, downward and across an organisation effectively.",
      "Run and contribute to meetings that produce decisions.",
      "Handle conflict early and directly.",
      "Give instructions that are followed correctly.",
      "Work with people whose communication style differs from yours.",
    ],
    outcomes: [
      "Brief a manager in two minutes.",
      "Give an instruction and confirm it was understood.",
      "Run a meeting with an agenda and recorded actions.",
      "Raise a concern about a colleague appropriately.",
      "De-escalate a disagreement before it becomes a grievance.",
      "Recognise where hierarchy is suppressing information you need.",
    ],
    careers: ["Every workplace role", "Supervisor", "Team lead", "Coordinator", "HR assistant"],
    skills: ["Upward communication", "Meetings", "Conflict handling", "Delegation", "Escalation"],
    finalProject: "Document a real workplace communication breakdown you observed or were part of — what happened, where the failure was, and what you would put in place so it does not recur. Anonymise the people.",
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — Communicating in a Hierarchy", "Up, down and sideways.", [
        ["Talking to Managers", "Get decisions and support.", ["Briefing in two minutes: situation, options, recommendation", "Asking for what you need explicitly", "Raising a problem with a proposal attached"]],
        ["Giving Instructions", "Make sure work is done as intended.", ["Being specific about output, standard and deadline", "Confirming understanding rather than asking 'clear?'", "Following up without hovering"]],
        ["Working Across Departments", "Get cooperation from people who do not report to you.", ["Understanding their pressures and priorities", "Asking rather than instructing", "Escalating only after trying directly"]],
      ], [
        { prompt: "What should a two-minute brief to a manager contain?", options: [{ text: "The situation, the options, and your recommendation", correct: true }, { text: "Everything that happened, in order" }, { text: "The problem only" }, { text: "Your concerns about colleagues" }] },
        { prompt: "How do you confirm an instruction was understood?", options: [{ text: "Ask the person to say back what they will do", correct: true }, { text: "Ask 'is that clear?'" }, { text: "Send it in writing as well" }, { text: "Assume it was" }] },
        { prompt: "A colleague in another department is not helping. What comes first?", options: [{ text: "Speaking to them directly to understand their constraints", correct: true }, { text: "Emailing their manager" }, { text: "Raising it in a meeting" }, { text: "Doing their part yourself" }] },
      ]),
      mod("Module 2 — Meetings and Information Flow", "Making shared time useful.", [
        ["Meetings Worth Attending", "Run a meeting that produces something.", ["Agenda circulated in advance, or no meeting", "Who needs to be there, and who does not", "Decisions and actions recorded with owners"]],
        ["Keeping People Informed", "Pass on what others need.", ["What to share, with whom, when", "The cost of information hoarding", "Written records for anything that matters"]],
        ["Communication Breakdowns", "Recognise and repair failures.", ["The common causes: assumption, silence, unclear ownership", "Repairing after a breakdown", "Preventing recurrence with a written process"]],
      ], [
        { prompt: "What should be circulated before a meeting?", options: [{ text: "An agenda", correct: true }, { text: "The minutes of the last one only" }, { text: "Nothing" }, { text: "A full presentation" }] },
        { prompt: "What must a meeting produce to have been worth holding?", options: [{ text: "Decisions and actions with named owners", correct: true }, { text: "A full discussion" }, { text: "Attendance from everyone" }, { text: "Minutes" }] },
        { prompt: "Which cause most workplace communication breakdowns?", type: "multiple", options: [{ text: "Assuming someone else has passed it on", correct: true }, { text: "Unclear ownership of a task", correct: true }, { text: "Staying silent about a problem", correct: true }, { text: "Too many written records" }] },
      ], { title: "Practical — Run a meeting", instructions: "Run one real meeting with a circulated agenda and written actions. Submit the agenda, the actions with owners and dates, and a paragraph on what you would do differently." }),
      mod("Module 3 — Conflict and Difficult Colleagues", "When it is already going wrong.", [
        ["Understanding Conflict", "See what a disagreement is actually about.", ["Task, process and relationship conflict", "Why unaddressed conflict hardens", "Where hierarchy stops people speaking"]],
        ["Handling Disagreement", "Resolve it at the lowest level.", ["Raising it privately, early, about behaviour", "Listening to their account first", "Agreeing something specific"]],
        ["When to Escalate", "Know the limits of handling it yourself.", ["What you must not attempt to resolve alone: harassment, discrimination, safety", "Documenting appropriately", "Whom to involve and when"]],
      ], [
        { prompt: "Which should NOT be handled informally between colleagues?", options: [{ text: "Harassment", correct: true }, { text: "A disagreement about task priority" }, { text: "A misunderstanding over a deadline" }, { text: "Different working styles" }] },
        { prompt: "What usually happens to conflict that is avoided?", options: [{ text: "It hardens and becomes harder to resolve", correct: true }, { text: "It resolves itself" }, { text: "It has no effect" }, { text: "It becomes someone else's problem" }] },
        { prompt: "Where should a disagreement with a colleague first be raised?", options: [{ text: "Privately, with them", correct: true }, { text: "With their manager" }, { text: "In a team meeting" }, { text: "In writing to HR" }] },
      ]),
    ],
  }),

  scaffold({
    slug: "digital-communication-and-etiquette",
    title: "Digital Communication and Professional Etiquette",
    categorySlug: COMMS,
    courseCode: "HS-DE-01",
    summary: "Conducting yourself well online — email, chat, video, social media — and understanding that it is all permanent and searchable.",
    description: `
Almost all professional communication now happens through a screen, and the conventions are learned by getting them wrong in public.

This course covers the norms of each channel, the professional presence you build whether you intend to or not, and the specific risks: the message forwarded onward, the group where you forgot who was in it, the post from years ago found by an employer.
`.trim(),
    level: "beginner",
    durationWeeks: 5,
    learningHours: 20,
    prerequisites: "None.",
    targetLearners: "Students entering work, remote workers, freelancers, and anyone whose professional life happens largely online.",
    objectives: [
      "Use each digital channel according to its conventions.",
      "Build a professional online presence deliberately.",
      "Communicate respectfully across cultures and time zones.",
      "Protect your own and others' information.",
      "Recognise that digital communication is permanent and forwardable.",
    ],
    outcomes: [
      "Choose the right channel for a message.",
      "Write in chat, email and comments appropriately for each.",
      "Maintain a professional profile that supports your work.",
      "Handle group chats and shared channels without causing offence.",
      "Apply basic privacy and security practice.",
      "Respond to something going wrong online without making it worse.",
    ],
    careers: ["Every modern role", "Remote worker", "Freelancer", "Customer support", "Social media staff"],
    skills: ["Channel etiquette", "Online presence", "Cross-cultural communication", "Privacy", "Reputation management"],
    finalProject: "Audit your own public online presence as an employer would see it. Report what you found, what you changed, and write a one-page personal policy for your professional online conduct.",
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — Channels and Their Conventions", "Each one has unwritten rules.", [
        ["Choosing the Right Channel", "Send the message where it belongs.", ["Email, chat, call, video, in person — what each suits", "Urgency and formality as the deciding factors", "Why a serious matter should not start in a group chat"]],
        ["Email and Chat Etiquette", "Write appropriately for each.", ["Reply-all, CC, BCC — and the harm each can do", "Response time expectations", "Chat: brevity, threads, and not sending 'hi' alone"]],
        ["Video Calls", "Behave well on camera.", ["Punctuality, mute, camera, background", "Interrupting and turn-taking online", "Recording, and asking before you do"]],
      ], [
        { prompt: "What is wrong with sending only 'hi' in a work chat?", options: [{ text: "It makes the other person wait to find out what you need", correct: true }, { text: "It is impolite" }, { text: "It is too informal" }, { text: "Nothing" }] },
        { prompt: "When is BCC appropriate?", options: [{ text: "To protect recipients' addresses when emailing a large group", correct: true }, { text: "To let a manager secretly read a dispute" }, { text: "For any large email" }, { text: "Never" }] },
        { prompt: "A serious complaint needs raising. Where should it start?", options: [{ text: "A private conversation or direct message, not a group channel", correct: true }, { text: "The team group chat" }, { text: "A public comment" }, { text: "Anywhere convenient" }] },
      ]),
      mod("Module 2 — Professional Presence", "What people find when they look you up.", [
        ["Your Public Profile", "Manage what an employer or client sees.", ["Searching for yourself as an employer would", "LinkedIn and professional profiles", "Separating personal and professional accounts"]],
        ["Posting Professionally", "Build a reputation rather than damage one.", ["Sharing work and what you are learning", "Commenting usefully", "What not to post about employers and clients"]],
        ["Permanence", "Understand that nothing is temporary.", ["Screenshots, forwarding, and deleted posts that survive", "Old posts found years later", "Recovering from a public mistake"]],
      ], [
        { prompt: "What should you assume about any message you send at work?", options: [{ text: "It may be forwarded, screenshotted and read by people you did not intend", correct: true }, { text: "It is private between sender and recipient" }, { text: "It disappears after deletion" }, { text: "Only the recipient can see it" }] },
        { prompt: "Which is unwise to post publicly?", type: "multiple", options: [{ text: "Complaints about a named employer", correct: true }, { text: "Confidential client information", correct: true }, { text: "A screenshot of an internal discussion", correct: true }, { text: "An article you found useful" }] },
      ], { title: "Practical — Audit yourself", instructions: "Search your own name as an employer would, in a private browser window. Record what is findable, what you would rather was not, and what you changed. Then write your one-page personal policy." }),
      mod("Module 3 — Respect, Culture and Safety", "Working with people unlike you, safely.", [
        ["Cross-Cultural Communication", "Work across countries without misreading people.", ["Directness varying by culture — and how Pakistani indirectness reads abroad", "Hierarchy, titles and first names", "Time, deadlines and religious observance"]],
        ["Respect and Inclusion Online", "Behave so colleagues can work with you.", ["Humour that does not travel", "Names, pronouns and getting them right", "Recognising and not forwarding harassment"]],
        ["Privacy and Security", "Protect information that is not yours.", ["Sharing others' contact details and photographs", "Confidential documents in chat apps", "Recognising phishing and social engineering"]],
      ], [
        { prompt: "Why can indirect communication cause problems with international clients?", options: [{ text: "A polite hedge may be read as agreement or as evasion", correct: true }, { text: "It is grammatically incorrect" }, { text: "It is always inappropriate" }, { text: "It does not cause problems" }] },
        { prompt: "A colleague forwards you a message mocking another colleague. What should you do?", options: [{ text: "Not forward it further, and consider raising it", correct: true }, { text: "Forward it to friends" }, { text: "Reply with something similar" }, { text: "Screenshot it for later" }] },
        { prompt: "Which is a phishing warning sign?", type: "multiple", options: [{ text: "Urgency and a threat of consequences", correct: true }, { text: "A link whose address does not match the sender", correct: true }, { text: "A request for a password or code", correct: true }, { text: "A scheduled meeting invitation from a colleague" }] },
      ]),
    ],
  }),
];

export const leadershipCourses: CourseContent[] = [
  scaffold({
    slug: "leadership-fundamentals",
    title: "Leadership Fundamentals",
    categorySlug: LEAD,
    courseCode: "HS-LD-01",
    summary: "Leading people for the first time — setting direction, delegating, giving feedback, and making decisions you can defend.",
    description: `
Most people are promoted into leadership because they were good at the work, and are then left to learn the entirely different job by trial and error, usually at their team's expense.

This course covers the practical parts: setting expectations, delegating without abandoning, having the conversations that matter, and deciding when information is incomplete. It is written for a first-time supervisor, not for a chief executive.
`.trim(),
    level: "intermediate",
    durationWeeks: 8,
    learningHours: 32,
    prerequisites: "None, though the course is most useful for those leading people or about to.",
    targetLearners: "New and prospective supervisors, team leads, project coordinators, and anyone responsible for others' work.",
    objectives: [
      "Set direction and expectations a team can act on.",
      "Delegate work and hold people accountable fairly.",
      "Give feedback and handle underperformance.",
      "Make decisions under uncertainty and explain them.",
      "Build trust in a team rather than compliance.",
    ],
    outcomes: [
      "Set clear, measurable expectations for a role or task.",
      "Delegate with the authority and support the person needs.",
      "Hold a one-to-one that is useful to the other person.",
      "Address underperformance early and specifically.",
      "Make and communicate an unpopular decision.",
      "Recognise how your own behaviour sets the team's standard.",
    ],
    careers: ["Team Leader", "Supervisor", "Project Coordinator", "Department Head", "Small business owner"],
    skills: ["Delegation", "Feedback", "Decision-making", "One-to-ones", "Accountability"],
    finalProject: "Write a leadership case study of a real situation you handled or observed — the situation, what was done, the outcome, and what you would do differently with what this course taught. Anonymise the people.",
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — What Leading Actually Involves", "The job change nobody explains.", [
        ["From Doing to Leading", "Understand that it is a different job.", ["Your output is now the team's output", "The urge to do it yourself, and why it damages the team", "Authority, responsibility and accountability distinguished"]],
        ["Setting Direction", "Give people something to aim at.", ["Explaining why, not only what", "Expectations specific enough to be met or missed", "Priorities when everything is urgent"]],
        ["Leading by Example", "Recognise that behaviour sets the standard.", ["The team copies what you do, not what you say", "Admitting your own mistakes", "Consistency, and the cost of losing it"]],
      ], [
        { prompt: "What changes most when you move from doing to leading?", options: [{ text: "You are judged on the team's output, not your own", correct: true }, { text: "You work fewer hours" }, { text: "You stop needing technical skill" }, { text: "You attend more meetings" }] },
        { prompt: "Why does doing a struggling team member's work for them cause harm?", options: [{ text: "They do not learn, and you become the bottleneck", correct: true }, { text: "It is against policy" }, { text: "It takes longer" }, { text: "It does not cause harm" }] },
        { prompt: "What makes an expectation usable?", options: [{ text: "It is specific enough that both of you can tell whether it was met", correct: true }, { text: "It is ambitious" }, { text: "It is written down" }, { text: "It is agreed verbally" }] },
      ]),
      mod("Module 2 — Working Through Others", "Delegation, accountability and difficult cases.", [
        ["Delegating Properly", "Hand over work so it succeeds.", ["Matching the task to the person and their stage", "Giving authority along with responsibility", "Checking in without taking over"]],
        ["One-to-Ones and Feedback", "Use regular conversations well.", ["A one-to-one is their meeting, not your status update", "Feedback about behaviour and effect", "Recognising good work specifically"]],
        ["Underperformance", "Address it early and fairly.", ["Naming the gap plainly, with examples", "Finding whether it is ability, clarity, or something outside work", "Agreeing a plan, and following it"]],
      ], [
        { prompt: "Whose meeting is a one-to-one?", options: [{ text: "The team member's", correct: true }, { text: "The manager's" }, { text: "Neither — it is a status update" }, { text: "The department's" }] },
        { prompt: "What must be delegated alongside responsibility?", options: [{ text: "The authority to make the decisions the task requires", correct: true }, { text: "A deadline" }, { text: "A reward" }, { text: "Nothing further" }] },
        { prompt: "Someone's performance has dropped. What comes first?", options: [{ text: "A private conversation to understand why", correct: true }, { text: "A formal warning" }, { text: "Reassigning their work" }, { text: "Waiting to see if it improves" }] },
      ], { title: "Practical — Delegate something real", instructions: "Delegate a real task you would normally do yourself. Record: what you handed over, what authority you gave, how you checked in, and what happened. Include what you found hard about not doing it yourself." }),
      mod("Module 3 — Decisions and Trust", "Deciding, explaining, and being followed.", [
        ["Making Decisions", "Decide when you do not have enough information.", ["Reversible and irreversible decisions treated differently", "Deciding at the right level — not everything is yours", "When to consult and when consultation is theatre"]],
        ["Communicating Decisions", "Explain so people can act, even when they disagree.", ["Giving the reasoning", "Not pretending a decision is open when it is not", "Standing behind an unpopular decision"]],
        ["Building Trust", "Be someone people will follow.", ["Doing what you said", "Protecting the team and taking the blame publicly", "Giving credit specifically and to the right person"]],
      ], [
        { prompt: "How should an easily reversible decision be treated?", options: [{ text: "Made quickly, and changed if it proves wrong", correct: true }, { text: "With the same caution as an irreversible one" }, { text: "Delegated upward" }, { text: "Avoided" }] },
        { prompt: "What is wrong with consulting a team on a decision already made?", options: [{ text: "It wastes their time and destroys trust once discovered", correct: true }, { text: "It takes too long" }, { text: "Nothing — it shows inclusion" }, { text: "It is required" }] },
        { prompt: "Where should credit and blame go?", options: [{ text: "Credit to the individual, publicly; blame taken by the leader, publicly", correct: true }, { text: "Both to the team collectively" }, { text: "Both to the individual" }, { text: "Neither should be public" }] },
      ]),
    ],
  }),

  scaffold({
    slug: "employability-skills",
    title: "Employability Skills",
    categorySlug: LEAD,
    courseCode: "HS-EM-01",
    summary: "Getting hired — a CV that gets read, an application that gets shortlisted, and an interview you are prepared for.",
    description: `
The best candidate does not get the job. The best prepared one does.

This course covers the whole process as it actually works in Pakistan: what happens to your CV in the first eight seconds, why most applications are never read by a person, how to answer the questions every interview asks, and what to do in the weeks after.
`.trim(),
    level: "beginner",
    durationWeeks: 6,
    learningHours: 24,
    prerequisites: "None.",
    targetLearners: "Students and graduates, people returning to work, and anyone changing career.",
    objectives: [
      "Write a CV and covering letter that get shortlisted.",
      "Find opportunities beyond public job advertisements.",
      "Prepare for and perform in an interview.",
      "Present your skills honestly and convincingly.",
      "Handle offers, rejection and the first weeks of a job.",
    ],
    outcomes: [
      "Produce a one or two page CV targeted at a specific role.",
      "Write a covering letter that is about the employer's problem.",
      "Answer the standard interview questions with structured examples.",
      "Ask questions at interview that show you understand the role.",
      "Handle a salary discussion.",
      "Follow up appropriately and learn from rejection.",
    ],
    careers: ["Entering any profession", "Career changers", "Returning to work after a break"],
    skills: ["CV writing", "Covering letters", "Interview technique", "Job searching", "Salary discussion"],
    finalProject: "A complete application package for one real advertised job you would apply for: targeted CV, covering letter, your prepared answers to eight likely questions, and the questions you would ask them.",
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — Your Application", "CV, letter and the eight seconds you get.", [
        ["What Employers Actually Do With a CV", "Understand the process you are entering.", ["The first scan: seconds, not minutes", "Automated filtering and keywords", "Why the same CV sent everywhere fails everywhere"]],
        ["Writing the CV", "Produce something that survives the scan.", ["Structure, length, and what to leave out", "Achievements with numbers rather than duty lists", "Gaps and career changes, handled honestly"]],
        ["Covering Letters", "Say why you, for this job.", ["Their problem first, your evidence second", "Naming the role and the organisation specifically", "Length — one page, never more"]],
      ], [
        { prompt: "What should a CV's bullet points describe?", options: [{ text: "What you achieved, with evidence", correct: true }, { text: "What your duties were" }, { text: "The company's business" }, { text: "Your personal qualities" }] },
        { prompt: "Why does one CV sent to fifty employers perform badly?", options: [{ text: "It matches no specific role, and both filters and humans notice", correct: true }, { text: "Employers share CVs with each other" }, { text: "It is against convention" }, { text: "It does not perform badly" }] },
        { prompt: "How should a covering letter open?", options: [{ text: "With the employer's need and why you address it", correct: true }, { text: "With your name and qualifications" }, { text: "With how much you want the job" }, { text: "With a quotation" }] },
      ], { title: "Practical — Target one real job", instructions: "Find one real advertised job. Write a CV and covering letter targeted specifically at it. Submit the advertisement alongside them, and mark which parts of your application answer which part of the advertisement." }),
      mod("Module 2 — Finding Work", "Where jobs actually come from.", [
        ["Beyond Job Boards", "Find the roles that are never advertised.", ["Referrals and personal networks", "Approaching an employer directly", "Internships, volunteering and building evidence"]],
        ["Your Professional Profile", "Be findable by employers.", ["LinkedIn as a searchable CV", "Portfolios for practical trades", "What a search for your name returns"]],
        ["Applying at Scale Without Spamming", "Manage a job search systematically.", ["Tracking applications", "Following up appropriately", "Handling rejection and learning from it"]],
      ], [
        { prompt: "Where do a large share of jobs come from?", options: [{ text: "Referrals and contacts, often before any advertisement", correct: true }, { text: "Job boards only" }, { text: "Recruitment agencies only" }, { text: "Newspaper advertisements" }] },
        { prompt: "How should rejection be treated?", options: [{ text: "As information — ask for feedback where possible and adjust", correct: true }, { text: "As a verdict on your ability" }, { text: "As a reason to apply more widely without changing anything" }, { text: "As the employer's mistake" }] },
      ]),
      mod("Module 3 — Interviews and Offers", "The conversation and what follows.", [
        ["Preparing for Interview", "Prepare so nerves are manageable.", ["Researching the organisation properly", "Preparing examples using situation, action, result", "Anticipating the hard question about your weakest point"]],
        ["Performing at Interview", "Be at your best in the room.", ["First impression, and what it is actually based on", "Answering fully but not endlessly", "Questions to ask that show you understand the role"]],
        ["Offers, Salary and Starting", "Handle the end of the process.", ["Discussing salary without undervaluing yourself", "Evaluating an offer beyond the number", "The first thirty days in a new job"]],
      ], [
        { prompt: "What structure works for an interview example?", options: [{ text: "Situation, action, result", correct: true }, { text: "Background, opinion, hope" }, { text: "Problem, complaint, resolution" }, { text: "Any order, if detailed" }] },
        { prompt: "Asked about your greatest weakness, what is the best approach?", options: [{ text: "Name a real one and describe what you are doing about it", correct: true }, { text: "Name a strength disguised as a weakness" }, { text: "Say you have none" }, { text: "Name something irrelevant to the job" }] },
        { prompt: "Which should you consider besides salary in an offer?", type: "multiple", options: [{ text: "What you will learn", correct: true }, { text: "Hours, travel and flexibility", correct: true }, { text: "Who you would report to", correct: true }, { text: "The office furniture" }] },
      ]),
    ],
  }),

  scaffold({
    slug: "teamwork-and-collaboration",
    title: "Teamwork and Collaboration",
    categorySlug: LEAD,
    courseCode: "HS-TC-01",
    summary: "Working well with people you did not choose — shared goals, honest disagreement, and carrying your part.",
    description: `
Almost all work is done in groups, and most people have never been taught how. The result is the familiar pattern: two people doing everything, one silent, one disruptive, and a result worse than any of them would have produced alone.

This course covers what makes teams work: clear roles, psychological safety, productive disagreement, and the awkward matter of what to do about a colleague who is not contributing.
`.trim(),
    level: "beginner",
    durationWeeks: 5,
    learningHours: 20,
    prerequisites: "None.",
    targetLearners: "Students working in groups, new employees, project teams, and anyone finding collaboration frustrating.",
    objectives: [
      "Contribute effectively to a team with a shared goal.",
      "Agree roles and responsibilities that prevent duplication and gaps.",
      "Disagree productively without damaging the team.",
      "Handle an unequal contribution fairly.",
      "Work with people whose approach differs from yours.",
    ],
    outcomes: [
      "Set up a team with clear roles and a shared definition of success.",
      "Run a team that keeps everyone informed.",
      "Raise a concern about workload distribution appropriately.",
      "Reach a decision a team will actually follow.",
      "Recognise and repair the common team dysfunctions.",
      "Reflect honestly on your own contribution.",
    ],
    careers: ["Every role", "Project team member", "Student group work", "Volunteer coordination"],
    skills: ["Role clarity", "Collaboration", "Productive conflict", "Shared decisions", "Accountability"],
    finalProject: "Complete a real group task and submit a team charter agreed at the start, a record of how decisions were made, and an honest reflection on your own contribution including one thing you did badly.",
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — What Makes a Team Work", "The conditions, not the personalities.", [
        ["Groups and Teams", "Know the difference and why it matters.", ["A shared goal, not shared presence", "Interdependence", "Why a team of strong individuals can perform poorly"]],
        ["Roles and Responsibilities", "Prevent duplication and gaps.", ["Agreeing who does what, explicitly", "Overlaps and the tasks nobody owns", "Writing it down at the start"]],
        ["Psychological Safety", "Build a team where people speak up.", ["The cost of a team where nobody admits a mistake", "Responding to bad news without punishing the messenger", "Encouraging the quietest person"]],
      ], [
        { prompt: "What distinguishes a team from a group?", options: [{ text: "A shared goal and dependence on each other to reach it", correct: true }, { text: "Size" }, { text: "Working in the same place" }, { text: "Having a leader" }] },
        { prompt: "What happens in a team without psychological safety?", options: [{ text: "Problems are hidden until they are too large to fix", correct: true }, { text: "Work is completed faster" }, { text: "Decisions improve" }, { text: "Nothing measurable" }] },
        { prompt: "When should roles be agreed?", options: [{ text: "At the start, in writing", correct: true }, { text: "As the work reveals them" }, { text: "By the leader alone, later" }, { text: "Only if problems arise" }] },
      ]),
      mod("Module 2 — Working Together", "Communication, decisions and disagreement.", [
        ["Keeping the Team Informed", "Stop information sitting with one person.", ["Shared records over individual memory", "Regular short updates", "Handover when someone is away"]],
        ["Making Decisions as a Team", "Reach something everyone will follow.", ["Consensus, majority and leader's decision — each has its place", "Disagree and commit", "Recording the decision and its reasons"]],
        ["Productive Disagreement", "Argue about the work, not the person.", ["Challenging an idea while supporting the person", "Making the quiet objection audible", "Knowing when to stop arguing"]],
      ], [
        { prompt: "What does 'disagree and commit' mean?", options: [{ text: "Once a decision is made, support it fully even if you argued against it", correct: true }, { text: "Never disagree publicly" }, { text: "Commit only to decisions you agreed with" }, { text: "Keep arguing until you win" }] },
        { prompt: "Which decision method suits an urgent, low-stakes choice?", options: [{ text: "The leader decides", correct: true }, { text: "Full consensus" }, { text: "A written vote" }, { text: "Postponement" }] },
      ], { title: "Practical — A team charter", instructions: "For a real group task, write a charter agreed with the others: the goal, each person's responsibilities, how decisions will be made, and how you will raise it if someone is not contributing. Submit it with everyone's agreement recorded." }),
      mod("Module 3 — When Teams Go Wrong", "Unequal effort, conflict and repair.", [
        ["The Colleague Who Is Not Contributing", "Handle it fairly and early.", ["Finding out why before assuming", "Raising it directly and privately first", "When and how to involve a leader"]],
        ["Common Dysfunctions", "Recognise the patterns.", ["One person doing everything", "Silent disagreement that surfaces at the end", "Groupthink, and the value of the dissenter"]],
        ["Reflection and Improvement", "Get better as a team.", ["Reviewing how the work went, not only what was produced", "Honest self-assessment", "Carrying lessons into the next task"]],
      ], [
        { prompt: "A team member is not delivering. What comes first?", options: [{ text: "A direct, private conversation to understand why", correct: true }, { text: "Telling the leader" }, { text: "Doing their work" }, { text: "Raising it in a group meeting" }] },
        { prompt: "What is groupthink?", options: [{ text: "A team agreeing too readily and suppressing doubts", correct: true }, { text: "Thinking as a group deliberately" }, { text: "Shared planning" }, { text: "Collective decision-making" }] },
        { prompt: "What should a team review cover?", options: [{ text: "How the team worked together, as well as the result", correct: true }, { text: "Only whether the goal was met" }, { text: "Individual blame" }, { text: "Nothing — reviews waste time" }] },
      ]),
    ],
  }),

  scaffold({
    slug: "problem-solving-and-decision-making",
    title: "Problem Solving and Decision Making",
    categorySlug: LEAD,
    courseCode: "HS-PD-01",
    summary: "Define the actual problem, generate real options, and decide — including when the information is incomplete, which it always is.",
    description: `
Most bad decisions are answers to the wrong question. Someone jumps to a solution before anyone has established what is actually wrong.

This course covers defining problems properly, finding root causes rather than symptoms, generating options that are genuinely different, and choosing between them — plus the thinking errors that mislead everyone, including people who know about them.
`.trim(),
    level: "intermediate",
    durationWeeks: 6,
    learningHours: 24,
    prerequisites: "None.",
    targetLearners: "Supervisors, analysts, business owners, and anyone whose work involves deciding rather than following instructions.",
    objectives: [
      "Define a problem before attempting to solve it.",
      "Find root causes rather than treating symptoms.",
      "Generate options that are genuinely different from each other.",
      "Choose using criteria agreed in advance.",
      "Recognise the biases that distort your own judgement.",
    ],
    outcomes: [
      "Write a problem statement that separates symptom from cause.",
      "Apply root cause analysis to a real problem.",
      "Generate several distinct options rather than one and a straw man.",
      "Use a simple decision matrix with weighted criteria.",
      "Identify confirmation bias, sunk cost and anchoring in your own reasoning.",
      "Decide under uncertainty and explain what would change your mind.",
    ],
    careers: ["Supervisor", "Analyst", "Business owner", "Project manager", "Operations staff"],
    skills: ["Problem definition", "Root cause analysis", "Option generation", "Decision matrices", "Bias awareness"],
    finalProject: "Take a real unsolved problem. Produce a problem statement, root cause analysis, at least four genuinely different options, a decision matrix, your recommendation, and what evidence would change it.",
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — Defining the Problem", "The step most often skipped.", [
        ["Symptom and Cause", "Stop solving the wrong thing.", ["What a problem statement contains", "Separating what is happening from why", "The danger of arriving with a solution"]],
        ["Root Cause Analysis", "Get past the first answer.", ["Five whys, used properly", "Cause and effect diagrams", "Where the technique fails — multiple causes"]],
        ["Gathering Evidence", "Find out rather than assume.", ["Asking the people closest to the work", "Data that settles the question", "Recognising when you have enough"]],
      ], [
        { prompt: "Staff keep making the same error. What is the symptom and what might be the cause?", options: [{ text: "The errors are the symptom; unclear instructions or a bad process may be the cause", correct: true }, { text: "The errors are the cause; staff are the symptom" }, { text: "Both are causes" }, { text: "There is no distinction" }] },
        { prompt: "What is the main limitation of five whys?", options: [{ text: "It leads to one chain of causes when problems usually have several", correct: true }, { text: "It takes too long" }, { text: "It needs software" }, { text: "It has no limitations" }] },
        { prompt: "Who is most likely to know why a process keeps failing?", options: [{ text: "The people doing the work every day", correct: true }, { text: "Senior management" }, { text: "An external consultant" }, { text: "The person who designed it" }] },
      ]),
      mod("Module 2 — Generating and Choosing Options", "Real alternatives, and a way to compare them.", [
        ["Generating Options", "Produce more than one real choice.", ["Why the first idea is rarely the best", "Separating generating from judging", "The option of doing nothing, taken seriously"]],
        ["Comparing Options", "Decide on criteria, not impressions.", ["Agreeing criteria before looking at options", "Weighting what matters", "A simple decision matrix"]],
        ["Deciding Under Uncertainty", "Choose without complete information.", ["Reversible and irreversible decisions", "Deciding what would change your mind", "The cost of delay, counted honestly"]],
      ], [
        { prompt: "When should decision criteria be agreed?", options: [{ text: "Before examining the options", correct: true }, { text: "After shortlisting" }, { text: "At the end, to justify the choice" }, { text: "They are not necessary" }] },
        { prompt: "Why separate generating options from judging them?", options: [{ text: "Judging too early kills ideas before they are developed", correct: true }, { text: "It is faster" }, { text: "It produces fewer options" }, { text: "It is a formality" }] },
        { prompt: "What should you state when deciding under uncertainty?", options: [{ text: "What evidence would make you change the decision", correct: true }, { text: "That you are certain" }, { text: "Who is responsible if it fails" }, { text: "Nothing further" }] },
      ], { title: "Practical — Solve something real", instructions: "Take a genuine unsolved problem at work, in study or at home. Work through definition, root cause, four distinct options and a weighted matrix. Submit the working, not just the conclusion." }),
      mod("Module 3 — Thinking Clearly", "The errors everyone makes.", [
        ["Common Biases", "Recognise distortion in your own reasoning.", ["Confirmation bias", "Anchoring on the first number heard", "Availability: judging by what comes to mind"]],
        ["Sunk Cost and Escalation", "Stop throwing good money after bad.", ["Why money already spent is irrelevant to the next decision", "Escalation of commitment", "Deciding in advance when you would stop"]],
        ["Reviewing Decisions", "Learn from outcomes properly.", ["Judging the decision by the reasoning, not only the result", "A good decision with a bad outcome", "Recording why you decided, at the time"]],
      ], [
        { prompt: "A project has consumed two years and is failing. What is relevant to whether to continue?", options: [{ text: "Only the future costs and benefits from today", correct: true }, { text: "The two years already spent" }, { text: "How much has been invested overall" }, { text: "The reputational cost of stopping" }] },
        { prompt: "What is confirmation bias?", options: [{ text: "Favouring information that supports what you already believe", correct: true }, { text: "Confirming a decision in writing" }, { text: "Seeking approval before deciding" }, { text: "Repeating a successful decision" }] },
        { prompt: "A decision was well reasoned but turned out badly. What does this mean?", options: [{ text: "It can still have been a good decision — outcomes involve chance", correct: true }, { text: "The reasoning must have been wrong" }, { text: "The decision maker should be replaced" }, { text: "Nothing can be learned" }] },
      ]),
    ],
  }),

  scaffold({
    slug: "career-development-and-job-readiness",
    title: "Career Development and Job Readiness",
    categorySlug: LEAD,
    courseCode: "HS-CD-01",
    summary: "Plan a career rather than drift through one — direction, skills, networks, and the habits that compound over years.",
    description: `
Most careers happen by accident. Opportunities arrive, people take them or miss them, and years later they wonder how they ended up where they are.

This course is about deliberateness: working out what you want, closing the gap between where you are and what that requires, building relationships before you need them, and managing the first years of work so that they add up to something.
`.trim(),
    level: "beginner",
    durationWeeks: 6,
    learningHours: 24,
    prerequisites: "None.",
    targetLearners: "Students, early-career professionals, career changers, and anyone who feels their working life is happening to them.",
    objectives: [
      "Identify what you want from work, specifically enough to act on.",
      "Assess your skills honestly against what a target role requires.",
      "Build professional relationships before you need them.",
      "Plan and pursue development deliberately.",
      "Manage your own progression, including asking for it.",
    ],
    outcomes: [
      "Write a career direction statement with a three-year horizon.",
      "Perform a skills gap analysis against a real job description.",
      "Build a development plan with specific, dated actions.",
      "Approach someone for advice without asking them for a job.",
      "Prepare a case for promotion or a raise.",
      "Review and adjust a career plan annually.",
    ],
    careers: ["All professions", "Career changers", "Early-career professionals"],
    skills: ["Career planning", "Skills gap analysis", "Networking", "Self-assessment", "Progression"],
    finalProject: "A three-year career plan: where you are, a specific target role with a real job description attached, a skills gap analysis, a dated development plan, and the three people you will approach with what you will ask them.",
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — Direction", "Working out what you actually want.", [
        ["Knowing Yourself", "Assess yourself honestly.", ["Strengths, interests, values and constraints", "What you are good at versus what you enjoy", "Constraints that are real and constraints you assumed"]],
        ["Exploring Options", "Find out what roles actually involve.", ["Researching a job beyond the title", "Talking to people who do it", "Realistic pay, hours and progression in Pakistan"]],
        ["Setting a Direction", "Commit to something specific enough to act on.", ["A three-year horizon rather than a lifetime plan", "Direction that survives changing your mind", "Writing it down"]],
      ], [
        { prompt: "Why is a three-year horizon more useful than a lifetime plan?", options: [{ text: "It is specific enough to act on and short enough to be realistic", correct: true }, { text: "Careers last three years" }, { text: "Employers ask for it" }, { text: "It requires less thought" }] },
        { prompt: "What is the best way to learn what a job actually involves?", options: [{ text: "Speak to people who do it", correct: true }, { text: "Read the job description" }, { text: "Search online" }, { text: "Ask a careers adviser" }] },
      ]),
      mod("Module 2 — Closing the Gap", "Skills, evidence and development.", [
        ["Skills Gap Analysis", "Compare where you are to where you are going.", ["Taking a real job description apart", "Rating yourself honestly against each requirement", "Distinguishing what is essential from what is desirable"]],
        ["Development Planning", "Turn a gap into dated actions.", ["Courses, projects, volunteering, and learning on the job", "Specific actions with dates, not intentions", "Finding a mentor"]],
        ["Building Evidence", "Be able to prove what you claim.", ["A portfolio for any kind of work", "Keeping a record of what you achieved, as it happens", "Certificates, and what they are and are not worth"]],
      ], [
        { prompt: "How should you rate yourself in a skills gap analysis?", options: [{ text: "Honestly, against the evidence you could produce", correct: true }, { text: "Optimistically, to stay motivated" }, { text: "Harshly, to stay humble" }, { text: "By comparison with colleagues" }] },
        { prompt: "What makes a development action useful rather than an intention?", options: [{ text: "It is specific and has a date", correct: true }, { text: "It is ambitious" }, { text: "It is written down" }, { text: "It is shared with a manager" }] },
        { prompt: "When should you record an achievement?", options: [{ text: "As it happens — you will not remember the detail later", correct: true }, { text: "At annual review time" }, { text: "When applying for a job" }, { text: "Only if it was significant" }] },
      ], { title: "Practical — Gap analysis", instructions: "Find a real job description for a role you would want in three years. Rate yourself against every requirement with evidence. Produce a dated development plan for the three largest gaps." }),
      mod("Module 3 — Relationships and Progression", "People, and asking for what you want.", [
        ["Professional Relationships", "Build a network before you need one.", ["Why networking feels distasteful, and what it actually is", "Approaching someone for advice rather than a job", "Maintaining contact without only appearing when you need something"]],
        ["Managing Your Progression", "Ask, rather than wait to be noticed.", ["Making your work visible without boasting", "Preparing a case for promotion or a raise", "Handling a refusal, and what to ask for instead"]],
        ["Reviewing and Adjusting", "Keep the plan alive.", ["An annual review of your own direction", "Changing course without treating it as failure", "Knowing when to leave a job"]],
      ], [
        { prompt: "What is the better way to approach a senior person you do not know?", options: [{ text: "Ask for specific advice about their field", correct: true }, { text: "Ask whether they have a vacancy" }, { text: "Send your CV" }, { text: "Ask for an introduction to their manager" }] },
        { prompt: "What should a case for a raise be built on?", options: [{ text: "Evidence of your contribution and the value of the role", correct: true }, { text: "How long you have been there" }, { text: "What colleagues earn" }, { text: "Your personal expenses" }] },
        { prompt: "How often should a career plan be reviewed?", options: [{ text: "At least annually", correct: true }, { text: "Only when changing jobs" }, { text: "Every five years" }, { text: "Never — a plan should be followed" }] },
      ]),
    ],
  }),
];
