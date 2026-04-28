import { AppError } from '../errorHandler/app-error.js';
import type { PostgresError } from '../types/postgres.js';
import type {
  SetAdminUserStatusDto,
  UpdateAdminUserDto,
} from '../dtos/admin-user.dto.js';
import {
  deleteAdminManagedUser,
  findAdminManagedUserById,
  findUserByEmail,
  listAdminManagedUsersPaginated,
  setAdminManagedUserActiveStatus,
  updateAdminManagedUser,
} from '../repository/user.repository.js';
import {
  validateAdminUserId,
  validateListAdminUsersQuery,
  validateAdminUserStatusInput,
  validateUpdateAdminUserInput,
} from '../validators/admin-user.validator.js';

export async function getAdminUsers(
  queryInput: {
    page?: string;
    pageSize?: string;
    search?: string;
    role?: string;
    isActive?: string;
  },
) {
  const query = validateListAdminUsersQuery(queryInput);
  return listAdminManagedUsersPaginated(query);
}

export async function getAdminUserById(userIdInput: string) {
  const userId = validateAdminUserId(userIdInput);
  const user = await findAdminManagedUserById(userId);

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  return user;
}

export async function editAdminUser(
  userIdInput: string,
  input: UpdateAdminUserDto,
) {
  const userId = validateAdminUserId(userIdInput);
  const validatedInput = validateUpdateAdminUserInput(input);
  const existing = await findAdminManagedUserById(userId);

  if (!existing) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  try {
    const updated = await updateAdminManagedUser(userId, validatedInput);
    if (!updated) {
      throw new AppError('Failed to update user', 500, 'USER_UPDATE_FAILED');
    }
    return updated;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    const databaseError = error as PostgresError;
    if (databaseError.code === '23505') {
      throw new AppError('Email already exists', 409, 'EMAIL_ALREADY_EXISTS');
    }
    throw error;
  }
}

export async function setAdminUserStatus(
  actorUserId: string,
  userIdInput: string,
  input: SetAdminUserStatusDto,
) {
  const userId = validateAdminUserId(userIdInput);
  const validated = validateAdminUserStatusInput(input);

  // Skip self-deactivation check for direct admin actions
  const existing = await findAdminManagedUserById(userId);
  if (!existing) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  const updated = await setAdminManagedUserActiveStatus(userId, validated.isActive);
  if (!updated) {
    throw new AppError('Failed to update user status', 500, 'USER_UPDATE_FAILED');
  }

  return updated;
}

export async function deleteAdminUser(
  actorUserId: string,
  userIdInput: string,
) {
  const userId = validateAdminUserId(userIdInput);

  // Authentication disabled for direct admin access
  const existing = await findAdminManagedUserById(userId);
  if (!existing) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  const deleted = await deleteAdminManagedUser(userId);
  if (!deleted) {
    throw new AppError('Failed to delete user', 500, 'USER_DELETE_FAILED');
  }

  return deleted;
}

export async function deleteAdminUserByEmail(email: string) {
  if (!email || typeof email !== 'string') {
    throw new AppError('Email is required', 400, 'VALIDATION_ERROR');
  }

  // Find user by email first
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  // Delete by ID
  const deleted = await deleteAdminManagedUser(user.id);
  if (!deleted) {
    throw new AppError('Failed to delete user', 500, 'USER_DELETE_FAILED');
  }

  return deleted;
}
