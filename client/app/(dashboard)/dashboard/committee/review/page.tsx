import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { CommitteeReviewWorkspace } from "@/features/committee/components/committee-review-workspace";

export default function CommitteeReviewPage() {
  return (
    <DashboardGate role="COMMITTEE">
      <DashboardShell
        title="Review Applications"
        description="Review submitted applications, inspect documents, and rank applicants."
      >
        <CommitteeReviewWorkspace />
      </DashboardShell>
    </DashboardGate>
  );
}
