import { apiRequest } from "@/lib/api/client";

export type OfficerAllocationRound = {
  id: string;
  name: string;
  status: "DRAFT" | "OPEN" | "CLOSED" | "ARCHIVED";
  committeeRankingStatus: "DRAFT" | "PRELIMINARY_SUBMITTED" | "FINAL_SUBMITTED";
  startsAt: string;
  endsAt: string;
};

export type OfficerManagedRound = {
  id: string;
  name: string;
  description: string | null;
  status: "DRAFT" | "OPEN" | "CLOSED" | "ARCHIVED";
  committeeRankingStatus: "DRAFT" | "PRELIMINARY_SUBMITTED" | "FINAL_SUBMITTED";
  committeePreliminarySubmittedAt: string | null;
  committeeFinalSubmittedAt: string | null;
  startsAt: string;
  endsAt: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
};

export type OfficerAvailableHouse = {
  id: string;
  buildingName: string;
  blockNumber: string;
  roomNumber: string;
  roomType: "Studio" | "1-Bedroom" | "2-Bedroom" | "3-Bedroom";
  status: "Available" | "Occupied" | "Reserved";
  location: string;
};

export type OfficerAllocationResult = {
  id: string;
  roundId: string;
  applicationId: string;
  housingUnitId: string;
  status: "PRELIMINARY" | "PUBLISHED";
  allocatedAt: string;
  lecturerName: string | null;
  housingBuildingName: string | null;
  housingBlockNumber: string | null;
  housingRoomNumber: string | null;
  housingRoomType: string | null;
};

export async function getOfficerRounds() {
  return apiRequest<OfficerAllocationRound[]>("/officer/rounds");
}

export async function getOfficerManagedRounds() {
  return apiRequest<OfficerManagedRound[]>("/officer/rounds/manage");
}

export async function createOfficerRound(payload: {
  name: string;
  description?: string | null;
  status: "DRAFT" | "OPEN" | "CLOSED" | "ARCHIVED";
  startsAt: string;
  endsAt: string;
}) {
  return apiRequest<OfficerManagedRound>("/officer/rounds/manage", {
    method: "POST",
    body: payload,
  });
}

export async function updateOfficerRoundStatus(
  roundId: string,
  status: "DRAFT" | "OPEN" | "CLOSED" | "ARCHIVED",
) {
  return apiRequest<OfficerManagedRound>(`/officer/rounds/${roundId}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export async function deleteOfficerRound(roundId: string) {
  return apiRequest<{ message: string }>(`/officer/rounds/${roundId}`, {
    method: "DELETE",
  });
}

export async function getOfficerAvailableHouses() {
  return apiRequest<OfficerAvailableHouse[]>("/officer/available-houses");
}

export async function runOfficerAllocation(roundId: string) {
  return apiRequest<{
    summary: {
      roundId: string;
      rankedApplicants: number;
      allocatedCount: number;
      unallocatedCount: number;
      remainingAvailableHouses: number;
    };
    results: OfficerAllocationResult[];
  }>(`/officer/allocations/${roundId}/run`, {
    method: "POST",
  });
}

export async function getOfficerAllocationResults(roundId: string) {
  return apiRequest<OfficerAllocationResult[]>(`/officer/allocations/${roundId}`);
}

export async function sendReportToAdmin(payload: {
  roundId: string;
  roundName: string;
  allocationCount: number;
  reportData: any;
}) {
  return apiRequest<{ message: string }>(`/officer/reports/send`, {
    method: "POST",
    body: payload,
  });
}
