import { Router } from 'express';

import {
  adminCreateUserController,
  adminDeleteUserController,
  adminGetUserController,
  adminListUsersController,
  adminSetUserStatusController,
  adminUpdateUserController,
} from '../controller/admin-user.controller.js';
import {
  createBackupController,
  getBackupsController,
  getBackupController,
  deleteBackupController,
  downloadBackupController,
  getBackupLogsController,
  createBackupScheduleController,
  getBackupSchedulesController,
  updateBackupScheduleController,
  deleteBackupScheduleController,
} from '../controller/backup.controller.js';
import {
  getAllocationReportsController,
  updateAllocationReportStatusController,
  deleteAllocationReportController,
} from '../controller/officer.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/require-role.js';

const adminRouter = Router();

adminRouter.use(authenticate, requireRole('ADMIN'));

// User Management
adminRouter.post('/users', adminCreateUserController);
adminRouter.get('/users', adminListUsersController);
adminRouter.get('/users/:id', adminGetUserController);
adminRouter.patch('/users/:id', adminUpdateUserController);
adminRouter.patch('/users/:id/status', adminSetUserStatusController);
adminRouter.delete('/users/:id', adminDeleteUserController);

// Backup Management
adminRouter.post('/backups', createBackupController);
adminRouter.get('/backups', getBackupsController);
adminRouter.get('/backups/:id', getBackupController);
adminRouter.delete('/backups/:id', deleteBackupController);
adminRouter.get('/backups/:id/download', downloadBackupController);
adminRouter.get('/backups/:id/logs', getBackupLogsController);

// Backup Schedule Management
adminRouter.post('/backup-schedules', createBackupScheduleController);
adminRouter.get('/backup-schedules', getBackupSchedulesController);
adminRouter.patch('/backup-schedules/:id', updateBackupScheduleController);
adminRouter.delete('/backup-schedules/:id', deleteBackupScheduleController);

// Allocation Reports Management (for admin support)
adminRouter.get('/reports', getAllocationReportsController);
adminRouter.patch('/reports/:id/status', updateAllocationReportStatusController);
adminRouter.delete('/reports/:id', deleteAllocationReportController);

export { adminRouter };
