import type { Payload } from "payload";

/**
 * The THRIVE 360 workshop, put into the database on first start.
 *
 * It is here rather than in a seed script because nobody can run a script on
 * the hosting the portal lives on — there is no terminal, only a file manager.
 * Typing twenty fields into the admin by hand from a flyer is how details get
 * transposed, so the flyer's own wording is set down here once, correctly.
 *
 * Only ever runs when there are no workshops at all, so it cannot overwrite
 * edits or resurrect a workshop that was deliberately removed. Once it exists
 * it is an ordinary record: change the price, the time, anything, in the admin
 * and nothing here will argue.
 *
 * Every word below is from the flyer. Nothing is invented.
 */
const THRIVE_360 = {
  title: "THRIVE 360",
  slug: "thrive-360",
  tagline: "Strengthening Mental Wellbeing Across Life, Education and Workplace",
  summary:
    "A two-hour live workshop on mental wellbeing — in everyday life, in education and at work. " +
    "Practical rather than theoretical: recognising stress, building emotional resilience, and " +
    "putting habits in place that hold up under pressure. Open to professionals and students, " +
    "with interactive activities, case examples and time for your own questions.",
  presenterName: "Ms. Asma Ahmed",
  presenterTitle: "Consultant Clinical Psychologist",
  presenterOrg: "Founder, Umar Psychological Consultancy (UPC)",
  // Already on the site, shipped in public/team with the rest of the portal.
  presenterPhotoUrl: "/team/asma-ahmed.jpg",
  // 3:00pm – 5:00pm Pakistan time on Saturday 14 November 2026.
  startsAt: "2026-11-14T10:00:00.000Z",
  endsAt: "2026-11-14T12:00:00.000Z",
  platform: "Zoom",
  priceProfessional: 2000,
  priceStudent: 1000,
  feeNote: "Early bird discount available for groups of 5–6 participants.",
  contactName: "Urooj Shafi (Associate–Hunarsaaz)",
  contactEmail: "urooj@hunarsaaz.pk",
  status: "open" as const,
  outcomes: [
    { text: "Understand the importance of mental wellbeing in everyday life and work." },
    { text: "Recognize and manage stress effectively." },
    { text: "Develop emotional resilience and healthy coping strategies." },
    { text: "Strengthen self-awareness, confidence, and positive thinking." },
    { text: "Build practical habits for a healthier, balanced, and productive life." },
  ],
  audience: [
    { text: "Teachers and educators" },
    { text: "Students" },
    { text: "HR professionals and managers" },
    { text: "Mental health practitioners" },
    { text: "Anyone interested in wellbeing" },
  ],
  includes: [
    { text: "Interactive activities" },
    { text: "Q&A during the session" },
    { text: "Case examples and practical learning" },
    { text: "Workshop handout" },
    { text: "E-certificate" },
    { text: "Feedback form" },
    { text: "Pre and post quiz" },
  ],
};

export async function seedFirstWorkshop(payload: Payload): Promise<void> {
  try {
    const existing = await payload.find({
      collection: "workshops",
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (existing.totalDocs > 0) return;

    await payload.create({
      collection: "workshops",
      data: THRIVE_360,
      overrideAccess: true,
    });
    payload.logger.info("[workshops] created the THRIVE 360 workshop record");
  } catch (error) {
    // Not fatal: without it the workshop page 404s, which is a great deal
    // better than the portal refusing to start.
    console.error("[workshops] could not create the first workshop:", error);
  }
}
