import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SupportPanel } from "@/features/support/components/support-panel";

export default function AdminSupportPage() {
  return (
    <DashboardGate role="ADMIN">
      <DashboardShell
        title="Support"
        description="Get help with housing applications, technical issues, and more"
      >
        <SupportPanel role="ADMIN" />
      </DashboardShell>
    </DashboardGate>
  );
}
