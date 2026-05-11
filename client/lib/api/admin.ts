import { apiRequest } from "./client";

export interface AllocationReport {
  id: string;
  roundId: string;
  roundName: string;
  roundStatus: string;
  committeeRankingStatus: string;
  allocationCount: string;
  reportData: unknown;
  sentByUserId: string;
  sentAt: string;
  status: "PENDING" | "RESOLVED" | "REJECTED" | string;
  adminNotes?: string;
  reviewedAt?: string;
  reviewedByUserId?: string;
  deletedAt?: string;
}

export async function getAllocationReports() {
  return apiRequest<AllocationReport[]>(`/admin/reports`);
}

export async function updateAllocationReportStatus(
  id: string,
  status: "PENDING" | "RESOLVED" | "REJECTED" | string,
  adminNotes?: string
) {
  return apiRequest<{ message: string }>(`/admin/reports/${id}/status`, {
    method: "PATCH",
    body: { status, adminNotes },
  });
}

export async function deleteAllocationReport(id: string) {
  return apiRequest<{ message: string }>(`/admin/reports/${id}`, {
    method: "DELETE",
  });
}
