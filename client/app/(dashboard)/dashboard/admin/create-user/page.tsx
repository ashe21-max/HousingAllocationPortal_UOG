import { DashboardGate } from "@/components/dashboard/dashboard-gate";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";

import { AdminCreateUserForm } from "@/features/admin/components/admin-create-user-form";
import { PendingSignupRequestsPanel } from "@/features/admin/components/pending-signup-requests-panel";



export default function AdminCreateUserPage() {

  return (

    <DashboardGate role="ADMIN">

      <DashboardShell

        title="Create User"

        description="Create new users and assign role/college."

      >

        <div className="grid gap-6">
          <PendingSignupRequestsPanel />
          <AdminCreateUserForm />
        </div>

      </DashboardShell>

    </DashboardGate>

  );

}

