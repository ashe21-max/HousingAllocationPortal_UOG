import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { CommitteeComplaintsPanel } from "@/features/complaints/components/committee-complaints-panel";

export default function CommitteeComplaintsPage() {
  return (
    <DashboardGate role="COMMITTEE">
      <DashboardShell
        title="Respond to Complaints"
        description="Respond to complaint threads routed to your college."
      >
        <CommitteeComplaintsPanel />
      </DashboardShell>
    </DashboardGate>
  );
}
