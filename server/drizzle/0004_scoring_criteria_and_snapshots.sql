CREATE TABLE "lecturer_scoring_criteria" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"educational_title" varchar(255) NOT NULL,
	"educational_level" varchar(128) NOT NULL,
	"service_years" integer DEFAULT 0 NOT NULL,
	"responsibility" varchar(255) NOT NULL,
	"family_status" varchar(255) NOT NULL,
	"female_bonus_eligible" boolean DEFAULT false NOT NULL,
	"disability_bonus_eligible" boolean DEFAULT false NOT NULL,
	"hiv_illness_bonus_eligible" boolean DEFAULT false NOT NULL,
	"spouse_bonus_eligible" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "score_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"scoring_policy_id" uuid,
	"breakdown" jsonb NOT NULL,
	"base_total" double precision NOT NULL,
	"bonus_total" double precision NOT NULL,
	"final_score" double precision NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scoring_policies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"version" integer DEFAULT 1 NOT NULL,
	"effective_from" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lecturer_scoring_criteria" ADD CONSTRAINT "lecturer_scoring_criteria_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "score_snapshots" ADD CONSTRAINT "score_snapshots_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "score_snapshots" ADD CONSTRAINT "score_snapshots_scoring_policy_id_scoring_policies_id_fk" FOREIGN KEY ("scoring_policy_id") REFERENCES "public"."scoring_policies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "lecturer_scoring_criteria_user_id_unique" ON "lecturer_scoring_criteria" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "lecturer_scoring_criteria_user_id_idx" ON "lecturer_scoring_criteria" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "score_snapshots_user_id_idx" ON "score_snapshots" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "score_snapshots_created_at_idx" ON "score_snapshots" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "scoring_policies_effective_from_idx" ON "scoring_policies" USING btree ("effective_from");