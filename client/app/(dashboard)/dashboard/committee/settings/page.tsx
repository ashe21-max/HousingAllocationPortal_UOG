import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SettingsPanel } from "@/features/settings/components/settings-panel";

export default function CommitteeSettingsPage() {
  return (
    <DashboardGate role="COMMITTEE">
      <DashboardShell
        title="Settings"
        description="Manage your account settings and preferences"
      >
        <SettingsPanel />
      </DashboardShell>
    </DashboardGate>
  );
}
