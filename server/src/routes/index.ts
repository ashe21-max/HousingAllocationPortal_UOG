import { Router } from 'express';

import { applicationRouter } from './application.routes.js';
import { adminRouter } from './admin.routes.js';
import { authRouter } from './auth.routes.js';
import { committeeRouter } from './committee.routes.js';
import { complaintRouter } from './complaint.routes.js';
import { documentRouter } from './document.routes.js';
import { housingRouter } from './housing.routes.js';
import { officerRouter } from './officer.routes.js';
import { scoreRouter } from './score.routes.js';
import { healthRouter } from './health.routes.js';
import { settingsRouter } from './settings.routes.js';
import chatRouter from './chat.routes.js';

const apiRouter = Router();

apiRouter.use('/admin', adminRouter);
apiRouter.use('/applications', applicationRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/committee', committeeRouter);
apiRouter.use('/complaints', complaintRouter);
apiRouter.use('/documents', documentRouter);
apiRouter.use('/houses', housingRouter);
apiRouter.use('/officer', officerRouter);
apiRouter.use('/score', scoreRouter);
apiRouter.use('/health', healthRouter);
apiRouter.use('/settings', settingsRouter);
apiRouter.use('/chat', chatRouter);

export { apiRouter };
