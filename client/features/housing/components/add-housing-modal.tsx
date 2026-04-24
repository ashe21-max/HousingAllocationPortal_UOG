"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BedDouble,
  Building2,
  DoorOpen,
  MapPin,
  Plus,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  conditionOptions,
  roomTypeOptions,
  statusOptions,
} from "@/constants/housing";
import {
  housingSchema,
  type HousingFormValues,
} from "@/schemas/housing";
import type { CreateHousingUnitPayload } from "@/lib/api/housing";

type AddHousingModalProps = {
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (values: CreateHousingUnitPayload) => void;
};

const defaultValues: HousingFormValues = {
  buildingName: "",
  blockNumber: "",
  roomNumber: "",
  roomType: "Studio",
  condition: "New",
  status: "Available",
  location: "",
};

export function AddHousingModal({
  isOpen,
  isPending,
  onClose,
  onSubmit,
}: AddHousingModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HousingFormValues>({
    resolver: zodResolver(housingSchema),
    defaultValues,
  });

  function handleClose() {
    reset(defaultValues);
    onClose();
  }

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
                Register housing unit
              </div>
              <h3 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold text-[var(--color-primary)]">
                Add a new house to the officer inventory
              </h3>
              <p className="text-sm leading-7 text-muted">
                Enter the physical room details and current status so the allocation team can
                track it immediately.
              </p>
            </div>
            <Button variant="ghost" onClick={handleClose} className="px-3">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Building name"
                icon={<Building2 className="h-4 w-4" />}
                error={errors.buildingName?.message}
                placeholder="Main Residence"
                {...register("buildingName")}
              />
              <Input
                label="Location"
                icon={<MapPin className="h-4 w-4" />}
                error={errors.location?.message}
                placeholder="Maraki Campus"
                {...register("location")}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Block number"
                icon={<Building2 className="h-4 w-4" />}
                error={errors.blockNumber?.message}
                placeholder="Block B"
                {...register("blockNumber")}
              />
              <Input
                label="Room number"
                icon={<DoorOpen className="h-4 w-4" />}
                error={errors.roomNumber?.message}
                placeholder="Room 204"
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
                label="Condition"
                options={conditionOptions}
                error={errors.condition?.message}
                {...register("condition")}
              />
              <Select
                label="Status"
                options={statusOptions}
                error={errors.status?.message}
                {...register("status")}
              />
            </div>

            <div className="border border-[var(--border)] bg-[var(--surface-muted)] p-4 rounded-none">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]">
                <BedDouble className="h-4 w-4" />
                Validation rules
              </div>
              <p className="mt-2 text-sm leading-7 text-muted">
                Building and location must be at least 2 characters. Block and room numbers
                are required. Room type, condition, and status must match the backend enums.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button type="submit" busy={isPending} className="gap-2">
                <Plus className="h-4 w-4" />
                Save housing unit
              </Button>
              <Button type="button" variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
