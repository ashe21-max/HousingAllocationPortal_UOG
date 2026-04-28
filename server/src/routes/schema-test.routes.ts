import { Router } from 'express';
import { db } from '../lib/db/index.js';

const schemaTestRouter = Router();

schemaTestRouter.get('/columns', async (req, res) => {
  try {
    // Check what columns exist in system_backups table
    const result = await db.execute(sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'system_backups' 
      ORDER BY ordinal_position
    `);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Schema test error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

import { sql } from 'drizzle-orm';

export { schemaTestRouter };
