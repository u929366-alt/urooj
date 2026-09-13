import type { CourseContent } from "./types.ts";

/**
 * Structured along the lines of NAVTTC's published Digital Marketing trade —
 * fundamentals, website, SEO, paid search, social, content, email, analytics,
 * then earning from it — but written here from scratch.
 *
 * `recognition` is deliberately "hunarsaaz". Change it to "navttc_aligned"
 * only once someone has read NAVTTC's curriculum document for this trade and
 * confirmed the modules match, and to "navttc_recognised" only if Hunarsaaz
 * holds the accreditation on paper. A student reads this as what their
 * certificate is worth.
 */
export const digitalMarketing: CourseContent = {
  slug: "digital-marketing",
  title: "Digital Marketing",
  summary:
    "Learn to market a business online — search, social, content, email and paid ads — and to prove what your work earned. Built for Pakistani businesses and freelance clients.",
  description: `
Almost every small business in Pakistan now sells, or wants to sell, through a screen. Very few know how. That gap is the job this course trains you for.

You will start from what digital marketing actually is, build a presence worth sending people to, then learn each channel in turn: search engine optimisation, Google Ads, the social platforms that matter here, content, and email. The last two modules cover the part most courses skip — measuring whether any of it worked, and getting paid for doing it.

Every module ends with a quiz, and most with a practical assignment marked by your instructor. By the end you will have a portfolio of real work: an audited website, a keyword plan, a content calendar, a live campaign and a results report.

No prior marketing knowledge is assumed. If you can use a browser and type, you can start.
`.trim(),

  sector: "Information Technology",
  courseCode: "HS-DM-01",
  nvqfLevel: "2",
  recognition: "hunarsaaz",

  level: "beginner",
  language: "both",
  durationWeeks: 12,
  price: 0,
  programSlug: "digital-marketing",

  prerequisites:
    "None beyond basic computer use — opening a browser, typing, and managing files. A laptop or desktop with a reliable internet connection is needed for the practical work; a phone alone is not enough.",
  targetLearners:
    "School and college leavers looking for a first skill that earns, small business owners who want to sell online themselves, and anyone moving into freelance work. Suitable for complete beginners.",

  objectives: [
    "Explain how the digital marketing channels fit together, and when each one is the right choice.",
    "Plan and run campaigns on search, social and email against a stated goal and budget.",
    "Write and design content that a specific audience will actually read and act on.",
    "Measure results with analytics, and report honestly on what worked and what did not.",
    "Find and keep paying clients as a freelancer or in-house marketer.",
  ],
  outcomes: [
    "Audit a website or page and list what is stopping it from converting visitors.",
    "Build a keyword plan and apply on-page SEO to a real site.",
    "Set up, run and optimise a Google Ads search campaign within a set budget.",
    "Produce a month's social media content calendar and the posts to fill it.",
    "Write email sequences that get opened and get replies.",
    "Read Google Analytics and Search Console, and turn the numbers into a client report.",
    "Price your work, write a proposal and deliver a campaign end to end.",
  ],
  careers: [
    "Digital Marketing Executive",
    "Social Media Manager",
    "SEO Executive",
    "Paid Ads (PPC) Specialist",
    "Content Marketing Assistant",
    "Email Marketing Executive",
    "Freelance Digital Marketer on Upwork or Fiverr",
    "Marketing support for a family or small business",
  ],

  modules: [
    {
      title: "Module 1 — Foundations of Digital Marketing",
      summary: "What digital marketing is, the channels available, and who you are selling to.",
      lessons: [
        {
          title: "What Is Digital Marketing?",
          minutes: 15,
          preview: true,
          video: { search: "what is digital marketing explained for beginners 2026" },
          body: `
## The short answer

Digital marketing is every way a business reaches people through a connected screen — search results, social feeds, email, video, messaging apps, and ads on all of them.

## Why it replaced so much traditional marketing

A billboard on GT Road is seen by everyone who drives past, and you have no idea who they were or whether any of them bought anything. A Facebook ad can be shown only to women aged 25–40 in Rawalpindi who have looked at furniture recently, and you will know exactly how many clicked, how many bought, and what each sale cost you.

That is the real shift: **targeting** and **measurement**. Not that digital is cheaper — often it is not — but that you can see what your money did.

## The channels you will learn

- **SEO** — earns free traffic from Google, over months
- **Paid search** — buys traffic from Google today
- **Social media** — builds an audience and sells to it
- **Content** — gives people a reason to trust you
- **Email** — sells repeatedly to people who already know you
- **Analytics** — tells you which of the above is working

## What this means for you

Most Pakistani small businesses use one or two of these badly. Someone who can use all six properly is worth hiring. That is the position this course puts you in.
`.trim(),
        },
        {
          title: "The Digital Marketing Ecosystem",
          minutes: 18,
          video: { search: "digital marketing channels owned earned paid media explained" },
          body: `
## Owned, earned and paid

Every channel falls into one of three buckets, and confusing them is the most common beginner mistake.

**Owned media** is what you control: your website, your email list, your WhatsApp Business account. Nobody can take it away or change the rules on you. It is slow to build and worth the most.

**Earned media** is what others give you: a share, a review, a mention, a ranking in Google's results. Free, credible, and largely out of your hands.

**Paid media** is what you rent: ads on Google, Meta, TikTok, YouTube. Instant, predictable, and it stops the moment you stop paying.

## How they feed each other

A healthy business uses all three in a loop. Paid ads bring the first visitors. Good content earns shares and rankings. Both push people onto your owned email list, which you can sell to for free, forever.

A business that only runs ads has rented an audience. The day the budget stops, so does the business.

## The funnel

People do not go from stranger to customer in one step. They move through **awareness** (they learn you exist), **consideration** (they compare you), and **decision** (they buy). Different channels suit different stages — this is why "which channel is best?" has no answer without asking "best for what?"
`.trim(),
        },
        {
          title: "Traditional vs Digital Marketing",
          minutes: 12,
          video: { search: "traditional vs digital marketing differences comparison" },
          body: `
## Where traditional still wins

It is fashionable to dismiss print, radio and billboards. Do not. For a shop whose customers live within two kilometres, a well-placed banner and a loudspeaker announcement can beat any Facebook campaign, at a fraction of the effort.

Traditional media still has reach that digital struggles with: older customers, rural areas with patchy data, and trust built by physical presence.

## Where digital wins

- **Cost of entry.** You can test an idea for a thousand rupees.
- **Targeting.** By age, city, language, interest, past behaviour.
- **Measurement.** Every rupee traced to a result.
- **Speed of change.** A failing ad can be rewritten in five minutes.
- **Two-way.** Customers reply, review and complain — which is uncomfortable and extremely useful.

## The honest comparison

- **Cost to start** — traditional is high, digital is low
- **Targeting** — traditional is broad, digital is precise
- **Measurement** — traditional is estimated, digital is exact
- **Making changes** — traditional is slow and costly, digital is instant
- **Trust** — traditional is often higher; digital has to be earned

## In practice

Most successful local businesses run both. The skill is knowing which job each tool does — not declaring one obsolete.
`.trim(),
        },
        {
          title: "Understanding the Digital Consumer",
          minutes: 20,
          video: { search: "consumer buyer journey digital marketing awareness consideration decision" },
          body: `
## Nobody is waiting for your advert

Assume every person you reach is busy, sceptical, and one thumb-flick from something more interesting. You have roughly two seconds.

## The buying journey

A customer passes through predictable stages, and marketing that ignores where they are will fail:

1. **Problem aware** — "my shop's sales are dropping"
2. **Solution aware** — "maybe I need to be on Instagram"
3. **Product aware** — "who runs Instagram pages for shops?"
4. **Most aware** — "should I hire this person or that one?"

Sending a "BUY NOW, 50% OFF" message to someone at stage one is wasted. They do not yet know they need you.

## Building a buyer persona

Write down, for one real customer type:

- Age, city, language they read in
- What they are trying to achieve
- What is stopping them
- Where they spend time online
- What would make them distrust you

Give them a name. Every piece of content you write from then on is written to that one person, not to "the market".

## A Pakistani note

Language matters more than most courses admit. Urdu, Roman Urdu and English each signal something different, and the wrong choice quietly loses you the audience you wanted. Test, do not assume.
`.trim(),
        },
      ],
      quiz: {
        title: "Module 1 Quiz — Foundations",
        description: "Eight questions on channels, media types and the buying journey.",
        passingScore: 60,
        questions: [
          {
            prompt: "Which of these is an example of owned media?",
            options: [
              { text: "Your business's email subscriber list", correct: true },
              { text: "A Google Ads search campaign" },
              { text: "A customer's review on Facebook" },
              { text: "A newspaper advertisement" },
            ],
            explanation:
              "You control your email list outright. Ads are rented, and reviews are given by others.",
          },
          {
            prompt: "What are the two things digital marketing offers that a billboard cannot?",
            type: "multiple",
            options: [
              { text: "Precise targeting of who sees it", correct: true },
              { text: "Exact measurement of results", correct: true },
              { text: "Guaranteed higher sales" },
              { text: "Lower cost in every case" },
            ],
            explanation:
              "Targeting and measurement are the real differences. Digital is not automatically cheaper, and nothing guarantees sales.",
          },
          {
            prompt:
              "A shopkeeper says 'sales are falling but I don't know why'. Which stage of awareness is this?",
            options: [
              { text: "Problem aware", correct: true },
              { text: "Solution aware" },
              { text: "Product aware" },
              { text: "Most aware" },
            ],
            explanation:
              "They have identified a problem but not yet a type of solution. A hard-sell offer would be wasted here.",
          },
          {
            prompt: "Why is a business that relies only on paid ads in a weak position?",
            options: [
              { text: "The audience disappears the moment the budget stops", correct: true },
              { text: "Paid ads cannot be measured" },
              { text: "Paid ads are always more expensive than SEO" },
              { text: "Google does not allow it" },
            ],
            explanation:
              "Paid media is rented. Owned media — a list, a site, an audience — is what survives a bad month.",
          },
          {
            prompt: "Which of these belongs to earned media?",
            options: [
              { text: "A customer sharing your post", correct: true },
              { text: "Your WhatsApp Business account" },
              { text: "A sponsored Instagram post" },
              { text: "Your company website" },
            ],
          },
          {
            prompt: "What is the main purpose of writing a buyer persona?",
            options: [
              { text: "So every piece of content is written to one specific person", correct: true },
              { text: "To satisfy a requirement in marketing textbooks" },
              { text: "To calculate the advertising budget" },
              { text: "To choose the company's brand colours" },
            ],
          },
          {
            prompt: "Which statements about traditional marketing are true?",
            type: "multiple",
            options: [
              { text: "It can out-perform digital for a purely local shop", correct: true },
              { text: "It reaches customers with poor internet access", correct: true },
              { text: "It is obsolete and should never be used" },
              { text: "Its results are easy to measure exactly" },
            ],
          },
          {
            prompt:
              "In the funnel, a person comparing three suppliers before choosing is at which stage?",
            options: [
              { text: "Consideration", correct: true },
              { text: "Awareness" },
              { text: "Decision" },
              { text: "Retention" },
            ],
          },
        ],
      },
      assignment: {
        title: "Assignment 1 — Buyer persona and channel plan",
        maxPoints: 100,
        instructions: `
Pick **one real business** you know — a family shop, a relative's workshop, a salon, a tuition centre. Do not invent one.

Submit a document of no more than two pages containing:

1. **The business** — what it sells, where, and to whom. Three sentences.
2. **One buyer persona** — name, age, city, language, what they want, what stops them, where they spend time online.
3. **A channel plan** — choose **three** channels from the six covered in Module 1. For each, say in two sentences why that channel suits this business and this persona, and which funnel stage it serves.
4. **One channel you rejected**, and why. This carries as many marks as the three you chose.

Marks are for reasoning, not length. "Instagram because everyone uses Instagram" earns nothing. "Instagram because the persona is a 26-year-old woman in Rawalpindi choosing a salon on the strength of photographs" earns full marks.

Submit as PDF or Word.
`.trim(),
      },
    },

    {
      title: "Module 2 — Your Online Home",
      summary:
        "The website or page you send traffic to, and why most of them waste the traffic they get.",
      lessons: [
        {
          title: "Why Every Campaign Needs a Destination",
          minutes: 14,
          video: { search: "landing page vs homepage conversion explained beginners" },
          body: `
## Traffic without a destination is wasted money

The most common mistake in Pakistani small-business marketing: spend twenty thousand rupees driving people to a Facebook page with no phone number, no prices, and a last post from 2023.

Every campaign needs somewhere to land, and that place has one job — turn a visitor into an enquiry, an order, or a subscriber.

## Homepage or landing page?

A **homepage** serves everyone. It has a menu, an about section, a gallery, contact details. It is a reception desk.

A **landing page** serves one campaign. One offer, one message, one button, no menu to wander off into. It is a sales counter.

If you run an ad for bridal makeup packages, sending clicks to the salon homepage loses most of them. Sending them to a page about bridal makeup packages does not.

## What a destination must have

- What you are offering, in the first sentence
- Who it is for
- Proof: photos of real work, real reviews, real names
- The price, or an honest reason there isn't one
- One obvious next step
- A working phone number and WhatsApp link

## The two-second test

Show the page to someone for two seconds, then hide it. Ask what the business sells. If they cannot say, the page has failed, and no amount of advertising budget will rescue it.
`.trim(),
        },
        {
          title: "Building a Site Without Writing Code",
          minutes: 22,
          video: { search: "build business website WordPress no code beginners tutorial" },
          body: `
## You do not need to be a developer

For most small businesses, a hand-coded website is the wrong answer — slower to build, harder to change, and more expensive to maintain. Learn one builder well.

## The realistic options

**WordPress** — runs a large share of the web. Cheap hosting, endless themes and plugins, and the skill is in demand from clients. Steeper to learn and needs maintaining.

**Wix or Squarespace** — drag and drop, hosting included, almost nothing to break. Less flexible and you pay monthly, forever.

**Shopify** — if the business sells products and needs a cart, stock and payments, start here rather than bolting a shop onto something else.

**A single landing page tool** — for one campaign, a one-page builder is often enough and takes an afternoon.

## What to decide before you build

1. What is the one action a visitor should take?
2. What proof do you have that you are worth trusting?
3. Which pages do you genuinely need? Usually four: home, services, work, contact.

## A caution about domains

Buy the domain in the **client's** name, on the client's account, and give them the login. A freelancer who holds a client's domain hostage — even accidentally, by leaving the country or losing a password — destroys their own reputation. Charge for the work, not for control of the asset.
`.trim(),
        },
        {
          title: "Writing Pages That Convert",
          minutes: 18,
          video: { search: "landing page copywriting formula headline call to action" },
          body: `
## Structure beats cleverness

A page that converts follows a shape that has been tested to death:

1. **Headline** — the promise, in plain words
2. **Sub-headline** — who it is for and how it works
3. **Proof** — photos, reviews, numbers, names
4. **What you get** — the offer, itemised
5. **Objection handling** — the reasons people say no, answered
6. **Call to action** — one button, repeated

## Write for the reader, not the owner

Business owners want to write "We are a leading provider of quality solutions." Nobody has ever bought anything because of that sentence.

Write what the customer gets: "Bridal makeup at your home in Rawalpindi. Trial included. From Rs 15,000."

## Headlines that work

- Be specific. "Increase sales" is noise. "Fill your salon's Tuesday mornings" is a promise.
- Name the customer. "For tailors in Taxila" beats "for everyone".
- Use their words, not industry words. Read the WhatsApp messages your client actually receives.

## The call to action

One action per page. "Call us, or email, or visit, or fill this form, or follow us" gives the reader a decision to make, and the easiest decision is to leave.

Make the button say what happens next: **Book a free trial**, not **Submit**.
`.trim(),
        },
        {
          title: "Mobile, Speed and Accessibility",
          minutes: 16,
          video: { search: "mobile first web design page speed optimization basics" },
          body: `
## Most of your visitors are on a phone

In Pakistan the overwhelming majority of web traffic is mobile, often on a patchy connection and a modest handset. Design for that first and the desktop version takes care of itself.

Check every page by actually opening it on a phone. Not by resizing the browser — on a phone, on mobile data, with the screen brightness where a real person has it.

## Speed is a feature

A page that takes eight seconds to load has lost most of its visitors before they see it. The usual culprits:

- **Enormous images.** A 4 MB photo from a phone camera, uploaded untouched. Resize to the size it displays at, and compress.
- **Too many plugins.** Each one adds weight. Remove what you do not use.
- **Video backgrounds.** Almost never worth what they cost in load time.

Test with Google PageSpeed Insights and fix what it lists, in order.

## Accessibility, briefly

Some of your visitors cannot see the screen well, or at all.

- Give every image alt text that says what it shows
- Keep text and background contrast strong — pale grey on white fails
- Make buttons big enough to hit with a thumb
- Label form fields properly

This is not charity. Search engines read the same signals, and a page that is easy for a screen reader is easy for Google.
`.trim(),
        },
      ],
      quiz: {
        title: "Module 2 Quiz — Your Online Home",
        passingScore: 60,
        questions: [
          {
            prompt: "What is the main difference between a homepage and a landing page?",
            options: [
              { text: "A landing page serves one campaign with one action; a homepage serves everyone", correct: true },
              { text: "A landing page is always shorter" },
              { text: "A homepage cannot contain a contact form" },
              { text: "Landing pages do not need to work on mobile" },
            ],
          },
          {
            prompt: "Whose name should a client's domain be registered in?",
            options: [
              { text: "The client's", correct: true },
              { text: "The freelancer's, for safekeeping" },
              { text: "The hosting company's" },
              { text: "Whoever paid for it" },
            ],
            explanation:
              "Holding a client's domain — even with good intentions — puts you in a position no professional wants to be in.",
          },
          {
            prompt: "Which of these commonly make a page slow?",
            type: "multiple",
            options: [
              { text: "Images uploaded straight from a phone camera", correct: true },
              { text: "Unused plugins", correct: true },
              { text: "Video backgrounds", correct: true },
              { text: "Writing the page in plain language" },
            ],
          },
          {
            prompt: "How many calls to action should a landing page have?",
            options: [
              { text: "One, repeated", correct: true },
              { text: "As many as possible, to give choice" },
              { text: "Exactly three" },
              { text: "None — let the visitor decide" },
            ],
          },
          {
            prompt: "Which headline is stronger for a salon?",
            options: [
              { text: "Fill your salon's Tuesday mornings", correct: true },
              { text: "A leading provider of quality beauty solutions" },
              { text: "Welcome to our website" },
              { text: "Increase your sales today" },
            ],
          },
          {
            prompt: "Why does accessibility also help search rankings?",
            options: [
              { text: "Search engines read the same structure and alt text that assistive software does", correct: true },
              { text: "Google gives a discount on ads for accessible sites" },
              { text: "It does not — they are unrelated" },
              { text: "Accessible sites are always faster" },
            ],
          },
        ],
      },
      assignment: {
        title: "Assignment 2 — Landing page audit",
        maxPoints: 100,
        instructions: `
Find a **real website** of a small business in Pakistan. Any sector. Do not use a large brand, and do not build anything yourself for this task.

Submit a document containing:

1. **The two-second test.** Screenshot the top of the page as it appears on a phone. State what a stranger would think the business sells, and whether that is correct.
2. **The six-part structure.** Go through headline, sub-headline, proof, offer, objections, call to action. For each, say whether it is present and quote it if so.
3. **Three specific faults**, with a rewritten version of each. "The headline is bad" earns nothing. "The headline says *Welcome to our website*; it should say *Custom kitchen cabinets built in Taxila, delivered in three weeks*" earns full marks.
4. **Speed.** Run the page through Google PageSpeed Insights on mobile. Give the score and the top three things it asks you to fix.

Two to four pages. Include the URL you audited.
`.trim(),
      },
    },

    {
      title: "Module 3 — Search Engine Optimisation",
      summary: "Earning a place in Google's results, and the keyword research that decides which one.",
      lessons: [
        {
          title: "How Search Engines Actually Work",
          minutes: 18,
          video: { search: "how google search works crawling indexing ranking explained" },
          body: `
## Three steps, not magic

**Crawling.** Google's software follows links around the web, reading pages. If nothing links to your page and you never tell Google it exists, it may never be found.

**Indexing.** What it reads gets stored and understood — what the page is about, what language it is in, whether it is a shop, an article, a recipe.

**Ranking.** When somebody searches, Google orders the indexed pages by how well each answers *that particular* query.

## What ranking is really judging

Reduced to essentials, three things:

- **Relevance.** Does this page answer the question asked?
- **Authority.** Do other sites treat this one as worth linking to?
- **Experience.** Does it load, work on a phone, and not attack the reader with pop-ups?

## What does not work any more

Stuffing a page with the same phrase forty times. Buying a thousand links from a Fiverr seller. Hiding white text on a white background. These worked fifteen years ago, and now they get sites removed.

## The honest timeline

SEO is slow. A new site competing for a common term may see nothing for six months. Anyone promising page one in two weeks is either buying ads and calling it SEO, or lying. Say this to clients before they hire you, not after.
`.trim(),
        },
        {
          title: "Keyword Research",
          minutes: 25,
          video: { search: "keyword research tutorial google keyword planner search intent" },
          body: `
## Start from what people type, not what you sell

The business calls it "bespoke joinery". The customer types "wood almari price in rawalpindi". You must rank for what the customer types.

## Search intent

Every query carries an intention, and matching it matters more than volume:

- **Informational** — "how to clean a carpet". They want to learn, not buy.
- **Navigational** — "hunarsaaz taxila". They want a specific place.
- **Commercial** — "best carpet cleaner rawalpindi". They are comparing.
- **Transactional** — "carpet cleaning service near me price". They are ready.

A page aimed at the wrong intent will not rank, however good it is.

## Building a keyword list

1. Write down every phrase the business's customers actually use. Ask the shopkeeper. Read the WhatsApp enquiries.
2. Put each into Google and read the autocomplete suggestions and the "People also ask" box.
3. Check the bottom of the results page for related searches.
4. Run the list through Google Keyword Planner for rough volumes.

## Pick winnable fights

"Digital marketing" is contested by the entire world. "Digital marketing training in Taxila" is contested by almost nobody, and the handful of people searching it are exactly who you want.

Long, specific phrases convert better and rank faster. Start there and work up.
`.trim(),
        },
        {
          title: "On-Page SEO",
          minutes: 20,
          video: { search: "on page seo title tag meta description header tags tutorial" },
          body: `
## The parts of a page Google reads first

**Title tag.** The blue line in the results. Around 55–60 characters, with the main keyword near the front and something that makes a human want to click.

**Meta description.** The grey text underneath. Not a ranking factor directly, but it decides whether anyone clicks. Around 150 characters, and write it as an advert, not a summary.

**Headings.** One H2 per section, in a sensible order. They tell both Google and the reader how the page is organised.

**URL.** Short, readable, hyphenated — /carpet-cleaning-rawalpindi, not /page?id=4471.

**Image alt text.** Describe the image honestly. It helps accessibility, image search, and pages where photos fail to load.

## Content itself

Answer the question the keyword asked, properly, in the first screen. Do not make the reader scroll past three paragraphs of throat-clearing.

Use the keyword naturally — in the title, the first paragraph, one heading, and wherever it genuinely fits. Repeating it mechanically reads badly to humans and is detected by Google.

## Internal links

Link from each page to other relevant pages on the same site, with link text that says where it goes. This spreads authority around your site and helps Google understand how the pages relate.
`.trim(),
        },
        {
          title: "Local SEO and Google Business Profile",
          minutes: 18,
          video: { search: "google business profile local seo optimization tutorial" },
          body: `
## The highest-value SEO for most Pakistani businesses

If a business serves customers in one city, Google Business Profile matters more than its website. It is what produces the map pack — the three businesses shown above the normal results with photographs, opening hours and a call button.

It is free, and most competitors have filled it in badly or not at all.

## Getting it right

- **Exact category.** "Beauty salon" and "Hair salon" surface for different searches. Pick deliberately.
- **Name, address, phone.** Identical everywhere they appear online — website, Facebook, directories. Inconsistency confuses Google.
- **Hours**, including holidays. Nothing loses a customer faster than a wasted journey.
- **Photographs.** Twenty real ones, updated. Not stock images.
- **Products and services**, with prices where possible.

## Reviews

Reviews are the largest factor in local ranking and the largest factor in whether a human chooses you.

- Ask every satisfied customer, immediately, in person or by WhatsApp
- Reply to every review, including the bad ones, calmly and in public
- Never buy reviews. Google detects patterns and suspends profiles, and the suspension is far more expensive than the reviews were worth

## Local content

A page for each area served — "carpet cleaning in Wah Cantt", "in Taxila", "in Hasan Abdal" — works, but only if each page says something genuinely different. Ten identical pages with the place name swapped is a spam pattern.
`.trim(),
        },
        {
          title: "Links, Authority and Technical Basics",
          minutes: 20,
          video: { search: "backlinks seo link building beginners white hat" },
          body: `
## Links are votes

A link from another site is a vote of confidence, and Google counts them. One link from a respected local news site outweighs hundreds from link farms.

## How to earn them honestly

- **Be listed** where your business genuinely belongs: chambers of commerce, trade bodies, supplier directories, university pages
- **Local press.** A genuine story — a training graduation, a community project — is worth pitching
- **Partners and suppliers.** Ask the businesses you already work with
- **Write something worth citing.** Original numbers, a useful guide, a template people download

## What to refuse

Bought links, link exchange schemes, comment spam, and private blog networks. These carry a real risk of a penalty that takes months to undo, and clients blame you, correctly.

## Technical basics worth knowing

- **Sitemap.xml** — a list of your pages, submitted in Google Search Console so nothing is missed
- **Robots.txt** — tells crawlers what to ignore. Misconfigured, it can hide an entire site by accident
- **HTTPS** — required. A browser warning on a payment page ends the sale
- **Canonical tags** — tell Google which version of a duplicated page counts
- **Search Console** — free, and the only place you see what you actually rank for

Set up Search Console on day one of any engagement. Without it you are guessing.
`.trim(),
        },
      ],
      quiz: {
        title: "Module 3 Quiz — Search Engine Optimisation",
        passingScore: 60,
        questions: [
          {
            prompt: "Put the three stages of search in order.",
            options: [
              { text: "Crawling, indexing, ranking", correct: true },
              { text: "Indexing, crawling, ranking" },
              { text: "Ranking, crawling, indexing" },
              { text: "Crawling, ranking, indexing" },
            ],
          },
          {
            prompt: "Someone searches 'best carpet cleaner rawalpindi'. What is the intent?",
            options: [
              { text: "Commercial — they are comparing options", correct: true },
              { text: "Informational" },
              { text: "Navigational" },
              { text: "Transactional" },
            ],
          },
          {
            prompt: "Why target a long, specific phrase rather than a broad one?",
            type: "multiple",
            options: [
              { text: "Far less competition, so it is winnable", correct: true },
              { text: "The searchers are closer to buying", correct: true },
              { text: "Google charges less for long keywords" },
              { text: "Short keywords are against the rules" },
            ],
          },
          {
            prompt: "A client asks for page one within two weeks for a competitive term. What is the honest answer?",
            options: [
              { text: "SEO does not work on that timescale; paid ads can buy visibility meanwhile", correct: true },
              { text: "Agree, then buy links to speed it up" },
              { text: "Agree, and run ads without telling them it is not SEO" },
              { text: "Promise it and explain later if it fails" },
            ],
            explanation:
              "Selling a timeline you cannot meet costs you the client and your reputation. Say it before they hire you.",
          },
          {
            prompt: "Which of these is the biggest factor in local map rankings?",
            options: [
              { text: "Reviews", correct: true },
              { text: "The age of the website's domain" },
              { text: "How many pages the website has" },
              { text: "The colour scheme of the logo" },
            ],
          },
          {
            prompt: "What is the risk of buying backlinks?",
            options: [
              { text: "A penalty that can take months to recover from", correct: true },
              { text: "Nothing — it is standard practice" },
              { text: "The links simply do not count" },
              { text: "Google charges a fee" },
            ],
          },
          {
            prompt: "Which are legitimate ways to earn links?",
            type: "multiple",
            options: [
              { text: "Listings in genuine trade bodies and directories", correct: true },
              { text: "Local press coverage of a real story", correct: true },
              { text: "Publishing original research worth citing", correct: true },
              { text: "Posting your URL in blog comments" },
            ],
          },
          {
            prompt: "Which file, if misconfigured, can accidentally hide an entire site from Google?",
            options: [
              { text: "robots.txt", correct: true },
              { text: "sitemap.xml" },
              { text: "index.html" },
              { text: "style.css" },
            ],
          },
        ],
      },
      assignment: {
        title: "Assignment 3 — Keyword plan and on-page fixes",
        maxPoints: 100,
        instructions: `
Use the **same business** you audited in Assignment 2.

Submit:

1. **A keyword list of at least fifteen phrases**, in a table with four columns: the phrase, its intent (informational / navigational / commercial / transactional), rough monthly volume from Keyword Planner, and how hard you judge it to be. Say where each phrase came from — autocomplete, People Also Ask, the shopkeeper.
2. **Your three chosen targets**, and why. At least one must be a long, specific, winnable phrase.
3. **A rewritten title tag and meta description** for the home page and two other pages. Count your characters and state them.
4. **The Google Business Profile.** Find the business on Google Maps. List everything missing or wrong, and what you would do about reviews.

Work from real searches you have actually run, and say so. Invented volumes are obvious and score zero.
`.trim(),
      },
    },

    {
      title: "Module 4 — Paid Advertising",
      summary: "Buying traffic on Google and Meta, and keeping control of what it costs you.",
      lessons: [
        {
          title: "How Auction Advertising Works",
          minutes: 18,
          video: { search: "google ads auction quality score bidding explained beginners" },
          body: `
## You are not simply buying the top spot

Every time somebody searches, an auction runs in the time it takes the page to load. Your position is decided by your bid **multiplied by** a quality measure — how relevant your ad is, how likely people are to click it, and how good the page behind it is.

This has a consequence worth understanding: a well-written ad pointing at a genuinely relevant page can outrank a competitor who bids more. Sloppy advertisers pay a premium for the privilege of being sloppy.

## The vocabulary

- **Impression** — your ad was shown
- **Click** — somebody clicked it
- **CTR** — clicks divided by impressions
- **CPC** — what you paid per click
- **Conversion** — the click did what you wanted: a call, a form, a sale
- **CPA** — what each conversion cost you
- **ROAS** — revenue divided by ad spend

## The only two numbers that decide success

**Cost per acquisition** and **what a customer is worth to you.** If a customer is worth Rs 3,000 and you are paying Rs 800 to get one, the campaign works. If you are paying Rs 4,000, it does not — no matter how good the click-through rate looks.

Most beginners report clicks because clicks are flattering. Report cost per customer.
`.trim(),
        },
        {
          title: "Building a Google Search Campaign",
          minutes: 25,
          video: { search: "google ads search campaign setup tutorial step by step" },
          body: `
## Structure before spending

**Campaign** — holds the budget, the locations and the schedule.
**Ad group** — one tight theme, with its own keywords and ads.
**Ads** — at least three per group, so the system can find what works.

One ad group per thing you sell. Mixing "bridal makeup" and "hair cutting" into one group means the ads match neither well.

## Match types, in plain terms

- **Broad** — Google decides what is related. Cheap to set up, expensive to run. Avoid while learning.
- **Phrase** — your phrase, with words allowed around it. A sensible default.
- **Exact** — that phrase and close variants only. Tightest control.

## Negative keywords are where the money is saved

If you sell training courses, you do not want clicks from people searching "free", "jobs", "salary", or "pdf download". Every one of those is money gone.

Build a negative list before launch. Then read the search terms report every week and add more. This single habit separates advertisers who make money from advertisers who burn it.

## Before you switch it on

- Conversion tracking installed and tested
- A daily budget you are willing to lose entirely
- Locations set to where you actually serve
- A landing page that matches the ad's promise
`.trim(),
        },
        {
          title: "Meta Ads — Facebook and Instagram",
          minutes: 22,
          video: { search: "facebook ads manager campaign objective targeting tutorial 2026" },
          body: `
## A different kind of advertising

Search ads catch people who are already looking. Meta ads interrupt people who are not. That changes everything about how you write them.

On Google you answer a question. On Facebook you have to earn attention before you can ask for anything.

## Choose the objective honestly

Meta will optimise for whatever you ask for, exactly. Ask for "engagement" and you will get likes from people who will never buy. Ask for "leads" or "sales" and you get fewer, better results.

Pick the objective that matches the business outcome, not the one with the nicest-looking numbers.

## Targeting

- **Interest and demographic** — a starting point, not a science
- **Custom audiences** — your own customer list or website visitors. Far more effective.
- **Lookalike audiences** — people who resemble your existing customers. The strongest option once you have data.

Start broad rather than narrow. Meta's system finds buyers better than most manual targeting, provided you have given it a real conversion to optimise towards.

## The creative does the work

On Meta, the image or video matters more than the targeting. Test several. Real photographs of real work usually beat polished stock imagery, particularly for local businesses where familiarity is the selling point.

Write the first line as though it has to survive a thumb moving at speed. It does.
`.trim(),
        },
        {
          title: "Budgets, Testing and Knowing When to Stop",
          minutes: 20,
          video: { search: "ad testing ab test campaign optimization budget management" },
          body: `
## Start small, deliberately

A first campaign is an experiment, not a launch. Spend an amount you can afford to learn nothing from — for most small businesses that is a few thousand rupees over a week.

## Change one thing at a time

If you change the headline, the image and the audience together, and results improve, you have learned nothing about why.

Run two ads differing in exactly one respect. Give each enough impressions to mean something — a few hundred clicks, not twenty. Keep the winner, change one more thing.

## Read the right numbers

In order of importance: cost per conversion, conversion rate, click-through rate, impressions. Beginners read them backwards and celebrate reach.

## Knowing when to stop

Turn a campaign off when:

- Cost per customer has stayed above what a customer is worth, over enough data to be sure
- The search terms report shows the traffic is the wrong people, and negatives cannot fix it
- The landing page converts nobody — fix the page before spending more on traffic to it

A campaign that is losing money slowly is worse than one that fails fast, because nobody notices it.

## A word on client money

Never spend a client's budget without written agreement on the amount and the period. Report actual spend against actual results, monthly, in writing. Advertising is the easiest place in this trade to lose a client's trust, and the hardest to win it back.
`.trim(),
        },
      ],
      quiz: {
        title: "Module 4 Quiz — Paid Advertising",
        passingScore: 60,
        questions: [
          {
            prompt: "What decides an ad's position in a Google search auction?",
            options: [
              { text: "The bid combined with a quality measure of the ad and landing page", correct: true },
              { text: "The bid alone — highest bidder wins" },
              { text: "How long the account has existed" },
              { text: "The number of keywords in the campaign" },
            ],
          },
          {
            prompt: "Which two numbers actually decide whether a campaign is working?",
            type: "multiple",
            options: [
              { text: "Cost per acquisition", correct: true },
              { text: "What a customer is worth to the business", correct: true },
              { text: "Number of impressions" },
              { text: "Click-through rate" },
            ],
          },
          {
            prompt: "You sell paid training courses. Which negative keyword should you add first?",
            options: [
              { text: "free", correct: true },
              { text: "training" },
              { text: "course" },
              { text: "rawalpindi" },
            ],
            explanation:
              "People searching for free courses will click and never buy. You pay for every one of those clicks.",
          },
          {
            prompt: "What is the difference between search ads and Meta ads in intent?",
            options: [
              { text: "Search catches people already looking; Meta interrupts people who are not", correct: true },
              { text: "Search is cheaper in every case" },
              { text: "Meta ads cannot be targeted" },
              { text: "There is no practical difference" },
            ],
          },
          {
            prompt: "Why is 'engagement' usually the wrong Meta campaign objective for a shop?",
            options: [
              { text: "Meta will deliver likes from people who will never buy", correct: true },
              { text: "It costs more than other objectives" },
              { text: "It is only available to large advertisers" },
              { text: "It cannot be measured" },
            ],
          },
          {
            prompt: "When testing ads, how many things should differ between the two versions?",
            options: [
              { text: "One", correct: true },
              { text: "Two or three, to save time" },
              { text: "Everything — test completely different ideas" },
              { text: "It does not matter" },
            ],
          },
          {
            prompt: "A campaign sends plenty of the right traffic but the landing page converts nobody. What should you do?",
            options: [
              { text: "Fix the page before spending more on traffic to it", correct: true },
              { text: "Increase the budget to get more chances" },
              { text: "Add more keywords" },
              { text: "Switch to a different platform" },
            ],
          },
        ],
      },
      assignment: {
        title: "Assignment 4 — Campaign plan and ad copy",
        maxPoints: 100,
        instructions: `
Plan a **Google Search campaign** for your chosen business. You are not required to spend money — build the plan and, if you can, set it up in Google Ads and pause it before it runs.

Submit:

1. **Structure.** One campaign, at least two ad groups. Name them, and state the locations, schedule and daily budget in rupees.
2. **Keywords.** Five to ten per ad group, each with its match type and a reason.
3. **Negative keyword list.** At least fifteen, grouped by why you excluded them.
4. **Three ads per ad group.** Headlines and descriptions, within Google's character limits — state the counts.
5. **The maths.** What is one customer worth to this business? What is the most you can pay per customer and still profit? At your assumed conversion rate, what is the most you can pay per click? Show the working.

Part 5 carries the most marks. A campaign built without it is guesswork with someone else's money.
`.trim(),
      },
    },

    {
      title: "Module 5 — Social Media Marketing",
      summary: "Choosing platforms, planning content, and turning an audience into customers.",
      lessons: [
        {
          title: "Choosing the Right Platforms",
          minutes: 16,
          video: { search: "choosing social media platforms for business audience fit" },
          body: `
## You cannot do all of them well

A small business posting badly on six platforms does worse than one posting well on two. Choose on evidence, not habit.

## What each is good for, in Pakistan

**Facebook** — still the widest reach across ages and cities. Groups and Marketplace remain genuinely effective for local selling.

**Instagram** — anything visual: clothing, food, salons, interiors, events. Younger, more urban.

**TikTok** — enormous reach, fastest growth, and the cheapest attention available right now. Demands a different tone: unpolished, quick, human.

**LinkedIn** — business-to-business, recruitment, professional services. Small but valuable audiences.

**YouTube** — long-form, tutorials, and the second-largest search engine. Slow to build, lasts for years.

**WhatsApp** — not social media exactly, but where Pakistani business actually closes. Every campaign should end somewhere that leads here.

## How to choose

1. Where does this business's customer already spend time?
2. What can this business realistically produce each week? A tailor with a phone camera should not be planning a YouTube channel.
3. Where are the competitors, and how badly are they doing it?

Pick two. Do them properly for three months before adding a third.
`.trim(),
        },
        {
          title: "Content Pillars and the Calendar",
          minutes: 20,
          video: { search: "social media content calendar content pillars planning" },
          body: `
## Why most business accounts die

They post enthusiastically for three weeks, run out of ideas, and stop. The cause is always the same: no system, only inspiration.

## Content pillars

Choose four themes and rotate them. For a training institute:

- **Teach** — a genuinely useful tip, free, no strings
- **Prove** — student work, results, before and after
- **Human** — the trainers, the classroom, the ordinary day
- **Offer** — enrolment, dates, prices

The ratio matters. Roughly three of the first three kinds for every one of the last. An account that only sells gets muted.

## The calendar

Plan a month at a time in a simple sheet: date, platform, pillar, the hook, the asset needed, who makes it, status.

Then **batch the work**. One afternoon of photography produces a month of posts. Writing captions one at a time, daily, under pressure, is why people give up.

## Frequency

Consistency beats volume. Three good posts a week, every week, outperforms daily posting for a fortnight and then silence.

## Hooks

The first line and the first frame decide everything. "Here are three mistakes that cost a tailor his regular customers" earns a stop. "We are pleased to announce" does not.
`.trim(),
        },
        {
          title: "Creating Posts That Get Seen",
          minutes: 22,
          video: { search: "social media post design canva reels short video tips business" },
          body: `
## The algorithm rewards one thing

Whether people stop, watch, and respond. Everything else follows from that.

## Practical rules

- **Vertical video** for Reels, TikTok and Stories. Filling the screen matters more than production quality.
- **Good light** beats an expensive camera. Face a window.
- **Captions on screen.** Most people watch without sound.
- **Three seconds.** If the hook has not landed by then, they have gone.
- **One idea per post.** Not five.

## Design without a designer

Canva is enough for almost everything a small business needs. Build a brand kit once — two fonts, the brand colours, the logo — and every subsequent post takes minutes and looks consistent.

Consistency is what makes an account look like a business rather than a personal page.

## Writing the caption

Front-load it. The first line is all most people read before deciding whether to tap "more".

End with one instruction: ask a question, send them to WhatsApp, tell them to save the post. A caption that ends in silence gets silence.

## Hashtags, briefly

Useful on Instagram and TikTok, largely pointless on Facebook. Five to ten relevant ones, mixing broad and specific, including local ones — a Taxila business should use Taxila and Rawalpindi tags. Thirty generic hashtags look like spam and perform like it.
`.trim(),
        },
        {
          title: "Community, Messages and Selling",
          minutes: 18,
          video: { search: "social media community management responding to comments customer service" },
          body: `
## The sale happens in the messages

Posts start conversations. Almost nothing is sold in the feed — it is sold in the inbox, and in Pakistan usually on WhatsApp.

If a business takes six hours to reply to a message, the customer has already bought from somebody faster.

## Set this up properly

- **WhatsApp Business**, with a catalogue, greeting message and away message
- **Saved replies** for the five questions everybody asks
- **Stated response hours**, and keep to them
- **A record** of who asked what, so a follow-up does not start from nothing

## Handling complaints in public

Reply publicly, briefly, without arguing, and move it to a private channel to resolve. Onlookers are judging how you behave, not who was right.

Never delete a genuine complaint. Deleting turns one unhappy customer into a public accusation of dishonesty.

## Selling without being tiresome

- Answer the question first, sell second
- Give the price. "DM for price" loses more customers than it protects margins
- Make the next step trivial: a link, a number, a booking time
- Follow up once, politely. Once.

## Measuring what matters

Followers are the least useful number on the page. Track messages received, enquiries converted, and sales attributable to the channel. A thousand followers who buy nothing are a vanity number, and clients eventually work that out.
`.trim(),
        },
      ],
      quiz: {
        title: "Module 5 Quiz — Social Media Marketing",
        passingScore: 60,
        questions: [
          {
            prompt: "How many platforms should a small business start with?",
            options: [
              { text: "Two, done properly", correct: true },
              { text: "All of them, for maximum reach" },
              { text: "One, always" },
              { text: "Six, rotating weekly" },
            ],
          },
          {
            prompt: "Roughly what proportion of posts should be direct selling?",
            options: [
              { text: "About one in four", correct: true },
              { text: "All of them — that is the point" },
              { text: "None — selling is for the website" },
              { text: "About three in four" },
            ],
          },
          {
            prompt: "Why does batching content production matter?",
            options: [
              { text: "It is what keeps an account posting after the initial enthusiasm fades", correct: true },
              { text: "The algorithm rewards posts made in batches" },
              { text: "It reduces the cost of advertising" },
              { text: "It is required by the platforms" },
            ],
          },
          {
            prompt: "Which of these improve the chance a video is watched?",
            type: "multiple",
            options: [
              { text: "Vertical format filling the screen", correct: true },
              { text: "Captions burned on screen", correct: true },
              { text: "A hook within the first three seconds", correct: true },
              { text: "Thirty hashtags in the caption" },
            ],
          },
          {
            prompt: "A customer posts a genuine complaint publicly. What should you do?",
            options: [
              { text: "Reply publicly and briefly, then resolve it privately", correct: true },
              { text: "Delete it" },
              { text: "Argue the facts publicly until they concede" },
              { text: "Ignore it and hope it is forgotten" },
            ],
            explanation:
              "Onlookers judge how you behave, not who was right. Deleting turns one complaint into an accusation of dishonesty.",
          },
          {
            prompt: "Why is 'DM for price' usually a mistake?",
            options: [
              { text: "It loses more customers than it protects margins", correct: true },
              { text: "Instagram penalises it in the algorithm" },
              { text: "It is against platform rules" },
              { text: "It cannot be tracked in analytics" },
            ],
          },
          {
            prompt: "Which is the least useful measure of a business account's success?",
            options: [
              { text: "Follower count", correct: true },
              { text: "Messages received" },
              { text: "Enquiries converted" },
              { text: "Sales attributable to the channel" },
            ],
          },
        ],
      },
      assignment: {
        title: "Assignment 5 — One month content calendar",
        maxPoints: 100,
        instructions: `
For your chosen business, produce a **complete one-month plan** and the first week of posts.

Submit:

1. **Platform choice.** Which two, and the evidence for each — where the customer is, what the business can produce, what competitors are doing.
2. **Four content pillars**, named and explained in a sentence each.
3. **A calendar of twelve posts** across four weeks, as a table: date, platform, pillar, hook line, format, asset needed.
4. **Three finished posts.** Actual images or videos you have made — Canva is fine, a phone camera is fine — with the full caption and call to action. Not descriptions of posts. The posts.
5. **A response plan.** The five most likely customer questions, with your saved replies, and your stated response hours.

Marks are weighted to part 4. Anyone can plan; the work is in producing.
`.trim(),
      },
    },

    {
      title: "Module 6 — Content and Copywriting",
      summary: "Writing that people finish, and content that keeps earning after you publish it.",
      lessons: [
        {
          title: "What Content Marketing Is For",
          minutes: 15,
          video: { search: "content marketing strategy explained small business" },
          body: `
## Earning attention instead of buying it

An advert asks for a sale. Content gives something away first — an answer, a demonstration, a piece of help — and earns the right to ask later.

A tailor who posts a clear explanation of how to measure yourself for a shalwar kameez is trusted by everyone who reads it. That trust is what converts, months later.

## Why it is worth the effort

- It keeps working. An article that ranks brings customers for years, after you have stopped paying for it.
- It is the raw material for everything else — social posts, emails, ads
- It answers objections before the customer has to ask
- It is the only channel a small business can win against a larger competitor with more money

## Why most attempts fail

Businesses write what they find interesting rather than what customers ask. The cure is simple and unglamorous: **write down the questions customers actually ask**, in their words, and answer them one at a time.

Your best content ideas are already sitting in the business's WhatsApp inbox.

## Formats

Articles, short videos, carousels, checklists, templates, case studies, FAQs. Choose by what suits the question and what the business can sustain — not by what is fashionable.
`.trim(),
        },
        {
          title: "Copywriting Fundamentals",
          minutes: 22,
          video: { search: "copywriting basics features benefits aida formula" },
          body: `
## Features and benefits

A **feature** is what the thing is. A **benefit** is what it does for the reader.

"100% cotton, double-stitched seams" is a feature. "Survives a Rawalpindi summer and a hundred washes" is a benefit. Lead with the benefit; the feature is the proof.

## A structure that works

**Attention** — a hook that stops the reader
**Interest** — why this matters to them specifically
**Desire** — proof, detail, what life looks like afterwards
**Action** — one clear instruction

## Rules worth keeping

- **Short sentences.** If you run out of breath reading it aloud, cut it.
- **You, not we.** "You will learn" beats "we provide training in".
- **Concrete, not vague.** "Rs 15,000" beats "affordable". "Three weeks" beats "quickly".
- **Cut the warm-up.** The real first sentence is usually the third one you wrote.
- **One idea per paragraph.**

## Writing for Pakistani audiences

Decide the language deliberately — English, Urdu, or Roman Urdu — based on who is reading, not on what feels professional. Roman Urdu often outperforms formal English in WhatsApp and social captions, and looks wrong in a corporate proposal. The mistake is not choosing one; it is never thinking about it.

## Editing

Write badly and quickly, then fix it. Most people try to write the perfect first sentence and never reach the second.
`.trim(),
        },
        {
          title: "Blogging and Long-Form Content",
          minutes: 20,
          video: { search: "how to write blog post seo structure outline" },
          body: `
## The job of an article

Answer one question so well that the reader stops looking. That is the whole standard, and it is also what makes something rank.

## Structure

1. **Answer the question in the first paragraph.** Do not make people scroll for it.
2. **Then expand** — the detail, the exceptions, the how
3. **Sub-headings every few paragraphs**, written so the article can be skimmed
4. **One example the reader recognises**, ideally local
5. **A next step** — what to read, what to do, whom to ask

## Length

As long as the question needs. A 400-word answer that finishes the job beats 2,000 words of padding. Writing to a word count is how content becomes unreadable.

## Making it findable

- The target keyword in the title, first paragraph and one sub-heading
- A title that a human would click, not just a keyword
- Internal links to other pages on the site
- A real image, with alt text

## Keeping it alive

An article written two years ago with old prices does more harm than no article. Review the important ones twice a year, update the facts, and change the date only when you have genuinely changed the content.

## A note on AI-written content

Tools can draft. They cannot know the price of cloth in Taxila, what a specific customer asked last week, or what the shop looks like on a Friday. That local knowledge is the only thing your content has that a competitor's cannot. Publishing generic text without it wastes the one advantage you hold.
`.trim(),
        },
        {
          title: "Photography and Video on a Phone",
          minutes: 18,
          video: { search: "product photography smartphone lighting tips small business" },
          body: `
## The equipment is not the problem

A modern phone is enough for nearly all small-business content. What separates good from bad is light, background and steadiness — none of which cost money.

## Light

Shoot facing a window during the day. Never with the window behind the subject, or you get a silhouette. Avoid overhead tube lights alone — they throw hard shadows and turn everything green.

## Background

Plain and uncluttered. A single-colour sheet or wall. If the background is noisy, the product is not the subject any more.

## Steadiness and framing

Brace the phone against something, or use a cheap tripod. Shoot **vertical** for social, **horizontal** for a website banner — decide before shooting, not after.

Leave space around the subject so the image can be cropped to different shapes later.

## Product photography that sells

- The whole item, plainly lit
- Close detail of the quality — stitching, grain, finish
- The item in use, or worn, or in a real room
- Something for scale

## Basic editing

Crop, straighten, lift the exposure a little, increase contrast slightly. Stop there. Heavily filtered photographs of physical goods cause returns and complaints, because the customer receives something that does not match what they were shown.

## Video

Short, vertical, well lit, captioned. Film more than you need and cut hard. Thirty usable seconds from five minutes of filming is a normal, good result.
`.trim(),
        },
      ],
      quiz: {
        title: "Module 6 Quiz — Content and Copywriting",
        passingScore: 60,
        questions: [
          {
            prompt: "Where should you look first for content ideas?",
            options: [
              { text: "The questions customers already ask, in their own words", correct: true },
              { text: "Competitor blogs" },
              { text: "Trending topics on social media" },
              { text: "What the business owner finds interesting" },
            ],
          },
          {
            prompt: "Which is a benefit rather than a feature?",
            options: [
              { text: "Survives a Rawalpindi summer and a hundred washes", correct: true },
              { text: "100% cotton" },
              { text: "Double-stitched seams" },
              { text: "Available in four colours" },
            ],
          },
          {
            prompt: "Where in an article should the question be answered?",
            options: [
              { text: "In the first paragraph", correct: true },
              { text: "In the conclusion, to keep people reading" },
              { text: "Halfway down, after the background" },
              { text: "In a downloadable PDF" },
            ],
          },
          {
            prompt: "Which of these improve copy?",
            type: "multiple",
            options: [
              { text: "Short sentences", correct: true },
              { text: "Concrete numbers instead of vague words", correct: true },
              { text: "Writing 'you' rather than 'we'", correct: true },
              { text: "A long introduction establishing credentials" },
            ],
          },
          {
            prompt: "Why should you not heavily filter photographs of physical products?",
            options: [
              { text: "The customer receives something that does not match what they were shown", correct: true },
              { text: "Filters slow down the website" },
              { text: "Platforms remove filtered images" },
              { text: "Filters are difficult to apply" },
            ],
          },
          {
            prompt: "What is the limitation of AI-drafted content for a local business?",
            options: [
              { text: "It cannot supply the local knowledge that is the business's only real advantage", correct: true },
              { text: "It is always grammatically wrong" },
              { text: "Search engines ban it outright" },
              { text: "It cannot be edited" },
            ],
          },
        ],
      },
      assignment: {
        title: "Assignment 6 — Article, captions and a photo set",
        maxPoints: 100,
        instructions: `
Produce real content for your chosen business.

1. **One article of 600–900 words**, answering a genuine question that the business's customers ask. State where the question came from. Include a title, a meta description, sub-headings, and at least one local example.
2. **Three social captions** derived from that article — one for each of two platforms plus one repurposed as a short-video script with its on-screen text.
3. **A photo set of six images** you have taken yourself: the whole item, a detail shot, one in use, one for scale, and two of your own choosing. Say for each what it is for.
4. **A before-and-after rewrite.** Find one paragraph of genuinely poor copy on a real Pakistani business website. Quote it, then rewrite it, then explain in three sentences what you changed and why.

Everything must be your own work, made for this assignment. Stock photographs score zero for part 3.
`.trim(),
      },
    },

    {
      title: "Module 7 — Email and WhatsApp Marketing",
      summary: "Selling repeatedly to people who already know you — the cheapest audience you will ever have.",
      lessons: [
        {
          title: "Why the List Is the Asset",
          minutes: 15,
          video: { search: "email marketing why build list owned audience" },
          body: `
## The one audience nobody can take away

Facebook can change its algorithm overnight and halve your reach. Google can change its ranking and remove you from page one. Neither can touch your email list or your WhatsApp contacts.

That is why every campaign in this course, whatever the channel, should end by capturing a way to contact the person again.

## The economics

Email consistently returns more per rupee than any other channel, for one dull reason: the people on the list already know you. There is no cost to reach them and no persuading required to get attention.

## Building a list honestly

Give something worth an email address:

- A genuinely useful guide or checklist
- A discount on a first order
- Early notice of new stock or course dates
- Notification when something sold out returns

## What never to do

**Never buy a list.** The addresses are stale, the people never asked for you, your complaints rate destroys your ability to reach anyone, and in many places it is illegal.

**Never add people silently.** Somebody who bought a shalwar kameez did not ask for a weekly newsletter. Ask.

## Permission is the whole game

A small list that wants to hear from you outperforms a large one that does not, every time. Guard the permission you have been given: it is the entire value of the asset.
`.trim(),
        },
        {
          title: "Writing Emails People Open",
          minutes: 20,
          video: { search: "email subject lines open rates copywriting examples" },
          body: `
## The subject line decides everything

Nothing else in the email matters if it is not opened.

What works: specific, short, honest, and a reason to open now. "Your course starts Monday — here is what to bring." "Three sizes back in stock."

What does not: "Newsletter #14". "Exciting news from our team." Anything in capitals. Anything with a false urgency the reader will remember next time.

## The preview text

The grey line next to the subject in an inbox. Most senders waste it by repeating the subject. Use it to extend the promise.

## Structure

1. One sentence saying why you are writing
2. The substance — short paragraphs, one idea each
3. One call to action, as a link or button
4. A sign-off from a person, not a department

## Length

Shorter than you think. If the email's job is to get a click, everything past the link is decoration.

## Sequences

A single email is a broadcast. A **sequence** does the selling:

- **Welcome** — who you are, what to expect, one useful thing, immediately
- **Nurture** — two or three emails of genuine help before any offer
- **Offer** — the thing you are selling, with the objections answered
- **Follow-up** — one reminder before the deadline, then stop

Set it once, and it works for every new subscriber without further effort.

## Timing

Test it rather than believing any rule you read. For most Pakistani consumer businesses, evenings and weekends beat weekday mornings — but test.
`.trim(),
        },
        {
          title: "WhatsApp Business",
          minutes: 20,
          video: { search: "whatsapp business catalog broadcast list setup tutorial" },
          body: `
## Where Pakistani business actually closes

For most local businesses, WhatsApp is more important than email. It is where the enquiry lands, the negotiation happens and the order is confirmed.

Treat it as a marketing channel deliberately, not as an overflowing personal inbox.

## Set it up properly

- **WhatsApp Business app**, not the personal one
- **Profile** with the address, hours, website and a description
- **Catalogue** of products with prices and photographs
- **Greeting message** for first contact
- **Away message** with your real hours
- **Quick replies** for the questions asked daily
- **Labels** — new enquiry, quoted, paid, delivered

## Broadcast lists, not groups

A **group** lets every customer see and message every other customer. It becomes unusable within a week and exposes your customer list to competitors.

A **broadcast list** sends to many people as individual messages. Only people who have saved your number receive it — which is itself a permission check, and a good one.

## Rules that keep you out of trouble

- Message people who contacted you first, or who explicitly agreed
- Give an obvious way to stop, and honour it immediately
- Do not send at night
- Do not send daily

WhatsApp bans accounts for spam, quickly and without appeal, and a banned number is often the business's main line. The downside is not a telling-off; it is losing the phone number customers have.

## What works

Order updates, delivery notifications, restock alerts, appointment reminders, and answering questions fast. Useful beats promotional, by a wide margin.
`.trim(),
        },
        {
          title: "Automation, Segmentation and Measurement",
          minutes: 18,
          video: { search: "email automation segmentation open rate click rate metrics" },
          body: `
## Segmentation

Sending everybody the same message wastes most of it. Split the list by something that changes what they should receive:

- Bought before, versus never bought
- Which product or course they were interested in
- City, if you deliver differently
- How recently they engaged

A message to twenty people who want exactly that thing beats a message to a thousand who mostly do not.

## Automation worth setting up first

- **Welcome sequence** on joining
- **Abandoned enquiry** — they asked and never replied; one follow-up after two days
- **Post-purchase** — thank you, how to use it, ask for a review
- **Win-back** — no engagement in six months; one honest "shall we stop emailing you?"

That last one improves the list by removing people, which is usually the right trade.

## The numbers

- **Open rate** — is the subject line working, and is the list still warm?
- **Click rate** — is the content persuading?
- **Conversion rate** — did clicking lead anywhere?
- **Unsubscribe rate** — a spike means you sent something wrong; look at what
- **Bounce rate** — bad addresses; clean them or the whole list's deliverability suffers

## Deliverability

If too many people never open, mail providers start routing you to spam — including for the people who did want it. Removing dead subscribers protects everyone else's delivery. A smaller, engaged list is worth more than a large, ignored one in every respect.
`.trim(),
        },
      ],
      quiz: {
        title: "Module 7 Quiz — Email and WhatsApp",
        passingScore: 60,
        questions: [
          {
            prompt: "Why is an email list described as an asset in a way that social followers are not?",
            options: [
              { text: "No platform can change the rules and cut off your access to it", correct: true },
              { text: "Email is more modern than social media" },
              { text: "Lists can be sold to other businesses" },
              { text: "Email costs nothing to send" },
            ],
          },
          {
            prompt: "What is wrong with buying an email list?",
            type: "multiple",
            options: [
              { text: "The people never asked to hear from you", correct: true },
              { text: "Complaints damage your ability to reach anyone at all", correct: true },
              { text: "It is illegal in many places", correct: true },
              { text: "Bought lists are too expensive" },
            ],
          },
          {
            prompt: "Why use a WhatsApp broadcast list rather than a group?",
            options: [
              { text: "Customers cannot see or message each other, and only people who saved your number receive it", correct: true },
              { text: "Broadcast lists can hold more people" },
              { text: "Groups cost money to create" },
              { text: "Broadcasts are delivered faster" },
            ],
          },
          {
            prompt: "What does a sudden spike in unsubscribes tell you?",
            options: [
              { text: "Something about that specific send was wrong — go and look at it", correct: true },
              { text: "The list is too large" },
              { text: "Your emails are going to spam" },
              { text: "Nothing useful" },
            ],
          },
          {
            prompt: "Why does removing inactive subscribers help?",
            options: [
              { text: "Low engagement pushes your mail to spam for everyone, including people who wanted it", correct: true },
              { text: "It reduces the monthly cost" },
              { text: "It improves the open rate on paper, which is the goal" },
              { text: "It is required by email providers" },
            ],
          },
          {
            prompt: "Which subject line is strongest?",
            options: [
              { text: "Your course starts Monday — here is what to bring", correct: true },
              { text: "Newsletter #14" },
              { text: "EXCITING NEWS!!!" },
              { text: "An update from our team" },
            ],
          },
          {
            prompt: "What is the real risk of sending unsolicited WhatsApp marketing?",
            options: [
              { text: "The number gets banned — and it is usually the business's main line", correct: true },
              { text: "A fine from WhatsApp" },
              { text: "Messages are delivered more slowly" },
              { text: "There is no real risk" },
            ],
          },
        ],
      },
      assignment: {
        title: "Assignment 7 — Welcome sequence and WhatsApp setup",
        maxPoints: 100,
        instructions: `
1. **A lead magnet.** Decide what your business can give away that is worth an email address, and produce it — a one-page checklist, guide or template. Submit the actual file.
2. **A four-email welcome sequence.** Write all four in full: subject line, preview text, body, call to action, and the delay before each. State what each one is for.
3. **Two subject line alternatives** for email three, and say how you would decide between them.
4. **A WhatsApp Business plan.** The greeting message, the away message with real hours, five quick replies, and your label scheme. Screenshots of a real configured account earn full marks.
5. **Permission.** In three sentences, state exactly how people will join this list and how they will leave it.

Part 5 is short and carries real marks. A marketer who is careless with permission eventually costs a client their phone number.
`.trim(),
      },
    },

    {
      title: "Module 8 — Analytics, Reporting and Working as a Marketer",
      summary:
        "Proving what your work earned, reporting it honestly, and getting paid properly for doing it.",
      lessons: [
        {
          title: "Google Analytics and Search Console",
          minutes: 22,
          video: { search: "google analytics 4 basics for beginners setup reports" },
          body: `
## Install before you need it

Analytics only records from the day it is installed. There is no way to recover what happened before. Set it up at the start of every engagement, along with Search Console.

## What Analytics answers

- How many people came, and from where — search, social, ads, direct, referral
- What they did — which pages, how long, where they left
- Whether they did the thing you wanted

## What Search Console answers, and Analytics cannot

- Which search queries showed your pages
- Your average position for each
- Which pages Google has indexed, and which it has refused, and why

Search Console is free, takes ten minutes, and is the only honest source for what you rank for.

## Conversions

A visit is not a result. Define what counts — a form submitted, a WhatsApp click, a call tapped, a purchase — and track those. Everything else is background.

Without conversion tracking, you cannot tell a client which channel earned money, and you will end up defending your invoice with traffic charts.

## Numbers that mislead

- **Sessions** — up is not automatically good. Up from where, doing what?
- **Bounce rate** — high is fine on a page that answered the question
- **Time on page** — could be engagement, could be confusion
- **Followers** — near-useless alone

Always ask: did this lead to money, or to an enquiry that leads to money?
`.trim(),
        },
        {
          title: "Reporting to a Client",
          minutes: 18,
          video: { search: "monthly marketing report client template kpi" },
          body: `
## What a client actually wants to know

Three things: what did you spend, what did it produce, and what happens next. Everything else is supporting material.

## A report that works

1. **Summary** — three sentences, in plain language, at the top
2. **Against the goal** — what we agreed, and where we are
3. **The numbers** — spend, enquiries, cost per enquiry, sales where known
4. **What worked**, with the evidence
5. **What did not**, and what you changed
6. **Next month** — what you will do, and what you need from them

## Report the failures

A report that only contains good news is not believed, and correctly so. A month where the ads underperformed, stated plainly with what you changed, builds more trust than a page of green arrows.

The client will eventually find out anyway. Far better it comes from you, in a meeting you controlled.

## Set expectations before the work

Agree at the start what success looks like and when it is reasonable to judge. "Enquiries at under Rs 500 each by month three" is something you can both hold. "Grow the business" is not.

## Keep it short

Two pages, monthly, on time. A twenty-page report nobody reads is worse than a one-page report they act on.
`.trim(),
        },
        {
          title: "Freelancing and Finding Clients",
          minutes: 22,
          video: { search: "freelance digital marketing get first clients upwork fiverr pakistan" },
          body: `
## The first client is the hard one

Nobody hires a marketer with no evidence. Manufacture the evidence:

- Do the work free for one business you know, properly, and measure it
- Turn it into a written case study with real numbers
- Two of those and you are no longer a beginner

## Where the work is

**Local businesses.** Least competition, easiest to reach, and they pay in cash and referrals. Walk in. Most have nobody doing this.

**Upwork and Fiverr.** Global rates, brutal competition, slow to establish. Specialise narrowly — "Google Ads for dental clinics" beats "digital marketing".

**Referrals.** Eventually the main source. Ask every satisfied client, directly, once.

**LinkedIn.** Publish what you are learning. Clients come to people who appear to know things.

## Pricing

- **Hourly** — safe at first; punishes you as you get faster
- **Per project** — better, once you can estimate honestly
- **Monthly retainer** — the goal. Predictable for both sides.
- **Percentage of ad spend** — common, and it quietly rewards you for spending more of the client's money. Be careful.

Charge for the result, not the hours. Price low at the start if you must, but raise it with each case study, and never apologise for a rate.

## Protecting yourself

- Written scope, before starting
- Advance payment, always — 50% is normal
- The client's own accounts and cards for ad spend, never yours
- Agreed limits on revisions
- A clear end date, or a clear notice period

## What loses clients

Missed deadlines, silence, and surprises on the invoice. Almost never the quality of the work.
`.trim(),
        },
        {
          title: "Ethics, Law and Staying Credible",
          minutes: 18,
          video: { search: "digital marketing ethics advertising standards disclosure privacy" },
          body: `
## You will be asked to do dishonest things

Fake reviews, invented testimonials, claims about results the product cannot deliver, before-and-after photographs that are not the same person. Often by clients who do not think of it as dishonest.

Refuse, and explain what it costs them: platforms detect and remove fake reviews, suspend profiles, and ban accounts. The short-term gain is small and the penalty falls on the business.

## Disclose paid promotion

If an influencer is paid, the post must say so. If content is sponsored, label it. Audiences discover these things and the damage is disproportionate.

## Handle data carefully

- Collect only what you need
- Say what you will use it for
- Do not share a client's customer list with anybody, including your next client
- Keep exports off shared computers and out of WhatsApp

## Claims you cannot make

- Guaranteed rankings, guaranteed income, guaranteed sales
- Medical or health claims for products that are not medicines
- "Number one" without evidence you could produce if asked

## Accreditation

Do not describe a course, a certificate or a business as accredited by a body that has not accredited it. For a training organisation this matters more than anywhere else: a student choosing a course is deciding what their certificate will be worth to an employer. Say exactly what it is, and no more.

## The long view

This trade runs on reputation and referral. Every shortcut is borrowed against a reputation you have not finished building. It is not worth it, and the people who last in this work all learned that early.
`.trim(),
        },
      ],
      quiz: {
        title: "Module 8 Quiz — Analytics, Reporting and Practice",
        passingScore: 60,
        questions: [
          {
            prompt: "Why must analytics be installed at the start of an engagement?",
            options: [
              { text: "It only records from the day it is installed; earlier data cannot be recovered", correct: true },
              { text: "It is cheaper to install early" },
              { text: "Google requires it before a site is indexed" },
              { text: "It takes several months to activate" },
            ],
          },
          {
            prompt: "Which question can Search Console answer that Analytics cannot?",
            options: [
              { text: "Which search queries showed your pages, and at what position", correct: true },
              { text: "How long visitors stayed on a page" },
              { text: "Which social network sent the most traffic" },
              { text: "How many people visited yesterday" },
            ],
          },
          {
            prompt: "A month's ads underperformed badly. What goes in the report?",
            options: [
              { text: "The result plainly, what you think caused it, and what you changed", correct: true },
              { text: "Only the metrics that improved" },
              { text: "Nothing — wait until it recovers" },
              { text: "A longer report, to dilute the bad numbers" },
            ],
            explanation:
              "A report containing only good news is not believed. The client finds out eventually; better it comes from you.",
          },
          {
            prompt: "Whose payment card should pay for a client's ad spend?",
            options: [
              { text: "The client's, on the client's own account", correct: true },
              { text: "The freelancer's, and invoice it later" },
              { text: "Whichever is more convenient" },
              { text: "A shared prepaid card" },
            ],
          },
          {
            prompt: "Which pricing model quietly rewards you for spending more of a client's money?",
            options: [
              { text: "Percentage of ad spend", correct: true },
              { text: "Monthly retainer" },
              { text: "Fixed project fee" },
              { text: "Hourly rate" },
            ],
          },
          {
            prompt: "A client asks you to write twenty five-star reviews. What do you do?",
            options: [
              { text: "Refuse, and explain that platforms detect this and suspend the business's profile", correct: true },
              { text: "Do it, but space them out" },
              { text: "Hire someone else to write them" },
              { text: "Do it only if the product is genuinely good" },
            ],
          },
          {
            prompt: "Which claims must a marketer not make?",
            type: "multiple",
            options: [
              { text: "Guaranteed search rankings", correct: true },
              { text: "Accreditation by a body that has not accredited the course", correct: true },
              { text: "Health claims for a product that is not a medicine", correct: true },
              { text: "A price, stated clearly" },
            ],
          },
          {
            prompt: "What most commonly loses a freelancer their clients?",
            options: [
              { text: "Missed deadlines, silence and surprises on the invoice", correct: true },
              { text: "Charging too much" },
              { text: "The technical quality of the work" },
              { text: "Not using enough platforms" },
            ],
          },
        ],
      },
      assignment: {
        title: "Final assignment — A campaign, measured and reported",
        maxPoints: 200,
        instructions: `
This replaces an examination. It draws on every module, and is marked accordingly.

Using the business you have worked with throughout:

1. **Run something real.** A social campaign, an email sequence, a set of optimised pages, or an ad campaign if you have a budget. It must actually run, for at least two weeks.
2. **Set it up to be measured.** Analytics and Search Console installed, conversions defined. Include screenshots proving they were working before the campaign started.
3. **A two-page client report**, in the structure from this module: summary, goal, numbers, what worked, what did not, next month.
4. **The honest conclusion.** What would you do differently? If it failed, say so and explain why — a well-analysed failure scores higher here than a success you cannot explain.
5. **Your professional package.** Your rate, what it includes, your scope and payment terms, and one case study written from this work.

**On honesty:** invented numbers are usually obvious, and are marked zero. A small campaign with real, modest, properly measured results is worth far more than impressive figures nobody can verify — both here and in front of a client.
`.trim(),
      },
    },
  ],
};
