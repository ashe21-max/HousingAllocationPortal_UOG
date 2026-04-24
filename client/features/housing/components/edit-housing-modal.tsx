"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, DoorOpen, MapPin, Pencil, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { conditionOptions, roomTypeOptions, statusOptions } from "@/constants/housing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { HousingUnit, UpdateHousingUnitPayload } from "@/lib/api/housing";
import { ApiError } from "@/lib/api/client";
import {
  housingUpdateSchema,
  type HousingUpdateFormValues,
} from "@/schemas/housing";

type EditHousingModalProps = {
  isOpen: boolean;
  unit: HousingUnit | undefined;
  isLoading: boolean;
  isPending: boolean;
  error: Error | null;
  onClose: () => void;
  onSubmit: (values: UpdateHousingUnitPayload) => void;
};

export function EditHousingModal({
  isOpen,
  unit,
  isLoading,
  isPending,
  error,
  onClose,
  onSubmit,
}: EditHousingModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HousingUpdateFormValues>({
    resolver: zodResolver(housingUpdateSchema),
    defaultValues: {
      buildingName: "",
      blockNumber: "",
      roomNumber: "",
      roomType: "Studio",
      status: "Available",
      condition: "New",
      location: "",
    },
  });

  useEffect(() => {
    if (unit) {
      reset({
        buildingName: unit.buildingName,
        blockNumber: unit.blockNumber,
        roomNumber: unit.roomNumber,
        roomType: unit.roomType,
        status: unit.status,
        condition: unit.condition,
        location: unit.location,
      });
    }
  }, [reset, unit]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-[rgba(61,52,78,0.18)]">
      <div className="h-full w-full max-w-2xl overflow-y-auto border-l border-[var(--border)] bg-[var(--background)] p-6 shadow-[0_24px_80px_rgba(42,35,57,0.2)] rounded-none">
        <div className="panel grid gap-6 p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="grid gap-2">
              <div className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
                Edit housing unit
              </div>
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold text-[var(--color-primary)]">
                Update the full housing record
              </h3>
              <p className="text-sm leading-7 text-muted">
                Edit the physical details, room setup, operational condition, and current status
                for this housing unit.
              </p>
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
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              <div className="border border-[var(--border)] bg-white p-4 rounded-none">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                  Selected unit
                </div>
                <div className="mt-2 text-sm font-semibold text-[var(--color-primary)]">
                  {unit?.buildingName} · {unit?.blockNumber} · {unit?.roomNumber}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Building name"
                  icon={<Building2 className="h-4 w-4" />}
                  error={errors.buildingName?.message}
                  {...register("buildingName")}
                />
                <Input
                  label="Location"
                  icon={<MapPin className="h-4 w-4" />}
                  error={errors.location?.message}
                  {...register("location")}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Block number"
                  icon={<Building2 className="h-4 w-4" />}
                  error={errors.blockNumber?.message}
                  {...register("blockNumber")}
                />
                <Input
                  label="Room number"
                  icon={<DoorOpen className="h-4 w-4" />}
                  error={errors.roomNumber?.message}
                  {...register("roomNumber")}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Select
                  label="Room type"
                  options={roomTypeOptions}
                  error={errors.roomType?.message}
                  {...register("roomType")}
                />
                <Select
                  label="Status"
                  options={statusOptions}
                  error={errors.status?.message}
                  {...register("status")}
                />
                <Select
                  label="Condition"
                  options={conditionOptions}
                  error={errors.condition?.message}
                  {...register("condition")}
                />
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Button type="submit" busy={isPending} className="gap-2">
                  <Pencil className="h-4 w-4" />
                  Save updates
                </Button>
                <Button type="button" variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
