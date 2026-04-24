import { and, asc, desc, eq } from 'drizzle-orm';

import { db } from '../lib/db/index.js';
import { complaintMessages, complaintThreads } from '../lib/db/schema/complaint.js';
import { users } from '../lib/db/schema/auth.js';

export async function createComplaintThreadWithFirstMessage(input: {
  lecturerUserId: string;
  targetDepartment: string;
  subject: string;
  message: string;
}) {
  return db.transaction(async (tx) => {
    const [thread] = await tx
      .insert(complaintThreads)
      .values({
        lecturerUserId: input.lecturerUserId,
        targetDepartment: input.targetDepartment,
        subject: input.subject,
        status: 'OPEN',
      })
      .returning({
        id: complaintThreads.id,
        lecturerUserId: complaintThreads.lecturerUserId,
        targetDepartment: complaintThreads.targetDepartment,
        subject: complaintThreads.subject,
        status: complaintThreads.status,
        createdAt: complaintThreads.createdAt,
        updatedAt: complaintThreads.updatedAt,
      });

    if (!thread) {
      return null;
    }

    await tx.insert(complaintMessages).values({
      threadId: thread.id,
      senderUserId: input.lecturerUserId,
      message: input.message,
    });

    return thread;
  });
}

export async function findLecturerComplaintThreads(lecturerUserId: string) {
  return db
    .select({
      id: complaintThreads.id,
      lecturerUserId: complaintThreads.lecturerUserId,
      targetDepartment: complaintThreads.targetDepartment,
      subject: complaintThreads.subject,
      status: complaintThreads.status,
      createdAt: complaintThreads.createdAt,
      updatedAt: complaintThreads.updatedAt,
    })
    .from(complaintThreads)
    .where(eq(complaintThreads.lecturerUserId, lecturerUserId))
    .orderBy(desc(complaintThreads.updatedAt));
}

export async function findComplaintThreadById(threadId: string) {
  const [thread] = await db
    .select({
      id: complaintThreads.id,
      lecturerUserId: complaintThreads.lecturerUserId,
      targetDepartment: complaintThreads.targetDepartment,
      subject: complaintThreads.subject,
      status: complaintThreads.status,
      createdAt: complaintThreads.createdAt,
      updatedAt: complaintThreads.updatedAt,
    })
    .from(complaintThreads)
    .where(eq(complaintThreads.id, threadId))
    .limit(1);

  return thread ?? null;
}

export async function findComplaintMessages(threadId: string) {
  return db
    .select({
      id: complaintMessages.id,
      threadId: complaintMessages.threadId,
      senderUserId: complaintMessages.senderUserId,
      senderName: users.name,
      senderRole: users.role,
      message: complaintMessages.message,
      createdAt: complaintMessages.createdAt,
    })
    .from(complaintMessages)
    .leftJoin(users, eq(complaintMessages.senderUserId, users.id))
    .where(eq(complaintMessages.threadId, threadId))
    .orderBy(asc(complaintMessages.createdAt));
}

export async function createComplaintMessage(input: {
  threadId: string;
  senderUserId: string;
  message: string;
}) {
  return db.transaction(async (tx) => {
    const [message] = await tx
      .insert(complaintMessages)
      .values({
        threadId: input.threadId,
        senderUserId: input.senderUserId,
        message: input.message,
      })
      .returning({
        id: complaintMessages.id,
        threadId: complaintMessages.threadId,
        senderUserId: complaintMessages.senderUserId,
        message: complaintMessages.message,
        createdAt: complaintMessages.createdAt,
      });

    await tx
      .update(complaintThreads)
      .set({
        updatedAt: new Date(),
      })
      .where(eq(complaintThreads.id, input.threadId));

    return message ?? null;
  });
}

export async function findCommitteeComplaintThreads(targetDepartment: string) {
  return db
    .select({
      id: complaintThreads.id,
      lecturerUserId: complaintThreads.lecturerUserId,
      lecturerName: users.name,
      targetDepartment: complaintThreads.targetDepartment,
      subject: complaintThreads.subject,
      status: complaintThreads.status,
      createdAt: complaintThreads.createdAt,
      updatedAt: complaintThreads.updatedAt,
    })
    .from(complaintThreads)
    .leftJoin(users, eq(complaintThreads.lecturerUserId, users.id))
    .where(eq(complaintThreads.targetDepartment, targetDepartment))
    .orderBy(desc(complaintThreads.updatedAt));
}
