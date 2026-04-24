import type { UserRole } from '../lib/db/schema/auth.js';
import type { UserDepartment } from '../dtos/create-user.dto.js';

export const departmentRoles = new Set<UserRole>(['LECTURER', 'COMMITTEE']);

export const allowedDepartments = new Set<UserDepartment>([
  'College of Medicine and Health Sciences',
  'College of Business and Economics',
  'College of Natural and Computational Sciences',
  'College of Social Sciences and Humanities',
  'College of Veterinary Medicine and Animal Sciences',
  'College of Agriculture and Environmental Sciences',
  'College of Education',
  'College of Informatics',
]);
