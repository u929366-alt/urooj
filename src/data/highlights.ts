/**
 * Short clips from a training session, for the About page.
 *
 * Hosted on the site rather than embedded from YouTube: these are under a
 * megabyte each, there is no advertising or "up next" panel to apologise
 * for, and nothing about the page then depends on a third party staying up.
 * They are loaded only when somebody presses play — the poster image is all
 * that is fetched otherwise.
 *
 * The titles below describe the slide on screen. Nobody has transcribed what
 * is being said, so if a clip is really about something else, change the
 * title here and it changes on the page.
 */
export type Highlight = {
  /** Under /public/videos. */
  src: string;
  poster: string;
  title: string;
  description: string;
  /** Whole seconds, shown on the card. */
  seconds: number;
};

export const trainingHighlights: Highlight[] = [
  {
    src: "/videos/thrive-360-2.mp4",
    poster: "/videos/posters/thrive-360-2.jpg",
    title: "The 360° connection",
    description:
      "Why wellbeing cannot be separated into compartments — what happens at home shows up in the classroom, and what happens at work follows people home.",
    seconds: 28,
  },
  {
    src: "/videos/thrive-360-3.mp4",
    poster: "/videos/posters/thrive-360-3.jpg",
    title: "The reality check",
    description:
      "Meeting deadlines, fulfilling responsibilities, managing expectations — and the question underneath all of it: are you living, managing, or thriving?",
    seconds: 25,
  },
  {
    src: "/videos/thrive-360-1.mp4",
    poster: "/videos/posters/thrive-360-1.jpg",
    title: "Opening the session",
    description:
      "Ms. Asma Ahmed introduces THRIVE 360 and the practical, people-centred approach the workshop takes to everyday wellbeing.",
    seconds: 23,
  },
  {
    src: "/videos/thrive-360-4.mp4",
    poster: "/videos/posters/thrive-360-4.jpg",
    title: "Who the workshop is for",
    description:
      "Parents, students and working professionals in the same room — and why the same ideas serve all three.",
    seconds: 20,
  },
];

/**
 * Registrations and accreditations, with the paperwork behind them.
 *
 * Only things we can show a document for. An organisation that lists an
 * accreditation it cannot evidence invites exactly the question it was
 * hoping to avoid.
 */
export type Credential = {
  title: string;
  issuer: string;
  reference: string;
  issued: string;
  summary: string;
  /** The document itself, under /public/documents. */
  document: string;
  /** A picture of its first page, for the card. */
  preview?: string;
  /** Said on the card when the published copy has been altered. */
  redacted?: string;
};

export const credentials: Credential[] = [
  {
    title: "NAVTTC Registered Institute",
    issuer:
      "National Vocational & Technical Training Commission (NAVTTC), Government of Pakistan",
    reference: "NAVTTC-3(4)-NIRC-24-2455",
    issued: "17 November 2026 — valid to 16 November 2029",
    summary:
      "Hunarsaaz is registered with NAVTTC as a Technical and Vocational Education and Training (TVET) institute, grade D, for three years. Registered trades: eCommerce, and Certificate in IT (Web Development). NAVTTC will confirm this certificate on request at attestation@navttc.gov.pk.",
    document: "/documents/hunarsaaz-navttc-registration.pdf",
    preview: "/documents/hunarsaaz-navttc-registration.jpg",
    /**
     * The certificate names the owner's CNIC. A national identity number has
     * no business on a public web page — it is blacked out on the copy
     * published here, and the certificate proves exactly as much without it.
     * Anyone needing to check it can, with NAVTTC, from the number above.
     */
    redacted: "The owner's CNIC has been blacked out on this copy.",
  },
  {
    title: "Registered Society",
    issuer: "Registrar of Joint Stock Companies, Rawalpindi — Government of the Punjab",
    reference: "CSR-25/2025",
    issued: "18 November 2026",
    summary:
      "Registered under Section 4 of the Societies Registration Act 1860, with the list of office bearers filed for 2026. This is the legal basis on which the organisation operates, holds funds and issues receipts.",
    document: "/documents/hunarsaaz-society-registration.pdf",
    preview: "/documents/hunarsaaz-society-registration.jpg",
  },
];
