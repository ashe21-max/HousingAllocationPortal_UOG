export interface CreateBackupDto {
  type: 'full' | 'incremental' | 'partial';
  description?: string;
  tables?: string[];
}

export interface BackupListQueryDto {
  page?: string;
  pageSize?: string;
  type?: string;
  status?: string;
  search?: string;
}

export interface UpdateBackupScheduleDto {
  name?: string;
  type?: 'full' | 'incremental' | 'partial';
  frequency?: 'hourly' | 'daily' | 'weekly' | 'monthly';
  tables?: string[];
  enabled?: boolean;
  retentionDays?: number;
}

export interface CreateBackupScheduleDto {
  name: string;
  type: 'full' | 'incremental' | 'partial';
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  tables?: string[];
  enabled?: boolean;
  retentionDays?: number;
}
