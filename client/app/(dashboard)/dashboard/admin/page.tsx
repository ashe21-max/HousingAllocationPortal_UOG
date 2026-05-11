"use client";

import { Database, LifeBuoy, Settings, ShieldCheck, UserPlus, Users } from "lucide-react";

import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function AdminDashboardPage() {
  return (
    <DashboardGate role="ADMIN">
      <DashboardShell
        title="Admin Dashboard"
        description="Complete control over system administration, security, monitoring, and user management."
        authStyleMainBackdrop
      >
        <DashboardOverview
          eyebrow="Administration Overview"
          intro="Use the admin dashboard to control user accounts, enforce access rules, manage backups, and maintain the overall health of the housing allocation platform."
          metrics={[
            {
              label: "Control Scope",
              value: "Full",
              hint: "User, backup, and settings management are centralized here.",
            },
            {
              label: "Core Focus",
              value: "Security",
              hint: "Keep the platform stable, recoverable, and role-correct.",
            },
            {
              label: "Access Areas",
              value: "5 Sections",
              hint: "Administration tasks are grouped into dedicated pages.",
            },
          ]}
          actions={[
            {
              title: "Create User",
              description: "Create lecturer, officer, committee, or admin accounts.",
              href: "/dashboard/admin/create-user",
              icon: UserPlus,
            },
            {
              title: "Manage Users",
              description: "Review and manage existing accounts and their roles.",
              href: "/dashboard/admin/manage-users",
              icon: Users,
            },
            {
              title: "Backups",
              description: "Create and manage system backups for recovery and auditing.",
              href: "/dashboard/admin/backup",
              icon: Database,
            },
            {
              title: "Settings",
              description: "Configure system-wide settings and account behavior.",
              href: "/dashboard/admin/settings",
              icon: Settings,
            },
            {
              title: "Support",
              description: "Open the support area when operational help is required.",
              href: "/dashboard/admin/support",
              icon: LifeBuoy,
            },
            {
              title: "Security Posture",
              description: "Use the dashboard sections to keep permissions and data handling aligned.",
              href: "/dashboard/admin",
              icon: ShieldCheck,
            },
          ]}
        />
      </DashboardShell>
    </DashboardGate>
  );
}
