import { Router } from 'express';

import {
  createLecturerComplaintThreadController,
  getLecturerComplaintThreadController,
  listLecturerComplaintThreadsController,
  sendLecturerComplaintMessageController,
} from '../controller/complaint.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/require-role.js';

const complaintRouter = Router();

complaintRouter.use(authenticate, requireRole('LECTURER'));

complaintRouter.post('/', createLecturerComplaintThreadController);
complaintRouter.get('/me', listLecturerComplaintThreadsController);
complaintRouter.get('/:id', getLecturerComplaintThreadController);
complaintRouter.post('/:id/messages', sendLecturerComplaintMessageController);

export { complaintRouter };
