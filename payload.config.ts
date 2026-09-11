import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
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

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

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
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: {
    outputFile: path.resolve(dirname, "src/payload-types.ts"),
  },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI },
  }),
  sharp,
});
