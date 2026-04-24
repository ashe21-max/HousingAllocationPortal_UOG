"use client";

import { useState } from "react";
import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardGate role="ADMIN">
      <DashboardShell
        title="Admin Dashboard"
        description="Complete control over system administration, security, monitoring, and user management." children={undefined}      >
        
        
      </DashboardShell>
    </DashboardGate>
  );
}
