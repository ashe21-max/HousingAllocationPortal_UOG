import type {
  ApplicationRoundStatus,
  CommitteeRankingStatus,
} from '../lib/db/schema/application.js';

export type CreateOfficerRoundDto = {
  name: string;
  description?: string | null;
  status: ApplicationRoundStatus;
  startsAt: string;
  endsAt: string;
};

export type UpdateOfficerRoundStatusDto = {
  status: ApplicationRoundStatus;
};

export type UpdateOfficerRoundRankingStatusDto = {
  committeeRankingStatus: CommitteeRankingStatus;
};
