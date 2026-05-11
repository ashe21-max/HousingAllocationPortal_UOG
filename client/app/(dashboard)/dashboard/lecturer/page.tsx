"use client";

import {
  ClipboardList,
  FileText,
  LifeBuoy,
  MessageSquareWarning,
  Settings,
  Trophy,
} from "lucide-react";

import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LecturerAnnouncementsPanel } from "@/features/applications/components/lecturer-announcements-panel";

export default function LecturerDashboardPage() {
  return (
    <DashboardGate role="LECTURER">
      <DashboardShell
        title="Lecturer Dashboard"
        description="Manage your housing applications and documents"
        authStyleMainBackdrop
      >
        <LecturerAnnouncementsPanel />
        <DashboardOverview
          eyebrow="Lecturer Overview"
          intro="Use this dashboard to submit a housing application, review the exact data you saved, monitor your results, and raise complaints or support requests when needed."
          metrics={[
            {
              label: "Primary Goal",
              value: "Apply",
              hint: "Create and track your housing request.",
            },
            {
              label: "Status Flow",
              value: "4 Stages",
              hint: "Draft, submit, review, and results.",
            },
            {
              label: "Support Access",
              value: "Always On",
              hint: "Settings, complaints, and support are one click away.",
            },
          ]}
          actions={[
            {
              title: "New Application",
              description: "Fill in the lecturer application form and calculate your score before submission.",
              href: "/dashboard/lecturer/application",
              icon: ClipboardList,
            },
            {
              title: "My Applications",
              description: "Review saved applications, open complete form details, and submit drafts.",
              href: "/dashboard/lecturer/my-applications",
              icon: FileText,
            },
            {
              title: "Results",
              description: "Check application ranking and allocation outcomes for your department.",
              href: "/dashboard/lecturer/results",
              icon: Trophy,
            },
            {
              title: "Complaints",
              description: "File and track complaints related to review, ranking, or allocation.",
              href: "/dashboard/lecturer/complaints",
              icon: MessageSquareWarning,
            },
            {
              title: "Settings",
              description: "Update account preferences and manage your dashboard behavior.",
              href: "/dashboard/lecturer/settings",
              icon: Settings,
            },
            {
              title: "Support",
              description: "Open the support area when you need operational or technical help.",
              href: "/dashboard/lecturer/support",
              icon: LifeBuoy,
            },
          ]}
        />
      </DashboardShell>
    </DashboardGate>
  );
}
