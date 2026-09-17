import { scaffold } from "./scaffold.ts";
import type { CourseContent, QuizContent } from "./types.ts";
import type { ModuleSpec } from "./scaffold.ts";

const ENT = "entrepreneurship-and-financial-literacy";
const WELL = "mental-wellbeing";
const SOURCE =
  "Syllabus developed by Hunarsaaz. No NAVTTC qualification was consulted — navttc.gov.pk is unreachable from this environment — and no NAVTTC claim is made.";

/**
 * Every wellbeing course carries this. These are educational courses about
 * ordinary wellbeing, and a learner in difficulty must not read them as care.
 */
const WELLBEING_NOTICE = `
**This is an educational course, not healthcare.** It does not diagnose, treat or replace advice from a doctor, psychologist or psychiatrist.

If you are struggling with your mental health, please speak to a qualified professional. If you are in crisis or thinking about harming yourself, contact a doctor, a hospital emergency department, or someone you trust today.
`.trim();

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

export const enterpriseCourses: CourseContent[] = [
  scaffold({
    slug: "entrepreneurship-fundamentals",
    title: "Entrepreneurship Fundamentals",
    categorySlug: ENT,
    courseCode: "HS-EN-01",
    summary: "Finding an idea worth pursuing, testing it cheaply, and knowing when to stop — before you spend your savings.",
    description: `
Most business advice assumes you already have a good idea. Most people do not — they have an interest, which is not the same thing.

This course is about finding a problem worth solving, testing whether anyone will pay before you commit money, and building a model that works on paper first. It includes the part most courses avoid: how to tell when an idea is not working, and stop.
`.trim(),
    level: "beginner",
    durationWeeks: 8,
    learningHours: 32,
    prerequisites: "None. No capital required — the course is designed to be completed before spending money.",
    targetLearners: "Anyone considering starting a business, family business members, and students exploring self-employment.",
    objectives: [
      "Find a problem worth solving rather than starting from a product.",
      "Test demand before committing money.",
      "Build and challenge a business model.",
      "Understand the basic numbers of a business.",
      "Judge when to continue, change direction or stop.",
    ],
    outcomes: [
      "Write a problem statement and identify who has it.",
      "Complete a business model canvas.",
      "Run a cheap test of demand and read the result honestly.",
      "Calculate startup costs, unit economics and break-even.",
      "Identify the riskiest assumption and test it first.",
      "Decide on evidence whether to proceed.",
    ],
    careers: ["Small business owner", "Self-employed", "Family business", "Startup founder", "Business development"],
    skills: ["Idea validation", "Business model canvas", "Unit economics", "Customer interviews", "Break-even analysis"],
    finalProject: "A validated business idea: the problem, evidence real people have it, a completed canvas, unit economics, your riskiest assumption and how you tested it, and your honest recommendation — including 'do not proceed' if that is what the evidence says.",
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — Finding a Real Problem", "Ideas come from problems, not from products.", [
        ["What Entrepreneurship Actually Is", "Set realistic expectations.", ["Solving a problem someone will pay to have solved", "The failure rate, stated plainly", "Self-employment, small business and high-growth startups distinguished"]],
        ["Finding Problems Worth Solving", "Look where you already have knowledge.", ["Problems you or your family experience", "Listening for complaints and workarounds", "Why 'nobody is doing this' usually means nobody wants it"]],
        ["Understanding the Customer", "Find out whether anyone else has this problem.", ["Customer interviews that do not lead the answer", "Asking about past behaviour rather than future intention", "What people say versus what they pay for"]],
      ], [
        { prompt: "Which question produces more reliable information in a customer interview?", options: [{ text: "What did you do the last time this happened?", correct: true }, { text: "Would you buy this?" }, { text: "Do you like this idea?" }, { text: "How much would you pay?" }] },
        { prompt: "Nobody is offering the product you have in mind. What is the most likely explanation?", options: [{ text: "There is little demand for it", correct: true }, { text: "You have found an untapped market" }, { text: "Others lack the skill" }, { text: "The market is too new" }] },
        { prompt: "Where should a business idea start?", options: [{ text: "With a problem someone has", correct: true }, { text: "With a product you want to make" }, { text: "With available capital" }, { text: "With a trend" }] },
      ], { title: "Practical — Ten customer interviews", instructions: "Interview ten real people who may have the problem you think you have found. Ask about what they do now, not about your idea. Submit your questions, the answers, and what surprised you. Discovering the problem is not real scores full marks." }),
      mod("Module 2 — The Business Model", "How the thing actually makes money.", [
        ["Business Model Canvas", "Map the whole business on one page.", ["Customer segments, value proposition, channels", "Revenue streams and cost structure", "Key activities, resources and partners"]],
        ["Value Proposition", "Say clearly why anyone would choose you.", ["The specific benefit, for a specific person", "Competitors, including 'carry on as they are'", "Testing the statement on real people"]],
        ["Revenue and Costs", "Understand the money before you commit it.", ["Fixed and variable costs", "Unit economics: what one sale actually earns", "Break-even, and whether it is plausible"]],
      ], [
        { prompt: "What is usually the largest competitor to a new product?", options: [{ text: "The customer continuing to do what they already do", correct: true }, { text: "The market leader" }, { text: "A cheaper imitation" }, { text: "An international brand" }] },
        { prompt: "What do unit economics tell you?", options: [{ text: "Whether one sale makes or loses money", correct: true }, { text: "Total annual revenue" }, { text: "How much capital you need" }, { text: "The market size" }] },
        { prompt: "Break-even requires selling 4,000 units a month in a town of 15,000 people. What does this suggest?", options: [{ text: "The model does not work and must change", correct: true }, { text: "Marketing must be increased" }, { text: "Prices should be lowered" }, { text: "It is achievable with effort" }] },
      ]),
      mod("Module 3 — Testing and Deciding", "Evidence before commitment.", [
        ["Testing Cheaply", "Learn the most for the least money.", ["The riskiest assumption, identified and tested first", "A minimum test: one listing, one post, one stall", "Pre-orders as the strongest signal"]],
        ["Reading the Result Honestly", "Avoid deceiving yourself.", ["Interest, enthusiasm and payment are three different things", "Setting the threshold before the test", "Feedback from friends and family, discounted appropriately"]],
        ["Continue, Change or Stop", "Decide on evidence.", ["What would make you change direction", "Sunk cost, and why the money already spent is irrelevant", "Stopping well — it is a result, not a failure"]],
      ], [
        { prompt: "What is the strongest evidence of demand?", options: [{ text: "People paying before the product exists", correct: true }, { text: "Positive comments" }, { text: "Social media followers" }, { text: "Family encouragement" }] },
        { prompt: "When should the threshold for a test be set?", options: [{ text: "Before running it", correct: true }, { text: "After seeing the results" }, { text: "It is not needed" }, { text: "Once the first sale arrives" }] },
        { prompt: "You have spent Rs 200,000 and the evidence says the idea does not work. What is relevant?", options: [{ text: "Only what the next rupee will achieve", correct: true }, { text: "Recovering the Rs 200,000" }, { text: "How long you have worked on it" }, { text: "What people will say" }] },
      ], { title: "Practical — Run one test", instructions: "Identify your riskiest assumption. Design a test costing under Rs 2,000. Set your threshold in advance in writing. Run it. Report the result and your decision — continue, change, or stop." }),
    ],
  }),

  scaffold({
    slug: "starting-a-small-business",
    title: "Starting a Small Business",
    categorySlug: ENT,
    courseCode: "HS-SB-01",
    summary: "The practical steps of actually starting — registration, licences, premises, suppliers, staff and the first customers.",
    description: `
This course starts where idea validation ends. You have decided to proceed; now there is a great deal to do, much of it administrative and none of it optional.

It covers registration and the legal forms available in Pakistan, tax registration, premises, suppliers, the first hire, and the operational habits that decide whether a promising business survives its first year.

It is general guidance, not legal or tax advice. Rules change and circumstances differ — verify anything consequential with a qualified accountant or lawyer.
`.trim(),
    level: "beginner",
    durationWeeks: 8,
    learningHours: 32,
    prerequisites: "A validated business idea, or the Entrepreneurship Fundamentals course.",
    targetLearners: "People about to start a business, existing informal traders wanting to formalise, and family business members.",
    objectives: [
      "Understand the legal forms a business can take and choose one.",
      "Complete the registrations a business needs.",
      "Set up operations: premises, suppliers, stock and records.",
      "Hire a first employee responsibly.",
      "Find and keep the first customers.",
    ],
    outcomes: [
      "Compare sole proprietorship, partnership and company.",
      "Describe the registration and tax steps and where to do them.",
      "Assess premises and negotiate basic terms.",
      "Set up supplier relationships and stock control.",
      "Understand the obligations of employing someone.",
      "Produce a plan for the first ninety days of trading.",
    ],
    careers: ["Business owner", "Shop or workshop proprietor", "Service business", "Family business successor"],
    skills: ["Business registration", "Operations setup", "Supplier management", "Basic employment", "Launch planning"],
    finalProject: "A startup plan for your business: legal form with reasoning, registration checklist, premises and supplier decisions, first ninety days week by week, and a list of what you must confirm with an accountant or lawyer.",
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — Setting Up Legally", "Structure, registration and obligations.", [
        ["Choosing a Legal Form", "Pick the structure that suits the business.", ["Sole proprietorship, partnership, private limited company", "Liability, and what it means for personal assets", "Cost and complexity of each"]],
        ["Registration and Tax", "Complete what the law requires.", ["National Tax Number and FBR registration", "Sales tax, where applicable", "Provincial and local licences by business type"]],
        ["Records From Day One", "Keep the records you will be asked for.", ["Separating business and personal money — the first rule", "What to keep and for how long", "Why reconstructing a year later is impossible"]],
      ], [
        { prompt: "What is the main risk of a sole proprietorship?", options: [{ text: "Personal assets are exposed to business debts", correct: true }, { text: "It cannot employ people" }, { text: "It pays more tax" }, { text: "It cannot open a bank account" }] },
        { prompt: "What is the first financial discipline for a new business?", options: [{ text: "Separating business and personal money", correct: true }, { text: "Hiring an accountant" }, { text: "Buying accounting software" }, { text: "Registering for sales tax" }] },
        { prompt: "This course is which of the following?", options: [{ text: "General guidance — consequential matters need a qualified accountant or lawyer", correct: true }, { text: "Legal advice" }, { text: "Tax advice" }, { text: "A substitute for professional help" }] },
      ]),
      mod("Module 2 — Operations", "Premises, suppliers and stock.", [
        ["Premises and Equipment", "Decide where and with what.", ["Home, shared, rented — cost against credibility", "Lease terms to look at carefully", "Buying versus renting equipment"]],
        ["Suppliers", "Build relationships that hold under pressure.", ["Finding and comparing suppliers", "Negotiating terms and credit", "Never depending on a single supplier"]],
        ["Stock and Cash", "Keep trading without running out of either.", ["Stock as money sitting on a shelf", "Reorder points", "Why profitable businesses still fail on cash flow"]],
      ], [
        { prompt: "Why can a profitable business still fail?", options: [{ text: "It runs out of cash before payments arrive", correct: true }, { text: "Profit is taxed too heavily" }, { text: "Customers complain" }, { text: "It cannot happen" }] },
        { prompt: "What is the risk of a single supplier?", options: [{ text: "If they fail or raise prices, you have no alternative", correct: true }, { text: "Higher prices always" }, { text: "Poorer quality" }, { text: "There is no risk" }] },
        { prompt: "What does holding a lot of stock represent?", options: [{ text: "Money tied up that cannot be used elsewhere", correct: true }, { text: "A stronger business" }, { text: "Lower costs" }, { text: "Better customer service only" }] },
      ], { title: "Practical — Compare three suppliers", instructions: "Contact three real suppliers for something your business needs. Compare price, minimum order, lead time, payment terms and what happens if there is a problem. State which you would choose and why — and it should not automatically be the cheapest." }),
      mod("Module 3 — People and the First Customers", "Hiring, launching and the first ninety days.", [
        ["Employing Someone", "Take on staff responsibly.", ["What employing someone commits you to", "Written terms, hours and pay", "Hiring a first employee: attitude over experience"]],
        ["First Customers", "Get trading.", ["The people you already know", "Pricing at launch, and the trap of starting too cheap", "Asking for a review or referral from the first customers"]],
        ["The First Ninety Days", "Survive the start.", ["What to measure weekly", "Knowing when to change course", "Handling the first serious complaint"]],
      ], [
        { prompt: "What is the risk of launching at a very low price?", options: [{ text: "You attract price-driven customers and cannot raise it later", correct: true }, { text: "Customers doubt the quality only" }, { text: "There is no risk" }, { text: "Tax is calculated differently" }] },
        { prompt: "What should be agreed in writing when employing someone?", type: "multiple", options: [{ text: "Pay and when it is paid", correct: true }, { text: "Hours and days", correct: true }, { text: "What the job involves", correct: true }, { text: "Their personal plans" }] },
        { prompt: "When should a new business ask for reviews?", options: [{ text: "From the first satisfied customers, directly", correct: true }, { text: "After a year of trading" }, { text: "Only online" }, { text: "Never — it looks desperate" }] },
      ]),
    ],
  }),

  scaffold({
    slug: "financial-literacy-for-individuals",
    title: "Financial Literacy for Individuals",
    categorySlug: ENT,
    courseCode: "HS-FI-01",
    summary: "Managing your own money — budgeting, saving, debt, and avoiding the schemes that take it from you.",
    description: `
Personal financial difficulty is rarely about income alone. It is about money arriving and leaving without anyone tracking it, borrowing that costs more than it appeared to, and savings that never start.

This course covers the practical basics, written for Pakistani circumstances: irregular income, family obligations, informal savings arrangements, inflation, and the fraud that targets people trying to improve their position.

It is education, not financial advice. It does not recommend particular products or investments.
`.trim(),
    level: "beginner",
    durationWeeks: 5,
    learningHours: 20,
    prerequisites: "None.",
    targetLearners: "Everyone — students, workers, freelancers with irregular income, and anyone who has never made a budget.",
    objectives: [
      "Know where your money goes.",
      "Build and keep a budget that survives real life.",
      "Save deliberately, including on an irregular income.",
      "Understand debt and what it actually costs.",
      "Recognise financial fraud before it reaches your money.",
    ],
    outcomes: [
      "Track income and expenditure for a month.",
      "Build a budget and adjust it when it fails.",
      "Build an emergency fund, starting from a small amount.",
      "Calculate the true cost of a loan or instalment plan.",
      "Explain how inflation reduces the value of money held as cash.",
      "Identify the common signs of a fraudulent scheme.",
    ],
    careers: ["Applies to everyone", "Useful preparation for business courses"],
    skills: ["Budgeting", "Saving", "Debt management", "Fraud awareness", "Financial planning"],
    finalProject: "Track every rupee for one month. Produce the record, a budget built from it, a savings plan with a specific monthly amount, and a note on the one habit you will change.",
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — Knowing Where the Money Goes", "Tracking and budgeting.", [
        ["Income and Expenditure", "See the whole picture.", ["Fixed, variable and occasional costs", "The spending nobody notices", "Irregular income, and budgeting on the lowest month"]],
        ["Building a Budget", "Make a plan that survives contact with real life.", ["A simple method: needs, wants, savings", "Budgeting for irregular and seasonal costs", "What to do when the budget fails, which it will"]],
        ["Tracking in Practice", "Actually record it.", ["Notebook, phone or spreadsheet — whichever you will keep", "Reviewing weekly", "Family and shared finances"]],
      ], [
        { prompt: "On irregular income, which month should the budget be based on?", options: [{ text: "The lowest month", correct: true }, { text: "The average" }, { text: "The best month" }, { text: "Last month" }] },
        { prompt: "What is the first step in managing money?", options: [{ text: "Finding out where it currently goes", correct: true }, { text: "Opening a savings account" }, { text: "Reducing expenses" }, { text: "Increasing income" }] },
        { prompt: "Your budget fails in the second week. What should you do?", options: [{ text: "Adjust it — a budget that never survives is set wrongly", correct: true }, { text: "Abandon budgeting" }, { text: "Ignore the overspend" }, { text: "Borrow to cover the gap" }] },
      ], { title: "Practical — Track one month", instructions: "Record every rupee in and out for thirty days. No estimating. Submit the record with a summary by category and the three things that surprised you." }),
      mod("Module 2 — Saving and Debt", "Building reserves and understanding borrowing.", [
        ["Saving Deliberately", "Make saving happen rather than hoping.", ["An emergency fund, and why it comes first", "Paying yourself first", "Saving on an irregular or very low income"]],
        ["Understanding Debt", "Know what borrowing actually costs.", ["Interest, and how instalment plans disguise it", "Calculating the total repaid, not the monthly figure", "Good and bad reasons to borrow"]],
        ["Inflation and the Value of Money", "Understand why cash loses value.", ["What inflation does to savings held as cash", "Why Rs 100,000 under a mattress shrinks every year", "Why this course does not recommend specific investments"]],
      ], [
        { prompt: "What should you calculate before agreeing an instalment plan?", options: [{ text: "The total amount repaid compared with the cash price", correct: true }, { text: "The monthly payment only" }, { text: "The number of instalments" }, { text: "The deposit" }] },
        { prompt: "What does inflation do to money kept as cash?", options: [{ text: "It buys less each year", correct: true }, { text: "It increases in value" }, { text: "It stays the same" }, { text: "It depends on the bank" }] },
        { prompt: "What should an emergency fund be built before?", options: [{ text: "Any other saving or investing", correct: true }, { text: "Paying rent" }, { text: "Buying food" }, { text: "It is the last priority" }] },
      ]),
      mod("Module 3 — Protecting Yourself", "Fraud, pressure and planning ahead.", [
        ["Recognising Financial Fraud", "Spot a scheme before it takes your money.", ["Guaranteed high returns — the reliable warning sign", "Schemes that pay early joiners from later ones", "Urgency and pressure as tactics"]],
        ["Digital Financial Safety", "Protect accounts and wallets.", ["Never sharing a PIN or OTP, with anyone, ever", "Fake calls claiming to be from a bank or wallet", "Checking a transfer before sending"]],
        ["Planning Ahead", "Think beyond this month.", ["Saving for a known future cost", "Family obligations, planned rather than absorbed", "Talking about money within a family"]],
      ], [
        { prompt: "An investment guarantees 20% monthly returns with no risk. What is it?", options: [{ text: "Almost certainly fraud", correct: true }, { text: "A good opportunity" }, { text: "Worth a small amount" }, { text: "Worth checking with the promoter" }] },
        { prompt: "Someone calls saying they are from your bank and asks for the code just sent to you. What do you do?", options: [{ text: "End the call — a bank never asks for that code", correct: true }, { text: "Give it, to verify your identity" }, { text: "Give only the first three digits" }, { text: "Call them back on the number they give" }] },
        { prompt: "Which are warning signs of a fraudulent scheme?", type: "multiple", options: [{ text: "Pressure to decide immediately", correct: true }, { text: "Returns that depend on recruiting others", correct: true }, { text: "Guaranteed returns far above normal", correct: true }, { text: "Written terms you can take away and read" }] },
      ]),
    ],
  }),

  scaffold({
    slug: "small-business-finance",
    title: "Small Business Finance",
    categorySlug: ENT,
    courseCode: "HS-BF-01",
    summary: "Costing, pricing, cash flow and the accounts that tell you whether the business is actually working.",
    description: `
A great many small businesses do not know whether they are profitable. Money comes in, money goes out, and the owner judges by whether the bank balance feels healthy.

This course fixes that. It covers what things really cost, how to price so that selling more makes you richer rather than poorer, managing cash, and reading the three statements that describe a business.

Arithmetic only. No accounting background needed.
`.trim(),
    level: "intermediate",
    durationWeeks: 8,
    learningHours: 32,
    prerequisites: "Running a business or about to. Financial Literacy for Individuals is helpful.",
    targetLearners: "Small business owners, shopkeepers, freelancers with growing income, and family business members taking on the books.",
    objectives: [
      "Calculate what a product or service genuinely costs you.",
      "Price so that volume increases profit.",
      "Manage cash flow and anticipate shortfalls.",
      "Read and use the basic financial statements.",
      "Judge whether a business decision is affordable.",
    ],
    outcomes: [
      "Separate fixed and variable costs and allocate overheads.",
      "Calculate gross margin, contribution and break-even.",
      "Set prices using cost, market and value.",
      "Build a twelve-month cash flow forecast.",
      "Read a profit and loss account, balance sheet and cash flow statement.",
      "Decide whether the business can afford a purchase or a hire.",
    ],
    careers: ["Business owner", "Accounts Assistant", "Shop manager", "Freelancer managing their own books"],
    skills: ["Costing", "Pricing", "Cash flow forecasting", "Financial statements", "Break-even analysis"],
    finalProject: "A complete financial picture of a real business: costing of one product, pricing with reasoning, a twelve-month cash flow forecast, break-even, and one recommendation supported by your own figures.",
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — What Things Cost", "Costing and margin.", [
        ["Fixed and Variable Costs", "Separate the two, because they behave differently.", ["Costs that change with volume and costs that do not", "Overheads, and allocating them honestly", "The cost of your own time"]],
        ["Cost of Goods and Gross Margin", "Know what each sale leaves behind.", ["Direct cost per unit", "Gross margin, and what it must cover", "Where margin quietly disappears: waste, returns, discounts"]],
        ["Break-Even", "Know how much you must sell.", ["Contribution per unit", "Break-even quantity and revenue", "Whether the number is plausible"]],
      ], [
        { prompt: "Rent is which kind of cost?", options: [{ text: "Fixed", correct: true }, { text: "Variable" }, { text: "Direct" }, { text: "It depends on sales" }] },
        { prompt: "Why must your own time be counted as a cost?", options: [{ text: "Otherwise the business looks profitable only because you are unpaid", correct: true }, { text: "For tax purposes" }, { text: "It should not be counted" }, { text: "To increase the price" }] },
        { prompt: "What does contribution per unit contribute towards?", options: [{ text: "Fixed costs first, then profit", correct: true }, { text: "Variable costs" }, { text: "Tax" }, { text: "Stock purchases" }] },
      ]),
      mod("Module 2 — Pricing and Cash", "Setting prices and staying solvent.", [
        ["Pricing Properly", "Arrive at a price that works.", ["Cost-plus as the floor, not the answer", "Pricing on value and on the market", "Discounting, and how much extra volume it requires"]],
        ["Cash Flow", "Survive the gap between paying and being paid.", ["Profit and cash are different things", "Debtors, creditors and stock", "Forecasting twelve months ahead"]],
        ["Managing a Shortfall", "Act before the cash runs out.", ["Spotting a shortfall in advance", "Collecting what you are owed, professionally", "Negotiating terms rather than defaulting"]],
      ], [
        { prompt: "You discount by 20% on a 40% margin. Roughly how much more must you sell to earn the same?", options: [{ text: "Double", correct: true }, { text: "20% more" }, { text: "40% more" }, { text: "The same" }] },
        { prompt: "Why is profit not the same as cash?", options: [{ text: "Sales may be invoiced but unpaid, and stock ties money up", correct: true }, { text: "Tax is deducted from profit" }, { text: "They are the same" }, { text: "Profit includes personal drawings" }] },
        { prompt: "When should a cash shortfall be addressed?", options: [{ text: "As soon as the forecast shows it coming", correct: true }, { text: "When payments start failing" }, { text: "At the year end" }, { text: "When the bank calls" }] },
      ], { title: "Practical — Twelve-month forecast", instructions: "Build a twelve-month cash flow forecast for a real business. Include seasonality, a slow-paying customer, and one unexpected cost. Identify the tightest month and say what you would do about it." }),
      mod("Module 3 — Reading the Accounts", "The three statements and what they tell you.", [
        ["Profit and Loss", "See whether the business made money.", ["Revenue, cost of sales, gross profit, expenses, net profit", "The period it covers", "What it does not show"]],
        ["Balance Sheet and Cash Flow", "See what the business owns and owes.", ["Assets, liabilities, equity", "The cash flow statement in plain terms", "How the three statements connect"]],
        ["Using the Numbers to Decide", "Make decisions on evidence.", ["Can the business afford this purchase or hire?", "Which product actually earns", "When to seek professional advice"]],
      ], [
        { prompt: "Which statement shows what a business owns and owes at a point in time?", options: [{ text: "The balance sheet", correct: true }, { text: "Profit and loss" }, { text: "Cash flow statement" }, { text: "The sales ledger" }] },
        { prompt: "A product sells well but has almost no margin. What should you consider?", options: [{ text: "Raising its price or discontinuing it", correct: true }, { text: "Selling more of it" }, { text: "Advertising it harder" }, { text: "Nothing — volume is good" }] },
        { prompt: "When should you involve a qualified accountant?", options: [{ text: "For tax, statutory accounts, and any consequential decision", correct: true }, { text: "Never, if you can read the statements" }, { text: "Only if audited" }, { text: "Only at year end" }] },
      ]),
    ],
  }),

  scaffold({
    slug: "business-planning-and-entrepreneurship",
    title: "Business Planning and Entrepreneurship",
    categorySlug: ENT,
    courseCode: "HS-BP-01",
    summary: "Write a business plan that convinces a lender or partner — and, more importantly, that you would act on yourself.",
    description: `
A business plan written only to obtain a loan is usually useless for running the business. A good one is a working document: it states what you believe, what you will do, and how you will know if you were wrong.

This course covers researching a market properly, building financial projections you can defend line by line, writing the plan, and presenting it to someone who will ask hard questions.
`.trim(),
    level: "intermediate",
    durationWeeks: 8,
    learningHours: 36,
    prerequisites: "Entrepreneurship Fundamentals, or a business idea you have already tested. Small Business Finance is strongly recommended.",
    targetLearners: "Anyone seeking finance or a partner, business owners planning growth, and applicants to grant or incubation programmes.",
    objectives: [
      "Research a market and size it honestly.",
      "Build financial projections you can defend.",
      "Write a plan that is useful as well as persuasive.",
      "Identify and state the risks rather than hiding them.",
      "Present the plan and answer challenge.",
    ],
    outcomes: [
      "Produce market research with cited sources.",
      "Build three-year projections with stated assumptions.",
      "Write every standard section of a business plan.",
      "Produce a risk section that names real risks and their mitigations.",
      "Present in ten minutes and defend the numbers.",
      "Adapt the plan for a lender, an investor or a grant.",
    ],
    careers: ["Business owner seeking finance", "Startup founder", "Business development", "Grant applicant", "Business adviser"],
    skills: ["Market research", "Financial projections", "Business writing", "Risk analysis", "Pitching"],
    finalProject: "A complete business plan for a real venture, with three-year projections, stated assumptions and a risk section — presented in ten minutes to an audience who will question the figures.",
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — Research and Strategy", "Knowing the market before describing it.", [
        ["Market Research", "Find out what is true rather than what you hope.", ["Desk research and primary research", "Sizing a market from the bottom up", "Citing sources so a reader can check"]],
        ["Competitors and Positioning", "Know who you are up against.", ["Direct, indirect and 'do nothing' competitors", "Honest assessment of their strengths", "Where you will be different, and why that matters to a customer"]],
        ["Strategy and Milestones", "State what you will do and when.", ["Objectives that can be measured", "Milestones for the first two years", "What you will not do"]],
      ], [
        { prompt: "What is bottom-up market sizing?", options: [{ text: "Building from real units, customers and prices rather than a share of a national figure", correct: true }, { text: "Taking 1% of a national market" }, { text: "Asking competitors" }, { text: "Estimating from a report" }] },
        { prompt: "Why cite sources in a business plan?", options: [{ text: "So a lender can check your figures — uncited numbers are discounted", correct: true }, { text: "To increase the length" }, { text: "It is a formality" }, { text: "To show reading effort" }] },
        { prompt: "A plan claiming 'we have no competitors' suggests what to a lender?", options: [{ text: "The research is inadequate", correct: true }, { text: "A strong opportunity" }, { text: "A new market" }, { text: "Confidence" }] },
      ]),
      mod("Module 2 — The Numbers", "Projections that survive scrutiny.", [
        ["Building Projections", "Construct forecasts from assumptions.", ["Revenue built from units and prices, not growth percentages", "Cost projections including the ones people forget", "Three years, monthly for the first"]],
        ["Stating Assumptions", "Make your reasoning visible.", ["Every number traced to an assumption", "Assumptions a reader can challenge", "Best, expected and worst case"]],
        ["Funding Requirement", "Say exactly what you need and why.", ["How much, for what, and when", "Debt and equity compared", "What happens if you raise less"]],
      ], [
        { prompt: "How should revenue projections be built?", options: [{ text: "From units and prices, with stated assumptions", correct: true }, { text: "As a percentage growth on last year" }, { text: "As a share of the market" }, { text: "From what the lender wants to see" }] },
        { prompt: "Why include a worst case?", options: [{ text: "It shows you have thought about failure, which is what a lender is assessing", correct: true }, { text: "To lower expectations" }, { text: "It is optional decoration" }, { text: "To reduce the amount requested" }] },
      ], { title: "Practical — Three-year projections", instructions: "Build three-year financial projections for your venture — monthly for year one. Every figure must trace to a stated assumption, listed separately. Include best, expected and worst cases." }),
      mod("Module 3 — Writing and Presenting", "The document and the conversation.", [
        ["Writing the Plan", "Produce a document that is read.", ["Executive summary written last, read first", "Standard sections and what belongs in each", "Length, and why shorter is usually better"]],
        ["Risk and Honesty", "Name what could go wrong.", ["Identifying real risks rather than token ones", "Mitigation that is specific", "Why a plan with no risks is not believed"]],
        ["Presenting and Defending", "Answer the hard questions.", ["A ten-minute pitch structure", "Knowing your own numbers without notes", "Saying 'I don't know' when you do not"]],
      ], [
        { prompt: "When should the executive summary be written?", options: [{ text: "Last, though it appears first", correct: true }, { text: "First" }, { text: "It is optional" }, { text: "By the lender" }] },
        { prompt: "What does a risk section with no serious risks suggest?", options: [{ text: "The author has not thought hard enough, and the plan is discounted", correct: true }, { text: "A safe business" }, { text: "Good preparation" }, { text: "Nothing" }] },
        { prompt: "You are asked a figure you cannot remember at a pitch. What is best?", options: [{ text: "Say you will confirm it, then do so promptly", correct: true }, { text: "Estimate confidently" }, { text: "Refer vaguely to the appendix" }, { text: "Change the subject" }] },
      ]),
    ],
  }),
];

export const wellbeingCourses: CourseContent[] = [
  scaffold({
    slug: "introduction-to-mental-wellbeing",
    title: "Introduction to Mental Wellbeing",
    categorySlug: WELL,
    courseCode: "HS-MW-01",
    summary: "What mental wellbeing is, what affects it, and the everyday habits that support it — educational, not clinical.",
    description: `
${WELLBEING_NOTICE}

Mental wellbeing is discussed either not at all or only at the point of crisis. This course covers the ordinary ground in between: what affects how we feel, what helps, and how to notice when something has changed.

It also covers the practical matter of stigma, which in Pakistan keeps a great many people from seeking help they would readily seek for a physical illness.
`.trim(),
    level: "beginner",
    durationWeeks: 4,
    learningHours: 16,
    prerequisites: "None.",
    targetLearners: "Anyone. Particularly useful for managers, teachers and anyone supporting others.",
    objectives: [
      "Describe what mental wellbeing is and what affects it.",
      "Recognise common difficulties and how they present.",
      "Apply everyday habits that support wellbeing.",
      "Support someone else without overstepping.",
      "Know when and how to seek professional help.",
    ],
    outcomes: [
      "Explain wellbeing as a spectrum rather than a state.",
      "Identify the factors that most affect your own wellbeing.",
      "Describe how sleep, activity and connection affect mood.",
      "Notice changes in yourself or others.",
      "Have a supportive conversation without attempting to treat.",
      "Name the routes to professional help available in Pakistan.",
    ],
    careers: ["Applies to everyone", "Managers and supervisors", "Teachers", "Community workers", "HR staff"],
    skills: ["Wellbeing awareness", "Self-monitoring", "Supportive listening", "Help-seeking", "Stigma awareness"],
    finalProject: "Keep a wellbeing record for two weeks — sleep, activity, connection and mood. Identify two patterns and one change you will make. Personal and private; submit only your conclusions, never the detail.",
    certificateCriteria:
      "Complete every lesson, pass the quizzes at 60%, and submit the reflection. This certificate records attendance at an educational course. It is not a qualification in mental health and does not qualify anyone to counsel, diagnose or treat.",
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — Understanding Wellbeing", "What it is and what shapes it.", [
        ["What Mental Wellbeing Means", "Understand wellbeing as ordinary, not exceptional.", ["A spectrum that moves, not a fixed state", "Wellbeing and mental illness distinguished", "Why this course is education and not care"]],
        ["What Affects How We Feel", "Recognise the influences.", ["Sleep, physical health, activity and food", "Relationships, isolation and belonging", "Money, work and security — the biggest factors for many"]],
        ["Stigma and Help-Seeking", "Understand what stops people asking.", ["Why mental health is discussed differently from physical health", "The cost of silence", "What seeing a professional actually involves"]],
      ], [
        { prompt: "Mental wellbeing is best described as:", options: [{ text: "A spectrum that changes over time", correct: true }, { text: "Either present or absent" }, { text: "The absence of illness" }, { text: "A fixed personality trait" }] },
        { prompt: "Which most affects wellbeing for many people?", options: [{ text: "Financial and job security", correct: true }, { text: "Personality" }, { text: "The weather" }, { text: "Age" }] },
        { prompt: "What is this course?", options: [{ text: "Educational — it does not diagnose or treat", correct: true }, { text: "A therapy programme" }, { text: "A clinical qualification" }, { text: "A replacement for seeing a doctor" }] },
      ]),
      mod("Module 2 — Everyday Habits", "Small things that reliably help.", [
        ["Sleep", "Protect the foundation of wellbeing.", ["What poor sleep does to mood and judgement", "Practical sleep habits", "Screens, caffeine and routine"]],
        ["Movement and Food", "Use the physical to support the mental.", ["Why modest regular activity helps", "Eating patterns under stress", "Realistic changes rather than ideal ones"]],
        ["Connection", "Maintain relationships deliberately.", ["Isolation as a health risk", "Keeping contact when busy or low", "Asking for help as a skill"]],
      ], [
        { prompt: "How much activity is needed to affect mood?", options: [{ text: "Modest, regular movement — a daily walk counts", correct: true }, { text: "Intensive daily exercise" }, { text: "Gym training three times a week minimum" }, { text: "Activity does not affect mood" }] },
        { prompt: "What does persistent poor sleep affect?", type: "multiple", options: [{ text: "Mood", correct: true }, { text: "Judgement and concentration", correct: true }, { text: "Physical health", correct: true }, { text: "Nothing measurable" }] },
        { prompt: "Isolation is best understood as:", options: [{ text: "A genuine risk to health, not only unpleasant", correct: true }, { text: "A personal preference" }, { text: "A temporary state" }, { text: "Unrelated to wellbeing" }] },
      ], { title: "Reflection — Two weeks of noticing", instructions: "For two weeks, note your sleep, activity, contact with others, and mood. Then write half a page: two patterns you noticed and one change you will make. Submit only the conclusions — keep the daily detail private." }),
      mod("Module 3 — Noticing and Supporting", "Changes in yourself and others.", [
        ["Noticing Change", "Recognise when something has shifted.", ["Changes in sleep, appetite, withdrawal, interest", "Duration and impact as the signals that matter", "Your own early warning signs"]],
        ["Supporting Someone Else", "Help without overstepping.", ["Listening rather than fixing", "What not to say", "Encouraging professional help without forcing it"]],
        ["Getting Professional Help", "Know the routes.", ["Doctors, psychologists, psychiatrists and counsellors — who does what", "What a first appointment involves", "Urgent situations, and acting immediately"]],
      ], [
        { prompt: "What signals that a low mood may need professional attention?", options: [{ text: "It persists over weeks and affects daily functioning", correct: true }, { text: "It lasts more than one day" }, { text: "Others have noticed it" }, { text: "It follows a difficult event" }] },
        { prompt: "A friend describes feeling hopeless. What is most helpful?", options: [{ text: "Listen, take it seriously, and encourage them to see a professional", correct: true }, { text: "Offer advice on cheering up" }, { text: "Tell them others have it worse" }, { text: "Change the subject" }] },
        { prompt: "Someone tells you they are thinking of harming themselves. What do you do?", options: [{ text: "Take it seriously and help them reach professional help today", correct: true }, { text: "Promise to keep it secret" }, { text: "Wait to see if it passes" }, { text: "Advise them to rest" }] },
      ]),
    ],
  }),

  scaffold({
    slug: "stress-management",
    title: "Stress Management",
    categorySlug: WELL,
    courseCode: "HS-MW-02",
    summary: "What stress does, what causes yours specifically, and practical methods to manage it — educational, not clinical.",
    description: `
${WELLBEING_NOTICE}

Stress is not always harmful; short bursts help us perform. The damage comes from pressure that does not let up and recovery that never arrives.

This course covers what stress does to the body and mind, identifying your own triggers, and practical techniques — including the unglamorous ones that work, like changing the situation rather than only coping with it.
`.trim(),
    level: "beginner",
    durationWeeks: 4,
    learningHours: 16,
    prerequisites: "None.",
    targetLearners: "Anyone under sustained pressure — at work, in study, or caring for others.",
    objectives: [
      "Explain what stress is and what it does physically and mentally.",
      "Identify your own triggers and warning signs.",
      "Apply practical techniques for immediate and long-term stress.",
      "Change the causes where possible rather than only coping.",
      "Know when stress has become something needing professional help.",
    ],
    outcomes: [
      "Describe the stress response and why it becomes harmful when sustained.",
      "Keep a stress diary and identify patterns.",
      "Use breathing and grounding techniques.",
      "Apply time and workload methods that reduce pressure at source.",
      "Set boundaries that reduce avoidable stress.",
      "Recognise when to seek professional support.",
    ],
    careers: ["Applies to everyone", "High-pressure roles", "Managers", "Students", "Carers"],
    skills: ["Stress awareness", "Breathing techniques", "Trigger identification", "Boundary setting", "Recovery"],
    finalProject: "Keep a stress diary for two weeks. Identify your three main triggers, apply one technique to each, and report what changed. Submit conclusions only.",
    certificateCriteria:
      "Complete every lesson, pass the quizzes at 60%, and submit the reflection. This certificate records attendance at an educational course and is not a clinical qualification.",
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — What Stress Is", "The response, and when it turns harmful.", [
        ["The Stress Response", "Understand what happens in the body.", ["Fight, flight and freeze", "Why short-term stress can help performance", "What sustained stress does over months"]],
        ["Identifying Your Triggers", "Find out what actually sets it off.", ["Keeping a stress diary", "Situations, people, times of day", "Distinguishing the trigger from the underlying cause"]],
        ["Warning Signs", "Notice it earlier.", ["Physical: sleep, appetite, tension, illness", "Mental: concentration, irritability, worry", "Behavioural: withdrawal, avoidance, substance use"]],
      ], [
        { prompt: "Short-term stress is:", options: [{ text: "Sometimes helpful — it sharpens focus for a limited period", correct: true }, { text: "Always harmful" }, { text: "The same as anxiety" }, { text: "A sign of weakness" }] },
        { prompt: "What makes stress damaging?", options: [{ text: "That it is sustained without recovery", correct: true }, { text: "Its intensity alone" }, { text: "The type of trigger" }, { text: "Being noticed by others" }] },
        { prompt: "Why keep a stress diary?", options: [{ text: "Patterns are not visible without a record", correct: true }, { text: "To show a doctor" }, { text: "To prove it to an employer" }, { text: "It is not useful" }] },
      ]),
      mod("Module 2 — Managing It", "In the moment, and over time.", [
        ["Immediate Techniques", "Bring the response down now.", ["Slow breathing, and why it works physically", "Grounding when thoughts race", "Brief movement and stepping away"]],
        ["Longer-Term Methods", "Reduce the baseline.", ["Sleep, activity and routine", "Realistic relaxation — not another obligation", "Talking to someone"]],
        ["Changing the Cause", "Where possible, remove the source.", ["Workload, prioritisation, saying no", "Renegotiating a deadline rather than absorbing it", "Recognising what you cannot change, and where you spend that energy"]],
      ], [
        { prompt: "Why does slow breathing reduce stress?", options: [{ text: "It engages the body's calming response physically", correct: true }, { text: "It distracts you" }, { text: "It is a placebo" }, { text: "It increases oxygen dramatically" }] },
        { prompt: "What is often more effective than coping techniques alone?", options: [{ text: "Changing the situation causing the stress", correct: true }, { text: "More relaxation" }, { text: "Working harder to clear the backlog" }, { text: "Ignoring it" }] },
        { prompt: "Which are behavioural warning signs?", type: "multiple", options: [{ text: "Withdrawing from people", correct: true }, { text: "Avoiding tasks", correct: true }, { text: "Increased smoking or other substance use", correct: true }, { text: "Planning a holiday" }] },
      ], { title: "Reflection — Two weeks, three triggers", instructions: "Keep a stress diary for two weeks. Identify your three main triggers. Apply one technique from this module to each and record what happened. Submit conclusions only." }),
      mod("Module 3 — Sustaining It", "Recovery, boundaries and knowing the limit.", [
        ["Recovery", "Build in the part that is always cut first.", ["Why recovery is not a reward for finishing", "Rest that restores versus rest that does not", "Protecting time that others will take"]],
        ["Boundaries", "Reduce avoidable stress at source.", ["Saying no without damaging relationships", "Work that follows you home through a phone", "Family and community expectations, negotiated"]],
        ["When to Seek Help", "Know where education ends.", ["Stress, anxiety and depression are not the same", "Signs that professional support is needed", "What help is available and how to approach it"]],
      ], [
        { prompt: "Recovery time should be treated as:", options: [{ text: "A necessary part of the work, scheduled like anything else", correct: true }, { text: "A reward once everything is finished" }, { text: "Optional" }, { text: "A sign of low commitment" }] },
        { prompt: "When should someone seek professional help for stress?", options: [{ text: "When it persists, worsens, or stops them functioning normally", correct: true }, { text: "Only in crisis" }, { text: "After trying every technique" }, { text: "Only if a doctor suggests it" }] },
        { prompt: "Scrolling social media for two hours is:", options: [{ text: "Often rest that does not actually restore", correct: true }, { text: "Effective recovery" }, { text: "Equivalent to sleep" }, { text: "The best use of a break" }] },
      ]),
    ],
  }),

  scaffold({
    slug: "emotional-wellbeing",
    title: "Emotional Wellbeing",
    categorySlug: WELL,
    courseCode: "HS-MW-03",
    summary: "Understanding your emotions, expressing them constructively, and handling difficult feelings — educational, not clinical.",
    description: `
${WELLBEING_NOTICE}

Emotions are information. People who can name what they feel, and why, make better decisions and have better relationships — and this is a learnable skill, not a fixed temperament.

This course covers recognising emotions, understanding what drives them, expressing them in ways that help, and sitting with difficult feelings rather than suppressing them until they surface elsewhere.
`.trim(),
    level: "beginner",
    durationWeeks: 4,
    learningHours: 16,
    prerequisites: "None. Introduction to Mental Wellbeing is helpful but not required.",
    targetLearners: "Anyone wanting to understand themselves better, and those in roles requiring emotional steadiness.",
    objectives: [
      "Recognise and name emotions accurately.",
      "Understand what drives an emotional reaction.",
      "Express emotion constructively.",
      "Sit with difficult feelings without suppression.",
      "Support others' emotions without taking them on.",
    ],
    outcomes: [
      "Name emotions with more precision than good or bad.",
      "Identify the thought or situation behind a reaction.",
      "Express difficult feelings without blame.",
      "Use techniques for anger, worry and sadness.",
      "Recognise emotional suppression and its costs.",
      "Set limits when supporting others.",
    ],
    careers: ["Applies to everyone", "Leadership", "Caring roles", "Customer-facing work", "Teaching"],
    skills: ["Emotional awareness", "Self-regulation", "Constructive expression", "Empathy", "Boundaries"],
    finalProject: "Keep an emotion record for two weeks — situation, emotion, intensity, response. Identify one pattern and one response you will change. Submit conclusions only.",
    certificateCriteria:
      "Complete every lesson, pass the quizzes at 60%, and submit the reflection. Educational only; not a counselling qualification.",
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — Understanding Emotions", "What they are and what they are for.", [
        ["Emotions as Information", "Treat feelings as signals rather than problems.", ["What each emotion tends to signal", "Why there are no bad emotions, only unhelpful responses", "Emotions and decisions"]],
        ["Naming What You Feel", "Be more precise than good or bad.", ["Expanding emotional vocabulary", "Frustrated, disappointed, anxious, resentful — different things", "Why naming accurately reduces intensity"]],
        ["What Drives a Reaction", "Find what sits underneath.", ["The situation, the thought, then the feeling", "Patterns from past experience", "Reacting to something other than what is in front of you"]],
      ], [
        { prompt: "Emotions are best understood as:", options: [{ text: "Information about what matters to you", correct: true }, { text: "Problems to be removed" }, { text: "Weaknesses" }, { text: "Random events" }] },
        { prompt: "Why does naming an emotion precisely help?", options: [{ text: "It reduces its intensity and makes a response possible", correct: true }, { text: "It impresses others" }, { text: "It removes the emotion" }, { text: "It does not help" }] },
        { prompt: "What usually comes between a situation and a feeling?", options: [{ text: "A thought or interpretation", correct: true }, { text: "Nothing" }, { text: "A decision" }, { text: "Another person" }] },
      ]),
      mod("Module 2 — Expressing and Regulating", "Saying it well, and managing the intensity.", [
        ["Constructive Expression", "Say what you feel without causing damage.", ["Describing your own feeling rather than accusing", "Timing — not in the moment of greatest intensity", "Where suppressed feeling surfaces instead"]],
        ["Managing Strong Emotion", "Handle intensity without acting on it.", ["Pausing before responding", "Physical techniques for anger", "Worry: what is actionable and what is not"]],
        ["Sadness and Low Mood", "Let ordinary sadness be ordinary.", ["Sadness as a normal response to loss", "Distinguishing it from persistent low mood", "What helps, and what to avoid"]],
      ], [
        { prompt: "Which expresses frustration constructively?", options: [{ text: "I felt frustrated when the report arrived late, because I could not finish my part", correct: true }, { text: "You are always late and it is unprofessional" }, { text: "Saying nothing and withdrawing" }, { text: "Mentioning it to others instead" }] },
        { prompt: "What is the best first response to very strong emotion?", options: [{ text: "Pause before responding", correct: true }, { text: "Express it immediately and fully" }, { text: "Suppress it" }, { text: "Leave permanently" }] },
        { prompt: "Suppressed emotion usually:", options: [{ text: "Surfaces elsewhere — in the body, in sleep, or at the wrong person", correct: true }, { text: "Disappears" }, { text: "Strengthens character" }, { text: "Has no effect" }] },
      ], { title: "Reflection — Two weeks of noticing", instructions: "For two weeks record: the situation, the emotion named precisely, its intensity out of ten, and how you responded. Identify one pattern and one response you will change. Submit conclusions only." }),
      mod("Module 3 — Emotions and Other People", "Empathy, limits and difficult relationships.", [
        ["Empathy Without Absorption", "Support others without carrying it all.", ["Empathy and sympathy distinguished", "Listening without taking responsibility for fixing", "Compassion fatigue in caring roles"]],
        ["Difficult Relationships", "Handle people who affect you badly.", ["Recognising a consistently draining relationship", "What you can and cannot change in another person", "Limits with family, where leaving is not an option"]],
        ["Building Emotional Resilience", "Strengthen over time.", ["Recovering after an emotional setback", "Self-talk, noticed and adjusted", "Where this becomes a matter for professional help"]],
      ], [
        { prompt: "What is compassion fatigue?", options: [{ text: "Exhaustion from sustained emotional support of others", correct: true }, { text: "Losing the ability to feel compassion" }, { text: "Disliking people" }, { text: "A physical illness" }] },
        { prompt: "In a difficult family relationship you cannot leave, what is realistic?", options: [{ text: "Changing your own responses and limits, not the other person", correct: true }, { text: "Changing the other person" }, { text: "Cutting all contact" }, { text: "Accepting whatever happens" }] },
        { prompt: "Supporting someone in distress means:", options: [{ text: "Listening and taking it seriously, not being responsible for fixing it", correct: true }, { text: "Solving their problem" }, { text: "Taking on their feelings" }, { text: "Giving advice quickly" }] },
      ]),
    ],
  }),

  scaffold({
    slug: "mindfulness-and-self-care",
    title: "Mindfulness and Self-Care",
    categorySlug: WELL,
    courseCode: "HS-MW-04",
    summary: "Attention, presence and looking after yourself — practical and unmystical, and compatible with a full life.",
    description: `
${WELLBEING_NOTICE}

Mindfulness has acquired a great deal of packaging. Underneath it is a simple, testable practice: paying attention to what is happening now, rather than rehearsing what has happened or what might.

This course teaches it plainly, without requiring belief in anything. It also covers self-care as it actually works — sleep, food, movement, limits and rest — rather than as something purchased.
`.trim(),
    level: "beginner",
    durationWeeks: 4,
    learningHours: 16,
    prerequisites: "None.",
    targetLearners: "Anyone with a busy mind, people under sustained pressure, and those sceptical of wellbeing language who still want the benefit.",
    objectives: [
      "Understand what mindfulness is and what evidence supports it.",
      "Practise basic mindfulness techniques.",
      "Apply attention practice to ordinary daily activity.",
      "Build a realistic self-care routine.",
      "Distinguish self-care from avoidance.",
    ],
    outcomes: [
      "Explain mindfulness without mysticism.",
      "Practise a short breathing and body-scan exercise.",
      "Apply mindful attention to eating, walking and listening.",
      "Notice rumination and interrupt it.",
      "Build a self-care routine that fits a real week.",
      "Recognise when rest is avoidance.",
    ],
    careers: ["Applies to everyone", "High-pressure roles", "Carers", "Students"],
    skills: ["Mindfulness practice", "Attention", "Self-care planning", "Rumination awareness", "Rest"],
    finalProject: "Practise daily for three weeks, ten minutes minimum. Keep a brief record. Report what changed, what was difficult, and whether you will continue — including if the answer is no.",
    certificateCriteria:
      "Complete every lesson, pass the quizzes at 60%, and submit the practice record and reflection. Educational only.",
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — What Mindfulness Is", "The practice, stripped of packaging.", [
        ["Attention and the Wandering Mind", "Understand what the practice addresses.", ["How much time is spent not in the present", "Rumination and anticipation", "What the evidence does and does not show"]],
        ["Basic Practice", "Learn the core exercise.", ["Breath as an anchor", "Noticing the mind wandering — which is the practice, not a failure", "Starting at two minutes, not twenty"]],
        ["Common Misunderstandings", "Clear away what puts people off.", ["It is not emptying the mind", "It does not require religious belief or any particular one", "It is not relaxation, though it often relaxes"]],
      ], [
        { prompt: "Your mind wanders during practice. What does this mean?", options: [{ text: "It is working — noticing and returning is the practice", correct: true }, { text: "You are doing it wrong" }, { text: "You should stop" }, { text: "You need longer sessions" }] },
        { prompt: "Mindfulness requires:", options: [{ text: "No particular belief — it is an attention practice", correct: true }, { text: "A religious commitment" }, { text: "Meditation experience" }, { text: "An hour a day" }] },
        { prompt: "How long should a beginner practise?", options: [{ text: "A few minutes, consistently", correct: true }, { text: "At least thirty minutes" }, { text: "An hour" }, { text: "As long as possible" }] },
      ]),
      mod("Module 2 — Practice in Daily Life", "Applying attention to ordinary activity.", [
        ["Everyday Mindfulness", "Practise without setting time aside.", ["Eating, walking, washing", "Listening fully to another person", "Single-tasking, and what multitasking actually costs"]],
        ["Working With Difficult Thoughts", "Handle rumination.", ["Noticing a thought without following it", "Catching a spiral early", "When thoughts need addressing rather than observing"]],
        ["Building a Habit", "Make it survive a busy week.", ["Attaching practice to something you already do", "What to do after missing days", "Realistic expectations of what changes and when"]],
      ], [
        { prompt: "What does multitasking actually do?", options: [{ text: "Switches attention rapidly, costing time and accuracy", correct: true }, { text: "Doubles output" }, { text: "Improves focus" }, { text: "Has no cost" }] },
        { prompt: "You miss five days of practice. What should you do?", options: [{ text: "Resume today without treating it as failure", correct: true }, { text: "Start the programme again" }, { text: "Practise longer to compensate" }, { text: "Abandon it" }] },
        { prompt: "How should a repetitive worrying thought be handled in practice?", options: [{ text: "Noticed, named, and let pass without following it", correct: true }, { text: "Suppressed" }, { text: "Analysed thoroughly" }, { text: "Argued with" }] },
      ], { title: "Practice — Three weeks", instructions: "Practise at least ten minutes daily for three weeks. Keep a one-line record each day: how long, and what you noticed. Submit the record and half a page on what changed, what was hard, and whether you will continue." }),
      mod("Module 3 — Self-Care That Works", "Rest, limits and the difference from avoidance.", [
        ["What Self-Care Actually Is", "Separate it from what is sold as it.", ["Sleep, food, movement, connection, limits", "Why it is not a purchase", "Small consistent care over occasional indulgence"]],
        ["Building a Routine", "Fit it into a real week.", ["Starting from what already exists", "Care with no money and little time", "Family and caring responsibilities accounted for"]],
        ["Rest and Avoidance", "Tell the difference honestly.", ["Rest that restores versus escape that depletes", "Procrastination described as self-care", "Being honest with yourself about which it is"]],
      ], [
        { prompt: "Self-care is best described as:", options: [{ text: "Consistent attention to sleep, food, movement, connection and limits", correct: true }, { text: "Occasional treats" }, { text: "Products and services" }, { text: "Time away from responsibilities" }] },
        { prompt: "How do you tell rest from avoidance?", options: [{ text: "By whether you feel restored or depleted afterwards", correct: true }, { text: "By how long it lasts" }, { text: "By what activity it is" }, { text: "They are the same" }] },
        { prompt: "Which are realistic self-care with no money?", type: "multiple", options: [{ text: "A regular walk", correct: true }, { text: "A consistent sleep time", correct: true }, { text: "Contact with one person you trust", correct: true }, { text: "A spa treatment" }] },
      ]),
    ],
  }),

  scaffold({
    slug: "healthy-work-life-balance",
    title: "Healthy Work-Life Balance",
    categorySlug: WELL,
    courseCode: "HS-MW-05",
    summary: "Drawing a line between work and the rest of life, and holding it — practical, and realistic about Pakistani working culture.",
    description: `
${WELLBEING_NOTICE}

Balance is not an equal split. It is having enough of your life left over to be a person in it.

This course is practical about the obstacles: employers who expect constant availability, freelancing where every hour could be billed, a phone that carries work everywhere, and family and community obligations that are not optional. It works with those realities rather than pretending they are choices.
`.trim(),
    level: "beginner",
    durationWeeks: 4,
    learningHours: 16,
    prerequisites: "None.",
    targetLearners: "Employees, freelancers, business owners, and anyone whose work has expanded to fill everything.",
    objectives: [
      "Assess how your time is actually spent.",
      "Set boundaries between work and the rest of life.",
      "Handle expectations of constant availability.",
      "Protect time for rest, relationships and health.",
      "Recognise when imbalance has become a health problem.",
    ],
    outcomes: [
      "Audit a week honestly.",
      "Define working hours and communicate them.",
      "Manage work notifications outside those hours.",
      "Negotiate workload with a manager or client.",
      "Protect one non-negotiable commitment outside work.",
      "Recognise the warning signs of sustained imbalance.",
    ],
    careers: ["Applies to everyone", "Remote workers", "Freelancers", "Managers", "Business owners"],
    skills: ["Time auditing", "Boundary setting", "Negotiation", "Availability management", "Recovery"],
    finalProject: "Audit one week of your actual time. Identify the largest imbalance, make one specific change, and report after two weeks on whether it held — including if it did not, and why.",
    certificateCriteria:
      "Complete every lesson, pass the quizzes at 60%, and submit the audit and reflection. Educational only.",
    curriculumSource: SOURCE,
    modules: [
      mod("Module 1 — Where Your Time Goes", "Auditing before changing.", [
        ["What Balance Means", "Set a realistic definition.", ["Not an equal split", "Balance across a month rather than every day", "What you actually want from the non-work part"]],
        ["Auditing Your Week", "Find out where time really goes.", ["Recording actual hours, including the invisible ones", "Commuting, thinking about work, checking messages", "Comparing what you value with where time goes"]],
        ["Why Work Expands", "Understand the mechanism.", ["Work filling the time available", "Phones removing the boundary", "Being seen as available, and its consequences"]],
      ], [
        { prompt: "Work-life balance means:", options: [{ text: "Enough of your life remaining outside work, judged over time", correct: true }, { text: "An equal split each day" }, { text: "Working fewer hours always" }, { text: "Never thinking about work" }] },
        { prompt: "Which hours are commonly missed in an audit?", type: "multiple", options: [{ text: "Checking messages outside working hours", correct: true }, { text: "Commuting", correct: true }, { text: "Thinking or worrying about work", correct: true }, { text: "Sleeping" }] },
        { prompt: "What is the first step in changing the balance?", options: [{ text: "Finding out how time is actually spent", correct: true }, { text: "Setting rules" }, { text: "Talking to a manager" }, { text: "Reducing hours" }] },
      ], { title: "Practical — Audit one week", instructions: "Record every hour for seven days, including invisible work time. Categorise it. Compare where your time went with what you say matters to you, and name the largest gap." }),
      mod("Module 2 — Setting Boundaries", "Drawing a line and holding it.", [
        ["Defining Your Hours", "Decide when you work and when you do not.", ["Setting hours realistically for your situation", "Communicating them clearly and in advance", "Genuine exceptions versus the exception becoming the rule"]],
        ["Managing Availability", "Deal with the device in your pocket.", ["Notifications, and switching work apps off", "Response time expectations, stated", "Freelancers: why 'always available' does not win better clients"]],
        ["Negotiating Workload", "Address the cause, not only the symptom.", ["Raising an unsustainable workload with evidence", "Offering priorities rather than refusal", "When the job itself is the problem"]],
      ], [
        { prompt: "How should working hours be communicated?", options: [{ text: "Clearly and in advance, before a conflict arises", correct: true }, { text: "Only when someone contacts you late" }, { text: "Through a colleague" }, { text: "They should not be stated" }] },
        { prompt: "How should an unsustainable workload be raised with a manager?", options: [{ text: "With evidence and a proposed order of priority", correct: true }, { text: "By refusing further work" }, { text: "By working longer until noticed" }, { text: "By resigning" }] },
        { prompt: "For a freelancer, constant availability usually:", options: [{ text: "Attracts clients who expect it and pay no more for it", correct: true }, { text: "Wins better clients" }, { text: "Justifies higher rates" }, { text: "Has no effect" }] },
      ]),
      mod("Module 3 — Protecting Life Outside Work", "Rest, relationships and knowing the limit.", [
        ["Protecting Non-Work Time", "Defend it deliberately.", ["One non-negotiable commitment each week", "Treating personal commitments as real appointments", "Family and community obligations, planned rather than absorbed"]],
        ["Rest and Recovery", "Recover properly.", ["Daily, weekly and longer recovery", "Taking leave, and actually disconnecting", "Recovery on a low income and with caring duties"]],
        ["When Imbalance Becomes Harm", "Recognise the point of concern.", ["Persistent exhaustion, sleep disruption, withdrawal", "Physical symptoms of sustained overwork", "Where to seek help, and the link to the Burnout Prevention courses"]],
      ], [
        { prompt: "How should a personal commitment be treated in a diary?", options: [{ text: "As a real appointment, not moved for ordinary work requests", correct: true }, { text: "As flexible" }, { text: "As a note only" }, { text: "It should not be in the diary" }] },
        { prompt: "Which indicate imbalance has become harmful?", type: "multiple", options: [{ text: "Exhaustion that rest does not fix", correct: true }, { text: "Persistent sleep disruption", correct: true }, { text: "Withdrawing from people you care about", correct: true }, { text: "A single busy week" }] },
        { prompt: "Taking leave while still checking work messages:", options: [{ text: "Provides much less recovery than disconnecting", correct: true }, { text: "Is equivalent to full leave" }, { text: "Is more responsible" }, { text: "Makes no difference" }] },
      ]),
    ],
  }),
];
