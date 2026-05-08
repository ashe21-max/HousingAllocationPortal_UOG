import { and, desc, eq, gte, inArray, isNull, lte, or } from 'drizzle-orm';

import { db } from '../lib/db/index.js';
import { announcements } from '../lib/db/schema/announcement.js';

export async function findAnnouncements(filter?: {
  targetRoles?: string[];
  isActive?: boolean;
  createdBy?: string;
}) {
  const conditions = [];

  if (filter?.isActive !== undefined) {
    conditions.push(eq(announcements.isActive, filter.isActive));
  }

  if (filter?.createdBy) {
    conditions.push(eq(announcements.createdBy, filter.createdBy));
  }

  if (filter?.targetRoles && filter.targetRoles.length > 0) {
    conditions.push(inArray(announcements.type, filter.targetRoles));
  }

  const result = await db
    .select()
    .from(announcements)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(announcements.createdAt));

  return result;
}

export async function findActiveAnnouncements(targetRoles?: string[]) {
  const now = new Date();
  const conditions = [eq(announcements.isActive, true)];

  if (targetRoles && targetRoles.length > 0) {
    conditions.push(inArray(announcements.type, targetRoles));
  }

  return db
    .select()
    .from(announcements)
    .where(
      and(
        ...conditions,
        and(
          or(
            lte(announcements.startsAt, now),
            isNull(announcements.startsAt)
          ),
          or(
            gte(announcements.endsAt, now),
            isNull(announcements.endsAt)
          )
        )
      )
    )
    .orderBy(desc(announcements.createdAt));
}

export async function createAnnouncement(input: {
  title: string;
  content: string;
  type: string;
  targetRoles?: string[];
  startsAt?: Date;
  endsAt?: Date;
  createdBy: string;
}) {
  try {
    const [row] = await db
      .insert(announcements)
      .values({
        title: input.title,
        content: input.content,
        type: input.type,
        targetRoles: input.targetRoles,
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        createdBy: input.createdBy,
        isActive: true,
      })
      .returning();

    return row ?? null;
  } catch (error) {
    console.error('Repository createAnnouncement error:', error);
    throw error;
  }
}

export async function updateAnnouncement(
  id: string,
  input: Partial<{
    title: string;
    content: string;
    type: string;
    targetRoles: string[];
    isActive: boolean;
    startsAt: Date;
    endsAt: Date;
  }>
) {
  const [row] = await db
    .update(announcements)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(announcements.id, id))
    .returning();

  return row ?? null;
}

export async function deleteAnnouncement(id: string) {
  const [row] = await db
    .delete(announcements)
    .where(eq(announcements.id, id))
    .returning();

  return row ?? null;
}

export async function findAnnouncementById(id: string) {
  const [row] = await db
    .select()
    .from(announcements)
    .where(eq(announcements.id, id));

  return row ?? null;
}
