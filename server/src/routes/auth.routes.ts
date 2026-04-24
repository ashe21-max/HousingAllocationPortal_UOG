import { Router } from 'express';

import {
  forgotPasswordController,
  getMeController,
  initiateLoginController,
  logoutController,
  passwordLoginController,
  resendOtpController,
  setPasswordController,
  updateProfileController,
  updateProfilePictureController,
  verifyOtpController,
} from '../controller/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const authRouter = Router();

authRouter.post('/forgot-password', forgotPasswordController);
authRouter.post('/login/initiate', initiateLoginController);
authRouter.post('/otp/resend', resendOtpController);
authRouter.post('/otp/verify', verifyOtpController);
authRouter.post('/password/setup', setPasswordController);
authRouter.post('/login', passwordLoginController);
authRouter.post('/logout', logoutController);

// Profile management endpoints
authRouter.get('/me', authenticate, getMeController);
authRouter.put('/profile', authenticate, updateProfileController);
authRouter.post('/profile-picture', authenticate, updateProfilePictureController);

export { authRouter };
