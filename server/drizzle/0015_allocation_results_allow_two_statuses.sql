-- Allow storing both PRELIMINARY and PUBLISHED allocation results for the same round.
-- This fixes the issue where submitting final results removes preliminary results.

DROP INDEX IF EXISTS "allocation_results_round_application_unique";
DROP INDEX IF EXISTS "allocation_results_round_housing_unit_unique";

CREATE UNIQUE INDEX IF NOT EXISTS "allocation_results_round_application_unique"
  ON "allocation_results" USING btree ("round_id", "application_id", "status");

CREATE UNIQUE INDEX IF NOT EXISTS "allocation_results_round_housing_unit_unique"
  ON "allocation_results" USING btree ("round_id", "housing_unit_id", "status");

