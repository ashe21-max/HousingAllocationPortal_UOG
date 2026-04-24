import type {
  GenerateOtpDto,
  GenerateOtpResultDto,
} from '../dtos/generate-otp.dto.js';
import { OTP_EXPIRES_IN_MS } from '../config/auth.js';
import { AppError } from '../errorHandler/app-error.js';
import { replaceUserOtp } from '../repository/otp.repository.js';
import { findUserById } from '../repository/user.repository.js';
import { generateOtpCode } from '../utils/generate-otp-code.js';
import { validateGenerateOtpInput } from '../validators/generate-otp.validator.js';

export async function generateOtp({
  userId,
}: GenerateOtpDto): Promise<GenerateOtpResultDto> {
  const validatedInput = validateGenerateOtpInput({ userId });

  const user = await findUserById(validatedInput.userId);

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_EXPIRES_IN_MS);

  const createdOtp = await replaceUserOtp(validatedInput.userId, code, expiresAt);

  if (!createdOtp) {
    throw new AppError('Failed to generate OTP', 500, 'OTP_GENERATION_FAILED');
  }

  return createdOtp;
}
