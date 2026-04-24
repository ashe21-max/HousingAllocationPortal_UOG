import { ApiError, apiRequest } from "@/lib/api/client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api";

export type CommitteeApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "RANKED"
  | "ALLOCATED"
  | "REJECTED"
  | "WITHDRAWN";

export type CommitteeQueueRow = {
  id: string;
  roundId: string;
  roundName: string | null;
  userId: string;
  lecturerName: string | null;
  lecturerEmail: string | null;
  lecturerDepartment: string | null;
  status: CommitteeApplicationStatus;
  complianceIssue: boolean;
  submittedAt: string | null;
  reviewedAt: string | null;
  notes: string | null;
  preferredHousingBuildingName: string | null;
  preferredHousingBlockNumber: string | null;
  preferredHousingRoomNumber: string | null;
  finalScore: number | null;
  createdAt: string;
};

export type CommitteeDocumentRow = {
  id: string;
  userId: string;
  applicationId: string | null;
  purpose: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  notes: string | null;
  status: "UPLOADED" | "VERIFIED" | "REJECTED";
  uploadedAt: string;
};

export type CommitteeApplicationDetails = {
  id: string;
  roundId: string;
  roundName: string | null;
  roundStatus: string | null;
  userId: string;
  lecturerName: string | null;
  lecturerEmail: string | null;
  lecturerDepartment: string | null;
  preferredHousingUnitId: string | null;
  preferredHousingBuildingName: string | null;
  preferredHousingBlockNumber: string | null;
  preferredHousingRoomNumber: string | null;
  preferredHousingRoomType: string | null;
  scoreSnapshotId: string | null;
  status: CommitteeApplicationStatus;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewedByUserId: string | null;
  complianceIssue: boolean;
  complianceNotes: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  scoreBreakdown: Array<{
    criteria: string;
    weightLabel: string;
    yourPoints: number | null;
    score: number | null;
    kind: "base" | "bonus" | "total";
  }> | null;
  scoreBaseTotal: number | null;
  scoreBonusTotal: number | null;
  scoreFinal: number | null;
  documents: CommitteeDocumentRow[];
};

export type CommitteeRankEntry = {
  id: string;
  roundId: string;
  applicationId: string;
  rankPosition: number;
  updatedByUserId: string;
  lecturerName: string | null;
  lecturerDepartment: string | null;
  finalScore: number | null;
  applicationStatus: CommitteeApplicationStatus | null;
};

export async function getCommitteeApplications(filters?: {
  roundId?: string;
  status?: CommitteeApplicationStatus;
  complianceIssue?: boolean;
}) {
  const params = new URLSearchParams();
  if (filters?.roundId) {
    params.set("roundId", filters.roundId);
  }
  if (filters?.status) {
    params.set("status", filters.status);
  }
  if (typeof filters?.complianceIssue === "boolean") {
    params.set("complianceIssue", String(filters.complianceIssue));
  }
  const query = params.toString();
  return apiRequest<CommitteeQueueRow[]>(
    `/committee/applications${query ? `?${query}` : ""}`,
  );
}

export async function getCommitteeApplicationDetails(applicationId: string) {
  return apiRequest<CommitteeApplicationDetails>(
    `/committee/applications/${applicationId}`,
  );
}

export async function markCommitteeApplicationUnderReview(
  applicationId: string,
  payload: {
    complianceIssue?: boolean;
    complianceNotes?: string | null;
    notes?: string | null;
  },
) {
  return apiRequest<{
    id: string;
    status: CommitteeApplicationStatus;
    reviewedAt: string | null;
    reviewedByUserId: string | null;
    complianceIssue: boolean;
    complianceNotes: string | null;
    notes: string | null;
    updatedAt: string;
  }>(`/committee/applications/${applicationId}/review`, {
    method: "PATCH",
    body: {
      status: "UNDER_REVIEW",
      complianceIssue: payload.complianceIssue ?? false,
      complianceNotes: payload.complianceNotes ?? null,
      notes: payload.notes ?? null,
    },
  });
}

export async function downloadCommitteeDocument(documentId: string, fileName: string) {
  const response = await fetch(
    `${API_BASE_URL}/committee/documents/${documentId}/download`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new ApiError("Could not download document", response.status);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  window.document.body.appendChild(anchor);
  anchor.click();
  window.document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function generateRoundRanking(roundId: string) {
  return apiRequest<CommitteeRankEntry[]>(`/committee/ranking/${roundId}/generate`, {
    method: "POST",
  });
}

export async function getRoundRanking(roundId: string) {
  return apiRequest<CommitteeRankEntry[]>(`/committee/ranking/${roundId}`);
}

export async function saveRoundRanking(
  roundId: string,
  entries: Array<{ applicationId: string; rankPosition: number }>,
) {
  return apiRequest<CommitteeRankEntry[]>(`/committee/ranking/${roundId}`, {
    method: "PATCH",
    body: { entries },
  });
}

export async function submitRoundPreliminary(roundId: string) {
  return apiRequest<{
    id: string;
    committeeRankingStatus: "DRAFT" | "PRELIMINARY_SUBMITTED" | "FINAL_SUBMITTED";
    committeePreliminarySubmittedAt: string | null;
    committeeFinalSubmittedAt: string | null;
    updatedAt: string;
  }>(`/committee/ranking/${roundId}/preliminary`, {
    method: "POST",
  });
}

export async function submitRoundFinal(roundId: string) {
  return apiRequest<{
    id: string;
    committeeRankingStatus: "DRAFT" | "PRELIMINARY_SUBMITTED" | "FINAL_SUBMITTED";
    committeePreliminarySubmittedAt: string | null;
    committeeFinalSubmittedAt: string | null;
    updatedAt: string;
  }>(`/committee/ranking/${roundId}/final`, {
    method: "POST",
  });
}
