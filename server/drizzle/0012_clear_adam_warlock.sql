CREATE TABLE "backup_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" text NOT NULL,
	"description" text,
	"updated_by" uuid,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "backup_config_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "backup_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"backup_id" uuid,
	"level" varchar(20) NOT NULL,
	"message" text NOT NULL,
	"details" text,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "backup_schedule" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(50) NOT NULL,
	"frequency" varchar(50) NOT NULL,
	"tables" text[],
	"enabled" boolean DEFAULT true NOT NULL,
	"retention_days" integer DEFAULT 30 NOT NULL,
	"last_run_at" timestamp with time zone,
	"next_run_at" timestamp with time zone,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_backups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" varchar(255) NOT NULL,
	"type" varchar(50) NOT NULL,
	"size" integer NOT NULL,
	"status" varchar(50) DEFAULT 'creating' NOT NULL,
	"description" text,
	"tables" text[],
	"file_path" varchar(500),
	"checksum" varchar(64),
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"restored_at" timestamp with time zone,
	"restored_by" uuid
);
--> statement-breakpoint
CREATE TABLE "allocation_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"round_id" uuid NOT NULL,
	"round_name" varchar(255) NOT NULL,
	"round_status" varchar(50) NOT NULL,
	"committee_ranking_status" varchar(50) NOT NULL,
	"allocation_count" text NOT NULL,
	"report_data" json NOT NULL,
	"sent_by_user_id" uuid NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"status" varchar(50) DEFAULT 'PENDING' NOT NULL,
	"admin_notes" text,
	"reviewed_at" timestamp,
	"reviewed_by_user_id" uuid,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "backup_config" ADD CONSTRAINT "backup_config_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "backup_logs" ADD CONSTRAINT "backup_logs_backup_id_system_backups_id_fk" FOREIGN KEY ("backup_id") REFERENCES "public"."system_backups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "backup_schedule" ADD CONSTRAINT "backup_schedule_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_backups" ADD CONSTRAINT "system_backups_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_backups" ADD CONSTRAINT "system_backups_restored_by_users_id_fk" FOREIGN KEY ("restored_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "allocation_reports_round_id_idx" ON "allocation_reports" USING btree ("round_id");--> statement-breakpoint
CREATE INDEX "allocation_reports_sent_by_user_id_idx" ON "allocation_reports" USING btree ("sent_by_user_id");--> statement-breakpoint
CREATE INDEX "allocation_reports_status_idx" ON "allocation_reports" USING btree ("status");