import type { PreviewCriteriaDto } from '../../dtos/scoring.dto.js';
import type { ScoringNumericInput } from '../../types/scoring.js';
import { clampPercent } from '../../utils/scoring-math.js';

const MAX_SERVICE_YEARS_FOR_SCALE = 40;

/**
 * Maps lecturer **criteria** (titles, text, years) into the 0–100 “yourPoints”
 * scale used by {@link calculateApplicationScore}.
 *
 * **Stub:** until official UoG lookup tables / `scoring_policies` drive this,
 * values are heuristic (normalized ranks and linear years). Replace with
 * policy-backed tables without changing the preview route contract.
 */
export function mapCriteriaToNumericInput(
  criteria: PreviewCriteriaDto,
): ScoringNumericInput {
  return {
    educationalTitlePoints: mapTitleToPoints(criteria.educationalTitle),
    educationalLevelPoints: mapLevelToPoints(criteria.educationalLevel),
    serviceYearsPoints: mapServiceYearsToPoints(criteria.serviceYears),
    responsibilityPoints: mapTextBandToPoints(criteria.responsibility),
    familyStatusPoints: mapTextBandToPoints(criteria.familyStatus),
    femaleBonusEligible: criteria.femaleBonusEligible,
    disabilityBonusEligible: criteria.disabilityBonusEligible,
    hivIllnessBonusEligible: criteria.hivIllnessBonusEligible,
    spouseBonusEligible: criteria.spouseBonusEligible,
  };
}

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

function mapTitleToPoints(title: string): number {
  const t = normalize(title);
  if (t.includes('professor') && !t.includes('associate') && !t.includes('assistant')) {
    return 100;
  }
  if (t.includes('associate')) {
    return 85;
  }
  if (t.includes('assistant')) {
    return 72;
  }
  if (t.includes('lecturer') || t.includes('instructor')) {
    return 62;
  }
  return 50;
}

function mapLevelToPoints(level: string): number {
  const l = normalize(level);
  if (l.includes('phd') || l.includes('doctor')) {
    return 100;
  }
  if (l.includes('master') || l.includes('msc') || l.includes('m.sc')) {
    return 78;
  }
  if (l.includes('bachelor') || l.includes('bsc') || l.includes('b.sc')) {
    return 55;
  }
  if (l.includes('diploma')) {
    return 40;
  }
  return 50;
}

function mapServiceYearsToPoints(years: number): number {
  const capped = Math.min(Math.max(years, 0), MAX_SERVICE_YEARS_FOR_SCALE);
  return clampPercent((capped / MAX_SERVICE_YEARS_FOR_SCALE) * 100);
}

/** Non-empty free text → mid band until responsibility rubric exists. */
function mapTextBandToPoints(text: string): number {
  const len = text.trim().length;
  if (len >= 80) {
    return 85;
  }
  if (len >= 30) {
    return 70;
  }
  return 55;
}
