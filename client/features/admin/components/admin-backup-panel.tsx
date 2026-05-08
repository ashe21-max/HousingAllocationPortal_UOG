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
  Calendar,
  HardDrive,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Eye,
  Settings,
  BarChart3,
  Activity,
  Zap
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
  createBackupSchedule,
  getBackupSchedules,
  updateBackupSchedule,
  deleteBackupSchedule,
  type BackupRecord,
  type BackupSchedule,
  type CreateBackupRequest,
  type CreateBackupScheduleRequest,
  type UpdateBackupScheduleRequest,
} from "@/lib/api/backup";

interface SystemStats {
  totalBackups: number;
  successfulBackups: number;
  failedBackups: number;
  totalSize: string;
  storageUsed: number;
  storageCapacity: number;
}

export function AdminBackupPanel() {
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backupType, setBackupType] = useState<"full" | "incremental">("full");

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="backups" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="backups" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Backup History
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Create Backup
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
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {backup.status === "completed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadBackup(backup)}
                              className="flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              Download
                            </Button>
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
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "full", label: "Full Backup", description: "Complete database backup" },
                    { value: "incremental", label: "Incremental", description: "Changes since last backup" }
                  ].map((type) => (
                    <div
                      key={type.value}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        backupType === type.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setBackupType(type.value as typeof backupType)}
                    >
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-gray-600">{type.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
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
                  {isCreatingBackup ? "Creating Backup..." : "Start Backup"}
                </Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
