import { apiRequest } from "@/lib/api/client";

export type LecturerCriteriaPayload = {
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

export type ScoreBreakdownLine = {
  criteria: string;
  weightLabel: string;
  yourPoints: number | null;
  score: number | null;
  kind: "base" | "bonus" | "total";
};

export type DerivedNumericInput = {
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

export type PreviewScoreResponse = {
  breakdown: ScoreBreakdownLine[];
  baseTotal: number;
  bonusTotal: number;
  finalScoreUncapped: number;
  finalScore: number;
  /** Present on live preview from `POST /score/preview`; omitted when hydrating from DB snapshot. */
  meta?: {
    scoringModel: string;
    derivedNumericInput: DerivedNumericInput;
  };
};

export type LecturerCriteriaRow = LecturerCriteriaPayload & {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type ScoreSnapshotRow = {
  id: string;
  userId: string;
  scoringPolicyId: string | null;
  breakdown: ScoreBreakdownLine[];
  baseTotal: number;
  bonusTotal: number;
  finalScore: number;
  createdAt: string;
};

export type ScoreMeResponse = {
  criteria: LecturerCriteriaRow | null;
  latestSnapshot: ScoreSnapshotRow | null;
};

export async function getScoreMe() {
  return apiRequest<ScoreMeResponse>("/score/me");
}

export async function previewScoreCriteria(payload: LecturerCriteriaPayload) {
  return apiRequest<PreviewScoreResponse>("/score/preview", {
    method: "POST",
    body: payload,
  });
}

export async function saveScoreCriteria(payload: LecturerCriteriaPayload) {
  return apiRequest<{ criteria: LecturerCriteriaRow }>("/score/save", {
    method: "POST",
    body: payload,
  });
}
