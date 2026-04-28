import type { NextFunction, Request, Response } from 'express';

import type { SetAdminUserStatusDto, UpdateAdminUserDto } from '../dtos/admin-user.dto.js';
import type { CreateUserDto } from '../dtos/create-user.dto.js';

import { AppError } from '../errorHandler/app-error.js';
import {
  deleteAdminUser,
  deleteAdminUserByEmail,
  editAdminUser,
  getAdminUserById,
  getAdminUsers,
  setAdminUserStatus,
} from '../services/admin-user.service.js';
import { createUser } from '../services/create-user.js';

export async function adminCreateUserController(
  req: Request<unknown, unknown, Partial<CreateUserDto>>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { name, email, role, department } = req.body;

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof role !== 'string' ||
      (department !== undefined &&
        department !== null &&
        typeof department !== 'string')
    ) {
      throw new AppError(
        'Name, email, role, and department are invalid',
        400,
        'VALIDATION_ERROR',
      );
    }

    const createdUser = await createUser({
      name,
      email,
      role,
      department: department ?? null,
    });
    res.status(201).json(createdUser);
  } catch (error) {
    // Handle duplicate email error specifically
    if (error instanceof AppError && error.message.includes('already exists')) {
      throw new AppError('Email already exists', 409, 'EMAIL_ALREADY_EXISTS');
    }
    next(error);
  }
}

export async function adminListUsersController(
  req: Request<
    unknown,
    unknown,
    unknown,
    {
      page?: string;
      pageSize?: string;
      search?: string;
      role?: string;
      isActive?: string;
    }
  >,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const users = await getAdminUsers(req.query);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

export async function adminGetUserController(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await getAdminUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function adminUpdateUserController(
  req: Request<{ id: string }, unknown, Partial<UpdateAdminUserDto>>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Authentication disabled for direct admin access
    const updated = await editAdminUser(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
}

export async function adminSetUserStatusController(
  req: Request<{ id: string }, unknown, Partial<SetAdminUserStatusDto>>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (typeof req.body.isActive !== 'boolean') {
      throw new AppError('isActive must be boolean', 400, 'VALIDATION_ERROR');
    }

    // Skip authentication check for direct activation/deactivation
    const updated = await setAdminUserStatus("", req.params.id, {
      isActive: req.body.isActive,
    });
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteUserController(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Authentication disabled for direct admin access
    const deleted = await deleteAdminUser("", req.params.id);
    res.status(200).json({ message: 'User deleted successfully', user: deleted });
  } catch (error) {
    next(error);
  }
}

export async function adminDeleteUserByEmailController(
  req: Request<{ email: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Authentication disabled for direct admin access
    const deleted = await deleteAdminUserByEmail(req.params.email);
    res.status(200).json({ message: 'User deleted successfully', user: deleted });
  } catch (error) {
    next(error);
  }
}
