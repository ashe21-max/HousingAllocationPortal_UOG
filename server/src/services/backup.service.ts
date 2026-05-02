import type { CreateBackupDto, CreateBackupScheduleDto, UpdateBackupScheduleDto, BackupListQueryDto } from '../dtos/backup.dto.js';
import type { SystemBackup, NewSystemBackup, BackupLog, NewBackupLog, BackupSchedule, NewBackupSchedule } from '../lib/db/schema/backup.js';
import { db } from '../lib/db/index.js';
import { systemBackups, backupLogs, backupSchedule } from '../lib/db/schema/backup.js';
import { users } from '../lib/db/schema/auth.js';
import { eq, desc, and, ilike, or } from 'drizzle-orm';
import { AppError } from '../errorHandler/app-error.js';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { randomUUID } from 'crypto';

export async function createBackupService(userId: string, backupData: CreateBackupDto): Promise<SystemBackup> {
  const { type, description, tables } = backupData;

  // Generate backup filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `housing_portal_${type}_backup_${timestamp}.sql`;

  // Create backup record with 'creating' status
  const newBackup = {
    id: randomUUID(),
    filename,
    type,
    size: 0,
    status: 'creating',
    description: description || `Manual ${type} backup`,
    tables: tables || null,
    createdBy: userId || '00000000-0000-0000-0000-000000000000',
    createdAt: new Date(),
  };

  const [backup] = await db.insert(systemBackups).values(newBackup).returning();

  // Log backup start
  await logBackupService(backup.id, 'INFO', 'Backup started', { type, tables });

  try {
    // Create backup directory
    const backupDir = path.join(process.cwd(), 'backups');
    await fs.mkdir(backupDir, { recursive: true });
    const filePath = path.join(backupDir, filename);

    // Get database connection details from environment
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL not configured');
    }

    // Parse database URL to get connection details
    const url = new URL(dbUrl);
    const dbname = url.pathname.substring(1); // Remove leading slash
    const host = url.hostname;
    const port = url.port || '5432';
    const username = url.username;
    const password = url.password;

    // Build pg_dump command
    let pgDumpCommand = `pg_dump --host=${host} --port=${port} --username=${username} --dbname=${dbname} --format=plain --no-owner --no-privileges --verbose`;

    // Add table specifications for partial backups
    if (type === 'partial' && tables && tables.length > 0) {
      pgDumpCommand += ` --table=${tables.join(' --table=')}`;
    }

    // Add output file
    pgDumpCommand += ` > "${filePath}"`;

    // Log backup command
    await logBackupService(backup.id, 'INFO', 'Executing pg_dump', { command: pgDumpCommand });

    // Execute pg_dump with proper environment
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);

    const env = {
      ...process.env,
      PGPASSWORD: password
    };

    const { stdout, stderr } = await execAsync(pgDumpCommand, { env });

    // Check if backup file was created
    const stats = await fs.stat(filePath);
    if (stats.size === 0) {
      throw new Error('Backup file is empty');
    }

    // Calculate checksum
    const fileBuffer = await fs.readFile(filePath);
    const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Update backup record with completion details
    const [updatedBackup] = await db
      .update(systemBackups)
      .set({
        size: stats.size,
        status: 'completed',
        filePath,
        checksum,
        completedAt: new Date(),
      })
      .where(eq(systemBackups.id, backup.id))
      .returning();

    // Log backup completion
    await logBackupService(backup.id, 'SUCCESS', 'Backup completed successfully', {
      size: stats.size,
      checksum,
      filePath,
    });

    return updatedBackup;
  } catch (error) {
    // Log error and update status
    await logBackupService(backup.id, 'ERROR', 'Backup failed', { error: error.message });
    await updateBackupStatusService(backup.id, 'failed');
    throw error;
  }
}

export async function getBackupsService(query: BackupListQueryDto) {
  const { page = '1', pageSize = '10', type, status, search } = query;
  const offset = (parseInt(page) - 1) * parseInt(pageSize);
  const limit = parseInt(pageSize);

  let whereConditions = [];

  if (type) {
    whereConditions.push(eq(systemBackups.type, type));
  }

  if (status) {
    whereConditions.push(eq(systemBackups.status, status));
  }

  if (search) {
    whereConditions.push(
      or(
        ilike(systemBackups.filename, `%${search}%`),
        ilike(systemBackups.description, `%${search}%`)
      )
    );
  }

  const backups = await db
    .select({
      id: systemBackups.id,
      filename: systemBackups.filename,
      type: systemBackups.type,
      size: systemBackups.size,
      status: systemBackups.status,
      description: systemBackups.description,
      tables: systemBackups.tables,
      createdAt: systemBackups.createdAt,
      completedAt: systemBackups.completedAt,
      createdBy: systemBackups.createdBy,
      userName: users.name,
    })
    .from(systemBackups)
    .leftJoin(users, eq(systemBackups.createdBy, users.id))
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
    .orderBy(desc(systemBackups.createdAt))
    .limit(limit)
    .offset(offset);

  const totalCount = await db
    .select({ count: systemBackups.id })
    .from(systemBackups)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

  return {
    items: backups,
    total: totalCount.length,
    page: parseInt(page),
    pageSize: parseInt(pageSize),
    totalPages: Math.ceil(totalCount.length / parseInt(pageSize)),
  };
}

export async function getBackupByIdService(id: string): Promise<SystemBackup> {
  const [backup] = await db
    .select()
    .from(systemBackups)
    .where(eq(systemBackups.id, id));

  if (!backup) {
    throw new AppError('Backup not found', 404, 'BACKUP_NOT_FOUND');
  }

  return backup;
}

export async function deleteBackupService(id: string): Promise<void> {
  const backup = await getBackupByIdService(id);

  // Delete physical file if it exists
  if (backup.filePath) {
    try {
      await fs.unlink(backup.filePath);
    } catch (error) {
      // File might not exist, continue with database deletion
      console.warn(`Backup file not found: ${backup.filePath}`);
    }
  }

  // Delete from database
  await db.delete(systemBackups).where(eq(systemBackups.id, id));
}

export async function downloadBackupService(id: string): Promise<string> {
  const backup = await getBackupByIdService(id);

  if (backup.status !== 'completed') {
    throw new AppError('Backup is not ready for download', 400, 'BACKUP_NOT_READY');
  }

  if (!backup.filePath) {
    throw new AppError('Backup file not found', 404, 'BACKUP_FILE_NOT_FOUND');
  }

  // Check if file exists
  try {
    await fs.access(backup.filePath);
  } catch (error) {
    throw new AppError('Backup file not accessible', 404, 'BACKUP_FILE_NOT_FOUND');
  }

  return backup.filePath;
}

export async function getBackupLogsService(backupId: string) {
  const logs = await db
    .select()
    .from(backupLogs)
    .where(eq(backupLogs.backupId, backupId))
    .orderBy(desc(backupLogs.timestamp));

  return logs;
}

export async function createBackupScheduleService(userId: string, scheduleData: CreateBackupScheduleDto): Promise<BackupSchedule> {
  const newSchedule: NewBackupSchedule = {
    ...scheduleData,
    createdBy: userId,
    nextRunAt: calculateNextRunTime(scheduleData.frequency),
  };

  const [schedule] = await db.insert(backupSchedule).values(newSchedule).returning();
  return schedule;
}

export async function getBackupSchedulesService() {
  const schedules = await db
    .select({
      id: backupSchedule.id,
      name: backupSchedule.name,
      type: backupSchedule.type,
      frequency: backupSchedule.frequency,
      tables: backupSchedule.tables,
      enabled: backupSchedule.enabled,
      retentionDays: backupSchedule.retentionDays,
      lastRunAt: backupSchedule.lastRunAt,
      nextRunAt: backupSchedule.nextRunAt,
      createdAt: backupSchedule.createdAt,
      createdBy: backupSchedule.createdBy,
      userName: users.name,
    })
    .from(backupSchedule)
    .leftJoin(users, eq(backupSchedule.createdBy, users.id))
    .orderBy(backupSchedule.createdAt);

  return schedules;
}

export async function updateBackupScheduleService(id: string, updateData: UpdateBackupScheduleDto): Promise<BackupSchedule> {
  const [schedule] = await db
    .update(backupSchedule)
    .set({
      ...updateData,
      updatedAt: new Date(),
      ...(updateData.frequency && { nextRunAt: calculateNextRunTime(updateData.frequency) }),
    })
    .where(eq(backupSchedule.id, id))
    .returning();

  if (!schedule) {
    throw new AppError('Backup schedule not found', 404, 'SCHEDULE_NOT_FOUND');
  }

  return schedule;
}

export async function deleteBackupScheduleService(id: string): Promise<void> {
  await db.delete(backupSchedule).where(eq(backupSchedule.id, id));
}

// Helper functions
async function logBackupService(backupId: string, level: string, message: string, details?: any): Promise<void> {
  const logEntry: NewBackupLog = {
    backupId,
    level,
    message,
    details: details ? JSON.stringify(details) : null,
  };

  await db.insert(backupLogs).values(logEntry);
}

async function updateBackupStatusService(backupId: string, status: string): Promise<void> {
  await db
    .update(systemBackups)
    .set({ status })
    .where(eq(systemBackups.id, backupId));
}

function calculateNextRunTime(frequency: string): Date {
  const now = new Date();

  switch (frequency) {
    case 'hourly':
      now.setHours(now.getHours() + 1);
      break;
    case 'daily':
      now.setDate(now.getDate() + 1);
      now.setHours(2, 0, 0, 0); // 2:00 AM
      break;
    case 'weekly':
      // Calculate next Sunday
      const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
      now.setDate(now.getDate() + daysUntilSunday);
      now.setHours(2, 0, 0, 0); // 2:00 AM on Sunday
      break;
    case 'monthly':
      now.setMonth(now.getMonth() + 1);
      now.setDate(1);
      now.setHours(2, 0, 0, 0); // 2:00 AM on 1st of month
      break;
    default:
      now.setDate(now.getDate() + 1);
  }

  return now;
}
