import type { SetPasswordDto } from '../dtos/set-password.dto.js';
import { AppError } from '../errorHandler/app-error.js';
import { validateUserId } from './user-id.validator.js';

export function validateSetPasswordInput(input: SetPasswordDto): SetPasswordDto {
  const userId = validateUserId(input.userId);
  const newPassword = input.newPassword.trim();

  if (!newPassword) {
    throw new AppError('Password is required', 400, 'VALIDATION_ERROR');
  }

  if (newPassword.length < 8) {
    throw new AppError(
      'Password must be at least 8 characters long',
      400,
      'VALIDATION_ERROR',
    );
  }

  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasDigit = /\d/.test(newPassword);
  const hasSpecialCharacter = /[^A-Za-z0-9]/.test(newPassword);

  if (!hasUppercase || !hasLowercase || !hasDigit || !hasSpecialCharacter) {
    throw new AppError(
      'Password must include uppercase, lowercase, number, and special character',
      400,
      'VALIDATION_ERROR',
    );
  }

  return {
    userId,
    newPassword,
  };
}
