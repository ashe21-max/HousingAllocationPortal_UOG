import type { Request, Response, NextFunction } from 'express';
import {
  listAnnouncements,
  getActiveAnnouncements,
  createAnnouncementService,
  updateAnnouncementService,
  deleteAnnouncementService,
  getAnnouncementById,
} from '../services/announcement.service.js';
import { AppError } from '../errorHandler/app-error.js';

export async function listAnnouncementsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const announcements = await listAnnouncements({
      isActive: req.query.isActive === 'true' ? true : undefined,
      targetRoles: req.query.targetRoles
        ? String(req.query.targetRoles).split(',')
        : undefined,
    });
    res.json({ items: announcements });
  } catch (error) {
    next(error);
  }
}

export async function getActiveAnnouncementsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userRole = req.user?.role;
    const targetTypes = userRole === "LECTURER" ? ["ALL_USERS", "LECTURERS"] : ["ALL_USERS"];
    const announcements = await getActiveAnnouncements(targetTypes);
    res.json({ items: announcements });
  } catch (error) {
    next(error);
  }
}

export async function createAnnouncementController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, content, type, targetRoles, startsAt, endsAt } = req.body;
    const createdBy = String(req.user?.id);

    if (!createdBy || createdBy === 'undefined') {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    if (!title || !content || !type) {
      throw new AppError('Title, content, and type are required', 400, 'VALIDATION_ERROR');
    }

    const announcement = await createAnnouncementService({
      title,
      content,
      type,
      targetRoles,
      startsAt: startsAt ? new Date(startsAt) : undefined,
      endsAt: endsAt ? new Date(endsAt) : undefined,
      createdBy,
    });

    res.status(201).json(announcement);
  } catch (error) {
    console.error('Create announcement error:', error);
    next(error);
  }
}

export async function updateAnnouncementController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = String(req.params.id);
    const { title, content, type, targetRoles, isActive, startsAt, endsAt } = req.body;

    const announcement = await getAnnouncementById(id);
    if (!announcement) {
      throw new AppError('Announcement not found', 404, 'NOT_FOUND');
    }

    const updated = await updateAnnouncementService(String(id), {
      title,
      content,
      type,
      targetRoles,
      isActive,
      startsAt: startsAt ? new Date(startsAt) : undefined,
      endsAt: endsAt ? new Date(endsAt) : undefined,
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function deleteAnnouncementController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = String(req.params.id);

    const announcement = await getAnnouncementById(id);
    if (!announcement) {
      throw new AppError('Announcement not found', 404, 'NOT_FOUND');
    }

    await deleteAnnouncementService(String(id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
