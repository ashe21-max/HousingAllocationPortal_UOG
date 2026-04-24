import fs from 'node:fs/promises';

import type { UploadLecturerDocumentDto } from '../dtos/document.dto.js';
import { AppError } from '../errorHandler/app-error.js';
import { findApplicationByIdAndUser } from '../repository/application.repository.js';
import {
  createLecturerDocument,
  findLecturerDocumentByIdAndUser,
  findMyLecturerDocuments,
} from '../repository/document.repository.js';
import {
  validateDocumentId,
  validateUploadDocumentInput,
} from '../validators/document.validator.js';

export async function uploadMyDocument(
  userId: string,
  rawInput: UploadLecturerDocumentDto,
  file: Express.Multer.File,
) {
  const input = validateUploadDocumentInput(rawInput);

  if (input.applicationId) {
    const application = await findApplicationByIdAndUser(input.applicationId, userId);
    if (!application) {
      throw new AppError(
        'Application not found for this user',
        404,
        'APPLICATION_NOT_FOUND',
      );
    }
  }

  const created = await createLecturerDocument(userId, input, {
    originalFileName: file.originalname,
    mimeType: file.mimetype,
    sizeBytes: file.size,
    storagePath: file.path,
  });

  if (!created) {
    throw new AppError('Failed to save document', 500, 'DOCUMENT_SAVE_FAILED');
  }

  return created;
}

export async function getMyDocuments(userId: string) {
  return findMyLecturerDocuments(userId);
}

export async function getMyDocumentForDownload(
  userId: string,
  documentIdInput: string,
) {
  const documentId = validateDocumentId(documentIdInput);
  const document = await findLecturerDocumentByIdAndUser(documentId, userId);

  if (!document) {
    throw new AppError('Document not found', 404, 'DOCUMENT_NOT_FOUND');
  }

  try {
    await fs.access(document.storagePath);
  } catch {
    throw new AppError(
      'Stored file could not be found',
      404,
      'DOCUMENT_FILE_NOT_FOUND',
    );
  }

  return document;
}
