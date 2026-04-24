import bcrypt from 'bcrypt';

import type {
  SetPasswordDto,
  SetPasswordResultDto,
} from '../dtos/set-password.dto.js';
import { AppError } from '../errorHandler/app-error.js';
import { findUserById, setUserPassword } from '../repository/user.repository.js';
import { validateSetPasswordInput } from '../validators/set-password.validator.js';

const SALT_ROUNDS = 12;

export async function setPassword({
  userId,
  newPassword,
}: SetPasswordDto): Promise<SetPasswordResultDto> {
  const validatedInput = validateSetPasswordInput({ userId, newPassword });

  const user = await findUserById(validatedInput.userId);

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  if (!user.isActive) {
    throw new AppError('User account is deactivated', 403, 'USER_INACTIVE');
  }

  if (!user.isVerified) {
    throw new AppError('User is not verified', 400, 'USER_NOT_VERIFIED');
  }

  const hashedPassword = await bcrypt.hash(
    validatedInput.newPassword,
    SALT_ROUNDS,
  );

  const updatedUser = await setUserPassword(validatedInput.userId, hashedPassword);

  if (!updatedUser) {
    throw new AppError('Failed to set password', 500, 'PASSWORD_SETUP_FAILED');
  }

  return { success: true };
}
