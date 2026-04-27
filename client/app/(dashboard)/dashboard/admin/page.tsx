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
      >
        <div className="p-6 dashboard-bg">
          <p className="text-[var(--foreground-secondary)]">
            Admin dashboard content here.
          </p>

          <div className="core-functions">
            <div>📊 Overview →</div>
            <div>👤 Create User →</div>
            <div>👥 Manage Users →</div>
            <div>⚙️ Settings →</div>
            <div>💬 Support</div>
          </div>
        </div>
      </DashboardShell>

      <style jsx global>{`
        /* FULL PAGE BACKGROUND */
        body {
          background: linear-gradient(
            to bottom right,
            var(--surface),
            var(--surface-secondary),
            var(--surface-tertiary)
          );
          color: var(--foreground);
        }

        /* TARGET DashboardShell TITLE */
        h1 {
          font-weight: bold;
          font-size: 2rem;
          background: linear-gradient(
            to right,
            var(--color-blue),
            var(--color-green),
            var(--color-yellow)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: slideGlow 4s ease-in-out infinite;
        }

        /* Animation */
        @keyframes slideGlow {
          0% {
            transform: translateX(120px);
            opacity: 0;
          }
          40% {
            transform: translateX(0);
            opacity: 1;
          }
          60% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-120px);
            opacity: 0;
          }
        }

        /* CONTENT BACKGROUND */
        .dashboard-bg {
          position: relative;
          min-height: 100vh;
        }

        /* CORE FUNCTIONS */
        .core-functions {
          margin-top: 30px;
          padding: 20px;
          border-radius: 16px;
          background: linear-gradient(
            to bottom right,
            var(--surface),
            var(--surface-secondary)
          );
          border: 1px solid var(--border);
          backdrop-filter: blur(10px);
        }

        .core-functions div {
          padding: 10px 12px;
          margin: 6px 0;
          border-radius: 10px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .core-functions div:hover {
          background: rgba(0, 150, 255, 0.08);
          transform: translateX(8px);
          color: var(--color-blue);
        }

        /* GLOW EFFECTS FULL PAGE */
        body::before {
          content: "";
          position: fixed;
          top: 10%;
          left: 10%;
          width: 300px;
          height: 300px;
          background: var(--color-blue);
          opacity: 0.08;
          filter: blur(80px);
          border-radius: 50%;
          z-index: -1;
        }

        body::after {
          content: "";
          position: fixed;
          bottom: 10%;
          right: 10%;
          width: 250px;
          height: 250px;
          background: var(--color-green);
          opacity: 0.08;
          filter: blur(80px);
          border-radius: 50%;
          z-index: -1;
        }
      `}</style>
    </DashboardGate>
  );
}