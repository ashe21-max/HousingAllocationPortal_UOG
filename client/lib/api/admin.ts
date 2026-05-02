import { apiRequest } from "./client";

export interface AllocationReport {
  id: string;
  roundId: string;
  roundName: string;
  roundStatus: string;
  committeeRankingStatus: string;
  allocationCount: string;
  reportData: any;
  sentByUserId: string;
  sentAt: string;
  status: string;
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
  status: string,
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
