// Housing Application Scoring Logic based on UOG Rules

export interface ScoreBreakdown {
  educationalTitle: number;
  educationalLevel: number;
  serviceYears: number;
  responsibility: number;
  familyStatus: number;
  baseTotal: number;
  femaleBonus: number;
  disabilityBonus: number;
  chronicIllnessBonus: number;
  spouseBonus: number;
  final: number;
}

export interface ScoringParams {
  educationalTitle: string;
  educationalLevel: string;
  startDateAtUog: Date;
  responsibility: string;
  familyStatus: string;
  isFemale: boolean;
  isDisabled: boolean;
  hasChronicIllness: boolean;
  hasSpouseAtUog: boolean;
}

// Educational Title Scoring (Weight: 40%)
export function calculateEducationalTitleScore(title: string): number {
  const scores: Record<string, number> = {
    'PROFESSOR': 40,
    'ASSOCIATE_PROFESSOR': 37,
    'ASSISTANT_PROFESSOR': 34,
    'LECTURER': 31,
    'ASSISTANT_LECTURER': 25,
    'GRADUATE_ASSISTANT_II': 20,
    'GRADUATE_ASSISTANT_I': 15,
  };
  
  return scores[title] || 0;
}

// Educational Level Scoring (Weight: 5%)
export function calculateEducationalLevelScore(level: string): number {
  const scores: Record<string, number> = {
    'PHD': 5,
    'MSC': 3,
    'BSC': 1,
  };
  
  return scores[level] || 0;
}

// Service Years at UOG Scoring (Weight: 35%)
export function calculateServiceYears(startDate: Date): number {
  const now = new Date();
  const yearsOfService = now.getFullYear() - startDate.getFullYear();
  const monthsOfService = now.getMonth() - startDate.getMonth();
  const totalYears = yearsOfService + (monthsOfService / 12);
  
  // 2.33 points per completed year (max 35 points after 15 years)
  const serviceScore = Math.min(totalYears * 2.33, 35);
  
  return Math.round(serviceScore * 100) / 100; // Return as decimal with 2 places
}

// University Responsibility Scoring (Weight: 10%)
export function calculateResponsibilityScore(responsibility: string): number {
  const scores: Record<string, number> = {
    'DEAN': 10,
    'VICE_DEAN': 9,
    'DEPARTMENT_HEAD': 8,
    'UNIT_HEAD': 6,
    'PROGRAM_COORDINATOR': 4,
    'NONE': 0,
  };
  
  return scores[responsibility] || 0;
}

// Family & Marital Status Scoring (Weight: 10%)
export function calculateFamilyStatusScore(status: string): number {
  const scores: Record<string, number> = {
    'MARRIED_WITH_CHILDREN': 10,
    'MARRIED_WITHOUT_CHILDREN': 8,
    'SINGLE_DIVORCED_WITH_CHILDREN': 5,
    'SINGLE_WITHOUT_CHILDREN': 0,
  };
  
  return scores[status] || 0;
}

// Bonus Calculations
export function calculateFemaleBonus(baseTotal: number, isFemale: boolean): number {
  return isFemale ? Math.round(baseTotal * 0.05 * 100) / 100 : 0; // 5% of total score
}

export function calculateDisabilityBonus(baseTotal: number, isDisabled: boolean): number {
  return isDisabled ? Math.round(baseTotal * 0.05 * 100) / 100 : 0; // 5% of total score
}

export function calculateChronicIllnessBonus(baseTotal: number, hasChronicIllness: boolean): number {
  return hasChronicIllness ? Math.round(baseTotal * 0.03 * 100) / 100 : 0; // 3% of total score
}

export function calculateSpouseBonus(baseTotal: number, hasSpouseAtUog: boolean): number {
  return hasSpouseAtUog ? Math.round(baseTotal * 0.05 * 100) / 100 : 0; // 5% increase to total score
}

// Complete Score Calculation
export function calculateCompleteScore(params: ScoringParams): ScoreBreakdown {
  const educationalTitleScore = calculateEducationalTitleScore(params.educationalTitle);
  const educationalLevelScore = calculateEducationalLevelScore(params.educationalLevel);
  const serviceYearsScore = calculateServiceYears(params.startDateAtUog);
  const responsibilityScore = calculateResponsibilityScore(params.responsibility);
  const familyStatusScore = calculateFamilyStatusScore(params.familyStatus);

  // Calculate base total (100%)
  const baseTotal = educationalTitleScore + educationalLevelScore + serviceYearsScore + responsibilityScore + familyStatusScore;

  // Calculate bonuses
  const femaleBonus = calculateFemaleBonus(baseTotal, params.isFemale);
  const disabilityBonus = calculateDisabilityBonus(baseTotal, params.isDisabled);
  const chronicIllnessBonus = calculateChronicIllnessBonus(baseTotal, params.hasChronicIllness);
  const spouseBonus = calculateSpouseBonus(baseTotal, params.hasSpouseAtUog);

  // Calculate final score (capped at 100)
  const finalScore = Math.min(baseTotal + femaleBonus + disabilityBonus + chronicIllnessBonus + spouseBonus, 100);

  return {
    educationalTitle: educationalTitleScore,
    educationalLevel: educationalLevelScore,
    serviceYears: serviceYearsScore,
    responsibility: responsibilityScore,
    familyStatus: familyStatusScore,
    baseTotal,
    femaleBonus,
    disabilityBonus,
    chronicIllnessBonus,
    spouseBonus,
    final: finalScore,
  };
}
