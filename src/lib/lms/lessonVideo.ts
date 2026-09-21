import type { Lesson } from "@/payload-types";

/**
 * Video links that were attached automatically and must not be played.
 *
 * When the 45 courses were imported, 29 lessons had a YouTube link attached
 * that had been found by search and never watched by anyone at Hunarsaaz. They
 * are somebody else's videos, unvetted, and Hunarsaaz asked for them to go.
 *
 * They sit in the lessons table of a live database that also holds the
 * instructors, students and enrolments added since, so they are not worth
 * shipping a database to delete. The lesson player skips them instead. The
 * value is still in the record, visible to anyone editing that lesson in the
 * admin, who can clear the field properly.
 *
 * A link added by hand in the admin is not on this list and plays normally, so
 * Hunarsaaz's own recordings work the day they are added.
 */
const SUPPRESSED = new Set<string>([
  "https://www.youtube.com/watch?v=WUniTVTi_Jk",
  "https://www.youtube.com/watch?v=F-PXyeYC2s4",
  "https://www.youtube.com/watch?v=9aPAPANeMKg",
  "https://www.youtube.com/watch?v=_xo8LLa2JUY",
  "https://www.youtube.com/watch?v=qGKVSl7_1EU",
  "https://www.youtube.com/watch?v=saIbEU5a2nA",
  "https://www.youtube.com/watch?v=qy7XELw6Bc4",
  "https://www.youtube.com/watch?v=HFT2z3Uj-Q0",
  "https://www.youtube.com/watch?v=NYEDKq4i26M",
  "https://www.youtube.com/watch?v=npPEGSpT6H0",
  "https://www.youtube.com/watch?v=m9GeffK67vA",
  "https://www.youtube.com/watch?v=aAfkNeuX18k",
  "https://www.youtube.com/watch?v=QC7NENtXIe4",
  "https://www.youtube.com/watch?v=9qZcT9I8W4g",
  "https://www.youtube.com/watch?v=4IDnIiUFAcY",
  "https://www.youtube.com/watch?v=vPWCYZsoJaI",
  "https://www.youtube.com/watch?v=mGJyCH5BIi8",
  "https://www.youtube.com/watch?v=rJr7z0YCRnk",
  "https://www.youtube.com/watch?v=XEwUtEe_ogY",
  "https://www.youtube.com/watch?v=ZHUXfNQNtn8",
  "https://www.youtube.com/watch?v=k7Y63hw1x0w",
  "https://www.youtube.com/watch?v=1nZ92pngarg",
  "https://www.youtube.com/watch?v=6cygKNgYQCU",
  "https://www.youtube.com/watch?v=qDOrZw6Pryo",
  "https://www.youtube.com/watch?v=uAqaRQsWSDQ",
  "https://www.youtube.com/watch?v=SGT1l9AukLc",
  "https://www.youtube.com/watch?v=UzsaAgQ4cs8",
  "https://www.youtube.com/watch?v=Tznnrjkhp7E",
  "https://www.youtube.com/watch?v=0x8rhNLxAVc",
]);

/** The lesson's video, or null when it is one of the unvetted imported links. */
export function playableVideoUrl(lesson: Pick<Lesson, "videoUrl">): string | null {
  const url = lesson.videoUrl?.trim();
  if (!url) return null;
  return SUPPRESSED.has(url) ? null : url;
}
