import type { DocumentPurpose } from '../lib/db/schema/document.js';

export type UploadLecturerDocumentDto = {
  purpose: string;
  applicationId?: string | null;
  notes?: string | null;
};

export type UploadLecturerDocumentInput = {
  purpose: DocumentPurpose;
  applicationId: string | null;
  notes: string | null;
};
