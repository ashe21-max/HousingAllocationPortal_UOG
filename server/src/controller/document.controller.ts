import type { NextFunction, Request, Response } from 'express';

import type { UploadLecturerDocumentDto } from '../dtos/document.dto.js';
import { AppError } from '../errorHandler/app-error.js';
import {
  getMyDocumentForDownload,
  getMyDocuments,
  uploadMyDocument,
} from '../services/document.service.js';

export async function uploadMyDocumentController(
  req: Request<unknown, unknown, Partial<UploadLecturerDocumentDto>>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    if (!req.file) {
      throw new AppError('Document file is required', 400, 'VALIDATION_ERROR');
    }

    const { purpose, applicationId, notes } = req.body;

    const payload: UploadLecturerDocumentDto = {
      purpose: typeof purpose === 'string' ? purpose : '',
    };

    if (typeof applicationId === 'string') {
      payload.applicationId = applicationId;
    }

    if (typeof notes === 'string') {
      payload.notes = notes;
    }

    const document = await uploadMyDocument(req.user.userId, payload, req.file);

    res.status(201).json(document);
  } catch (error) {
    next(error);
  }
}

export async function getMyDocumentsController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const documents = await getMyDocuments(req.user.userId);
    res.status(200).json(documents);
  } catch (error) {
    next(error);
  }
}

export async function downloadMyDocumentController(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const document = await getMyDocumentForDownload(req.user.userId, req.params.id);
    res.download(document.storagePath, document.originalFileName);
  } catch (error) {
    next(error);
  }
}
