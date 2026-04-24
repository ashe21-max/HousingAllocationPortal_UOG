"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyDepartmentResults } from "@/lib/api/applications";

export function DepartmentResultsPanel() {
  const resultsQuery = useQuery({
    queryKey: ["lecturer-department-results"],
    queryFn: getMyDepartmentResults,
  });

  if (resultsQuery.isLoading) {
    return <section className="panel p-8 text-sm text-muted">Loading department results...</section>;
  }

  if (resultsQuery.isError) {
    return (
      <section className="panel p-8 text-sm text-[var(--color-danger)]">
        Could not load department results.
      </section>
    );
  }

  const rows = resultsQuery.data ?? [];

  return (
    <section className="panel overflow-hidden">
      <div className="p-6 md:p-8 border-b border-[var(--border)]">
        <h2 className="text-lg font-bold uppercase tracking-tight text-[var(--color-primary)]">
          Department Allocation Results
        </h2>
        <p className="mt-2 text-sm text-muted">
          This table shows all allocation results for lecturers in your department.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="p-8 text-sm text-muted">
          No allocation results found for your department.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--surface-muted)] border-b border-[var(--border)]">
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                  Lecturer
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                  Department
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                  Round
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                  House
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
              {rows.map((row) => (
                <tr key={row.allocationResultId}>
                  <td className="px-4 py-4 text-sm text-[var(--color-primary)]">
                    {row.lecturerName ?? row.lecturerUserId ?? "-"}
                  </td>
                  <td className="px-4 py-4 text-sm text-muted">
                    {row.lecturerDepartment ?? "-"}
                  </td>
                  <td className="px-4 py-4 text-sm text-muted">
                    {row.roundName ?? row.roundId}
                  </td>
                  <td className="px-4 py-4 text-sm text-muted">
                    {row.housingBuildingName ?? "-"} / Block {row.housingBlockNumber ?? "-"} /
                    Room {row.housingRoomNumber ?? "-"}
                  </td>
                  <td className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                    {row.allocationStatus}
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
    </section>
  );
}
