import type {
  LecturerScoringCriteria,
  ScoreBreakdownLine,
  ScoreSnapshot,
} from '../lib/db/schema/scoring.js';

export type { ScoreBreakdownLine };

/** `GET /api/score/me` — saved draft criteria plus newest snapshot row (if any). */
export type LecturerScoreMineResponse = {
  criteria: LecturerScoringCriteria | null;
  latestSnapshot: Pick<
    ScoreSnapshot,
    | 'id'
    | 'userId'
    | 'scoringPolicyId'
    | 'breakdown'
    | 'baseTotal'
    | 'bonusTotal'
    | 'finalScore'
    | 'createdAt'
  > | null;
};

export type ScoringNumericInput = {
  educationalTitlePoints: number;
  educationalLevelPoints: number;
  serviceYearsPoints: number;
  responsibilityPoints: number;
  familyStatusPoints: number;
  femaleBonusEligible: boolean;
  disabilityBonusEligible: boolean;
  hivIllnessBonusEligible: boolean;
  spouseBonusEligible: boolean;
};

export type ScoreCalculationResult = {
  breakdown: ScoreBreakdownLine[];
  baseTotal: number;
  bonusTotal: number;
  finalScoreUncapped: number;
  finalScore: number;
};

/** `POST /api/score/preview` — calculation plus mapping transparency. */
export type PreviewScoreResponse = ScoreCalculationResult & {
  meta: {
    scoringModel: string;
    derivedNumericInput: ScoringNumericInput;
  };
};
