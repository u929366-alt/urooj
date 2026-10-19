import { createClient } from "@libsql/client";

/**
 * Create the live-class tables if they are missing.
 *
 * Payload builds its own schema while `npm run dev` is running, but a
 * production build cannot: the tooling that does it is a development
 * dependency and is not in the standalone output. Until now that was handled
 * by shipping a prepared database file with each release.
 *
 * That is no longer possible. The live database holds instructors, students,
 * enrolments and payments added since launch, and overwriting it to add two
 * tables would destroy all of it. So the two tables are created here instead,
 * on startup, from the exact DDL Payload generated for them in development.
 *
 * Everything is IF NOT EXISTS, so it is safe to run on every boot and does
 * nothing at all once the tables are there. It never alters or drops
 * anything: the worst case is that it does nothing.
 *
 * It goes through @libsql/client, which is the same client the SQLite adapter
 * uses and is therefore certain to be in the standalone bundle. Node's own
 * node:sqlite looks tidier and does not survive the bundler.
 *
 * Keep this in step with the LiveSessions and LiveAttendance collections. If
 * a field is added to either, add the column here too — `npm run dev` against
 * a scratch database will print the statement Payload would have used.
 */

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS \`live_sessions\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`title\` text NOT NULL,
    \`room_name\` text,
    \`course_id\` integer,
    \`instructor_id\` integer NOT NULL,
    \`description\` text,
    \`starts_at\` text NOT NULL,
    \`duration_minutes\` numeric DEFAULT 60 NOT NULL,
    \`status\` text DEFAULT 'scheduled' NOT NULL,
    \`external_url\` text,
    \`recording_url\` text,
    \`attendance_count\` numeric DEFAULT 0,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`instructor_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  )`,
  `CREATE TABLE IF NOT EXISTS \`live_attendance\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`session_id\` integer NOT NULL,
    \`student_id\` integer NOT NULL,
    \`joined_at\` text NOT NULL,
    \`left_at\` text,
    \`minutes_present\` numeric DEFAULT 0,
    \`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    \`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
    FOREIGN KEY (\`session_id\`) REFERENCES \`live_sessions\`(\`id\`) ON UPDATE no action ON DELETE set null,
    FOREIGN KEY (\`student_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  )`,
  "CREATE INDEX IF NOT EXISTS `live_sessions_course_idx` ON `live_sessions` (`course_id`)",
  "CREATE INDEX IF NOT EXISTS `live_sessions_instructor_idx` ON `live_sessions` (`instructor_id`)",
  "CREATE INDEX IF NOT EXISTS `live_sessions_starts_at_idx` ON `live_sessions` (`starts_at`)",
  "CREATE INDEX IF NOT EXISTS `live_sessions_created_at_idx` ON `live_sessions` (`created_at`)",
  "CREATE INDEX IF NOT EXISTS `live_sessions_updated_at_idx` ON `live_sessions` (`updated_at`)",
  "CREATE UNIQUE INDEX IF NOT EXISTS `live_sessions_room_name_idx` ON `live_sessions` (`room_name`)",
  "CREATE INDEX IF NOT EXISTS `live_attendance_session_idx` ON `live_attendance` (`session_id`)",
  "CREATE INDEX IF NOT EXISTS `live_attendance_student_idx` ON `live_attendance` (`student_id`)",
  "CREATE INDEX IF NOT EXISTS `live_attendance_created_at_idx` ON `live_attendance` (`created_at`)",
  "CREATE INDEX IF NOT EXISTS `live_attendance_updated_at_idx` ON `live_attendance` (`updated_at`)",
];

export async function ensureLiveTables(sqlitePath: string): Promise<void> {
  try {
    const client = createClient({ url: `file:${sqlitePath}` });
    try {
      for (const statement of STATEMENTS) {
        await client.execute(statement);
      }
    } finally {
      client.close();
    }
  } catch (error) {
    // Deliberately not fatal. If this fails the live-class pages will error
    // with "no such table", which is a bad day for one feature; throwing here
    // would take down the whole portal, which is a bad day for everyone.
    console.error(
      "[live classes] could not create the live-class tables. Live classes will not work until this is fixed:",
      error,
    );
  }
}
