import jwt from 'jsonwebtoken';

import { AppError } from '../errorHandler/app-error.js';
import type { UserRole } from '../lib/db/schema/auth.js';

type TokenUser = {
  userId: string;
  role: UserRole;
};

export function generateToken(user: TokenUser): string {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new AppError('JWT secret is not configured', 500, 'JWT_SECRET_MISSING');
  }

  return jwt.sign(
    {
      userId: user.userId,
      role: user.role,
    },
    jwtSecret,
    {
      expiresIn: '1d',
    },
  );
}
