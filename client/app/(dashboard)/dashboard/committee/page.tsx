"use client";

import { useState } from "react";
import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CommitteeDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardGate role="COMMITTEE">
      <DashboardShell
        title="Committee Dashboard"
        description="Review housing applications, manage scoring, and oversee allocation decisions." children={undefined}      >
        
      </DashboardShell>
    </DashboardGate>
  );
}