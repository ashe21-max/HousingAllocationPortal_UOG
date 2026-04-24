import { AppError } from '../errorHandler/app-error.js';
import type {
  CreateOfficerRoundDto,
  UpdateOfficerRoundStatusDto,
} from '../dtos/officer-round.dto.js';
import {
  createApplicationRound,
  clearRoundAllocationResults,
  findAllApplicationRounds,
  findAvailableHousingUnits,
  findExistingRoundAllocationHousingUnitIds,
  findRoundAllocationResults,
  findRoundById,
  findRoundRankedApplications,
  findRoundsReadyForAllocation,
  insertAllocationResults,
  markApplicationsAllocated,
  markHousingUnitsStatus,
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

  if (round.committeeRankingStatus !== 'FINAL_SUBMITTED') {
    throw new AppError(
      'Round ranking must be final before allocation',
      409,
      'RANKING_NOT_FINAL',
    );
  }

  const [rankedApplications, availableUnitsInitial, existingHousingIds] =
    await Promise.all([
      findRoundRankedApplications(roundId),
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

  if (existingHousingIds.length > 0) {
    await markHousingUnitsStatus(existingHousingIds, 'Available');
    await clearRoundAllocationResults(roundId);
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

  await insertAllocationResults(allocations);
  await markHousingUnitsStatus(
    allocations.map((item) => item.housingUnitId),
    'Reserved',
  );
  await markApplicationsAllocated(allocations.map((item) => item.applicationId));

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
