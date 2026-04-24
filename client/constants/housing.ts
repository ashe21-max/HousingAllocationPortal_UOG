import type { HousingCondition, HousingStatus, RoomType } from "@/lib/api/housing";

export type HousingFilter = "ALL" | "Available" | "Under Maintenance";

export const roomTypeOptions: Array<{ label: string; value: RoomType }> = [
  { label: "Studio", value: "Studio" },
  { label: "1-Bedroom", value: "1-Bedroom" },
  { label: "2-Bedroom", value: "2-Bedroom" },
  { label: "3-Bedroom", value: "3-Bedroom" },
];

export const conditionOptions: Array<{ label: string; value: HousingCondition }> = [
  { label: "New", value: "New" },
  { label: "Good", value: "Good" },
  { label: "Needs Repair", value: "Needs Repair" },
  { label: "Under Maintenance", value: "Under Maintenance" },
];

export const statusOptions: Array<{ label: string; value: HousingStatus }> = [
  { label: "Available", value: "Available" },
  { label: "Occupied", value: "Occupied" },
  { label: "Reserved", value: "Reserved" },
];

export const housingFilterOptions: HousingFilter[] = [
  "ALL",
  "Available",
  "Under Maintenance",
];


export const HEADINGS = [
  "Building",
  "Block",
  "Room",
  "Type",
  "Condition",
  "Status",
  "Location",
  "Actions",
];