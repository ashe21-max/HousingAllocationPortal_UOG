import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { users } from './auth.js';
import { housingUnits } from './housing.js';
import { scoreSnapshots } from './scoring.js';

export const applicationRoundStatusEnum = pgEnum('application_round_status', [
  'DRAFT',
  'OPEN',
  'CLOSED',
  'ARCHIVED',
]);

export const committeeRankingStatusEnum = pgEnum('committee_ranking_status', [
  'DRAFT',
  'PRELIMINARY_SUBMITTED',
  'FINAL_SUBMITTED',
]);

export const applicationStatusEnum = pgEnum('application_status', [
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'RANKED',
  'ALLOCATED',
  'REJECTED',
  'WITHDRAWN',
]);

export const applicationRounds = pgTable(
  'application_rounds',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    status: applicationRoundStatusEnum('status').notNull().default('DRAFT'),
    committeeRankingStatus: committeeRankingStatusEnum('committee_ranking_status')
      .notNull()
      .default('DRAFT'),
    committeePreliminarySubmittedAt: timestamp('committee_preliminary_submitted_at', {
      withTimezone: true,
      mode: 'date',
    }),
    committeeFinalSubmittedAt: timestamp('committee_final_submitted_at', {
      withTimezone: true,
      mode: 'date',
    }),
    startsAt: timestamp('starts_at', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
    endsAt: timestamp('ends_at', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
    createdByUserId: uuid('created_by_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('application_rounds_status_idx').on(table.status),
    index('application_rounds_window_idx').on(table.startsAt, table.endsAt),
  ],
);

export const applications = pgTable(
  'applications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roundId: uuid('round_id')
      .notNull()
      .references(() => applicationRounds.id, { onDelete: 'cascade' }),
    preferredHousingUnitId: uuid('preferred_housing_unit_id').references(
      () => housingUnits.id,
      { onDelete: 'set null' },
    ),
    scoreSnapshotId: uuid('score_snapshot_id').references(() => scoreSnapshots.id, {
      onDelete: 'set null',
    }),
    status: applicationStatusEnum('status').notNull().default('DRAFT'),
    submittedAt: timestamp('submitted_at', {
      withTimezone: true,
      mode: 'date',
    }),
    reviewedAt: timestamp('reviewed_at', {
      withTimezone: true,
      mode: 'date',
    }),
    reviewedByUserId: uuid('reviewed_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    complianceIssue: boolean('compliance_issue').notNull().default(false),
    complianceNotes: text('compliance_notes'),
    notes: text('notes'),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('applications_user_id_idx').on(table.userId),
    index('applications_round_id_idx').on(table.roundId),
    index('applications_status_idx').on(table.status),
    index('applications_round_status_idx').on(table.roundId, table.status),
    index('applications_compliance_issue_idx').on(table.complianceIssue),
  ],
);

export type ApplicationRound = InferSelectModel<typeof applicationRounds>;
export type NewApplicationRound = InferInsertModel<typeof applicationRounds>;
export type Application = InferSelectModel<typeof applications>;
export type NewApplication = InferInsertModel<typeof applications>;
export type ApplicationRoundStatus =
  (typeof applicationRoundStatusEnum.enumValues)[number];
export type ApplicationStatus = (typeof applicationStatusEnum.enumValues)[number];
export type CommitteeRankingStatus =
  (typeof committeeRankingStatusEnum.enumValues)[number];
