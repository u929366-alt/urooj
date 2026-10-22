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
  venueNote: "Will be shared by email on 10 November 2026",
  priceProfessional: 2000,
  priceStudent: 1000,
  feeNote: "Early bird discount available for groups of 5–6 participants.",
  contactName: "Urooj Shafi (Associate–Hunarsaaz)",
  contactEmail: "urooj@hunarsaaz.pk",
  // The letter the presenter wants sent once a registration is approved.
  // Her words, kept as written; editable afterwards in the admin.
  confirmationIntro: [
    "Greetings from HunarSaaz!",
    "Thank you for registering for our upcoming workshop, “Thrive 360: Strengthening Mental Wellbeing across Life, Education & Workplace.”",
    "I am delighted to welcome you to this learning experience, designed to highlight the importance of mental wellbeing in our personal lives, educational environments, and professional workplaces.",
    "Through this interactive session, we will explore practical strategies to strengthen emotional resilience, manage stress, promote healthier relationships, prevent burnout, and foster a culture of mental wellbeing in everyday life.",
    "I look forward to engaging with you in meaningful discussions, sharing valuable insights, and exploring practical approaches that can help us move beyond simply coping with challenges towards truly thriving in life, learning, and work.",
  ].join("\n\n"),
  confirmationClosing: [
    "Further details and joining instructions will be shared with you before the session.",
    "Thank you once again for taking this positive step towards prioritising mental wellbeing. Your participation reflects a valuable commitment to personal growth, lifelong learning, and building healthier, more resilient communities.",
    "Looking forward to welcoming you to Thrive 360 — because wellbeing is not just about surviving; it is about thriving!",
    "Asma Ahmed\nConsultant Clinical Psychologist\nSpeaker – Thrive 360\nHunarSaaz",
  ].join("\n\n"),
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
    { text: "Professionals" },
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

/**
 * Fields added to the workshop after it was first created.
 *
 * A server that installed an earlier release already has the THRIVE 360
 * record, so the create above never runs there and anything added to
 * THRIVE_360 afterwards would never reach it. These are therefore filled in
 * on startup — but only where the field is still empty, so nothing anyone
 * has written in the admin is ever overwritten.
 */
const BACKFILLED = ["venueNote", "confirmationIntro", "confirmationClosing"] as const;

async function backfill(payload: Payload, id: number | string, doc: Record<string, unknown>) {
  const missing: Record<string, string> = {};
  for (const field of BACKFILLED) {
    const current = doc[field];
    if (typeof current === "string" && current.trim()) continue;
    missing[field] = THRIVE_360[field];
  }
  if (Object.keys(missing).length === 0) return;

  await payload.update({
    collection: "workshops",
    id,
    data: missing,
    overrideAccess: true,
  });
  payload.logger.info(
    `[workshops] filled in ${Object.keys(missing).join(", ")} on the THRIVE 360 record`,
  );
}

/**
 * One line of the audience list was reworded after the record was created, so
 * a server running an earlier release still carries the old text. Matched
 * exactly and only replaced where it is still the old wording, so an audience
 * list anyone has since edited is left alone.
 */
const REWORDED: Array<{ from: string; to: string }> = [
  { from: "HR professionals and managers", to: "Professionals" },
];

async function reword(payload: Payload, id: number | string, doc: Record<string, unknown>) {
  const audience = doc.audience;
  if (!Array.isArray(audience)) return;

  let changed = false;
  const updated = audience.map((item) => {
    const row = item as { text?: string };
    const match = REWORDED.find((entry) => row.text === entry.from);
    if (!match) return item;
    changed = true;
    return { ...row, text: match.to };
  });
  if (!changed) return;

  await payload.update({
    collection: "workshops",
    id,
    data: { audience: updated as { text: string }[] },
    overrideAccess: true,
  });
  payload.logger.info("[workshops] reworded the audience list on the THRIVE 360 record");
}

export async function seedFirstWorkshop(payload: Payload): Promise<void> {
  try {
    const existing = await payload.find({
      collection: "workshops",
      where: { slug: { equals: THRIVE_360.slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });

    const found = existing.docs[0];
    if (found) {
      const doc = found as unknown as Record<string, unknown>;
      await backfill(payload, found.id, doc);
      await reword(payload, found.id, doc);
      return;
    }

    // Somebody else's workshop is in here — leave the collection alone.
    const any = await payload.find({ collection: "workshops", limit: 1, depth: 0, overrideAccess: true });
    if (any.totalDocs > 0) return;

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
