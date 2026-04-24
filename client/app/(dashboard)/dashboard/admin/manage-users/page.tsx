import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AdminUserManagementPanel } from "@/features/admin/components/admin-user-management-panel";

export default function AdminManageUsersPage() {
  return (
    <DashboardGate role="ADMIN">
      <DashboardShell
        title="Manage Users"
        description="Search, filter, edit, and activate/deactivate user accounts."
      >
        <AdminUserManagementPanel />
      </DashboardShell>
    </DashboardGate>
  );
}
