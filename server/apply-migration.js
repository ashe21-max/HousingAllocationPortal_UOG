import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { Pool } = pg;

// Read .env file
const envContent = readFileSync(join(__dirname, 'src/.env'), 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    env[key.trim()] = valueParts.join('=').trim();
  }
}

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

async function applyMigration() {
  const client = await pool.connect();
  try {
    console.log('Creating announcements table...');

    // Check if table exists
    const checkResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'announcements'
      );
    `);

    if (checkResult.rows[0].exists) {
      console.log('Announcements table already exists.');
      return;
    }

    // Create the table
    await client.query(`
      CREATE TABLE "announcements" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "title" varchar(255) NOT NULL,
        "content" text NOT NULL,
        "type" varchar(50) DEFAULT 'GENERAL' NOT NULL,
        "target_roles" text[],
        "is_active" boolean DEFAULT true NOT NULL,
        "starts_at" timestamp with time zone,
        "ends_at" timestamp with time zone,
        "created_by" uuid NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL
      );
    `);

    // Create indexes
    await client.query(`
      CREATE INDEX "announcements_created_by_idx" ON "announcements" USING btree ("created_by");
    `);
    await client.query(`
      CREATE INDEX "announcements_is_active_idx" ON "announcements" USING btree ("is_active");
    `);
    await client.query(`
      CREATE INDEX "announcements_type_idx" ON "announcements" USING btree ("type");
    `);

    // Add foreign key
    await client.query(`
      ALTER TABLE "announcements" 
      ADD CONSTRAINT "announcements_created_by_fkey" 
      FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE;
    `);

    console.log('Announcements table created successfully!');
  } catch (error) {
    console.error('Error applying migration:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

applyMigration();
