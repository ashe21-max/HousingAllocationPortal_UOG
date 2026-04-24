import { AppError } from '../errorHandler/app-error.js';
import { normalizeEmail } from '../utils/normalize-user-input.js';
export function validateEmail(emailInput: string): string {
  const email = normalizeEmail(emailInput);

  if (!email) {
    throw new AppError('Email is required', 400, 'VALIDATION_ERROR');
  }

  if (email.length > 320) {
    throw new AppError(
      'Email must be 320 characters or fewer',
      400,
      'VALIDATION_ERROR',
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    throw new AppError('Email is invalid', 400, 'VALIDATION_ERROR');
  }

  return email;
}
