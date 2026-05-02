import { and, desc, eq, inArray } from 'drizzle-orm';

import { db } from '../lib/db/index.js';
import { allocationResults } from '../lib/db/schema/allocation.js';
import { applications, applicationRounds } from '../lib/db/schema/application.js';
import { users } from '../lib/db/schema/auth.js';
import { housingUnits } from '../lib/db/schema/housing.js';
import { scoreSnapshots } from '../lib/db/schema/scoring.js';
import type { SaveApplicationDraftInput } from '../dtos/application.dto.js';

const applicationSelection = {
  id: applications.id,
  userId: applications.userId,
  roundId: applications.roundId,
  preferredHousingUnitId: applications.preferredHousingUnitId,
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
};

export async function findApplicationRoundById(roundId: string) {
  const [round] = await db
    .select({
      id: applicationRounds.id,
      name: applicationRounds.name,
      status: applicationRounds.status,
      startsAt: applicationRounds.startsAt,
      endsAt: applicationRounds.endsAt,
      createdAt: applicationRounds.createdAt,
      updatedAt: applicationRounds.updatedAt,
    })
    .from(applicationRounds)
    .where(eq(applicationRounds.id, roundId))
    .limit(1);

  return round ?? null;
}

export async function findApplicationByUserAndRound(userId: string, roundId: string) {
  const [application] = await db
    .select(applicationSelection)
    .from(applications)
    .where(
      and(eq(applications.userId, userId), eq(applications.roundId, roundId)),
    )
    .orderBy(desc(applications.createdAt))
    .limit(1);

  return application ?? null;
}

export async function createApplicationDraft(
  userId: string,
  input: SaveApplicationDraftInput,
) {
  const [created] = await db
    .insert(applications)
    .values({
      userId,
      roundId: input.roundId,
      preferredHousingUnitId: input.preferredHousingUnitId,
      notes: input.notes,
      status: 'DRAFT',
    })
    .returning(applicationSelection);

  return created ?? null;
}

export async function updateApplicationDraft(
  applicationId: string,
  userId: string,
  input: SaveApplicationDraftInput,
) {
  const [updated] = await db
    .update(applications)
    .set({
      preferredHousingUnitId: input.preferredHousingUnitId,
      notes: input.notes,
      updatedAt: new Date(),
    })
    .where(and(eq(applications.id, applicationId), eq(applications.userId, userId)))
    .returning(applicationSelection);

  return updated ?? null;
}

export async function findApplicationByIdAndUser(
  applicationId: string,
  userId: string,
) {
  const [application] = await db
    .select(applicationSelection)
    .from(applications)
    .where(
      and(eq(applications.id, applicationId), eq(applications.userId, userId)),
    )
    .limit(1);

  return application ?? null;
}

export async function submitApplication(
  applicationId: string,
  userId: string,
  scoreSnapshotId: string,
) {
  const now = new Date();
  const [submitted] = await db
    .update(applications)
    .set({
      status: 'SUBMITTED',
      scoreSnapshotId,
      submittedAt: now,
      updatedAt: now,
    })
    .where(and(eq(applications.id, applicationId), eq(applications.userId, userId)))
    .returning(applicationSelection);

  return submitted ?? null;
}

export async function findMyApplications(userId: string) {
  const applicationsData = await db
    .select({
      ...applicationSelection,
      roundName: applicationRounds.name,
      roundStatus: applicationRounds.status,
      roundStartsAt: applicationRounds.startsAt,
      roundEndsAt: applicationRounds.endsAt,
      preferredHousingBuildingName: housingUnits.buildingName,
      preferredHousingBlockNumber: housingUnits.blockNumber,
      preferredHousingRoomNumber: housingUnits.roomNumber,
      preferredHousingRoomType: housingUnits.roomType,
      attachedScoreFinal: scoreSnapshots.finalScore,
    })
    .from(applications)
    .leftJoin(applicationRounds, eq(applications.roundId, applicationRounds.id))
    .leftJoin(housingUnits, eq(applications.preferredHousingUnitId, housingUnits.id))
    .leftJoin(scoreSnapshots, eq(applications.scoreSnapshotId, scoreSnapshots.id))
    .where(eq(applications.userId, userId))
    .orderBy(desc(applications.createdAt));

  // Extract final score from notes if available, otherwise use score snapshot
  return applicationsData.map((app) => {
    let finalScore = app.attachedScoreFinal;
    
    if (app.notes) {
      try {
        const parsedNotes = JSON.parse(app.notes);
        if (parsedNotes.score && parsedNotes.score.final !== undefined) {
          finalScore = parsedNotes.score.final;
        }
      } catch (e) {
        // If notes can't be parsed, use the snapshot score
        console.log('Could not parse application notes for score:', e);
      }
    }
    
    return {
      ...app,
      attachedScoreFinal: finalScore,
    };
  });
}

export async function findActiveRoundsForLecturer() {
  const rounds = await db
    .select({
      id: applicationRounds.id,
      name: applicationRounds.name,
      status: applicationRounds.status,
      startsAt: applicationRounds.startsAt,
      endsAt: applicationRounds.endsAt,
    })
    .from(applicationRounds)
    .where(inArray(applicationRounds.status, ['DRAFT', 'OPEN']))
    .orderBy(desc(applicationRounds.startsAt));

  return rounds;
}

export async function findDepartmentAllocationResults(department: string) {
  return db
    .select({
      allocationResultId: allocationResults.id,
      allocationStatus: allocationResults.status,
      allocatedAt: allocationResults.allocatedAt,
      roundId: allocationResults.roundId,
      roundName: applicationRounds.name,
      lecturerUserId: users.id,
      lecturerName: users.name,
      lecturerEmail: users.email,
      lecturerDepartment: users.department,
      housingUnitId: allocationResults.housingUnitId,
      housingBuildingName: housingUnits.buildingName,
      housingBlockNumber: housingUnits.blockNumber,
      housingRoomNumber: housingUnits.roomNumber,
      housingRoomType: housingUnits.roomType,
      housingLocation: housingUnits.location,
    })
    .from(allocationResults)
    .leftJoin(applications, eq(allocationResults.applicationId, applications.id))
    .leftJoin(users, eq(applications.userId, users.id))
    .leftJoin(applicationRounds, eq(allocationResults.roundId, applicationRounds.id))
    .leftJoin(housingUnits, eq(allocationResults.housingUnitId, housingUnits.id))
    .where(eq(users.department, department))
    .orderBy(desc(allocationResults.allocatedAt), users.name);
}

export async function deleteApplicationByIdAndUser(
  applicationId: string,
  userId: string,
) {
  console.log('Deleting application:', { applicationId, userId });
  
  const [deleted] = await db
    .delete(applications)
    .where(and(eq(applications.id, applicationId), eq(applications.userId, userId)))
    .returning(applicationSelection);

  if (deleted) {
    console.log('Application deleted successfully:', deleted.id);
  } else {
    console.log('Application not found or already deleted');
  }

  return deleted ?? null;
}
