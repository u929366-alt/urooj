import { scaffold } from "./scaffold.ts";
import type { CourseContent } from "./types.ts";

const CAT = "ai-and-emerging-technologies";
const SOURCE_NOTE =
  "Syllabus developed by Hunarsaaz from current industry practice. NAVTTC's qualifications database was NOT consulted — navttc.gov.pk is unreachable from the environment this was written in. Do not claim NAVTTC alignment until someone has opened the relevant qualification and compared it.";

export const aiCourses: CourseContent[] = [
  scaffold({
    slug: "ai-for-everyone",
    title: "AI for Everyone",
    categorySlug: CAT,
    courseCode: "HS-AI-01",
    summary:
      "What artificial intelligence actually is, what it genuinely does well, where it fails, and how to use it responsibly in ordinary work.",
    description: `
Most of what is written about AI is either selling something or frightening someone. This course is neither.

It explains, without mathematics, how these systems work well enough for you to predict when they will be useful and when they will confidently tell you something false. Then it puts them to work: writing, summarising, planning, learning, and the specific tasks where they save real hours.

It also covers the parts that get skipped — what happens to the data you paste in, what you must never paste in, and where the responsibility sits when an AI tool gets something wrong in your name.

No technical background needed. This is the course everything else in this category assumes.
`.trim(),
    level: "beginner",
    durationWeeks: 6,
    learningHours: 24,
    prerequisites: "None. Basic computer and internet use, and an email address to register for free AI tools.",
    targetLearners:
      "Everyone — office staff, teachers, shopkeepers, students, managers. No technical background is assumed or needed.",
    objectives: [
      "Explain in plain language what AI is and how today's systems work.",
      "Judge when an AI tool is the right choice and when it is not.",
      "Write prompts that get useful results rather than generic ones.",
      "Recognise when output is wrong, biased or fabricated.",
      "Use AI within sensible limits on privacy, honesty and responsibility.",
    ],
    outcomes: [
      "Describe the difference between rule-based software, machine learning and generative AI.",
      "Use a generative AI assistant for writing, summarising and planning.",
      "Check AI output for accuracy rather than trusting it.",
      "Identify information that must never be pasted into a public AI tool.",
      "Explain what AI cannot do, and say so to a manager or client.",
      "Apply a simple responsible-use standard to your own work.",
    ],
    careers: [
      "Any role where AI tools now save time",
      "Administrative and support staff",
      "Teachers and trainers",
      "Small business owners",
      "A foundation for the technical AI courses",
    ],
    skills: ["AI literacy", "Prompting", "Fact-checking", "Responsible use", "Data privacy"],
    finalProject:
      "Pick one real task you do regularly. Do it your usual way and time it. Then redesign it around AI tools, time it again, and report honestly: what improved, what got worse, what you had to correct, and whether you would keep the new method.",
    curriculumSource: SOURCE_NOTE,
    modules: [
      {
        title: "Module 1 — What AI Actually Is",
        summary: "Enough understanding to predict what these tools will and will not do.",
        lessons: [
          {
            title: "From Rules to Learning",
            minutes: 18,
            preview: true,
            objective: "Understand the difference between software that follows rules and software that learns.",
            covers: [
              "Ordinary software: someone wrote every rule",
              "Machine learning: patterns found in examples",
              "Why a learning system can be right often and wrong unpredictably",
            ],
          },
          {
            title: "How Generative AI Works",
            minutes: 20,
            objective: "Know, without mathematics, what a language model is doing.",
            covers: [
              "Predicting the next piece of text, at enormous scale",
              "Why it produces fluent text that can be entirely false",
              "Training data, and why the cut-off date matters",
            ],
          },
          {
            title: "What AI Cannot Do",
            minutes: 18,
            objective: "Recognise the limits before you rely on one.",
            covers: [
              "It does not know what is true — it knows what is likely",
              "Hallucination: confident, specific, invented detail",
              "No accountability: the responsibility remains yours",
            ],
          },
        ],
        quiz: [
          {
            prompt: "Why can a generative AI produce a fluent answer that is completely wrong?",
            options: [
              { text: "It predicts likely text, and does not check whether it is true", correct: true },
              { text: "It has been given false information deliberately" },
              { text: "It is broken" },
              { text: "It only happens with long questions" },
            ],
          },
          {
            prompt: "Who is responsible when an AI tool produces a mistake in your work?",
            options: [
              { text: "You are", correct: true },
              { text: "The company that made the tool" },
              { text: "Nobody" },
              { text: "The person who reads it" },
            ],
          },
          {
            prompt: "What is the main difference between rule-based software and machine learning?",
            options: [
              { text: "Rules are written by a person; patterns are learned from examples", correct: true },
              { text: "Machine learning is always faster" },
              { text: "Rule-based software cannot be wrong" },
              { text: "There is no real difference" },
            ],
          },
        ],
      },
      {
        title: "Module 2 — Using AI Well",
        summary: "Getting genuinely useful results, and checking them.",
        lessons: [
          {
            title: "Writing Prompts That Work",
            minutes: 22,
            objective: "Get a specific, useful answer instead of a generic one.",
            covers: [
              "Context, task, format, constraints",
              "Giving an example of what good looks like",
              "Asking it to show its reasoning, and to say when it is unsure",
            ],
          },
          {
            title: "AI for Everyday Work",
            minutes: 22,
            objective: "Apply AI to tasks that genuinely benefit.",
            covers: [
              "Drafting, rewriting, shortening, translating",
              "Summarising long documents and meetings",
              "Planning, checklists, and thinking through a problem",
            ],
          },
          {
            title: "Checking the Output",
            minutes: 20,
            objective: "Catch what is wrong before anyone else does.",
            covers: [
              "Verifying names, numbers, dates and quotations independently",
              "Watching for invented sources and citations",
              "Where cultural or local detail is likely to be wrong for Pakistan",
            ],
          },
        ],
        quiz: [
          {
            prompt: "Which prompt is likely to produce the more useful result?",
            options: [
              { text: "A prompt giving context, the task, the format and the constraints", correct: true },
              { text: "A single short question" },
              { text: "A prompt written in capitals" },
              { text: "The same prompt asked repeatedly" },
            ],
          },
          {
            prompt: "An AI gives you a statistic with a source. What should you do?",
            options: [
              { text: "Find the source yourself and confirm it says that", correct: true },
              { text: "Use it — a cited figure is reliable" },
              { text: "Ask the AI whether it is sure" },
              { text: "Change the wording and use it" },
            ],
          },
          {
            prompt: "Where is AI output most likely to be wrong for a Pakistani context?",
            options: [
              { text: "Local prices, regulations, institutions and cultural detail", correct: true },
              { text: "Basic grammar" },
              { text: "Simple arithmetic" },
              { text: "Formatting" },
            ],
          },
        ],
        activity: {
          title: "Practical — Prompt, check, correct",
          instructions: `
Choose a work task and give an AI tool a first attempt at it.

1. Paste your first prompt and its output.
2. Improve the prompt using the four-part structure, and paste the better output.
3. **Fact-check the output.** Find at least one thing that is wrong, unverifiable or inappropriate for Pakistan. If you genuinely cannot find one, say what you checked and how.
4. Produce the corrected final version.

Part 3 carries the most marks. Anyone can generate text; the skill is knowing what not to trust.
`.trim(),
        },
      },
      {
        title: "Module 3 — Responsibility, Privacy and Ethics",
        summary: "The obligations that come with using these tools in real work.",
        lessons: [
          {
            title: "What Happens to What You Type",
            minutes: 20,
            objective: "Know where your data goes before you paste anything in.",
            covers: [
              "Free tools may use your input to train future models",
              "What must never be pasted: CNIC numbers, medical details, client lists, passwords, unpublished contracts",
              "Organisational rules, and asking before assuming",
            ],
          },
          {
            title: "Bias and Fairness",
            minutes: 18,
            objective: "Recognise where these systems treat people unequally.",
            covers: [
              "Bias learned from training data",
              "Where it causes harm: hiring, lending, policing, admissions",
              "Why a human must decide anything that affects a person's life",
            ],
          },
          {
            title: "Honesty About AI Use",
            minutes: 16,
            objective: "Know when to disclose that AI was involved.",
            covers: [
              "Academic and professional rules on declaring AI assistance",
              "Passing off generated work as your own expertise",
              "AI in education: as a tutor, not as a substitute for doing the work",
            ],
          },
        ],
        quiz: [
          {
            prompt: "Which should never be pasted into a public AI tool?",
            type: "multiple",
            options: [
              { text: "A customer's CNIC number", correct: true },
              { text: "An unpublished contract", correct: true },
              { text: "Someone's medical information", correct: true },
              { text: "A public news article" },
            ],
          },
          {
            prompt: "An AI screening tool consistently ranks women's applications lower. What is the likely cause?",
            options: [
              { text: "Bias in the data it learned from", correct: true },
              { text: "A coding error that can be patched" },
              { text: "Deliberate design" },
              { text: "Insufficient computing power" },
            ],
          },
          {
            prompt: "Which decisions should never be left to an AI alone?",
            options: [
              { text: "Those that materially affect a person's life, such as hiring or lending", correct: true },
              { text: "Choosing a document template" },
              { text: "Summarising a meeting" },
              { text: "Drafting a first version of an email" },
            ],
          },
        ],
      },
    ],
  }),

  scaffold({
    slug: "ai-and-data-science",
    title: "AI & Data Science",
    categorySlug: CAT,
    courseCode: "HS-AI-02",
    summary:
      "Collect, clean, analyse and present data — with Python, statistics that matter, and AI as an assistant rather than an oracle.",
    description: `
Data science is mostly unglamorous: finding the data, working out what is wrong with it, and fixing that before any analysis is possible. Courses that skip to the modelling produce people who cannot do the job.

This one follows the real order. Where does data come from, what is wrong with it, how do you clean it, what does it actually say, and how do you show that to someone who must decide something. Python is introduced as the tool, not the subject.

AI assistants appear throughout as what they are for this work: very fast, occasionally wrong, and no substitute for understanding your own data.
`.trim(),
    level: "intermediate",
    durationWeeks: 14,
    learningHours: 70,
    prerequisites:
      "AI for Everyone, or equivalent understanding. Comfortable with spreadsheets and arithmetic. No programming experience needed — Python is taught here.",
    targetLearners:
      "Analysts, graduates entering technical work, and anyone already handling data in spreadsheets who has hit the limit of what that allows.",
    objectives: [
      "Find and collect data suitable for a question.",
      "Clean data and document what you changed.",
      "Apply the statistics that most analysis actually needs.",
      "Use Python to analyse data reproducibly.",
      "Visualise findings honestly and clearly.",
    ],
    outcomes: [
      "Write Python for loading, filtering and summarising data.",
      "Use pandas for cleaning and reshaping.",
      "Calculate and interpret mean, median, spread, distribution and correlation.",
      "Explain why correlation does not establish cause.",
      "Produce charts that inform rather than decorate.",
      "Describe what a machine learning model does and when one is appropriate.",
    ],
    careers: ["Data Analyst", "Junior Data Scientist", "Business Analyst", "Research Assistant", "MIS Officer"],
    skills: ["Python", "pandas", "Data cleaning", "Statistics", "Visualisation", "Reproducible analysis"],
    finalProject:
      "Take a real dataset, state a question, clean the data with your steps documented, analyse it, and present findings with charts and stated limitations. Marks are lost for overclaiming.",
    resources: [
      { label: "pandas documentation", url: "https://pandas.pydata.org/docs/" },
      { label: "Pakistan Bureau of Statistics open data", url: "https://www.pbs.gov.pk/" },
    ],
    curriculumSource: SOURCE_NOTE,
    modules: [
      {
        title: "Module 1 — Data Fundamentals",
        summary: "Where data comes from and what is wrong with it.",
        lessons: [
          {
            title: "What Data Is, and What It Is Not",
            minutes: 18,
            preview: true,
            objective: "Understand what a dataset can and cannot tell you.",
            covers: ["Structured and unstructured", "Population versus sample", "What was never measured, and why that matters most"],
          },
          {
            title: "Collecting Data",
            minutes: 20,
            objective: "Get data suitable for the question you are asking.",
            covers: ["Surveys, records, sensors, public sources", "Sampling bias in plain terms", "Consent and lawful collection"],
          },
          {
            title: "Cleaning Data",
            minutes: 24,
            objective: "Turn a real dataset into an analysable one.",
            covers: ["Missing values and the options for handling them", "Duplicates, outliers, inconsistent categories", "Recording every change you make"],
          },
        ],
        quiz: [
          {
            prompt: "Why record every cleaning step you make?",
            options: [
              { text: "So the analysis can be reproduced and checked", correct: true },
              { text: "To make the file smaller" },
              { text: "It is a legal requirement" },
              { text: "To speed up processing" },
            ],
          },
          {
            prompt: "A survey conducted only online in urban areas is used to describe the whole country. What is the fault?",
            options: [
              { text: "Sampling bias — the sample does not represent the population", correct: true },
              { text: "The sample is too small" },
              { text: "Online surveys are always invalid" },
              { text: "Nothing, if there are enough responses" },
            ],
          },
          {
            prompt: "What is often the most important thing about a dataset?",
            options: [
              { text: "What it does not contain", correct: true },
              { text: "How many rows it has" },
              { text: "Its file format" },
              { text: "Which software produced it" },
            ],
          },
        ],
      },
      {
        title: "Module 2 — Python and Analysis",
        summary: "Enough Python to do the work, and pandas to do it well.",
        lessons: [
          {
            title: "Python Fundamentals",
            minutes: 28,
            objective: "Read and write basic Python confidently.",
            covers: ["Variables, types, lists and dictionaries", "Conditionals, loops, functions", "Notebooks and why analysts use them"],
          },
          {
            title: "pandas for Real Data",
            minutes: 30,
            objective: "Load, filter, group and reshape a dataset.",
            covers: ["DataFrames and Series", "Filtering, sorting, groupby", "Merging tables and handling missing values"],
          },
          {
            title: "Statistics That Matter",
            minutes: 26,
            objective: "Describe a dataset correctly.",
            covers: [
              "Mean, median, mode — and when the mean misleads",
              "Spread, distribution, and why the average income is the wrong number",
              "Correlation, and why it is not cause",
            ],
          },
        ],
        quiz: [
          {
            prompt: "When does the mean mislead?",
            options: [
              { text: "When the distribution is skewed, such as incomes", correct: true },
              { text: "When there are too few rows" },
              { text: "When the data is text" },
              { text: "It never misleads" },
            ],
          },
          {
            prompt: "Ice cream sales and drowning deaths rise together. What does this show?",
            options: [
              { text: "Correlation, most likely explained by a third factor — hot weather", correct: true },
              { text: "Ice cream causes drowning" },
              { text: "Drowning causes ice cream sales" },
              { text: "The data is wrong" },
            ],
          },
          {
            prompt: "What does groupby do in pandas?",
            options: [
              { text: "Splits data into groups so each can be summarised", correct: true },
              { text: "Sorts the rows" },
              { text: "Removes duplicates" },
              { text: "Joins two tables" },
            ],
          },
        ],
        activity: {
          title: "Practical — Clean and analyse",
          instructions: `
Take a real public dataset, ideally Pakistani.

1. State a question you can answer with it.
2. Clean it in Python, with every step in a notebook and commented.
3. Produce three summary findings with the code that generated them.
4. State one thing the data **cannot** tell you, and why.

Submit the notebook. Part 4 carries real marks.
`.trim(),
        },
      },
      {
        title: "Module 3 — Visualisation, Models and AI Assistance",
        summary: "Showing findings, and knowing where machine learning fits.",
        lessons: [
          {
            title: "Charts That Inform",
            minutes: 24,
            objective: "Present data honestly.",
            covers: ["Choosing the chart for the question", "Axes, scales, and how charts mislead", "Labelling so the chart stands alone"],
          },
          {
            title: "Introduction to Machine Learning",
            minutes: 24,
            objective: "Understand what a model does and when one is warranted.",
            covers: ["Prediction versus explanation", "Training, testing, overfitting", "When simple statistics beat a model"],
          },
          {
            title: "AI-Assisted Analysis",
            minutes: 22,
            objective: "Use AI tools for analysis without being misled by them.",
            covers: [
              "Generating and explaining code",
              "Why AI-written analysis must be checked against the data itself",
              "Never pasting confidential or personal data into a public tool",
            ],
          },
        ],
        quiz: [
          {
            prompt: "What is overfitting?",
            options: [
              { text: "A model that matches its training data closely and fails on new data", correct: true },
              { text: "A model with too few inputs" },
              { text: "A model that runs too slowly" },
              { text: "A chart with too many series" },
            ],
          },
          {
            prompt: "An AI writes analysis code that runs without error. What must you still do?",
            options: [
              { text: "Check the result against the data yourself", correct: true },
              { text: "Nothing — it ran successfully" },
              { text: "Ask the AI to confirm it" },
              { text: "Re-run it twice" },
            ],
          },
        ],
      },
    ],
  }),

  scaffold({
    slug: "ai-and-machine-learning",
    title: "AI & Machine Learning",
    categorySlug: CAT,
    courseCode: "HS-AI-03",
    summary:
      "Build, train and evaluate machine learning models — and judge honestly whether the result is good enough to use.",
    description: `
This course takes you from understanding what machine learning is to training models and, more importantly, evaluating them properly.

Evaluation is where most beginners go wrong. A model reporting 95% accuracy can be worthless, and knowing why is the difference between someone who has followed a tutorial and someone who can be trusted with a real problem.

Python is required. Take AI & Data Science first if you have not written any.
`.trim(),
    level: "advanced",
    durationWeeks: 14,
    learningHours: 75,
    prerequisites:
      "AI & Data Science, or equivalent Python and pandas ability. Comfortable with basic statistics. This is the most technically demanding course in the catalogue.",
    targetLearners:
      "Analysts and developers moving into machine learning, and graduates in computing, engineering, statistics or mathematics.",
    objectives: [
      "Frame a real problem as a machine learning task, or recognise that it is not one.",
      "Prepare data properly for training.",
      "Train supervised and unsupervised models.",
      "Evaluate a model honestly, using the right measure.",
      "Recognise and reduce harm from a deployed model.",
    ],
    outcomes: [
      "Distinguish supervised, unsupervised and reinforcement learning.",
      "Split data into training and test sets, and explain why.",
      "Train classification and regression models with scikit-learn.",
      "Use clustering to find structure in unlabelled data.",
      "Interpret accuracy, precision, recall and a confusion matrix.",
      "Explain why an accurate model can still be unusable or unfair.",
    ],
    careers: ["Machine Learning Engineer (junior)", "Data Scientist", "AI Developer", "Research Assistant", "Analytics Engineer"],
    skills: ["scikit-learn", "Supervised learning", "Clustering", "Model evaluation", "Feature engineering"],
    finalProject:
      "Take a real problem, build a model end to end, and write an evaluation that states plainly what it gets wrong, who that would affect, and whether you would recommend deploying it.",
    resources: [{ label: "scikit-learn user guide", url: "https://scikit-learn.org/stable/user_guide.html" }],
    curriculumSource: SOURCE_NOTE,
    modules: [
      {
        title: "Module 1 — Concepts and Data Preparation",
        summary: "What the field contains, and the work before any model is trained.",
        lessons: [
          {
            title: "Types of Machine Learning",
            minutes: 20,
            preview: true,
            objective: "Know which kind of problem you are facing.",
            covers: ["Supervised, unsupervised, reinforcement", "Classification versus regression", "Problems that are not machine learning problems"],
          },
          {
            title: "Features, Labels and Splits",
            minutes: 24,
            objective: "Prepare data so results mean something.",
            covers: ["Features and labels", "Train, validation and test sets", "Data leakage, and how easily it happens"],
          },
          {
            title: "Feature Engineering",
            minutes: 24,
            objective: "Give the model information it can use.",
            covers: ["Encoding categories", "Scaling numbers, and when it is required", "Creating features from dates and text"],
          },
        ],
        quiz: [
          {
            prompt: "Why hold back a test set?",
            options: [
              { text: "To measure performance on data the model has never seen", correct: true },
              { text: "To reduce training time" },
              { text: "To save memory" },
              { text: "It is optional" },
            ],
          },
          {
            prompt: "What is data leakage?",
            options: [
              { text: "Information from the test set influencing training, making results look better than they are", correct: true },
              { text: "Losing rows during cleaning" },
              { text: "A security breach" },
              { text: "Missing values" },
            ],
          },
          {
            prompt: "Predicting house price from size and location is which kind of task?",
            options: [
              { text: "Regression", correct: true },
              { text: "Classification" },
              { text: "Clustering" },
              { text: "Reinforcement learning" },
            ],
          },
        ],
      },
      {
        title: "Module 2 — Training Models",
        summary: "Supervised and unsupervised methods that cover most real work.",
        lessons: [
          {
            title: "Supervised Learning",
            minutes: 28,
            objective: "Train models that learn from labelled examples.",
            covers: ["Linear and logistic regression", "Decision trees and random forests", "Fitting and predicting with scikit-learn"],
          },
          {
            title: "Unsupervised Learning",
            minutes: 24,
            objective: "Find structure where there are no labels.",
            covers: ["k-means clustering", "Choosing the number of clusters", "Dimensionality reduction, briefly"],
          },
          {
            title: "Training in Practice",
            minutes: 24,
            objective: "Run a complete training cycle.",
            covers: ["Baselines first — always", "Hyperparameters and cross-validation", "Underfitting and overfitting, diagnosed"],
          },
        ],
        quiz: [
          {
            prompt: "Why establish a simple baseline before training a complex model?",
            options: [
              { text: "Without it you cannot tell whether the complex model is actually helping", correct: true },
              { text: "It is required by scikit-learn" },
              { text: "It trains faster" },
              { text: "It improves accuracy" },
            ],
          },
          {
            prompt: "Which is unsupervised?",
            options: [
              { text: "k-means clustering", correct: true },
              { text: "Logistic regression" },
              { text: "Random forest classification" },
              { text: "Linear regression" },
            ],
          },
        ],
        activity: {
          title: "Practical — Train and compare",
          instructions: `
On a dataset of your choice:

1. Establish a baseline — the result of the most naive sensible rule.
2. Train at least two different models.
3. Compare them on the test set with an appropriate metric.
4. State whether either beats the baseline enough to justify the complexity.

Submit the notebook. A model that does not beat the baseline, reported honestly, scores full marks.
`.trim(),
        },
      },
      {
        title: "Module 3 — Evaluation and Responsibility",
        summary: "Judging a model properly, and what follows if it is deployed.",
        lessons: [
          {
            title: "Measuring Performance Honestly",
            minutes: 26,
            objective: "Use the measure that matches the consequences.",
            covers: [
              "Accuracy, and why it fails on imbalanced data",
              "Precision, recall, F1, and the confusion matrix",
              "Choosing a threshold based on which error costs more",
            ],
          },
          {
            title: "When a Good Model Is Still Wrong",
            minutes: 22,
            objective: "Recognise failures that metrics do not show.",
            covers: ["Performance differing across groups of people", "Distribution shift after deployment", "Feedback loops that entrench a mistake"],
          },
          {
            title: "Responsible Deployment",
            minutes: 22,
            objective: "Put a model into use without causing harm.",
            covers: [
              "Documenting what the model does, on what data, with what limits",
              "Human review for decisions affecting people",
              "Monitoring, and the conditions under which you would switch it off",
            ],
          },
        ],
        quiz: [
          {
            prompt: "A disease affects 1% of people. A model predicting 'no disease' for everyone reports 99% accuracy. What does this show?",
            options: [
              { text: "Accuracy is the wrong measure for imbalanced data", correct: true },
              { text: "The model is excellent" },
              { text: "The data is faulty" },
              { text: "More training is needed" },
            ],
          },
          {
            prompt: "In screening for a serious illness, which error matters more?",
            options: [
              { text: "A false negative — missing someone who has it", correct: true },
              { text: "A false positive" },
              { text: "They are always equal" },
              { text: "Neither, if accuracy is high" },
            ],
          },
          {
            prompt: "Which belong in responsible deployment?",
            type: "multiple",
            options: [
              { text: "Documented limits and intended use", correct: true },
              { text: "Human review of decisions affecting people", correct: true },
              { text: "Monitoring after release", correct: true },
              { text: "Keeping the training data secret from auditors" },
            ],
          },
        ],
      },
    ],
  }),

  scaffold({
    slug: "ai-powered-ecommerce",
    title: "AI-Powered eCommerce",
    categorySlug: CAT,
    courseCode: "HS-AI-04",
    summary:
      "Use AI across an online shop — product research, listings, customer service, marketing and analytics — without letting it damage the business.",
    description: `
An online shop involves a great deal of repetitive work: writing listings, answering the same questions, producing images, checking what sells. AI does much of it faster.

It also produces listings that overpromise, customer service replies that promise refunds you did not agree to, and product images that do not match what arrives. This course covers both halves, because the second is what costs money.

Take the Hunarsaaz E-Commerce course first if you have not run a shop. This one assumes you know what a landed cost and a return rate are.
`.trim(),
    level: "intermediate",
    durationWeeks: 8,
    learningHours: 36,
    prerequisites: "AI for Everyone, and either the Hunarsaaz E-Commerce course or practical experience of selling online.",
    targetLearners: "Online sellers, marketplace sellers, e-commerce staff, and freelancers offering shop management.",
    objectives: [
      "Use AI to speed up product research and listing work.",
      "Keep AI-written content accurate and within advertising rules.",
      "Deploy AI customer service without damaging trust.",
      "Apply AI to marketing and content production.",
      "Read the analytics that decide whether any of it is working.",
    ],
    outcomes: [
      "Use AI to analyse competitor listings and reviews.",
      "Generate product titles and descriptions, then fact-check and correct them.",
      "Set up an AI assistant with clear limits on what it may promise.",
      "Produce marketing content and campaign variants quickly.",
      "Explain how recommendation systems work.",
      "Identify the repetitive tasks in a shop that automation should take.",
    ],
    careers: ["E-Commerce Manager", "Marketplace Seller", "Product Listing Specialist", "E-commerce Marketing Executive", "Freelance store manager"],
    skills: ["AI product research", "AI copywriting", "Chatbots", "Automation", "E-commerce analytics"],
    finalProject:
      "Take a real or simulated shop with at least ten products. Rebuild its listings with AI assistance, document every factual correction you had to make, set up an assistant with written limits, and report the time saved and the risks introduced.",
    curriculumSource: SOURCE_NOTE,
    modules: [
      {
        title: "Module 1 — Research and Listings",
        summary: "Finding what to sell and describing it, faster and accurately.",
        lessons: [
          {
            title: "AI for Product and Market Research",
            minutes: 22,
            preview: true,
            objective: "Use AI to shorten research without trusting its figures.",
            covers: [
              "Summarising competitor listings and review complaints",
              "Spotting gaps from what customers say is missing",
              "Why you must verify every price, figure and claim it produces",
            ],
          },
          {
            title: "AI Product Descriptions",
            minutes: 24,
            objective: "Generate listings that are accurate and sell.",
            covers: [
              "Prompting with real specifications rather than adjectives",
              "Removing invented features — the most common and costly error",
              "Keeping within marketplace rules and advertising law",
            ],
          },
          {
            title: "Images and Media",
            minutes: 20,
            objective: "Use generated and enhanced imagery honestly.",
            covers: [
              "Background removal and cleanup — acceptable",
              "Generated images of a product you sell — usually not",
              "Why an image that misrepresents causes returns and bad reviews",
            ],
          },
        ],
        quiz: [
          {
            prompt: "AI writes a description claiming a feature the product lacks. Why is this serious?",
            options: [
              { text: "Returns, bad reviews, and potentially a breach of advertising rules", correct: true },
              { text: "It slows the page down" },
              { text: "It is not serious if it sells" },
              { text: "Marketplaces do not check" },
            ],
          },
          {
            prompt: "Which image handling is acceptable?",
            options: [
              { text: "Removing a cluttered background from a real photograph", correct: true },
              { text: "Generating an image of the product you have not photographed" },
              { text: "Changing the product's colour to a shade you do not stock" },
              { text: "Using a competitor's photograph" },
            ],
          },
        ],
      },
      {
        title: "Module 2 — Customers, Marketing and Content",
        summary: "Where AI meets the people who buy from you.",
        lessons: [
          {
            title: "AI Customer Service",
            minutes: 24,
            objective: "Automate replies without creating obligations you did not agree to.",
            covers: [
              "Handling the questions asked fifty times a day",
              "Hard limits: never inventing refunds, discounts or delivery dates",
              "Handing over to a human, and saying plainly it is a bot",
            ],
          },
          {
            title: "AI in Marketing",
            minutes: 22,
            objective: "Produce campaign material quickly.",
            covers: ["Ad and email variants for testing", "Segmenting an audience", "Keeping brand voice consistent"],
          },
          {
            title: "Generated Content at Scale",
            minutes: 20,
            objective: "Produce volume without producing rubbish.",
            covers: ["Social posts and blog drafts from product knowledge", "Editing generated text so it does not read as generated", "Disclosure, where it is expected"],
          },
        ],
        quiz: [
          {
            prompt: "A chatbot promises a customer a refund the shop does not offer. Who is bound?",
            options: [
              { text: "The shop, in practice and often in law — which is why limits must be set in advance", correct: true },
              { text: "Nobody" },
              { text: "The AI provider" },
              { text: "The customer" },
            ],
          },
          {
            prompt: "What must an AI customer service assistant always do?",
            type: "multiple",
            options: [
              { text: "Make clear it is not a person", correct: true },
              { text: "Hand over to a human when it cannot help", correct: true },
              { text: "Stay within stated policy on refunds and delivery", correct: true },
              { text: "Answer every question regardless of confidence" },
            ],
          },
        ],
        activity: {
          title: "Practical — Rebuild five listings",
          instructions: `
Take five real product listings — yours or a competitor's.

1. Rewrite each with AI assistance from real specifications.
2. **List every factual error the AI introduced.** There will be some.
3. Write the limits you would give a customer service assistant, as rules.
4. State the time saved and the checking time added.
`.trim(),
        },
      },
      {
        title: "Module 3 — Recommendations, Analytics and Automation",
        summary: "The systems behind the shop, and knowing whether it worked.",
        lessons: [
          {
            title: "How Recommendations Work",
            minutes: 20,
            objective: "Understand what drives 'customers also bought'.",
            covers: ["Collaborative and content-based filtering", "Cold start", "Where recommendations become manipulative"],
          },
          {
            title: "Analytics and Forecasting",
            minutes: 22,
            objective: "Use data to decide what to stock and what to drop.",
            covers: ["The metrics that matter in a shop", "Simple demand forecasting and its limits", "Spotting a product quietly losing money"],
          },
          {
            title: "Automating the Repetitive Work",
            minutes: 20,
            objective: "Remove manual steps safely.",
            covers: [
              "Order confirmations, stock alerts, review requests",
              "Connecting tools without writing code",
              "What must never be automated without a human",
            ],
          },
        ],
        quiz: [
          {
            prompt: "What is the cold start problem?",
            options: [
              { text: "A recommender has nothing to work from for a new user or product", correct: true },
              { text: "The system is slow when first loaded" },
              { text: "Sales fall in winter" },
              { text: "New shops rank poorly" },
            ],
          },
          {
            prompt: "Which should NOT be fully automated?",
            options: [
              { text: "Approving a refund outside policy", correct: true },
              { text: "Sending an order confirmation" },
              { text: "A low stock alert" },
              { text: "A review request after delivery" },
            ],
          },
        ],
      },
    ],
  }),

  scaffold({
    slug: "ai-and-robotics",
    title: "AI & Robotics",
    categorySlug: CAT,
    courseCode: "HS-AI-05",
    summary:
      "How machines sense, decide and act — sensors, actuators, control and computer vision, with a buildable project at the end.",
    description: `
Robotics is where software meets the physical world, and the physical world is unforgiving. A program with a bug prints the wrong number; a robot with a bug hits something.

This course covers the components — sensors, actuators, controllers — the programming that ties them together, and where AI genuinely adds capability, particularly computer vision. It ends with a project you can build with inexpensive hardware or, if that is not available to you, complete entirely in simulation.

It is an introduction. It will not make you a robotics engineer, but it will let you understand, specify and build simple automation.
`.trim(),
    level: "intermediate",
    durationWeeks: 12,
    learningHours: 60,
    prerequisites:
      "Basic programming, ideally Python. Helpful but not required: an Arduino or Raspberry Pi. Everything can be completed in free simulation software if hardware is not available.",
    targetLearners:
      "Engineering and computing students, technical staff in manufacturing, and anyone interested in automation and embedded systems.",
    objectives: [
      "Describe the components of a robotic system and how they interact.",
      "Explain how sensors and actuators work and where each is appropriate.",
      "Program simple automated behaviour.",
      "Explain how computer vision lets a machine interpret what it sees.",
      "Assess automation proposals realistically, including their effect on workers.",
    ],
    outcomes: [
      "Identify suitable sensors and actuators for a stated task.",
      "Write control logic including a simple feedback loop.",
      "Use a vision library to detect objects in an image.",
      "Describe industrial automation and where it is used in Pakistan.",
      "Explain what autonomous systems cannot currently do reliably.",
      "Build and demonstrate a working automated system or simulation.",
    ],
    careers: ["Automation Technician", "Robotics Assistant", "Embedded Systems Trainee", "Industrial Maintenance Technician", "STEM Educator"],
    skills: ["Sensors", "Actuators", "Control logic", "Computer vision", "Embedded programming"],
    finalProject:
      "Design and build an automated system that senses something, decides, and acts — a line follower, a sorting mechanism, an automatic light. Hardware or simulation both acceptable. Submit a demonstration video, your code, and an account of what failed and how you diagnosed it.",
    resources: [
      { label: "OpenCV documentation", url: "https://docs.opencv.org/" },
      { label: "Arduino reference", url: "https://www.arduino.cc/reference/en/" },
    ],
    curriculumSource: SOURCE_NOTE,
    modules: [
      {
        title: "Module 1 — Robotics Fundamentals",
        summary: "The parts of a robot and what each one does.",
        lessons: [
          {
            title: "What Makes Something a Robot",
            minutes: 18,
            preview: true,
            objective: "Define a robotic system and its parts.",
            covers: ["Sense, decide, act", "Controllers, power, mechanical structure", "Degrees of freedom"],
          },
          {
            title: "Sensors",
            minutes: 24,
            objective: "Choose the right sensor and understand its limits.",
            covers: [
              "Distance, light, temperature, touch, motion, camera",
              "Analogue versus digital signals",
              "Noise, drift and calibration — every sensor lies a little",
            ],
          },
          {
            title: "Actuators and Motion",
            minutes: 22,
            objective: "Make things move under control.",
            covers: ["DC, servo and stepper motors", "Torque, speed, gearing", "Power supply, and why it is usually the problem"],
          },
        ],
        quiz: [
          {
            prompt: "What are the three stages of a robotic system?",
            options: [
              { text: "Sense, decide, act", correct: true },
              { text: "Input, output, store" },
              { text: "Start, run, stop" },
              { text: "Plan, build, test" },
            ],
          },
          {
            prompt: "Which motor is best where a precise angle is needed?",
            options: [
              { text: "Servo motor", correct: true },
              { text: "DC motor" },
              { text: "Induction motor" },
              { text: "Any of them" },
            ],
          },
          {
            prompt: "A distance sensor gives slightly different readings each time. What is this?",
            options: [
              { text: "Normal sensor noise, to be handled in software", correct: true },
              { text: "A faulty sensor" },
              { text: "A wiring error" },
              { text: "Insufficient power" },
            ],
          },
        ],
      },
      {
        title: "Module 2 — Control and Programming",
        summary: "Turning sensor readings into sensible action.",
        lessons: [
          {
            title: "Programming a Microcontroller",
            minutes: 26,
            objective: "Write and upload code that reads inputs and drives outputs.",
            covers: ["Setup and loop", "Reading a sensor, driving a pin", "Debugging without a screen"],
          },
          {
            title: "Feedback and Control Loops",
            minutes: 24,
            objective: "Make a system correct itself.",
            covers: ["Open versus closed loop", "A simple proportional controller", "Overshoot and oscillation"],
          },
          {
            title: "Automation Logic",
            minutes: 22,
            objective: "Design behaviour that is safe when things go wrong.",
            covers: ["State machines", "Timing and sequencing", "Failing safe — what happens when a sensor stops responding"],
          },
        ],
        quiz: [
          {
            prompt: "What distinguishes a closed loop system?",
            options: [
              { text: "It measures the result and corrects itself", correct: true },
              { text: "It runs continuously" },
              { text: "It has no sensors" },
              { text: "It is fully autonomous" },
            ],
          },
          {
            prompt: "Why must a system fail safe?",
            options: [
              { text: "A component will eventually fail, and the machine must not become dangerous when it does", correct: true },
              { text: "To satisfy the compiler" },
              { text: "To reduce power use" },
              { text: "It only matters in aviation" },
            ],
          },
        ],
        activity: {
          title: "Practical — Sense and respond",
          instructions: `
Build or simulate a system that reads one sensor and drives one actuator in response — a light that comes on in darkness, a barrier that opens on detection.

Submit code, a wiring diagram or simulation link, a short video, and a note on what failed first and how you found it. The failure account carries marks.
`.trim(),
        },
      },
      {
        title: "Module 3 — AI, Vision and Applications",
        summary: "Where AI adds capability, and what automation does to work.",
        lessons: [
          {
            title: "Computer Vision",
            minutes: 26,
            objective: "Let a machine interpret an image.",
            covers: ["Images as arrays of numbers", "Detecting edges, colours, shapes", "Object detection, and why lighting decides success"],
          },
          {
            title: "Industrial Automation",
            minutes: 22,
            objective: "Understand automation as actually deployed.",
            covers: ["Production lines, pick and place, inspection", "PLCs and industrial control", "Where this exists in Pakistani industry"],
          },
          {
            title: "Autonomous Systems and Their Limits",
            minutes: 22,
            objective: "Assess autonomy claims realistically.",
            covers: [
              "Levels of autonomy",
              "Why the last few percent of reliability is the hard part",
              "Safety, liability, and the effect on the people doing the job now",
            ],
          },
        ],
        quiz: [
          {
            prompt: "What most often causes a vision system to fail in practice?",
            options: [
              { text: "Lighting different from what it was developed under", correct: true },
              { text: "Camera resolution" },
              { text: "Slow processors" },
              { text: "Cable length" },
            ],
          },
          {
            prompt: "Why is the last few percent of reliability so difficult in autonomous systems?",
            options: [
              { text: "The rare situations are the hardest and the most dangerous to get wrong", correct: true },
              { text: "Hardware becomes expensive" },
              { text: "Software licences expire" },
              { text: "It is not difficult" },
            ],
          },
          {
            prompt: "What should an automation proposal consider besides cost and output?",
            options: [
              { text: "Safety, maintenance, failure modes, and the effect on the people currently doing the work", correct: true },
              { text: "Only the payback period" },
              { text: "Only the technology" },
              { text: "Nothing else" },
            ],
          },
        ],
      },
    ],
  }),
];
