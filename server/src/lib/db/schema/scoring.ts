import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { users } from './auth.js';

/**
 * Raw inputs for the five base criteria rows + bonus eligibility flags.
 * One row per lecturer (draft / working copy); score_snapshots store computed outputs.
 */
export const lecturerScoringCriteria = pgTable(
  'lecturer_scoring_criteria',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    educationalTitle: varchar('educational_title', { length: 255 }).notNull(),
    educationalLevel: varchar('educational_level', { length: 128 }).notNull(),
    serviceYears: integer('service_years').notNull().default(0),
    responsibility: varchar('responsibility', { length: 255 }).notNull(),
    familyStatus: varchar('family_status', { length: 255 }).notNull(),
    femaleBonusEligible: boolean('female_bonus_eligible').notNull().default(false),
    disabilityBonusEligible: boolean('disability_bonus_eligible')
      .notNull()
      .default(false),
    hivIllnessBonusEligible: boolean('hiv_illness_bonus_eligible')
      .notNull()
      .default(false),
    spouseBonusEligible: boolean('spouse_bonus_eligible')
      .notNull()
      .default(false),
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
    uniqueIndex('lecturer_scoring_criteria_user_id_unique').on(table.userId),
    index('lecturer_scoring_criteria_user_id_idx').on(table.userId),
  ],
);

/**
 * Versioned scoring rules (stub for T1). Later: weights, caps, effective dates.
 */
export const scoringPolicies = pgTable(
  'scoring_policies',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    version: integer('version').notNull().default(1),
    effectiveFrom: timestamp('effective_from', {
      withTimezone: true,
      mode: 'date',
    }),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('scoring_policies_effective_from_idx').on(table.effectiveFrom)],
);

/** One row in the Application Summary table (for JSON breakdown storage). */
export type ScoreBreakdownLine = {
  criteria: string;
  weightLabel: string;
  yourPoints: number | null;
  score: number | null;
  kind: 'base' | 'bonus' | 'total';
};

export const scoreSnapshots = pgTable(
  'score_snapshots',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    scoringPolicyId: uuid('scoring_policy_id').references(() => scoringPolicies.id, {
      onDelete: 'set null',
    }),
    breakdown: jsonb('breakdown').notNull().$type<ScoreBreakdownLine[]>(),
    baseTotal: doublePrecision('base_total').notNull(),
    bonusTotal: doublePrecision('bonus_total').notNull(),
    finalScore: doublePrecision('final_score').notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('score_snapshots_user_id_idx').on(table.userId),
    index('score_snapshots_created_at_idx').on(table.createdAt),
  ],
);

export type LecturerScoringCriteria = InferSelectModel<typeof lecturerScoringCriteria>;
export type NewLecturerScoringCriteria = InferInsertModel<
  typeof lecturerScoringCriteria
>;
export type ScoringPolicy = InferSelectModel<typeof scoringPolicies>;
export type NewScoringPolicy = InferInsertModel<typeof scoringPolicies>;
export type ScoreSnapshot = InferSelectModel<typeof scoreSnapshots>;
export type NewScoreSnapshot = InferInsertModel<typeof scoreSnapshots>;
