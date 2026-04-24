"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ApiError } from "@/lib/api/client";
import {
  generateRoundRanking,
  getRoundRanking,
  downloadCommitteeDocument,
  getCommitteeApplicationDetails,
  getCommitteeApplications,
  markCommitteeApplicationUnderReview,
  saveRoundRanking,
  submitRoundFinal,
  submitRoundPreliminary,
  type CommitteeApplicationStatus,
} from "@/lib/api/committee";

type StatusFilter = "" | CommitteeApplicationStatus;

export function CommitteeReviewWorkspace() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("SUBMITTED");
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [complianceIssue, setComplianceIssue] = useState(false);
  const [complianceNotes, setComplianceNotes] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [selectedRoundId, setSelectedRoundId] = useState("");
  const [manualRanks, setManualRanks] = useState<Record<string, number>>({});

  const queueQuery = useQuery({
    queryKey: ["committee-applications", statusFilter],
    queryFn: () =>
      getCommitteeApplications({
        status: statusFilter || undefined,
      }),
  });

  const detailsQuery = useQuery({
    queryKey: ["committee-application-details", selectedApplicationId],
    queryFn: () => getCommitteeApplicationDetails(selectedApplicationId!),
    enabled: !!selectedApplicationId,
  });

  const rankingQuery = useQuery({
    queryKey: ["committee-round-ranking", selectedRoundId],
    queryFn: () => getRoundRanking(selectedRoundId),
    enabled: selectedRoundId.length > 0,
  });

  const reviewMutation = useMutation({
    mutationFn: (applicationId: string) =>
      markCommitteeApplicationUnderReview(applicationId, {
        complianceIssue,
        complianceNotes: complianceNotes.trim() || null,
        notes: reviewNotes.trim() || null,
      }),
    onSuccess: () => {
      toast.success("Application moved to UNDER_REVIEW.");
      queryClient.invalidateQueries({ queryKey: ["committee-applications"] });
      queryClient.invalidateQueries({
        queryKey: ["committee-application-details", selectedApplicationId],
      });
    },
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Review update failed.";
      toast.error(message);
    },
  });

  const generateRankingMutation = useMutation({
    mutationFn: (roundId: string) => generateRoundRanking(roundId),
    onSuccess: () => {
      toast.success("Round ranking generated.");
      queryClient.invalidateQueries({
        queryKey: ["committee-round-ranking", selectedRoundId],
      });
      queryClient.invalidateQueries({ queryKey: ["committee-applications"] });
    },
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Could not generate ranking.";
      toast.error(message);
    },
  });

  const saveRankingMutation = useMutation({
    mutationFn: (roundId: string) =>
      saveRoundRanking(
        roundId,
        Object.entries(manualRanks).map(([applicationId, rankPosition]) => ({
          applicationId,
          rankPosition,
        })),
      ),
    onSuccess: () => {
      toast.success("Manual ranking saved.");
      queryClient.invalidateQueries({
        queryKey: ["committee-round-ranking", selectedRoundId],
      });
    },
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Could not save ranking.";
      toast.error(message);
    },
  });

  const preliminaryMutation = useMutation({
    mutationFn: (roundId: string) => submitRoundPreliminary(roundId),
    onSuccess: () => {
      toast.success("Preliminary ranking submitted.");
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : "Could not submit preliminary ranking.";
      toast.error(message);
    },
  });

  const finalMutation = useMutation({
    mutationFn: (roundId: string) => submitRoundFinal(roundId),
    onSuccess: () => {
      toast.success("Final ranking submitted.");
      queryClient.invalidateQueries({ queryKey: ["committee-applications"] });
      queryClient.invalidateQueries({
        queryKey: ["committee-round-ranking", selectedRoundId],
      });
    },
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Could not submit final ranking.";
      toast.error(message);
    },
  });

  const downloadMutation = useMutation({
    mutationFn: ({ documentId, fileName }: { documentId: string; fileName: string }) =>
      downloadCommitteeDocument(documentId, fileName),
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Download failed.";
      toast.error(message);
    },
  });

  const statusOptions = useMemo(
    () => [
      { label: "All statuses", value: "" },
      { label: "Submitted", value: "SUBMITTED" },
      { label: "Under Review", value: "UNDER_REVIEW" },
      { label: "Ranked", value: "RANKED" },
      { label: "Rejected", value: "REJECTED" },
    ],
    [],
  );

  const roundOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const row of queueQuery.data ?? []) {
      map.set(row.roundId, row.roundName ?? row.roundId);
    }
    return [{ label: "Select round", value: "" }].concat(
      Array.from(map.entries()).map(([value, label]) => ({ value, label })),
    );
  }, [queueQuery.data]);

  useEffect(() => {
    if (!selectedRoundId && roundOptions.length > 1) {
      setSelectedRoundId(roundOptions[1]!.value);
    }
  }, [roundOptions, selectedRoundId]);

  useEffect(() => {
    if (!rankingQuery.data) {
      return;
    }
    setManualRanks(
      rankingQuery.data.reduce<Record<string, number>>((acc, row) => {
        acc[row.applicationId] = row.rankPosition;
        return acc;
      }, {}),
    );
  }, [rankingQuery.data]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <section className="panel overflow-hidden">
          <div className="p-6 border-b border-[var(--border)]">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold uppercase tracking-tight text-[var(--color-primary)]">
                Review Applications
              </h2>
              <div className="w-60">
                <Select
                  label=""
                  options={statusOptions}
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                />
              </div>
            </div>
          </div>

          {queueQuery.isLoading ? (
            <div className="p-8 text-sm text-muted">Loading application queue...</div>
          ) : queueQuery.isError ? (
            <div className="p-8 text-sm text-[var(--color-danger)]">
              Could not load committee queue.
            </div>
          ) : !queueQuery.data || queueQuery.data.length === 0 ? (
            <div className="p-8 text-sm text-muted">No applications in this filter.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--surface-muted)] border-b border-[var(--border)]">
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                      Lecturer
                    </th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                      Round
                    </th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                      Score
                    </th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                      Status
                    </th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {queueQuery.data.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-4 text-sm text-[var(--color-primary)]">
                        {row.lecturerName ?? row.userId}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted">
                        {row.roundName ?? row.roundId}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted">
                        {row.finalScore ?? "-"}
                      </td>
                      <td className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                        {row.status}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setSelectedApplicationId(row.id);
                            setComplianceIssue(false);
                            setComplianceNotes("");
                            setReviewNotes("");
                            setSelectedRoundId(row.roundId);
                          }}
                        >
                          Open
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel p-6">
          {!selectedApplicationId ? (
            <p className="text-sm text-muted">Select an application to review details.</p>
          ) : detailsQuery.isLoading ? (
            <p className="text-sm text-muted">Loading application details...</p>
          ) : detailsQuery.isError || !detailsQuery.data ? (
            <p className="text-sm text-[var(--color-danger)]">
              Could not load selected application.
            </p>
          ) : (
            <div className="space-y-6">
              <div className="border-b border-[var(--border)] pb-4">
                <h3 className="text-lg font-bold uppercase tracking-tight text-[var(--color-primary)]">
                  Application Detail
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {detailsQuery.data.lecturerName ?? detailsQuery.data.userId} |{" "}
                  {detailsQuery.data.lecturerDepartment ?? "No department"}
                </p>
              </div>

              <div className="grid gap-3 text-sm">
                <div>
                  <span className="font-semibold text-[var(--color-primary)]">Round:</span>{" "}
                  <span className="text-muted">
                    {detailsQuery.data.roundName ?? detailsQuery.data.roundId}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-[var(--color-primary)]">Status:</span>{" "}
                  <span className="text-muted">{detailsQuery.data.status}</span>
                </div>
                <div>
                  <span className="font-semibold text-[var(--color-primary)]">Final Score:</span>{" "}
                  <span className="text-muted">{detailsQuery.data.scoreFinal ?? "-"}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
                  Documents
                </h4>
                {detailsQuery.data.documents.length === 0 ? (
                  <p className="mt-2 text-sm text-muted">No uploaded documents.</p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {detailsQuery.data.documents.map((document) => (
                      <div
                        key={document.id}
                        className="flex items-center justify-between gap-3 border border-[var(--border)] p-3"
                      >
                        <div>
                          <p className="text-sm text-[var(--color-primary)]">
                            {document.originalFileName}
                          </p>
                          <p className="text-xs text-muted">{document.purpose}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          busy={
                            downloadMutation.isPending &&
                            downloadMutation.variables?.documentId === document.id
                          }
                          onClick={() =>
                            downloadMutation.mutate({
                              documentId: document.id,
                              fileName: document.originalFileName,
                            })
                          }
                        >
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3 border-t border-[var(--border)] pt-4">
                <label className="flex items-center gap-2 text-sm text-[var(--color-primary)]">
                  <input
                    type="checkbox"
                    checked={complianceIssue}
                    onChange={(event) => setComplianceIssue(event.target.checked)}
                  />
                  Mark compliance issue
                </label>
                <label className="flex w-full flex-col gap-2 text-sm font-medium text-[var(--color-primary)]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                    Compliance Notes
                  </span>
                  <textarea
                    className="min-h-20 w-full resize-y border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
                    value={complianceNotes}
                    onChange={(event) => setComplianceNotes(event.target.value)}
                  />
                </label>
                <label className="flex w-full flex-col gap-2 text-sm font-medium text-[var(--color-primary)]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                    Review Notes
                  </span>
                  <textarea
                    className="min-h-20 w-full resize-y border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-accent)]"
                    value={reviewNotes}
                    onChange={(event) => setReviewNotes(event.target.value)}
                  />
                </label>
                <Button
                  onClick={() => reviewMutation.mutate(selectedApplicationId)}
                  busy={reviewMutation.isPending}
                  disabled={detailsQuery.data.status !== "SUBMITTED"}
                >
                  Mark Under Review
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="panel overflow-hidden">
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-bold uppercase tracking-tight text-[var(--color-primary)]">
              Rank Applicants
            </h2>
            <div className="w-64">
              <Select
                label=""
                options={roundOptions}
                value={selectedRoundId}
                onChange={(event) => setSelectedRoundId(event.target.value)}
              />
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => generateRankingMutation.mutate(selectedRoundId)}
              busy={generateRankingMutation.isPending}
              disabled={!selectedRoundId}
            >
              Generate by Score
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => saveRankingMutation.mutate(selectedRoundId)}
              busy={saveRankingMutation.isPending}
              disabled={!selectedRoundId || !rankingQuery.data || rankingQuery.data.length === 0}
            >
              Save Manual Ranking
            </Button>
            <Button
              size="sm"
              onClick={() => preliminaryMutation.mutate(selectedRoundId)}
              busy={preliminaryMutation.isPending}
              disabled={!selectedRoundId}
            >
              Send Preliminary
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => finalMutation.mutate(selectedRoundId)}
              busy={finalMutation.isPending}
              disabled={!selectedRoundId}
            >
              Submit Final Rank
            </Button>
          </div>
        </div>
        {rankingQuery.isLoading ? (
          <div className="p-8 text-sm text-muted">Loading ranking...</div>
        ) : rankingQuery.isError ? (
          <div className="p-8 text-sm text-[var(--color-danger)]">
            Could not load ranking for selected round.
          </div>
        ) : !rankingQuery.data || rankingQuery.data.length === 0 ? (
          <div className="p-8 text-sm text-muted">
            No ranking entries yet. Generate ranking first.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--surface-muted)] border-b border-[var(--border)]">
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                    Applicant
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                    Score
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                    Status
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                    Rank
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {rankingQuery.data.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-4 py-4 text-sm text-[var(--color-primary)]">
                      {entry.lecturerName ?? entry.applicationId}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted">{entry.finalScore ?? "-"}</td>
                    <td className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                      {entry.applicationStatus ?? "-"}
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="number"
                        min={1}
                        className="h-10 w-24 border border-[var(--border)] px-3 text-sm outline-none focus:border-[var(--color-accent)]"
                        value={manualRanks[entry.applicationId] ?? entry.rankPosition}
                        onChange={(event) =>
                          setManualRanks((prev) => ({
                            ...prev,
                            [entry.applicationId]: Number(event.target.value),
                          }))
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
