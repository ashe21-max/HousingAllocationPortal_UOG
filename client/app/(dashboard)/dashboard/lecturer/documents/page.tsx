import { DashboardGate } from "@/components/dashboard/dashboard-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { UploadDocumentsPanel } from "@/features/documents/components/upload-documents-panel";

export default function LecturerDocumentsPage() {
  return (
    <DashboardGate role="LECTURER">
      <DashboardShell
        title="Upload Documents"
        description="Upload and manage supporting evidence for your housing application."
      >
        <UploadDocumentsPanel />
      </DashboardShell>
    </DashboardGate>
  );
}
