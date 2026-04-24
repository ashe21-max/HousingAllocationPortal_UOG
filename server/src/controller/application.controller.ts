import type { NextFunction, Request, Response } from 'express';

import type { SaveApplicationDraftDto } from '../dtos/application.dto.js';
import { AppError } from '../errorHandler/app-error.js';
import {
  getApplicationFormOptions,
  getMyDepartmentAllocationResults,
  getMyApplications,
  saveMyApplicationDraft,
  submitMyApplication,
} from '../services/application.service.js';

export async function saveApplicationDraftController(
  req: Request<unknown, unknown, Partial<SaveApplicationDraftDto>>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const { roundId, preferredHousingUnitId, notes } = req.body;

    if (
      typeof roundId !== 'string' ||
      (preferredHousingUnitId !== undefined &&
        preferredHousingUnitId !== null &&
        typeof preferredHousingUnitId !== 'string') ||
      (notes !== undefined && notes !== null && typeof notes !== 'string')
    ) {
      throw new AppError(
        'roundId, preferredHousingUnitId, and notes are invalid',
        400,
        'VALIDATION_ERROR',
      );
    }

    const draft = await saveMyApplicationDraft(req.user.userId, {
      roundId,
      preferredHousingUnitId: preferredHousingUnitId ?? null,
      notes: notes ?? null,
    });

    res.status(200).json(draft);
  } catch (error) {
    next(error);
  }
}

export async function submitApplicationController(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const submitted = await submitMyApplication(req.user.userId, req.params.id);
    res.status(200).json(submitted);
  } catch (error) {
    next(error);
  }
}

export async function getMyApplicationsController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const applications = await getMyApplications(req.user.userId);
    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
}

export async function getApplicationOptionsController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const options = await getApplicationFormOptions();
    res.status(200).json(options);
  } catch (error) {
    next(error);
  }
}

export async function getMyDepartmentResultsController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const results = await getMyDepartmentAllocationResults(req.user.userId);
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
}
