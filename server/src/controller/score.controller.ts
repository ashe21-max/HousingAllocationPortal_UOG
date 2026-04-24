import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../errorHandler/app-error.js';
import { calculateApplicationScore } from '../services/scoring/calculate-application-score.js';
import {
  getLecturerScoreState,
  saveLecturerCriteriaDraft,
} from '../services/scoring/lecturer-score-state.service.js';
import { mapCriteriaToNumericInput } from '../services/scoring/map-criteria-to-numeric-input.js';
import { validatePreviewCriteriaInput } from '../validators/preview-criteria.validator.js';

export function previewScoreController(
  req: Request<unknown, unknown, unknown>,
  res: Response,
  next: NextFunction,
): void {
  try {
    const criteria = validatePreviewCriteriaInput(req.body);
    const derivedNumericInput = mapCriteriaToNumericInput(criteria);
    const result = calculateApplicationScore(derivedNumericInput);
    res.status(200).json({
      ...result,
      meta: {
        scoringModel: 'criteria_stub_v1',
        derivedNumericInput,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyScoreController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
      return;
    }

    const state = await getLecturerScoreState(req.user.userId);
    res.status(200).json(state);
  } catch (error) {
    next(error);
  }
}

export async function saveMyCriteriaController(
  req: Request<unknown, unknown, unknown>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
      return;
    }

    console.log('Score save request body:', req.body);
    console.log('User ID:', req.user.userId);
    
    const input = validatePreviewCriteriaInput(req.body);
    console.log('Validated input:', input);
    
    const { criteria, latestSnapshot } = await saveLecturerCriteriaDraft(
      req.user.userId,
      input,
    );
    console.log('Score saved successfully:', { criteria, latestSnapshot });
    
    res.status(200).json({ criteria, latestSnapshot });
  } catch (error) {
    console.error('Score save error:', error);
    next(error);
  }
}
