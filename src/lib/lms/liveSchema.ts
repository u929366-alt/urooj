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

/** The workshop tables, added when the first paid workshop was put online. */
const WORKSHOP_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS \`payment_receipts\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`registration_id\` integer,
	\`reference\` text,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`url\` text,
	\`thumbnail_u_r_l\` text,
	\`filename\` text,
	\`mime_type\` text,
	\`filesize\` numeric,
	\`width\` numeric,
	\`height\` numeric,
	\`focal_x\` numeric,
	\`focal_y\` numeric,
	FOREIGN KEY (\`registration_id\`) REFERENCES \`workshop_registrations\`(\`id\`) ON UPDATE no action ON DELETE set null
)`,
  `CREATE TABLE IF NOT EXISTS \`workshop_registrations\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`workshop_id\` integer NOT NULL,
	\`name\` text NOT NULL,
	\`email\` text NOT NULL,
	\`phone\` text,
	\`city\` text,
	\`category\` text DEFAULT 'professional' NOT NULL,
	\`organisation\` text,
	\`group_size\` numeric DEFAULT 1,
	\`notes\` text,
	\`status\` text DEFAULT 'pending' NOT NULL,
	\`payment_reference\` text,
	\`receipt_id\` integer,
	\`receipt_uploaded_at\` text,
	\`verified_at\` text,
	\`verified_by_id\` integer,
	\`amount_due\` numeric,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (\`workshop_id\`) REFERENCES \`workshops\`(\`id\`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (\`receipt_id\`) REFERENCES \`payment_receipts\`(\`id\`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (\`verified_by_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
)`,
  `CREATE TABLE IF NOT EXISTS \`workshops\` (
	\`id\` integer PRIMARY KEY NOT NULL,
	\`title\` text NOT NULL,
	\`slug\` text,
	\`tagline\` text,
	\`summary\` text,
	\`presenter_name\` text,
	\`presenter_title\` text,
	\`presenter_org\` text,
	\`presenter_photo_id\` integer,
	\`presenter_photo_url\` text,
	\`starts_at\` text NOT NULL,
	\`ends_at\` text,
	\`platform\` text DEFAULT 'Zoom',
	\`join_url\` text,
	\`price_professional\` numeric DEFAULT 0,
	\`price_student\` numeric DEFAULT 0,
	\`fee_note\` text,
	\`contact_name\` text,
	\`contact_email\` text,
	\`status\` text DEFAULT 'open' NOT NULL,
	\`capacity\` numeric,
	\`registration_count\` numeric DEFAULT 0,
	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	\`venue_note\` text,
	\`confirmation_intro\` text,
	\`confirmation_closing\` text,
	FOREIGN KEY (\`presenter_photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
)`,
  `CREATE TABLE IF NOT EXISTS \`workshops_audience\` (
	\`_order\` integer NOT NULL,
	\`_parent_id\` integer NOT NULL,
	\`id\` text PRIMARY KEY NOT NULL,
	\`text\` text NOT NULL,
	FOREIGN KEY (\`_parent_id\`) REFERENCES \`workshops\`(\`id\`) ON UPDATE no action ON DELETE cascade
)`,
  `CREATE TABLE IF NOT EXISTS \`workshops_includes\` (
	\`_order\` integer NOT NULL,
	\`_parent_id\` integer NOT NULL,
	\`id\` text PRIMARY KEY NOT NULL,
	\`text\` text NOT NULL,
	FOREIGN KEY (\`_parent_id\`) REFERENCES \`workshops\`(\`id\`) ON UPDATE no action ON DELETE cascade
)`,
  `CREATE TABLE IF NOT EXISTS \`workshops_outcomes\` (
	\`_order\` integer NOT NULL,
	\`_parent_id\` integer NOT NULL,
	\`id\` text PRIMARY KEY NOT NULL,
	\`text\` text NOT NULL,
	FOREIGN KEY (\`_parent_id\`) REFERENCES \`workshops\`(\`id\`) ON UPDATE no action ON DELETE cascade
)`,
  `CREATE INDEX IF NOT EXISTS \`payment_receipts_created_at_idx\` ON \`payment_receipts\` (\`created_at\`)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS \`payment_receipts_filename_idx\` ON \`payment_receipts\` (\`filename\`)`,
  `CREATE INDEX IF NOT EXISTS \`payment_receipts_reference_idx\` ON \`payment_receipts\` (\`reference\`)`,
  `CREATE INDEX IF NOT EXISTS \`payment_receipts_registration_idx\` ON \`payment_receipts\` (\`registration_id\`)`,
  `CREATE INDEX IF NOT EXISTS \`payment_receipts_updated_at_idx\` ON \`payment_receipts\` (\`updated_at\`)`,
  `CREATE INDEX IF NOT EXISTS \`workshop_registrations_created_at_idx\` ON \`workshop_registrations\` (\`created_at\`)`,
  `CREATE INDEX IF NOT EXISTS \`workshop_registrations_email_idx\` ON \`workshop_registrations\` (\`email\`)`,
  `CREATE INDEX IF NOT EXISTS \`workshop_registrations_payment_reference_idx\` ON \`workshop_registrations\` (\`payment_reference\`)`,
  `CREATE INDEX IF NOT EXISTS \`workshop_registrations_receipt_idx\` ON \`workshop_registrations\` (\`receipt_id\`)`,
  `CREATE INDEX IF NOT EXISTS \`workshop_registrations_updated_at_idx\` ON \`workshop_registrations\` (\`updated_at\`)`,
  `CREATE INDEX IF NOT EXISTS \`workshop_registrations_verified_by_idx\` ON \`workshop_registrations\` (\`verified_by_id\`)`,
  `CREATE INDEX IF NOT EXISTS \`workshop_registrations_workshop_idx\` ON \`workshop_registrations\` (\`workshop_id\`)`,
  `CREATE INDEX IF NOT EXISTS \`workshops_audience_order_idx\` ON \`workshops_audience\` (\`_order\`)`,
  `CREATE INDEX IF NOT EXISTS \`workshops_audience_parent_id_idx\` ON \`workshops_audience\` (\`_parent_id\`)`,
  `CREATE INDEX IF NOT EXISTS \`workshops_created_at_idx\` ON \`workshops\` (\`created_at\`)`,
  `CREATE INDEX IF NOT EXISTS \`workshops_includes_order_idx\` ON \`workshops_includes\` (\`_order\`)`,
  `CREATE INDEX IF NOT EXISTS \`workshops_includes_parent_id_idx\` ON \`workshops_includes\` (\`_parent_id\`)`,
  `CREATE INDEX IF NOT EXISTS \`workshops_outcomes_order_idx\` ON \`workshops_outcomes\` (\`_order\`)`,
  `CREATE INDEX IF NOT EXISTS \`workshops_outcomes_parent_id_idx\` ON \`workshops_outcomes\` (\`_parent_id\`)`,
  `CREATE INDEX IF NOT EXISTS \`workshops_presenter_photo_idx\` ON \`workshops\` (\`presenter_photo_id\`)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS \`workshops_slug_idx\` ON \`workshops\` (\`slug\`)`,
  `CREATE INDEX IF NOT EXISTS \`workshops_starts_at_idx\` ON \`workshops\` (\`starts_at\`)`,
  `CREATE INDEX IF NOT EXISTS \`workshops_updated_at_idx\` ON \`workshops\` (\`updated_at\`)`,
];

/**
 * Columns that must be added to tables that already exist.
 *
 * Payload keeps one column per collection on `payload_locked_documents_rels`,
 * its document-locking table. Adding a collection therefore does not only mean
 * a new table: it means a new column on that old one, and without it every
 * create and update on the new collection fails with "no such column" after
 * the row has already been written.
 *
 * SQLite has no ADD COLUMN IF NOT EXISTS, so each one is checked first.
 *
 * `index` is given only where Payload itself would index the column — it
 * indexes relationships, not free text. An index SQLite did not ask for is
 * not harmless either: a column carrying one cannot be dropped afterwards.
 */
const ADDED_COLUMNS: Array<{ table: string; column: string; definition: string; index?: string }> = [
  {
    table: "payload_locked_documents_rels",
    column: "live_sessions_id",
    definition: "integer REFERENCES live_sessions(id) ON DELETE cascade",
    index: "payload_locked_documents_rels_live_sessions_id_idx",
  },
  {
    table: "payload_locked_documents_rels",
    column: "live_attendance_id",
    definition: "integer REFERENCES live_attendance(id) ON DELETE cascade",
    index: "payload_locked_documents_rels_live_attendance_id_idx",
  },
  {
    table: "payload_locked_documents_rels",
    column: "workshops_id",
    definition: "integer REFERENCES workshops(id) ON DELETE cascade",
    index: "payload_locked_documents_rels_workshops_id_idx",
  },
  {
    table: "payload_locked_documents_rels",
    column: "workshop_registrations_id",
    definition: "integer REFERENCES workshop_registrations(id) ON DELETE cascade",
    index: "payload_locked_documents_rels_workshop_registrations_id_idx",
  },
  {
    table: "payload_locked_documents_rels",
    column: "payment_receipts_id",
    definition: "integer REFERENCES payment_receipts(id) ON DELETE cascade",
    index: "payload_locked_documents_rels_payment_receipts_id_idx",
  },
  // For a server that already installed the workshop release: its
  // workshop_registrations table predates receipts, and CREATE TABLE IF NOT
  // EXISTS will not add a column to a table that is already there.
  {
    table: "workshop_registrations",
    column: "receipt_id",
    definition: "integer REFERENCES payment_receipts(id) ON DELETE set null",
    index: "workshop_registrations_receipt_idx",
  },
  {
    table: "workshop_registrations",
    column: "receipt_uploaded_at",
    definition: "text",
  },
  {
    table: "workshop_registrations",
    column: "verified_at",
    definition: "text",
  },
  {
    table: "workshop_registrations",
    column: "verified_by_id",
    definition: "integer REFERENCES users(id) ON DELETE set null",
    index: "workshop_registrations_verified_by_idx",
  },
  // What the confirmation letter says under Venue/Platform until there is a
  // joining link to send instead.
  {
    table: "workshops",
    column: "venue_note",
    definition: "text",
  },
  // The body of the confirmation letter, written by whoever is presenting.
  {
    table: "workshops",
    column: "confirmation_intro",
    definition: "text",
  },
  {
    table: "workshops",
    column: "confirmation_closing",
    definition: "text",
  },
];

/**
 * Bring the database up to the schema this build expects.
 *
 * Every statement stands on its own. It used to be one try around the whole
 * lot, which meant a single statement the database would not accept took the
 * rest down with it silently — and since the columns are added last, the
 * failure that showed up was a page erroring on a column that was never
 * added, nowhere near the statement that actually went wrong. Now a failure
 * is logged, named, and stepped over.
 *
 * None of it is fatal. A missing table breaks one feature; throwing here
 * would take down the whole portal, which is a bad day for everyone.
 */
export async function ensureLiveTables(sqlitePath: string): Promise<void> {
  let client;
  try {
    client = createClient({ url: `file:${sqlitePath}` });
  } catch (error) {
    console.error(`[schema] could not open the database at ${sqlitePath}:`, error);
    return;
  }

  const failures: string[] = [];
  const added: string[] = [];

  try {
    for (const statement of [...STATEMENTS, ...WORKSHOP_STATEMENTS]) {
      try {
        await client.execute(statement);
      } catch (error) {
        // The first line is enough to recognise which statement it was.
        const what = statement.split("\n")[0].slice(0, 80);
        failures.push(`${what} — ${error}`);
      }
    }

    for (const entry of ADDED_COLUMNS) {
      const where = `${entry.table}.${entry.column}`;
      try {
        const info = await client.execute(`PRAGMA table_info(\`${entry.table}\`)`);
        if (info.rows.length === 0) {
          // No such table. Either it is about to be created by a later
          // release, or a statement above failed; either way, not here.
          continue;
        }
        if (info.rows.some((row) => row.name === entry.column)) continue;

        await client.execute(
          `ALTER TABLE \`${entry.table}\` ADD COLUMN \`${entry.column}\` ${entry.definition}`,
        );
        added.push(where);

        if (entry.index) {
          await client.execute(
            `CREATE INDEX IF NOT EXISTS \`${entry.index}\` ON \`${entry.table}\` (\`${entry.column}\`)`,
          );
        }
      } catch (error) {
        failures.push(`${where} — ${error}`);
      }
    }
  } finally {
    client.close();
  }

  if (added.length > 0) {
    console.log(`[schema] added ${added.length} column(s): ${added.join(", ")}`);
  }
  if (failures.length > 0) {
    console.error(
      `[schema] ${failures.length} statement(s) failed; some pages will error until this is fixed:\n  ${failures.join("\n  ")}`,
    );
  } else {
    console.log("[schema] database is up to date");
  }
}
