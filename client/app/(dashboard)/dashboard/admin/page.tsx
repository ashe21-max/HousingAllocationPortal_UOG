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
        description="Complete control over system administration, security, monitoring, and user management."
        authStyleMainBackdrop
      >
        <p className="text-white/85 mb-8 max-w-2xl leading-relaxed">
          Welcome to the Administration Dashboard. Manage system users, create new accounts, handle system backups, configure settings, and monitor overall system health. Full administrative control to ensure smooth operations and security across the entire housing allocation platform.
        </p>

        <div className="core-functions">
          <div>📊 Overview →</div>
          <div>👤 Create User →</div>
          <div>👥 Manage Users →</div>
          <div>💾 Backup →</div>
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