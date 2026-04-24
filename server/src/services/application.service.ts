import type { SaveApplicationDraftDto } from '../dtos/application.dto.js';
import { AppError } from '../errorHandler/app-error.js';
import { findUserById } from '../repository/user.repository.js';
import { findHousingUnitById, findHousingUnits } from '../repository/housing.repository.js';
import { findLatestScoreSnapshotByUserId } from '../repository/scoring.repository.js';
import {
  createApplicationDraft,
  findActiveRoundsForLecturer,
  findApplicationByIdAndUser,
  findApplicationByUserAndRound,
  findApplicationRoundById,
  findDepartmentAllocationResults,
  findMyApplications,
  submitApplication,
  updateApplicationDraft,
} from '../repository/application.repository.js';
import { canTransitionApplicationStatus } from '../utils/application-status.js';
import {
  validateApplicationId,
  validateSaveApplicationDraftInput,
} from '../validators/application.validator.js';

export async function saveMyApplicationDraft(
  userId: string,
  input: SaveApplicationDraftDto,
) {
  const validatedInput = validateSaveApplicationDraftInput(input);
  const round = await findApplicationRoundById(validatedInput.roundId);

  if (!round) {
    throw new AppError('Application round not found', 404, 'ROUND_NOT_FOUND');
  }

  if (round.status === 'CLOSED' || round.status === 'ARCHIVED') {
    throw new AppError(
      'Round is not accepting drafts',
      409,
      'ROUND_NOT_ACCEPTING_DRAFTS',
    );
  }

  if (validatedInput.preferredHousingUnitId) {
    const unit = await findHousingUnitById(validatedInput.preferredHousingUnitId);
    if (!unit) {
      throw new AppError(
        'Preferred housing unit not found',
        404,
        'HOUSE_NOT_FOUND',
      );
    }
  }

  const existing = await findApplicationByUserAndRound(userId, validatedInput.roundId);

  if (!existing) {
    const created = await createApplicationDraft(userId, validatedInput);
    if (!created) {
      throw new AppError(
        'Failed to save application draft',
        500,
        'APPLICATION_DRAFT_SAVE_FAILED',
      );
    }
    return created;
  }

  if (existing.status !== 'DRAFT') {
    throw new AppError(
      'Application is no longer editable',
      409,
      'APPLICATION_NOT_EDITABLE',
    );
  }

  const updated = await updateApplicationDraft(existing.id, userId, validatedInput);
  if (!updated) {
    throw new AppError(
      'Failed to update application draft',
      500,
      'APPLICATION_DRAFT_UPDATE_FAILED',
    );
  }

  return updated;
}

export async function submitMyApplication(userId: string, applicationIdInput: string) {
  const applicationId = validateApplicationId(applicationIdInput);
  const application = await findApplicationByIdAndUser(applicationId, userId);

  if (!application) {
    throw new AppError('Application not found', 404, 'APPLICATION_NOT_FOUND');
  }

  if (!canTransitionApplicationStatus(application.status, 'SUBMITTED')) {
    throw new AppError(
      'Application cannot be submitted from current status',
      409,
      'INVALID_APPLICATION_STATUS_TRANSITION',
    );
  }

  const round = await findApplicationRoundById(application.roundId);
  if (!round) {
    throw new AppError('Application round not found', 404, 'ROUND_NOT_FOUND');
  }

  const nowMs = Date.now();
  const startsMs = round.startsAt.getTime();
  const endsMs = round.endsAt.getTime();
  const withinRoundWindow = nowMs >= startsMs && nowMs <= endsMs;

  if (round.status !== 'OPEN' || !withinRoundWindow) {
    throw new AppError(
      'Round is not currently open for submission',
      409,
      'ROUND_NOT_OPEN',
    );
  }

  const latestSnapshot = await findLatestScoreSnapshotByUserId(userId);
  if (!latestSnapshot) {
    throw new AppError(
      'No score snapshot found. Save your criteria and preview score first.',
      400,
      'SCORE_SNAPSHOT_REQUIRED',
    );
  }

  const submitted = await submitApplication(
    applicationId,
    userId,
    latestSnapshot.id,
  );

  if (!submitted) {
    throw new AppError(
      'Failed to submit application',
      500,
      'APPLICATION_SUBMIT_FAILED',
    );
  }

  return submitted;
}

export async function getMyApplications(userId: string) {
  return findMyApplications(userId);
}

export async function getApplicationFormOptions() {
  const [rounds, availableHouses] = await Promise.all([
    findActiveRoundsForLecturer(),
    findHousingUnits({ status: 'Available' }),
  ]);

  return { rounds, availableHouses };
}

export async function getMyDepartmentAllocationResults(userId: string) {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  const department = user.department?.trim();
  if (!department) {
    throw new AppError(
      'Your profile has no department. Contact admin.',
      400,
      'DEPARTMENT_REQUIRED',
    );
  }

  return findDepartmentAllocationResults(department);
}
