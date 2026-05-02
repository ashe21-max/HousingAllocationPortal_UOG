import 'dotenv/config';

import { pool } from '../lib/db/index.js';
import { upsertSeedAdmin } from '../repository/user.repository.js';

async function main(): Promise<void> {
  const seededAdmin = await upsertSeedAdmin({
    name: 'ashu',
    email: 'ashenafiyfat@gmail.com',
    password: 'Ashu@3610',
  });

  if (!seededAdmin) {
    throw new Error('Failed to seed admin user');
  }

  console.log(
    JSON.stringify(
      {
        success: true,
        admin: seededAdmin,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (pool) {
      await pool.end();
    }
  });
