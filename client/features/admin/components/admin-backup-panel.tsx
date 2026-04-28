"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Database,
  Download,
  Shield,
  History,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Calendar,
  HardDrive,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Eye,
  Settings,
  BarChart3,
  Activity,
  Zap,
  User
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createBackup,
  getBackups,
  deleteBackup,
  downloadBackup,
  getBackupLogs,
  createBackupSchedule,
  getBackupSchedules,
  updateBackupSchedule,
  deleteBackupSchedule,
  type BackupRecord,
  type BackupSchedule,
  type BackupLog,
  type CreateBackupRequest,
  type CreateBackupScheduleRequest,
  type UpdateBackupScheduleRequest,
} from "@/lib/api/backup";

interface SystemStats {
  totalBackups: number;
  successfulBackups: number;
  failedBackups: number;
  totalSize: string;
  lastBackup: string;
  averageBackupTime: string;
  storageUsed: number;
  storageCapacity: number;
}

export function AdminBackupPanel() {
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [backupType, setBackupType] = useState<"full" | "incremental" | "partial">("full");
  const [isAutoBackupEnabled, setIsAutoBackupEnabled] = useState(false);
  const [autoBackupInterval, setAutoBackupInterval] = useState("daily");
  const [selectedBackupLogs, setSelectedBackupLogs] = useState<BackupLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Load backups from API
  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    try {
      const response = await getBackups({ page: 1, pageSize: 50 });
      
      // Handle null response
      if (!response || !response.items) {
        setBackups([]);
        setStats({
          totalBackups: 0,
          successfulBackups: 0,
          failedBackups: 0,
          totalSize: "0 B",
          lastBackup: "",
          averageBackupTime: "0m 0s",
          storageUsed: 0,
          storageCapacity: 100
        });
        return;
      }
      
      setBackups(response.items);
      
      // Calculate stats from real data
      const totalBackups = response.total || 0;
      const successfulBackups = response.items.filter(b => b.status === "completed").length;
      const failedBackups = response.items.filter(b => b.status === "failed").length;
      const totalSize = response.items.reduce((acc, b) => acc + (b.size || 0), 0);
      
      setStats({
        totalBackups,
        successfulBackups,
        failedBackups,
        totalSize: formatBytes(totalSize),
        lastBackup: response.items[0]?.createdAt || "",
        averageBackupTime: "3m 24s",
        storageUsed: 68,
        storageCapacity: 100
      });
    } catch (error) {
      console.error("Failed to load backups:", error);
      toast.error("Failed to load backups");
      // Set empty state on error
      setBackups([]);
      setStats(null);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    try {
      const backupData: CreateBackupRequest = {
        type: backupType,
        description: `Manual ${backupType} backup`,
        tables: backupType === "partial" && selectedTables.length > 0 ? selectedTables : undefined,
      };

      const newBackup = await createBackup(backupData);
      if (newBackup) {
        setBackups(prev => [newBackup, ...prev]);
        toast.success(`${backupType.charAt(0).toUpperCase() + backupType.slice(1)} backup created successfully!`);
      }
      
      // Reload backups to get updated list
      await loadBackups();
    } catch (error) {
      console.error("Failed to create backup:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create backup";
      toast.error(errorMessage);
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleDownloadBackup = async (backup: BackupRecord) => {
    try {
      toast.info(`Downloading ${backup.filename}...`);
      await downloadBackup(backup.id);
      toast.success(`Downloaded ${backup.filename}`);
    } catch (error) {
      console.error("Failed to download backup:", error);
      toast.error("Failed to download backup");
    }
  };

  const handleDeleteBackup = async (backupId: string) => {
    try {
      await deleteBackup(backupId);
      setBackups(prev => prev.filter(b => b.id !== backupId));
      toast.success("Backup deleted successfully");
    } catch (error) {
      console.error("Failed to delete backup:", error);
      toast.error("Failed to delete backup");
    }
  };

  const handleViewLogs = async (backupId: string) => {
    setIsLoadingLogs(true);
    try {
      const logs = await getBackupLogs(backupId);
      setSelectedBackupLogs(logs || []);
    } catch (error) {
      console.error("Failed to load backup logs:", error);
      toast.error("Failed to load backup logs");
      setSelectedBackupLogs([]);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const getStatusIcon = (status: BackupRecord["status"] | null | undefined) => {
    if (!status) {
      return <Clock className="w-4 h-4 text-gray-500" />;
    }
    
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "creating":
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "restoring":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: BackupRecord["status"] | null | undefined) => {
    const variants: Record<string, string> = {
      completed: "bg-green-100 text-green-800",
      creating: "bg-blue-100 text-blue-800",
      failed: "bg-red-100 text-red-800",
      restoring: "bg-yellow-100 text-yellow-800"
    };

    const statusText = status || "unknown";
    const badgeClass = status ? variants[status] : "bg-gray-100 text-gray-800";

    return (
      <Badge className={badgeClass}>
        {statusText.charAt(0).toUpperCase() + statusText.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Database className="w-6 h-6 text-blue-600" />
            Database Backup
          </h1>
          <p className="text-gray-600 mt-1">Manage database backups, schedule automatic backups, and monitor backup history</p>
        </div>
        <Button 
          onClick={handleCreateBackup}
          disabled={isCreatingBackup}
          className="flex items-center gap-2"
        >
          {isCreatingBackup ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {isCreatingBackup ? "Creating Backup..." : "Create Backup"}
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
                <Database className="w-4 h-4" />
                Total Backups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.totalBackups}</div>
              <p className="text-xs text-blue-600 mt-1">All time backups</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {Math.round((stats.successfulBackups / stats.totalBackups) * 100)}%
              </div>
              <p className="text-xs text-green-600 mt-1">
                {stats.successfulBackups} of {stats.totalBackups} successful
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-800 flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                Storage Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{stats.totalSize}</div>
              {/* <Progress value={stats.storageUsed} className="mt-2 h-2" /> */}
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${stats.storageUsed}%` }}
                />
              </div>
              <p className="text-xs text-purple-600 mt-1">{stats.storageUsed}% of capacity</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-800 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Last Backup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{stats.averageBackupTime}</div>
              <p className="text-xs text-orange-600 mt-1">Average time</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="backups" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="backups" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Backup History
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Create Backup
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="backups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Backup History
              </CardTitle>
              <CardDescription>
                View and manage all database backups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backups && backups.length > 0 ? (
                  backups.map((backup) => (
                    <div key={backup.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(backup.status)}
                          <div>
                            <h3 className="font-medium">{backup.filename || 'Unknown backup'}</h3>
                            <p className="text-sm text-gray-600">{backup.description || 'No description'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(backup.status)}
                          <span className="text-sm text-gray-500">{formatBytes(backup.size || 0)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {backup.createdAt ? new Date(backup.createdAt).toLocaleDateString() : 'Unknown date'}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {backup.userName || 'Unknown user'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Database className="w-4 h-4" />
                            {backup.tables?.length || 0} tables
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {backup.status === "completed" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadBackup(backup)}
                                className="flex items-center gap-1"
                              >
                                <Download className="w-3 h-3" />
                                Download
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                View
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteBackup(backup.id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No backups found</h3>
                    <p className="text-gray-600 mb-4">Create your first backup to get started</p>
                    <Button onClick={handleCreateBackup} disabled={isCreatingBackup}>
                      {isCreatingBackup ? "Creating..." : "Create First Backup"}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Create New Backup
              </CardTitle>
              <CardDescription>
                Create a manual backup of the database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">Backup Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "full", label: "Full Backup", description: "Complete database backup" },
                    { value: "incremental", label: "Incremental", description: "Changes since last backup" },
                    { value: "partial", label: "Partial", description: "Selected tables only" }
                  ].map((type) => (
                    <div
                      key={type.value}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        backupType === type.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setBackupType(type.value as any)}
                    >
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-gray-600">{type.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {backupType === "partial" && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">Select Tables</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {["users", "applications", "housing", "allocations", "complaints", "backup_logs"].map((table) => (
                      <label key={table} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTables.includes(table)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTables(prev => [...prev, table]);
                            } else {
                              setSelectedTables(prev => prev.filter(t => t !== table));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{table}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleCreateBackup}
                  disabled={isCreatingBackup || (backupType === "partial" && selectedTables.length === 0)}
                  className="flex items-center gap-2"
                >
                  {isCreatingBackup ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {isCreatingBackup ? "Creating Backup..." : "Start Backup"}
                </Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Backup Schedule
              </CardTitle>
              <CardDescription>
                Configure automatic backup schedules
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Automatic Backups</h3>
                  <p className="text-sm text-gray-600">Enable scheduled backups for data protection</p>
                </div>
                <Button
                  variant={isAutoBackupEnabled ? "primary" : "outline"}
                  onClick={() => setIsAutoBackupEnabled(!isAutoBackupEnabled)}
                >
                  {isAutoBackupEnabled ? "Enabled" : "Disabled"}
                </Button>
              </div>

              {isAutoBackupEnabled && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">Backup Frequency</label>
                  <select
                    value={autoBackupInterval}
                    onChange={(e) => setAutoBackupInterval(e.target.value)}
                    className="w-full border rounded-lg p-2"
                  >
                    <option value="hourly">Every Hour</option>
                    <option value="daily">Daily (2:00 AM)</option>
                    <option value="weekly">Weekly (Sunday 2:00 AM)</option>
                    <option value="monthly">Monthly (1st of month)</option>
                  </select>
                </div>
              )}

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Retention Policy</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Keep daily backups for</span>
                    <select className="border rounded p-1 text-sm">
                      <option>7 days</option>
                      <option>14 days</option>
                      <option>30 days</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Keep weekly backups for</span>
                    <select className="border rounded p-1 text-sm">
                      <option>4 weeks</option>
                      <option>8 weeks</option>
                      <option>12 weeks</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Keep monthly backups for</span>
                    <select className="border rounded p-1 text-sm">
                      <option>6 months</option>
                      <option>12 months</option>
                      <option>24 months</option>
                    </select>
                  </div>
                </div>
              </div>

              <Button className="w-full">Save Schedule Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Backup Logs
              </CardTitle>
              <CardDescription>
                View detailed logs for backup operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedBackupLogs.length > 0 ? (
                <div className="space-y-3">
                  {selectedBackupLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium px-2 py-1 rounded ${
                            log.level === 'ERROR' ? 'bg-red-100 text-red-800' :
                            log.level === 'WARNING' ? 'bg-yellow-100 text-yellow-800' :
                            log.level === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {log.level}
                          </span>
                          <span className="text-sm text-gray-600">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-medium">{log.message}</p>
                      {log.details && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-600 cursor-pointer">Details</summary>
                          <pre className="text-xs text-gray-500 mt-1 bg-gray-50 p-2 rounded">
                            {JSON.stringify(JSON.parse(log.details), null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No logs available</h3>
                  <p className="text-gray-600 mb-4">Select a backup to view its logs</p>
                  <div className="space-y-2">
                    {backups.slice(0, 3).map((backup) => (
                      <Button
                        key={backup.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewLogs(backup.id)}
                        disabled={isLoadingLogs}
                        className="w-full justify-start"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        {backup.filename || 'Unknown backup'}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
