import type { NextFunction, Request, Response } from 'express';

import type {
  CreateOfficerRoundDto,
  UpdateOfficerRoundStatusDto,
} from '../dtos/officer-round.dto.js';
import { AppError } from '../errorHandler/app-error.js';
import {
  createOfficerRound,
  getOfficerAvailableHouses,
  getOfficerManagedRounds,
  getOfficerRoundAllocationResults,
  getOfficerRoundsReadyForAllocation,
  runOfficerRoundAllocation,
  updateOfficerRoundStatus,
} from '../services/officer-allocation.service.js';

export async function listOfficerRoundsController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const rounds = await getOfficerRoundsReadyForAllocation();
    res.status(200).json(rounds);
  } catch (error) {
    next(error);
  }
}

export async function listOfficerManagedRoundsController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const rounds = await getOfficerManagedRounds();
    res.status(200).json(rounds);
  } catch (error) {
    next(error);
  }
}

export async function createOfficerRoundController(
  req: Request<unknown, unknown, Partial<CreateOfficerRoundDto>>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    if (typeof req.body.status !== 'string') {
      throw new AppError('status is required', 400, 'VALIDATION_ERROR');
    }

    const created = await createOfficerRound(req.user.userId, {
      name: typeof req.body.name === 'string' ? req.body.name : '',
      description:
        typeof req.body.description === 'string' ? req.body.description : null,
      status: req.body.status,
      startsAt: typeof req.body.startsAt === 'string' ? req.body.startsAt : '',
      endsAt: typeof req.body.endsAt === 'string' ? req.body.endsAt : '',
    });

    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
}

export async function updateOfficerRoundStatusController(
  req: Request<{ roundId: string }, unknown, Partial<UpdateOfficerRoundStatusDto>>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    if (typeof req.body.status !== 'string') {
      throw new AppError('status is required', 400, 'VALIDATION_ERROR');
    }

    const updated = await updateOfficerRoundStatus(req.params.roundId, {
      status: req.body.status,
    });

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
}

export async function listOfficerAvailableHousesController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const houses = await getOfficerAvailableHouses();
    res.status(200).json(houses);
  } catch (error) {
    next(error);
  }
}

export async function runOfficerAllocationController(
  req: Request<{ roundId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const output = await runOfficerRoundAllocation(req.params.roundId, req.user.userId);
    res.status(200).json(output);
  } catch (error) {
    next(error);
  }
}

export async function listOfficerRoundAllocationResultsController(
  req: Request<{ roundId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const results = await getOfficerRoundAllocationResults(req.params.roundId);
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
}
