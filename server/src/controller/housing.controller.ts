import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../errorHandler/app-error.js';
import type {
  CreateHousingUnitDto,
  ListHousingUnitsQueryDto,
  UpdateHousingUnitDto,
} from '../dtos/housing.dto.js';
import {
  getHousingUnitDetails,
  getHousingUnits,
  registerHousingUnit,
  removeHousingUnit,
  updateHousingUnitDetails,
} from '../services/housing.service.js';

export async function createHousingUnitController(
  req: Request<unknown, unknown, Partial<CreateHousingUnitDto>>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const {
      buildingName,
      blockNumber,
      roomNumber,
      roomType,
      condition,
      status,
      location,
    } = req.body;

    if (
      typeof buildingName !== 'string' ||
      typeof blockNumber !== 'string' ||
      typeof roomNumber !== 'string' ||
      typeof roomType !== 'string' ||
      typeof condition !== 'string' ||
      typeof location !== 'string'
    ) {
      throw new AppError(
        'buildingName, blockNumber, roomNumber, roomType, condition, and location are required',
        400,
        'VALIDATION_ERROR',
      );
    }

    const unit = await registerHousingUnit({
      buildingName,
      blockNumber,
      roomNumber,
      roomType,
      condition,
      ...(typeof status === 'string' ? { status } : {}),
      location,
    });

    res.status(201).json(unit);
  } catch (error) {
    next(error);
  }
}

export async function listHousingUnitsController(
  req: Request<unknown, unknown, unknown, { status?: string; room_type?: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const units = await getHousingUnits({
      status: req.query.status,
      roomType: req.query.room_type,
    } as ListHousingUnitsQueryDto);

    res.status(200).json(units);
  } catch (error) {
    next(error);
  }
}

export async function getHousingUnitController(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const unit = await getHousingUnitDetails(req.params.id);
    res.status(200).json(unit);
  } catch (error) {
    next(error);
  }
}

export async function updateHousingUnitController(
  req: Request<{ id: string }, unknown, Partial<UpdateHousingUnitDto>>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const {
      buildingName,
      blockNumber,
      roomNumber,
      roomType,
      status,
      condition,
      location,
    } = req.body;

    if (buildingName !== undefined && typeof buildingName !== 'string') {
      throw new AppError('Building name must be a string', 400, 'VALIDATION_ERROR');
    }

    if (blockNumber !== undefined && typeof blockNumber !== 'string') {
      throw new AppError('Block number must be a string', 400, 'VALIDATION_ERROR');
    }

    if (roomNumber !== undefined && typeof roomNumber !== 'string') {
      throw new AppError('Room number must be a string', 400, 'VALIDATION_ERROR');
    }

    if (roomType !== undefined && typeof roomType !== 'string') {
      throw new AppError('Room type must be a string', 400, 'VALIDATION_ERROR');
    }

    if (
      status !== undefined &&
      typeof status !== 'string'
    ) {
      throw new AppError('Status must be a string', 400, 'VALIDATION_ERROR');
    }

    if (
      condition !== undefined &&
      typeof condition !== 'string'
    ) {
      throw new AppError('Condition must be a string', 400, 'VALIDATION_ERROR');
    }

    if (location !== undefined && typeof location !== 'string') {
      throw new AppError('Location must be a string', 400, 'VALIDATION_ERROR');
    }

    const unit = await updateHousingUnitDetails({
      id: req.params.id,
      ...(typeof buildingName === 'string' ? { buildingName } : {}),
      ...(typeof blockNumber === 'string' ? { blockNumber } : {}),
      ...(typeof roomNumber === 'string' ? { roomNumber } : {}),
      ...(typeof roomType === 'string' ? { roomType } : {}),
      ...(typeof status === 'string' ? { status } : {}),
      ...(typeof condition === 'string' ? { condition } : {}),
      ...(typeof location === 'string' ? { location } : {}),
    });

    res.status(200).json(unit);
  } catch (error) {
    next(error);
  }
}

export async function deleteHousingUnitController(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await removeHousingUnit(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
