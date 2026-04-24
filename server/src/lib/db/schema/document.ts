import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { applications } from './application.js';
import { users } from './auth.js';

export const documentPurposeEnum = pgEnum('document_purpose', [
  'EDUCATIONAL_TITLE',
  'EDUCATIONAL_LEVEL',
  'SERVICE_YEARS',
  'RESPONSIBILITY',
  'FAMILY_STATUS',
  'DISABILITY_CERTIFICATION',
  'HIV_ILLNESS_CERTIFICATION',
  'SPOUSE_PROOF',
  'OTHER',
]);

export const documentStatusEnum = pgEnum('document_status', [
  'UPLOADED',
  'VERIFIED',
  'REJECTED',
]);

export const lecturerDocuments = pgTable(
  'lecturer_documents',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    applicationId: uuid('application_id').references(() => applications.id, {
      onDelete: 'set null',
    }),
    purpose: documentPurposeEnum('purpose').notNull(),
    originalFileName: varchar('original_file_name', { length: 255 }).notNull(),
    mimeType: varchar('mime_type', { length: 120 }).notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    storagePath: text('storage_path').notNull(),
    notes: text('notes'),
    status: documentStatusEnum('status').notNull().default('UPLOADED'),
    uploadedAt: timestamp('uploaded_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('lecturer_documents_user_id_idx').on(table.userId),
    index('lecturer_documents_application_id_idx').on(table.applicationId),
    index('lecturer_documents_purpose_idx').on(table.purpose),
    index('lecturer_documents_status_idx').on(table.status),
  ],
);

export type LecturerDocument = InferSelectModel<typeof lecturerDocuments>;
export type NewLecturerDocument = InferInsertModel<typeof lecturerDocuments>;
export type DocumentPurpose = (typeof documentPurposeEnum.enumValues)[number];
export type DocumentStatus = (typeof documentStatusEnum.enumValues)[number];
