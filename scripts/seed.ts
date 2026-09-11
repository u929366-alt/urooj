/**
 * Development seed: one admin, one instructor, one student, and a small
 * course with two modules and four lessons.
 *
 * Run with:  npm run seed
 * Safe to re-run: it looks for existing records by email/slug first.
 */
import "dotenv/config";
import { getPayload } from "payload";
import config from "../payload.config.ts";

const ADMIN = { email: "admin@hunarsaaz.pk", password: "ChangeMe123!", name: "Hunarsaaz Admin" };
const INSTRUCTOR = { email: "instructor@hunarsaaz.pk", password: "ChangeMe123!", name: "Aisha Khan" };
const STUDENT = { email: "student@hunarsaaz.pk", password: "ChangeMe123!", name: "Bilal Ahmed" };

async function upsertUser(
  payload: Awaited<ReturnType<typeof getPayload>>,
  user: { email: string; password: string; name: string },
  role: "admin" | "instructor" | "student",
) {
  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: user.email } },
    limit: 1,
    overrideAccess: true,
  });
  if (existing.docs[0]) return existing.docs[0];

  const created = await payload.create({
    collection: "users",
    data: { ...user, role },
    overrideAccess: true,
  });

  // The first-user hook forces "admin"; later users are forced to "student".
  // Either way, set the role we actually want now that the doc exists.
  if (created.role !== role) {
    return payload.update({
      collection: "users",
      id: created.id,
      data: { role },
      overrideAccess: true,
    });
  }
  return created;
}

async function seed() {
  const payload = await getPayload({ config });

  const admin = await upsertUser(payload, ADMIN, "admin");
  const instructor = await upsertUser(payload, INSTRUCTOR, "instructor");
  const student = await upsertUser(payload, STUDENT, "student");
  console.log(`users: admin=${admin.id} instructor=${instructor.id} student=${student.id}`);

  const courseSlug = "web-development-fundamentals";
  const found = await payload.find({
    collection: "courses",
    where: { slug: { equals: courseSlug } },
    limit: 1,
    overrideAccess: true,
  });

  const course =
    found.docs[0] ??
    (await payload.create({
      collection: "courses",
      overrideAccess: true,
      data: {
        title: "Web Development Fundamentals",
        slug: courseSlug,
        status: "published",
        summary:
          "Build and publish your first website. HTML, CSS and the basics of JavaScript, taught from scratch with no prior experience needed.",
        instructor: instructor.id,
        level: "beginner",
        language: "both",
        durationWeeks: 8,
        programSlug: "web-development",
        enrollmentOpen: true,
      },
    }));
  console.log(`course: ${course.id}`);

  const modulePlan = [
    {
      title: "Getting Started",
      order: 1,
      summary: "What the web is, and the tools you need.",
      lessons: [
        { title: "How the Web Works", order: 1, durationMinutes: 12, preview: true },
        { title: "Setting Up Your Editor", order: 2, durationMinutes: 18, preview: false },
      ],
    },
    {
      title: "Writing HTML",
      order: 2,
      summary: "Structure a page with real markup.",
      lessons: [
        { title: "Your First HTML Page", order: 1, durationMinutes: 22, preview: false },
        { title: "Links, Images and Lists", order: 2, durationMinutes: 25, preview: false },
      ],
    },
  ];

  for (const m of modulePlan) {
    const existingModule = await payload.find({
      collection: "modules",
      where: {
        and: [{ course: { equals: course.id } }, { title: { equals: m.title } }],
      },
      limit: 1,
      overrideAccess: true,
    });

    const mod =
      existingModule.docs[0] ??
      (await payload.create({
        collection: "modules",
        overrideAccess: true,
        data: { title: m.title, course: course.id, order: m.order, summary: m.summary },
      }));

    for (const l of m.lessons) {
      const existingLesson = await payload.find({
        collection: "lessons",
        where: {
          and: [{ module: { equals: mod.id } }, { title: { equals: l.title } }],
        },
        limit: 1,
        overrideAccess: true,
      });
      if (existingLesson.docs[0]) continue;

      await payload.create({
        collection: "lessons",
        overrideAccess: true,
        data: {
          title: l.title,
          module: mod.id,
          course: course.id,
          order: l.order,
          preview: l.preview,
          durationMinutes: l.durationMinutes,
        },
      });
    }
  }

  const lessonCount = await payload.count({
    collection: "lessons",
    where: { course: { equals: course.id } },
    overrideAccess: true,
  });
  console.log(`lessons on course: ${lessonCount.totalDocs}`);
  console.log("\nSeed complete. Sign in at /admin or /learn/login with:");
  console.log(`  admin      ${ADMIN.email} / ${ADMIN.password}`);
  console.log(`  instructor ${INSTRUCTOR.email} / ${INSTRUCTOR.password}`);
  console.log(`  student    ${STUDENT.email} / ${STUDENT.password}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
