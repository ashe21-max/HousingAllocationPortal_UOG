"use client";

import { ClipboardCheck, LifeBuoy, MessageSquareWarning, Scale, Settings, Trophy } from "lucide-react";

import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function CommitteeDashboardPage() {
  return (
    <DashboardGate role="COMMITTEE">
      <DashboardShell
        title="Committee Dashboard"
        description="Review housing applications, manage scoring, and oversee allocation decisions."
        authStyleMainBackdrop
      >
        <DashboardOverview
          eyebrow="Committee Overview"
          intro="Use this area to review lecturer applications, evaluate evidence, participate in ranking decisions, and respond to complaint threads with a consistent review process."
          metrics={[
            {
              label: "Primary Duty",
              value: "Review",
              hint: "Examine applications and supporting evidence carefully.",
            },
            {
              label: "Decision Flow",
              value: "Rank + Respond",
              hint: "Score applications and address complaints in one workspace.",
            },
            {
              label: "Work Areas",
              value: "4 Sections",
              hint: "Review, complaints, settings, and support are available here.",
            },
          ]}
          actions={[
            {
              title: "Review Workspace",
              description: "Open the main review area for scoring and ranking lecturer applications.",
              href: "/dashboard/committee/review",
              icon: ClipboardCheck,
            },
            {
              title: "Complaints",
              description: "Respond to complaint threads and document committee feedback.",
              href: "/dashboard/committee/complaints",
              icon: MessageSquareWarning,
            },
            {
              title: "Settings",
              description: "Manage your committee account preferences and dashboard behavior.",
              href: "/dashboard/committee/settings",
              icon: Settings,
            },
            {
              title: "Support",
              description: "Open the support page for technical or process-related help.",
              href: "/dashboard/committee/support",
              icon: LifeBuoy,
            },
            {
              title: "Decision Integrity",
              description: "Use a consistent process so rankings remain fair and auditable.",
              href: "/dashboard/committee",
              icon: Scale,
            },
            {
              title: "Ranking Outcomes",
              description: "Focus the review workflow on accurate and defensible results.",
              href: "/dashboard/committee/review",
              icon: Trophy,
            },
          ]}
        />
      </DashboardShell>
    </DashboardGate>
  );
}
