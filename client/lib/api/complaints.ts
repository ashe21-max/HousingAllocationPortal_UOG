import { apiRequest } from "@/lib/api/client";

export type ComplaintStatus = "OPEN" | "RESOLVED" | "CLOSED";

export type ComplaintThreadRow = {
  id: string;
  lecturerUserId: string;
  targetDepartment: string;
  subject: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
};

export type CommitteeComplaintThreadRow = ComplaintThreadRow & {
  lecturerName: string | null;
};

export type ComplaintMessageRow = {
  id: string;
  threadId: string;
  senderUserId: string;
  senderName: string | null;
  senderRole: "ADMIN" | "LECTURER" | "OFFICER" | "COMMITTEE" | null;
  message: string;
  createdAt: string;
};

export type ComplaintThreadDetails = {
  thread: ComplaintThreadRow;
  messages: ComplaintMessageRow[];
};

export type CommitteeComplaintThreadDetails = {
  thread: CommitteeComplaintThreadRow;
  messages: ComplaintMessageRow[];
};

export async function createComplaintThread(payload: {
  targetDepartment: string;
  subject: string;
  message: string;
}) {
  return apiRequest<ComplaintThreadRow>("/complaints", {
    method: "POST",
    body: payload,
  });
}

export async function getMyComplaintThreads() {
  return apiRequest<ComplaintThreadRow[]>("/complaints/me");
}

export async function getMyComplaintThread(threadId: string) {
  return apiRequest<ComplaintThreadDetails>(`/complaints/${threadId}`);
}

export async function sendMyComplaintMessage(threadId: string, message: string) {
  return apiRequest<{
    id: string;
    threadId: string;
    senderUserId: string;
    message: string;
    createdAt: string;
  }>(`/complaints/${threadId}/messages`, {
    method: "POST",
    body: { message },
  });
}

export async function getCommitteeComplaintThreads() {
  return apiRequest<CommitteeComplaintThreadRow[]>("/committee/complaints");
}

export async function getCommitteeComplaintThread(threadId: string) {
  return apiRequest<CommitteeComplaintThreadDetails>(`/committee/complaints/${threadId}`);
}

export async function sendCommitteeComplaintMessage(
  threadId: string,
  message: string,
) {
  return apiRequest<{
    id: string;
    threadId: string;
    senderUserId: string;
    message: string;
    createdAt: string;
  }>(`/committee/complaints/${threadId}/messages`, {
    method: "POST",
    body: { message },
  });
}
