import { ApiError, apiRequest } from "@/lib/api/client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/api`
    : undefined) ??
  "http://localhost:4000/api";

export type DocumentPurpose =
  | "EDUCATIONAL_TITLE"
  | "EDUCATIONAL_LEVEL"
  | "SERVICE_YEARS"
  | "RESPONSIBILITY"
  | "FAMILY_STATUS"
  | "DISABILITY_CERTIFICATION"
  | "HIV_ILLNESS_CERTIFICATION"
  | "SPOUSE_PROOF"
  | "OTHER";

export type LecturerDocumentRow = {
  id: string;
  userId: string;
  applicationId: string | null;
  purpose: DocumentPurpose;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  notes: string | null;
  status: "UPLOADED" | "VERIFIED" | "REJECTED";
  uploadedAt: string;
};

export type UploadDocumentPayload = {
  purpose: DocumentPurpose;
  applicationId?: string | null;
  notes?: string | null;
  file: File;
};

export async function uploadDocument(payload: UploadDocumentPayload) {
  const formData = new FormData();
  formData.set("purpose", payload.purpose);
  if (payload.applicationId) {
    formData.set("applicationId", payload.applicationId);
  }
  if (payload.notes) {
    formData.set("notes", payload.notes);
  }
  formData.set("file", payload.file);

  const response = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const payloadJson = (await response.json().catch(() => null)) as
    | { message?: string; code?: string }
    | LecturerDocumentRow
    | null;

  if (!response.ok) {
    const errorPayload = payloadJson as { message?: string; code?: string } | null;
    throw new ApiError(
      errorPayload?.message ?? "Document upload failed",
      response.status,
      errorPayload?.code,
    );
  }

  return payloadJson as LecturerDocumentRow;
}

export async function getMyDocuments() {
  return apiRequest<LecturerDocumentRow[]>("/documents/me");
}

export async function openMyDocument(documentId: string) {
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}/download`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new ApiError("Could not open document", response.status);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}

export async function downloadMyDocument(documentId: string, fileName: string) {
  const response = await fetch(`${API_BASE_URL}/documents/${documentId}/download`, {
    method: "GET",
    credentials: "include",
  });

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
