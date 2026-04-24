import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SupportPanel } from "@/features/support/components/support-panel";

export default function CommitteeSupportPage() {
  return (
    <DashboardGate role="COMMITTEE">
      <DashboardShell
        title="Support"
        description="Get help with housing applications, technical issues, and more"
      >
        <SupportPanel />
      </DashboardShell>
    </DashboardGate>
  );
}
