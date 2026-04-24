import type { ScoreBreakdownLine } from '../lib/db/schema/scoring.js';

export function clampPercent(value: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    return 0;
  }
  return Math.min(100, Math.max(0, value));
}

export function roundScoreComponent(n: number): number {
  return Math.round(n * 100) / 100;
}

export function buildWeightedBaseRow(
  criteria: string,
  weightPercent: number,
  yourPoints: number,
): ScoreBreakdownLine {
  const p = clampPercent(yourPoints);
  const score = roundScoreComponent((p / 100) * weightPercent);
  return {
    criteria,
    weightLabel: `${weightPercent}%`,
    yourPoints: roundScoreComponent(p),
    score,
    kind: 'base',
  };
}
