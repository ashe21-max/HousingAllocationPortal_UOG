import fs from 'node:fs/promises';

import type {
  CommitteeApplicationListQueryDto,
  CommitteeReviewApplicationDto,
} from '../dtos/committee.dto.js';
import { AppError } from '../errorHandler/app-error.js';
import {
  findCommitteeApplicationById,
  findCommitteeApplications,
  findCommitteeRankEntriesByRound,
  findRoundEligibleApplicationsForRanking,
  markApplicationUnderReview,
  markRoundApplicationsRanked,
  updateRoundRankingStatus,
  upsertCommitteeRankEntries,
} from '../repository/committee.repository.js';
import {
  findLecturerDocumentById,
  findLecturerDocumentsByUserId,
} from '../repository/document.repository.js';
import { canTransitionApplicationStatus } from '../utils/application-status.js';
import {
  validateCommitteeApplicationId,
  validateCommitteeApplicationListQuery,
  validateCommitteeDocumentId,
  validateCommitteeManualRankItems,
  validateCommitteeRoundId,
  validateCommitteeReviewApplicationInput,
} from '../validators/committee.validator.js';

export async function listCommitteeApplications(
  query: CommitteeApplicationListQueryDto,
) {
  const validated = validateCommitteeApplicationListQuery(query);
  return findCommitteeApplications(validated);
}

export async function getCommitteeApplicationDetails(applicationIdInput: string) {
  const applicationId = validateCommitteeApplicationId(applicationIdInput);
  const application = await findCommitteeApplicationById(applicationId);

  if (!application) {
    throw new AppError('Application not found', 404, 'APPLICATION_NOT_FOUND');
  }

  const documents = await findLecturerDocumentsByUserId(application.userId);

  return {
    ...application,
    documents,
  };
}

export async function reviewCommitteeApplication(
  reviewerUserId: string,
  applicationIdInput: string,
  payload: CommitteeReviewApplicationDto,
) {
  const applicationId = validateCommitteeApplicationId(applicationIdInput);
  const input = validateCommitteeReviewApplicationInput(payload);

  const existing = await findCommitteeApplicationById(applicationId);
  if (!existing) {
    throw new AppError('Application not found', 404, 'APPLICATION_NOT_FOUND');
  }

  if (!canTransitionApplicationStatus(existing.status, input.status)) {
    throw new AppError(
      'Invalid status transition for application review',
      409,
      'INVALID_APPLICATION_STATUS_TRANSITION',
    );
  }

  const updated = await markApplicationUnderReview(applicationId, reviewerUserId, {
    complianceIssue: input.complianceIssue,
    complianceNotes: input.complianceNotes,
    notes: input.notes,
  });

  if (!updated) {
    throw new AppError('Failed to update review', 500, 'REVIEW_UPDATE_FAILED');
  }

  return updated;
}

export async function getCommitteeDocumentForDownload(documentIdInput: string) {
  const documentId = validateCommitteeDocumentId(documentIdInput);
  const document = await findLecturerDocumentById(documentId);

  if (!document) {
    throw new AppError('Document not found', 404, 'DOCUMENT_NOT_FOUND');
  }

  try {
    await fs.access(document.storagePath);
  } catch {
    throw new AppError(
      'Stored file could not be found',
      404,
      'DOCUMENT_FILE_NOT_FOUND',
    );
  }

  return document;
}

export async function generateRoundRanking(roundIdInput: string, committeeUserId: string) {
  const roundId = validateCommitteeRoundId(roundIdInput);
  const rankedPool = await findRoundEligibleApplicationsForRanking(roundId);

  if (rankedPool.length === 0) {
    throw new AppError(
      'No UNDER_REVIEW applications with score found for this round',
      400,
      'NO_ELIGIBLE_APPLICATIONS_FOR_RANKING',
    );
  }

  const sorted = [...rankedPool]
    .filter((item) => typeof item.scoreFinal === 'number')
    .sort((a, b) => {
      const scoreA = a.scoreFinal ?? 0;
      const scoreB = b.scoreFinal ?? 0;
      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }
      const submittedA = a.submittedAt?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const submittedB = b.submittedAt?.getTime() ?? Number.MAX_SAFE_INTEGER;
      if (submittedA !== submittedB) {
        return submittedA - submittedB;
      }
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

  const entries = sorted.map((item, index) => ({
    applicationId: item.applicationId,
    rankPosition: index + 1,
  }));

  await upsertCommitteeRankEntries(roundId, committeeUserId, entries);
  return findCommitteeRankEntriesByRound(roundId);
}

export async function saveManualRoundRanking(
  roundIdInput: string,
  committeeUserId: string,
  rawEntries: unknown,
) {
  const roundId = validateCommitteeRoundId(roundIdInput);
  const entries = validateCommitteeManualRankItems(rawEntries);
  await upsertCommitteeRankEntries(roundId, committeeUserId, entries);
  return findCommitteeRankEntriesByRound(roundId);
}

export async function listRoundRanking(roundIdInput: string) {
  const roundId = validateCommitteeRoundId(roundIdInput);
  return findCommitteeRankEntriesByRound(roundId);
}

export async function submitRoundPreliminary(roundIdInput: string) {
  const roundId = validateCommitteeRoundId(roundIdInput);
  const entries = await findCommitteeRankEntriesByRound(roundId);

  if (entries.length === 0) {
    throw new AppError(
      'Cannot submit preliminary ranking without rank entries',
      400,
      'RANK_ENTRIES_REQUIRED',
    );
  }

  const updatedRound = await updateRoundRankingStatus(
    roundId,
    'PRELIMINARY_SUBMITTED',
  );
  if (!updatedRound) {
    throw new AppError('Round not found', 404, 'ROUND_NOT_FOUND');
  }

  return updatedRound;
}

export async function submitRoundFinal(roundIdInput: string) {
  const roundId = validateCommitteeRoundId(roundIdInput);
  const entries = await findCommitteeRankEntriesByRound(roundId);

  if (entries.length === 0) {
    throw new AppError(
      'Cannot submit final ranking without rank entries',
      400,
      'RANK_ENTRIES_REQUIRED',
    );
  }

  await markRoundApplicationsRanked(
    roundId,
    entries.map((entry) => entry.applicationId),
  );

  const updatedRound = await updateRoundRankingStatus(roundId, 'FINAL_SUBMITTED');
  if (!updatedRound) {
    throw new AppError('Round not found', 404, 'ROUND_NOT_FOUND');
  }

  return updatedRound;
}
