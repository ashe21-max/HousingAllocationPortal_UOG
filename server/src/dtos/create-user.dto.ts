import type { UserRole } from '../lib/db/schema/auth.js';

export type UserDepartment =
  | 'College of Medicine and Health Sciences'
  | 'College of Business and Economics'
  | 'College of Natural and Computational Sciences'
  | 'College of Social Sciences and Humanities'
  | 'College of Veterinary Medicine and Animal Sciences'
  | 'College of Agriculture and Environmental Sciences'
  | 'College of Education'
  | 'College of Informatics';

export type CreateUserDto = {
  name: string;
  email: string;
  role: UserRole;
  department: UserDepartment | null;
};

export type CreatedUserDto = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: UserDepartment | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
};
