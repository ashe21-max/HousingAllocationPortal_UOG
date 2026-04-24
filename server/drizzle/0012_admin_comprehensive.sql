-- Comprehensive Admin Features Migration
-- Creates tables for audit logs, system config, announcements, backups, and allocation overrides

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    affected_record UUID,
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for audit_logs
CREATE INDEX IF NOT EXISTS audit_logs_user_id_idx ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON audit_logs(action);
CREATE INDEX IF NOT EXISTS audit_logs_timestamp_idx ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS audit_logs_affected_record_idx ON audit_logs(affected_record);

-- System Configuration Table
CREATE TABLE IF NOT EXISTS system_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Create index for system_config
CREATE INDEX IF NOT EXISTS system_config_key_idx ON system_config(key);

-- Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'INFO',
    target_roles TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    starts_at TIMESTAMP WITH TIME ZONE,
    ends_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for announcements
CREATE INDEX IF NOT EXISTS announcements_is_active_idx ON announcements(is_active);
CREATE INDEX IF NOT EXISTS announcements_type_idx ON announcements(type);
CREATE INDEX IF NOT EXISTS announcements_created_by_idx ON announcements(created_by);

-- System Backups Table
CREATE TABLE IF NOT EXISTS system_backups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    size INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'CREATING',
    description TEXT,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for system_backups
CREATE INDEX IF NOT EXISTS system_backups_status_idx ON system_backups(status);
CREATE INDEX IF NOT EXISTS system_backups_type_idx ON system_backups(type);
CREATE INDEX IF NOT EXISTS system_backups_created_by_idx ON system_backups(created_by);

-- Allocation Overrides Table
CREATE TABLE IF NOT EXISTS allocation_overrides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL,
    original_room_id UUID,
    new_room_id UUID NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for allocation_overrides
CREATE INDEX IF NOT EXISTS allocation_overrides_application_id_idx ON allocation_overrides(application_id);
CREATE INDEX IF NOT EXISTS allocation_overrides_status_idx ON allocation_overrides(status);
CREATE INDEX IF NOT EXISTS allocation_overrides_created_by_idx ON allocation_overrides(created_by);

-- Insert default system configuration values
INSERT INTO system_config (key, value, description, is_public) VALUES 
    ('maintenance_mode', 'false', 'System maintenance mode status', false)
ON CONFLICT (key) DO NOTHING;

-- Create audit log action enum type
DO $$
BEGIN;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_log_action') THEN
        RAISE NOTICE 'Type audit_log_action already exists';
    ELSE
        CREATE TYPE audit_log_action AS ENUM (
            'USER_CREATE',
            'USER_UPDATE', 
            'USER_DELETE',
            'USER_DEACTIVATE',
            'USER_ACTIVATE',
            'ROLE_CHANGE',
            'BACKUP_CREATE',
            'BACKUP_RESTORE',
            'MAINTENANCE_TOGGLE',
            'ANNOUNCEMENT_CREATE',
            'ANNOUNCEMENT_UPDATE',
            'ANNOUNCEMENT_DELETE',
            'ALLOCATION_OVERRIDE',
            'SYSTEM_CONFIG_UPDATE',
            'LOGIN_FAILED',
            'LOGIN_SUCCESS'
        );
    END IF;
END $$;
