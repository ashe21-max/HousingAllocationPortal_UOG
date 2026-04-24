import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { HousingManagementPanel } from "@/features/housing/components/housing-management-panel";

export default function OfficerHousingPage() {
  return (
    <DashboardGate role="OFFICER">
      <DashboardShell
        title="Manage Housing Units"
        description="Register, edit, and monitor all housing assets."
      >
        <HousingManagementPanel />
      </DashboardShell>
    </DashboardGate>
  );
}
