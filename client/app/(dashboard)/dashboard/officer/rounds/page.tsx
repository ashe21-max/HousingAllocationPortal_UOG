import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { OfficerRoundManagementPanel } from "@/features/officer/components/officer-round-management-panel";

export default function OfficerRoundsPage() {
  return (
    <DashboardGate role="OFFICER">
      <DashboardShell
        title="Manage Application Rounds"
        description="Create housing application rounds and control when lecturers can apply."
      >
        <OfficerRoundManagementPanel />
      </DashboardShell>
    </DashboardGate>
  );
}
