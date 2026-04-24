import type { NextFunction, Request, Response } from 'express';

import { AUTH_COOKIE_NAME, AUTH_TOKEN_TTL_MS } from '../config/auth.js';
import type { InitiateLoginDto } from '../dtos/auth.dto.js';
import type { ResendOtpDto } from '../dtos/generate-otp.dto.js';
import type { LoginDto } from '../dtos/login.dto.js';
import type { SetPasswordDto } from '../dtos/set-password.dto.js';
import type { VerifyOtpDto } from '../dtos/verify-otp.dto.js';
import { AppError } from '../errorHandler/app-error.js';
import { findUserById } from '../repository/user.repository.js';
import { initiateLogin } from '../services/initiate-login.js';
import { forgotPassword } from '../services/forgot-password.js';
import { login } from '../services/login.js';
import { resendOtp } from '../services/resend-otp.js';
import { setPassword } from '../services/set-password.js';
import { verifyOtp } from '../services/verify-otp.js';
import { generateToken } from '../utils/generate-token.js';

function setAuthCookie(res: Response, token: string): void {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: AUTH_TOKEN_TTL_MS,
    path: '/',
  });
}

export async function initiateLoginController(
  req: Request<unknown, unknown, Partial<InitiateLoginDto>>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email } = req.body;

    if (typeof email !== 'string') {
      throw new AppError('Email is required', 400, 'VALIDATION_ERROR');
    }

    const result = await initiateLogin({ email });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function resendOtpController(
  req: Request<unknown, unknown, Partial<ResendOtpDto>>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { userId } = req.body;

    if (typeof userId !== 'string') {
      throw new AppError('User id is required', 400, 'VALIDATION_ERROR');
    }

    const result = await resendOtp({ userId });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function forgotPasswordController(
  req: Request<unknown, unknown, Partial<InitiateLoginDto>>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email } = req.body;

    if (typeof email !== 'string') {
      throw new AppError('Email is required', 400, 'VALIDATION_ERROR');
    }

    const result = await forgotPassword({ email });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function verifyOtpController(
  req: Request<unknown, unknown, Partial<VerifyOtpDto>>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { userId, code } = req.body;

    if (typeof userId !== 'string' || typeof code !== 'string') {
      throw new AppError('User id and code are required', 400, 'VALIDATION_ERROR');
    }

    await verifyOtp({ userId, code });

    const user = await findUserById(userId);

    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      requiresPasswordSetup: user.password === null,
    });
  } catch (error) {
    next(error);
  }
}

export async function setPasswordController(
  req: Request<unknown, unknown, Partial<SetPasswordDto>>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { userId, newPassword } = req.body;

    if (typeof userId !== 'string' || typeof newPassword !== 'string') {
      throw new AppError(
        'User id and newPassword are required',
        400,
        'VALIDATION_ERROR',
      );
    }

    const result = await setPassword({ userId, newPassword });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function passwordLoginController(
  req: Request<unknown, unknown, Partial<LoginDto>>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string') {
      throw new AppError('Email is required', 400, 'VALIDATION_ERROR');
    }

    const result = await login({
      email,
      password: typeof password === 'string' ? password : undefined,
    });

    if ('requiresSetup' in result) {
      res.status(200).json(result);
      return;
    }

    const token = generateToken({
      userId: result.user.id,
      role: result.user.role,
    });

    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMeController(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const user = await findUserById(req.user.userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    res.status(200).json({
      id: user.id,
      fullName: user.name,
      email: user.email,
      phoneNumber: null,
      role: user.role,
      department: user.department,
      profilePicture: null,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfileController(
  req: Request<unknown, unknown, { fullName: string; email: string; phoneNumber?: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const { fullName, email, phoneNumber } = req.body;

    if (!fullName || !email) {
      throw new AppError('Full name and email are required', 400, 'VALIDATION_ERROR');
    }

    // Update user profile using existing database pattern
    const db = await import('../lib/db/index.js').then(m => m.db);
    const { users } = await import('../lib/db/schema/auth.js');
    const { eq } = await import('drizzle-orm');
    
    const [updatedUser] = await db
      .update(users)
      .set({
        name: fullName,
        email: email,
      })
      .where(eq(users.id, req.user.userId))
      .returning();

    if (!updatedUser) {
      throw new AppError('Failed to update profile', 500, 'UPDATE_FAILED');
    }

    res.status(200).json({
      id: updatedUser.id,
      fullName: updatedUser.name,
      email: updatedUser.email,
      phoneNumber: null,
      role: updatedUser.role,
      department: updatedUser.department,
      profilePicture: null,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfilePictureController(
  req: Request<unknown, unknown, unknown>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    // Handle profile picture upload (you'll need to implement file handling)
    // For now, return a placeholder response
    res.status(200).json({
      message: 'Profile picture upload not yet implemented',
    });
  } catch (error) {
    next(error);
  }
}

export function logoutController(_req: Request, res: Response): void {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  res.status(200).json({ success: true });
}
