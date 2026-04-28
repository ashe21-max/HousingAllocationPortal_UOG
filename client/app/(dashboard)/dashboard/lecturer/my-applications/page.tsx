import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { MyApplicationsPanel } from "@/features/applications/components/my-applications-panel";

export default function LecturerMyApplicationsPage() {
  return (
    <DashboardGate role="LECTURER">
      <DashboardShell
        title="My Applications"
        description="View your saved and submitted housing applications."
      >
        <MyApplicationsPanel />
      </DashboardShell>
    </DashboardGate>
  );
}