CREATE TYPE "public"."complaint_status" AS ENUM('OPEN', 'RESOLVED', 'CLOSED');--> statement-breakpoint
CREATE TABLE "complaint_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" uuid NOT NULL,
	"sender_user_id" uuid NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "complaint_threads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lecturer_user_id" uuid NOT NULL,
	"target_department" varchar(255) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"status" "complaint_status" DEFAULT 'OPEN' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "complaint_messages" ADD CONSTRAINT "complaint_messages_thread_id_complaint_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."complaint_threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaint_messages" ADD CONSTRAINT "complaint_messages_sender_user_id_users_id_fk" FOREIGN KEY ("sender_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaint_threads" ADD CONSTRAINT "complaint_threads_lecturer_user_id_users_id_fk" FOREIGN KEY ("lecturer_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "complaint_messages_thread_id_idx" ON "complaint_messages" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "complaint_messages_sender_user_id_idx" ON "complaint_messages" USING btree ("sender_user_id");--> statement-breakpoint
CREATE INDEX "complaint_threads_lecturer_user_id_idx" ON "complaint_threads" USING btree ("lecturer_user_id");--> statement-breakpoint
CREATE INDEX "complaint_threads_target_department_idx" ON "complaint_threads" USING btree ("target_department");--> statement-breakpoint
CREATE INDEX "complaint_threads_status_idx" ON "complaint_threads" USING btree ("status");