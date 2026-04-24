import { Router } from 'express';

import {
  downloadCommitteeDocumentController,
  generateRoundRankingController,
  getCommitteeApplicationDetailsController,
  listRoundRankingController,
  listCommitteeApplicationsController,
  reviewCommitteeApplicationController,
  saveManualRoundRankingController,
  submitRoundFinalController,
  submitRoundPreliminaryController,
} from '../controller/committee.controller.js';
import {
  getCommitteeComplaintThreadController,
  listCommitteeComplaintThreadsController,
  sendCommitteeComplaintMessageController,
} from '../controller/complaint.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/require-role.js';

const committeeRouter = Router();

committeeRouter.use(authenticate, requireRole('COMMITTEE'));

committeeRouter.get('/applications', listCommitteeApplicationsController);
committeeRouter.get('/applications/:id', getCommitteeApplicationDetailsController);
committeeRouter.patch('/applications/:id/review', reviewCommitteeApplicationController);
committeeRouter.get('/documents/:id/download', downloadCommitteeDocumentController);
committeeRouter.post('/ranking/:roundId/generate', generateRoundRankingController);
committeeRouter.get('/ranking/:roundId', listRoundRankingController);
committeeRouter.patch('/ranking/:roundId', saveManualRoundRankingController);
committeeRouter.post(
  '/ranking/:roundId/preliminary',
  submitRoundPreliminaryController,
);
committeeRouter.post('/ranking/:roundId/final', submitRoundFinalController);
committeeRouter.get('/complaints', listCommitteeComplaintThreadsController);
committeeRouter.get('/complaints/:id', getCommitteeComplaintThreadController);
committeeRouter.post('/complaints/:id/messages', sendCommitteeComplaintMessageController);

export { committeeRouter };
