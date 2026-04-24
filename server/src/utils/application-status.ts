import { applicationStatusTransitions } from '../constants/application.js';
import type { ApplicationStatus } from '../lib/db/schema/application.js';

export function canTransitionApplicationStatus(
  from: ApplicationStatus,
  to: ApplicationStatus,
): boolean {
  return applicationStatusTransitions[from].includes(to);
}
