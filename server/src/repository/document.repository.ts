import { and, desc, eq } from 'drizzle-orm';

import type { UploadLecturerDocumentInput } from '../dtos/document.dto.js';
import { db } from '../lib/db/index.js';
import { lecturerDocuments } from '../lib/db/schema/document.js';

const lecturerDocumentSelection = {
  id: lecturerDocuments.id,
  userId: lecturerDocuments.userId,
  applicationId: lecturerDocuments.applicationId,
  purpose: lecturerDocuments.purpose,
  originalFileName: lecturerDocuments.originalFileName,
  mimeType: lecturerDocuments.mimeType,
  sizeBytes: lecturerDocuments.sizeBytes,
  storagePath: lecturerDocuments.storagePath,
  notes: lecturerDocuments.notes,
  status: lecturerDocuments.status,
  uploadedAt: lecturerDocuments.uploadedAt,
};

export async function createLecturerDocument(
  userId: string,
  input: UploadLecturerDocumentInput,
  fileMeta: {
    originalFileName: string;
    mimeType: string;
    sizeBytes: number;
    storagePath: string;
  },
) {
  const [created] = await db
    .insert(lecturerDocuments)
    .values({
      userId,
      applicationId: input.applicationId,
      purpose: input.purpose,
      originalFileName: fileMeta.originalFileName,
      mimeType: fileMeta.mimeType,
      sizeBytes: fileMeta.sizeBytes,
      storagePath: fileMeta.storagePath,
      notes: input.notes,
      status: 'UPLOADED',
    })
    .returning(lecturerDocumentSelection);

  return created ?? null;
}

export async function findMyLecturerDocuments(userId: string) {
  return db
    .select(lecturerDocumentSelection)
    .from(lecturerDocuments)
    .where(eq(lecturerDocuments.userId, userId))
    .orderBy(desc(lecturerDocuments.uploadedAt));
}

export async function findLecturerDocumentByIdAndUser(
  documentId: string,
  userId: string,
) {
  const [row] = await db
    .select(lecturerDocumentSelection)
    .from(lecturerDocuments)
    .where(
      and(eq(lecturerDocuments.id, documentId), eq(lecturerDocuments.userId, userId)),
    )
    .limit(1);

  return row ?? null;
}

export async function findLecturerDocumentsByUserId(userId: string) {
  return db
    .select(lecturerDocumentSelection)
    .from(lecturerDocuments)
    .where(eq(lecturerDocuments.userId, userId))
    .orderBy(desc(lecturerDocuments.uploadedAt));
}

export async function findLecturerDocumentById(documentId: string) {
  const [row] = await db
    .select(lecturerDocumentSelection)
    .from(lecturerDocuments)
    .where(eq(lecturerDocuments.id, documentId))
    .limit(1);

  return row ?? null;
}

export async function findLecturerDocumentsByApplicationId(applicationId: string) {
  return db
    .select(lecturerDocumentSelection)
    .from(lecturerDocuments)
    .where(eq(lecturerDocuments.applicationId, applicationId))
    .orderBy(desc(lecturerDocuments.uploadedAt));
}
