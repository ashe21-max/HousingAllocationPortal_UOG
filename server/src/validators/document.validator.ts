import type {
  UploadLecturerDocumentDto,
  UploadLecturerDocumentInput,
} from '../dtos/document.dto.js';
import { AppError } from '../errorHandler/app-error.js';
import {
  documentPurposeEnum,
  type DocumentPurpose,
} from '../lib/db/schema/document.js';

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validateUuid(value: string, fieldName: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new AppError(`${fieldName} is required`, 400, 'VALIDATION_ERROR');
  }

  if (!uuidPattern.test(normalized)) {
    throw new AppError(
      `${fieldName} must be a valid UUID`,
      400,
      'VALIDATION_ERROR',
    );
  }

  return normalized;
}

function validatePurpose(rawPurpose: string): DocumentPurpose {
  const normalizedPurpose = rawPurpose.trim();
  if (
    !documentPurposeEnum.enumValues.includes(normalizedPurpose as DocumentPurpose)
  ) {
    throw new AppError('Document purpose is invalid', 400, 'VALIDATION_ERROR');
  }

  return normalizedPurpose as DocumentPurpose;
}

export function validateUploadDocumentInput(
  input: UploadLecturerDocumentDto,
): UploadLecturerDocumentInput {
  if (typeof input.purpose !== 'string') {
    throw new AppError('Document purpose is required', 400, 'VALIDATION_ERROR');
  }

  const purpose = validatePurpose(input.purpose);
  let applicationId: string | null = null;
  if (typeof input.applicationId === 'string') {
    applicationId = validateUuid(input.applicationId, 'Application id');
  }

  let notes: string | null = null;
  if (typeof input.notes === 'string') {
    const normalizedNotes = input.notes.trim();
    notes = normalizedNotes.length > 0 ? normalizedNotes : null;
  }

  return {
    purpose,
    applicationId,
    notes,
  };
}

export function validateDocumentId(documentIdInput: string): string {
  return validateUuid(documentIdInput, 'Document id');
}
