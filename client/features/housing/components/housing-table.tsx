import type { HousingUnit } from "@/lib/api/housing";
import { ApiError } from "@/lib/api/client";
import { HousingConditionBadge } from "@/features/housing/components/housing-condition-badge";
import { HousingRowActions } from "@/features/housing/components/housing-row-actions";
import { HousingStatusBadge } from "@/features/housing/components/housing-status-badge";
import { HEADINGS }  from "@/constants/housing";
type HousingTableProps = {
  units: HousingUnit[];
  isLoading: boolean;
  error: Error | null;
  onView: (unit: HousingUnit) => void;
  onEdit: (unit: HousingUnit) => void;
  onDelete: (unit: HousingUnit) => void;
};

export function HousingTable({
  units,
  isLoading,
  error,
  onView,
  onEdit,
  onDelete,
}: HousingTableProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white border border-slate-200 rounded-2xl animate-pulse">
        <div className="h-8 w-8 border-4 border-slate-200 border-t-[var(--color-accent)] rounded-full animate-spin mb-4" />
        <span className="text-sm text-slate-500 font-medium tracking-tight">Loading housing units...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-sm text-red-600 bg-red-50 border border-red-100 rounded-2xl text-center">
        {error instanceof ApiError ? error.message : "Unable to load housing units."}
      </div>
    );
  }

  return (
    <div className="bg-white border border-[var(--border)] rounded-none overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--surface-muted)] border-b border-[var(--border)]">
              {HEADINGS.map((heading, index) => (
                <th
                  key={heading}
                  className={`px-6 py-5 text-[10px] font-bold uppercase tracking-[0.24em] text-muted ${index === HEADINGS.length - 1 ? 'text-right' : ''}`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {units.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-20 text-center font-mono text-xs uppercase tracking-widest text-muted">
                  No housing assets found.
                </td>
              </tr>
            ) : (
              units.map((unit) => (
                <tr 
                  key={unit.id} 
                  className="hover:bg-[var(--surface-muted)]/50 transition-colors"
                >
                  <td className="px-6 py-5">
                    <span className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-tight">
                      {unit.buildingName}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-mono text-muted">{unit.blockNumber}</td>
                  <td className="px-6 py-5 text-sm font-mono text-muted">{unit.roomNumber}</td>
                  <td className="px-6 py-5 text-sm text-muted uppercase tracking-tight">{unit.roomType}</td>
                  <td className="px-6 py-5">
                    <HousingConditionBadge condition={unit.condition} />
                  </td>
                  <td className="px-6 py-5">
                    <HousingStatusBadge status={unit.status} />
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-bold text-muted bg-[var(--surface-muted)] px-3 py-1.5 uppercase tracking-widest border border-[var(--border)]">
                      {unit.location}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <HousingRowActions
                      onView={() => onView(unit)}
                      onEdit={() => onEdit(unit)}
                      onDelete={() => onDelete(unit)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
