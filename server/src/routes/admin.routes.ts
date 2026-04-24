import { Router } from 'express';

import {
  adminCreateUserController,
  adminGetUserController,
  adminListUsersController,
  adminSetUserStatusController,
  adminUpdateUserController,
} from '../controller/admin-user.controller.js';
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

export { adminRouter };
