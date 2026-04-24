import type { ApplicationStatus } from '../lib/db/schema/application.js';

/**
 * Explicit state machine for application lifecycle transitions.
 * Used by services/controllers to prevent invalid status jumps.
 */
export const applicationStatusTransitions: Readonly<
  Record<ApplicationStatus, readonly ApplicationStatus[]>
> = {
  DRAFT: ['SUBMITTED', 'WITHDRAWN'],
  SUBMITTED: ['UNDER_REVIEW', 'WITHDRAWN'],
  UNDER_REVIEW: ['RANKED', 'REJECTED', 'WITHDRAWN'],
  RANKED: ['ALLOCATED', 'REJECTED'],
  ALLOCATED: [],
  REJECTED: [],
  WITHDRAWN: [],
} as const;
