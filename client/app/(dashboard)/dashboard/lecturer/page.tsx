"use client";

import { useState } from "react";
import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LecturerAnnouncementsPanel } from "@/features/applications/components/lecturer-announcements-panel";

export default function LecturerDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardGate role="LECTURER">
      <DashboardShell
        title="Lecturer Dashboard"
        description="Manage your housing applications and documents"
        authStyleMainBackdrop
      >
        <LecturerAnnouncementsPanel />

        <p className="text-white/85 mb-8">
          Welcome to your housing dashboard. Manage your applications and stay updated.
        </p>

        {/* Lecturer Core Functions */}
        <div className="core-functions">
          <div>📊 Overview →</div>
          <div>📝 New Application →</div>
          <div>📂 My Applications →</div>
          <div>📈 View Results →</div>
          <div>⚠️ File Complaint →</div>
          <div>⚙️ Settings →</div>
          <div>💬 Support</div>
        </div>

        <style jsx global>{`
          .core-functions {
            margin-top: 40px;
            padding: 32px;
            border-radius: 24px;
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.05) 0%,
              rgba(255, 255, 255, 0.02) 100%
            );
            border: 1px solid rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(16px) brightness(1.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            animation: fadeInUp 0.6s ease-out;
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .core-functions div {
            padding: 16px 20px;
            margin: 12px 0;
            border-radius: 14px;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            cursor: pointer;
            font-weight: 500;
            font-size: 1rem;
            letter-spacing: 0.3px;
            border: 1px solid transparent;
            color: white;
          }

          .core-functions div:hover {
            background: linear-gradient(
              135deg,
              rgba(59, 130, 246, 0.15),
              rgba(34, 197, 94, 0.15)
            );
            transform: translateX(12px) scale(1.02);
            border: 1px solid rgba(59, 130, 246, 0.3);
            box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
            color: var(--color-blue);
          }
        `}</style>
      </DashboardShell>
    </DashboardGate>
  );
}