import type { CreateUserDto, CreatedUserDto } from '../dtos/create-user.dto.js';
import { AppError } from '../errorHandler/app-error.js';
import type { PostgresError } from '../types/postgres.js';
import { createAdminManagedUser } from '../repository/user.repository.js';
import { validateCreateUserInput } from '../validators/create-user.validator.js';
export async function createUser({
  name,
  email,
  role,
  department,
}: CreateUserDto): Promise<CreatedUserDto> {
  const validatedInput = validateCreateUserInput({
    name,
    email,
    role,
    department,
  });
  try {
    const createdUser = await createAdminManagedUser(validatedInput);

    if (!createdUser) {
      throw new AppError('Failed to create user', 500, 'USER_CREATE_FAILED');
    }

    return createdUser;
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
