import type { NextFunction, Request, Response } from 'express';
import type { CreateBackupDto, CreateBackupScheduleDto, UpdateBackupScheduleDto } from '../dtos/backup.dto.js';
import { AppError } from '../errorHandler/app-error.js';
import { db } from '../lib/db/index.js';
import { systemBackups } from '../lib/db/schema/backup.js';
import {
  createBackupService,
  getBackupsService,
  getBackupByIdService,
  deleteBackupService,
  downloadBackupService,
  getBackupLogsService,
  createBackupScheduleService,
  getBackupSchedulesService,
  updateBackupScheduleService,
  deleteBackupScheduleService,
} from '../services/backup.service.js';

export async function createBackupController(
  req: Request<unknown, unknown, CreateBackupDto>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Temporarily bypass authentication for testing
    // if (!req.user) {
    //   throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    // }

    const { type, description, tables } = req.body;

    if (!type || !['full', 'incremental', 'partial'].includes(type)) {
      throw new AppError('Invalid backup type', 400, 'VALIDATION_ERROR');
    }

    if (type === 'partial' && (!tables || tables.length === 0)) {
      throw new AppError('Tables are required for partial backup', 400, 'VALIDATION_ERROR');
    }

    // Use the real service to create actual database backup
    const userId = req.user?.userId || '00000000-0000-0000-0000-000000000000';
    const backup = await createBackupService(userId, { type, description, tables });

    res.status(201).json(backup);
  } catch (error) {
    next(error);
  }
}

export async function getBackupsController(
  req: Request<unknown, unknown, unknown, { page?: string; pageSize?: string; type?: string; status?: string; search?: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const backups = await getBackupsService(req.query);
    res.status(200).json(backups);
  } catch (error) {
    next(error);
  }
}

export async function getBackupController(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const backup = await getBackupByIdService(req.params.id);
    res.status(200).json(backup);
  } catch (error) {
    next(error);
  }
}

export async function deleteBackupController(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await deleteBackupService(req.params.id);
    res.status(200).json({ message: 'Backup deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function downloadBackupController(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Get backup file path
    const filePath = await downloadBackupService(req.params.id);
    const backup = await getBackupByIdService(req.params.id);

    // Set appropriate headers for file download
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${backup.filename}"`);

    // Stream the actual backup file to the client
    const fs = require('fs');
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
}

export async function getBackupLogsController(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const logs = await getBackupLogsService(req.params.id);
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
}

export async function createBackupScheduleController(
  req: Request<unknown, unknown, CreateBackupScheduleDto>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Temporarily bypass authentication for testing
    // if (!req.user) {
    //   throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    // }

    const { name, type, frequency, tables, enabled, retentionDays } = req.body;

    if (!name || !type || !frequency) {
      throw new AppError('Name, type, and frequency are required', 400, 'VALIDATION_ERROR');
    }

    if (!['full', 'incremental', 'partial'].includes(type)) {
      throw new AppError('Invalid backup type', 400, 'VALIDATION_ERROR');
    }

    if (!['hourly', 'daily', 'weekly', 'monthly'].includes(frequency)) {
      throw new AppError('Invalid frequency', 400, 'VALIDATION_ERROR');
    }

    if (type === 'partial' && (!tables || tables.length === 0)) {
      throw new AppError('Tables are required for partial backup', 400, 'VALIDATION_ERROR');
    }

    const schedule = await createBackupScheduleService('test-user-id', {
      name,
      type,
      frequency,
      tables,
      enabled: enabled ?? true,
      retentionDays: retentionDays ?? 30,
    });
    res.status(201).json(schedule);
  } catch (error) {
    next(error);
  }
}

export async function getBackupSchedulesController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const schedules = await getBackupSchedulesService();
    res.status(200).json(schedules);
  } catch (error) {
    next(error);
  }
}

export async function updateBackupScheduleController(
  req: Request<{ id: string }, unknown, UpdateBackupScheduleDto>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const schedule = await updateBackupScheduleService(req.params.id, req.body);
    res.status(200).json(schedule);
  } catch (error) {
    next(error);
  }
}

export async function deleteBackupScheduleController(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await deleteBackupScheduleService(req.params.id);
    res.status(200).json({ message: 'Backup schedule deleted successfully' });
  } catch (error) {
    next(error);
  }
}
