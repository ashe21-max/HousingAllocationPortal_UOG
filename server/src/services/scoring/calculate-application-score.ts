import { BASE_WEIGHTS, BONUS_POINTS, SCORE_CAP } from '../../constants/scoring.js';
import type {
  ScoreCalculationResult,
  ScoringNumericInput,
} from '../../types/scoring.js';
import type { ScoreBreakdownLine } from '../../lib/db/schema/scoring.js';
import {
  buildWeightedBaseRow,
  roundScoreComponent,
} from '../../utils/scoring-math.js';

/**
 * UoG-style application summary scoring.
 *
 * Base: each `yourPoints` is 0–100; row contribution = (yourPoints/100) × weight%.
 * Bonuses: flat points when flags are true (+5,+5,+3,+5).
 * Final: min(baseTotal + bonusTotal, {@link SCORE_CAP}). Change cap in constants if policy allows >100.
 */
export function calculateApplicationScore(
  input: ScoringNumericInput,
): ScoreCalculationResult {
  const rows: ScoreBreakdownLine[] = [];

  rows.push(
    buildWeightedBaseRow(
      'Educational Title',
      BASE_WEIGHTS.educationalTitle,
      input.educationalTitlePoints,
    ),
  );
  rows.push(
    buildWeightedBaseRow(
      'Educational Level',
      BASE_WEIGHTS.educationalLevel,
      input.educationalLevelPoints,
    ),
  );
  rows.push(
    buildWeightedBaseRow(
      'Service Years',
      BASE_WEIGHTS.serviceYears,
      input.serviceYearsPoints,
    ),
  );
  rows.push(
    buildWeightedBaseRow(
      'Responsibility',
      BASE_WEIGHTS.responsibility,
      input.responsibilityPoints,
    ),
  );
  rows.push(
    buildWeightedBaseRow(
      'Family Status',
      BASE_WEIGHTS.familyStatus,
      input.familyStatusPoints,
    ),
  );

  const baseTotal = roundScoreComponent(
    rows.reduce((sum, r) => sum + (r.score ?? 0), 0),
  );

  rows.push({
    criteria: 'Base Total',
    weightLabel: '100%',
    yourPoints: null,
    score: baseTotal,
    kind: 'total',
  });

  const bonusDefs = [
    {
      criteria: 'Female (+5%)',
      points: BONUS_POINTS.female,
      eligible: input.femaleBonusEligible,
    },
    {
      criteria: 'Disability (+5%)',
      points: BONUS_POINTS.disability,
      eligible: input.disabilityBonusEligible,
    },
    {
      criteria: 'HIV/Illness (+3%)',
      points: BONUS_POINTS.hivIllness,
      eligible: input.hivIllnessBonusEligible,
    },
    {
      criteria: 'Spouse Bonus (+5%)',
      points: BONUS_POINTS.spouse,
      eligible: input.spouseBonusEligible,
    },
  ] as const;

  let bonusTotal = 0;
  for (const b of bonusDefs) {
    const pts = b.eligible ? b.points : 0;
    bonusTotal += pts;
    rows.push({
      criteria: b.criteria,
      weightLabel: 'Bonus',
      yourPoints: b.eligible ? b.points : null,
      score: b.eligible ? b.points : 0,
      kind: 'bonus',
    });
  }

  bonusTotal = roundScoreComponent(bonusTotal);
  const finalScoreUncapped = roundScoreComponent(baseTotal + bonusTotal);
  const finalScore = roundScoreComponent(
    Math.min(SCORE_CAP, finalScoreUncapped),
  );

  rows.push({
    criteria: 'FINAL SCORE',
    weightLabel: '',
    yourPoints: null,
    score: finalScore,
    kind: 'total',
  });

  return {
    breakdown: rows,
    baseTotal,
    bonusTotal,
    finalScoreUncapped,
    finalScore,
  };
}
