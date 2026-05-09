import { AppError } from '../errorHandler/app-error.js';
import type {
  CreateOfficerRoundDto,
  UpdateOfficerRoundStatusDto,
} from '../dtos/officer-round.dto.js';
import {
  clearRoundAllocationResults,
  createApplicationRound,
  deleteApplicationRound,
  deleteAllocationReport as deleteAllocationReportRepo,
  findAllAllocationReports,
  findAllApplicationRounds,
  findAvailableHousingUnits,
  findExistingRoundAllocationHousingUnitIds,
  findExistingRoundAllocationHousingUnitIdsByStatus,
  findRoundAllocationResults,
  findRoundById,
  findRoundPreliminaryRankedApplications,
  findRoundRankedApplications,
  findRoundsReadyForAllocation,
  insertAllocationResults,
  markApplicationsAllocated,
  markHousingUnitsStatus,
  saveAllocationReport,
  updateAllocationReportStatus as updateAllocationReportStatusRepo,
  updateApplicationRoundStatus,
} from '../repository/officer.repository.js';
import { validateOfficerRoundId } from '../validators/officer.validator.js';
import {
  validateCreateOfficerRoundInput,
  validateUpdateOfficerRoundStatusInput,
} from '../validators/officer-round.validator.js';

export async function getOfficerRoundsReadyForAllocation() {
  return findRoundsReadyForAllocation();
}

export async function getOfficerManagedRounds() {
  return findAllApplicationRounds();
}

export async function createOfficerRound(
  actorUserId: string,
  input: CreateOfficerRoundDto,
) {
  const validated = validateCreateOfficerRoundInput(input);
  const created = await createApplicationRound({
    name: validated.name,
    description: validated.description,
    status: validated.status,
    startsAt: validated.startsAt,
    endsAt: validated.endsAt,
    createdByUserId: actorUserId,
  });

  if (!created) {
    throw new AppError('Failed to create round', 500, 'ROUND_CREATE_FAILED');
  }

  return created;
}

export async function updateOfficerRoundStatus(
  roundIdInput: string,
  input: UpdateOfficerRoundStatusDto,
) {
  const roundId = validateOfficerRoundId(roundIdInput);
  const validated = validateUpdateOfficerRoundStatusInput(input);

  const updated = await updateApplicationRoundStatus(roundId, validated.status);
  if (!updated) {
    throw new AppError('Round not found', 404, 'ROUND_NOT_FOUND');
  }
  return updated;
}

export async function deleteOfficerRound(roundIdInput: string) {
  const roundId = validateOfficerRoundId(roundIdInput);

  const round = await findRoundById(roundId);
  if (!round) {
    throw new AppError('Round not found', 404, 'ROUND_NOT_FOUND');
  }

  await deleteApplicationRound(roundId);

  return { message: 'Round deleted successfully' };
}

export async function sendReportToAdmin(input: {
  roundId: string;
  roundName: string;
  allocationCount: number;
  reportData: any;
  sentByUserId: string;
}) {
  const round = await findRoundById(input.roundId);
  if (!round) {
    throw new AppError('Round not found', 404, 'ROUND_NOT_FOUND');
  }

  const report = await saveAllocationReport({
    roundId: input.roundId,
    roundName: input.roundName,
    roundStatus: round.status,
    committeeRankingStatus: round.committeeRankingStatus,
    allocationCount: input.allocationCount,
    reportData: input.reportData,
    sentByUserId: input.sentByUserId,
  });

  return { message: 'Report sent to admin support successfully', reportId: report.id };
}

export async function getAllocationReports() {
  return findAllAllocationReports();
}

export async function updateAllocationReportStatus(id: string, status: string, adminNotes?: string, reviewedByUserId?: string) {
  return updateAllocationReportStatusRepo(id, status, adminNotes, reviewedByUserId);
}

export async function deleteAllocationReport(id: string) {
  return deleteAllocationReportRepo(id);
}

export async function getOfficerAvailableHouses() {
  return findAvailableHousingUnits();
}

export async function getOfficerRoundAllocationResults(roundIdInput: string) {
  const roundId = validateOfficerRoundId(roundIdInput);
  return findRoundAllocationResults(roundId);
}

export async function runOfficerRoundAllocation(
  roundIdInput: string,
  officerUserId: string,
) {
  const roundId = validateOfficerRoundId(roundIdInput);
  const round = await findRoundById(roundId);

  if (!round) {
    throw new AppError('Round not found', 404, 'ROUND_NOT_FOUND');
  }

  if (
    round.committeeRankingStatus !== 'PRELIMINARY_SUBMITTED' &&
    round.committeeRankingStatus !== 'FINAL_SUBMITTED'
  ) {
    throw new AppError(
      'Round ranking must be submitted before allocation',
      409,
      'RANKING_NOT_SUBMITTED',
    );
  }

  const allocationStatus =
    round.committeeRankingStatus === 'FINAL_SUBMITTED' ? 'PUBLISHED' : 'PRELIMINARY';

  const [rankedApplications, availableUnitsInitial, existingHousingIds] =
    await Promise.all([
      allocationStatus === 'PRELIMINARY'
        ? findRoundPreliminaryRankedApplications(roundId)
        : findRoundRankedApplications(roundId),
      findAvailableHousingUnits(),
      findExistingRoundAllocationHousingUnitIds(roundId),
    ]);

  if (rankedApplications.length === 0) {
    throw new AppError(
      'No ranked applications available for allocation',
      400,
      'NO_RANKED_APPLICATIONS',
    );
  }

  // We keep historical PRELIMINARY results even after FINAL allocation, so:
  // - reruns clear only the allocation status we are generating
  // - FINAL allocation also releases previously reserved PRELIMINARY units (legacy behavior)
  const existingStatusHousingIds = await findExistingRoundAllocationHousingUnitIdsByStatus(
    roundId,
    allocationStatus,
  );

  if (existingStatusHousingIds.length > 0) {
    await markHousingUnitsStatus(existingStatusHousingIds, 'Available');
    await clearRoundAllocationResults(roundId, allocationStatus);
  }

  if (allocationStatus === 'PUBLISHED') {
    const existingPreliminaryHousingIds = await findExistingRoundAllocationHousingUnitIdsByStatus(
      roundId,
      'PRELIMINARY',
    );
    if (existingPreliminaryHousingIds.length > 0) {
      await markHousingUnitsStatus(existingPreliminaryHousingIds, 'Available');
    }
  }

  const availableUnits = [...availableUnitsInitial];
  const availableUnitMap = new Map(availableUnits.map((unit) => [unit.id, unit]));

  const allocations: Array<{
    roundId: string;
    applicationId: string;
    housingUnitId: string;
    allocatedByUserId: string;
  }> = [];

  for (const ranked of rankedApplications) {
    if (availableUnits.length === 0) {
      break;
    }

    let selectedUnitId: string;

    if (
      ranked.preferredHousingUnitId &&
      availableUnitMap.has(ranked.preferredHousingUnitId)
    ) {
      selectedUnitId = ranked.preferredHousingUnitId;
    } else {
      selectedUnitId = availableUnits[0]!.id;
    }

    allocations.push({
      roundId,
      applicationId: ranked.applicationId,
      housingUnitId: selectedUnitId,
      allocatedByUserId: officerUserId,
    });

    const idx = availableUnits.findIndex((unit) => unit.id === selectedUnitId);
    if (idx >= 0) {
      availableUnits.splice(idx, 1);
    }
    availableUnitMap.delete(selectedUnitId);
  }

  if (allocations.length === 0) {
    throw new AppError(
      'No available houses to allocate',
      400,
      'NO_AVAILABLE_HOUSES',
    );
  }

  await insertAllocationResults(allocations, allocationStatus);

  // Only FINAL/PUBLISHED allocation should reserve houses + set applications to ALLOCATED.
  if (allocationStatus === 'PUBLISHED') {
    await markHousingUnitsStatus(
      allocations.map((item) => item.housingUnitId),
      'Reserved',
    );
    await markApplicationsAllocated(allocations.map((item) => item.applicationId));
  }

  const results = await findRoundAllocationResults(roundId);

  return {
    summary: {
      roundId,
      rankedApplicants: rankedApplications.length,
      allocatedCount: allocations.length,
      unallocatedCount: Math.max(rankedApplications.length - allocations.length, 0),
      remainingAvailableHouses: availableUnits.length,
    },
    results,
  };
}
