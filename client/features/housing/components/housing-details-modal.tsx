"use client";

import { Building2, CalendarDays, DoorOpen, MapPin, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HousingConditionBadge } from "@/features/housing/components/housing-condition-badge";
import { HousingStatusBadge } from "@/features/housing/components/housing-status-badge";
import type { HousingUnit } from "@/lib/api/housing";
import { ApiError } from "@/lib/api/client";

type HousingDetailsModalProps = {
  isOpen: boolean;
  unit: HousingUnit | undefined;
  isLoading: boolean;
  error: Error | null;
  onClose: () => void;
};

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="border border-[var(--border)] bg-white p-4 rounded-none">
      <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.22em] text-muted">
        {icon}
        {label}
      </div>
      <div className="mt-3 text-sm font-semibold text-[var(--color-primary)]">{value}</div>
    </div>
  );
}

export function HousingDetailsModal({
  isOpen,
  unit,
  isLoading,
  error,
  onClose,
}: HousingDetailsModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-[rgba(61,52,78,0.18)]">
      <div className="h-full w-full max-w-xl overflow-y-auto border-l border-[var(--border)] bg-[var(--background)] p-6 shadow-[0_24px_80px_rgba(42,35,57,0.2)] rounded-none">
        <div className="panel grid gap-6 p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="grid gap-2">
              <div className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
                Housing details
              </div>
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold text-[var(--color-primary)]">
                {unit?.buildingName ?? "Selected housing unit"}
              </h3>
            </div>
            <Button variant="ghost" onClick={onClose} className="px-3">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {isLoading ? (
            <div className="border border-[var(--border)] bg-white p-8 text-sm text-muted rounded-none">
              Loading unit details...
            </div>
          ) : error ? (
            <div className="border border-[var(--border)] bg-white p-8 text-sm text-[var(--color-danger)] rounded-none">
              {error instanceof ApiError ? error.message : "Unable to load housing details."}
            </div>
          ) : unit ? (
            <div className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <DetailRow
                  icon={<Building2 className="h-4 w-4" />}
                  label="Building"
                  value={unit.buildingName}
                />
                <DetailRow
                  icon={<MapPin className="h-4 w-4" />}
                  label="Location"
                  value={unit.location}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <DetailRow
                  icon={<Building2 className="h-4 w-4" />}
                  label="Block"
                  value={unit.blockNumber}
                />
                <DetailRow
                  icon={<DoorOpen className="h-4 w-4" />}
                  label="Room"
                  value={unit.roomNumber}
                />
                <DetailRow
                  icon={<DoorOpen className="h-4 w-4" />}
                  label="Room type"
                  value={unit.roomType}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <DetailRow
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Condition"
                  value={<HousingConditionBadge condition={unit.condition} />}
                />
                <DetailRow
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Status"
                  value={<HousingStatusBadge status={unit.status} />}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <DetailRow
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Created"
                  value={new Date(unit.createdAt).toLocaleString()}
                />
                <DetailRow
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Last updated"
                  value={new Date(unit.updatedAt).toLocaleString()}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
