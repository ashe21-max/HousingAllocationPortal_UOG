import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';

import { AppError } from './app-error.js';

export function handleError(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
      code: error.code,
    });
    return;
  }

  if (error instanceof multer.MulterError) {
    res.status(400).json({
      message: error.message,
      code: 'UPLOAD_VALIDATION_ERROR',
    });
    return;
  }

  if (error instanceof Error && error.message === 'Unsupported file type') {
    res.status(400).json({
      message: 'File type must be PDF, JPG, PNG, or WEBP',
      code: 'UPLOAD_VALIDATION_ERROR',
    });
    return;
  }

  res.status(500).json({
    message: 'Internal server error',
    code: 'INTERNAL_SERVER_ERROR',
  });
}
