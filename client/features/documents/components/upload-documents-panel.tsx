"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ApiError } from "@/lib/api/client";
import { getApplicationFormOptions } from "@/lib/api/applications";
import {
  downloadMyDocument,
  getMyDocuments,
  uploadDocument,
  type DocumentPurpose,
} from "@/lib/api/documents";

type UploadSectionPurpose = Exclude<
  DocumentPurpose,
  "EDUCATIONAL_TITLE" | "EDUCATIONAL_LEVEL" | "SERVICE_YEARS"
>;

type UploadFormState = {
  applicationId: string;
  notes: string;
  file: File | null;
};

const uploadSections: Array<{
  purpose: UploadSectionPurpose;
  title: string;
  description: string;
}> = [
  {
    purpose: "RESPONSIBILITY",
    title: "Responsibility Proof",
    description: "Upload document for current university responsibility.",
  },
  {
    purpose: "FAMILY_STATUS",
    title: "Family Status Proof",
    description: "Upload spouse/children/dependent supporting document.",
  },
  {
    purpose: "DISABILITY_CERTIFICATION",
    title: "Disability Certification",
    description: "Upload certified disability medical document.",
  },
  {
    purpose: "HIV_ILLNESS_CERTIFICATION",
    title: "HIV/Illness Certification",
    description: "Upload certified chronic illness medical document.",
  },
  {
    purpose: "SPOUSE_PROOF",
    title: "Spouse Lecturer Proof",
    description: "Upload proof that spouse is also a UOG lecturer.",
  },
  {
    purpose: "OTHER",
    title: "Other Supporting Document",
    description: "Upload any additional relevant supporting file.",
  },
];

export function UploadDocumentsPanel() {
  const queryClient = useQueryClient();
  const [forms, setForms] = useState<Record<UploadSectionPurpose, UploadFormState>>({
    RESPONSIBILITY: { applicationId: "", notes: "", file: null },
    FAMILY_STATUS: { applicationId: "", notes: "", file: null },
    DISABILITY_CERTIFICATION: { applicationId: "", notes: "", file: null },
    HIV_ILLNESS_CERTIFICATION: { applicationId: "", notes: "", file: null },
    SPOUSE_PROOF: { applicationId: "", notes: "", file: null },
    OTHER: { applicationId: "", notes: "", file: null },
  });
  const [fileKeys, setFileKeys] = useState<Record<UploadSectionPurpose, number>>({
    RESPONSIBILITY: 0,
    FAMILY_STATUS: 0,
    DISABILITY_CERTIFICATION: 0,
    HIV_ILLNESS_CERTIFICATION: 0,
    SPOUSE_PROOF: 0,
    OTHER: 0,
  });

  const documentsQuery = useQuery({
    queryKey: ["my-documents"],
    queryFn: getMyDocuments,
  });

  const appOptionsQuery = useQuery({
    queryKey: ["application-form-options"],
    queryFn: getApplicationFormOptions,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: (_data, variables) => {
      toast.success("Document uploaded.");
      const purpose = variables.purpose as UploadSectionPurpose;
      setForms((prev) => ({
        ...prev,
        [purpose]: { ...prev[purpose], notes: "", file: null },
      }));
      setFileKeys((prev) => ({
        ...prev,
        [purpose]: prev[purpose] + 1,
      }));
      queryClient.invalidateQueries({ queryKey: ["my-documents"] });
    },
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Document upload failed.";
      toast.error(message);
    },
  });

  const downloadMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      downloadMyDocument(id, name),
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Download failed.";
      toast.error(message);
    },
  });

  const roundOptions = useMemo(
    () => [
      { label: "No application link", value: "" },
      ...(
        appOptionsQuery.data?.rounds.map((round) => ({
          label: `${round.name} (${round.status})`,
          value: round.id,
        })) ?? []
      ),
    ],
    [appOptionsQuery.data?.rounds],
  );

  function onUpload(purpose: UploadSectionPurpose) {
    const form = forms[purpose];
    if (!form.file) {
      toast.error("Select a file first.");
      return;
    }

    uploadMutation.mutate({
      purpose,
      applicationId: form.applicationId || null,
      notes: form.notes.trim() || null,
      file: form.file,
    });
  }

  return (
    <div className="space-y-8">
      <section className="panel p-6 md:p-8">
        <div className="mb-6 border-b border-[var(--border)] pb-4">
          <h2 className="text-lg font-bold uppercase tracking-tight text-[var(--color-primary)]">
            Upload Supporting Documents
          </h2>
          <p className="mt-2 text-sm text-muted">
            Upload PDF or image evidence. Educational title, level, and service
            years are handled in one combined academic document outside this page.
          </p>
        </div>

        <div className="space-y-6">
          {uploadSections.map((section) => (
            <div key={section.purpose} className="border border-[var(--border)] p-4 md:p-5">
              <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
                {section.title}
              </h3>
              <p className="mt-1 text-xs text-muted">{section.description}</p>

              <div className="mt-4 space-y-4">
                <Select
                  label="Link to Application Round (Optional)"
                  value={forms[section.purpose].applicationId}
                  onChange={(event) =>
                    setForms((prev) => ({
                      ...prev,
                      [section.purpose]: {
                        ...prev[section.purpose],
                        applicationId: event.target.value,
                      },
                    }))
                  }
                  options={roundOptions}
                />
                <label className="flex w-full flex-col gap-2 text-sm font-medium text-[var(--color-primary)]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                    Notes
                  </span>
                  <textarea
                    className="min-h-24 w-full resize-y border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                    placeholder="Optional note for reviewer..."
                    value={forms[section.purpose].notes}
                    onChange={(event) =>
                      setForms((prev) => ({
                        ...prev,
                        [section.purpose]: {
                          ...prev[section.purpose],
                          notes: event.target.value,
                        },
                      }))
                    }
                  />
                </label>
                <label className="flex w-full flex-col gap-2 text-sm font-medium text-[var(--color-primary)]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                    File
                  </span>
                  <input
                    key={`${section.purpose}-${fileKeys[section.purpose]}`}
                    type="file"
                    accept=".pdf,image/png,image/jpeg,image/webp"
                    className="min-h-12 w-full border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--color-primary)]"
                    onChange={(event) =>
                      setForms((prev) => ({
                        ...prev,
                        [section.purpose]: {
                          ...prev[section.purpose],
                          file: event.target.files?.[0] ?? null,
                        },
                      }))
                    }
                  />
                </label>
                <Button
                  onClick={() => onUpload(section.purpose)}
                  busy={
                    uploadMutation.isPending &&
                    uploadMutation.variables?.purpose === section.purpose
                  }
                  disabled={!forms[section.purpose].file}
                >
                  Upload {section.title}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="p-6 md:p-8 border-b border-[var(--border)]">
          <h2 className="text-lg font-bold uppercase tracking-tight text-[var(--color-primary)]">
            My Uploaded Documents
          </h2>
        </div>
        {documentsQuery.isLoading ? (
          <div className="p-8 text-sm text-muted">Loading documents...</div>
        ) : documentsQuery.isError ? (
          <div className="p-8 text-sm text-[var(--color-danger)]">
            Could not load documents.
          </div>
        ) : !documentsQuery.data || documentsQuery.data.length === 0 ? (
          <div className="p-8 text-sm text-muted">No documents uploaded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--surface-muted)] border-b border-[var(--border)]">
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                    File
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                    Purpose
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                    Status
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                    Uploaded
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {documentsQuery.data.map((documentRow) => (
                  <tr key={documentRow.id}>
                    <td className="px-4 py-4 text-sm text-[var(--color-primary)]">
                      {documentRow.originalFileName}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted">
                      {documentRow.purpose}
                    </td>
                    <td className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                      {documentRow.status}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted">
                      {new Date(documentRow.uploadedAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        busy={
                          downloadMutation.isPending &&
                          downloadMutation.variables?.id === documentRow.id
                        }
                        onClick={() =>
                          downloadMutation.mutate({
                            id: documentRow.id,
                            name: documentRow.originalFileName,
                          })
                        }
                      >
                        Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
