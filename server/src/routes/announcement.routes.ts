import { Router } from 'express';
import {
  listAnnouncementsController,
  getActiveAnnouncementsController,
  createAnnouncementController,
  updateAnnouncementController,
  deleteAnnouncementController,
} from '../controller/announcement.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/require-role.js';

const announcementRouter = Router();

// Public-ish: any authenticated user can see active announcements for their role
announcementRouter.get(
  '/active',
  authenticate,
  getActiveAnnouncementsController
);

// Officer/Admin only: CRUD operations
announcementRouter.get(
  '/',
  authenticate,
  requireRole('OFFICER', 'ADMIN'),
  listAnnouncementsController
);

announcementRouter.post(
  '/',
  authenticate,
  requireRole('OFFICER', 'ADMIN'),
  createAnnouncementController
);

announcementRouter.patch(
  '/:id',
  authenticate,
  requireRole('OFFICER', 'ADMIN'),
  updateAnnouncementController
);

announcementRouter.delete(
  '/:id',
  authenticate,
  requireRole('OFFICER', 'ADMIN'),
  deleteAnnouncementController
);

export { announcementRouter };
