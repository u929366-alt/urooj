import { scaffold } from "./scaffold.ts";
import type { CourseContent } from "./types.ts";

const CAT = "it-and-digital-skills";
const SOURCE_NOTE =
  "Syllabus developed by Hunarsaaz from current industry practice and employer demand in Pakistan. NAVTTC's qualifications database was NOT consulted — navttc.gov.pk is unreachable from the environment this was written in. Before claiming any NAVTTC alignment, someone must open the relevant qualification and compare it module by module.";

export const itDigitalCourses: CourseContent[] = [
  scaffold({
    slug: "microsoft-excel",
    title: "Microsoft Excel",
    categorySlug: CAT,
    courseCode: "HS-XL-01",
    summary:
      "From typing your first formula to building a report someone else relies on. The single most requested office skill in Pakistan.",
    description: `
More job advertisements name Excel than any other software, and most people who list it on a CV can do perhaps a tenth of what the job needs.

This course takes you from a blank sheet to genuinely useful work: formulas that do not break when a row is inserted, lookups across sheets, pivot tables that answer a manager's question in a minute, charts that are read correctly, and files laid out so a colleague can pick them up.

It is taught with the keyboard and the reasoning, not by memorising menus. Everything transfers to Google Sheets and LibreOffice, which matters when the office licence runs out.
`.trim(),
    level: "beginner",
    durationWeeks: 8,
    learningHours: 40,
    prerequisites:
      "Basic computer use — files, folders, typing. Excel, Google Sheets or LibreOffice Calc installed. A desktop or laptop; this cannot be learned on a phone.",
    targetLearners:
      "Office staff, shop and warehouse record keepers, students preparing for work, and anyone whose job involves numbers kept in a book or in someone's head.",
    objectives: [
      "Build spreadsheets that stay correct when data is added or rows are moved.",
      "Use formulas and functions to answer questions rather than to retype figures.",
      "Summarise large amounts of data quickly with sorting, filtering and pivot tables.",
      "Present numbers so the reader draws the right conclusion.",
      "Lay out a workbook so somebody else can use it without asking you.",
    ],
    outcomes: [
      "Write formulas using absolute and relative references correctly.",
      "Use IF, SUMIF, COUNTIF, VLOOKUP or XLOOKUP, and text and date functions.",
      "Clean an untidy dataset into something analysable.",
      "Build a pivot table and chart to answer a specific question.",
      "Protect and validate a sheet so others cannot break it by accident.",
      "Produce a one-page summary report from raw data.",
    ],
    careers: [
      "Data Entry Operator",
      "Accounts Assistant",
      "Office Administrator",
      "Inventory or Stock Clerk",
      "Sales Coordinator",
      "Junior Analyst",
    ],
    skills: ["Formulas", "Lookups", "Pivot tables", "Charts", "Data cleaning", "Reporting"],
    finalProject:
      "Take a real, untidy dataset — a stock list, a sales book, an attendance register — clean it, analyse it, and produce a one-page summary with at least one pivot table and one chart, plus three findings written in plain language.",
    resources: [
      { label: "Microsoft's own Excel training centre", url: "https://support.microsoft.com/excel" },
      { label: "Google Sheets help", url: "https://support.google.com/docs" },
    ],
    curriculumSource: SOURCE_NOTE,
    modules: [
      {
        title: "Module 1 — Getting Around a Spreadsheet",
        summary: "The grid, the vocabulary, and habits that prevent most beginner mistakes.",
        lessons: [
          {
            title: "Workbooks, Sheets, Rows and Columns",
            minutes: 15,
            preview: true,
            objective: "Know what every part of the screen is called and what it does.",
            covers: [
              "Workbook, worksheet, cell, row, column, range",
              "Moving and selecting with the keyboard rather than the mouse",
              "Saving, file formats, and why .csv silently loses your formatting",
            ],
          },
          {
            title: "Entering Data Without Creating Problems",
            minutes: 18,
            objective: "Enter data in a form that can be analysed later.",
            covers: [
              "Numbers, text and dates — and why a date typed wrongly is unusable",
              "One fact per cell: never 'Ali Khan - Lahore - 5000' in one box",
              "Autofill and flash fill",
            ],
          },
          {
            title: "Formatting That Helps the Reader",
            minutes: 16,
            objective: "Make a sheet readable without making it decorative.",
            covers: [
              "Number, currency, percentage and date formats",
              "Column widths, wrapping and freezing panes",
              "Why colour alone should never carry meaning",
            ],
          },
        ],
        quiz: [
          {
            prompt: "Why should a name, city and amount not be typed into one cell?",
            options: [
              { text: "Nothing in the cell can be sorted, filtered or calculated", correct: true },
              { text: "The cell runs out of space" },
              { text: "Excel rejects it" },
              { text: "It prints badly" },
            ],
          },
          {
            prompt: "What does freezing panes do?",
            options: [
              { text: "Keeps headings visible while you scroll", correct: true },
              { text: "Stops anyone editing the sheet" },
              { text: "Locks the formulas" },
              { text: "Prevents the file from changing" },
            ],
          },
          {
            prompt: "Saving as .csv loses which of these?",
            type: "multiple",
            options: [
              { text: "Formatting", correct: true },
              { text: "Multiple sheets", correct: true },
              { text: "Formulas", correct: true },
              { text: "The data itself" },
            ],
          },
        ],
      },
      {
        title: "Module 2 — Formulas and Functions",
        summary: "Making the sheet calculate for you, and not break when things move.",
        lessons: [
          {
            title: "Your First Formulas",
            minutes: 20,
            objective: "Write arithmetic that updates itself when the data changes.",
            covers: [
              "Starting with =, and the order of operations",
              "SUM, AVERAGE, MIN, MAX, COUNT",
              "Reading and fixing #VALUE!, #REF! and #DIV/0!",
            ],
          },
          {
            title: "Absolute and Relative References",
            minutes: 22,
            objective: "Understand the single idea that breaks most beginners' spreadsheets.",
            covers: [
              "What actually happens when you copy a formula down",
              "The $ sign, and the F4 shortcut",
              "A worked example: applying one tax rate to a whole column",
            ],
          },
          {
            title: "Logic with IF",
            minutes: 20,
            objective: "Make a cell decide between outcomes.",
            covers: ["IF", "Nested IF, and when to stop nesting", "AND, OR, IFERROR"],
          },
          {
            title: "Conditional Sums and Counts",
            minutes: 22,
            objective: "Answer 'how many' and 'how much' for part of a dataset.",
            covers: ["COUNTIF and COUNTIFS", "SUMIF and SUMIFS", "AVERAGEIF"],
          },
        ],
        quiz: [
          {
            prompt: "You copy =B2*C1 down a column and the answers go wrong. What is the likely cause?",
            options: [
              { text: "C1 should have been absolute — $C$1", correct: true },
              { text: "The column is too narrow" },
              { text: "The cells are formatted as text" },
              { text: "Excel needs restarting" },
            ],
          },
          {
            prompt: "Which function counts rows matching two conditions?",
            options: [
              { text: "COUNTIFS", correct: true },
              { text: "COUNT" },
              { text: "COUNTA" },
              { text: "SUMIF" },
            ],
          },
          {
            prompt: "What does IFERROR do?",
            options: [
              { text: "Shows a value you choose instead of an error message", correct: true },
              { text: "Fixes the formula automatically" },
              { text: "Deletes the erroring cell" },
              { text: "Hides the row" },
            ],
          },
        ],
        activity: {
          title: "Practical — Rebuild a sales sheet",
          instructions: `
You are given (or make) a sheet of 40 sales rows: date, item, quantity, unit price, city.

1. Add a **Total** column using a formula, not typed numbers.
2. Apply a single tax rate held in **one** cell, referenced absolutely, to every row.
3. Use COUNTIFS and SUMIFS to answer: how many sales in Lahore over Rs 5,000, and what did they total?
4. Add an IFERROR wrapper anywhere a division could fail, and explain in one line where and why.

Submit the file, and a short note saying which reference had to be absolute and what happens if it is not.
`.trim(),
        },
      },
      {
        title: "Module 3 — Working With Real Data",
        summary: "Cleaning, joining and controlling data that arrived in a mess.",
        lessons: [
          {
            title: "Sorting and Filtering",
            minutes: 16,
            objective: "Find the rows that matter without deleting anything.",
            covers: ["Sorting on several columns", "Filters and custom filters", "Why you sort the whole table, never one column"],
          },
          {
            title: "Lookups Across Sheets",
            minutes: 25,
            objective: "Pull matching information from another table.",
            covers: [
              "VLOOKUP, and its limitations",
              "XLOOKUP, and INDEX/MATCH where XLOOKUP is unavailable",
              "Why #N/A usually means a stray space, not a missing record",
            ],
          },
          {
            title: "Cleaning Untidy Data",
            minutes: 22,
            objective: "Turn an exported mess into something you can analyse.",
            covers: [
              "TRIM, UPPER, LOWER, PROPER, LEFT, RIGHT, MID",
              "Text to Columns, and Remove Duplicates",
              "Finding the rows that will ruin the total",
            ],
          },
          {
            title: "Protecting the Sheet From Its Users",
            minutes: 18,
            objective: "Stop a colleague breaking the file by accident.",
            covers: ["Data validation and dropdown lists", "Locking cells and protecting sheets", "Clear input areas versus calculated areas"],
          },
        ],
        quiz: [
          {
            prompt: "A VLOOKUP returns #N/A for records you can see exist. What is the most common cause?",
            options: [
              { text: "Trailing spaces or a text/number mismatch in the lookup value", correct: true },
              { text: "The file is too large" },
              { text: "VLOOKUP does not work across sheets" },
              { text: "The table is not sorted" },
            ],
          },
          {
            prompt: "Why should you never sort a single column of a table?",
            options: [
              { text: "The rows come apart and every record is corrupted", correct: true },
              { text: "It is slower" },
              { text: "Excel will not allow it" },
              { text: "It removes formatting" },
            ],
          },
          {
            prompt: "What is data validation for?",
            options: [
              { text: "Restricting what can be typed into a cell", correct: true },
              { text: "Checking formulas for errors" },
              { text: "Verifying the file is not corrupt" },
              { text: "Formatting numbers consistently" },
            ],
          },
        ],
      },
      {
        title: "Module 4 — Analysis and Reporting",
        summary: "Pivot tables, charts, and turning a sheet into something a manager reads.",
        lessons: [
          {
            title: "Pivot Tables",
            minutes: 28,
            objective: "Summarise thousands of rows in under a minute.",
            covers: [
              "Rows, columns, values and filters",
              "Changing the summary: sum, count, average, percentage of total",
              "Grouping dates into months, and refreshing when data changes",
            ],
          },
          {
            title: "Charts That Are Read Correctly",
            minutes: 22,
            objective: "Choose a chart that answers the question honestly.",
            covers: [
              "Column for comparison, line for change over time, and when a pie chart misleads",
              "Labelling axes, and why a truncated axis exaggerates",
              "One message per chart",
            ],
          },
          {
            title: "Building a One-Page Report",
            minutes: 24,
            objective: "Present findings so a busy reader acts on them.",
            covers: [
              "Headline number first, detail below",
              "Conditional formatting used sparingly",
              "Printing and PDF export that does not split across nine pages",
            ],
          },
        ],
        quiz: [
          {
            prompt: "A pivot table still shows old figures after the source data changed. What is needed?",
            options: [
              { text: "Refresh the pivot table", correct: true },
              { text: "Rebuild it from scratch" },
              { text: "Restart Excel" },
              { text: "Re-sort the source data" },
            ],
          },
          {
            prompt: "Which chart suits change over twelve months?",
            options: [
              { text: "Line chart", correct: true },
              { text: "Pie chart" },
              { text: "Scatter plot" },
              { text: "Doughnut chart" },
            ],
          },
          {
            prompt: "Why is starting a bar chart's axis above zero misleading?",
            options: [
              { text: "It exaggerates small differences", correct: true },
              { text: "It makes the chart harder to print" },
              { text: "Excel does not support it" },
              { text: "It is not misleading" },
            ],
          },
        ],
        activity: {
          title: "Practical — Pivot and report",
          instructions: `
Using the dataset from Module 2:

1. Build a pivot table showing total sales by city and by month.
2. Add a chart that answers one specific question. Say what the question is.
3. Write three findings in plain language — the kind a manager could act on.
4. Export the summary as a single-page PDF.

Submit the workbook and the PDF.
`.trim(),
        },
      },
    ],
  }),

  scaffold({
    slug: "power-bi",
    title: "Power BI",
    categorySlug: CAT,
    courseCode: "HS-PBI-01",
    summary:
      "Turn scattered spreadsheets into a dashboard that updates itself and answers questions without anyone rebuilding it.",
    description: `
Excel answers a question. Power BI answers it again next month without anybody redoing the work.

This course covers connecting to data wherever it lives, cleaning it once in Power Query, modelling it so the relationships are right, writing the DAX measures that do the real calculation, and designing a report page that a decision-maker can read without training.

It assumes Excel at the level of the Hunarsaaz Excel course. If lookups and pivot tables are unfamiliar, start there.
`.trim(),
    level: "intermediate",
    durationWeeks: 10,
    learningHours: 50,
    prerequisites:
      "Comfortable with Excel formulas, lookups and pivot tables. Power BI Desktop, which is free, and a Windows machine to run it — this is the one course here that will not work on a phone or a Mac without extra effort.",
    targetLearners:
      "Anyone already producing reports by hand each month, analysts, and Excel users whose files have grown beyond what a spreadsheet should carry.",
    objectives: [
      "Connect to and combine data from several sources.",
      "Clean and reshape data reproducibly, so the work is done once.",
      "Build a data model with correct relationships.",
      "Write DAX measures that calculate correctly under filtering.",
      "Design report pages that lead the reader to the point.",
    ],
    outcomes: [
      "Import from Excel, CSV, a database and a web source.",
      "Use Power Query to clean, merge and append data.",
      "Build a star-schema model and explain why it beats one flat table.",
      "Write measures with SUM, CALCULATE, filter context and time intelligence.",
      "Publish a report and set up scheduled refresh.",
      "Design a dashboard readable in ten seconds.",
    ],
    careers: [
      "Business Intelligence Analyst",
      "Data Analyst",
      "MIS Officer",
      "Reporting Analyst",
      "Operations Analyst",
    ],
    skills: ["Power Query", "Data modelling", "DAX", "Dashboard design", "Scheduled refresh"],
    finalProject:
      "Build a working dashboard from at least two separate data sources, with a cleaned model, three or more DAX measures, and one page designed for a named audience. Present it in five minutes and justify every visual.",
    resources: [
      { label: "Microsoft Power BI documentation", url: "https://learn.microsoft.com/power-bi/" },
    ],
    curriculumSource: SOURCE_NOTE,
    modules: [
      {
        title: "Module 1 — What Power BI Is For",
        summary: "Where it fits beside Excel, and the shape of the tool.",
        lessons: [
          {
            title: "Excel, Power BI, and Choosing Between Them",
            minutes: 16,
            preview: true,
            objective: "Know when a spreadsheet is the right answer and when it is not.",
            covers: [
              "Repeatability: the real difference",
              "Data volume, refresh, and sharing",
              "Cases where Excel remains the better tool",
            ],
          },
          {
            title: "The Desktop, the Service and the Report",
            minutes: 18,
            objective: "Understand the pieces and what each is for.",
            covers: ["Power BI Desktop", "The Power BI Service and workspaces", "Reports, dashboards and datasets"],
          },
          {
            title: "Connecting to Your First Data",
            minutes: 20,
            objective: "Load data and see something on screen.",
            covers: ["Connecting to Excel and CSV", "Import versus DirectQuery", "The first visual"],
          },
        ],
        quiz: [
          {
            prompt: "What is the main reason to move a monthly report from Excel to Power BI?",
            options: [
              { text: "It refreshes without the work being redone each month", correct: true },
              { text: "It looks more impressive" },
              { text: "Excel cannot make charts" },
              { text: "It is cheaper" },
            ],
          },
          {
            prompt: "Which holds the data and the model?",
            options: [
              { text: "The dataset", correct: true },
              { text: "The dashboard" },
              { text: "The workspace" },
              { text: "The visual" },
            ],
          },
        ],
      },
      {
        title: "Module 2 — Power Query",
        summary: "Cleaning and combining data once, so it never has to be done again.",
        lessons: [
          {
            title: "The Query Editor",
            minutes: 22,
            objective: "Reshape data with recorded steps rather than by hand.",
            covers: ["Applied steps and why they are the point", "Removing columns and rows", "Changing data types deliberately"],
          },
          {
            title: "Cleaning Messy Sources",
            minutes: 24,
            objective: "Deal with the state real data actually arrives in.",
            covers: ["Split, trim, replace", "Handling nulls and errors", "Unpivoting columns that should have been rows"],
          },
          {
            title: "Merging and Appending",
            minutes: 22,
            objective: "Combine tables correctly.",
            covers: ["Append for more rows, merge for more columns", "Join types in plain language", "Combining a folder of monthly files"],
          },
        ],
        quiz: [
          {
            prompt: "Why are Power Query's applied steps important?",
            options: [
              { text: "They re-run automatically on new data, so cleaning is never repeated by hand", correct: true },
              { text: "They make the file smaller" },
              { text: "They are required before publishing" },
              { text: "They speed up visuals" },
            ],
          },
          {
            prompt: "You have twelve monthly files with identical columns. What do you use?",
            options: [
              { text: "Append", correct: true },
              { text: "Merge" },
              { text: "Unpivot" },
              { text: "A relationship" },
            ],
          },
          {
            prompt: "Months spread across twelve columns need to become rows. Which operation?",
            options: [
              { text: "Unpivot", correct: true },
              { text: "Pivot" },
              { text: "Transpose" },
              { text: "Group by" },
            ],
          },
        ],
        activity: {
          title: "Practical — Clean and combine",
          instructions: `
Take three untidy files — different formats if you can manage it.

1. Load all three, clean each in Power Query, and combine them into one table.
2. Handle at least one of: merged headers, columns that should be rows, mixed date formats.
3. Screenshot your applied steps list and explain three of the steps.
4. Add a new file to the source and show it flows through without further work.

Submit the .pbix file and your notes.
`.trim(),
        },
      },
      {
        title: "Module 3 — Modelling and DAX",
        summary: "Relationships, and calculations that stay correct when filtered.",
        lessons: [
          {
            title: "Relationships and the Star Schema",
            minutes: 25,
            objective: "Structure tables so the model behaves predictably.",
            covers: ["Fact and dimension tables", "One-to-many relationships and filter direction", "Why one giant flat table causes trouble"],
          },
          {
            title: "Calculated Columns and Measures",
            minutes: 22,
            objective: "Know which of the two you need, and why it matters.",
            covers: ["Row context versus filter context", "When a column is right", "Why a measure is usually right"],
          },
          {
            title: "DAX You Will Actually Use",
            minutes: 26,
            objective: "Write the handful of measures that cover most reporting.",
            covers: ["SUM, AVERAGE, DIVIDE", "CALCULATE and modifying filters", "A date table, and month-on-month comparison"],
          },
        ],
        quiz: [
          {
            prompt: "What does a measure calculate against?",
            options: [
              { text: "The filter context it is evaluated in", correct: true },
              { text: "The whole table, always" },
              { text: "The row it sits in" },
              { text: "The visual's colour settings" },
            ],
          },
          {
            prompt: "Why use DIVIDE rather than the / operator?",
            options: [
              { text: "It handles division by zero without an error", correct: true },
              { text: "It is faster" },
              { text: "It rounds automatically" },
              { text: "The / operator is not supported" },
            ],
          },
          {
            prompt: "What does a separate date table make possible?",
            options: [
              { text: "Time comparisons such as month-on-month and year-to-date", correct: true },
              { text: "Faster refresh" },
              { text: "Smaller files" },
              { text: "Automatic charting" },
            ],
          },
        ],
      },
      {
        title: "Module 4 — Reports People Use",
        summary: "Visual design, publishing, refresh, and sharing responsibly.",
        lessons: [
          {
            title: "Choosing and Arranging Visuals",
            minutes: 22,
            objective: "Design a page that answers a question at a glance.",
            covers: ["Matching visual to question", "Layout, hierarchy and colour restraint", "Slicers and cross-filtering"],
          },
          {
            title: "Publishing and Refresh",
            minutes: 20,
            objective: "Get the report to the people who need it, kept current.",
            covers: ["Publishing to a workspace", "Scheduled refresh and the gateway", "Sharing, and who can see what"],
          },
          {
            title: "Reporting Honestly",
            minutes: 18,
            objective: "Avoid the presentation choices that mislead.",
            covers: [
              "Truncated axes and cherry-picked ranges",
              "Showing the denominator, not just the percentage",
              "Saying plainly when data is incomplete",
            ],
          },
        ],
        quiz: [
          {
            prompt: "What does a data gateway do?",
            options: [
              { text: "Lets the cloud service refresh from data held on a local network", correct: true },
              { text: "Controls who can view a report" },
              { text: "Compresses the dataset" },
              { text: "Converts Excel files" },
            ],
          },
          {
            prompt: "Which practices make a report misleading?",
            type: "multiple",
            options: [
              { text: "Starting a bar axis above zero", correct: true },
              { text: "Showing a percentage without the count behind it", correct: true },
              { text: "Choosing a date range that hides a decline", correct: true },
              { text: "Using a slicer" },
            ],
          },
        ],
      },
    ],
  }),

  scaffold({
    slug: "website-design-and-development",
    title: "Website Design and Development",
    categorySlug: CAT,
    courseCode: "HS-WEB-01",
    summary:
      "Build real websites — HTML, CSS and enough JavaScript to be useful — and put them online where people can see them.",
    description: `
This course goes from an empty file to a site on the internet. You write the markup, style it properly, make it work on a phone, and deploy it to a real address.

It covers the two paths a working developer needs: coding a site from scratch, and building one in WordPress, which is what most Pakistani clients will actually ask for. Knowing both is what makes you employable rather than dependent on one tool.

By the end you will have a portfolio of three sites you built and can explain line by line.
`.trim(),
    level: "beginner",
    durationWeeks: 14,
    learningHours: 70,
    prerequisites:
      "Comfortable using a computer and a browser. A laptop or desktop. No coding experience assumed.",
    targetLearners:
      "School and college leavers, career changers, freelancers who want to build sites for local businesses, and anyone maintaining a site they did not build.",
    objectives: [
      "Write valid, semantic HTML and structured CSS.",
      "Build layouts that work on a phone as well as a desktop.",
      "Add interactivity with JavaScript where it genuinely helps.",
      "Build and customise a WordPress site for a client.",
      "Deploy a site, and keep it fast, accessible and secure.",
    ],
    outcomes: [
      "Build a multi-page site from scratch in HTML and CSS.",
      "Use Flexbox and Grid to lay out a page responsively.",
      "Write JavaScript for forms, menus and simple interaction.",
      "Set up WordPress with a theme, pages, menus and a contact form.",
      "Buy a domain, configure hosting, and deploy.",
      "Test a site for accessibility and page speed, and fix what fails.",
    ],
    careers: [
      "Junior Web Developer",
      "WordPress Developer",
      "Front-End Developer",
      "Freelance website builder",
      "Web Content Administrator",
    ],
    skills: ["HTML", "CSS", "Responsive design", "JavaScript", "WordPress", "Deployment"],
    finalProject:
      "Build and deploy a complete site for a real local business — at least four pages, fully responsive, with a working contact form, an accessibility check and a page speed score. Hand over the files and a short guide the owner can follow.",
    resources: [
      { label: "MDN Web Docs", url: "https://developer.mozilla.org/" },
      { label: "WordPress documentation", url: "https://wordpress.org/documentation/" },
    ],
    curriculumSource: SOURCE_NOTE,
    modules: [
      {
        title: "Module 1 — How the Web Works",
        summary: "What actually happens between typing an address and seeing a page.",
        lessons: [
          {
            title: "Browsers, Servers and Addresses",
            minutes: 16,
            preview: true,
            objective: "Understand the journey of a web page.",
            covers: ["Client and server", "Domains, DNS and hosting", "HTTP, HTTPS and why the padlock matters"],
          },
          {
            title: "Setting Up to Build",
            minutes: 18,
            objective: "Get the tools in place and working.",
            covers: ["A code editor and its useful features", "Folder structure for a project", "Developer tools in the browser"],
          },
        ],
        quiz: [
          {
            prompt: "What does DNS do?",
            options: [
              { text: "Translates a domain name into a server address", correct: true },
              { text: "Stores the website's files" },
              { text: "Encrypts the connection" },
              { text: "Compresses images" },
            ],
          },
          {
            prompt: "What does HTTPS add over HTTP?",
            options: [
              { text: "The connection is encrypted", correct: true },
              { text: "Pages load faster" },
              { text: "Better search rankings only" },
              { text: "Nothing of substance" },
            ],
          },
        ],
      },
      {
        title: "Module 2 — HTML and CSS",
        summary: "Structure and appearance — the foundation everything else sits on.",
        lessons: [
          {
            title: "Semantic HTML",
            minutes: 24,
            objective: "Mark up content so its meaning is clear to browsers and screen readers.",
            covers: ["Headings, paragraphs, lists, links, images", "header, nav, main, article, footer", "Forms and labels"],
          },
          {
            title: "CSS Fundamentals",
            minutes: 26,
            objective: "Style a page predictably.",
            covers: ["Selectors and specificity", "The box model", "Colour, type and spacing systems"],
          },
          {
            title: "Flexbox and Grid",
            minutes: 28,
            objective: "Lay out a page without fighting it.",
            covers: ["Flexbox for one dimension", "Grid for two", "Choosing between them"],
          },
          {
            title: "Responsive Design",
            minutes: 24,
            objective: "Make one page work on every screen.",
            covers: ["Mobile-first thinking", "Media queries and relative units", "Testing on a real phone, not a resized window"],
          },
        ],
        quiz: [
          {
            prompt: "Why use <nav> rather than <div class=\"nav\">?",
            options: [
              { text: "It tells assistive software and search engines what the element is", correct: true },
              { text: "It is shorter to type" },
              { text: "It styles itself" },
              { text: "Divs are deprecated" },
            ],
          },
          {
            prompt: "Which is better suited to a two-dimensional page layout?",
            options: [
              { text: "CSS Grid", correct: true },
              { text: "Flexbox" },
              { text: "Floats" },
              { text: "Tables" },
            ],
          },
          {
            prompt: "What does mobile-first mean in practice?",
            options: [
              { text: "Write the small-screen styles first, then add for larger screens", correct: true },
              { text: "Design only for phones" },
              { text: "Build a separate mobile site" },
              { text: "Test on a phone at the end" },
            ],
          },
        ],
        activity: {
          title: "Practical — A responsive page from scratch",
          instructions: `
Build a single page for a real local business, by hand, in HTML and CSS. No frameworks, no templates.

Requirements: semantic markup, a responsive layout using Flexbox or Grid, a working contact form layout, and readable type at every width.

Submit the files plus screenshots at phone, tablet and desktop width, taken on a real phone where you can.
`.trim(),
        },
      },
      {
        title: "Module 3 — JavaScript",
        summary: "Making pages respond, without reaching for a library first.",
        lessons: [
          {
            title: "JavaScript Basics",
            minutes: 26,
            objective: "Read and write simple, correct JavaScript.",
            covers: ["Variables, types, operators", "Conditionals and loops", "Functions"],
          },
          {
            title: "Working With the Page",
            minutes: 24,
            objective: "Change what the user sees in response to what they do.",
            covers: ["Selecting elements", "Events and listeners", "Building a mobile menu and an accordion"],
          },
          {
            title: "Forms and Validation",
            minutes: 22,
            objective: "Handle input without frustrating the user.",
            covers: ["Reading values", "Validating before submitting", "Error messages that say what to do"],
          },
        ],
        quiz: [
          {
            prompt: "Why validate a form in the browser as well as on the server?",
            options: [
              { text: "The browser gives quick feedback; the server is what actually protects the data", correct: true },
              { text: "Browser validation is enough on its own" },
              { text: "Server validation is optional" },
              { text: "It makes the page load faster" },
            ],
          },
          {
            prompt: "What is an event listener?",
            options: [
              { text: "Code that runs when something happens, such as a click", correct: true },
              { text: "A way to load a page faster" },
              { text: "A type of variable" },
              { text: "A CSS feature" },
            ],
          },
        ],
      },
      {
        title: "Module 4 — WordPress and Going Live",
        summary: "What most clients ask for, and how to put a site online properly.",
        lessons: [
          {
            title: "Building a WordPress Site",
            minutes: 28,
            objective: "Deliver a site a non-technical owner can maintain.",
            covers: ["Installing, themes and the block editor", "Pages, menus, and a contact form", "Plugins — and why fewer is better"],
          },
          {
            title: "Domains, Hosting and Deployment",
            minutes: 24,
            objective: "Get the site to a real address.",
            covers: ["Buying a domain in the client's name", "cPanel, file upload, SSL", "Deploying a static site"],
          },
          {
            title: "Speed, Accessibility and Security",
            minutes: 24,
            objective: "Leave the site in a state you would defend.",
            covers: [
              "Image sizes, and what actually makes pages slow",
              "Alt text, contrast, keyboard navigation",
              "Updates, backups, and strong admin passwords",
            ],
          },
        ],
        quiz: [
          {
            prompt: "Whose account should a client's domain be registered in?",
            options: [
              { text: "The client's", correct: true },
              { text: "The developer's" },
              { text: "The host's" },
              { text: "Whoever paid" },
            ],
          },
          {
            prompt: "What most commonly makes a small business site slow?",
            options: [
              { text: "Very large unoptimised images", correct: true },
              { text: "Too much text" },
              { text: "Using CSS Grid" },
              { text: "Having a contact form" },
            ],
          },
          {
            prompt: "Which improve accessibility?",
            type: "multiple",
            options: [
              { text: "Alt text that describes the image", correct: true },
              { text: "Sufficient colour contrast", correct: true },
              { text: "Everything reachable by keyboard", correct: true },
              { text: "Smaller font sizes" },
            ],
          },
        ],
        activity: {
          title: "Practical — Deploy a WordPress site",
          instructions: `
Build and deploy a WordPress site for a real or clearly hypothetical business.

Required: at least four pages, a menu, a working contact form, SSL active, and an accessibility and page-speed check with the failures you fixed listed.

Submit the live URL and a one-page handover guide written for the owner, not for a developer.
`.trim(),
        },
      },
    ],
  }),

  scaffold({
    slug: "video-production",
    title: "Video Production",
    categorySlug: CAT,
    courseCode: "HS-VID-01",
    summary:
      "Plan, shoot and edit video that people watch to the end — with a phone, a laptop and free software.",
    description: `
Video is the format most businesses now need and least know how to make. The equipment barrier has gone: a recent phone shoots better footage than broadcast cameras did twenty years ago. What separates good from bad is planning, light, sound and editing.

This course covers all four, plus the practical craft of delivering for different platforms — vertical for social, horizontal for YouTube, subtitled for people watching without sound.

You will finish with three completed pieces: a short business promo, an interview, and a social cut.
`.trim(),
    level: "beginner",
    durationWeeks: 10,
    learningHours: 50,
    prerequisites:
      "A smartphone with a working camera, and a laptop or desktop able to run free editing software. No prior experience.",
    targetLearners:
      "Content creators, social media staff, small business owners making their own material, and anyone moving towards freelance video work.",
    objectives: [
      "Plan a video before filming, rather than fixing it afterwards.",
      "Shoot stable, well-lit footage with clean sound on modest equipment.",
      "Edit to a structure that holds attention.",
      "Deliver correctly for each platform.",
      "Work to a client brief and revise professionally.",
    ],
    outcomes: [
      "Write a brief, script and shot list.",
      "Light a subject using daylight and one inexpensive source.",
      "Record usable audio and know why it matters more than picture.",
      "Edit in free software: cut, trim, transitions, titles, colour, audio levels.",
      "Add subtitles and export for YouTube, Instagram and TikTok.",
      "Deliver a finished piece to a brief, on time.",
    ],
    careers: [
      "Video Editor",
      "Content Creator",
      "Social Media Video Producer",
      "Freelance videographer",
      "Marketing Assistant (video)",
    ],
    skills: ["Scripting", "Camera work", "Lighting", "Audio", "Editing", "Subtitling", "Export"],
    finalProject:
      "Produce a 60–90 second promotional video for a real local business, from brief to delivery: script, shot list, footage you filmed, edit, subtitles, and exports for two platforms. Include the client's feedback and what you changed.",
    resources: [
      { label: "DaVinci Resolve (free edition)", url: "https://www.blackmagicdesign.com/products/davinciresolve" },
      { label: "CapCut", url: "https://www.capcut.com/" },
    ],
    curriculumSource: SOURCE_NOTE,
    modules: [
      {
        title: "Module 1 — Planning",
        summary: "The part that decides whether the shoot goes well.",
        lessons: [
          {
            title: "Brief, Idea and Audience",
            minutes: 16,
            preview: true,
            objective: "Know what the video must achieve before picking up a camera.",
            covers: ["What is it for, who watches, what should they do", "Length by platform", "Agreeing the brief in writing"],
          },
          {
            title: "Scripting and Storyboarding",
            minutes: 22,
            objective: "Plan the piece shot by shot.",
            covers: ["Writing for the ear, not the page", "The first three seconds", "Shot lists and rough storyboards"],
          },
        ],
        quiz: [
          {
            prompt: "Why does the first three seconds matter so much?",
            options: [
              { text: "Most viewers decide there whether to keep watching", correct: true },
              { text: "Platforms only index the opening" },
              { text: "It is a technical requirement" },
              { text: "It does not particularly matter" },
            ],
          },
          {
            prompt: "What should a brief establish?",
            type: "multiple",
            options: [
              { text: "What the video is for", correct: true },
              { text: "Who the audience is", correct: true },
              { text: "What the viewer should do afterwards", correct: true },
              { text: "Which camera brand to use" },
            ],
          },
        ],
      },
      {
        title: "Module 2 — Shooting",
        summary: "Camera, light and sound — in that order of learning, reverse order of importance.",
        lessons: [
          {
            title: "Camera and Composition",
            minutes: 24,
            objective: "Frame and expose a shot deliberately.",
            covers: ["Framing, headroom, rule of thirds", "Locking focus and exposure on a phone", "Stability: bracing, tripods, gimbals"],
          },
          {
            title: "Lighting",
            minutes: 22,
            objective: "Light a subject with what you have.",
            covers: ["Daylight through a window as your main source", "Key, fill and background", "Avoiding overhead light and mixed colour"],
          },
          {
            title: "Sound",
            minutes: 22,
            objective: "Record audio people can listen to.",
            covers: [
              "Why bad sound loses viewers faster than bad picture",
              "Microphone options at every budget",
              "Room noise, echo, and recording a room tone",
            ],
          },
        ],
        quiz: [
          {
            prompt: "Which fault makes viewers leave fastest?",
            options: [
              { text: "Poor audio", correct: true },
              { text: "Slightly soft focus" },
              { text: "Plain background" },
              { text: "No music" },
            ],
          },
          {
            prompt: "Where should your main light usually be?",
            options: [
              { text: "In front of the subject — a window they face", correct: true },
              { text: "Directly behind the subject" },
              { text: "Directly overhead" },
              { text: "Beside the camera lens, pointing at the wall" },
            ],
          },
          {
            prompt: "Why lock focus and exposure before recording on a phone?",
            options: [
              { text: "Otherwise they shift mid-shot and the footage is unusable", correct: true },
              { text: "It saves battery" },
              { text: "It records at higher resolution" },
              { text: "It is required for vertical video" },
            ],
          },
        ],
        activity: {
          title: "Practical — Three shots, one subject",
          instructions: `
Film the same subject three ways: wide, medium and close. Use daylight only.

Submit the three clips plus a photograph of your setup showing where the light and camera were, and two sentences on what you would change.
`.trim(),
        },
      },
      {
        title: "Module 3 — Editing",
        summary: "Where the piece is actually made.",
        lessons: [
          {
            title: "The Edit Timeline",
            minutes: 26,
            objective: "Assemble footage into a coherent piece.",
            covers: ["Importing and organising clips", "Cutting, trimming, ordering", "Why most cuts should be invisible"],
          },
          {
            title: "Titles, Colour and Audio",
            minutes: 24,
            objective: "Finish the piece so it looks and sounds deliberate.",
            covers: ["Readable titles and lower thirds", "Basic colour correction", "Levelling audio and music under speech"],
          },
          {
            title: "Subtitles and Accessibility",
            minutes: 20,
            objective: "Make the video work with the sound off.",
            covers: ["Burned-in versus uploaded captions", "Timing and line length", "Checking auto-generated text — it will be wrong"],
          },
        ],
        quiz: [
          {
            prompt: "Why do most social videos need subtitles?",
            options: [
              { text: "Most people watch with the sound off", correct: true },
              { text: "Platforms require them" },
              { text: "They improve video quality" },
              { text: "They replace the need for good audio" },
            ],
          },
          {
            prompt: "What should music do under speech?",
            options: [
              { text: "Sit well below it, supporting without competing", correct: true },
              { text: "Match the speech in volume" },
              { text: "Be louder in the important parts" },
              { text: "Always be absent" },
            ],
          },
        ],
      },
      {
        title: "Module 4 — Delivery and Working With Clients",
        summary: "Exporting correctly, and handling the part after the edit.",
        lessons: [
          {
            title: "Exporting for Each Platform",
            minutes: 20,
            objective: "Deliver files that look right where they are posted.",
            covers: ["Vertical, square and horizontal", "Resolution, frame rate, file size", "One master, several exports"],
          },
          {
            title: "Revisions and Handover",
            minutes: 20,
            objective: "Manage the client relationship without losing money.",
            covers: [
              "Agreeing how many rounds of revision are included",
              "Taking feedback with timecodes, not vague impressions",
              "Delivering files and archiving the project",
            ],
          },
          {
            title: "Music, Footage and the Law",
            minutes: 18,
            objective: "Avoid handing a client a legal problem.",
            covers: [
              "Why a popular song will get the video muted or removed",
              "Licensed and royalty-free sources, and reading the licence",
              "Permission to film people, and filming children",
            ],
          },
        ],
        quiz: [
          {
            prompt: "A client wants a chart-topping song under their promo. What do you tell them?",
            options: [
              { text: "It will likely be muted or taken down, and licensed music is the alternative", correct: true },
              { text: "It is fine for business use" },
              { text: "It is fine if credited" },
              { text: "It is fine if under 30 seconds" },
            ],
          },
          {
            prompt: "Why agree revision rounds before starting?",
            options: [
              { text: "Otherwise revisions continue indefinitely and the job becomes unpaid work", correct: true },
              { text: "Platforms require it" },
              { text: "It speeds up rendering" },
              { text: "It is not necessary" },
            ],
          },
        ],
        activity: {
          title: "Practical — Deliver to a brief",
          instructions: `
Take a real brief from a business, friend or family member.

Deliver: a 60-second video, subtitled, exported vertical and horizontal, plus the written brief you agreed and one round of documented feedback with what you changed.

Marks are for the process as much as the film.
`.trim(),
        },
      },
    ],
  }),
];
