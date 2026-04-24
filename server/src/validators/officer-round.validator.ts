import { AppError } from '../errorHandler/app-error.js';
import type {
  CreateOfficerRoundDto,
  UpdateOfficerRoundRankingStatusDto,
  UpdateOfficerRoundStatusDto,
} from '../dtos/officer-round.dto.js';
import {
  applicationRoundStatusEnum,
  committeeRankingStatusEnum,
  type ApplicationRoundStatus,
  type CommitteeRankingStatus,
} from '../lib/db/schema/application.js';

export function validateCreateOfficerRoundInput(input: CreateOfficerRoundDto) {
  const name = input.name?.trim();
  if (!name) {
    throw new AppError('name is required', 400, 'VALIDATION_ERROR');
  }

  if (name.length > 255) {
    throw new AppError(
      'name must be 255 characters or fewer',
      400,
      'VALIDATION_ERROR',
    );
  }

  const status = validateApplicationRoundStatus(input.status);

  const startsAt = new Date(input.startsAt);
  const endsAt = new Date(input.endsAt);

  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
    throw new AppError('startsAt and endsAt must be valid dates', 400, 'VALIDATION_ERROR');
  }

  if (startsAt.getTime() >= endsAt.getTime()) {
    throw new AppError('startsAt must be earlier than endsAt', 400, 'VALIDATION_ERROR');
  }

  const description = input.description?.trim();

  return {
    name,
    description: description && description.length > 0 ? description : null,
    status,
    startsAt,
    endsAt,
  };
}

export function validateUpdateOfficerRoundStatusInput(input: UpdateOfficerRoundStatusDto) {
  return {
    status: validateApplicationRoundStatus(input.status),
  };
}

export function validateUpdateOfficerRoundRankingStatusInput(
  input: UpdateOfficerRoundRankingStatusDto,
) {
  const rankingStatus = input.committeeRankingStatus;
  if (
    !committeeRankingStatusEnum.enumValues.includes(
      rankingStatus as CommitteeRankingStatus,
    )
  ) {
    throw new AppError(
      'committeeRankingStatus is invalid',
      400,
      'VALIDATION_ERROR',
    );
  }

  return {
    committeeRankingStatus: rankingStatus as CommitteeRankingStatus,
  };
}

function validateApplicationRoundStatus(statusInput: string) {
  if (
    !applicationRoundStatusEnum.enumValues.includes(
      statusInput as ApplicationRoundStatus,
    )
  ) {
    throw new AppError('status is invalid', 400, 'VALIDATION_ERROR');
  }

  return statusInput as ApplicationRoundStatus;
}
