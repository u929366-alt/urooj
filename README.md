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
(`/cms-api`) are dynamic: they need a Node.js server and a database, and
cannot be part of a `STATIC_EXPORT=1` build.

### Local setup

1. `cp .env.example .env` and set `PAYLOAD_SECRET` (`openssl rand -base64 32`).
   Leave `DATABASE_URI` blank to use SQLite — no database server needed.
2. `npm run dev`, then open `/admin` and create the first user. **The first account is
   automatically an admin**; every later account is a student unless an admin changes
   its role.
3. Optionally `npm run seed` and `npm run seed:assessment` for a demo course, quiz and
   assignment plus admin, instructor and student logins (printed at the end). Safe to
   re-run.

### Database

`DATABASE_URI` picks the adapter:

| Value | Adapter | When |
| --- | --- | --- |
| *(blank)* | SQLite at `data/hunarsaaz.db` | Default. Shared hosting, local dev |
| `./data/x.db` or `file:/abs/path.db` | SQLite at that path | Custom location |
| `postgres://…` | PostgreSQL | Larger deployments |

SQLite is the default because the site is on shared cPanel hosting, which usually
offers MySQL and no PostgreSQL. Being a single file it needs no database server, so the
portal runs anywhere Node.js does. It serialises writes, so if the portal ever gets
heavy simultaneous use, move to PostgreSQL — only the env var changes.

**Back up `data/hunarsaaz.db`.** It holds every account, enrolment, grade and
certificate. It is gitignored, so nothing else is keeping a copy.

### Email and password resets

Password reset is built in, but it needs somewhere to send from. Set `SMTP_HOST`,
`SMTP_USER` and `SMTP_PASS` and it sends through that mailbox. Leave them unset and
Payload writes the message to the server log instead — fine locally, but it means a live
site cannot deliver a reset to anyone.

The simplest source is a mailbox on the hosting account itself, so no third-party
service or API key is involved:

1. cPanel → Email Accounts → create one, e.g. `noreply@hunarsaaz.pk`.
2. That account's **Connect Devices** page lists the outgoing server and port —
   normally `mail.hunarsaaz.pk` on port 465, with the full address as the username.
3. Put those in the environment variables (see `.env.example`), along with
   `SITE_URL`, which is what makes the link in the email point at the live site
   rather than localhost.

`SITE_URL` is deliberately **not** called `NEXT_PUBLIC_SERVER_URL`. Next inlines
`NEXT_PUBLIC_*` values at build time, so a value set on the server would be ignored and
every reset link would point at wherever the build was made.

The flow: `/learn/forgot-password` → emailed link → `/learn/reset-password?token=…` →
new password, and the student is signed in straight away. Tokens are single use and
expire after an hour. The form always reports success even for an address that is not
registered, so it cannot be used to find out who has an account.

### Deploying to cPanel shared hosting

Requires **Setup Node.js App** in cPanel (Software section). If it is not there, ask
your host to enable it — without Node.js the portal cannot run, though the marketing
pages still can.

1. **Build on Linux** — `npm run build`, which produces `.next/standalone`. It must be
   Linux: `sharp` and the SQLite driver are compiled per operating system, so a build
   made on Windows or macOS crashes on the server.
2. **Assemble the folder to upload.** Four things standalone leaves out:
   ```bash
   cp -r .next/static .next/standalone/.next/static
   cp -r public .next/standalone/public
   mkdir -p .next/standalone/private-uploads/submissions
   cp data/hunarsaaz.db .next/standalone/data/hunarsaaz.db   # schema, no data
   ```
   The database file matters: `npm run dev` creates and updates the tables, but a
   production build cannot — the tooling that does it is a dev dependency and is not in
   the standalone output. Ship a `.db` that already has the tables, or every page that
   reads content returns "no such table".

   **Then delete `.next/standalone/.env` if it exists.** The standalone trace pulls it
   in, which would publish your `PAYLOAD_SECRET`.

   Upload the contents of `.next/standalone` to your application root.
3. **Create the app in cPanel** → Setup Node.js App → Node 20 or newer, application
   root set to the folder you uploaded, application startup file `server.js`.
4. **Add the environment variables** in the same screen: `PAYLOAD_SECRET` (a long random
   string — *not* the development one), `NODE_ENV=production`, `SITE_URL`
   (the live address), and the four `SMTP_*` values from the section above so password
   resets work. Leave `DATABASE_URI` unset for SQLite. Do **not** press "Run NPM
   Install": the dependencies are already in the upload, and reinstalling can replace
   the Linux binaries with wrong ones.
5. **Make three paths writable** (755 is enough): `data/`, `public/uploads/` and
   `private-uploads/`. Uploads and the database are written at runtime.
6. Restart the app. Visit `/admin` and create the first user — that account becomes the
   admin.

Redeploying: repeat steps 1–2, upload over the top, restart. Never overwrite `data/`,
`public/uploads/` or `private-uploads/`, or you will erase live student records.

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
