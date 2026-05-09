import type { NextFunction, Request, Response } from 'express';

import type {
  CommitteeApplicationListQueryDto,
  CommitteeReviewApplicationDto,
} from '../dtos/committee.dto.js';
import { AppError } from '../errorHandler/app-error.js';
import {
  generateRoundRanking,
  getCommitteeApplicationDetails,
  getCommitteeDocumentForDownload,
  listRoundRanking,
  listCommitteeApplications,
  reviewCommitteeApplication,
  saveManualRoundRanking,
  submitRoundFinal,
  submitRoundPreliminary,
} from '../services/committee.service.js';

export async function listCommitteeApplicationsController(
  req: Request<unknown, unknown, unknown, CommitteeApplicationListQueryDto>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const applications = await listCommitteeApplications(req.query);
    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
}

export async function getCommitteeApplicationDetailsController(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const details = await getCommitteeApplicationDetails(req.params.id);
    res.status(200).json(details);
  } catch (error) {
    next(error);
  }
}

export async function reviewCommitteeApplicationController(
  req: Request<{ id: string }, unknown, Partial<CommitteeReviewApplicationDto>>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const payload: CommitteeReviewApplicationDto = {
      status: typeof req.body.status === 'string' ? req.body.status : '',
    };

    if (typeof req.body.complianceIssue === 'boolean') {
      payload.complianceIssue = req.body.complianceIssue;
    }

    if (typeof req.body.complianceNotes === 'string') {
      payload.complianceNotes = req.body.complianceNotes;
    }

    if (typeof req.body.notes === 'string') {
      payload.notes = req.body.notes;
    }

    const updated = await reviewCommitteeApplication(
      req.user.userId,
      req.params.id,
      payload,
    );

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
}

export async function downloadCommitteeDocumentController(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const document = await getCommitteeDocumentForDownload(req.params.id);
    res.download(document.storagePath, document.originalFileName);
  } catch (error) {
    next(error);
  }
}

export async function generateRoundRankingController(
  req: Request<{ roundId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const ranking = await generateRoundRanking(req.params.roundId, req.user.userId);
    res.status(200).json(ranking);
  } catch (error) {
    next(error);
  }
}

export async function listRoundRankingController(
  req: Request<{ roundId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const ranking = await listRoundRanking(req.params.roundId);
    res.status(200).json(ranking);
  } catch (error) {
    next(error);
  }
}

export async function saveManualRoundRankingController(
  req: Request<{ roundId: string }, unknown, { entries: unknown }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const ranking = await saveManualRoundRanking(
      req.params.roundId,
      req.user.userId,
      req.body.entries,
    );
    res.status(200).json(ranking);
  } catch (error) {
    next(error);
  }
}

export async function submitRoundPreliminaryController(
  req: Request<{ roundId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const updatedRound = await submitRoundPreliminary(req.params.roundId, req.user.userId);
    res.status(200).json(updatedRound);
  } catch (error) {
    next(error);
  }
}

export async function submitRoundFinalController(
  req: Request<{ roundId: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const updatedRound = await submitRoundFinal(req.params.roundId, req.user.userId);
    res.status(200).json(updatedRound);
  } catch (error) {
    next(error);
  }
}
