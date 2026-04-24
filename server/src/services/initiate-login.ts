import type {
  InitiateLoginDto,
  InitiateLoginResultDto,
} from '../dtos/auth.dto.js';
import { OTP_EXPIRES_IN_MINUTES } from '../config/auth.js';
import { AppError } from '../errorHandler/app-error.js';
import { findUserByEmail } from '../repository/user.repository.js';
import { generateOtp } from './generate-otp.js';
import { validateEmail } from '../validators/email.validator.js';
import { sendBrevoEmail } from '../utils/send-brevo-email.js';

export async function initiateLogin({
  email,
}: InitiateLoginDto): Promise<InitiateLoginResultDto> {
  const validatedEmail = validateEmail(email);
  const user = await findUserByEmail(validatedEmail);

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  if (!user.isActive) {
    throw new AppError('User account is deactivated', 403, 'USER_INACTIVE');
  }

  const otp = await generateOtp({ userId: user.id });

  await sendBrevoEmail({
    to: {
      email: user.email,
      name: user.name,
    },
    subject: 'Your ASHUGONDER verification code',
    htmlContent: `<p>Your verification code is <strong>${otp.code}</strong>.</p><p>This code expires in ${OTP_EXPIRES_IN_MINUTES} minutes.</p>`,
  });

  return {
    success: true,
    userId: user.id,
    requiresPasswordSetup: user.password === null,
    expiresAt: otp.expiresAt,
  };
}
