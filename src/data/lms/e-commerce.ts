import type { CourseContent } from "./types.ts";

/**
 * Marked "navttc_aligned" on Hunarsaaz's instruction — see the note in
 * digital-marketing.ts. The claim has not been checked against NAVTTC's
 * curriculum document, which could not be reached when this was written.
 */
export const eCommerce: CourseContent = {
  slug: "e-commerce",
  title: "E-Commerce",
  summary:
    "Build an online shop and make it sell — products, photography, payments that work in Pakistan, delivery, returns and the marketplaces where most first sales happen.",
  description: `
Selling online in Pakistan is not the same problem as selling online in America, and courses that ignore that leave you stuck at the first real obstacle.

Most customers here pay cash on delivery. Most abandoned orders are lost to a courier, not a checkout page. Most first sales happen on Daraz or Instagram, not on a shop you built. This course teaches the business as it actually works: choose something worth selling, photograph it so it sells itself, put it where buyers already are, handle the money and the courier without losing either, and only then worry about scaling.

You will build a working shop during the course — a real one, with real products, that could take an order on the last day. Whether that is a Shopify store, a WooCommerce site, a Daraz shop or an Instagram catalogue is your decision to justify in Module 2.

No prior experience is needed. If you have ever sold anything to anybody, you already understand the hard part.
`.trim(),

  sector: "Information Technology",
  courseCode: "HS-EC-01",
  nvqfLevel: "2",
  recognition: "navttc_aligned",

  level: "beginner",
  language: "both",
  durationWeeks: 12,
  price: 0,
  programSlug: "computer-it-skills",

  prerequisites:
    "Basic computer and smartphone use. A CNIC and a bank account or mobile wallet in your own name are needed for the payment and marketplace modules — you cannot complete those with someone else's.",
  targetLearners:
    "Anyone wanting to start selling online — shopkeepers moving their business onto the internet, women working from home, students building a side income, and people who want the skill to run a shop for an employer.",

  objectives: [
    "Judge whether a product is worth selling online before spending money on it.",
    "Build and run a working online shop, or a marketplace shop, and justify which was the right choice.",
    "Photograph and describe products so that they sell without the customer asking questions.",
    "Take payment reliably in a market where most customers pay cash on delivery.",
    "Handle couriers, returns and complaints without losing money or reputation.",
    "Read the numbers that decide whether the shop is actually profitable.",
  ],
  outcomes: [
    "Research a product and work out its true landed cost and realistic margin.",
    "Set up a Shopify or WooCommerce store, or a Daraz seller account, end to end.",
    "Take and edit product photographs with a phone that are good enough to sell.",
    "Write product titles and descriptions that answer objections before they are raised.",
    "Configure cash on delivery, bank transfer and a payment gateway, and reconcile what arrives.",
    "Book, track and dispute courier shipments, and keep return rates under control.",
    "Calculate contribution margin, break-even and customer acquisition cost for a real product.",
  ],
  careers: [
    "Own online shop or home-based business",
    "E-Commerce Executive or Store Manager",
    "Daraz / marketplace seller",
    "Product Lister and Catalogue Manager",
    "Order Management and Fulfilment Assistant",
    "E-commerce support for an existing retail business",
    "Freelance store setup for clients",
  ],

  modules: [
    {
      title: "Module 1 — The Business Before the Website",
      summary:
        "Choosing what to sell, proving there is demand, and knowing your numbers before you spend anything.",
      lessons: [
        {
          title: "How E-Commerce Works in Pakistan",
          minutes: 16,
          preview: true,
          video: { search: "ecommerce business model explained beginners how online store works" },
          body: `
## The market you are actually selling into

Online retail in Pakistan has grown quickly, but it has its own shape, and the differences are not details — they decide whether a shop survives.

**Cash on delivery dominates.** A large majority of orders are paid in cash at the door. That single fact changes your cash flow, your return rate and your risk on every order.

**Trust is the scarce resource.** Buyers have been sent the wrong item, a fake item, or nothing at all. Every element of your shop is either building trust or spending it.

**Instagram and WhatsApp are shops.** Enormous volumes of goods are sold with no website involved at all — a catalogue, a DM, a courier booking.

**Marketplaces own discovery.** Daraz has the buyers. Your own site has the margin. Most successful sellers end up on both, for different reasons.

## What you are signing up for

E-commerce is not a website project. It is a retail business with a screen in front of it — buying, pricing, stock, packing, delivery, complaints and returns.

The website is perhaps a fifth of the work. The course is weighted accordingly.

## What we will build

By the end you will have a live shop with real products, real photographs, real prices and a working way to take an order. Start thinking now about what you would sell.
`.trim(),
        },
        {
          title: "Choosing What to Sell",
          minutes: 22,
          video: { search: "how to choose product to sell online product research criteria" },
          body: `
## The most expensive mistake happens here

Almost every failed shop failed at product choice, not at marketing. Spend real time on this.

## What makes a product work online

- **Margin.** After the product, packaging, courier and returns, is there enough left? Under about 30% gross margin, cash on delivery will eat you.
- **Ships well.** Small, light, hard to break, not perishable. A large fragile item multiplies every cost.
- **Not available on every street.** If the buyer can get it from the corner shop today, they will.
- **Hard to compare on price alone.** Commodity goods become a race to the bottom you cannot win against a large importer.
- **Repeat purchase**, ideally. The second sale to the same customer costs you nothing to acquire.

## What to avoid at the start

Fragile glass, anything with sizing that varies by brand, high-value electronics at risk of theft in transit, counterfeits of any kind, and anything requiring a licence you do not hold.

## Finding candidates

- What do people in your area already ask for and struggle to find?
- What does your family already make, source or have access to?
- Search Daraz for a category and sort by number of reviews — reviews prove real demand
- Read one-star reviews of popular products. Every complaint is a gap.

## The honest test

Write the exact sentence you would use to sell it. If it does not sound compelling to you, it will not sound compelling to a stranger with money.
`.trim(),
        },
        {
          title: "Costing, Pricing and Margin",
          minutes: 24,
          video: { search: "product pricing margin calculation ecommerce cost of goods breakeven" },
          body: `
## Landed cost, not purchase price

What a product truly costs you by the time it can be sold:

- Purchase price
- Transport to you
- Any duty or tax
- Packaging
- Your time handling it

Add all of it. Sellers who price against the purchase price alone lose money on every order and take months to notice.

## The costs that arrive later

- **Courier charge**, both directions on a return
- **Cash on delivery fee** taken by the courier
- **Return losses** — a refused parcel costs you delivery, return delivery, and sometimes the product
- **Payment gateway fee**, if you take cards
- **Marketplace commission** on Daraz
- **Advertising** to acquire the customer

## Contribution margin

Selling price, minus every variable cost of that one sale. What is left contributes to your fixed costs and then to profit.

Work it out per product, in rupees, not percentages. Percentages hide small absolute numbers.

## Break-even

Fixed costs divided by contribution margin per unit tells you how many you must sell each month before you earn anything. If that number is implausible, the problem is the product or the price, and no amount of marketing will fix it.

## Pricing

Cost-plus is the floor, not the answer. Price against what the customer compares you to, what your reputation is worth, and what the product does for them. Being the cheapest is the weakest position in retail, and the easiest for a competitor to take.
`.trim(),
        },
        {
          title: "Testing Demand Before You Build",
          minutes: 18,
          video: { search: "validate product demand before launching online store test" },
          body: `
## Do not build a shop for a product nobody wants

Building first and testing afterwards is how people spend three months and fifty thousand rupees learning something they could have learned in a week.

## Cheap tests, in order of cost

1. **Search volume.** Is anyone looking for this? Use Keyword Planner and Daraz's own search suggestions.
2. **Competitor evidence.** Products with hundreds of genuine reviews prove a market exists. No competition usually means no demand, not an untapped opportunity.
3. **One post.** Photograph the product properly and post it to your own social account with a price. Count the enquiries.
4. **A single listing.** List one item on Daraz or Facebook Marketplace before building anything.
5. **Pre-orders.** The strongest signal there is: people paying before it exists.

## Reading the result honestly

Likes are not demand. Comments saying "nice" are not demand. Demand is somebody asking the price and then asking how to pay.

If ten people ask the price and none order, the problem is usually price or trust, and you have learned something valuable for a hundred rupees.

## When to stop

Set the test's threshold before you run it — "if fewer than five people ask to buy in two weeks, I choose another product". Deciding afterwards means deciding emotionally, and everyone is optimistic about their own idea.
`.trim(),
        },
      ],
      quiz: {
        title: "Module 1 Quiz — The Business Before the Website",
        passingScore: 60,
        questions: [
          {
            prompt: "Why does cash on delivery change how you run an online shop in Pakistan?",
            type: "multiple",
            options: [
              { text: "It affects cash flow, because you are paid after delivery", correct: true },
              { text: "It raises the return and refusal rate", correct: true },
              { text: "It means you carry the courier cost on refused parcels", correct: true },
              { text: "It removes the need for product photography" },
            ],
          },
          {
            prompt: "What is 'landed cost'?",
            options: [
              { text: "Everything the product costs you before it can be sold", correct: true },
              { text: "The price you paid the supplier" },
              { text: "The courier's delivery charge" },
              { text: "The price shown to the customer" },
            ],
          },
          {
            prompt: "A product category on Daraz has almost no competition. What does that usually mean?",
            options: [
              { text: "There is probably no demand", correct: true },
              { text: "You have found an untapped opportunity" },
              { text: "The category is new" },
              { text: "Daraz has hidden the listings" },
            ],
            explanation:
              "Absence of competition is far more often evidence that nobody wants it than evidence of a gap.",
          },
          {
            prompt: "Which products are poor choices for a beginner?",
            type: "multiple",
            options: [
              { text: "Fragile glassware", correct: true },
              { text: "High-value electronics", correct: true },
              { text: "Clothing where sizing varies by brand", correct: true },
              { text: "Small, light, non-perishable goods" },
            ],
          },
          {
            prompt: "How should you calculate contribution margin?",
            options: [
              { text: "Selling price minus every variable cost of that one sale, in rupees", correct: true },
              { text: "Selling price minus purchase price, as a percentage" },
              { text: "Total revenue minus total costs for the month" },
              { text: "Selling price divided by cost" },
            ],
          },
          {
            prompt: "Ten people ask your price on a test post and nobody orders. What has this told you?",
            options: [
              { text: "There is interest, but price or trust is blocking the sale", correct: true },
              { text: "Nothing useful" },
              { text: "The product has no demand" },
              { text: "You should double the advertising budget" },
            ],
          },
          {
            prompt: "Why set the threshold for a demand test before running it?",
            options: [
              { text: "Deciding afterwards means deciding emotionally about your own idea", correct: true },
              { text: "Platforms require a stated target" },
              { text: "It makes the test cheaper" },
              { text: "It is needed for tax purposes" },
            ],
          },
        ],
      },
      assignment: {
        title: "Assignment 1 — Product research and costing",
        maxPoints: 100,
        instructions: `
Choose **three candidate products** you could realistically sell. At least one must be something you or your family can already source.

Submit:

1. **A comparison table** of the three, scored against the five criteria from the lesson: margin, ships well, availability locally, comparability on price, repeat purchase.
2. **A full landed-cost breakdown** for your chosen one, in rupees, itemised — purchase, transport, packaging, courier, cash-on-delivery fee, expected return loss. State your source for every figure. "Approximately" scores nothing; ring a courier and ask.
3. **Contribution margin per unit** and your **monthly break-even quantity**, with the working shown.
4. **Competitor evidence.** Three real listings for the same or similar product, with URLs, their prices, and what their reviews complain about.
5. **Your demand test.** What you will do, and the threshold you have set in advance for continuing or abandoning it.

You will use this product for the rest of the course, so choose something you can actually obtain.
`.trim(),
      },
    },

    {
      title: "Module 2 — Where to Sell",
      summary:
        "Marketplace, own website, or social selling — the trade-offs, and building whichever you choose.",
      lessons: [
        {
          title: "Marketplace, Own Site or Social",
          minutes: 20,
          video: { search: "marketplace vs own website ecommerce pros cons comparison" },
          body: `
## Three routes, three different businesses

**Marketplace — Daraz.** The buyers are already there and they already trust the platform. You compete on price beside identical products, pay commission, and never own the customer relationship. Fastest first sale, thinnest margin.

**Your own site — Shopify, WooCommerce.** You own the margin, the customer list and the brand. You must also bring every single visitor yourself, which is the hard part nobody mentions. Slowest start, best long-term business.

**Social selling — Instagram, Facebook, WhatsApp.** Almost no setup, and it is where a great deal of Pakistani commerce actually happens. Manual, hard to scale, and everything you build sits on somebody else's platform.

## The realistic path

Most successful small sellers do this in order:

1. Prove demand on social or a marketplace, where buyers already are
2. Build the site once there is something proven to sell
3. Use the marketplace for discovery and the site for margin and repeat buyers

Starting with a beautiful website and no audience is the most common and most expensive mistake in this trade.

## How to choose now

- Need a sale this month, with no budget? Social or marketplace.
- Have a distinctive product and some patience? Own site.
- Selling a commodity where price is the only difference? Marketplace, and accept the margin.

Whatever you choose, you must be able to defend it in Assignment 2.
`.trim(),
        },
        {
          title: "Setting Up a Shopify or WooCommerce Store",
          minutes: 28,
          video: { search: "shopify store setup tutorial beginners step by step 2026" },
          body: `
## Which one

**Shopify** — a monthly fee in dollars, everything included, almost nothing to maintain, and you can be selling in a day. The fee is the barrier for many Pakistani sellers.

**WooCommerce on WordPress** — cheap local hosting, no monthly platform fee, endless flexibility, and you are responsible for updates, backups and anything that breaks. More work, more control, and a far more employable skill.

For a client project, WooCommerce usually wins on cost. For your own first shop, Shopify's trial is the faster way to learn the concepts.

## What to set up, in order

1. **Store details** — name, address, currency in PKR, contact
2. **Products** — title, description, images, price, stock, weight. Weight matters; couriers charge by it.
3. **Collections or categories** — how a browsing customer finds things
4. **Shipping zones and rates** — by city or region, with real courier prices
5. **Payment methods** — cash on delivery first, bank transfer second, gateway third
6. **Policies** — returns, shipping, privacy. Required, and customers read them.
7. **Essential pages** — about, contact, FAQ
8. **A test order**, placed by you, start to finish

## The test order matters most

Place a real order on your own shop. Pay for it. Receive the confirmation email. Look at what the customer sees at every step.

Most broken shops have never been through their own checkout. Faults you will only find this way: missing shipping to a city, a confirmation email that never arrives, a form that rejects a Pakistani phone number.
`.trim(),
        },
        {
          title: "Selling on Daraz",
          minutes: 24,
          video: { search: "daraz seller account setup product listing tutorial pakistan" },
          body: `
## Why it is worth the commission

Daraz has the buyers, the trust and the courier network. For a new seller with no audience, that is worth a great deal.

## Getting started

You will need a CNIC, a bank account in your own name, and a phone number. The account must be yours — selling through someone else's account leaves you with no claim to the money or the shop.

## Listing well

The listing is the whole shop. Competitors are one tap away.

- **Title.** Brand, product, key specification, size. Written for search, readable by a human.
- **Main image.** White background, product filling the frame, no text overlays. Platform rules are strict and rejections are slow.
- **Additional images.** Angles, detail, scale, in use.
- **Description.** Specifications as a list, then what it is for, then what is in the box.
- **Variations** — size and colour on one listing, not five separate ones.
- **Category and attributes.** Filled in completely. This is how filters find you.

## What decides your ranking

Sales, conversion rate, review score, on-time dispatch, and cancellation rate. The last two are within your control from day one, and most new sellers lose on them.

Ship the same day. Never cancel an order you could fulfil. A cancellation costs more in ranking than the order was worth.

## The trap

It is easy to become dependent on a marketplace, competing on price, with no customer list of your own. Use it for discovery and cash flow; build something you own alongside it.
`.trim(),
        },
        {
          title: "Selling Through Instagram and WhatsApp",
          minutes: 18,
          video: { search: "instagram shop whatsapp business catalog selling small business" },
          body: `
## The shop most Pakistani sellers actually start with

No hosting, no monthly fee, and the customers are already scrolling. Done properly it is a serious business; done carelessly it is chaos.

## Set it up as a shop, not a page

- **Business account**, with contact buttons and a location
- **Instagram Shopping** or a linked catalogue if eligible
- **WhatsApp Business** with the full product catalogue and prices
- **Highlights** for categories, sizing, delivery, reviews and how to order
- **A pinned post** explaining exactly how to order, pay and receive

## State the price

"DM for price" costs you more customers than it protects. Buyers assume it means expensive, or that the price changes by customer — and one of those is usually true, which is exactly why they distrust it.

## Keep records

The failure point is order tracking. Once you have twenty orders a week in a WhatsApp thread, orders get missed and customers get angry.

Keep a simple sheet from the first order: date, customer, item, price, address, courier, tracking number, paid, delivered. A free spreadsheet is enough for a long time.

## Proof

Screenshot every happy customer message and post it, with permission. In a market where buyers have been cheated, other buyers' words are worth more than anything you can say about yourself.
`.trim(),
        },
      ],
      quiz: {
        title: "Module 2 Quiz — Where to Sell",
        passingScore: 60,
        questions: [
          {
            prompt: "What is the main advantage of a marketplace like Daraz for a new seller?",
            options: [
              { text: "The buyers and their trust in the platform are already there", correct: true },
              { text: "Higher margins than your own website" },
              { text: "You own the customer relationship" },
              { text: "There is no commission" },
            ],
          },
          {
            prompt: "What is the hard part of running your own website that people underestimate?",
            options: [
              { text: "You must bring every visitor yourself", correct: true },
              { text: "Building the site" },
              { text: "Choosing a theme" },
              { text: "Writing the returns policy" },
            ],
          },
          {
            prompt: "Why must you place a real test order on your own shop?",
            type: "multiple",
            options: [
              { text: "To find cities missing from shipping settings", correct: true },
              { text: "To check the confirmation email actually arrives", correct: true },
              { text: "To catch forms that reject Pakistani phone numbers", correct: true },
              { text: "Because the platform requires one before launch" },
            ],
          },
          {
            prompt: "Which two Daraz metrics can a brand-new seller control immediately?",
            options: [
              { text: "On-time dispatch and cancellation rate", correct: true },
              { text: "Sales volume and review score" },
              { text: "Conversion rate and category ranking" },
              { text: "Commission rate and courier choice" },
            ],
          },
          {
            prompt: "Whose name must a Daraz seller account be in?",
            options: [
              { text: "Your own — CNIC and bank account both", correct: true },
              { text: "Anyone's, as long as you have the login" },
              { text: "A registered company's, always" },
              { text: "The courier's" },
            ],
          },
          {
            prompt: "What is the usual failure point of selling through WhatsApp?",
            options: [
              { text: "Order tracking — orders get missed once volume rises", correct: true },
              { text: "Customers cannot find the catalogue" },
              { text: "WhatsApp charges commission" },
              { text: "Photographs cannot be sent" },
            ],
          },
          {
            prompt: "What is the recommended order for most small sellers?",
            options: [
              { text: "Prove demand on social or a marketplace, then build the site", correct: true },
              { text: "Build the website first, then find customers" },
              { text: "Launch on all three simultaneously" },
              { text: "Only ever use a marketplace" },
            ],
          },
        ],
      },
      assignment: {
        title: "Assignment 2 — Build the shop",
        maxPoints: 150,
        instructions: `
Build a **working shop** for the product you chose in Assignment 1. Shopify trial, WooCommerce, Daraz or a fully configured Instagram and WhatsApp catalogue — your choice.

Submit:

1. **The live link**, working, that the instructor can open.
2. **Your justification**, half a page: why this route rather than the other two, in terms of your product, your budget and your audience.
3. **At least five products listed** — or five variations, if you sell one item — each with title, description, price, stock, weight and images.
4. **Configuration evidence.** Screenshots of shipping zones with real rates, payment methods enabled, and your returns and shipping policies.
5. **Proof of a test order.** Screenshots of the full journey: cart, checkout, confirmation page, confirmation email. State every fault you found and fixed. Finding faults scores marks — a report claiming everything worked first time is not believed.

This is worth 150 marks and carries into every later module. Do not rush it.
`.trim(),
      },
    },

    {
      title: "Module 3 — Product Content That Sells",
      summary: "Photography, titles, descriptions and reviews — the things that replace a shopkeeper.",
      lessons: [
        {
          title: "Product Photography With a Phone",
          minutes: 24,
          video: { search: "product photography smartphone white background lighting setup cheap" },
          body: `
## Your photographs are your shop

A customer cannot pick the item up. The photograph does everything the shopkeeper would have done — showing quality, scale, colour and condition.

Bad photographs are the single most common reason a good product does not sell online.

## The cheap setup that works

- A window with daylight, and the product facing it
- A sheet of white or plain card, curved up behind the product so there is no corner line
- The phone braced on books or a cheap tripod
- A second sheet of white card opposite the window, bouncing light back to soften shadows

Total cost: under a thousand rupees. This setup produces images good enough for Daraz's strict main-image rules.

## The shots every product needs

1. **Main** — whole product, white background, filling the frame, no text
2. **Angles** — at least three
3. **Detail** — stitching, material, finish, whatever proves quality
4. **Scale** — beside a hand or a common object
5. **In use** — worn, installed, or in a real room
6. **What arrives** — the box and everything in it

## Editing

Crop, straighten, lift exposure slightly, increase contrast slightly, remove dust. Stop there.

Do not alter the colour. A customer who receives a different shade than they saw will return it, and you will pay both courier charges and lose the review.
`.trim(),
        },
        {
          title: "Writing Titles and Descriptions",
          minutes: 20,
          video: { search: "write product title description ecommerce seo conversion" },
          body: `
## The title does two jobs

It must be found by search, and it must be understood by a human in one glance.

A workable pattern: **Brand — Product — Key specification — Size or variant.**

"Khaadi Unstitched Lawn 3 Piece Suit — Summer 2026 — Blue" works. "Beautiful Dress ❤️ Best Quality ❤️" does not, on either count.

Do not stuff the title with every keyword you can think of. Marketplaces penalise it and shoppers distrust it.

## The description

Answer, in this order:

1. **What it is**, in one sentence
2. **Specifications**, as a list — size, material, weight, contents, compatibility
3. **What it is for**, and who it suits
4. **What is in the box**
5. **Care or usage**, if relevant
6. **Delivery and returns**, briefly

## Answer the objections

Every question a customer asks in the DMs is a fault in your description. Write them down and answer them in the listing:

- Is this the original or a copy?
- Will it fit me?
- Is the colour exactly as shown?
- How long is delivery to my city?
- What if it does not fit?

Each answered objection removes a reason not to buy and a message you would otherwise have to reply to.

## Honesty

Describe faults. "Slight variation in print position" prevents a return and a one-star review. Overselling costs more than it earns, every time, and it costs it later, when you have more to lose.
`.trim(),
        },
        {
          title: "Reviews, Ratings and Trust",
          minutes: 18,
          video: { search: "get product reviews ecommerce trust signals social proof" },
          body: `
## Trust is the thing you are short of

A new shop has no reputation. Every trust signal you can honestly show is worth more than another advertisement.

## What builds it

- **Reviews with photographs** from real buyers
- **A real address and a real phone number**, answered
- **A clear returns policy**, in plain words
- **Your face**, or the team's — anonymous shops are assumed to be risky
- **Screenshots of customer messages**, with permission
- **Consistent, prompt replies** in public

## Getting the first reviews

Ask. Most satisfied customers will leave one if asked directly and made it easy:

- A message a few days after delivery, once they have used it
- A card in the parcel with a short link or QR code
- Ask for a photograph — a photo review is worth several text ones

## Never buy reviews

Marketplaces detect patterns and suspend sellers, usually with the money still in the account. On your own site, fake reviews are worse: a customer who realises destroys you publicly, and they are right to.

The rule is simple and not negotiable: only real buyers, only real words.

## Bad reviews

Reply publicly, once, briefly, without arguing. Fix the problem, say what you fixed, and move on.

A shop with nothing but five-star reviews reads as fake. A few honest three-star reviews answered well make the good ones believable.
`.trim(),
        },
      ],
      quiz: {
        title: "Module 3 Quiz — Product Content",
        passingScore: 60,
        questions: [
          {
            prompt: "Why must you not adjust colour when editing product photographs?",
            options: [
              { text: "The customer returns an item that does not match, and you pay both courier charges", correct: true },
              { text: "Marketplaces ban colour editing" },
              { text: "It makes the file size too large" },
              { text: "It is only a problem for clothing" },
            ],
          },
          {
            prompt: "Which title follows the recommended pattern?",
            options: [
              { text: "Khaadi Unstitched Lawn 3 Piece Suit — Summer 2026 — Blue", correct: true },
              { text: "Beautiful Dress Best Quality Cheap Price" },
              { text: "New Arrival!!! Must Buy!!!" },
              { text: "dress blue cotton suit lawn khaadi summer cheap best quality original" },
            ],
          },
          {
            prompt: "A customer keeps asking in messages whether the colour is exactly as shown. What does that indicate?",
            options: [
              { text: "A fault in your description that should be answered in the listing", correct: true },
              { text: "A difficult customer" },
              { text: "A problem with the photographs only" },
              { text: "Nothing — some customers always ask" },
            ],
          },
          {
            prompt: "Which shots does every product listing need?",
            type: "multiple",
            options: [
              { text: "A main shot on white, filling the frame", correct: true },
              { text: "A detail shot proving quality", correct: true },
              { text: "Something showing scale", correct: true },
              { text: "A shot with promotional text across it" },
            ],
          },
          {
            prompt: "Why does a shop with only five-star reviews read as untrustworthy?",
            options: [
              { text: "It looks fake; a few honest lower ratings make the good ones believable", correct: true },
              { text: "Platforms reduce the ranking of such shops" },
              { text: "Customers prefer cheap shops" },
              { text: "It does not — it is ideal" },
            ],
          },
          {
            prompt: "What is the most effective way to get your first reviews?",
            options: [
              { text: "Ask satisfied buyers directly a few days after delivery, and make it easy", correct: true },
              { text: "Buy a small number to get started" },
              { text: "Wait — they arrive on their own" },
              { text: "Offer a discount for five-star ratings only" },
            ],
          },
        ],
      },
      assignment: {
        title: "Assignment 3 — Photograph and write your listings",
        maxPoints: 120,
        instructions: `
Rebuild the content of your shop properly.

1. **Photograph one product fully yourself** — the six shot types from the lesson, minimum eight images. Include one photograph *of your setup* so the instructor can see the window, the card and the phone. Stock images score zero.
2. **A before-and-after.** Your worst original image beside its replacement, with two sentences on what changed.
3. **Rewritten titles for all five products**, following the pattern, with character counts.
4. **One full description**, containing all six sections, and answering at least five objections. List the objections separately and say where each came from — a real message, a competitor's reviews, or your own guess, labelled honestly.
5. **A review plan.** Exactly what you will send, when, and how you will make leaving a photo review easy.

Update the live shop with this work before submitting, and say so.
`.trim(),
      },
    },

    {
      title: "Module 4 — Payments, Delivery and Returns",
      summary:
        "Getting paid, getting the parcel there, and handling the part of the business that goes wrong.",
      lessons: [
        {
          title: "Taking Payment in Pakistan",
          minutes: 22,
          video: { search: "online payment methods pakistan cash on delivery gateway ecommerce" },
          body: `
## Cash on delivery

Still how most orders are paid. Offer it — refusing it costs you most of your market — but understand the cost:

- The courier holds your money for one to three weeks
- A fee is charged on the collected amount
- Refused parcels cost you delivery both ways
- Buyers order more casually when no money changes hands upfront, so refusal rates are higher

**Reduce refusals:** confirm every order by call or WhatsApp before dispatch. This one habit cuts refusals substantially, and takes a minute per order.

## Bank transfer and wallets

Transfer to your account, or to a mobile wallet, with a screenshot as proof. Cheap and immediate, and many buyers prefer it.

Give the customer a **reference** and check the statement yourself. Never dispatch on a screenshot alone — edited screenshots are common and convincing.

## Payment gateways

Card and wallet payments through a local provider. You will typically need business registration, a bank account and some paperwork, and you will pay a percentage plus a fixed fee.

Worth it once volume justifies it, and necessary if you sell to customers abroad. Not where a beginner starts.

## Reconciliation

Whatever you accept, check weekly that money received matches orders delivered. Courier remittances are frequently short — a missing parcel, a fee applied twice, an order marked delivered that was returned.

Nobody will find these for you. A seller who does not reconcile loses real money quietly, every month.
`.trim(),
        },
        {
          title: "Couriers and Fulfilment",
          minutes: 22,
          video: { search: "courier services pakistan ecommerce shipping packaging tracking" },
          body: `
## Choosing a courier

Compare on: cities covered, cash-on-delivery fee, remittance speed, return charges, damage record, and whether a human answers the phone when a parcel goes missing. That last one matters far more than a small price difference.

Most sellers end up using two — one strong in major cities, one better in smaller towns.

## Packing

- Pack for a parcel being dropped, because it will be
- Waterproof outer layer; rain and wet floors ruin cartons
- Fragile items suspended in padding, not resting against the wall of the box
- Invoice inside, address label clearly printed and taped over
- Something small and human inside — a thank-you card costs a rupee and earns reviews

## The dispatch routine

1. Confirm the order with the customer
2. Pack and weigh
3. Book the shipment and record the tracking number against the order
4. Send the tracking number to the customer, unprompted
5. Mark it dispatched in your sheet

Consistency here prevents most customer complaints before they happen.

## When it goes wrong

Parcels are lost, delayed and damaged. What decides whether you keep the customer is speed and honesty, not whose fault it was.

Tell them before they have to ask. Offer the remedy immediately. Then pursue the courier's claim yourself, in your own time — that is your problem, not the customer's, and treating it as theirs is how shops lose people permanently.
`.trim(),
        },
        {
          title: "Returns, Refunds and Complaints",
          minutes: 20,
          video: { search: "ecommerce returns policy refund process customer complaints handling" },
          body: `
## Returns are a cost of the business

Plan for them and price for them. A seller who treats every return as an outrage ends up arguing with customers and losing the reviews that bring the next ones.

## Write the policy properly

State plainly: how long they have, what condition the item must be in, who pays return postage, how long a refund takes, and what is not returnable. Put it where it can be found before purchase, not after.

A clear policy **increases** sales. Uncertainty is what stops people buying.

## Reducing returns

Most returns are caused by the listing, not the customer:

- Wrong size — publish a measured size chart, in inches and centimetres
- Not as pictured — fix the photographs and describe faults
- Damaged — improve packing
- Changed mind — confirm cash-on-delivery orders before dispatch
- Late — give an honest delivery estimate rather than an optimistic one

Track the reason for every return. After twenty you will see exactly which listing is costing you money.

## Handling complaints

1. Reply quickly, even if only to say you are looking into it
2. Apologise for the situation without arguing about fault
3. Offer the remedy — replace, refund, or collect
4. Do it, and confirm when it is done
5. Fix whatever caused it

## Where the profit really goes

A refused cash-on-delivery parcel costs delivery, return delivery, packing, and your time — on an order that earned nothing. Two or three of those can wipe out the profit on ten good orders. This is why the confirmation call matters.
`.trim(),
        },
      ],
      quiz: {
        title: "Module 4 Quiz — Payments, Delivery and Returns",
        passingScore: 60,
        questions: [
          {
            prompt: "What is the single most effective way to reduce cash-on-delivery refusals?",
            options: [
              { text: "Confirm every order by call or WhatsApp before dispatch", correct: true },
              { text: "Charge a deposit on every order" },
              { text: "Refuse cash on delivery entirely" },
              { text: "Use a more expensive courier" },
            ],
          },
          {
            prompt: "A customer sends a screenshot showing they transferred the money. What should you do?",
            options: [
              { text: "Check your own bank statement before dispatching", correct: true },
              { text: "Dispatch immediately — a screenshot is proof" },
              { text: "Ask for a second screenshot" },
              { text: "Cancel the order" },
            ],
            explanation: "Edited screenshots are common and convincing. The statement is the only proof.",
          },
          {
            prompt: "Why must you reconcile courier remittances weekly?",
            options: [
              { text: "Remittances are often short, and nobody else will find it", correct: true },
              { text: "It is a legal requirement" },
              { text: "Couriers charge a fee for late reconciliation" },
              { text: "To keep the marketplace ranking high" },
            ],
          },
          {
            prompt: "Which factor matters most when choosing a courier?",
            options: [
              { text: "Whether a human answers when a parcel goes missing", correct: true },
              { text: "The lowest price per parcel" },
              { text: "The size of the company" },
              { text: "Whether they have an app" },
            ],
          },
          {
            prompt: "A parcel is lost in transit. What is the right sequence?",
            options: [
              { text: "Tell the customer before they ask, remedy it immediately, then pursue the courier yourself", correct: true },
              { text: "Wait for the customer to complain, then explain it is the courier's fault" },
              { text: "Tell the customer to contact the courier" },
              { text: "Refund only after the courier pays the claim" },
            ],
          },
          {
            prompt: "Why does a clear returns policy increase sales?",
            options: [
              { text: "Uncertainty is what stops people buying", correct: true },
              { text: "It is required before a shop can launch" },
              { text: "It reduces the number of returns to zero" },
              { text: "Search engines rank it higher" },
            ],
          },
          {
            prompt: "Which are common listing-caused reasons for returns?",
            type: "multiple",
            options: [
              { text: "No measured size chart", correct: true },
              { text: "Photographs that do not match the item", correct: true },
              { text: "An optimistic delivery estimate", correct: true },
              { text: "Offering cash on delivery" },
            ],
          },
        ],
      },
      assignment: {
        title: "Assignment 4 — Operations plan",
        maxPoints: 120,
        instructions: `
Make your shop ready to actually take and fulfil orders.

1. **Payment setup.** Which methods you accept and why. Screenshots of each configured. State your cash-on-delivery fee and remittance period, taken from the courier's real published terms.
2. **Courier comparison.** Three real couriers compared in a table on cities, COD fee, remittance speed, return charge and how you contact them in a dispute. State which you chose and why. Ring at least one and say what they told you.
3. **Your packing standard.** Photographs of a parcel you have actually packed, inside and out, with what each layer is for.
4. **Written policies.** Returns, shipping and privacy, in your own words, published on the shop. Include the links.
5. **A size chart or specification table**, measured by you, for one product.
6. **Your order tracking sheet**, with columns filled in for at least three imaginary orders through to delivery.

The policies must be your own writing. Copied policy text from another shop scores zero and, if published, is somebody else's copyright.
`.trim(),
      },
    },

    {
      title: "Module 5 — Getting Customers and Growing",
      summary: "Traffic, repeat buyers, and the numbers that say whether any of it is working.",
      lessons: [
        {
          title: "Bringing Traffic to the Shop",
          minutes: 22,
          video: { search: "ecommerce traffic sources marketing strategy new online store" },
          body: `
## An empty shop is the normal state

Building the shop was the easy half. Nobody arrives on their own.

## Where the first customers come from

- **People you already know.** Family, friends, neighbours, your existing customers if you have a physical shop. Unglamorous, and it is how almost every small shop starts.
- **Marketplace listings.** Buyers already searching.
- **Local Facebook groups**, where allowed by the group's rules.
- **Instagram and TikTok**, posting the product in use rather than advertising it.
- **WhatsApp status.** Underrated, free, and seen by exactly the people most likely to trust you.
- **Paid ads**, once you know your numbers well enough to know what a customer is worth.

## Product-level SEO

For your own site, each product page can rank:

- A title that matches what people search
- A description written for humans that contains those words naturally
- Image alt text
- A category structure Google can follow
- Reviews on the page — they add the words real buyers use

## The rule about paid advertising

Do not advertise until you know your contribution margin per order. Without it you cannot tell a successful campaign from an expensive one, and the money goes quickly.

Module 1's costing is not an academic exercise; this is what it is for.
`.trim(),
        },
        {
          title: "Repeat Customers and Retention",
          minutes: 18,
          video: { search: "customer retention ecommerce repeat purchase email whatsapp" },
          body: `
## The second sale is the profitable one

Acquiring a customer costs money. Selling to them again costs almost nothing. Shops that survive are the ones where a meaningful share of customers come back.

Most small sellers ignore this completely, chasing new buyers while the old ones forget them.

## Keeping the relationship

- **Ask permission** to message about new stock, at the point of sale
- **A broadcast list**, not a group
- **Tell them when something sold out returns** — this is welcomed, not resented
- **Message after delivery** to check it arrived well. It costs a minute and prevents most bad reviews
- **Remember what they bought**, so the next message is relevant

## Things worth doing

- A small discount on the second order, offered in the parcel
- Early access for previous customers when new stock lands
- A genuine thank-you at Eid or on the shop's anniversary

## Things not worth doing

Daily broadcasts, discounts so frequent that nobody buys at full price, and loyalty schemes too complicated to explain in one sentence.

## Measuring it

Track how many customers have ordered more than once, and what a customer spends with you over a year. If that number is not rising, the shop is running to stand still — and no amount of new traffic fixes a leaking bucket.
`.trim(),
        },
        {
          title: "Knowing Whether You Are Profitable",
          minutes: 22,
          video: { search: "ecommerce metrics conversion rate aov customer acquisition cost profit" },
          body: `
## Revenue is not profit

Plenty of busy shops lose money. The owner sees orders arriving and assumes it is working, while every order quietly costs more than it earns.

## The numbers that matter

- **Conversion rate** — visitors who buy. Roughly 1–3% is normal on a small shop.
- **Average order value** — total revenue divided by orders
- **Contribution margin per order** — after product, packing, courier, COD fee and returns
- **Customer acquisition cost** — total marketing spend divided by new customers
- **Return and refusal rate**, by product
- **Repeat purchase rate**

## The test

**Contribution margin per order must exceed customer acquisition cost.** If it does not, every new customer makes you poorer, and growth makes it worse rather than better.

## Simple improvements, in order of effect

1. **Raise conversion rate.** Better photographs, clearer descriptions, honest delivery times, visible reviews. Free, and it improves every other number.
2. **Raise average order value.** Bundles, a second item suggested at checkout, free delivery above a threshold you have calculated.
3. **Cut returns.** Size charts, confirmation calls, better packing.
4. **Then, and only then, spend more on traffic.**

Most sellers do this in reverse — spending on advertising to push traffic at a shop that converts badly, which is the most expensive possible order to do it in.

## Keep records from day one

A single spreadsheet with orders, costs and marketing spend is enough. Reconstructing a year of this later is impossible, and the shops that fail usually cannot say when they started losing money.
`.trim(),
        },
      ],
      quiz: {
        title: "Module 5 Quiz — Customers and Profitability",
        passingScore: 60,
        questions: [
          {
            prompt: "What must be true for paid advertising to be sustainable?",
            options: [
              { text: "Contribution margin per order exceeds customer acquisition cost", correct: true },
              { text: "Revenue is growing month on month" },
              { text: "The conversion rate is above 5%" },
              { text: "The advertising budget is under 10% of revenue" },
            ],
          },
          {
            prompt: "Which should you improve first in a shop that converts badly?",
            options: [
              { text: "Conversion rate — it is free and improves every other number", correct: true },
              { text: "Traffic, by spending more on ads" },
              { text: "The number of products listed" },
              { text: "The courier contract" },
            ],
          },
          {
            prompt: "Why is the second sale to a customer more profitable than the first?",
            options: [
              { text: "It costs almost nothing to acquire", correct: true },
              { text: "The product costs less the second time" },
              { text: "Couriers discount repeat addresses" },
              { text: "Returns are not possible on repeat orders" },
            ],
          },
          {
            prompt: "Which are sensible retention tactics?",
            type: "multiple",
            options: [
              { text: "Telling previous buyers when a sold-out item returns", correct: true },
              { text: "A message after delivery checking it arrived well", correct: true },
              { text: "A small discount offered inside the parcel", correct: true },
              { text: "Daily broadcast messages to the whole list" },
            ],
          },
          {
            prompt: "A shop takes many orders every week but the owner has no savings after a year. What is the likely explanation?",
            options: [
              { text: "Contribution margin per order is negative or near zero", correct: true },
              { text: "Not enough traffic" },
              { text: "The website design is poor" },
              { text: "Too few products listed" },
            ],
          },
          {
            prompt: "Why keep records from the very first order?",
            options: [
              { text: "Reconstructing them later is impossible, and shops that fail usually cannot say when they started losing money", correct: true },
              { text: "Marketplaces require an audit trail" },
              { text: "It improves search ranking" },
              { text: "Couriers ask for it" },
            ],
          },
        ],
      },
      assignment: {
        title: "Final assignment — Run the shop and account for it",
        maxPoints: 200,
        instructions: `
This replaces an examination.

Run your shop for **at least three weeks** and report on it honestly.

1. **What you did to get customers.** Every channel tried, what it cost in money and hours, and what each produced.
2. **The numbers.** Visitors, orders, conversion rate, average order value, contribution margin per order, returns and refusals with reasons, and customer acquisition cost if you spent anything. Show the workings.
3. **Your order record.** The actual sheet, complete, from first enquiry to delivery.
4. **The honest verdict.** Is this shop profitable? If it is not, at what order volume would it become so, and is that realistic? Show the arithmetic.
5. **Three changes** you would make next, in priority order, each with the reason from your own data.
6. **What went wrong.** At least one failure — a lost parcel, a bad review, a product that did not sell — what it cost and what you changed.

**Marking:** a shop with four real orders, properly costed and honestly analysed, scores far higher than a claim of forty orders with no records. Invented figures are usually obvious and score zero.
`.trim(),
      },
    },
  ],
};
