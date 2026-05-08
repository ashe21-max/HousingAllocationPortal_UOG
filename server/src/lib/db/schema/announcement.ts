import { relations } from "drizzle-orm";
import { boolean, index, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const announcements = pgTable(
  "announcements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
    type: varchar("type", { length: 50 }).notNull().default("GENERAL"),
    targetRoles: text("target_roles").array(),
    isActive: boolean("is_active").default(true).notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    createdBy: uuid("created_by").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    createdByIdx: index("announcements_created_by_idx").on(table.createdBy),
    isActiveIdx: index("announcements_is_active_idx").on(table.isActive),
    typeIdx: index("announcements_type_idx").on(table.type),
  }),
);

export const announcementsRelations = relations(announcements, ({}) => ({}));
