import { db } from '../lib/db/index.js';

async function createDefaultScoringPolicy() {
  try {
    console.log('Creating default scoring policy...');
    
    await db.execute(`
      INSERT INTO scoring_policies (name, description, version, effective_from)
      VALUES ('Default Housing Scoring Policy', 'Standard policy for housing allocation scoring', 1, NOW())
      ON CONFLICT DO NOTHING
    `);
    
    console.log('Default scoring policy created successfully!');
    
    // Verify the policy was created
    const policies = await db.execute(`SELECT * FROM scoring_policies LIMIT 1`);
    console.log('Current scoring policies:', policies);
    
  } catch (error) {
    console.error('Error creating scoring policy:', error);
  }
}

createDefaultScoringPolicy().then(() => process.exit(0));
