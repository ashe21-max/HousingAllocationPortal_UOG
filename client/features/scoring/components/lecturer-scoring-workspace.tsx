"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ApplicationSummaryTable } from "@/features/scoring/components/application-summary-table";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/client";
import {
  getScoreMe,
  previewScoreCriteria,
  saveScoreCriteria,
  type PreviewScoreResponse,
} from "@/lib/api/scoring";
import { lecturerCriteriaSchema, type LecturerCriteriaFormValues } from "@/schemas/scoring";

import { WorkspaceHeader } from "./workspace-header";
import { ScoringForm } from "./scoring-form";

export function LecturerScoringWorkspace() {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewScoreResponse | null>(null);

  const { data: me, isLoading: loadingMe, isError: loadError } = useQuery({
    queryKey: ["scoring-me"],
    queryFn: getScoreMe,
  });

  const form = useForm<LecturerCriteriaFormValues>({
    resolver: zodResolver(lecturerCriteriaSchema),
    defaultValues: {
      educationalTitle: "",
      educationalLevel: "",
      serviceYears: 0,
      responsibility: "",
      familyStatus: "",
      femaleBonusEligible: false,
      disabilityBonusEligible: false,
      hivIllnessBonusEligible: false,
      spouseBonusEligible: false,
    },
  });

  useEffect(() => {
    if (me?.criteria) {
      form.reset({
        educationalTitle: me.criteria.educationalTitle,
        educationalLevel: me.criteria.educationalLevel,
        serviceYears: me.criteria.serviceYears,
        responsibility: me.criteria.responsibility,
        familyStatus: me.criteria.familyStatus,
        femaleBonusEligible: me.criteria.femaleBonusEligible,
        disabilityBonusEligible: me.criteria.disabilityBonusEligible,
        hivIllnessBonusEligible: me.criteria.hivIllnessBonusEligible,
        spouseBonusEligible: me.criteria.spouseBonusEligible,
      });
      setEditMode(false);
    } else {
      setEditMode(true);
    }

    if (me?.latestSnapshot) {
      const uncapped = me.latestSnapshot.baseTotal + me.latestSnapshot.bonusTotal;
      setPreviewData({
        breakdown: me.latestSnapshot.breakdown,
        baseTotal: me.latestSnapshot.baseTotal,
        bonusTotal: me.latestSnapshot.bonusTotal,
        finalScoreUncapped: uncapped,
        finalScore: me.latestSnapshot.finalScore,
      });
    }
  }, [me, form]);

  const previewMutation = useMutation({
    mutationFn: (values: LecturerCriteriaFormValues) => previewScoreCriteria(values),
    onSuccess: (data) => {
      setPreviewData(data);
      toast.success("Score preview updated.");
    },
    onError: (e) => {
      const message = e instanceof ApiError ? e.message : "Preview failed.";
      toast.error(message);
    },
  });

  const saveMutation = useMutation({
    mutationFn: (values: LecturerCriteriaFormValues) => saveScoreCriteria(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scoring-me"] });
      toast.success("Current draft saved successfully.");
      setEditMode(false);
    },
    onError: (e) => {
      const message = e instanceof ApiError ? e.message : "Save failed.";
      toast.error(message);
    },
  });

  const handleClear = () => {
    form.reset({
      educationalTitle: "",
      educationalLevel: "",
      serviceYears: 0,
      responsibility: "",
      familyStatus: "",
      femaleBonusEligible: false,
      disabilityBonusEligible: false,
      hivIllnessBonusEligible: false,
      spouseBonusEligible: false,
    });
    setPreviewData(null);
    setEditMode(true);
    toast.info("Form cleared.");
  };

  if (loadingMe) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--color-accent)]" />
        <p className="text-sm font-mono text-muted uppercase tracking-widest animate-pulse">Synchronizing workspace...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="panel p-12 text-center space-y-4 border-[var(--color-danger)]/20 bg-red-50/10">
        <AlertCircle className="h-12 w-12 text-[var(--color-danger)] mx-auto" />
        <p className="text-sm text-muted">Could not load your scoring profile.</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["scoring-me"] })}>Retry Connection</Button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <section className="panel p-6 md:p-8">
        <WorkspaceHeader 
          isDraft={!me?.criteria}
          title="Scoring Criteria"
          description="Enter your details, preview how they translate into points, then save a draft."
        />
        <ScoringForm 
          form={form}
          editMode={editMode}
          onEdit={() => setEditMode(true)}
          onCancel={() => setEditMode(false)}
          onPreview={(v) => previewMutation.mutate(v)}
          onSave={(v) => saveMutation.mutate(v)}
          onReset={handleClear}
          isSaving={saveMutation.isPending}
          isPreviewing={previewMutation.isPending}
          hasExistingCriteria={!!me?.criteria}
        />
      </section>

      <section className="panel overflow-hidden transition-all duration-300">
        <div className="p-6 md:p-8">
            <div className="mb-6 flex flex-col gap-1 border-b border-[var(--border)] pb-6">
              <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[var(--color-primary)] uppercase tracking-tight">
                    Application Summary
                  </h2>
                  {previewData && (
                      <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 border border-emerald-100 uppercase">
                          <CheckCircle2 className="h-3 w-3" /> Live Calculation Ready
                      </div>
                  )}
              </div>
              <p className="text-sm text-muted mt-2">
                Real-time breakdown of your housing points based on university policies.
              </p>
            </div>
            
            <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                {previewData ? (
                  <ApplicationSummaryTable rows={previewData.breakdown} />
                ) : (
                  <p className="rounded-none border border-dashed border-[var(--border)] bg-white/50 px-4 py-16 text-center text-sm text-muted">
                    No active calculation found. Update your criteria and click Preview Score.
                  </p>
                )}
            </div>
        </div>
      </section>
    </div>
  );
}
