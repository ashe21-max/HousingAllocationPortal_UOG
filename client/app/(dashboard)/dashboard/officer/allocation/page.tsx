import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { OfficerAllocationPanel } from "@/features/officer/components/officer-allocation-panel";

export default function OfficerAllocationPage() {
  return (
    <DashboardGate role="OFFICER">
      <DashboardShell
        title="Run Allocation"
        description="Run housing allocation from final committee rankings and review results."
      >
        <OfficerAllocationPanel />
      </DashboardShell>
    </DashboardGate>
  );
}
