import type { PreviewCriteriaDto } from '../../dtos/scoring.dto.js';
import { calculateApplicationScore } from './calculate-application-score.js';
import { mapCriteriaToNumericInput } from './map-criteria-to-numeric-input.js';
import {
  createScoreSnapshot,
  findLatestScoreSnapshotByUserId,
  findLatestScoringPolicyId,
  findLecturerCriteriaByUserId,
  upsertLecturerCriteria,
} from '../../repository/scoring.repository.js';

export async function getLecturerScoreState(userId: string) {
  const [criteria, latestSnapshot] = await Promise.all([
    findLecturerCriteriaByUserId(userId),
    findLatestScoreSnapshotByUserId(userId),
  ]);

  return { criteria, latestSnapshot };
}

export async function saveLecturerCriteriaDraft(
  userId: string,
  input: PreviewCriteriaDto,
) {
  const [criteria, scoringPolicyId] = await Promise.all([
    upsertLecturerCriteria(userId, input),
    findLatestScoringPolicyId(),
  ]);

  const derivedNumericInput = mapCriteriaToNumericInput(input);
  const result = calculateApplicationScore(derivedNumericInput);
  const latestSnapshot = await createScoreSnapshot(
    userId,
    result,
    scoringPolicyId,
  );

  return { criteria, latestSnapshot };
}
