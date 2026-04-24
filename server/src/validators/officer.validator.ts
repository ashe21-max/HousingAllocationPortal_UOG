import { AppError } from '../errorHandler/app-error.js';

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validateOfficerRoundId(roundIdInput: string): string {
  const roundId = roundIdInput.trim();
  if (!roundId) {
    throw new AppError('Round id is required', 400, 'VALIDATION_ERROR');
  }
  if (!uuidPattern.test(roundId)) {
    throw new AppError('Round id must be a valid UUID', 400, 'VALIDATION_ERROR');
  }
  return roundId;
}
