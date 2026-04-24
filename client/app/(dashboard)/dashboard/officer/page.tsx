"use client";

import { useState } from "react";
import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OfficerDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardGate role="OFFICER">
      <DashboardShell
        title="Housing Officer Dashboard"
        description="Manage housing allocations, units, and maintenance requests." children={undefined}      >
        
      </DashboardShell>
    </DashboardGate>
  );
}
