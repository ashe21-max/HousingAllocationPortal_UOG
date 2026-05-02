import { AppError } from '../errorHandler/app-error.js';

import { allowedDepartments, departmentRoles } from '../constants/user.js';

import type { CreateUserDto, UserDepartment } from '../dtos/create-user.dto.js';

import { normalizeName } from '../utils/normalize-user-input.js';

import { validateEmail } from './email.validator.js';



const allowedRoles = new Set(['ADMIN', 'LECTURER', 'OFFICER', 'COMMITTEE']);



export function validateCreateUserInput(input: CreateUserDto): CreateUserDto {

  const name = normalizeName(input.name);

  const email = validateEmail(input.email);

  const role = input.role;

  const department = input.department ? normalizeName(input.department) : null;



  if (!name) {

    throw new AppError('Name is required', 400, 'VALIDATION_ERROR');

  }



  if (name.length < 3) {

    throw new AppError(

      'Name must be at least 3 characters long',

      400,

      'VALIDATION_ERROR',

    );

  }



  if (name.length > 255) {

    throw new AppError(

      'Name must be 255 characters or fewer',

      400,

      'VALIDATION_ERROR',

    );

  }



  if (/\d/.test(name)) {

    throw new AppError(

      'Name cannot contain numbers',

      400,

      'VALIDATION_ERROR',

    );

  }



  if (!allowedRoles.has(role)) {

    throw new AppError('Role is invalid', 400, 'VALIDATION_ERROR');

  }



  if (departmentRoles.has(role) && !department) {

    throw new AppError(

      'Department is required for lecturer and committee roles',

      400,

      'VALIDATION_ERROR',

    );

  }



  if (department && !allowedDepartments.has(department as UserDepartment)) {

    throw new AppError('Department is invalid', 400, 'VALIDATION_ERROR');

  }



  if (!departmentRoles.has(role) && department) {

    throw new AppError(

      'Department can only be assigned to lecturer and committee roles',

      400,

      'VALIDATION_ERROR',

    );

  }



  return {

    name,

    email,

    role,

    department: department as UserDepartment | null,

  };

}

