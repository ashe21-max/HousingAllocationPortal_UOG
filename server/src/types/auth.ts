import type { UserRole } from '../lib/db/schema/auth.js';

export type AuthenticatedUser = {
  userId: string;
  id: string; // Alias for userId for backward compatibility
  role: UserRole;
};
