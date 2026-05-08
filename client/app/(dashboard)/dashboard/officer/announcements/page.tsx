import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { OfficerAnnouncementsPanel } from "@/features/officer/components/officer-announcements-panel";

export default function OfficerAnnouncementsPage() {
  return (
    <DashboardGate role="OFFICER">
      <DashboardShell
        title="Announcements"
        description="Create, edit, and manage announcements for system users and lecturers."
      >
        <OfficerAnnouncementsPanel />
      </DashboardShell>
    </DashboardGate>
  );
}
