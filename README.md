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

## Deployment

Deploys cleanly to Vercel (zero config) or any Node host that runs `next build && next start`.
Set `metadataBase`/`siteConfig.url` in `src/lib/site.ts` to the production domain before
launch so Open Graph and sitemap URLs resolve correctly.
