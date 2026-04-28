-- Backup Tables Update Migration
-- Updates system_backups table to match the new backup schema and adds backup_logs table

-- Add missing columns to system_backups table
ALTER TABLE system_backups 
ADD COLUMN IF NOT EXISTS tables TEXT[],
ADD COLUMN IF NOT EXISTS file_path VARCHAR(500),
ADD COLUMN IF NOT EXISTS checksum VARCHAR(64),
ADD COLUMN IF NOT EXISTS restored_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS restored_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- Update default status to lowercase
ALTER TABLE system_backups ALTER COLUMN status SET DEFAULT 'creating';

-- Create backup_logs table
CREATE TABLE IF NOT EXISTS backup_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    backup_id UUID REFERENCES system_backups(id) ON DELETE CASCADE,
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    details TEXT,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for backup_logs
CREATE INDEX IF NOT EXISTS backup_logs_backup_id_idx ON backup_logs(backup_id);
CREATE INDEX IF NOT EXISTS backup_logs_level_idx ON backup_logs(level);
CREATE INDEX IF NOT EXISTS backup_logs_timestamp_idx ON backup_logs(timestamp);

-- Create backup_schedule table
CREATE TABLE IF NOT EXISTS backup_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    frequency VARCHAR(50) NOT NULL,
    tables TEXT[],
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    retention_days INTEGER NOT NULL DEFAULT 30,
    last_run_at TIMESTAMP WITH TIME ZONE,
    next_run_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for backup_schedule
CREATE INDEX IF NOT EXISTS backup_schedule_enabled_idx ON backup_schedule(enabled);
CREATE INDEX IF NOT EXISTS backup_schedule_frequency_idx ON backup_schedule(frequency);
CREATE INDEX IF NOT EXISTS backup_schedule_next_run_at_idx ON backup_schedule(next_run_at);

-- Create backup_config table
CREATE TABLE IF NOT EXISTS backup_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Create index for backup_config
CREATE INDEX IF NOT EXISTS backup_config_key_idx ON backup_config(key);

-- Insert default backup configuration
INSERT INTO backup_config (key, value, description) VALUES 
    ('backup_directory', './backups', 'Directory to store backup files'),
    ('max_backup_size', '1073741824', 'Maximum backup file size in bytes (1GB)'),
    ('compression_enabled', 'true', 'Enable backup compression'),
    ('auto_cleanup_days', '90', 'Days to keep old backups before cleanup')
ON CONFLICT (key) DO NOTHING;
