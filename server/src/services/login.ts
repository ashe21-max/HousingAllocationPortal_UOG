import bcrypt from 'bcrypt';

import type { LoginDto, LoginResultDto } from '../dtos/login.dto.js';
import { AppError } from '../errorHandler/app-error.js';
import { findUserByEmail } from '../repository/user.repository.js';
import { validateLoginInput } from '../validators/login.validator.js';

export async function login({
  email,
  password,
}: LoginDto): Promise<LoginResultDto> {
  const validatedInput = validateLoginInput({ email, password });

  const user = await findUserByEmail(validatedInput.email);

  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  if (!user.isActive) {
    throw new AppError('User account is deactivated', 403, 'USER_INACTIVE');
  }

  if (user.password === null) {
    return {
      requiresSetup: true,
      userId: user.id,
    };
  }

  if (!validatedInput.password) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const isPasswordValid = await bcrypt.compare(
    validatedInput.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    },
  };
}
