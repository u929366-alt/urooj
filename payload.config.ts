import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Users } from "./src/collections/Users.ts";
import { Media } from "./src/collections/Media.ts";
import { Courses } from "./src/collections/Courses.ts";
import { Modules } from "./src/collections/Modules.ts";
import { Lessons } from "./src/collections/Lessons.ts";
import { Enrollments } from "./src/collections/Enrollments.ts";
import { LessonProgress } from "./src/collections/LessonProgress.ts";
import { Quizzes } from "./src/collections/Quizzes.ts";
import { QuizAttempts } from "./src/collections/QuizAttempts.ts";
import { Assignments } from "./src/collections/Assignments.ts";
import { Submissions } from "./src/collections/Submissions.ts";
import { SubmissionFiles } from "./src/collections/SubmissionFiles.ts";
import { Discussions, DiscussionReplies } from "./src/collections/Discussions.ts";
import { Certificates } from "./src/collections/Certificates.ts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/**
 * Database adapter, chosen from DATABASE_URI.
 *
 * SQLite is the default because the site runs on shared cPanel hosting, which
 * generally offers MySQL and no PostgreSQL. SQLite needs no database server at
 * all — it is one file on disk — so the portal runs anywhere Node.js does.
 *
 * Set DATABASE_URI to a postgres:// URL to use PostgreSQL instead; nothing
 * else has to change. Worth doing if the portal ever outgrows shared hosting,
 * since SQLite serialises writes and will strain under heavy concurrent use.
 */
const databaseUri = process.env.DATABASE_URI?.trim() ?? "";
const usePostgres = databaseUri.startsWith("postgres://") || databaseUri.startsWith("postgresql://");

// A bare path is accepted too, so DATABASE_URI=./data/hunarsaaz.db works.
const sqlitePath = databaseUri
  ? databaseUri.startsWith("file:")
    ? databaseUri.slice("file:".length)
    : path.resolve(dirname, databaseUri)
  : path.resolve(dirname, "data/hunarsaaz.db");

if (!usePostgres) {
  // SQLite will not create the containing folder itself — it just fails to
  // open with "error 14", which on a fresh deploy looks like a server fault
  // rather than a missing directory. Create it up front.
  fs.mkdirSync(path.dirname(sqlitePath), { recursive: true });
}

const db = usePostgres
  ? postgresAdapter({ pool: { connectionString: databaseUri } })
  : sqliteAdapter({ client: { url: `file:${sqlitePath}` } });

// Note on schema: `npm run dev` creates and updates the tables automatically,
// but a production build cannot — the tooling that does it is a development
// dependency and is not part of the standalone output. A deployment therefore
// ships with data/hunarsaaz.db already created (see "Deploying" in the
// README); an empty database file is not enough, and produces "no such table"
// on every page that reads content.

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: " — Hunarsaaz" },
  },
  // The marketing site already owns /api/{contact,admission,donation,...},
  // so Payload's REST API is mounted out of the way.
  routes: {
    api: "/cms-api",
  },
  collections: [
    Users,
    Media,
    Courses,
    Modules,
    Lessons,
    Enrollments,
    LessonProgress,
    Quizzes,
    QuizAttempts,
    Assignments,
    Submissions,
    SubmissionFiles,
    Discussions,
    DiscussionReplies,
    Certificates,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: {
    outputFile: path.resolve(dirname, "src/payload-types.ts"),
  },
  db,
  sharp,
});
