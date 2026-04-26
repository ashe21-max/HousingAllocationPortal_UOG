import { Router } from 'express';

import {
  getMyScoreController,
  previewScoreController,
  saveMyCriteriaController,
} from '../controller/score.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/require-role.js';

const scoreRouter = Router();

scoreRouter.post('/preview', authenticate, requireRole('LECTURER'), previewScoreController);

scoreRouter.get(
  '/me',
  authenticate,
  requireRole('LECTURER'),
  getMyScoreController,
);

scoreRouter.post(
  '/save',
  authenticate,
  requireRole('LECTURER'),
  saveMyCriteriaController,
);

export { scoreRouter };
