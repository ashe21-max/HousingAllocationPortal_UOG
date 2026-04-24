CREATE TYPE "public"."application_round_status" AS ENUM('DRAFT', 'OPEN', 'CLOSED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."application_status" AS ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'RANKED', 'ALLOCATED', 'REJECTED', 'WITHDRAWN');--> statement-breakpoint
CREATE TABLE "application_rounds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"status" "application_round_status" DEFAULT 'DRAFT' NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"created_by_user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"round_id" uuid NOT NULL,
	"preferred_housing_unit_id" uuid,
	"score_snapshot_id" uuid,
	"status" "application_status" DEFAULT 'DRAFT' NOT NULL,
	"submitted_at" timestamp with time zone,
	"reviewed_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "application_rounds" ADD CONSTRAINT "application_rounds_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_round_id_application_rounds_id_fk" FOREIGN KEY ("round_id") REFERENCES "public"."application_rounds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_preferred_housing_unit_id_housing_units_id_fk" FOREIGN KEY ("preferred_housing_unit_id") REFERENCES "public"."housing_units"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_score_snapshot_id_score_snapshots_id_fk" FOREIGN KEY ("score_snapshot_id") REFERENCES "public"."score_snapshots"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "application_rounds_status_idx" ON "application_rounds" USING btree ("status");--> statement-breakpoint
CREATE INDEX "application_rounds_window_idx" ON "application_rounds" USING btree ("starts_at","ends_at");--> statement-breakpoint
CREATE INDEX "applications_user_id_idx" ON "applications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "applications_round_id_idx" ON "applications" USING btree ("round_id");--> statement-breakpoint
CREATE INDEX "applications_status_idx" ON "applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "applications_round_status_idx" ON "applications" USING btree ("round_id","status");