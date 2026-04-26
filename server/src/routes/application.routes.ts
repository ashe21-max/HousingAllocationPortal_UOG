import { Router } from 'express';

import {
  getApplicationOptionsController,
  getMyDepartmentResultsController,
  getMyApplicationsController,
  saveApplicationDraftController,
  submitApplicationController,
} from '../controller/application.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/require-role.js';

const applicationRouter = Router();

// Apply authentication only to routes that need it
applicationRouter.post('/draft', authenticate, requireRole('LECTURER'), saveApplicationDraftController);
applicationRouter.post('/:id/submit', authenticate, requireRole('LECTURER'), submitApplicationController);
applicationRouter.get('/me', authenticate, requireRole('LECTURER'), getMyApplicationsController);
applicationRouter.get('/options', getApplicationOptionsController); // No auth required for options
applicationRouter.get('/results/department', authenticate, requireRole('LECTURER'), getMyDepartmentResultsController);

export { applicationRouter };
