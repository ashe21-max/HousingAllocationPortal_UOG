"use client";

import {
  BarChart3,
  Building2,
  Clock3,
  LifeBuoy,
  Megaphone,
  PlayCircle,
  Settings,
} from "lucide-react";

import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function OfficerDashboardPage() {
  return (
    <DashboardGate role="OFFICER">
      <DashboardShell
        title="Housing Officer Dashboard"
        description="Manage housing allocations, units, and maintenance requests."
        authStyleMainBackdrop
      >
        <DashboardOverview
          eyebrow="Officer Overview"
          intro="Use the housing officer dashboard to control rounds, allocate available units, manage housing inventory, publish announcements, and generate reports from the active allocation process."
          metrics={[
            {
              label: "Main Responsibility",
              value: "Allocate",
              hint: "Coordinate rounds, inventory, and final unit assignment.",
            },
            {
              label: "Operations",
              value: "5 Areas",
              hint: "Rounds, allocation, reports, announcements, and housing units.",
            },
            {
              label: "Execution Style",
              value: "Workflow",
              hint: "Move from round setup to publication in a controlled sequence.",
            },
          ]}
          actions={[
            {
              title: "Manage Rounds",
              description: "Create and update the allocation rounds that drive lecturer applications.",
              href: "/dashboard/officer/rounds",
              icon: Clock3,
            },
            {
              title: "Run Allocation",
              description: "Open the allocation workspace and process the current ranking results.",
              href: "/dashboard/officer/allocation",
              icon: PlayCircle,
            },
            {
              title: "Reports",
              description: "Generate and inspect housing and allocation reports.",
              href: "/dashboard/officer/reports",
              icon: BarChart3,
            },
            {
              title: "Announcements",
              description: "Publish notices and updates for applicants and other users.",
              href: "/dashboard/officer/announcements",
              icon: Megaphone,
            },
            {
              title: "Manage Housing",
              description: "Maintain housing unit records, conditions, and availability.",
              href: "/dashboard/officer/housing",
              icon: Building2,
            },
            {
              title: "Support",
              description: "Open the officer support page for technical or process help.",
              href: "/dashboard/officer/support",
              icon: LifeBuoy,
            },
            {
              title: "Settings",
              description: "Adjust officer dashboard preferences and operational defaults.",
              href: "/dashboard/officer/settings",
              icon: Settings,
            },
          ]}
        />
      </DashboardShell>
    </DashboardGate>
  );
}
