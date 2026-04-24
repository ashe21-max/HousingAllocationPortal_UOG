"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { HousingUnit } from "@/lib/api/housing";

type DeleteHousingModalProps = {
  isOpen: boolean;
  unit: HousingUnit | undefined;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteHousingModal({
  isOpen,
  unit,
  isPending,
  onClose,
  onConfirm,
}: DeleteHousingModalProps) {
  if (!isOpen || !unit) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(61,52,78,0.18)] p-6">
      <div className="panel w-full max-w-lg grid gap-6 p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="grid gap-2">
            <div className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
              Delete housing unit
            </div>
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold text-[var(--color-primary)]">
              Remove this unit from inventory?
            </h3>
          </div>
          <Button variant="ghost" onClick={onClose} className="px-3">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="border border-[#f2c3c3] bg-[#fff4f4] p-5 rounded-none">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-danger)]">
            <AlertTriangle className="h-4 w-4" />
            This action is permanent
          </div>
          <p className="mt-3 text-sm leading-7 text-[var(--color-primary)]">
            You are deleting <strong>{unit.buildingName}</strong> in block{" "}
            <strong>{unit.blockNumber}</strong>, room <strong>{unit.roomNumber}</strong>.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            busy={isPending}
            className="gap-2 bg-[var(--color-danger)] border-[var(--color-danger)] hover:bg-[#a83232]"
            onClick={onConfirm}
          >
            <Trash2 className="h-4 w-4" />
            Delete unit
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
