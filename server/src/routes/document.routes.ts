import { Router } from 'express';

import {
  downloadMyDocumentController,
  getMyDocumentsController,
  uploadMyDocumentController,
} from '../controller/document.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/require-role.js';
import { uploadLecturerDocument } from '../middleware/upload-lecturer-document.js';

const documentRouter = Router();

documentRouter.use(authenticate, requireRole('LECTURER'));

documentRouter.post(
  '/upload',
  uploadLecturerDocument.single('file'),
  uploadMyDocumentController,
);
documentRouter.get('/me', getMyDocumentsController);
documentRouter.get('/:id/download', downloadMyDocumentController);

export { documentRouter };
