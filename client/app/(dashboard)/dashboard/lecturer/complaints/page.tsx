import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LecturerComplaintsPanel } from "@/features/complaints/components/lecturer-complaints-panel";
import { LecturerAnnouncementsPanel } from "@/features/applications/components/lecturer-announcements-panel";

export default function LecturerComplaintsPage() {
  return (
    <DashboardGate role="LECTURER">
      <DashboardShell
        title="Complaints"
        description="Open a complaint thread and chat with the committee assigned to a selected college."
      >
        <LecturerAnnouncementsPanel />
        <LecturerComplaintsPanel />
      </DashboardShell>
    </DashboardGate>
  );
}
