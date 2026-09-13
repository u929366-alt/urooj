import type { CourseContent } from "./types.ts";

/**
 * Marked "navttc_aligned" on Hunarsaaz's instruction — see the note in
 * digital-marketing.ts. The claim has not been checked against NAVTTC's
 * curriculum document, which could not be reached when this was written.
 *
 * Tool choice is deliberate: the course teaches principles first, then Canva,
 * then the Adobe and Affinity equivalents. A student who can only click
 * through one program has learned software, not design, and cannot take a
 * client brief.
 */
export const graphicDesign: CourseContent = {
  slug: "graphic-design",
  title: "Graphic Design",
  summary:
    "Design that works, not just design that looks busy — type, colour, layout and brand, taught through real briefs and finished for print and screen.",
  description: `
Most graphic design taught online is a software tutorial with a certificate attached. You finish able to follow along in one program and unable to answer the only question a client actually asks: why does it look like that?

This course teaches the judgement first. Why one typeface reads as trustworthy and another as cheap. Why a poster with everything centred looks amateur. Why the file that looked perfect on screen printed muddy and two shades too dark.

You will work in Canva, because it is free and it is what most Pakistani small businesses will hand you. You will also learn what the professional tools do differently, so that a client asking for a print-ready file, a vector logo or a layered source file does not end the conversation.

Every module ends with a real brief — a shop's logo, a poster, a social set, a menu — and a critique. By the end you will have a portfolio of finished work and the vocabulary to defend it.

No drawing ability is required. Design is decision-making, not illustration.
`.trim(),

  sector: "Information Technology",
  courseCode: "HS-GD-01",
  nvqfLevel: "2",
  recognition: "navttc_aligned",

  level: "beginner",
  language: "both",
  durationWeeks: 12,
  price: 0,
  programSlug: "graphic-design",

  prerequisites:
    "Basic computer use and a free Canva account. A laptop or desktop is strongly recommended — the layout work is difficult on a phone. No drawing ability and no prior design experience needed.",
  targetLearners:
    "Beginners wanting a skill that earns quickly, small business owners who currently pay someone else for every banner, and anyone moving towards freelance or in-house creative work.",

  objectives: [
    "Apply the principles of layout, hierarchy, type and colour deliberately rather than by instinct.",
    "Take a client brief, ask the right questions, and produce work that answers it.",
    "Work confidently in Canva, and understand what professional tools add.",
    "Build a simple, consistent brand identity and the rules that keep it consistent.",
    "Prepare correct files for print and for screen, and know why they differ.",
    "Present, defend and revise work without losing either the design or the client.",
  ],
  outcomes: [
    "Explain why a design works using the vocabulary of hierarchy, contrast, alignment and spacing.",
    "Pair typefaces and build a type scale that holds together across a set of materials.",
    "Build a colour palette that meets accessible contrast requirements and works in one colour.",
    "Design a logo that survives being shrunk to a favicon and printed in black.",
    "Produce a social media set, a poster, a menu and a business card from one brief.",
    "Export CMYK print-ready PDFs with bleed, and correctly sized RGB files for screen.",
    "Write a quotation, agree a scope and hand over files a client can actually use.",
  ],
  careers: [
    "Graphic Designer (junior or in-house)",
    "Social Media Designer",
    "Freelance designer on Fiverr or Upwork",
    "Print and press design assistant",
    "Brand identity designer",
    "Packaging and label design",
    "Design support for a family or small business",
  ],

  modules: [
    {
      title: "Module 1 — How Design Actually Works",
      summary: "The principles that separate design from decoration, and the eye to see them.",
      lessons: [
        {
          title: "What Graphic Design Is For",
          minutes: 15,
          preview: true,
          video: { search: "what is graphic design principles introduction beginners" },
          body: `
## Design is communication, not decoration

A design succeeds when the right person understands the right thing and does something about it. Beautiful work that fails to communicate has failed, and ugly work that communicates has, awkwardly, succeeded.

This is why "do you like it?" is the wrong question to ask a client, and the wrong question to ask yourself.

## The right question

**What is this for, and who is it for?**

A poster for a tuition centre, seen from across a road, in three seconds, by a parent. That brief already tells you the type must be large, the message must be short, and the phone number must be readable from a distance.

Most bad design is not the result of poor taste. It is the result of never having asked what the piece had to do.

## What you are really learning

- **Hierarchy** — what should be read first, second, third
- **Contrast** — how difference creates attention
- **Alignment** — how order creates calm
- **Space** — why the empty parts do most of the work
- **Repetition** — how consistency creates recognition

Everything else — software, effects, trends — is downstream of these five.

## The habit that makes designers

Start looking at every sign, packet and poster you pass and asking what was decided and why. Photograph the bad ones. You will learn more from a badly set menu in a local restaurant than from a week of tutorials.
`.trim(),
        },
        {
          title: "Hierarchy, Contrast and Alignment",
          minutes: 22,
          video: { search: "design principles hierarchy contrast alignment proximity tutorial" },
          body: `
## Hierarchy

Decide the order in which things should be read, then make the design enforce it.

A flyer has perhaps three levels: the thing that stops you, the thing that explains it, the thing that tells you what to do. Give each a clearly different size and weight — not slightly different. Timid hierarchy reads as no hierarchy.

If everything is emphasised, nothing is.

## Contrast

Contrast is how you create hierarchy. Vary size, weight, colour, or space — and vary it boldly. 18pt beside 20pt looks like a mistake; 18pt beside 48pt looks like a decision.

The commonest beginner fault is being too polite. Make the big thing much bigger.

## Alignment

Every element should line up with something else. Not approximately — exactly.

- Pick a left edge and hold it
- Centre everything or centre nothing; mixing the two is what makes work look amateur
- Use guides and grids, and turn on snapping

Most "something looks wrong and I don't know why" is a misalignment of a few pixels.

## Proximity

Things that belong together go together, and things that do not get space between them. A caption sitting equidistant between two photographs belongs to neither.

Grouping by proximity does more for clarity than boxes, lines or colours ever will.

## The squint test

Half-close your eyes until the design blurs. What remains visible is your hierarchy. If the wrong thing dominates — or nothing does — fix that before anything else.
`.trim(),
        },
        {
          title: "White Space and Layout",
          minutes: 20,
          video: { search: "white space layout grid design composition tutorial" },
          body: `
## Empty space is not wasted space

The instinct of every beginner and every client is to fill the page. Resist it, and learn to explain why.

Space around an element is what gives it importance. A headline with room to breathe reads as confident; the same headline crowded to the edges reads as a clearance sale.

## Margins

Give the design a margin and never let anything break it except deliberately. A consistent margin does more for a professional appearance than any effect.

As a starting point, make margins larger than feels necessary — roughly twice what your instinct suggests.

## Grids

A grid is a set of columns that everything aligns to. It is how a newspaper, a magazine and a website all stay coherent across many pages.

Start with a simple grid — two, three or four columns — place elements to span whole columns, and the layout will hold together with almost no further effort.

## Rules of composition

- The most important element should be clearly dominant in size or position
- Avoid placing the focal point dead centre unless the design is deliberately symmetrical
- Leave the edges alone; crowding them feels like the page is too small
- Odd numbers of elements are usually more comfortable than even

## Working with the client's instinct

Clients ask for more, bigger, and closer together. Show them two versions — theirs and yours — and ask which one they can read from across the room. That argument is winnable; "trust me, it's design" is not.
`.trim(),
        },
      ],
      quiz: {
        title: "Module 1 Quiz — Design Principles",
        passingScore: 60,
        questions: [
          {
            prompt: "What is the right first question to ask about a design?",
            options: [
              { text: "What is this for, and who is it for?", correct: true },
              { text: "Do you like it?" },
              { text: "Which colours does the client prefer?" },
              { text: "Which software should I use?" },
            ],
          },
          {
            prompt: "Why is 18pt beside 20pt a problem?",
            options: [
              { text: "The difference is too small to read as deliberate, so it looks like a mistake", correct: true },
              { text: "Odd point sizes do not print correctly" },
              { text: "Two sizes should never appear in one design" },
              { text: "It is not a problem" },
            ],
          },
          {
            prompt: "What does the squint test reveal?",
            options: [
              { text: "Your actual visual hierarchy — what dominates when detail disappears", correct: true },
              { text: "Whether the colours are accessible" },
              { text: "Whether the file will print correctly" },
              { text: "The alignment of the margins" },
            ],
          },
          {
            prompt: "Which are causes of work looking amateur?",
            type: "multiple",
            options: [
              { text: "Mixing centred and left-aligned elements", correct: true },
              { text: "Margins that are too small", correct: true },
              { text: "Elements aligned approximately rather than exactly", correct: true },
              { text: "Using a grid" },
            ],
          },
          {
            prompt: "A caption sits exactly between two photographs. What is wrong?",
            options: [
              { text: "Proximity is ambiguous — it appears to belong to neither", correct: true },
              { text: "Captions must always be below the image" },
              { text: "The caption is too small" },
              { text: "Nothing is wrong" },
            ],
          },
          {
            prompt: "A client wants the logo bigger and all text moved closer together. What is the best response?",
            options: [
              { text: "Show both versions and ask which is readable from across the room", correct: true },
              { text: "Do as asked without comment" },
              { text: "Refuse, explaining that design decisions are yours" },
              { text: "Explain that white space is a design principle and leave it there" },
            ],
          },
        ],
      },
      assignment: {
        title: "Assignment 1 — Critique and redesign",
        maxPoints: 100,
        instructions: `
1. **Collect five real designs** from around you — photograph them yourself. Shop signs, menus, flyers, packaging, banners. At least three must be poor.
2. **Critique each** in a short paragraph using the vocabulary from this module: hierarchy, contrast, alignment, proximity, space. Say what the piece was *for*, and whether it achieves it.
3. **Redesign one of them.** Same information, same purpose, nothing added or removed. Canva is fine.
4. **Annotate your redesign.** Mark on the image where you applied each of the five principles and what you changed.
5. **The squint test.** Include a blurred version of both the original and your redesign, and say what each reveals.

Marks are for the reasoning in parts 2 and 4. A prettier design you cannot explain scores less than a plain one you can.
`.trim(),
      },
    },

    {
      title: "Module 2 — Typography",
      summary: "Choosing, pairing and setting type — the half of design that beginners skip.",
      lessons: [
        {
          title: "Reading Typefaces",
          minutes: 20,
          video: { search: "typography basics serif sans serif typeface anatomy beginners" },
          body: `
## Type carries meaning before it is read

A word set in one typeface reads as a law firm; the same word in another reads as a children's party. The reader makes that judgement in a fraction of a second, without noticing.

## The families

**Serif** — small strokes on the ends of letters. Traditional, authoritative, established. Newspapers, books, institutions.

**Sans serif** — no strokes. Modern, clean, neutral. Screens, signage, most contemporary brands.

**Slab serif** — heavy rectangular serifs. Sturdy, confident, a little industrial.

**Script** — handwriting. Personal, decorative, and almost always wrong for anything that must be read quickly or at a distance.

**Display** — designed for headlines only. Never set a paragraph in one.

## Choosing

Ask what the piece must communicate, then choose the family that already carries it. You are not inventing the association; you are borrowing one the reader already holds.

## Urdu and Nastaliq

Urdu typesetting is a genuine specialism, not an afterthought. Nastaliq has different vertical rhythm, connects differently, and most Latin-first tools set it badly.

If a design carries both languages, decide which leads, give each proper space, and check the Urdu with someone who reads it fluently. Urdu set badly is worse than no Urdu at all, and clients notice immediately.

## What to avoid

Comic Sans, Papyrus, and anything with a shadow or outline applied because the type was too weak on its own. Weak type is not fixed by effects; it is fixed by choosing better type.
`.trim(),
        },
        {
          title: "Pairing and Setting Type",
          minutes: 22,
          video: { search: "font pairing rules typography hierarchy line height tutorial" },
          body: `
## Two typefaces is usually enough

One for headings, one for body text. A third is a decision you should be able to justify. Beginners' work is most often spoiled by four or five competing typefaces.

## How to pair

- **Contrast, not conflict.** A serif heading with a sans body works because they are clearly different. Two similar sans serifs look like a mistake.
- **One family, many weights.** The safest pairing of all: use Light, Regular, Bold and Black of a single family. This is what most professional work does.
- **Match the mood**, not the shape.

## Setting body text well

- **Line length** — roughly 50 to 75 characters. Long lines lose the reader's place; very short ones fragment the reading.
- **Line height** — about 1.4 to 1.6 times the type size. Tight line spacing is the commonest fault in beginners' work.
- **Size** — a minimum of 16px on screen, 9 to 11pt in print.
- **Alignment** — left-aligned for anything longer than a line or two. Justified text without proper hyphenation creates rivers of white space.

## Headings

Make the jump in size decisive. Set headings tighter than body text — large type needs proportionally less line spacing.

## Things to stop doing

- ALL CAPS FOR WHOLE PARAGRAPHS. It is significantly slower to read.
- Letter-spacing lower-case text
- Stretching or squashing type to fit. Choose a condensed face instead; distorted type is visible to everyone and looks careless.
- More than two exclamation marks in a lifetime
`.trim(),
        },
      ],
      quiz: {
        title: "Module 2 Quiz — Typography",
        passingScore: 60,
        questions: [
          {
            prompt: "How many typefaces should most designs use?",
            options: [
              { text: "Two — or one family in several weights", correct: true },
              { text: "Four or five, for variety" },
              { text: "One, always" },
              { text: "As many as the design needs" },
            ],
          },
          {
            prompt: "What is a sensible line height for body text?",
            options: [
              { text: "About 1.4 to 1.6 times the type size", correct: true },
              { text: "Exactly the same as the type size" },
              { text: "About 2.5 times the type size" },
              { text: "It does not matter" },
            ],
          },
          {
            prompt: "Why should type never be stretched or squashed to fit a space?",
            options: [
              { text: "The distortion is visible to everyone and reads as careless", correct: true },
              { text: "It increases the file size" },
              { text: "Printers reject distorted type" },
              { text: "It only matters for serif faces" },
            ],
          },
          {
            prompt: "Which pairings are sound?",
            type: "multiple",
            options: [
              { text: "A serif heading with a sans serif body", correct: true },
              { text: "Light, Bold and Black weights of one family", correct: true },
              { text: "Two similar sans serif faces" },
              { text: "A script face for body text" },
            ],
          },
          {
            prompt: "What should you do when a design carries both Urdu and English?",
            options: [
              { text: "Decide which leads, give each proper space, and have the Urdu checked by a fluent reader", correct: true },
              { text: "Set both at the same size in the same typeface" },
              { text: "Always put Urdu first" },
              { text: "Convert the Urdu to an image and ignore the typesetting" },
            ],
          },
          {
            prompt: "A headline looks weak, so a drop shadow and outline are added. What is the real problem?",
            options: [
              { text: "The type choice or size is wrong — effects do not fix weak type", correct: true },
              { text: "The shadow is not strong enough" },
              { text: "The colour is wrong" },
              { text: "Nothing — this is standard practice" },
            ],
          },
        ],
      },
      assignment: {
        title: "Assignment 2 — Type specimen and a reset menu",
        maxPoints: 100,
        instructions: `
1. **A type specimen sheet.** Choose one pairing. Show headings at three levels, body text, a caption and a quotation, with the typeface names, sizes, weights and line heights labelled beside each.
2. **Justify the pairing** in one paragraph: what the mood is, and why these two carry it.
3. **Reset a real menu.** Find a genuine restaurant or café menu, photograph it, and typeset the same content properly. No new content, no illustration — type and layout only.
4. **Annotate** what you changed: line length, line height, hierarchy, alignment, and anything you removed.
5. **One bilingual piece.** A single A5 flyer carrying the same message in Urdu and English. Say who checked your Urdu.

Part 5 is required. A designer working in Pakistan who cannot handle Urdu alongside English is limited to half the work available.
`.trim(),
      },
    },

    {
      title: "Module 3 — Colour and Imagery",
      summary: "Building palettes that work, and using photographs and graphics without ruining them.",
      lessons: [
        {
          title: "Colour That Works",
          minutes: 22,
          video: { search: "color theory design palette hue saturation contrast accessibility" },
          body: `
## Three properties

**Hue** — which colour it is. **Saturation** — how intense. **Lightness** — how light or dark.

Most beginners change hue when the problem is saturation or lightness. A palette that feels wrong is more often too saturated than badly chosen.

## Building a palette

Keep it small: one dominant colour, one accent, and a range of neutrals.

A reliable starting ratio is roughly 60% dominant, 30% secondary, 10% accent. The accent is what draws the eye — so use it for the one thing you want clicked or read, and nowhere else.

## Where to start

- The client's existing brand, if it has one
- The product itself
- Cultural meaning — green carries particular weight in Pakistan, and red means something different at a wedding than on a warning sign
- What competitors use, so you can be different from it

## Contrast is not optional

Text must be readable. Pale grey on white fails for a large number of readers, including anyone outdoors in sunlight — which is most people reading a poster.

Check it. Body text needs a contrast ratio of at least 4.5:1 against its background, large text at least 3:1. Free contrast checkers take seconds, and this is the single most common accessibility failure in small-business design.

## Test in one colour

Print or view your design in greyscale. If the hierarchy collapses, you were relying on hue alone. Colour should reinforce a hierarchy that already works without it — some readers cannot distinguish the colours you chose, and a fax, a photocopy and a black-and-white newspaper advert do not care about your palette.
`.trim(),
        },
        {
          title: "Working With Images",
          minutes: 20,
          video: { search: "using images in design resolution cropping stock photography tips" },
          body: `
## Resolution, plainly

**Screen** — 72 to 150 pixels per inch is fine. What matters is the pixel dimensions matching where it will be shown.

**Print** — 300 pixels per inch at final size. A photograph 1000 pixels wide prints sharply at about 8 cm, and badly at A4.

You cannot add detail that was never captured. Enlarging a small image produces a soft, blocky result no filter will rescue.

## Raster and vector

**Raster** — JPG, PNG, photographs. Made of pixels; degrades when enlarged.

**Vector** — SVG, AI, EPS. Made of mathematical shapes; scales to any size without loss. Logos, icons and illustrations should be vector, always.

This is why a client asking for "the logo for a billboard" needs a vector file, and why sending a 500-pixel PNG is a professional embarrassment.

## Cropping

Crop deliberately. Remove what does not contribute, lead the eye towards the subject, and do not leave a person's head crowded against the top edge.

Never distort an image to fit a frame. Crop it instead.

## Stock imagery

Free sources exist and are useful, but check the licence every time — some require attribution, some forbid commercial use, and some forbid use in logos entirely.

Prefer real photographs of the actual business. A genuine picture of the actual shop outperforms a polished stock photograph of a shop that does not exist, particularly for local customers who will recognise the street.

## Never do this

Use an image you found through a search engine. Photographs are owned, agencies do pursue payment, and the client will be the one who receives the letter.
`.trim(),
        },
      ],
      quiz: {
        title: "Module 3 Quiz — Colour and Imagery",
        passingScore: 60,
        questions: [
          {
            prompt: "What contrast ratio does body text need against its background?",
            options: [
              { text: "At least 4.5:1", correct: true },
              { text: "At least 1.5:1" },
              { text: "At least 10:1" },
              { text: "There is no requirement" },
            ],
          },
          {
            prompt: "Why view a design in greyscale?",
            options: [
              { text: "To check the hierarchy holds without relying on hue alone", correct: true },
              { text: "To reduce the file size" },
              { text: "Because printers prefer greyscale" },
              { text: "To check the resolution" },
            ],
          },
          {
            prompt: "A client wants their logo on a billboard. What file do you need?",
            options: [
              { text: "A vector file — SVG, AI or EPS", correct: true },
              { text: "A high-quality JPG" },
              { text: "A PNG with a transparent background" },
              { text: "Any file at 300 DPI" },
            ],
          },
          {
            prompt: "Which are true about image resolution?",
            type: "multiple",
            options: [
              { text: "Print needs about 300 PPI at final size", correct: true },
              { text: "Enlarging cannot add detail that was never captured", correct: true },
              { text: "A 1000px image prints well at around 8cm, not at A4", correct: true },
              { text: "A filter can restore sharpness to an enlarged image" },
            ],
          },
          {
            prompt: "Why prefer a real photograph of the business over stock imagery?",
            options: [
              { text: "Local customers recognise the actual place, and it is more persuasive", correct: true },
              { text: "Stock photographs are always low resolution" },
              { text: "Stock photographs cannot be used commercially" },
              { text: "Real photographs are easier to crop" },
            ],
          },
          {
            prompt: "What is wrong with using an image found through a search engine?",
            options: [
              { text: "It is owned by somebody, and the client receives the demand for payment", correct: true },
              { text: "The resolution is usually too low" },
              { text: "Nothing, if it is only used once" },
              { text: "It is fine as long as the source is credited" },
            ],
          },
        ],
      },
      assignment: {
        title: "Assignment 3 — Palette and poster",
        maxPoints: 100,
        instructions: `
1. **Build a palette** for a business of your choice: one dominant, one secondary, one accent, and three neutrals. Give hex codes.
2. **Prove the contrast.** Screenshot a contrast checker for every text-on-background combination you use. Anything below 4.5:1 for body text must be fixed and re-checked.
3. **Justify the palette** in a paragraph, including any cultural reasoning.
4. **Design an A3 poster** using it, for a real event or offer. It must be readable from three metres.
5. **The greyscale test.** Include a greyscale version and say whether the hierarchy survives. If it does not, fix the poster and show both.
6. **Image sourcing.** State where every image came from and its licence. Photographs you took yourself score highest.
`.trim(),
      },
    },

    {
      title: "Module 4 — Tools, Brand and Delivery",
      summary:
        "Canva and the professional alternatives, building an identity, and handing over files that work.",
      lessons: [
        {
          title: "Canva, Properly",
          minutes: 24,
          video: { search: "canva tutorial beginners brand kit templates design tips" },
          body: `
## Why Canva first

It is free, it runs in a browser on a modest machine, and it is what most Pakistani small businesses already have. A designer who can work quickly in Canva can earn while learning the rest.

## Beyond dragging templates

The difference between a Canva user and a designer using Canva:

- **Set up a brand kit** — the client's colours, fonts and logo, once
- **Use guides and rulers**, and align exactly rather than by eye
- **Position precisely** with the position panel, not by dragging
- **Change templates substantially.** A template used unchanged is recognisable, and clients do notice
- **Use "resize"** to produce a whole set from one design, then fix each individually — automatic resizing always breaks something

## Sensible workflow

1. Set the correct canvas size before starting, not after
2. Build the brand kit first
3. Design the most constrained piece first — usually the smallest
4. Then adapt outward to the larger formats
5. Name and organise files so a client can find them in a year

## What Canva will not do

Proper CMYK separation, spot colours, complex vector editing, fine typographic control, and reliable large-format print files. When a printer rejects a Canva PDF, this is usually why.

Know the limit, and be honest with clients when a job is past it rather than delivering something the press cannot use.
`.trim(),
        },
        {
          title: "The Professional Tools",
          minutes: 20,
          video: { search: "photoshop illustrator indesign difference which to use design" },
          body: `
## What each is for

**Photoshop** — raster images. Photo editing, retouching, composites. Not for logos and not for multi-page documents, however common both misuses are.

**Illustrator** — vector. Logos, icons, illustration, anything that must scale. This is where a logo should be made.

**InDesign** — layout of multi-page documents. Brochures, magazines, catalogues, reports. Handles long text properly in a way the other two do not.

**Affinity Designer, Photo and Publisher** — the same three jobs, bought once rather than rented monthly. A serious option where an Adobe subscription is unaffordable, and the files it exports are accepted everywhere.

**Figma** — interface and screen design, free for individuals, and increasingly used for general design work.

## Choosing per job

- Logo or icon — Illustrator or Affinity Designer
- Photo work — Photoshop or Affinity Photo
- Multi-page — InDesign or Affinity Publisher
- Social and quick turnarounds — Canva
- Screens and apps — Figma

## What transfers

The principles in Modules 1 to 3 transfer completely. The tools are keyboard shortcuts.

A designer who understands hierarchy and type learns a new program in a fortnight. Someone who only knows where the buttons are in one program has to start again each time, and cannot answer a client who asks why.
`.trim(),
        },
        {
          title: "Building a Brand Identity",
          minutes: 24,
          video: { search: "logo design process brand identity guidelines small business" },
          body: `
## A logo is not a brand

The brand is everything the business looks and sounds like, consistently. The logo is one mark within it.

## What makes a logo work

- **Simple.** It must survive being 16 pixels wide
- **Works in one colour.** Design it in black first; add colour afterwards
- **Distinctive** from competitors
- **Appropriate** to the trade
- **Scalable** — vector, always
- **Memorable** enough to be described over a phone

## The process

1. Ask what the business does, for whom, and what it wants to be seen as
2. Look at what every competitor is doing, so you can avoid it
3. Sketch on paper. Twenty rough ideas before opening any software.
4. Develop three
5. Present them **in use** — on a signboard, a card, a shopfront — not floating on white
6. Refine one

## Delivering an identity

A client needs more than a logo file:

- Logo in colour, black, and reversed white
- Vector and raster, in several sizes
- A favicon
- The colour palette with hex, RGB and CMYK values
- Typefaces named, with links and licence notes
- **Simple usage rules**: minimum size, clear space, and what must never be done to it

Write the rules in plain language, on two pages. A twenty-page brand manual nobody reads protects nothing.

## What clients get wrong

They ask for their logo to be bigger, to contain everything they do, and to look like a competitor's. Answer with the constraints: it must work at 16 pixels, in one colour, and be distinguishable from the shop next door.
`.trim(),
        },
        {
          title: "Print, Export and Handover",
          minutes: 22,
          video: { search: "print ready pdf cmyk bleed export design file preparation" },
          body: `
## RGB and CMYK

**RGB** — light, for screens. Wide range, bright colours.

**CMYK** — ink, for print. Narrower range. Some bright screen colours simply cannot be printed, and will come out duller.

Design for print in CMYK from the start. Converting at the end is how a vivid design turns muddy on the press, and the client is standing there when it happens.

## Bleed and safe area

**Bleed** — extend the background 3mm beyond the trim line. Cutting is never perfectly accurate, and without bleed you get white slivers on the edges.

**Safe area** — keep all text at least 3 to 5mm inside the trim, so nothing important is cut off.

## Exporting

- **Print** — PDF/X, CMYK, 300 DPI, fonts embedded or outlined, bleed and crop marks included
- **Screen** — PNG for graphics and transparency, JPG for photographs, SVG for logos and icons
- **Social** — correct pixel dimensions per platform, exported fresh rather than resized from another size

## Talk to the printer first

Ask what they want before you export. Presses differ, and a five-minute call prevents a rejected file and a missed deadline. Ask about bleed, colour profile, file format and maximum size.

## Handover

Give the client:

- Final files in every format they will need
- The editable source file
- A short note saying which file to use where

Keep your own copy, organised, for at least a year. Clients return asking for the same logo in a new size, and being able to produce it in two minutes is worth more than the fee on the original job.
`.trim(),
        },
      ],
      quiz: {
        title: "Module 4 Quiz — Tools, Brand and Delivery",
        passingScore: 60,
        questions: [
          {
            prompt: "Which tool should a logo be created in?",
            options: [
              { text: "Illustrator or Affinity Designer — a vector tool", correct: true },
              { text: "Photoshop" },
              { text: "InDesign" },
              { text: "Whichever is open" },
            ],
          },
          {
            prompt: "Why design a logo in black first?",
            options: [
              { text: "It must work in one colour; colour is added afterwards", correct: true },
              { text: "Black ink is cheaper" },
              { text: "Clients prefer black logos" },
              { text: "Colour cannot be added later" },
            ],
          },
          {
            prompt: "What is bleed, and why does it matter?",
            options: [
              { text: "Background extended past the trim line, so inaccurate cutting leaves no white edges", correct: true },
              { text: "The margin inside which text must stay" },
              { text: "The amount of ink a press applies" },
              { text: "A colour profile used for photographs" },
            ],
          },
          {
            prompt: "Why design for print in CMYK from the start?",
            options: [
              { text: "Some bright RGB colours cannot be printed, and converting late makes the design look muddy", correct: true },
              { text: "CMYK files are smaller" },
              { text: "Printers charge more for RGB files" },
              { text: "It makes no difference" },
            ],
          },
          {
            prompt: "What should a client receive with a new logo?",
            type: "multiple",
            options: [
              { text: "Colour, black and reversed white versions", correct: true },
              { text: "Vector and raster files in several sizes", correct: true },
              { text: "Palette values and typeface names", correct: true },
              { text: "Only a single high-resolution PNG" },
            ],
          },
          {
            prompt: "What can Canva not do reliably?",
            options: [
              { text: "Proper CMYK separation and large-format print files", correct: true },
              { text: "Resize a design to another format" },
              { text: "Store brand colours and fonts" },
              { text: "Export a PNG" },
            ],
          },
          {
            prompt: "When should you contact the printer?",
            options: [
              { text: "Before exporting, to ask what they want", correct: true },
              { text: "After the file is rejected" },
              { text: "Only if the job is larger than A3" },
              { text: "Never — the standards are universal" },
            ],
          },
        ],
      },
      assignment: {
        title: "Final assignment — A complete identity",
        maxPoints: 200,
        instructions: `
This replaces an examination. Take a **real small business** — one that exists, whose owner you have spoken to — and build its identity.

1. **The brief.** What the business does, who it serves, what it wants to be seen as, and what the owner told you. Include your questions and their answers.
2. **Competitor review.** Five real competitors, with photographs of their branding, and what you will do differently.
3. **Twenty paper sketches**, photographed. Rough is expected. Skipping this and going straight to software is visible in the result, and is marked down.
4. **Three developed concepts**, each presented in use — signboard, card, shopfront or packaging.
5. **One final identity**, delivered as a real handover pack: logo in colour, black and reversed; vector and raster; favicon; palette with hex, RGB and CMYK; typefaces named; and two pages of plain-language usage rules.
6. **An applied set**, all using the identity: business card, A3 poster, a set of three social media posts, and one print piece exported **print-ready** — CMYK, 300 DPI, 3mm bleed, crop marks.
7. **A short reflection.** What the owner said about the work, what you would change, and what you would charge for this job with your reasoning.

**Marking:** the process — parts 1, 2 and 3 — carries as much weight as the final artwork. A polished logo with no brief behind it is decoration, and cannot be defended to a client.
`.trim(),
      },
    },
  ],
};
