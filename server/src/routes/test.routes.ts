import { Router } from 'express';
import { db } from '../lib/db/index.js';
import { systemBackups } from '../lib/db/schema/backup.js';
import { eq } from 'drizzle-orm';

const testRouter = Router();

testRouter.get('/test-backup', async (req, res) => {
  try {
    // Test simple database query
    const result = await db.select().from(systemBackups).limit(1);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Test backup error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

testRouter.post('/test-backup', async (req, res) => {
  try {
    // Test simple backup creation with proper UUID
    const { randomUUID } = await import('crypto');
    const newBackup = {
      id: randomUUID(),
      filename: 'test-backup.sql',
      type: 'full',
      size: 1024,
      status: 'completed',
      description: 'Test backup',
      tables: null,
      createdBy: '00000000-0000-0000-0000-000000000000',
      completedAt: new Date(),
    };

    const result = await db.insert(systemBackups).values(newBackup).returning();
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Test backup creation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

testRouter.get('/test-backup/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [backup] = await db.select().from(systemBackups).where(eq(systemBackups.id, id));
    
    if (!backup) {
      return res.status(404).json({ success: false, error: 'Backup not found' });
    }
    
    res.json({ success: true, data: backup });
  } catch (error) {
    console.error('Test backup retrieval error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export { testRouter };
