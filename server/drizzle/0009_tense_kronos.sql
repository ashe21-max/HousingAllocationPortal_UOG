CREATE TYPE "public"."allocation_result_status" AS ENUM('PRELIMINARY', 'PUBLISHED');--> statement-breakpoint
CREATE TABLE "allocation_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"round_id" uuid NOT NULL,
	"application_id" uuid NOT NULL,
	"housing_unit_id" uuid NOT NULL,
	"allocated_by_user_id" uuid NOT NULL,
	"status" "allocation_result_status" DEFAULT 'PRELIMINARY' NOT NULL,
	"allocated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "allocation_results" ADD CONSTRAINT "allocation_results_round_id_application_rounds_id_fk" FOREIGN KEY ("round_id") REFERENCES "public"."application_rounds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "allocation_results" ADD CONSTRAINT "allocation_results_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "allocation_results" ADD CONSTRAINT "allocation_results_housing_unit_id_housing_units_id_fk" FOREIGN KEY ("housing_unit_id") REFERENCES "public"."housing_units"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "allocation_results" ADD CONSTRAINT "allocation_results_allocated_by_user_id_users_id_fk" FOREIGN KEY ("allocated_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "allocation_results_round_application_unique" ON "allocation_results" USING btree ("round_id","application_id");--> statement-breakpoint
CREATE UNIQUE INDEX "allocation_results_round_housing_unit_unique" ON "allocation_results" USING btree ("round_id","housing_unit_id");--> statement-breakpoint
CREATE INDEX "allocation_results_round_idx" ON "allocation_results" USING btree ("round_id");--> statement-breakpoint
CREATE INDEX "allocation_results_housing_unit_idx" ON "allocation_results" USING btree ("housing_unit_id");