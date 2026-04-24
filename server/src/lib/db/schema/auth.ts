import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const userRoleEnum = pgEnum('user_role', [
  'ADMIN',
  'LECTURER',
  'OFFICER',
  'COMMITTEE',
]);

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 320 }).notNull(),
    password: varchar('password', { length: 255 }),
    role: userRoleEnum('role').notNull(),
    department: varchar('department', { length: 255 }),
    isVerified: boolean('is_verified').notNull().default(false),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('users_email_unique').on(table.email),
    index('users_role_idx').on(table.role),
  ],
);

export const otpCodes = pgTable(
  'otp_codes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    code: varchar('code', { length: 12 }).notNull(),
    expiresAt: timestamp('expires_at', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
    attempts: integer('attempts').notNull().default(0),
    resendCount: integer('resend_count').notNull().default(0),
  },
  (table) => [
    uniqueIndex('otp_codes_user_id_unique').on(table.userId),
    index('otp_codes_expires_at_idx').on(table.expiresAt),
  ],
);

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type OtpCode = InferSelectModel<typeof otpCodes>;
export type NewOtpCode = InferInsertModel<typeof otpCodes>;
export type UserRole = (typeof userRoleEnum.enumValues)[number];
