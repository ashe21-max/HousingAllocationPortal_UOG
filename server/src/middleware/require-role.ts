import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errorHandler/app-error.js';
import type { UserRole } from '../lib/db/schema/auth.js';

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError('Forbidden', 403, 'FORBIDDEN'));
      return;
    }

    next();
  };
}
