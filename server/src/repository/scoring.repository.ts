import { desc, eq } from 'drizzle-orm';

import { db } from '../lib/db/index.js';
import type { PreviewCriteriaDto } from '../dtos/scoring.dto.js';
import type { ScoreCalculationResult } from '../types/scoring.js';
import {
  lecturerScoringCriteria,
  scoringPolicies,
  scoreSnapshots,
} from '../lib/db/schema/scoring.js';

const criteriaSelection = {
  id: lecturerScoringCriteria.id,
  userId: lecturerScoringCriteria.userId,
  educationalTitle: lecturerScoringCriteria.educationalTitle,
  educationalLevel: lecturerScoringCriteria.educationalLevel,
  serviceYears: lecturerScoringCriteria.serviceYears,
  responsibility: lecturerScoringCriteria.responsibility,
  familyStatus: lecturerScoringCriteria.familyStatus,
  femaleBonusEligible: lecturerScoringCriteria.femaleBonusEligible,
  disabilityBonusEligible: lecturerScoringCriteria.disabilityBonusEligible,
  hivIllnessBonusEligible: lecturerScoringCriteria.hivIllnessBonusEligible,
  spouseBonusEligible: lecturerScoringCriteria.spouseBonusEligible,
  createdAt: lecturerScoringCriteria.createdAt,
  updatedAt: lecturerScoringCriteria.updatedAt,
};

const snapshotSelection = {
  id: scoreSnapshots.id,
  userId: scoreSnapshots.userId,
  scoringPolicyId: scoreSnapshots.scoringPolicyId,
  breakdown: scoreSnapshots.breakdown,
  baseTotal: scoreSnapshots.baseTotal,
  bonusTotal: scoreSnapshots.bonusTotal,
  finalScore: scoreSnapshots.finalScore,
  createdAt: scoreSnapshots.createdAt,
};

export async function findLecturerCriteriaByUserId(userId: string) {
  const [row] = await db
    .select(criteriaSelection)
    .from(lecturerScoringCriteria)
    .where(eq(lecturerScoringCriteria.userId, userId))
    .limit(1);

  return row ?? null;
}

export async function findLatestScoreSnapshotByUserId(userId: string) {
  const [row] = await db
    .select(snapshotSelection)
    .from(scoreSnapshots)
    .where(eq(scoreSnapshots.userId, userId))
    .orderBy(desc(scoreSnapshots.createdAt))
    .limit(1);

  return row ?? null;
}

export async function upsertLecturerCriteria(userId: string, input: PreviewCriteriaDto) {
  const existing = await findLecturerCriteriaByUserId(userId);
  const now = new Date();
  const payload = {
    educationalTitle: input.educationalTitle,
    educationalLevel: input.educationalLevel,
    serviceYears: input.serviceYears,
    responsibility: input.responsibility,
    familyStatus: input.familyStatus,
    femaleBonusEligible: input.femaleBonusEligible,
    disabilityBonusEligible: input.disabilityBonusEligible,
    hivIllnessBonusEligible: input.hivIllnessBonusEligible,
    spouseBonusEligible: input.spouseBonusEligible,
    updatedAt: now,
  };

  if (existing) {
    const [updated] = await db
      .update(lecturerScoringCriteria)
      .set(payload)
      .where(eq(lecturerScoringCriteria.userId, userId))
      .returning(criteriaSelection);

    return updated ?? null;
  }

  const [inserted] = await db
    .insert(lecturerScoringCriteria)
    .values({
      userId,
      ...payload,
    })
    .returning(criteriaSelection);

  return inserted ?? null;
}

export async function findLatestScoringPolicyId() {
  const [row] = await db
    .select({ id: scoringPolicies.id })
    .from(scoringPolicies)
    .orderBy(desc(scoringPolicies.version), desc(scoringPolicies.createdAt))
    .limit(1);

  return row?.id ?? null;
}

export async function createScoreSnapshot(
  userId: string,
  result: ScoreCalculationResult,
  scoringPolicyId: string | null,
) {
  const [inserted] = await db
    .insert(scoreSnapshots)
    .values({
      userId,
      scoringPolicyId,
      breakdown: result.breakdown,
      baseTotal: result.baseTotal,
      bonusTotal: result.bonusTotal,
      finalScore: result.finalScore,
    })
    .returning(snapshotSelection);

  return inserted ?? null;
}
