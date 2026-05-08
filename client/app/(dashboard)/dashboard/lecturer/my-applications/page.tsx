import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { MyApplicationsPanel } from "@/features/applications/components/my-applications-panel";
import { LecturerAnnouncementsPanel } from "@/features/applications/components/lecturer-announcements-panel";

export default function LecturerMyApplicationsPage() {
  return (
    <DashboardGate role="LECTURER">
      <DashboardShell
        title="My Applications"
        description="View your saved and submitted housing applications."
      >
        <LecturerAnnouncementsPanel />
        <MyApplicationsPanel />
      </DashboardShell>
    </DashboardGate>
  );
}