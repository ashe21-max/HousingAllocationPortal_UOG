import type { UserRole } from '../lib/db/schema/auth.js';
import type { UserDepartment } from './create-user.dto.js';

export type ListAdminUsersQueryDto = {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
};

export type UpdateAdminUserDto = {
  name?: string;
  email?: string;
  role?: UserRole;
  department?: UserDepartment | null;
};

export type SetAdminUserStatusDto = {
  isActive: boolean;
};
