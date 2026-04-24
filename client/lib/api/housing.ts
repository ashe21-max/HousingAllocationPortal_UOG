import { apiRequest } from "@/lib/api/client";

export type RoomType = "Studio" | "1-Bedroom" | "2-Bedroom" | "3-Bedroom";
export type HousingCondition =
  | "New"
  | "Good"
  | "Needs Repair"
  | "Under Maintenance";
export type HousingStatus = "Available" | "Occupied" | "Reserved";

export type HousingUnit = {
  id: string;
  buildingName: string;
  blockNumber: string;
  roomNumber: string;
  roomType: RoomType;
  condition: HousingCondition;
  status: HousingStatus;
  location: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateHousingUnitPayload = {
  buildingName: string;
  blockNumber: string;
  roomNumber: string;
  roomType: RoomType;
  condition: HousingCondition;
  status?: HousingStatus;
  location: string;
};

export type UpdateHousingUnitPayload = {
  buildingName?: string;
  blockNumber?: string;
  roomNumber?: string;
  roomType?: RoomType;
  status?: HousingStatus;
  condition?: HousingCondition;
  location?: string;
};

export async function getHousingUnits(filters?: {
  status?: HousingStatus;
  roomType?: RoomType;
}) {
  const searchParams = new URLSearchParams();

  if (filters?.status) {
    searchParams.set("status", filters.status);
  }

  if (filters?.roomType) {
    searchParams.set("room_type", filters.roomType);
  }

  const query = searchParams.toString();
  return apiRequest<HousingUnit[]>(`/houses${query ? `?${query}` : ""}`);
}

export async function createHousingUnit(payload: CreateHousingUnitPayload) {
  return apiRequest<HousingUnit>("/houses", {
    method: "POST",
    body: payload,
  });
}

export async function getHousingUnitById(id: string) {
  return apiRequest<HousingUnit>(`/houses/${id}`);
}

export async function updateHousingUnit(
  id: string,
  payload: UpdateHousingUnitPayload,
) {
  return apiRequest<HousingUnit>(`/houses/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export async function deleteHousingUnit(id: string) {
  return apiRequest<{ success: true }>(`/houses/${id}`, {
    method: "DELETE",
  });
}
