"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Eye, FileText, User, GraduationCap, Award } from "lucide-react";

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
  submitRoundFinal,
  submitRoundPreliminary,
  type CommitteeApplicationStatus,
} from "@/lib/api/committee";
import { getOfficerManagedRounds } from "@/lib/api/officer";

type StatusFilter = "" | CommitteeApplicationStatus;

type ScoreBreakdownRow = {
  criteria?: string;
  score?: number | null;
};

function displayValue(value: string | number | boolean | null | undefined) {
  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  const trimmed = String(value).trim();
  return trimmed.length > 0 ? trimmed : "-";
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
}

function formatEnumLabel(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getCriterionScore(scoreBreakdown: unknown, labels: string[]) {
  if (!Array.isArray(scoreBreakdown)) {
    return "-";
  }

  const rows = scoreBreakdown as ScoreBreakdownRow[];
  const match = rows.find((row) => {
    const criteria = row.criteria?.trim().toLowerCase();
    return criteria ? labels.some((label) => criteria === label.toLowerCase()) : false;
  });

  return typeof match?.score === "number" ? String(match.score) : "-";
}

export function CommitteeReviewWorkspace() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("SUBMITTED");
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [complianceIssue, setComplianceIssue] = useState(false);
  const [complianceNotes, setComplianceNotes] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [selectedRoundId, setSelectedRoundId] = useState("");
  const [showCompleteFormData, setShowCompleteFormData] = useState(false);

  const queueQuery = useQuery({
    queryKey: ["committee-applications", statusFilter, selectedRoundId],
    queryFn: () =>
      getCommitteeApplications({
        status: statusFilter || undefined,
        roundId: selectedRoundId || undefined,
      }),
  });

  const roundsQuery = useQuery({
    queryKey: ["committee-rounds"],
    queryFn: getOfficerManagedRounds,
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
    mutationFn: (roundId: string) => {
      const round = roundsQuery.data?.find((r: {id: string; status: string}) => r.id === roundId);
      if (round?.status !== "OPEN") {
        throw new Error("Only OPEN rounds can generate ranking.");
      }
      return generateRoundRanking(roundId);
    },
    onSuccess: () => {
      toast.success("Round ranking generated.");
      queryClient.invalidateQueries({
        queryKey: ["committee-round-ranking", selectedRoundId],
      });
      queryClient.invalidateQueries({ queryKey: ["committee-applications"] });
    },
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : error instanceof Error ? error.message : "Could not generate ranking.";
      toast.error(message);
    },
  });

  const preliminaryMutation = useMutation({
    mutationFn: (roundId: string) => {
      const round = roundsQuery.data?.find((r: {id: string; status: string}) => r.id === roundId);
      if (round?.status !== "OPEN") {
        throw new Error("Only OPEN rounds can submit preliminary ranking.");
      }
      return submitRoundPreliminary(roundId);
    },
    onSuccess: () => {
      toast.success("Preliminary ranking submitted.");
    },
    onError: (error) => {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error ? error.message : "Could not submit preliminary ranking.";
      toast.error(message);
    },
  });

  const finalMutation = useMutation({
    mutationFn: (roundId: string) => {
      const round = roundsQuery.data?.find((r: {id: string; status: string}) => r.id === roundId);
      if (round?.status !== "OPEN") {
        throw new Error("Only OPEN rounds can submit final ranking.");
      }
      return submitRoundFinal(roundId);
    },
    onSuccess: () => {
      toast.success("Final ranking submitted.");
      queryClient.invalidateQueries({ queryKey: ["committee-applications"] });
      queryClient.invalidateQueries({
        queryKey: ["committee-round-ranking", selectedRoundId],
      });
    },
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : error instanceof Error ? error.message : "Could not submit final ranking.";
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
    return [
      { label: "-- Select round --", value: "" },
      ...(roundsQuery.data?.map((round: {id: string; name: string; status: string}) => ({
        label: `${round.name} (${round.status})`,
        value: round.id,
      })) ?? []),
    ];
  }, [roundsQuery.data]);

  const selectedRound = roundsQuery.data?.find((r: {id: string}) => r.id === selectedRoundId);
  const canRunRanking = selectedRound?.status === "OPEN";

  // Don't auto-select any round - let user choose manually (default stays as "Select round")
  // Removed auto-selection behavior to match lecturer application form

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
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-muted)] font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                    <th className="px-4 py-3 font-semibold text-left">Lecturer</th>
                    <th className="px-4 py-3 font-semibold text-left">Round</th>
                    <th className="px-4 py-3 font-semibold text-left">Status</th>
                    <th className="px-4 py-3 font-semibold text-left text-right">Action</th>
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
                            setShowCompleteFormData(false);
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
                  {detailsQuery.data.lecturerDepartment ?? "No college"}
                </p>
              </div>

              {/* Show Complete Form Data Button */}
              <div className="mt-4">
                <button
                  onClick={() => setShowCompleteFormData(!showCompleteFormData)}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  <span>{showCompleteFormData ? "Hide" : "Show"} Complete Form Data</span>
                </button>
              </div>

              {/* Complete Form Data Section */}
              {showCompleteFormData && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden w-full">
                  {/* HEADER */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 w-full">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-600" />
                      Complete Application Form Data
                    </h4>
                  </div>

                  {/* BODY - FULL FRAME TABLES */}
                  <div className="p-2 space-y-3 w-full">
                    
                    {/* PERSONAL INFORMATION */}
                    <div className="w-full">
                      <h5 className="text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-600" />
                        Personal Information
                      </h5>

                      <div className="bg-gray-50 rounded-lg overflow-hidden w-full">
                        <table className="w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 w-1/3">Information Type</th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 w-1/3">Information</th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 w-1/3">Points</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="px-4 py-3 font-medium text-gray-700">Full Name</td>
                              <td className="px-4 py-3 text-gray-900">{displayValue(detailsQuery.data.formData?.fullName ?? detailsQuery.data.lecturerName)}</td>
                              <td className="px-4 py-3 text-gray-600">-</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-gray-700">Staff ID</td>
                              <td className="px-4 py-3 text-gray-900">{displayValue(detailsQuery.data.formData?.staffId ?? detailsQuery.data.userId)}</td>
                              <td className="px-4 py-3 text-gray-600">-</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-gray-700">Email</td>
                              <td className="px-4 py-3 text-gray-900">{displayValue(detailsQuery.data.formData?.email ?? detailsQuery.data.lecturerEmail)}</td>
                              <td className="px-4 py-3 text-gray-600">-</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-gray-700">Phone Number</td>
                              <td className="px-4 py-3 text-gray-900">{displayValue(detailsQuery.data.formData?.phoneNumber)}</td>
                              <td className="px-4 py-3 text-gray-600">-</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* ACADEMIC INFORMATION */}
                    <div className="w-full">
                      <h5 className="text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-gray-600" />
                        Academic Information
                      </h5>

                      <div className="bg-gray-50 rounded-lg overflow-hidden w-full">
                        <table className="w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 w-1/3">Information Type</th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 w-1/3">Information</th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 w-1/3">Points</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="px-4 py-3 font-medium text-gray-700">College</td>
                              <td className="px-4 py-3 text-gray-900">{displayValue(detailsQuery.data.formData?.college ?? detailsQuery.data.lecturerDepartment)}</td>
                              <td className="px-4 py-3 text-gray-600">-</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-gray-700">College / Unit</td>
                              <td className="px-4 py-3 text-gray-900">{displayValue(detailsQuery.data.formData?.department ?? detailsQuery.data.lecturerDepartment)}</td>
                              <td className="px-4 py-3 text-gray-600">-</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-gray-700">Educational Title</td>
                              <td className="px-4 py-3 text-gray-900">{displayValue(detailsQuery.data.formData?.educationalTitle)}</td>
                              <td className="px-4 py-3 text-green-600 font-semibold">{getCriterionScore(detailsQuery.data.scoreBreakdown, ["Educational Title"])}</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-gray-700">Educational Level</td>
                              <td className="px-4 py-3 text-gray-900">{displayValue(detailsQuery.data.formData?.educationalLevel)}</td>
                              <td className="px-4 py-3 text-green-600 font-semibold">{getCriterionScore(detailsQuery.data.scoreBreakdown, ["Educational Level"])}</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-gray-700">Start Date at UOG</td>
                              <td className="px-4 py-3 text-gray-900">{displayValue(formatDate(detailsQuery.data.formData?.startDateAtUog))}</td>
                              <td className="px-4 py-3 text-green-600 font-semibold">{getCriterionScore(detailsQuery.data.scoreBreakdown, ["Service Years"])}</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-gray-700">Responsibility</td>
                              <td className="px-4 py-3 text-gray-900">{displayValue(formatEnumLabel(detailsQuery.data.formData?.responsibility))}</td>
                              <td className="px-4 py-3 text-green-600 font-semibold">{getCriterionScore(detailsQuery.data.scoreBreakdown, ["Responsibility"])}</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-gray-700">Family Status</td>
                              <td className="px-4 py-3 text-gray-900">{displayValue(formatEnumLabel(detailsQuery.data.formData?.familyStatus))}</td>
                              <td className="px-4 py-3 text-green-600 font-semibold">{getCriterionScore(detailsQuery.data.scoreBreakdown, ["Family Status"])}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* ADDITIONAL INFORMATION */}
                    <div className="w-full">
                      <h5 className="text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        Additional Information
                      </h5>

                      <div className="bg-gray-50 rounded-lg overflow-hidden w-full">
                        <table className="w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 w-1/3">Information Type</th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 w-1/3">Information</th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 w-1/3">Points</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="px-4 py-3 font-medium text-gray-700">Spouse Name</td>
                              <td className="px-4 py-3 text-gray-900">{displayValue(detailsQuery.data.formData?.spouseName)}</td>
                              <td className="px-4 py-3 text-gray-600">-</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-gray-700">Spouse Staff ID</td>
                              <td className="px-4 py-3 text-gray-900">{displayValue(detailsQuery.data.formData?.spouseStaffId)}</td>
                              <td className="px-4 py-3 text-gray-600">-</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-gray-700">Number of Dependents</td>
                              <td className="px-4 py-3 text-gray-900">{displayValue(detailsQuery.data.formData?.numberOfDependents)}</td>
                              <td className="px-4 py-3 text-gray-600">-</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-gray-700">Female</td>
                              <td className="px-4 py-3 text-gray-900">{displayValue(detailsQuery.data.formData?.isFemale)}</td>
                              <td className="px-4 py-3 text-gray-600">{getCriterionScore(detailsQuery.data.scoreBreakdown, ["Female Bonus"])}</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-gray-700">Disabled</td>
                              <td className="px-4 py-3 text-gray-900">{displayValue(detailsQuery.data.formData?.isDisabled)}</td>
                              <td className="px-4 py-3 text-gray-600">{getCriterionScore(detailsQuery.data.scoreBreakdown, ["Disability Bonus"])}</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-gray-700">Has Chronic Illness</td>
                              <td className="px-4 py-3 text-gray-900">{displayValue(detailsQuery.data.formData?.hasChronicIllness)}</td>
                              <td className="px-4 py-3 text-gray-600">{getCriterionScore(detailsQuery.data.scoreBreakdown, ["Chronic Illness Bonus"])}</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-gray-700">Spouse at UOG</td>
                              <td className="px-4 py-3 text-gray-900">{displayValue(detailsQuery.data.formData?.hasSpouseAtUog)}</td>
                              <td className="px-4 py-3 text-gray-600">{getCriterionScore(detailsQuery.data.scoreBreakdown, ["Spouse Bonus"])}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* SCORE INFORMATION */}
                    <div className="w-full">
                      <h5 className="text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <Award className="w-4 h-4 text-gray-600" />
                        Score Breakdown
                      </h5>

                      <div className="bg-blue-50 rounded-lg overflow-hidden w-full border border-blue-200">
                        <table className="w-full">
                          <thead className="bg-blue-100">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-blue-700 w-1/2">Score Type</th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-blue-700 w-1/2">Points</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-blue-200">
                            <tr>
                              <td className="px-4 py-3 font-medium text-blue-900">Base Score</td>
                              <td className="px-4 py-3 text-xl font-bold text-blue-900">{detailsQuery.data.scoreBaseTotal ?? 0}</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 font-medium text-blue-900">Bonus Score</td>
                              <td className="px-4 py-3 text-xl font-bold text-green-600">+{detailsQuery.data.scoreBonusTotal ?? 0}</td>
                            </tr>
                            <tr className="bg-blue-100">
                              <td className="px-4 py-3 font-bold text-blue-900">Final Score</td>
                              <td className="px-4 py-3 text-2xl font-bold text-blue-900">{detailsQuery.data.scoreFinal ?? 0}/100</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
                  Documents
                </h4>
                {detailsQuery.data.documents.filter((doc: {originalFileName: string}) => doc.originalFileName !== "111download111.jpg").length === 0 ? (
                  <p className="mt-2 text-sm text-muted">No uploaded documents.</p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {detailsQuery.data.documents
                      .filter((doc: {originalFileName: string}) => doc.originalFileName !== "111download111.jpg")
                      .map((document: {id: string; originalFileName: string; purpose: string; mimeType: string}) => (
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
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() =>
                                downloadMutation.mutate({
                                  documentId: document.id,
                                  fileName: document.originalFileName,
                                })
                              }
                            >
                              Open
                            </Button>
                            <Button
                              size="sm"
                              variant="primary"
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
              disabled={!selectedRoundId || !canRunRanking}
            >
              Generate by Score
            </Button>
            <Button
              size="sm"
              onClick={() => preliminaryMutation.mutate(selectedRoundId)}
              busy={preliminaryMutation.isPending}
              disabled={!selectedRoundId || !canRunRanking}
            >
              Send Preliminary
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => finalMutation.mutate(selectedRoundId)}
              busy={finalMutation.isPending}
              disabled={!selectedRoundId || !canRunRanking}
            >
              Submit Final Rank
            </Button>
          </div>

          {selectedRound && !canRunRanking && (
            <div className="mt-2 text-sm text-[var(--color-danger)]">
              Round must be in OPEN status to perform ranking operations.
            </div>
          )}
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
                    <td className="px-4 py-4 text-sm text-[var(--color-primary)]">
                      {entry.rankPosition}
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
