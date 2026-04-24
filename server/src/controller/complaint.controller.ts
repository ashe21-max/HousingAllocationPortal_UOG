import type { NextFunction, Request, Response } from 'express';

import type {
  CreateComplaintThreadDto,
  SendComplaintMessageDto,
} from '../dtos/complaint.dto.js';
import { AppError } from '../errorHandler/app-error.js';
import {
  createLecturerComplaintThread,
  getCommitteeComplaintThreadDetails,
  getCommitteeComplaintThreads,
  getLecturerComplaintThreadDetails,
  getLecturerComplaintThreads,
  sendCommitteeComplaintMessage,
  sendLecturerComplaintMessage,
} from '../services/complaint.service.js';

export async function createLecturerComplaintThreadController(
  req: Request<unknown, unknown, Partial<CreateComplaintThreadDto>>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const created = await createLecturerComplaintThread(req.user.userId, {
      targetDepartment:
        typeof req.body.targetDepartment === 'string' ? req.body.targetDepartment : '',
      subject: typeof req.body.subject === 'string' ? req.body.subject : '',
      message: typeof req.body.message === 'string' ? req.body.message : '',
    });

    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
}

export async function listLecturerComplaintThreadsController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }
    const threads = await getLecturerComplaintThreads(req.user.userId);
    res.status(200).json(threads);
  } catch (error) {
    next(error);
  }
}

export async function getLecturerComplaintThreadController(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }
    const details = await getLecturerComplaintThreadDetails(req.user.userId, req.params.id);
    res.status(200).json(details);
  } catch (error) {
    next(error);
  }
}

export async function sendLecturerComplaintMessageController(
  req: Request<{ id: string }, unknown, Partial<SendComplaintMessageDto>>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }
    const message = await sendLecturerComplaintMessage(req.user.userId, req.params.id, {
      message: typeof req.body.message === 'string' ? req.body.message : '',
    });
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
}

export async function listCommitteeComplaintThreadsController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }
    const threads = await getCommitteeComplaintThreads(req.user.userId);
    res.status(200).json(threads);
  } catch (error) {
    next(error);
  }
}

export async function getCommitteeComplaintThreadController(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }
    const details = await getCommitteeComplaintThreadDetails(req.user.userId, req.params.id);
    res.status(200).json(details);
  } catch (error) {
    next(error);
  }
}

export async function sendCommitteeComplaintMessageController(
  req: Request<{ id: string }, unknown, Partial<SendComplaintMessageDto>>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }
    const message = await sendCommitteeComplaintMessage(req.user.userId, req.params.id, {
      message: typeof req.body.message === 'string' ? req.body.message : '',
    });
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
}
