"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { scoringStatusConfig } from "@/constants/scoring";

interface WorkspaceHeaderProps {
  isDraft: boolean;
  title: string;
  description: string;
}

export function WorkspaceHeader({ isDraft, title, description }: WorkspaceHeaderProps) {
  const status = isDraft ? scoringStatusConfig.DRAFT : scoringStatusConfig.ACTIVE;

  return (
    <div className="group overflow-visible relative">
      <div className="absolute -top-4 right-8 flex gap-2">
        <div
          className={`px-4 py-1.5 flex items-center gap-2 text-[10px] font-bold font-mono tracking-widest uppercase shadow-sm border ${status.className}`}
        >
          {isDraft ? <AlertCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
          {status.label}
        </div>
      </div>

      <div className="mb-10 flex flex-col gap-2 border-b border-[var(--border)] pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-primary)] uppercase tracking-tight">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted leading-relaxed">
            {description}
            <span className="text-[var(--color-accent)] font-medium ml-1">Live validation enabled.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
