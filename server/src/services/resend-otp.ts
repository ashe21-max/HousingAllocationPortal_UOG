import type { ResendOtpDto, ResendOtpResultDto } from '../dtos/generate-otp.dto.js';
import { OTP_EXPIRES_IN_MINUTES, OTP_EXPIRES_IN_MS } from '../config/auth.js';
import { AppError } from '../errorHandler/app-error.js';
import { findOtpByUserId, resendUserOtp } from '../repository/otp.repository.js';
import { findUserById } from '../repository/user.repository.js';
import { generateOtpCode } from '../utils/generate-otp-code.js';
import { sendBrevoEmail } from '../utils/send-brevo-email.js';
import { validateGenerateOtpInput } from '../validators/generate-otp.validator.js';

export async function resendOtp({
  userId,
}: ResendOtpDto): Promise<ResendOtpResultDto> {
  const validatedInput = validateGenerateOtpInput({ userId });
  const user = await findUserById(validatedInput.userId);

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  if (!user.isActive) {
    throw new AppError('User account is deactivated', 403, 'USER_INACTIVE');
  }

  const otpRecord = await findOtpByUserId(validatedInput.userId);

  if (!otpRecord) {
    throw new AppError('OTP not found', 404, 'OTP_NOT_FOUND');
  }

  if (otpRecord.attempts >= 3) {
    throw new AppError('OTP attempts exceeded', 429, 'OTP_ATTEMPTS_EXCEEDED');
  }

  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_EXPIRES_IN_MS);
  const result = await resendUserOtp(validatedInput.userId, code, expiresAt);

  if (result.status === 'not_found') {
    throw new AppError('OTP not found', 404, 'OTP_NOT_FOUND');
  }

  if (result.status === 'limit_reached') {
    throw new AppError('OTP resend limit reached', 429, 'OTP_RESEND_LIMIT');
  }

  if (result.status === 'expired') {
    throw new AppError('OTP has expired, please restart login', 400, 'OTP_EXPIRED');
  }

  if (result.status === 'failed') {
    throw new AppError('Failed to resend OTP', 500, 'OTP_RESEND_FAILED');
  }

  await sendBrevoEmail({
    to: {
      email: user.email,
      name: user.name,
    },
    subject: 'Your ASHUGONDER verification code',
    htmlContent: `<p>Your new verification code is <strong>${code}</strong>.</p><p>This code expires in ${OTP_EXPIRES_IN_MINUTES} minutes.</p>`,
  });

  return {
    success: true,
    expiresAt: result.expiresAt,
  };
}
