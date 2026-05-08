import { apiRequest } from "@/lib/api/client";

export type Announcement = {
  id: string;
  title: string;
  content: string;
  type: string;
  targetRoles: string[] | null;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateAnnouncementPayload = {
  title: string;
  content: string;
  type: string;
  targetRoles?: string[];
  startsAt?: string;
  endsAt?: string;
};

export type UpdateAnnouncementPayload = Partial<CreateAnnouncementPayload> & {
  isActive?: boolean;
};

export async function getAnnouncements(filters?: {
  isActive?: boolean;
  targetRoles?: string[];
}): Promise<{ items: Announcement[] }> {
  const params = new URLSearchParams();
  if (filters?.isActive !== undefined) {
    params.set("isActive", String(filters.isActive));
  }
  if (filters?.targetRoles?.length) {
    params.set("targetRoles", filters.targetRoles.join(","));
  }
  const qs = params.toString();
  return apiRequest<{ items: Announcement[] }>(
    `/announcements${qs ? `?${qs}` : ""}`
  );
}

export async function getActiveAnnouncements(): Promise<{ items: Announcement[] }> {
  return apiRequest<{ items: Announcement[] }>("/announcements/active");
}

export async function createAnnouncement(
  payload: CreateAnnouncementPayload
): Promise<Announcement> {
  return apiRequest<Announcement>("/announcements", {
    method: "POST",
    body: payload,
  });
}

export async function updateAnnouncement(
  id: string,
  payload: UpdateAnnouncementPayload
): Promise<Announcement> {
  return apiRequest<Announcement>(`/announcements/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export async function deleteAnnouncement(id: string): Promise<void> {
  return apiRequest<void>(`/announcements/${id}`, {
    method: "DELETE",
  });
}
