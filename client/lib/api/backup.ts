import { apiRequest } from "@/lib/api/client";

export type BackupType = "full" | "incremental" | "partial";
export type BackupStatus = "creating" | "completed" | "failed" | "restoring";
export type BackupFrequency = "hourly" | "daily" | "weekly" | "monthly";

export interface BackupRecord {
  id: string;
  filename: string;
  type: BackupType;
  size: number;
  status: BackupStatus;
  description: string;
  tables: string[] | null;
  filePath: string | null;
  checksum: string | null;
  createdBy: string;
  createdAt: string;
  completedAt: string | null;
  restoredAt: string | null;
  restoredBy: string | null;
  userName: string;
}

export interface BackupLog {
  id: string;
  backupId: string;
  level: "INFO" | "WARNING" | "ERROR" | "SUCCESS";
  message: string;
  details: string | null;
  timestamp: string;
}

export interface BackupSchedule {
  id: string;
  name: string;
  type: BackupType;
  frequency: BackupFrequency;
  tables: string[] | null;
  enabled: boolean;
  retentionDays: number;
  lastRunAt: string | null;
  nextRunAt: string | null;
  createdAt: string;
  createdBy: string;
  userName: string;
}

export interface BackupListResponse {
  items: BackupRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateBackupRequest {
  type: BackupType;
  description?: string;
  tables?: string[];
}

export interface CreateBackupScheduleRequest {
  name: string;
  type: BackupType;
  frequency: BackupFrequency;
  tables?: string[];
  enabled?: boolean;
  retentionDays?: number;
}

export interface UpdateBackupScheduleRequest {
  name?: string;
  type?: BackupType;
  frequency?: BackupFrequency;
  tables?: string[];
  enabled?: boolean;
  retentionDays?: number;
}

export async function createBackup(data: CreateBackupRequest) {
  return apiRequest<BackupRecord>("/admin/backups", {
    method: "POST",
    body: data,
  });
}

export async function getBackups(query?: {
  page?: number;
  pageSize?: number;
  type?: BackupType;
  status?: BackupStatus;
  search?: string;
}) {
  const params = new URLSearchParams();
  if (query?.page) params.set("page", String(query.page));
  if (query?.pageSize) params.set("pageSize", String(query.pageSize));
  if (query?.type) params.set("type", query.type);
  if (query?.status) params.set("status", query.status);
  if (query?.search) params.set("search", query.search);

  const queryString = params.toString();
  return apiRequest<BackupListResponse>(`/admin/backups${queryString ? `?${queryString}` : ""}`);
}

export async function getBackup(id: string) {
  return apiRequest<BackupRecord>(`/admin/backups/${id}`);
}

export async function deleteBackup(id: string) {
  return apiRequest<{ message: string }>(`/admin/backups/${id}`, {
    method: "DELETE",
  });
}

export async function downloadBackup(id: string) {
  const response = await fetch(`/api/admin/backups/${id}/download`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Download failed: ${response.statusText}`);
  }

  // Get filename from response headers or use default
  const contentDisposition = response.headers.get("content-disposition");
  const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || `backup-${id}.sql`;

  // Create blob and download
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export async function getBackupLogs(id: string) {
  return apiRequest<BackupLog[]>(`/admin/backups/${id}/logs`);
}

export async function createBackupSchedule(data: CreateBackupScheduleRequest) {
  return apiRequest<BackupSchedule>("/admin/backup-schedules", {
    method: "POST",
    body: data,
  });
}

export async function getBackupSchedules() {
  return apiRequest<BackupSchedule[]>("/admin/backup-schedules");
}

export async function updateBackupSchedule(id: string, data: UpdateBackupScheduleRequest) {
  return apiRequest<BackupSchedule>(`/admin/backup-schedules/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deleteBackupSchedule(id: string) {
  return apiRequest<{ message: string }>(`/admin/backup-schedules/${id}`, {
    method: "DELETE",
  });
}
