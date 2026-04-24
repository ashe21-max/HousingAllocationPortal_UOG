import { and, asc, desc, eq, inArray } from 'drizzle-orm';

import { db } from '../lib/db/index.js';
import { applications, applicationRounds } from '../lib/db/schema/application.js';
import { users } from '../lib/db/schema/auth.js';
import { committeeRankEntries } from '../lib/db/schema/committee-ranking.js';
import { housingUnits } from '../lib/db/schema/housing.js';
import { scoreSnapshots } from '../lib/db/schema/scoring.js';

type CommitteeApplicationFilters = {
  roundId?: string;
  status?: (typeof applications.status.enumValues)[number];
  complianceIssue?: boolean;
};

const queueSelection = {
  id: applications.id,
  roundId: applications.roundId,
  roundName: applicationRounds.name,
  userId: applications.userId,
  lecturerName: users.name,
  lecturerEmail: users.email,
  lecturerDepartment: users.department,
  status: applications.status,
  complianceIssue: applications.complianceIssue,
  submittedAt: applications.submittedAt,
  reviewedAt: applications.reviewedAt,
  notes: applications.notes,
  preferredHousingBuildingName: housingUnits.buildingName,
  preferredHousingBlockNumber: housingUnits.blockNumber,
  preferredHousingRoomNumber: housingUnits.roomNumber,
  finalScore: scoreSnapshots.finalScore,
  createdAt: applications.createdAt,
};

export async function findCommitteeApplications(filters: CommitteeApplicationFilters) {
  const conditions = [];

  if (filters.roundId) {
    conditions.push(eq(applications.roundId, filters.roundId));
  }
  if (filters.status) {
    conditions.push(eq(applications.status, filters.status));
  }
  if (typeof filters.complianceIssue === 'boolean') {
    conditions.push(eq(applications.complianceIssue, filters.complianceIssue));
  }

  const query = db
    .select(queueSelection)
    .from(applications)
    .leftJoin(applicationRounds, eq(applications.roundId, applicationRounds.id))
    .leftJoin(users, eq(applications.userId, users.id))
    .leftJoin(housingUnits, eq(applications.preferredHousingUnitId, housingUnits.id))
    .leftJoin(scoreSnapshots, eq(applications.scoreSnapshotId, scoreSnapshots.id))
    .orderBy(desc(applications.submittedAt), desc(applications.createdAt));

  if (conditions.length === 0) {
    return query;
  }

  if (conditions.length === 1) {
    return query.where(conditions[0]!);
  }

  return query.where(and(...conditions));
}

export async function findCommitteeApplicationById(applicationId: string) {
  const [row] = await db
    .select({
      id: applications.id,
      roundId: applications.roundId,
      roundName: applicationRounds.name,
      roundStatus: applicationRounds.status,
      userId: applications.userId,
      lecturerName: users.name,
      lecturerEmail: users.email,
      lecturerDepartment: users.department,
      preferredHousingUnitId: applications.preferredHousingUnitId,
      preferredHousingBuildingName: housingUnits.buildingName,
      preferredHousingBlockNumber: housingUnits.blockNumber,
      preferredHousingRoomNumber: housingUnits.roomNumber,
      preferredHousingRoomType: housingUnits.roomType,
      scoreSnapshotId: applications.scoreSnapshotId,
      status: applications.status,
      submittedAt: applications.submittedAt,
      reviewedAt: applications.reviewedAt,
      reviewedByUserId: applications.reviewedByUserId,
      complianceIssue: applications.complianceIssue,
      complianceNotes: applications.complianceNotes,
      notes: applications.notes,
      createdAt: applications.createdAt,
      updatedAt: applications.updatedAt,
      scoreBreakdown: scoreSnapshots.breakdown,
      scoreBaseTotal: scoreSnapshots.baseTotal,
      scoreBonusTotal: scoreSnapshots.bonusTotal,
      scoreFinal: scoreSnapshots.finalScore,
    })
    .from(applications)
    .leftJoin(applicationRounds, eq(applications.roundId, applicationRounds.id))
    .leftJoin(users, eq(applications.userId, users.id))
    .leftJoin(housingUnits, eq(applications.preferredHousingUnitId, housingUnits.id))
    .leftJoin(scoreSnapshots, eq(applications.scoreSnapshotId, scoreSnapshots.id))
    .where(eq(applications.id, applicationId))
    .limit(1);

  return row ?? null;
}

export async function markApplicationUnderReview(
  applicationId: string,
  reviewerUserId: string,
  payload: {
    complianceIssue: boolean;
    complianceNotes: string | null;
    notes: string | null;
  },
) {
  const now = new Date();
  const [row] = await db
    .update(applications)
    .set({
      status: 'UNDER_REVIEW',
      reviewedAt: now,
      reviewedByUserId: reviewerUserId,
      complianceIssue: payload.complianceIssue,
      complianceNotes: payload.complianceNotes,
      notes: payload.notes,
      updatedAt: now,
    })
    .where(eq(applications.id, applicationId))
    .returning({
      id: applications.id,
      status: applications.status,
      reviewedAt: applications.reviewedAt,
      reviewedByUserId: applications.reviewedByUserId,
      complianceIssue: applications.complianceIssue,
      complianceNotes: applications.complianceNotes,
      notes: applications.notes,
      updatedAt: applications.updatedAt,
    });

  return row ?? null;
}

export async function findRoundEligibleApplicationsForRanking(roundId: string) {
  return db
    .select({
      applicationId: applications.id,
      scoreFinal: scoreSnapshots.finalScore,
      submittedAt: applications.submittedAt,
      createdAt: applications.createdAt,
    })
    .from(applications)
    .leftJoin(scoreSnapshots, eq(applications.scoreSnapshotId, scoreSnapshots.id))
    .where(
      and(eq(applications.roundId, roundId), eq(applications.status, 'UNDER_REVIEW')),
    );
}

export async function upsertCommitteeRankEntries(
  roundId: string,
  updatedByUserId: string,
  entries: Array<{ applicationId: string; rankPosition: number }>,
) {
  if (entries.length === 0) {
    return [];
  }

  await db
    .delete(committeeRankEntries)
    .where(eq(committeeRankEntries.roundId, roundId));

  const inserted = await db
    .insert(committeeRankEntries)
    .values(
      entries.map((entry) => ({
        roundId,
        applicationId: entry.applicationId,
        rankPosition: entry.rankPosition,
        updatedByUserId,
      })),
    )
    .returning({
      id: committeeRankEntries.id,
      roundId: committeeRankEntries.roundId,
      applicationId: committeeRankEntries.applicationId,
      rankPosition: committeeRankEntries.rankPosition,
      updatedByUserId: committeeRankEntries.updatedByUserId,
    });

  return inserted;
}

export async function findCommitteeRankEntriesByRound(roundId: string) {
  return db
    .select({
      id: committeeRankEntries.id,
      roundId: committeeRankEntries.roundId,
      applicationId: committeeRankEntries.applicationId,
      rankPosition: committeeRankEntries.rankPosition,
      updatedByUserId: committeeRankEntries.updatedByUserId,
      lecturerName: users.name,
      lecturerDepartment: users.department,
      finalScore: scoreSnapshots.finalScore,
      applicationStatus: applications.status,
    })
    .from(committeeRankEntries)
    .leftJoin(applications, eq(committeeRankEntries.applicationId, applications.id))
    .leftJoin(users, eq(applications.userId, users.id))
    .leftJoin(scoreSnapshots, eq(applications.scoreSnapshotId, scoreSnapshots.id))
    .where(eq(committeeRankEntries.roundId, roundId))
    .orderBy(asc(committeeRankEntries.rankPosition));
}

export async function updateRoundRankingStatus(
  roundId: string,
  status: 'PRELIMINARY_SUBMITTED' | 'FINAL_SUBMITTED',
) {
  const [row] = await db
    .update(applicationRounds)
    .set({
      committeeRankingStatus: status,
      ...(status === 'PRELIMINARY_SUBMITTED'
        ? { committeePreliminarySubmittedAt: new Date() }
        : {}),
      ...(status === 'FINAL_SUBMITTED'
        ? { committeeFinalSubmittedAt: new Date() }
        : {}),
      updatedAt: new Date(),
    })
    .where(eq(applicationRounds.id, roundId))
    .returning({
      id: applicationRounds.id,
      committeeRankingStatus: applicationRounds.committeeRankingStatus,
      committeePreliminarySubmittedAt: applicationRounds.committeePreliminarySubmittedAt,
      committeeFinalSubmittedAt: applicationRounds.committeeFinalSubmittedAt,
      updatedAt: applicationRounds.updatedAt,
    });

  return row ?? null;
}

export async function markRoundApplicationsRanked(
  roundId: string,
  rankedApplicationIds: string[],
) {
  if (rankedApplicationIds.length === 0) {
    return [];
  }

  return db
    .update(applications)
    .set({
      status: 'RANKED',
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(applications.roundId, roundId),
        inArray(applications.id, rankedApplicationIds),
        eq(applications.status, 'UNDER_REVIEW'),
      ),
    )
    .returning({
      id: applications.id,
      status: applications.status,
      updatedAt: applications.updatedAt,
    });
}
