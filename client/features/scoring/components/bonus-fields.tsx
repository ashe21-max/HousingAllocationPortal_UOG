"use client";

import { Info } from "lucide-react";
import { UseFormRegister } from "react-hook-form";
import { LecturerCriteriaFormValues } from "@/schemas/scoring";

interface BonusFieldsProps {
  register: UseFormRegister<LecturerCriteriaFormValues>;
  disabled?: boolean;
}

export function BonusFields({ register, disabled }: BonusFieldsProps) {
  return (
    <fieldset
      disabled={disabled}
      className="mt-10 space-y-4 border border-[var(--border)] bg-[var(--surface-muted)]/30 p-6 transition-all hover:bg-[var(--surface-muted)]/50"
    >
      <legend className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted flex items-center gap-2">
        <Info className="h-3 w-3" />
        Bonus eligibility (self-declared)
      </legend>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <BonusRow
          label="Female (+5%)"
          {...register("femaleBonusEligible")}
        />
        <BonusRow
          label="Disability (+5%)"
          {...register("disabilityBonusEligible")}
        />
        <BonusRow
          label="Medical / Illness (+3%)"
          {...register("hivIllnessBonusEligible")}
        />
        <BonusRow
          label="Spouse bonus (+5%)"
          {...register("spouseBonusEligible")}
        />
      </div>
    </fieldset>
  );
}

function BonusRow({
  label,
  ...props
}: {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 p-4 border border-[var(--border)] bg-white hover:border-[var(--color-accent)] hover:bg-[var(--surface-muted)]/30 transition-all group/bonus">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          className="h-5 w-5 rounded-none border-[var(--border)] accent-[var(--color-accent)] ring-offset-[var(--background)] focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 transition-all cursor-pointer"
          {...props}
        />
        <span className="text-xs font-bold font-mono uppercase tracking-tight text-[var(--color-primary)]">
          {label}
        </span>
      </div>
      <div className="opacity-0 group-hover/bonus:opacity-100 transition-opacity">
        <Info className="h-3 w-3 text-muted" />
      </div>
    </label>
  );
}
