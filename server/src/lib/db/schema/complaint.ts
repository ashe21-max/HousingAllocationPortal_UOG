import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { index, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

import { users } from './auth.js';

export const complaintStatusEnum = pgEnum('complaint_status', [
  'OPEN',
  'RESOLVED',
  'CLOSED',
]);

export const complaintThreads = pgTable(
  'complaint_threads',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    lecturerUserId: uuid('lecturer_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    targetDepartment: varchar('target_department', { length: 255 }).notNull(),
    subject: varchar('subject', { length: 255 }).notNull(),
    status: complaintStatusEnum('status').notNull().default('OPEN'),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('complaint_threads_lecturer_user_id_idx').on(table.lecturerUserId),
    index('complaint_threads_target_department_idx').on(table.targetDepartment),
    index('complaint_threads_status_idx').on(table.status),
  ],
);

export const complaintMessages = pgTable(
  'complaint_messages',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    threadId: uuid('thread_id')
      .notNull()
      .references(() => complaintThreads.id, { onDelete: 'cascade' }),
    senderUserId: uuid('sender_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    message: text('message').notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('complaint_messages_thread_id_idx').on(table.threadId),
    index('complaint_messages_sender_user_id_idx').on(table.senderUserId),
  ],
);

export type ComplaintThread = InferSelectModel<typeof complaintThreads>;
export type NewComplaintThread = InferInsertModel<typeof complaintThreads>;
export type ComplaintMessage = InferSelectModel<typeof complaintMessages>;
export type NewComplaintMessage = InferInsertModel<typeof complaintMessages>;
