"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Download, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ApiError } from "@/lib/api/client";
import {
  getOfficerAllocationResults,
  getOfficerManagedRounds,
  deleteOfficerRound,
  sendReportToAdmin,
} from "@/lib/api/officer";

export function OfficerReportsPanel() {
  const queryClient = useQueryClient();
  const [selectedRoundId, setSelectedRoundId] = useState("");

  const roundsQuery = useQuery({
    queryKey: ["officer-managed-rounds"],
    queryFn: getOfficerManagedRounds,
  });

  const allocationResultsQuery = useQuery({
    queryKey: ["officer-allocation-results", selectedRoundId],
    queryFn: () => getOfficerAllocationResults(selectedRoundId),
    enabled: selectedRoundId.length > 0,
  });

  const deleteRoundMutation = useMutation({
    mutationFn: deleteOfficerRound,
    onSuccess: () => {
      toast.success("Round and its allocation results deleted.");
      queryClient.invalidateQueries({ queryKey: ["officer-managed-rounds"] });
      queryClient.invalidateQueries({ queryKey: ["officer-allocation-results", selectedRoundId] });
      setSelectedRoundId("");
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : "Could not delete round.";
      toast.error(message);
    },
  });

  const sendToAdminMutation = useMutation({
    mutationFn: sendReportToAdmin,
    onSuccess: () => {
      toast.success("Report sent to admin support for review.");
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : "Could not send report to admin.";
      toast.error(message);
    },
  });

  const roundOptions = [
    { label: "-- Select round --", value: "" },
    ...(roundsQuery.data?.map((round) => ({
      label: `${round.name} (${round.status})`,
      value: round.id,
    })) ?? []),
  ];

  const selectedRound = roundsQuery.data?.find((r) => r.id === selectedRoundId);

  function handleDownloadReport() {
    if (!selectedRound || !allocationResultsQuery.data) return;

    const reportData = {
      round: {
        name: selectedRound.name,
        status: selectedRound.status,
        committeeRankingStatus: selectedRound.committeeRankingStatus,
        startsAt: selectedRound.startsAt,
        endsAt: selectedRound.endsAt,
      },
      allocations: allocationResultsQuery.data,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `allocation-report-${selectedRound.name.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Report downloaded successfully.");
  }

  function handleSendToAdmin() {
    if (!selectedRound || !allocationResultsQuery.data) return;

    const reportData = {
      round: {
        id: selectedRound.id,
        name: selectedRound.name,
        status: selectedRound.status,
        committeeRankingStatus: selectedRound.committeeRankingStatus,
        startsAt: selectedRound.startsAt,
        endsAt: selectedRound.endsAt,
      },
      allocations: allocationResultsQuery.data,
      generatedAt: new Date().toISOString(),
    };

    sendToAdminMutation.mutate({
      roundId: selectedRound.id,
      roundName: selectedRound.name,
      allocationCount: allocationResultsQuery.data.length,
      reportData,
    });
  }

  return (
    <div className="space-y-6">
      <section className="bg-white border border-gray-200 shadow-sm rounded-3xl p-6 backdrop-blur-none">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_auto_auto] md:items-end">
          <Select
            label="Select Round"
            options={roundOptions}
            value={selectedRoundId}
            onChange={(event) => setSelectedRoundId(event.target.value)}
          />
          <Button
            onClick={handleDownloadReport}
            disabled={!selectedRoundId || !allocationResultsQuery.data || allocationResultsQuery.data.length === 0}
            className="gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button
            variant="success"
            onClick={handleSendToAdmin}
            busy={sendToAdminMutation.isPending}
            disabled={!selectedRoundId || !allocationResultsQuery.data || allocationResultsQuery.data.length === 0}
            className="gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
          >
            <FileText className="h-4 w-4" />
            Send to Admin
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteRoundMutation.mutate(selectedRoundId)}
            busy={deleteRoundMutation.isPending}
            disabled={!selectedRoundId}
            className="gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </section>

      {selectedRound && (
        <section className="bg-white border border-gray-200 shadow-sm rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold uppercase tracking-tight text-[var(--color-primary)]">
              Round Information
            </h3>
          </div>
          <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-muted uppercase tracking-wide">Round Name</p>
              <p className="text-sm font-semibold text-[var(--color-primary)]">{selectedRound.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted uppercase tracking-wide">Status</p>
              <p className="text-sm font-semibold text-[var(--color-primary)]">{selectedRound.status}</p>
            </div>
            <div>
              <p className="text-xs text-muted uppercase tracking-wide">Committee Ranking</p>
              <p className="text-sm font-semibold text-[var(--color-primary)]">{selectedRound.committeeRankingStatus}</p>
            </div>
            <div>
              <p className="text-xs text-muted uppercase tracking-wide">Allocations</p>
              <p className="text-sm font-semibold text-[var(--color-primary)]">{allocationResultsQuery.data?.length ?? 0}</p>
            </div>
          </div>
        </section>
      )}

      {allocationResultsQuery.isLoading ? (
        <div className="bg-white border border-gray-200 shadow-sm rounded-3xl p-8">
          <p className="text-sm text-muted">Loading allocation results...</p>
        </div>
      ) : allocationResultsQuery.isError ? (
        <div className="bg-white border border-gray-200 shadow-sm rounded-3xl p-8">
          <p className="text-sm text-[var(--color-danger)]">Could not load allocation results.</p>
        </div>
      ) : !allocationResultsQuery.data || allocationResultsQuery.data.length === 0 ? (
        <div className="bg-white border border-gray-200 shadow-sm rounded-3xl p-8">
          <p className="text-sm text-muted">No allocation results for this round yet.</p>
        </div>
      ) : (
        <section className="bg-white border border-gray-200 shadow-sm rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold uppercase tracking-tight text-[var(--color-primary)]">
              Allocation Results
            </h3>
          </div>
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
                    Room Type
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                    Status
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                    Allocated At
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
                    <td className="px-4 py-4 text-sm text-muted">{row.housingRoomType ?? "-"}</td>
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
        </section>
      )}
    </div>
  );
}
