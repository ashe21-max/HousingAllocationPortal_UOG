import { AppError } from '../errorHandler/app-error.js';
import {
  housingConditionEnum,
  housingStatusEnum,
  roomTypeEnum,
  type HousingCondition,
  type HousingStatus,
  type RoomType,
} from '../lib/db/schema/housing.js';
import type {
  CreateHousingUnitDto,
  ListHousingUnitsQueryDto,
  UpdateHousingUnitDto,
} from '../dtos/housing.dto.js';

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function requireNonEmptyString(value: string, fieldName: string): string {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    throw new AppError(`${fieldName} is required`, 400, 'VALIDATION_ERROR');
  }

  return normalizedValue;
}

function validateEnumValue<T extends string>(
  value: string,
  allowedValues: readonly T[],
  fieldName: string,
): T {
  if (!allowedValues.includes(value as T)) {
    throw new AppError(`${fieldName} is invalid`, 400, 'VALIDATION_ERROR');
  }

  return value as T;
}

export function validateHousingUnitId(idInput: string): string {
  const id = idInput.trim();

  if (!id) {
    throw new AppError('House id is required', 400, 'VALIDATION_ERROR');
  }

  if (!uuidPattern.test(id)) {
    throw new AppError('House id must be a valid UUID', 400, 'VALIDATION_ERROR');
  }

  return id;
}

export function validateCreateHousingUnitInput(
  input: CreateHousingUnitDto,
): Required<CreateHousingUnitDto> {
  return {
    buildingName: requireNonEmptyString(input.buildingName, 'Building name'),
    blockNumber: requireNonEmptyString(input.blockNumber, 'Block number'),
    roomNumber: requireNonEmptyString(input.roomNumber, 'Room number'),
    roomType: validateEnumValue(
      input.roomType,
      roomTypeEnum.enumValues,
      'Room type',
    ),
    condition: validateEnumValue(
      input.condition,
      housingConditionEnum.enumValues,
      'Condition',
    ),
    status: validateEnumValue(
      input.status ?? 'Available',
      housingStatusEnum.enumValues,
      'Status',
    ),
    location: requireNonEmptyString(input.location, 'Location'),
  };
}

export function validateListHousingUnitsQuery(
  input: ListHousingUnitsQueryDto,
): ListHousingUnitsQueryDto {
  const output: ListHousingUnitsQueryDto = {};

  if (input.status) {
    output.status = validateEnumValue(
      input.status,
      housingStatusEnum.enumValues,
      'Status',
    ) as HousingStatus;
  }

  if (input.roomType) {
    output.roomType = validateEnumValue(
      input.roomType,
      roomTypeEnum.enumValues,
      'Room type',
    ) as RoomType;
  }

  return output;
}

export function validateUpdateHousingUnitInput(
  input: UpdateHousingUnitDto,
): UpdateHousingUnitDto {
  const id = validateHousingUnitId(input.id);

  if (
    !input.buildingName &&
    !input.blockNumber &&
    !input.roomNumber &&
    !input.roomType &&
    !input.status &&
    !input.condition &&
    !input.location
  ) {
    throw new AppError(
      'At least one housing field is required',
      400,
      'VALIDATION_ERROR',
    );
  }

  const output: UpdateHousingUnitDto = { id };

  if (input.buildingName) {
    output.buildingName = requireNonEmptyString(
      input.buildingName,
      'Building name',
    );
  }

  if (input.blockNumber) {
    output.blockNumber = requireNonEmptyString(
      input.blockNumber,
      'Block number',
    );
  }

  if (input.roomNumber) {
    output.roomNumber = requireNonEmptyString(
      input.roomNumber,
      'Room number',
    );
  }

  if (input.roomType) {
    output.roomType = validateEnumValue(
      input.roomType,
      roomTypeEnum.enumValues,
      'Room type',
    ) as RoomType;
  }

  if (input.status) {
    output.status = validateEnumValue(
      input.status,
      housingStatusEnum.enumValues,
      'Status',
    ) as HousingStatus;
  }

  if (input.condition) {
    output.condition = validateEnumValue(
      input.condition,
      housingConditionEnum.enumValues,
      'Condition',
    ) as HousingCondition;
  }

  if (input.location) {
    output.location = requireNonEmptyString(input.location, 'Location');
  }

  return output;
}
