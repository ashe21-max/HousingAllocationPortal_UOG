import { apiRequest } from "@/lib/api/client";

export type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "RANKED"
  | "ALLOCATED"
  | "REJECTED"
  | "WITHDRAWN";

export type SaveApplicationDraftPayload = {
  roundId: string;
  preferredHousingUnitId?: string | null;
  notes?: string | null;
};

export type ApplicationRow = {
  id: string;
  userId: string;
  roundId: string;
  preferredHousingUnitId: string | null;
  scoreSnapshotId: string | null;
  status: ApplicationStatus;
  submittedAt: string | null;
  reviewedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MyApplicationRow = ApplicationRow & {
  roundName: string | null;
  roundStatus: "DRAFT" | "OPEN" | "CLOSED" | "ARCHIVED" | null;
  roundStartsAt: string | null;
  roundEndsAt: string | null;
  preferredHousingBuildingName: string | null;
  preferredHousingBlockNumber: string | null;
  preferredHousingRoomNumber: string | null;
  preferredHousingRoomType: string | null;
  attachedScoreFinal: number | null;
};

export type ApplicationRoundOption = {
  id: string;
  name: string;
  status: "DRAFT" | "OPEN" | "CLOSED" | "ARCHIVED";
  startsAt: string;
  endsAt: string;
};

export type ApplicationHouseOption = {
  id: string;
  buildingName: string;
  blockNumber: string;
  roomNumber: string;
  roomType: string;
  condition: string;
  status: string;
  location: string;
  createdAt: string;
  updatedAt: string;
};

export type ApplicationFormOptionsResponse = {
  rounds: ApplicationRoundOption[];
  availableHouses: ApplicationHouseOption[];
};

export type DepartmentAllocationResultRow = {
  allocationResultId: string;
  allocationStatus: "PRELIMINARY" | "PUBLISHED";
  allocatedAt: string;
  roundId: string;
  roundName: string | null;
  lecturerUserId: string | null;
  lecturerName: string | null;
  lecturerEmail: string | null;
  lecturerDepartment: string | null;
  housingUnitId: string;
  housingBuildingName: string | null;
  housingBlockNumber: string | null;
  housingRoomNumber: string | null;
  housingRoomType: string | null;
  housingLocation: string | null;
};

export async function saveApplicationDraft(payload: SaveApplicationDraftPayload) {
  return apiRequest<ApplicationRow>("/applications/draft", {
    method: "POST",
    body: payload,
  });
}

export async function submitApplication(applicationId: string) {
  return apiRequest<ApplicationRow>(`/applications/${applicationId}/submit`, {
    method: "POST",
  });
}

export async function getMyApplications() {
  return apiRequest<MyApplicationRow[]>("/applications/me");
}

export async function getApplicationFormOptions() {
  return apiRequest<ApplicationFormOptionsResponse>("/applications/options");
}

export async function getMyDepartmentResults() {
  return apiRequest<DepartmentAllocationResultRow[]>("/applications/results/department");
}

export async function deleteApplication(applicationId: string) {
  return apiRequest<{ id: string }>(`/applications/${applicationId}`, {
    method: "DELETE",
  });
}
