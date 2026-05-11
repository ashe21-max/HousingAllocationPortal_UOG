import fs from 'node:fs/promises';

import type {
  CommitteeApplicationListQueryDto,
  CommitteeReviewApplicationDto,
} from '../dtos/committee.dto.js';
import { AppError } from '../errorHandler/app-error.js';
import { runOfficerRoundAllocation } from './officer-allocation.service.js';
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
  findLecturerDocumentsByApplicationId,
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

type ParsedCommitteeApplicationFormData = {
  fullName?: string;
  staffId?: string;
  email?: string;
  phoneNumber?: string;
  college?: string;
  department?: string;
  educationalTitle?: string;
  educationalLevel?: string;
  startDateAtUog?: string;
  responsibility?: string;
  familyStatus?: string;
  spouseName?: string;
  spouseStaffId?: string;
  numberOfDependents?: string;
  hasSpouseAtUog?: boolean;
  isFemale?: boolean;
  isDisabled?: boolean;
  hasChronicIllness?: boolean;
};

function parseCommitteeApplicationFormData(notes: string | null) {
  if (!notes) {
    return null;
  }

  try {
    const parsed = JSON.parse(notes) as ParsedCommitteeApplicationFormData & {
      originalNotes?: string;
    };

    if (typeof parsed.originalNotes === 'string') {
      return parseCommitteeApplicationFormData(parsed.originalNotes);
    }

    return {
      fullName: parsed.fullName,
      staffId: parsed.staffId,
      email: parsed.email,
      phoneNumber: parsed.phoneNumber,
      college: parsed.college,
      department: parsed.department,
      educationalTitle: parsed.educationalTitle,
      educationalLevel: parsed.educationalLevel,
      startDateAtUog: parsed.startDateAtUog,
      responsibility: parsed.responsibility,
      familyStatus: parsed.familyStatus,
      spouseName: parsed.spouseName,
      spouseStaffId: parsed.spouseStaffId,
      numberOfDependents: parsed.numberOfDependents,
      hasSpouseAtUog: parsed.hasSpouseAtUog,
      isFemale: parsed.isFemale,
      isDisabled: parsed.isDisabled,
      hasChronicIllness: parsed.hasChronicIllness,
    };
  } catch {
    return null;
  }
}

function mergeCommitteeReviewNotes(
  existingNotes: string | null,
  reviewNotes: string | null,
) {
  if (!reviewNotes) {
    return existingNotes;
  }

  if (!existingNotes) {
    return JSON.stringify({
      committeeReviewNotes: reviewNotes,
    });
  }

  try {
    const parsed = JSON.parse(existingNotes) as Record<string, unknown>;
    return JSON.stringify({
      ...parsed,
      committeeReviewNotes: reviewNotes,
    });
  } catch {
    return JSON.stringify({
      originalNotes: existingNotes,
      committeeReviewNotes: reviewNotes,
    });
  }
}

export async function listCommitteeApplications(
  query: CommitteeApplicationListQueryDto,
) {
  const validated = validateCommitteeApplicationListQuery(query);
  const applications = await findCommitteeApplications(validated);
  
  // Process applications to extract score from notes if score snapshot is not available
  return applications.map((app) => {
    if (app.finalScore || !app.notes) {
      return app;
    }
    
    try {
      const parsedNotes = JSON.parse(app.notes);
      if (parsedNotes.score && parsedNotes.score.final !== undefined) {
        return {
          ...app,
          finalScore: parsedNotes.score.final,
        };
      }
    } catch (e) {
      // Could not parse notes, return original
    }
    
    return app;
  });
}

export async function getCommitteeApplicationDetails(applicationIdInput: string) {
  const applicationId = validateCommitteeApplicationId(applicationIdInput);
  const application = await findCommitteeApplicationById(applicationId);

  if (!application) {
    throw new AppError('Application not found', 404, 'APPLICATION_NOT_FOUND');
  }

  const formData = parseCommitteeApplicationFormData(application.notes);

  console.log('Fetching documents for application:', application.id, 'user:', application.userId);
  let documents = await findLecturerDocumentsByApplicationId(application.id);
  console.log('Documents by applicationId:', documents.length);

  // Fallback: if no documents found by applicationId, try by userId
  // This handles documents uploaded before the applicationId association was added
  if (documents.length === 0) {
    console.log('No documents by applicationId, trying by userId...');
    documents = await findLecturerDocumentsByUserId(application.userId);
    console.log('Documents by userId:', documents.length);
    console.log('Documents:', documents);
  }

  // Extract score from notes if score snapshot is not available
  let scoreData = {
    scoreBreakdown: application.scoreBreakdown,
    scoreBaseTotal: application.scoreBaseTotal,
    scoreBonusTotal: application.scoreBonusTotal,
    scoreFinal: application.scoreFinal,
  };

  if (!application.scoreFinal && application.notes) {
    try {
      const parsedNotes = JSON.parse(application.notes);
      if (parsedNotes.score) {
        scoreData = {
          scoreBreakdown: [
            { criteria: 'Educational Title', weightLabel: '40%', yourPoints: parsedNotes.educationalTitle ? 100 : 0, score: parsedNotes.score.educationalTitle || 0, kind: 'base' },
            { criteria: 'Educational Level', weightLabel: '5%', yourPoints: parsedNotes.educationalLevel ? 100 : 0, score: parsedNotes.score.educationalLevel || 0, kind: 'base' },
            { criteria: 'Service Years', weightLabel: '35%', yourPoints: parsedNotes.startDateAtUog ? 100 : 0, score: parsedNotes.score.serviceYears || 0, kind: 'base' },
            { criteria: 'Responsibility', weightLabel: '10%', yourPoints: parsedNotes.responsibility ? 100 : 0, score: parsedNotes.score.responsibility || 0, kind: 'base' },
            { criteria: 'Family Status', weightLabel: '10%', yourPoints: parsedNotes.familyStatus ? 100 : 0, score: parsedNotes.score.familyStatus || 0, kind: 'base' },
            { criteria: 'Base Total', weightLabel: '100%', yourPoints: null, score: parsedNotes.score.baseTotal || 0, kind: 'total' },
            { criteria: 'Female Bonus', weightLabel: 'Bonus', yourPoints: parsedNotes.isFemale ? 5 : null, score: parsedNotes.score.femaleBonus || 0, kind: 'bonus' },
            { criteria: 'Disability Bonus', weightLabel: 'Bonus', yourPoints: parsedNotes.isDisabled ? 5 : null, score: parsedNotes.score.disabilityBonus || 0, kind: 'bonus' },
            { criteria: 'Chronic Illness Bonus', weightLabel: 'Bonus', yourPoints: parsedNotes.hasChronicIllness ? 3 : null, score: parsedNotes.score.chronicIllnessBonus || 0, kind: 'bonus' },
            { criteria: 'Spouse Bonus', weightLabel: 'Bonus', yourPoints: parsedNotes.hasSpouseAtUog ? 5 : null, score: parsedNotes.score.spouseBonus || 0, kind: 'bonus' },
            { criteria: 'FINAL SCORE', weightLabel: '', yourPoints: null, score: parsedNotes.score.final || 0, kind: 'total' },
          ],
          scoreBaseTotal: parsedNotes.score.baseTotal || 0,
          scoreBonusTotal: (parsedNotes.score.femaleBonus || 0) + (parsedNotes.score.disabilityBonus || 0) + (parsedNotes.score.chronicIllnessBonus || 0) + (parsedNotes.score.spouseBonus || 0),
          scoreFinal: parsedNotes.score.final || 0,
        };
      }
    } catch (e) {
      console.log('Could not parse score from application notes:', e);
    }
  }

  return {
    ...application,
    formData,
    ...scoreData,
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

  const mergedNotes = mergeCommitteeReviewNotes(existing.notes, input.notes ?? null);

  const updated = await markApplicationUnderReview(applicationId, reviewerUserId, {
    complianceIssue: input.complianceIssue,
    complianceNotes: input.complianceNotes,
    notes: mergedNotes,
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

export async function submitRoundPreliminary(roundIdInput: string, committeeUserId: string) {
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

  // Generate PRELIMINARY allocation results immediately so lecturers can see them.
  // Uses the current committee rank entries (does not reserve houses).
  await runOfficerRoundAllocation(roundId, committeeUserId);

  return updatedRound;
}

export async function submitRoundFinal(roundIdInput: string, committeeUserId: string) {
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

  // Generate PUBLISHED allocation results immediately so lecturers can see final results.
  await runOfficerRoundAllocation(roundId, committeeUserId);

  return updatedRound;
}
