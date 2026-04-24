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

applicationRouter.use(authenticate, requireRole('LECTURER'));

applicationRouter.post('/draft', saveApplicationDraftController);
applicationRouter.post('/:id/submit', submitApplicationController);
applicationRouter.get('/me', getMyApplicationsController);
applicationRouter.get('/options', getApplicationOptionsController);
applicationRouter.get('/results/department', getMyDepartmentResultsController);

export { applicationRouter };
