import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { index, pgEnum, pgTable, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

import { applicationRounds, applications } from './application.js';
import { users } from './auth.js';
import { housingUnits } from './housing.js';

export const allocationResultStatusEnum = pgEnum('allocation_result_status', [
  'PRELIMINARY',
  'PUBLISHED',
]);

export const allocationResults = pgTable(
  'allocation_results',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    roundId: uuid('round_id')
      .notNull()
      .references(() => applicationRounds.id, { onDelete: 'cascade' }),
    applicationId: uuid('application_id')
      .notNull()
      .references(() => applications.id, { onDelete: 'cascade' }),
    housingUnitId: uuid('housing_unit_id')
      .notNull()
      .references(() => housingUnits.id, { onDelete: 'restrict' }),
    allocatedByUserId: uuid('allocated_by_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    status: allocationResultStatusEnum('status').notNull().default('PRELIMINARY'),
    allocatedAt: timestamp('allocated_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    // Include status so PRELIMINARY and PUBLISHED can coexist for the same round.
    uniqueIndex('allocation_results_round_application_unique').on(
      table.roundId,
      table.applicationId,
      table.status,
    ),
    uniqueIndex('allocation_results_round_housing_unit_unique').on(
      table.roundId,
      table.housingUnitId,
      table.status,
    ),
    index('allocation_results_round_idx').on(table.roundId),
    index('allocation_results_housing_unit_idx').on(table.housingUnitId),
  ],
);

export type AllocationResult = InferSelectModel<typeof allocationResults>;
export type NewAllocationResult = InferInsertModel<typeof allocationResults>;
