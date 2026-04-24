import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  housingFilterOptions,
  type HousingFilter,
} from "@/constants/housing";

type HousingFilterBarProps = {
  activeFilter: HousingFilter;
  onFilterChange: (filter: HousingFilter) => void;
};

export function HousingFilterBar({
  activeFilter,
  onFilterChange,
}: HousingFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-muted border border-[var(--border)] bg-white rounded-none">
        <Filter className="h-4 w-4" />
        Quick Filters
      </div>
      <div className="flex items-center gap-2">
        {housingFilterOptions.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <Button
              key={filter}
              variant={isActive ? "primary" : "ghost"}
              className="px-6 h-12"
              onClick={() => onFilterChange(filter)}
            >
              {filter === "ALL" ? "All units" : filter}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
