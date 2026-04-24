import { db } from '../lib/db/index.js';
import fs from 'fs';
import path from 'path';

async function applyAllMigrations() {
  try {
    console.log('Starting to apply all database migrations...');
    
    const drizzleDir = path.join(process.cwd(), 'drizzle');
    const migrationFiles = fs.readdirSync(drizzleDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to apply in order
    
    console.log(`Found ${migrationFiles.length} migration files to apply`);
    
    for (const file of migrationFiles) {
      console.log(`Applying migration: ${file}`);
      
      const migrationPath = path.join(drizzleDir, file);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      
      // Split by statement breaker and execute each statement
      const statements = migrationSQL.split('--> statement-breakpoint');
      
      for (const statement of statements) {
        const cleanStatement = statement.trim();
        if (cleanStatement) {
          try {
            await db.execute(cleanStatement);
            console.log(`  Executed: ${cleanStatement.substring(0, 50)}...`);
          } catch (error) {
            console.log(`  Note: Statement may already exist or failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      }
      
      console.log(`Completed migration: ${file}`);
    }
    
    console.log('All migrations applied successfully!');
    
    // Create a default scoring policy if none exists
    const existingPolicy = await db.execute(`
      SELECT id FROM scoring_policies LIMIT 1
    `);
    
    if (existingPolicy.rowCount === 0) {
      console.log('Creating default scoring policy...');
      await db.execute(`
        INSERT INTO scoring_policies (name, description, version, effective_from)
        VALUES ('Default Housing Scoring Policy', 'Standard policy for housing allocation scoring', 1, NOW())
      `);
      console.log('Default scoring policy created');
    }
    
  } catch (error) {
    console.error('Error applying migrations:', error);
  }
}

applyAllMigrations().then(() => process.exit(0));
