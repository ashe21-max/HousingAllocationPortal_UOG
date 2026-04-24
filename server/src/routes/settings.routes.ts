import { Router } from 'express';
import { getUserSettings, updateUserSettings } from '../controller/settings.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// Get user settings
router.get('/user', authenticate, getUserSettings);

// Update user settings
router.post('/user', authenticate, updateUserSettings);

export { router as settingsRouter };
