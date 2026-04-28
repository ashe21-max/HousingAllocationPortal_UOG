import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AdminBackupPanel } from "@/features/admin/components/admin-backup-panel";

export default function AdminBackupPage() {
  return (
    <DashboardGate role="ADMIN">
      <DashboardShell
        title="Database Backup"
        description="Manage database backups, schedule automatic backups, and monitor backup history."
      >
        <AdminBackupPanel />
      </DashboardShell>
    </DashboardGate>
  );
}
