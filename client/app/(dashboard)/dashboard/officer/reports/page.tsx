import { DashboardGate } from "@/components/dashboard/dashboard-gate";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";

import { OfficerReportsPanel } from "@/features/officer/components/officer-reports-panel";



export default function OfficerReportsPage() {

  return (

    <DashboardGate role="OFFICER">

      <DashboardShell

        title="Generate Report"

        description="View and manage allocation reports by round"

      >

        <OfficerReportsPanel />

      </DashboardShell>

    </DashboardGate>

  );

}
