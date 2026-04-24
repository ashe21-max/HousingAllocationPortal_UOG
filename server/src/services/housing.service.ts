import { AppError } from '../errorHandler/app-error.js';
import type { PostgresError } from '../types/postgres.js';
import type {
  CreateHousingUnitDto,
  ListHousingUnitsQueryDto,
  UpdateHousingUnitDto,
} from '../dtos/housing.dto.js';
import {
  createHousingUnit,
  deleteHousingUnit,
  findHousingUnitById,
  findHousingUnits,
  updateHousingUnit,
} from '../repository/housing.repository.js';
import {
  validateCreateHousingUnitInput,
  validateHousingUnitId,
  validateListHousingUnitsQuery,
  validateUpdateHousingUnitInput,
} from '../validators/housing.validator.js';

export async function registerHousingUnit(input: CreateHousingUnitDto) {
  const validatedInput = validateCreateHousingUnitInput(input);

  try {
    const createdUnit = await createHousingUnit(validatedInput);

    if (!createdUnit) {
      throw new AppError('Failed to create house', 500, 'HOUSE_CREATE_FAILED');
    }

    return createdUnit;
  } catch (error) {
    const databaseError = error as PostgresError;

    if (databaseError.code === '23505') {
      throw new AppError(
        'A room with this block number and room number already exists',
        409,
        'HOUSE_ALREADY_EXISTS',
      );
    }

    throw error;
  }
}

export async function getHousingUnits(filters: ListHousingUnitsQueryDto) {
  const validatedFilters = validateListHousingUnitsQuery(filters);
  return findHousingUnits(validatedFilters);
}

export async function getHousingUnitDetails(idInput: string) {
  const id = validateHousingUnitId(idInput);
  const unit = await findHousingUnitById(id);

  if (!unit) {
    throw new AppError('House not found', 404, 'HOUSE_NOT_FOUND');
  }

  return unit;
}

export async function updateHousingUnitDetails(input: UpdateHousingUnitDto) {
  const validatedInput = validateUpdateHousingUnitInput(input);
  const unit = await updateHousingUnit(validatedInput);

  if (!unit) {
    throw new AppError('House not found', 404, 'HOUSE_NOT_FOUND');
  }

  return unit;
}

export async function removeHousingUnit(idInput: string) {
  const id = validateHousingUnitId(idInput);
  const deletedUnit = await deleteHousingUnit(id);

  if (!deletedUnit) {
    throw new AppError('House not found', 404, 'HOUSE_NOT_FOUND');
  }

  return { success: true };
}
