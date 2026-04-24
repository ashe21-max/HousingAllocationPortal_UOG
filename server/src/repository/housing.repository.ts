import { and, eq } from 'drizzle-orm';

import { db } from '../lib/db/index.js';
import { housingUnits } from '../lib/db/schema/housing.js';
import type {
  CreateHousingUnitDto,
  ListHousingUnitsQueryDto,
  UpdateHousingUnitDto,
} from '../dtos/housing.dto.js';

const housingUnitSelection = {
  id: housingUnits.id,
  buildingName: housingUnits.buildingName,
  blockNumber: housingUnits.blockNumber,
  roomNumber: housingUnits.roomNumber,
  roomType: housingUnits.roomType,
  condition: housingUnits.condition,
  status: housingUnits.status,
  location: housingUnits.location,
  createdAt: housingUnits.createdAt,
  updatedAt: housingUnits.updatedAt,
};

export async function createHousingUnit(input: Required<CreateHousingUnitDto>) {
  const [createdUnit] = await db
    .insert(housingUnits)
    .values({
      buildingName: input.buildingName,
      blockNumber: input.blockNumber,
      roomNumber: input.roomNumber,
      roomType: input.roomType,
      condition: input.condition,
      status: input.status,
      location: input.location,
    })
    .returning(housingUnitSelection);

  return createdUnit ?? null;
}

export async function findHousingUnits(filters: ListHousingUnitsQueryDto) {
  const conditions = [];

  if (filters.status) {
    conditions.push(eq(housingUnits.status, filters.status));
  }

  if (filters.roomType) {
    conditions.push(eq(housingUnits.roomType, filters.roomType));
  }

  const query = db.select(housingUnitSelection).from(housingUnits);

  if (conditions.length === 0) {
    return query;
  }

  if (conditions.length === 1) {
    return query.where(conditions[0]!);
  }

  return query.where(and(...conditions));
}

export async function findHousingUnitById(id: string) {
  const [unit] = await db
    .select(housingUnitSelection)
    .from(housingUnits)
    .where(eq(housingUnits.id, id))
    .limit(1);

  return unit ?? null;
}

export async function updateHousingUnit(input: UpdateHousingUnitDto) {
  const [updatedUnit] = await db
    .update(housingUnits)
    .set({
      ...(input.buildingName ? { buildingName: input.buildingName } : {}),
      ...(input.blockNumber ? { blockNumber: input.blockNumber } : {}),
      ...(input.roomNumber ? { roomNumber: input.roomNumber } : {}),
      ...(input.roomType ? { roomType: input.roomType } : {}),
      ...(input.status ? { status: input.status } : {}),
      ...(input.condition ? { condition: input.condition } : {}),
      ...(input.location ? { location: input.location } : {}),
      updatedAt: new Date(),
    })
    .where(eq(housingUnits.id, input.id))
    .returning(housingUnitSelection);

  return updatedUnit ?? null;
}

export async function deleteHousingUnit(id: string) {
  const [deletedUnit] = await db
    .delete(housingUnits)
    .where(eq(housingUnits.id, id))
    .returning({
      id: housingUnits.id,
    });

  return deletedUnit ?? null;
}
