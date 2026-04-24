import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { AUTH_COOKIE_NAME } from '../config/auth.js';
import { AppError } from '../errorHandler/app-error.js';
import type { AuthenticatedUser } from '../types/auth.js';

type JwtPayload = {
  userId: string;
  role: AuthenticatedUser['role'];
};

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const authorizationHeader = req.header('authorization');
  let token = '';

  if (authorizationHeader?.startsWith('Bearer ')) {
    token = authorizationHeader.slice('Bearer '.length).trim();
  } else if (req.cookies) {
    token = req.cookies[AUTH_COOKIE_NAME] ?? '';
  }

  if (!token) {
    next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    next(new AppError('JWT secret is not configured', 500, 'JWT_SECRET_MISSING'));
    return;
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as JwtPayload;

    req.user = {
      userId: payload.userId,
      id: payload.userId, // Add id property for backward compatibility
      role: payload.role,
    };

    next();
  } catch {
    next(new AppError('Invalid or expired token', 401, 'INVALID_TOKEN'));
  }
}
