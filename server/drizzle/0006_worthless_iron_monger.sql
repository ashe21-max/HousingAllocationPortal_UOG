CREATE TYPE "public"."document_purpose" AS ENUM('EDUCATIONAL_TITLE', 'EDUCATIONAL_LEVEL', 'SERVICE_YEARS', 'RESPONSIBILITY', 'FAMILY_STATUS', 'DISABILITY_CERTIFICATION', 'HIV_ILLNESS_CERTIFICATION', 'SPOUSE_PROOF', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."document_status" AS ENUM('UPLOADED', 'VERIFIED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "lecturer_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"application_id" uuid,
	"purpose" "document_purpose" NOT NULL,
	"original_file_name" varchar(255) NOT NULL,
	"mime_type" varchar(120) NOT NULL,
	"size_bytes" integer NOT NULL,
	"storage_path" text NOT NULL,
	"notes" text,
	"status" "document_status" DEFAULT 'UPLOADED' NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lecturer_documents" ADD CONSTRAINT "lecturer_documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lecturer_documents" ADD CONSTRAINT "lecturer_documents_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lecturer_documents_user_id_idx" ON "lecturer_documents" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "lecturer_documents_application_id_idx" ON "lecturer_documents" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "lecturer_documents_purpose_idx" ON "lecturer_documents" USING btree ("purpose");--> statement-breakpoint
CREATE INDEX "lecturer_documents_status_idx" ON "lecturer_documents" USING btree ("status");