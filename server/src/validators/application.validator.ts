import type {
  SaveApplicationDraftDto,
  SaveApplicationDraftInput,
} from '../dtos/application.dto.js';
import { AppError } from '../errorHandler/app-error.js';

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validateUuid(value: string, fieldName: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new AppError(`${fieldName} is required`, 400, 'VALIDATION_ERROR');
  }

  if (!uuidPattern.test(normalized)) {
    throw new AppError(
      `${fieldName} must be a valid UUID`,
      400,
      'VALIDATION_ERROR',
    );
  }

  return normalized;
}

export function validateSaveApplicationDraftInput(
  input: SaveApplicationDraftDto,
): SaveApplicationDraftInput {
  const roundId = validateUuid(input.roundId, 'Round id');

  let preferredHousingUnitId: string | null = null;
  if (typeof input.preferredHousingUnitId === 'string') {
    preferredHousingUnitId = validateUuid(
      input.preferredHousingUnitId,
      'Preferred housing unit id',
    );
  } else if (input.preferredHousingUnitId === null) {
    preferredHousingUnitId = null;
  }

  let notes: string | null = null;
  if (typeof input.notes === 'string') {
    const normalizedNotes = input.notes.trim();
    notes = normalizedNotes.length > 0 ? normalizedNotes : null;
  } else if (input.notes === null) {
    notes = null;
  }

  return {
    roundId,
    preferredHousingUnitId,
    notes,
  };
}

export function validateApplicationId(idInput: string): string {
  return validateUuid(idInput, 'Application id');
}
