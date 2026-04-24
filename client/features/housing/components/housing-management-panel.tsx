"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { HousingFilter } from "@/constants/housing";
import { AddHousingModal } from "@/features/housing/components/add-housing-modal";
import { DeleteHousingModal } from "@/features/housing/components/delete-housing-modal";
import { EditHousingModal } from "@/features/housing/components/edit-housing-modal";
import { HousingFilterBar } from "@/features/housing/components/housing-filter-bar";
import { HousingDetailsModal } from "@/features/housing/components/housing-details-modal";
import { HousingSummaryCards } from "@/features/housing/components/housing-summary-cards";
import { HousingTable } from "@/features/housing/components/housing-table";
import { ApiError } from "@/lib/api/client";
import {
  createHousingUnit,
  deleteHousingUnit,
  getHousingUnitById,
  getHousingUnits,
  type CreateHousingUnitPayload,
  type HousingUnit,
  type UpdateHousingUnitPayload,
  updateHousingUnit,
} from "@/lib/api/housing";
import { countUnitsByCondition, filterHousingUnits } from "@/utils/housing";

export function HousingManagementPanel() {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState<HousingFilter>("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedUnitSnapshot, setSelectedUnitSnapshot] = useState<HousingUnit | undefined>();
  const [activeModal, setActiveModal] = useState<"details" | "edit" | "delete" | null>(null);

  const housingQuery = useQuery({
    queryKey: ["housing-units"],
    queryFn: () => getHousingUnits(),
  });

  const selectedHousingQuery = useQuery({
    queryKey: ["housing-unit", selectedUnitId],
    queryFn: () => getHousingUnitById(selectedUnitId!),
    enabled: selectedUnitId !== null && activeModal !== "delete",
  });

  const createHousingMutation = useMutation({
    mutationFn: (payload: CreateHousingUnitPayload) => createHousingUnit(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["housing-units"] });
      toast.success("Housing unit registered successfully.");
      setIsAddModalOpen(false);
    },
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Unable to create housing unit.";
      toast.error(message);
    },
  });

  const updateHousingMutation = useMutation({
    mutationFn: (payload: UpdateHousingUnitPayload) =>
      updateHousingUnit(selectedUnitId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["housing-units"] });
      queryClient.invalidateQueries({ queryKey: ["housing-unit", selectedUnitId] });
      toast.success("Housing unit updated successfully.");
      handleCloseModal();
    },
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Unable to update housing unit.";
      toast.error(message);
    },
  });

  const deleteHousingMutation = useMutation({
    mutationFn: () => deleteHousingUnit(selectedUnitId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["housing-units"] });
      toast.success("Housing unit deleted successfully.");
      handleCloseModal();
    },
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Unable to delete housing unit.";
      toast.error(message);
    },
  });

  const allUnits = housingQuery.data ?? [];
  const units = filterHousingUnits(allUnits, activeFilter);
  const availableCount = allUnits.filter((unit) => unit.status === "Available").length;
  const maintenanceCount = countUnitsByCondition(allUnits, "Under Maintenance");

  function openModal(type: "details" | "edit" | "delete", unit: HousingUnit) {
    setSelectedUnitId(unit.id);
    setSelectedUnitSnapshot(unit);
    setActiveModal(type);
  }

  function handleCloseModal() {
    setActiveModal(null);
    setSelectedUnitId(null);
    setSelectedUnitSnapshot(undefined);
  }

  return (
    <div className="space-y-10">
      {/* Hero / Summary Section */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-2">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-[var(--color-primary)]">
              Housing Overview
            </h2>
            <p className="max-w-2xl text-sm text-muted font-medium">
              Real-time monitoring of all university housing assets. Track availability and maintenance status at a glance.
            </p>
          </div>
          <Button 
            className="gap-2 rounded-none h-12 px-6" 
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="h-4 w-4" /> Register New House
          </Button>
        </div>

        <HousingSummaryCards
          totalUnits={allUnits.length}
          availableUnits={availableCount}
          maintenanceUnits={maintenanceCount}
        />
      </section>

      {/* Main Table Section */}
      <section className="space-y-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-[var(--border)] pb-8">
          <div className="grid gap-2">
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--color-primary)]">
              Asset Inventory
            </h3>
            <p className="text-[10px] text-muted font-mono uppercase tracking-[0.24em] font-bold">
               {units.length} total units matching filter
            </p>
          </div>

          <HousingFilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        <HousingTable
          units={units}
          isLoading={housingQuery.isLoading}
          error={housingQuery.error}
          onView={(unit) => openModal("details", unit)}
          onEdit={(unit) => openModal("edit", unit)}
          onDelete={(unit) => openModal("delete", unit)}
        />
      </section>

      <AddHousingModal
        isOpen={isAddModalOpen}
        isPending={createHousingMutation.isPending}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(values) => createHousingMutation.mutate(values)}
      />

      <HousingDetailsModal
        isOpen={activeModal === "details"}
        unit={selectedHousingQuery.data}
        isLoading={selectedHousingQuery.isLoading}
        error={selectedHousingQuery.error}
        onClose={handleCloseModal}
      />

      <EditHousingModal
        isOpen={activeModal === "edit"}
        unit={selectedHousingQuery.data}
        isLoading={selectedHousingQuery.isLoading}
        isPending={updateHousingMutation.isPending}
        error={selectedHousingQuery.error}
        onClose={handleCloseModal}
        onSubmit={(values) => updateHousingMutation.mutate(values)}
      />

      <DeleteHousingModal
        isOpen={activeModal === "delete"}
        unit={selectedUnitSnapshot}
        isPending={deleteHousingMutation.isPending}
        onClose={handleCloseModal}
        onConfirm={() => deleteHousingMutation.mutate()}
      />
    </div>
  );
}
