import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SettingsPanel } from "@/features/settings/components/settings-panel";

export default function AdminSettingsPage() {
  return (
    <DashboardGate role="ADMIN">
      <DashboardShell
        title="Settings"
        description="Manage your account settings and preferences"
      >
        <SettingsPanel />
      </DashboardShell>
    </DashboardGate>
  );
}
