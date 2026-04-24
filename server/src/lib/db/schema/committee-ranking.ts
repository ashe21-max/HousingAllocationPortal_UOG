import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { index, integer, pgTable, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { applications, applicationRounds } from './application.js';
import { users } from './auth.js';

export const committeeRankEntries = pgTable(
  'committee_rank_entries',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    roundId: uuid('round_id')
      .notNull()
      .references(() => applicationRounds.id, { onDelete: 'cascade' }),
    applicationId: uuid('application_id')
      .notNull()
      .references(() => applications.id, { onDelete: 'cascade' }),
    rankPosition: integer('rank_position').notNull(),
    updatedByUserId: uuid('updated_by_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
  },
  (table) => [
    uniqueIndex('committee_rank_entries_application_id_unique').on(
      table.applicationId,
    ),
    uniqueIndex('committee_rank_entries_round_rank_unique').on(
      table.roundId,
      table.rankPosition,
    ),
    index('committee_rank_entries_round_id_idx').on(table.roundId),
  ],
);

export type CommitteeRankEntry = InferSelectModel<typeof committeeRankEntries>;
export type NewCommitteeRankEntry = InferInsertModel<typeof committeeRankEntries>;
