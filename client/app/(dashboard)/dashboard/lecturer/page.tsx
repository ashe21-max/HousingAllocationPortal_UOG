"use client";

import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";


export default function LecturerDashboardPage() {
  return (
    <DashboardGate role="LECTURER">
      <DashboardShell
        title="Lecturer Dashboard"
        description="Manage your housing applications and documents" children={undefined}      >
        
      </DashboardShell>
    </DashboardGate>
  );
}
