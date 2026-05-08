import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { NewApplicationPanel } from "@/features/applications/components/new-application-panel";
import { LecturerAnnouncementsPanel } from "@/features/applications/components/lecturer-announcements-panel";

export default function LecturerApplicationPage() {
  return (
    <DashboardGate role="LECTURER">
      <DashboardShell
        title="Housing Application"
        description="Prepare your score, create a draft application, and submit when the round is open."
      >
        <LecturerAnnouncementsPanel />
        <NewApplicationPanel />
      </DashboardShell>
    </DashboardGate>
  );
}
