/**
 * Adds a quiz and an assignment to the seeded course, so the assessment flow
 * can be exercised locally. Run after `npm run seed`. Safe to re-run.
 */
import "dotenv/config";
import { getPayload } from "payload";
import config from "../payload.config.ts";

async function run() {
  const payload = await getPayload({ config });

  const lessons = await payload.find({
    collection: "lessons",
    where: { slug: { equals: "setting-up-your-editor" } },
    limit: 1,
    overrideAccess: true,
  });
  const lesson = lessons.docs[0];
  if (!lesson) throw new Error("Run `npm run seed` first — seeded lesson not found.");

  const courseId = typeof lesson.course === "object" ? lesson.course.id : lesson.course;

  const existingQuiz = await payload.find({
    collection: "quizzes",
    where: { lesson: { equals: lesson.id } },
    limit: 1,
    overrideAccess: true,
  });

  if (!existingQuiz.docs[0]) {
    await payload.create({
      collection: "quizzes",
      overrideAccess: true,
      data: {
        title: "Check your understanding",
        course: courseId,
        lesson: lesson.id,
        description: "Two quick questions on what you have just covered.",
        passingScore: 50,
        maxAttempts: 0,
        questions: [
          {
            prompt: "Which language describes the structure of a web page?",
            type: "single",
            options: [
              { text: "HTML", correct: true },
              { text: "CSS", correct: false },
              { text: "SQL", correct: false },
            ],
            explanation: "HTML provides the structure; CSS styles it.",
          },
          {
            prompt: "Which of these are code editors?",
            type: "multiple",
            options: [
              { text: "Visual Studio Code", correct: true },
              { text: "Sublime Text", correct: true },
              { text: "Microsoft Excel", correct: false },
            ],
            explanation: "Excel is a spreadsheet, not a code editor.",
          },
        ],
      },
    });
    console.log("quiz created");
  } else {
    console.log("quiz already present");
  }

  const existingAssignment = await payload.find({
    collection: "assignments",
    where: { lesson: { equals: lesson.id } },
    limit: 1,
    overrideAccess: true,
  });

  if (!existingAssignment.docs[0]) {
    await payload.create({
      collection: "assignments",
      overrideAccess: true,
      data: {
        title: "Install your editor",
        slug: "install-your-editor",
        course: courseId,
        lesson: lesson.id,
        maxPoints: 20,
        allowFiles: true,
        acceptingSubmissions: true,
      },
    });
    console.log("assignment created");
  } else {
    console.log("assignment already present");
  }

  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
