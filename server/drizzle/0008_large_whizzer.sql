CREATE TYPE "public"."committee_ranking_status" AS ENUM('DRAFT', 'PRELIMINARY_SUBMITTED', 'FINAL_SUBMITTED');--> statement-breakpoint
CREATE TABLE "committee_rank_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"round_id" uuid NOT NULL,
	"application_id" uuid NOT NULL,
	"rank_position" integer NOT NULL,
	"updated_by_user_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "application_rounds" ADD COLUMN "committee_ranking_status" "committee_ranking_status" DEFAULT 'DRAFT' NOT NULL;--> statement-breakpoint
ALTER TABLE "application_rounds" ADD COLUMN "committee_preliminary_submitted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "application_rounds" ADD COLUMN "committee_final_submitted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "committee_rank_entries" ADD CONSTRAINT "committee_rank_entries_round_id_application_rounds_id_fk" FOREIGN KEY ("round_id") REFERENCES "public"."application_rounds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "committee_rank_entries" ADD CONSTRAINT "committee_rank_entries_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "committee_rank_entries" ADD CONSTRAINT "committee_rank_entries_updated_by_user_id_users_id_fk" FOREIGN KEY ("updated_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "committee_rank_entries_application_id_unique" ON "committee_rank_entries" USING btree ("application_id");--> statement-breakpoint
CREATE UNIQUE INDEX "committee_rank_entries_round_rank_unique" ON "committee_rank_entries" USING btree ("round_id","rank_position");--> statement-breakpoint
CREATE INDEX "committee_rank_entries_round_id_idx" ON "committee_rank_entries" USING btree ("round_id");