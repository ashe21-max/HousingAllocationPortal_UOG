import { and, asc, eq, inArray } from 'drizzle-orm';

import { db } from '../lib/db/index.js';
import { allocationResults } from '../lib/db/schema/allocation.js';
import { applications, applicationRounds } from '../lib/db/schema/application.js';
import { users } from '../lib/db/schema/auth.js';
import { committeeRankEntries } from '../lib/db/schema/committee-ranking.js';
import { housingUnits } from '../lib/db/schema/housing.js';

export async function findRoundsReadyForAllocation() {
  return db
    .select({
      id: applicationRounds.id,
      name: applicationRounds.name,
      status: applicationRounds.status,
      committeeRankingStatus: applicationRounds.committeeRankingStatus,
      startsAt: applicationRounds.startsAt,
      endsAt: applicationRounds.endsAt,
    })
    .from(applicationRounds)
    .where(eq(applicationRounds.committeeRankingStatus, 'FINAL_SUBMITTED'))
    .orderBy(asc(applicationRounds.startsAt));
}

export async function createApplicationRound(input: {
  name: string;
  description: string | null;
  status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'ARCHIVED';
  startsAt: Date;
  endsAt: Date;
  createdByUserId: string;
}) {
  const [row] = await db
    .insert(applicationRounds)
    .values({
      name: input.name,
      description: input.description,
      status: input.status,
      committeeRankingStatus: 'DRAFT',
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      createdByUserId: input.createdByUserId,
    })
    .returning({
      id: applicationRounds.id,
      name: applicationRounds.name,
      description: applicationRounds.description,
      status: applicationRounds.status,
      committeeRankingStatus: applicationRounds.committeeRankingStatus,
      committeePreliminarySubmittedAt: applicationRounds.committeePreliminarySubmittedAt,
      committeeFinalSubmittedAt: applicationRounds.committeeFinalSubmittedAt,
      startsAt: applicationRounds.startsAt,
      endsAt: applicationRounds.endsAt,
      createdByUserId: applicationRounds.createdByUserId,
      createdAt: applicationRounds.createdAt,
      updatedAt: applicationRounds.updatedAt,
    });

  return row ?? null;
}

export async function findAllApplicationRounds() {
  return db
    .select({
      id: applicationRounds.id,
      name: applicationRounds.name,
      description: applicationRounds.description,
      status: applicationRounds.status,
      committeeRankingStatus: applicationRounds.committeeRankingStatus,
      committeePreliminarySubmittedAt: applicationRounds.committeePreliminarySubmittedAt,
      committeeFinalSubmittedAt: applicationRounds.committeeFinalSubmittedAt,
      startsAt: applicationRounds.startsAt,
      endsAt: applicationRounds.endsAt,
      createdByUserId: applicationRounds.createdByUserId,
      createdAt: applicationRounds.createdAt,
      updatedAt: applicationRounds.updatedAt,
    })
    .from(applicationRounds)
    .orderBy(asc(applicationRounds.startsAt));
}

export async function findRoundById(roundId: string) {
  const [row] = await db
    .select({
      id: applicationRounds.id,
      name: applicationRounds.name,
      status: applicationRounds.status,
      committeeRankingStatus: applicationRounds.committeeRankingStatus,
      startsAt: applicationRounds.startsAt,
      endsAt: applicationRounds.endsAt,
    })
    .from(applicationRounds)
    .where(eq(applicationRounds.id, roundId))
    .limit(1);

  return row ?? null;
}

export async function updateApplicationRoundStatus(
  roundId: string,
  status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'ARCHIVED',
) {
  const [row] = await db
    .update(applicationRounds)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(applicationRounds.id, roundId))
    .returning({
      id: applicationRounds.id,
      name: applicationRounds.name,
      description: applicationRounds.description,
      status: applicationRounds.status,
      committeeRankingStatus: applicationRounds.committeeRankingStatus,
      committeePreliminarySubmittedAt: applicationRounds.committeePreliminarySubmittedAt,
      committeeFinalSubmittedAt: applicationRounds.committeeFinalSubmittedAt,
      startsAt: applicationRounds.startsAt,
      endsAt: applicationRounds.endsAt,
      createdByUserId: applicationRounds.createdByUserId,
      createdAt: applicationRounds.createdAt,
      updatedAt: applicationRounds.updatedAt,
    });

  return row ?? null;
}

export async function findAvailableHousingUnits() {
  return db
    .select({
      id: housingUnits.id,
      buildingName: housingUnits.buildingName,
      blockNumber: housingUnits.blockNumber,
      roomNumber: housingUnits.roomNumber,
      roomType: housingUnits.roomType,
      status: housingUnits.status,
      location: housingUnits.location,
    })
    .from(housingUnits)
    .where(eq(housingUnits.status, 'Available'))
    .orderBy(
      asc(housingUnits.buildingName),
      asc(housingUnits.blockNumber),
      asc(housingUnits.roomNumber),
    );
}

export async function findRoundRankedApplications(roundId: string) {
  return db
    .select({
      applicationId: applications.id,
      userId: applications.userId,
      preferredHousingUnitId: applications.preferredHousingUnitId,
      rankPosition: committeeRankEntries.rankPosition,
    })
    .from(committeeRankEntries)
    .innerJoin(applications, eq(committeeRankEntries.applicationId, applications.id))
    .where(
      and(
        eq(committeeRankEntries.roundId, roundId),
        eq(applications.roundId, roundId),
        eq(applications.status, 'RANKED'),
      ),
    )
    .orderBy(asc(committeeRankEntries.rankPosition));
}

export async function findRoundAllocationResults(roundId: string) {
  return db
    .select({
      id: allocationResults.id,
      roundId: allocationResults.roundId,
      applicationId: allocationResults.applicationId,
      housingUnitId: allocationResults.housingUnitId,
      status: allocationResults.status,
      allocatedAt: allocationResults.allocatedAt,
      lecturerName: users.name,
      housingBuildingName: housingUnits.buildingName,
      housingBlockNumber: housingUnits.blockNumber,
      housingRoomNumber: housingUnits.roomNumber,
      housingRoomType: housingUnits.roomType,
    })
    .from(allocationResults)
    .leftJoin(applications, eq(allocationResults.applicationId, applications.id))
    .leftJoin(users, eq(applications.userId, users.id))
    .leftJoin(housingUnits, eq(allocationResults.housingUnitId, housingUnits.id))
    .where(eq(allocationResults.roundId, roundId))
    .orderBy(asc(allocationResults.allocatedAt));
}

export async function findExistingRoundAllocationHousingUnitIds(roundId: string) {
  const rows = await db
    .select({
      housingUnitId: allocationResults.housingUnitId,
    })
    .from(allocationResults)
    .where(eq(allocationResults.roundId, roundId));

  return rows.map((row) => row.housingUnitId);
}

export async function clearRoundAllocationResults(roundId: string) {
  await db.delete(allocationResults).where(eq(allocationResults.roundId, roundId));
}

export async function markHousingUnitsStatus(
  housingUnitIds: string[],
  status: 'Available' | 'Reserved',
) {
  if (housingUnitIds.length === 0) {
    return [];
  }

  return db
    .update(housingUnits)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(inArray(housingUnits.id, housingUnitIds))
    .returning({
      id: housingUnits.id,
      status: housingUnits.status,
    });
}

export async function insertAllocationResults(
  rows: Array<{
    roundId: string;
    applicationId: string;
    housingUnitId: string;
    allocatedByUserId: string;
  }>,
) {
  if (rows.length === 0) {
    return [];
  }

  return db
    .insert(allocationResults)
    .values(
      rows.map((row) => ({
        roundId: row.roundId,
        applicationId: row.applicationId,
        housingUnitId: row.housingUnitId,
        allocatedByUserId: row.allocatedByUserId,
        status: 'PRELIMINARY' as const,
      })),
    )
    .returning({
      id: allocationResults.id,
      roundId: allocationResults.roundId,
      applicationId: allocationResults.applicationId,
      housingUnitId: allocationResults.housingUnitId,
      status: allocationResults.status,
      allocatedAt: allocationResults.allocatedAt,
    });
}

export async function markApplicationsAllocated(applicationIds: string[]) {
  if (applicationIds.length === 0) {
    return [];
  }

  return db
    .update(applications)
    .set({
      status: 'ALLOCATED',
      updatedAt: new Date(),
    })
    .where(inArray(applications.id, applicationIds))
    .returning({
      id: applications.id,
      status: applications.status,
    });
}
