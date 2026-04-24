import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AdminCreateUserForm } from "@/features/admin/components/admin-create-user-form";

export default function AdminCreateUserPage() {
  return (
    <DashboardGate role="ADMIN">
      <DashboardShell
        title="Create User"
        description="Create new users and assign role/department."
      >
        <AdminCreateUserForm />
      </DashboardShell>
    </DashboardGate>
  );
}
