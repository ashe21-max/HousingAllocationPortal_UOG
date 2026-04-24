import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DepartmentResultsPanel } from "@/features/applications/components/department-results-panel";

export default function LecturerResultsPage() {
  return (
    <DashboardGate role="LECTURER">
      <DashboardShell
        title="Allocation Results"
        description="View allocation results for all lecturers in your department."
      >
        <DepartmentResultsPanel />
      </DashboardShell>
    </DashboardGate>
  );
}
