"use client";

import type { ScoreBreakdownLine } from "@/lib/api/scoring";
import { fmt } from "@/utils/scoring";

type ApplicationSummaryTableProps = {
  rows: ScoreBreakdownLine[];
};

export function ApplicationSummaryTable({ rows }: ApplicationSummaryTableProps) {
  return (
    <div className="overflow-x-auto border border-[var(--border)] bg-white">
      <table className="w-full min-w-[520px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--surface-muted)] font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            <th className="px-4 py-3 font-semibold">Criteria</th>
            <th className="px-4 py-3 font-semibold">Weight</th>
            <th className="px-4 py-3 font-semibold">Your points</th>
            <th className="px-4 py-3 font-semibold">Score</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isFinal = row.criteria === "FINAL SCORE";
            const isBaseTotal = row.criteria === "Base Total";
            return (
              <tr
                key={`${row.criteria}-${i}`}
                className={`border-b border-[var(--border)] last:border-b-0 ${
                  isFinal
                    ? "bg-[var(--color-accent-soft)] font-semibold text-[var(--color-primary)]"
                    : isBaseTotal
                      ? "bg-[var(--surface-muted)]/60"
                      : ""
                }`}
              >
                <td className="px-4 py-2.5 text-[var(--color-primary)]">{row.criteria}</td>
                <td className="px-4 py-2.5 text-muted">{row.weightLabel || "—"}</td>
                <td className="px-4 py-2.5 tabular-nums text-muted">{fmt(row.yourPoints)}</td>
                <td className="px-4 py-2.5 tabular-nums text-[var(--color-primary)]">
                  {fmt(row.score)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
