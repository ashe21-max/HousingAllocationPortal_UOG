import type { VerifyOtpDto, VerifyOtpResultDto } from '../dtos/verify-otp.dto.js';
import { AppError } from '../errorHandler/app-error.js';
import { verifyOtpCode } from '../repository/otp.repository.js';
import { findUserById } from '../repository/user.repository.js';
import { validateVerifyOtpInput } from '../validators/verify-otp.validator.js';

export async function verifyOtp({
  userId,
  code,
}: VerifyOtpDto): Promise<VerifyOtpResultDto> {
  const validatedInput = validateVerifyOtpInput({ userId, code });

  const user = await findUserById(validatedInput.userId);

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  if (!user.isActive) {
    throw new AppError('User account is deactivated', 403, 'USER_INACTIVE');
  }

  const result = await verifyOtpCode(
    validatedInput.userId,
    validatedInput.code,
    new Date(),
  );

  if (result.status === 'not_found') {
    throw new AppError('OTP not found', 404, 'OTP_NOT_FOUND');
  }

  if (result.status === 'expired') {
    throw new AppError('OTP has expired', 400, 'OTP_EXPIRED');
  }

  if (result.status === 'attempts_exceeded') {
    throw new AppError('OTP attempts exceeded', 400, 'OTP_ATTEMPTS_EXCEEDED');
  }

  if (result.status === 'mismatch') {
    throw new AppError('Invalid OTP code', 400, 'INVALID_OTP_CODE');
  }

  return { success: true };
}
