import { AppError } from '../errorHandler/app-error.js';
import { allowedDepartments, departmentRoles } from '../constants/user.js';
import type { UserDepartment } from '../dtos/create-user.dto.js';
import type {
  ListAdminUsersQueryDto,
  SetAdminUserStatusDto,
  UpdateAdminUserDto,
} from '../dtos/admin-user.dto.js';
import { normalizeName } from '../utils/normalize-user-input.js';
import { validateEmail } from './email.validator.js';

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const allowedRoles = new Set(['ADMIN', 'LECTURER', 'OFFICER', 'COMMITTEE']);

export function validateAdminUserId(idInput: string): string {
  const id = idInput.trim();
  if (!id) {
    throw new AppError('User id is required', 400, 'VALIDATION_ERROR');
  }
  if (!uuidPattern.test(id)) {
    throw new AppError('User id must be a valid UUID', 400, 'VALIDATION_ERROR');
  }
  return id;
}

export function validateUpdateAdminUserInput(input: UpdateAdminUserDto) {
  const out: UpdateAdminUserDto = {};

  if (
    input.name === undefined &&
    input.email === undefined &&
    input.role === undefined &&
    input.department === undefined
  ) {
    throw new AppError(
      'At least one field is required to update user',
      400,
      'VALIDATION_ERROR',
    );
  }

  if (input.name !== undefined) {
    const name = normalizeName(input.name);
    if (!name || name.length < 3 || name.length > 255 || /\d/.test(name)) {
      throw new AppError('Name is invalid', 400, 'VALIDATION_ERROR');
    }
    out.name = name;
  }

  if (input.email !== undefined) {
    out.email = validateEmail(input.email);
  }

  if (input.role !== undefined) {
    if (!allowedRoles.has(input.role)) {
      throw new AppError('Role is invalid', 400, 'VALIDATION_ERROR');
    }
    out.role = input.role;
  }

  if (input.department !== undefined) {
    const normalizedDepartment = input.department
      ? normalizeName(input.department)
      : null;

    if (
      normalizedDepartment &&
      !allowedDepartments.has(normalizedDepartment as UserDepartment)
    ) {
      throw new AppError('Department is invalid', 400, 'VALIDATION_ERROR');
    }

    out.department = normalizedDepartment as UserDepartment | null;
  }

  if (out.role !== undefined || out.department !== undefined) {
    const role = out.role ?? input.role;
    const department = out.department ?? input.department ?? null;

    if (role && departmentRoles.has(role) && !department) {
      throw new AppError(
        'Department is required for lecturer and committee roles',
        400,
        'VALIDATION_ERROR',
      );
    }

    if (role && !departmentRoles.has(role) && department) {
      throw new AppError(
        'Department can only be assigned to lecturer and committee roles',
        400,
        'VALIDATION_ERROR',
      );
    }
  }

  return out;
}

export function validateAdminUserStatusInput(input: SetAdminUserStatusDto) {
  if (typeof input.isActive !== 'boolean') {
    throw new AppError('isActive must be boolean', 400, 'VALIDATION_ERROR');
  }
  return input;
}

export function validateListAdminUsersQuery(input: {
  page?: string;
  pageSize?: string;
  search?: string;
  role?: string;
  isActive?: string;
}): Required<Pick<ListAdminUsersQueryDto, 'page' | 'pageSize'>> &
  Omit<ListAdminUsersQueryDto, 'page' | 'pageSize'> {
  const pageRaw = input.page?.trim();
  const page = pageRaw ? Number(pageRaw) : 1;

  const pageSizeRaw = input.pageSize?.trim();
  const pageSize = pageSizeRaw ? Number(pageSizeRaw) : 10;

  if (!Number.isInteger(page) || page <= 0) {
    throw new AppError('page must be a positive integer', 400, 'VALIDATION_ERROR');
  }

  if (!Number.isInteger(pageSize) || pageSize <= 0 || pageSize > 100) {
    throw new AppError(
      'pageSize must be an integer between 1 and 100',
      400,
      'VALIDATION_ERROR',
    );
  }

  const out: Required<Pick<ListAdminUsersQueryDto, 'page' | 'pageSize'>> &
    Omit<ListAdminUsersQueryDto, 'page' | 'pageSize'> = {
    page,
    pageSize,
  };

  const search = input.search?.trim();
  if (search) {
    out.search = search;
  }

  const role = input.role?.trim();
  if (role) {
    if (!allowedRoles.has(role)) {
      throw new AppError('role is invalid', 400, 'VALIDATION_ERROR');
    }
    out.role = role as NonNullable<ListAdminUsersQueryDto['role']>;
  }

  const isActiveRaw = input.isActive?.trim().toLowerCase();
  if (isActiveRaw) {
    if (isActiveRaw === 'true') {
      out.isActive = true;
    } else if (isActiveRaw === 'false') {
      out.isActive = false;
    } else {
      throw new AppError('isActive must be true or false', 400, 'VALIDATION_ERROR');
    }
  }

  return out;
}
