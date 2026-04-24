import { db } from '../lib/db/index.js';
import { applicationRounds } from '../lib/db/schema/application.js';
import { users } from '../lib/db/schema/auth.js';
import { eq } from 'drizzle-orm';

async function createDefaultRound() {
  try {
    // Check if any rounds exist
    const existingRounds = await db.select().from(applicationRounds).limit(1);
    
    if (existingRounds.length === 0) {
      // Get a user to be the creator (preferably an admin)
      const [creatorUser] = await db.select().from(users).limit(1);
      
      if (!creatorUser) {
        console.log('No users found in database. Please create a user first.');
        return;
      }
      
      // Create a default application round
      const now = new Date();
      const startDate = new Date(now);
      const endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + 3); // 3 months from now
      
      const [newRound] = await db.insert(applicationRounds).values({
        name: '2024 Housing Allocation Round',
        status: 'OPEN',
        startsAt: startDate,
        endsAt: endDate,
        createdByUserId: creatorUser.id,
        createdAt: now,
        updatedAt: now,
      }).returning();
      
      console.log('Created default application round:', newRound);
    } else {
      console.log('Application rounds already exist:', existingRounds);
    }
  } catch (error) {
    console.error('Error creating default round:', error);
  }
}

createDefaultRound().then(() => process.exit(0));
