import type { VerifyOtpDto } from '../dtos/verify-otp.dto.js';
import { AppError } from '../errorHandler/app-error.js';
import { validateUserId } from './user-id.validator.js';

const otpPattern = /^(?=(?:.*\d){4})(?=(?:.*[A-Z]){2})[A-Z0-9]{6}$/;

export function validateVerifyOtpInput(input: VerifyOtpDto): VerifyOtpDto {
  const userId = validateUserId(input.userId);
  const code = input.code.trim().toUpperCase();

  if (!code) {
    throw new AppError('OTP code is required', 400, 'VALIDATION_ERROR');
  }

  if (!otpPattern.test(code)) {
    throw new AppError(
      'OTP code must contain 4 numbers and 2 uppercase letters',
      400,
      'VALIDATION_ERROR',
    );
  }

  return {
    userId,
    code,
  };
}
