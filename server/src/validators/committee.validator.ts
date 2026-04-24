import type {
  CommitteeApplicationListQueryDto,
  CommitteeManualRankItemDto,
  CommitteeReviewApplicationDto,
  CommitteeReviewApplicationInput,
} from '../dtos/committee.dto.js';
import { AppError } from '../errorHandler/app-error.js';
import {
  applicationStatusEnum,
  type ApplicationStatus,
} from '../lib/db/schema/application.js';

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function validateUuid(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new AppError(`${fieldName} is required`, 400, 'VALIDATION_ERROR');
  }
  if (!uuidPattern.test(normalized)) {
    throw new AppError(
      `${fieldName} must be a valid UUID`,
      400,
      'VALIDATION_ERROR',
    );
  }
  return normalized;
}

function parseBooleanQuery(value: string, fieldName: string): boolean {
  const normalized = value.trim().toLowerCase();
  if (normalized === 'true') {
    return true;
  }
  if (normalized === 'false') {
    return false;
  }
  throw new AppError(`${fieldName} is invalid`, 400, 'VALIDATION_ERROR');
}

function validateStatus(status: string): ApplicationStatus {
  const normalized = status.trim();
  if (!applicationStatusEnum.enumValues.includes(normalized as ApplicationStatus)) {
    throw new AppError('Application status is invalid', 400, 'VALIDATION_ERROR');
  }
  return normalized as ApplicationStatus;
}

export function validateCommitteeApplicationListQuery(
  input: CommitteeApplicationListQueryDto,
) {
  const output: {
    roundId?: string;
    status?: ApplicationStatus;
    complianceIssue?: boolean;
  } = {};

  if (typeof input.roundId === 'string' && input.roundId.trim()) {
    output.roundId = validateUuid(input.roundId, 'Round id');
  }

  if (typeof input.status === 'string' && input.status.trim()) {
    output.status = validateStatus(input.status);
  }

  if (typeof input.complianceIssue === 'string' && input.complianceIssue.trim()) {
    output.complianceIssue = parseBooleanQuery(
      input.complianceIssue,
      'complianceIssue',
    );
  }

  return output;
}

export function validateCommitteeReviewApplicationInput(
  input: CommitteeReviewApplicationDto,
): CommitteeReviewApplicationInput {
  if (typeof input.status !== 'string') {
    throw new AppError('status is required', 400, 'VALIDATION_ERROR');
  }

  const status = validateStatus(input.status);
  if (status !== 'UNDER_REVIEW') {
    throw new AppError(
      'Only UNDER_REVIEW status is allowed in this action',
      400,
      'VALIDATION_ERROR',
    );
  }

  const complianceIssue = input.complianceIssue ?? false;

  let complianceNotes: string | null = null;
  if (typeof input.complianceNotes === 'string') {
    const normalized = input.complianceNotes.trim();
    complianceNotes = normalized.length > 0 ? normalized : null;
  }

  let notes: string | null = null;
  if (typeof input.notes === 'string') {
    const normalized = input.notes.trim();
    notes = normalized.length > 0 ? normalized : null;
  }

  return {
    status,
    complianceIssue,
    complianceNotes,
    notes,
  };
}

export function validateCommitteeApplicationId(idInput: string) {
  return validateUuid(idInput, 'Application id');
}

export function validateCommitteeDocumentId(idInput: string) {
  return validateUuid(idInput, 'Document id');
}

export function validateCommitteeRoundId(idInput: string) {
  return validateUuid(idInput, 'Round id');
}

export function validateCommitteeManualRankItems(input: unknown) {
  if (!Array.isArray(input)) {
    throw new AppError('entries must be an array', 400, 'VALIDATION_ERROR');
  }

  const entries = input as CommitteeManualRankItemDto[];
  if (entries.length === 0) {
    throw new AppError('entries cannot be empty', 400, 'VALIDATION_ERROR');
  }

  const normalized = entries.map((entry, index) => {
    if (!entry || typeof entry !== 'object') {
      throw new AppError(
        `entry at index ${index} is invalid`,
        400,
        'VALIDATION_ERROR',
      );
    }

    if (typeof entry.applicationId !== 'string') {
      throw new AppError(
        `entry.applicationId at index ${index} is required`,
        400,
        'VALIDATION_ERROR',
      );
    }

    if (!Number.isInteger(entry.rankPosition) || entry.rankPosition <= 0) {
      throw new AppError(
        `entry.rankPosition at index ${index} must be a positive integer`,
        400,
        'VALIDATION_ERROR',
      );
    }

    return {
      applicationId: validateUuid(entry.applicationId, 'Application id'),
      rankPosition: entry.rankPosition,
    };
  });

  const applicationIds = new Set<string>();
  const rankPositions = new Set<number>();
  for (const entry of normalized) {
    if (applicationIds.has(entry.applicationId)) {
      throw new AppError(
        'Duplicate applicationId found in entries',
        400,
        'VALIDATION_ERROR',
      );
    }
    if (rankPositions.has(entry.rankPosition)) {
      throw new AppError(
        'Duplicate rankPosition found in entries',
        400,
        'VALIDATION_ERROR',
      );
    }
    applicationIds.add(entry.applicationId);
    rankPositions.add(entry.rankPosition);
  }

  return normalized;
}
