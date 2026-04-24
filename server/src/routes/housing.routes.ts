import { Router } from 'express';

import {
  createHousingUnitController,
  deleteHousingUnitController,
  getHousingUnitController,
  listHousingUnitsController,
  updateHousingUnitController,
} from '../controller/housing.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireRole } from '../middleware/require-role.js';

const housingRouter = Router();

housingRouter.use(authenticate, requireRole('OFFICER', 'ADMIN'));

housingRouter.post('/', createHousingUnitController);
housingRouter.get('/', listHousingUnitsController);
housingRouter.get('/:id', getHousingUnitController);
housingRouter.patch('/:id', updateHousingUnitController);
housingRouter.delete('/:id', deleteHousingUnitController);

export { housingRouter };
