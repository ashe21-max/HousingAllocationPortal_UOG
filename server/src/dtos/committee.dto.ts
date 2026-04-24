import type { ApplicationStatus } from '../lib/db/schema/application.js';

export type CommitteeApplicationListQueryDto = {
  roundId?: string;
  status?: string;
  complianceIssue?: string;
};

export type CommitteeReviewApplicationDto = {
  status: string;
  complianceIssue?: boolean;
  complianceNotes?: string | null;
  notes?: string | null;
};

export type CommitteeReviewApplicationInput = {
  status: ApplicationStatus;
  complianceIssue: boolean;
  complianceNotes: string | null;
  notes: string | null;
};

export type CommitteeManualRankItemDto = {
  applicationId: string;
  rankPosition: number;
};
