# Hunarsaaz — NGO Website

A modern, responsive marketing website for **Hunarsaaz**, a vocational training NGO based in Taxila, Punjab, Pakistan. Built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Tech Stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS v4** — custom theme matching the brand palette (deep blue `#0A4D8C`, orange `#F28C28`, green `#2E8B57`)
- **Poppins** (display/headings) + **Inter** (body) via `next/font`
- **Framer Motion** — count-up stats, carousels, transitions
- **lucide-react** — iconography
- **Zod** — form validation (client + server)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
```

## Project Structure

```
src/
  app/                  Routes (App Router). Each folder = a page; api/ = form handlers.
  components/
    layout/              Header (sticky nav + mega menu), Footer, WhatsApp button
    home/                Homepage section components
    forms/               Field primitives, per-form components, shared submit hook
    ui/                  Button, Card, Badge, Container, PlaceholderImage, StatCounter...
  data/                  Static content: programs, blog posts, team, stats, causes, etc.
  lib/                   site config/nav, icon lookup, cn() helper, API helpers
```

## Pages Implemented

Home · About · Programs (list + 16 detail pages) · Admissions · Donate · Volunteer ·
Gallery · Blog (list + detail) · Impact & Transparency · Careers · Contact.

Every page ships its own `<title>`/meta description, and the site includes `sitemap.xml`,
`robots.txt`, a web app manifest, and `Organization`/`Course` JSON-LD structured data.

## Forms

Contact, Admission, Volunteer, Donation, and Newsletter forms all validate client-side
with Zod and post to a matching Next.js API route (`src/app/api/*`), which re-validates
with the same schema, checks a honeypot field, and applies a basic per-IP rate limit.

## Placeholder content

There is no real photography, and this repo intentionally ships none — using stock/scraped
images would be a licensing risk. Every photo/video slot is a `<PlaceholderImage>`
(branded gradient + icon + caption) so the layout, aspect ratios, and information
architecture are all real and ready — swap in real photography before launch. Bios, stats,
partner names, bank details, and blog posts are sample content for the same reason.

## Scope: what this build does *not* include

This was built as a **static-content marketing site with working, validated forms** — a
big, deliberate slice of the original brief, not the whole thing. Explicitly out of scope,
because each needs real infrastructure and business decisions this repo can't make on its
own:

- **Backend persistence / CMS** — form submissions are validated and logged
  server-side (`console.log`) but not emailed or stored. Wire `src/app/api/*/route.ts`
  to an email service (Resend, SendGrid) and/or a database.
- **Admin dashboard** — no authenticated CMS for managing courses, students, donations,
  etc. Would need a database, auth, and role-based access control.
- **Real payments** — the donation form records a *pledge*; it does not process
  EasyPaisa/JazzCash/card/PayPal transactions. That requires a licensed payment gateway
  integration and PCI-relevant security review.
- **Auth / accounts** — no student or donor login.
- **PWA offline support** — a web manifest is included, but there's no service worker
  for offline caching.
- **Dark mode** — deprioritized for a trust-driven nonprofit site; the palette is
  light-only by design.
- **Blog comments** — social sharing links are implemented; persisted comments would
  need a backend.

None of this is hidden behind the UI — the relevant components/routes have inline notes
pointing at the gap.

## Accessibility & SEO

Skip-to-content link, visible focus states, semantic headings/landmarks, `aria-label`s on
icon-only controls, alt-text-equivalent labels on placeholder imagery, and
`prefers-reduced-motion` handling. Metadata, Open Graph/Twitter cards, sitemap, robots,
and JSON-LD are wired per-page — run Lighthouse against a deployed build to verify scores
before launch.

## Learning portal

The site has two halves. The marketing pages are static and can be exported to plain
HTML. The **learning portal** (`/learn`), the **CMS admin** (`/admin`) and the CMS API
(`/cms-api`) are dynamic: they need a Node.js server and a PostgreSQL database, and
cannot be part of a `STATIC_EXPORT=1` build.

### Local setup

1. Run PostgreSQL and create a database.
2. `cp .env.example .env` and fill in both values:
   - `DATABASE_URI` — the connection string
   - `PAYLOAD_SECRET` — generate with `openssl rand -base64 32`
3. `npm run dev`, then open `/admin` and create the first user. **The first account is
   automatically an admin**; every later account is a student unless an admin changes
   its role.
4. Optionally `npm run seed` for a demo course plus admin, instructor and student
   logins (printed at the end). Safe to re-run.

### How it fits together

| Path | Who | What |
| --- | --- | --- |
| `/admin` | staff | Payload CMS — author courses, modules and lessons; manage users and enrolments |
| `/learn` | student | Dashboard of enrolled courses and progress |
| `/learn/courses` | public | Course catalogue |
| `/learn/courses/[slug]` | public | Course outline and enrolment |
| `/learn/courses/[slug]/[lesson]` | enrolled | Lesson player, quiz and assignment |
| `/learn/courses/[slug]/discussion` | enrolled | Course Q&A threads |
| `/learn/certificates/[serial]` | holder, staff | Printable certificate |
| `/verify/[serial]` | public | Certificate check for employers |
| `/learn/teach/courses` | staff | Courses taught, with per-student progress |
| `/learn/teach` | staff | Grading queue |

Content model: a **course** has ordered **modules**, each with ordered **lessons**. An
**enrolment** puts a student on a course; a **lesson-progress** row records each lesson
they tick off. A lesson may also carry a **quiz** and one or more **assignments**;
sitting a quiz writes a **quiz-attempt**, and answering an assignment writes a
**submission** that an instructor grades.

`npm run seed:assessment` adds a sample quiz and assignment to the seeded course.

### Assessment rules

- **Quizzes are marked on the server.** The browser posts only which options were
  ticked. `markQuiz()` compares them with the stored answers and writes the result;
  `quiz-attempts` refuses creates from anyone but the server, so a score cannot be
  posted in by hand. A "select several" question scores only on an exact match.
- **The answer key never reaches the browser.** The `correct` flag has field-level read
  access limited to staff, and `toStudentQuiz()` strips it again for the portal, which
  queries with overrideAccess and would otherwise bypass that rule. Explanations are
  withheld too.
- **Student work is private.** Assignment files go to `private-uploads/`, never
  `public/`, and are served only through Payload's file route, which applies the
  collection's read rule: the owner and staff, nobody else.
- **Grades are staff-only fields.** A student owns their submission row and may revise
  it until it is marked, but `grade`, `feedback` and `status` reject writes from them.
  Instructors can only grade submissions on courses they teach.
- **Discussions are scoped by enrolment.** The read rule on `discussions` looks up which
  courses the requester is enrolled on and limits the query to those, so a signed-in
  student cannot read another course's threads through the API. The thread page also
  rechecks that the thread belongs to the course in the URL.
- **Certificates cannot be self-issued.** `issueCertificateIfComplete()` recounts the
  lessons and the student's progress from the database before writing one, and the
  collection refuses creates from every other route.

### Certificates

When a student ticks off the last lesson, the enrolment is marked complete and a
certificate is issued with a random serial (`HS-2026-XXXXXXXX`). They can print it or
save it as PDF from `/learn/certificates/[serial]` — print rules in `globals.css` drop
the site chrome so only the certificate appears.

`/verify/[serial]` is public so an employer holding a printout can check it without an
account. It deliberately shows only the holder's name, the course and the date — no
email, no grades, no progress.

### Authorisation

Two independent layers, deliberately:

- **Payload access rules** (`src/collections/*.ts`) govern the CMS and its API. Students
  can only read their own enrolment and progress rows, and the `role` field is writable
  by admins only, so self-registration cannot escalate.
- **The Data Access Layer** (`src/lib/lms/auth.ts`, `queries.ts`) governs the portal.
  `getLessonForStudent()` is the only path to lesson content and checks enrolment
  first; a lesson marked *preview* is the sole exception.

`src/proxy.ts` (Next.js 16 renamed Middleware to Proxy) only does an optimistic
cookie-presence redirect. Per the Next.js docs it is never trusted for authorisation.

## Deployment

Deploys cleanly to Vercel (zero config) or any Node host that runs `next build && next start`.
Set `metadataBase`/`siteConfig.url` in `src/lib/site.ts` to the production domain before
launch so Open Graph and sitemap URLs resolve correctly.
