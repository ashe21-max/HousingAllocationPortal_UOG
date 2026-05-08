"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ApiError } from "@/lib/api/client";
import {
  getOfficerAllocationResults,
  getOfficerAvailableHouses,
  getOfficerManagedRounds,
  runOfficerAllocation,
} from "@/lib/api/officer";

export function OfficerAllocationPanel() {
  const queryClient = useQueryClient();
  const [selectedRoundId, setSelectedRoundId] = useState("");

  const roundsQuery = useQuery({
    queryKey: ["officer-managed-rounds"],
    queryFn: getOfficerManagedRounds,
  });

  const availableHousesQuery = useQuery({
    queryKey: ["officer-available-houses"],
    queryFn: getOfficerAvailableHouses,
  });

  const allocationResultsQuery = useQuery({
    queryKey: ["officer-allocation-results", selectedRoundId],
    queryFn: () => getOfficerAllocationResults(selectedRoundId),
    enabled: selectedRoundId.length > 0,
  });

  const runAllocationMutation = useMutation({
    mutationFn: (roundId: string) => {
      const round = roundsQuery.data?.find((r) => r.id === roundId);
      if (round?.status !== "OPEN") {
        throw new Error("Only OPEN rounds can run allocation.");
      }
      return runOfficerAllocation(roundId);
    },
    onSuccess: (data) => {
      toast.success(
        `Allocation completed: ${data.summary.allocatedCount} assigned / ${data.summary.rankedApplicants} ranked.`,
      );
      queryClient.invalidateQueries({ queryKey: ["officer-available-houses"] });
      queryClient.invalidateQueries({
        queryKey: ["officer-allocation-results", selectedRoundId],
      });
      queryClient.invalidateQueries({ queryKey: ["housing-units"] });
    },
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : error instanceof Error ? error.message : "Allocation run failed.";
      toast.error(message);
    },
  });

  const roundOptions = useMemo(
    () => [
      { label: "-- Select round --", value: "" },
      ...(
        roundsQuery.data?.map((round) => ({
          label: `${round.name} (${round.status} - ${round.committeeRankingStatus})`,
          value: round.id,
        })) ?? []
      ),
    ],
    [roundsQuery.data],
  );

  const selectedRound = roundsQuery.data?.find((r) => r.id === selectedRoundId);
  const canRunAllocation = selectedRound?.status === "OPEN";

  // Don't auto-select any round - let user choose manually (default stays as "Select round")

  return (
    <section className="panel overflow-hidden">
      <div className="p-6 md:p-8 border-b border-[var(--border)]">
        <h2 className="text-lg font-bold uppercase tracking-tight text-[var(--color-primary)]">
          Run Allocation
        </h2>
        <p className="mt-2 text-sm text-muted">
          Allocate available houses from committee final ranking order.
        </p>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <Select
            label="Allocation Round"
            options={roundOptions}
            value={selectedRoundId}
            onChange={(event) => setSelectedRoundId(event.target.value)}
          />
          <Button
            onClick={() => runAllocationMutation.mutate(selectedRoundId)}
            busy={runAllocationMutation.isPending}
            disabled={!selectedRoundId || !canRunAllocation}
          >
            Run Allocation
          </Button>
        </div>

        {selectedRound && !canRunAllocation && (
          <p className="text-sm text-[var(--color-danger)]">
            Round must be in OPEN status to run allocation.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="border border-[var(--border)] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
              Available Houses
            </p>
            <p className="mt-2 text-2xl font-bold text-[var(--color-primary)]">
              {availableHousesQuery.data?.length ?? 0}
            </p>
          </div>
          <div className="border border-[var(--border)] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
              Round Results Rows
            </p>
            <p className="mt-2 text-2xl font-bold text-[var(--color-primary)]">
              {allocationResultsQuery.data?.length ?? 0}
            </p>
          </div>
        </div>

        {!selectedRoundId ? (
          <p className="text-sm text-muted">Select a round to view allocation results.</p>
        ) : allocationResultsQuery.isLoading ? (
          <p className="text-sm text-muted">Loading allocation results...</p>
        ) : allocationResultsQuery.isError ? (
          <p className="text-sm text-[var(--color-danger)]">
            Could not load allocation results.
          </p>
        ) : !allocationResultsQuery.data || allocationResultsQuery.data.length === 0 ? (
          <p className="text-sm text-muted">No allocation results for this round yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--surface-muted)] border-b border-[var(--border)]">
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                    Lecturer
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                    House
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                    Status
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                    Allocated
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {allocationResultsQuery.data.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-4 text-sm text-[var(--color-primary)]">
                      {row.lecturerName ?? row.applicationId}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted">
                      {row.housingBuildingName} / Block {row.housingBlockNumber} / Room{" "}
                      {row.housingRoomNumber}
                    </td>
                    <td className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                      {row.status}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted">
                      {new Date(row.allocatedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
