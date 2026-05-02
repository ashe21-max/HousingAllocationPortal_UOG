import { Router } from 'express';

import {
  createOfficerRoundController,
  deleteOfficerRoundController,
  listOfficerAvailableHousesController,
  listOfficerManagedRoundsController,
  listOfficerRoundAllocationResultsController,
  listOfficerRoundsController,
  runOfficerAllocationController,
  sendReportToAdminController,
  updateOfficerRoundStatusController,
} from '../controller/officer.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/require-role.js';

const officerRouter = Router();

officerRouter.use(authenticate, requireRole('OFFICER', 'ADMIN'));

officerRouter.get('/rounds', listOfficerRoundsController);
officerRouter.get('/rounds/manage', listOfficerManagedRoundsController);
officerRouter.post('/rounds/manage', createOfficerRoundController);
officerRouter.patch('/rounds/:roundId/status', updateOfficerRoundStatusController);
officerRouter.delete('/rounds/:roundId', deleteOfficerRoundController);
officerRouter.get('/available-houses', listOfficerAvailableHousesController);
officerRouter.post('/allocations/:roundId/run', runOfficerAllocationController);
officerRouter.get(
  '/allocations/:roundId',
  listOfficerRoundAllocationResultsController,
);
officerRouter.post('/reports/send', sendReportToAdminController);

export { officerRouter };
