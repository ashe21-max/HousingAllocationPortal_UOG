CREATE TABLE "announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"type" varchar(50) DEFAULT 'GENERAL' NOT NULL,
	"target_roles" text[],
	"is_active" boolean DEFAULT true NOT NULL,
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP INDEX "housing_units_block_room_unique";--> statement-breakpoint
CREATE INDEX "announcements_created_by_idx" ON "announcements" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "announcements_is_active_idx" ON "announcements" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "announcements_type_idx" ON "announcements" USING btree ("type");--> statement-breakpoint
CREATE UNIQUE INDEX "housing_units_building_location_block_room_unique" ON "housing_units" USING btree ("building_name","location","block_number","room_number");