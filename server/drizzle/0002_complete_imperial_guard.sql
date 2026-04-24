CREATE TYPE "public"."housing_condition" AS ENUM('New', 'Good', 'Needs Repair', 'Under Maintenance');--> statement-breakpoint
CREATE TYPE "public"."housing_status" AS ENUM('Available', 'Occupied', 'Reserved');--> statement-breakpoint
CREATE TYPE "public"."room_type" AS ENUM('Studio', '1-Bedroom', '2-Bedroom', '3-Bedroom');--> statement-breakpoint
CREATE TABLE "housing_units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"building_name" varchar(255) NOT NULL,
	"block_number" varchar(100) NOT NULL,
	"room_number" varchar(100) NOT NULL,
	"room_type" "room_type" NOT NULL,
	"condition" "housing_condition" NOT NULL,
	"status" "housing_status" DEFAULT 'Available' NOT NULL,
	"location" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "housing_units_block_room_unique" ON "housing_units" USING btree ("block_number","room_number");