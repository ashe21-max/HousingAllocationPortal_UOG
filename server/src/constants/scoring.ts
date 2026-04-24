/** Max displayed final score (see `calculateApplicationScore` doc). */
export const SCORE_CAP = 100;

export const BASE_WEIGHTS = {
  educationalTitle: 40,
  educationalLevel: 5,
  serviceYears: 35,
  responsibility: 10,
  familyStatus: 10,
} as const;

export const BONUS_POINTS = {
  female: 5,
  disability: 5,
  hivIllness: 3,
  spouse: 5,
} as const;
