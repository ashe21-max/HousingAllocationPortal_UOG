import type { UserRole } from '../lib/db/schema/auth.js';

export type LoginDto = {
  email: string;
  password?: string | undefined;
};

export type LoginResultDto =
  | {
      requiresSetup: true;
      userId: string;
    }
  | {
      success: true;
      user: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
        department: string | null;
        isVerified: boolean;
        createdAt: Date;
      };
    };
