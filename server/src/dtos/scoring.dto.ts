/**
 * Request body for `POST /api/score/preview` — same shape as lecturer criteria
 * (`lecturer_scoring_criteria`), not pre-weighted points.
 */
export type PreviewCriteriaDto = {
  educationalTitle: string;
  educationalLevel: string;
  serviceYears: number;
  responsibility: string;
  familyStatus: string;
  femaleBonusEligible: boolean;
  disabilityBonusEligible: boolean;
  hivIllnessBonusEligible: boolean;
  spouseBonusEligible: boolean;
};
