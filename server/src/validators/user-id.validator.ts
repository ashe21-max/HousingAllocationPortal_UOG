import { AppError } from '../errorHandler/app-error.js';

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validateUserId(userIdInput: string): string {
  const userId = userIdInput.trim();
  if (!userId) {
    throw new AppError('User id is required', 400, 'VALIDATION_ERROR');
  }
  if (!uuidPattern.test(userId)) {
    throw new AppError('User id must be a valid UUID', 400, 'VALIDATION_ERROR');
  }
  return userId;
}
