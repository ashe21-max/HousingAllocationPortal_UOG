-- Create allocation_reports table
CREATE TABLE IF NOT EXISTS allocation_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID NOT NULL,
  round_name VARCHAR(255) NOT NULL,
  round_status VARCHAR(50) NOT NULL,
  committee_ranking_status VARCHAR(50) NOT NULL,
  allocation_count TEXT NOT NULL,
  report_data JSONB NOT NULL,
  sent_by_user_id UUID NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW() NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING' NOT NULL,
  admin_notes TEXT,
  reviewed_at TIMESTAMP,
  reviewed_by_user_id UUID,
  deleted_at TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS allocation_reports_round_id_idx ON allocation_reports(round_id);
CREATE INDEX IF NOT EXISTS allocation_reports_sent_by_user_id_idx ON allocation_reports(sent_by_user_id);
CREATE INDEX IF NOT EXISTS allocation_reports_status_idx ON allocation_reports(status);
