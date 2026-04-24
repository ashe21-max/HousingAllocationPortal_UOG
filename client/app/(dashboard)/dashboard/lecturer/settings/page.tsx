import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SettingsPanel } from "@/features/settings/components/settings-panel";

export default function LecturerSettingsPage() {
  return (
    <DashboardGate role="LECTURER">
      <DashboardShell
        title="Settings"
        description="Manage your account settings and preferences"
      >
        <SettingsPanel />
      </DashboardShell>
    </DashboardGate>
  );
}
