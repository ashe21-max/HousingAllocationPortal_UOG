import { pgTable, uuid, varchar, integer, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { users } from './auth.js';

// System Backups Table
export const systemBackups = pgTable('system_backups', {
  id: uuid('id').primaryKey().defaultRandom(),
  filename: varchar('filename', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'full', 'incremental', 'partial'
  size: integer('size').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('creating'), // 'creating', 'completed', 'failed', 'restoring'
  description: text('description'),
  tables: text('tables').array(), // Array of table names for partial backups
  filePath: varchar('file_path', { length: 500 }), // Physical file path
  checksum: varchar('checksum', { length: 64 }), // SHA-256 checksum for integrity
  createdBy: uuid('created_by').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  restoredAt: timestamp('restored_at', { withTimezone: true }),
  restoredBy: uuid('restored_by').references(() => users.id, { onDelete: 'set null' }),
});

// Backup Logs Table - Detailed logs for backup operations
export const backupLogs = pgTable('backup_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  backupId: uuid('backup_id').references(() => systemBackups.id, { onDelete: 'cascade' }),
  level: varchar('level', { length: 20 }).notNull(), // 'INFO', 'WARNING', 'ERROR', 'SUCCESS'
  message: text('message').notNull(),
  details: text('details'), // JSON details
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
});

// Backup Schedule Table - For automated backups
export const backupSchedule = pgTable('backup_schedule', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'full', 'incremental', 'partial'
  frequency: varchar('frequency', { length: 50 }).notNull(), // 'hourly', 'daily', 'weekly', 'monthly'
  tables: text('tables').array(), // For partial backups
  enabled: boolean('enabled').notNull().default(true),
  retentionDays: integer('retention_days').notNull().default(30),
  lastRunAt: timestamp('last_run_at', { withTimezone: true }),
  nextRunAt: timestamp('next_run_at', { withTimezone: true }),
  createdBy: uuid('created_by').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Backup Configuration Table
export const backupConfig = pgTable('backup_config', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: varchar('key', { length: 255 }).notNull().unique(),
  value: text('value').notNull(),
  description: text('description'),
  updatedBy: uuid('updated_by').references(() => users.id, { onDelete: 'set null' }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Types
export type SystemBackup = typeof systemBackups.$inferSelect;
export type NewSystemBackup = typeof systemBackups.$inferInsert;
export type BackupLog = typeof backupLogs.$inferSelect;
export type NewBackupLog = typeof backupLogs.$inferInsert;
export type BackupSchedule = typeof backupSchedule.$inferSelect;
export type NewBackupSchedule = typeof backupSchedule.$inferInsert;
export type BackupConfig = typeof backupConfig.$inferSelect;
export type NewBackupConfig = typeof backupConfig.$inferInsert;
