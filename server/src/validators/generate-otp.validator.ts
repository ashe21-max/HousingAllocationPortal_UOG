import type { GenerateOtpDto } from '../dtos/generate-otp.dto.js';
import { validateUserId } from './user-id.validator.js';

export function validateGenerateOtpInput(input: GenerateOtpDto): GenerateOtpDto {
  const userId = validateUserId(input.userId);

  return { userId };
}
