import type { HousingCondition, HousingUnit } from "@/lib/api/housing";
import type { HousingFilter } from "@/constants/housing";

export function filterHousingUnits(units: HousingUnit[], activeFilter: HousingFilter) {
  if (activeFilter === "Available") {
    return units.filter((unit) => unit.status === "Available");
  }

  if (activeFilter === "Under Maintenance") {
    return units.filter((unit) => unit.condition === "Under Maintenance");
  }

  return units;
}

export function countUnitsByCondition(units: HousingUnit[], condition: HousingCondition) {
  return units.filter((unit) => unit.condition === condition).length;
}
