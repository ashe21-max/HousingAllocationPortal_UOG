"use client";

import { UseFormReturn } from "react-hook-form";
import { Edit3, Eye, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input as CustomInput } from "@/components/ui/input";
import { LecturerCriteriaFormValues } from "@/schemas/scoring";
import { SCORING_FIELD_STYLES } from "@/constants/scoring";
import { BonusFields } from "./bonus-fields";

interface ScoringFormProps {
  form: UseFormReturn<LecturerCriteriaFormValues>;
  editMode: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onPreview: (values: LecturerCriteriaFormValues) => void;
  onSave: (values: LecturerCriteriaFormValues) => void;
  onReset: () => void;
  isSaving: boolean;
  isPreviewing: boolean;
  hasExistingCriteria: boolean;
}

export function ScoringForm({
  form,
  editMode,
  onEdit,
  onCancel,
  onPreview,
  onSave,
  onReset,
  isSaving,
  isPreviewing,
  hasExistingCriteria,
}: ScoringFormProps) {
  const { register, formState: { errors }, handleSubmit } = form;

  return (
    <form className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-2">
          <CustomInput
            label="Educational title"
            {...register("educationalTitle")}
            disabled={!editMode}
            placeholder="e.g. Associate Professor"
            error={errors.educationalTitle?.message}
          />
        </div>
        <div className="space-y-2">
          <CustomInput
            label="Educational level"
            {...register("educationalLevel")}
            disabled={!editMode}
            placeholder="e.g. PhD"
            error={errors.educationalLevel?.message}
          />
        </div>
        <div className="space-y-2">
          <CustomInput
            label="Years of service"
            type="number"
            {...register("serviceYears", { valueAsNumber: true })}
            disabled={!editMode}
            hint="Whole years (0–60)."
            error={errors.serviceYears?.message}
          />
        </div>
        <div className="hidden md:block" aria-hidden />

        <div className="md:col-span-2 group">
          <label className="flex w-full flex-col gap-2 text-[10px] font-bold uppercase tracking-widest text-muted group-focus-within:text-[var(--color-accent)] transition-colors">
            <span>Responsibility / administrative roles</span>
            <textarea
              className={`${SCORING_FIELD_STYLES.TEXTAREA} min-h-[120px] resize-y`}
              {...register("responsibility")}
              disabled={!editMode}
              placeholder="Describe relevant responsibilities"
              rows={4}
            />
            {errors.responsibility && (
              <span className="text-[10px] text-[var(--color-danger)] font-mono">{errors.responsibility.message}</span>
            )}
          </label>
        </div>

        <div className="md:col-span-2 group">
          <label className="flex w-full flex-col gap-2 text-[10px] font-bold uppercase tracking-widest text-muted group-focus-within:text-[var(--color-accent)] transition-colors">
            <span>Family status</span>
            <textarea
              className={`${SCORING_FIELD_STYLES.TEXTAREA} min-h-[100px] resize-y`}
              {...register("familyStatus")}
              disabled={!editMode}
              placeholder="As applicable for policy"
              rows={3}
            />
            {errors.familyStatus && (
              <span className="text-[10px] text-[var(--color-danger)] font-mono">{errors.familyStatus.message}</span>
            )}
          </label>
        </div>
      </div>

      <BonusFields register={register} disabled={!editMode} />

      <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-[var(--border)] pt-8">
        {!editMode ? (
          <Button
            type="button"
            variant="primary"
            className="gap-2 h-12 px-8 min-w-[140px]"
            onClick={onEdit}
          >
            <Edit3 className="h-4 w-4" /> Edit Profile
          </Button>
        ) : (
          <Button
            type="button"
            variant="secondary"
            className="gap-2 h-12 px-8 min-w-[140px]"
            onClick={onCancel}
            disabled={!hasExistingCriteria}
          >
            Cancel Changes
          </Button>
        )}

        <Button
          type="button"
          variant="ghost"
          className="gap-2 h-12 px-8 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"
          onClick={handleSubmit(onPreview)}
          busy={isPreviewing}
        >
          <Eye className="h-4 w-4" /> Preview Score
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="gap-2 h-12 px-8 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 border-none ml-auto"
          onClick={handleSubmit(onSave)}
          busy={isSaving}
          disabled={!editMode}
        >
          <Save className="h-4 w-4" /> Save as Draft
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="gap-2 h-12 px-6 text-muted hover:text-[var(--color-danger)] transition-colors ml-auto md:ml-0"
          onClick={onReset}
        >
          <Trash2 className="h-4 w-4" /> Reset
        </Button>
      </div>
    </form>
  );
}
