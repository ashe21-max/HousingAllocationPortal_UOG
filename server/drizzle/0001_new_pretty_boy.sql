DROP INDEX "otp_codes_user_id_idx";--> statement-breakpoint
ALTER TABLE "otp_codes" ADD COLUMN "resend_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "otp_codes_user_id_unique" ON "otp_codes" USING btree ("user_id");