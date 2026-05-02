import { relations } from "drizzle-orm";
import { index, json, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const allocationReports = pgTable(
  "allocation_reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    roundId: uuid("round_id").notNull(),
    roundName: varchar("round_name", { length: 255 }).notNull(),
    roundStatus: varchar("round_status", { length: 50 }).notNull(),
    committeeRankingStatus: varchar("committee_ranking_status", { length: 50 }).notNull(),
    allocationCount: text("allocation_count").notNull(),
    reportData: json("report_data").notNull(),
    sentByUserId: uuid("sent_by_user_id").notNull(),
    sentAt: timestamp("sent_at").defaultNow().notNull(),
    status: varchar("status", { length: 50 }).default("PENDING").notNull(),
    adminNotes: text("admin_notes"),
    reviewedAt: timestamp("reviewed_at"),
    reviewedByUserId: uuid("reviewed_by_user_id"),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    roundIdIdx: index("allocation_reports_round_id_idx").on(table.roundId),
    sentByUserIdIdx: index("allocation_reports_sent_by_user_id_idx").on(table.sentByUserId),
    statusIdx: index("allocation_reports_status_idx").on(table.status),
  }),
);

export const allocationReportsRelations = relations(allocationReports, ({}) => ({}));
