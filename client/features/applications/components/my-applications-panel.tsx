"use client";

import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle, Clock, FileText, Send, Calendar, AlertCircle, Eye, User, GraduationCap, Edit, Award, Download, FolderOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/client";
import { ApplicationFormData } from './housing-application-form';
import { ScoreBreakdown } from '@/lib/housing-scoring';
import {
  getMyDocuments,
  openMyDocument,
  downloadMyDocument,
  type LecturerDocumentRow,
} from "@/lib/api/documents";

interface ParsedApplicationData extends ApplicationFormData {
  score?: ScoreBreakdown;
  submittedAt?: string;
}
import {
  getMyApplications,
  submitApplication,
  type MyApplicationRow,
} from "@/lib/api/applications";

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function housingLabel(application: MyApplicationRow) {
  if (!application.preferredHousingBuildingName) {
    return "General request";
  }

  return `${application.preferredHousingBuildingName} / Block ${application.preferredHousingBlockNumber ?? "-"} / Room ${application.preferredHousingRoomNumber ?? "-"}`;
}

function getStatusColor(status: string) {
  switch (status) {
    case "DRAFT":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "SUBMITTED":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "UNDER_REVIEW":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "RANKED":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "ALLOCATED":
      return "bg-green-100 text-green-700 border-green-200";
    case "REJECTED":
      return "bg-red-100 text-red-700 border-red-200";
    case "WITHDRAWN":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "DRAFT":
      return <FileText className="w-4 h-4" />;
    case "SUBMITTED":
      return <Send className="w-4 h-4" />;
    case "UNDER_REVIEW":
      return <Clock className="w-4 h-4" />;
    case "RANKED":
      return <Award className="w-4 h-4" />;
    case "ALLOCATED":
      return <CheckCircle className="w-4 h-4" />;
    case "REJECTED":
      return <AlertCircle className="w-4 h-4" />;
    case "WITHDRAWN":
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
}

// Component to display detailed application form data from database
function ApplicationDetails({ application }: { application: MyApplicationRow }) {
  const [showDetails, setShowDetails] = React.useState(false);
  const [formData, setFormData] = React.useState<ParsedApplicationData | null>(null);

  React.useEffect(() => {
    console.log('ApplicationDetails - application.notes:', application.notes);
    console.log('ApplicationDetails - application.status:', application.status);
    if (application.notes) {
      try {
        const parsedData = JSON.parse(application.notes);
        console.log('ApplicationDetails - parsedData:', parsedData);
        setFormData(parsedData);
      } catch (e) {
        console.error("Could not parse application notes:", e);
        console.error("Notes content:", application.notes);
      }
    } else {
      console.log('ApplicationDetails - notes is null or empty');
    }
  }, [application.notes]);

  const documentsQuery = useQuery({
    queryKey: ["my-application-documents", application.id],
    queryFn: getMyDocuments,
    enabled: showDetails,
  });

  const applicationDocuments = React.useMemo(() => {
    if (!documentsQuery.data) return [];
    return documentsQuery.data.filter((doc: LecturerDocumentRow) => doc.applicationId === application.id);
  }, [documentsQuery.data, application.id]);

  const openMutation = useMutation({
    mutationFn: (documentId: string) => openMyDocument(documentId),
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : "Could not open document.";
      toast.error(message);
    },
  });

  const downloadMutation = useMutation({
    mutationFn: ({ documentId, fileName }: { documentId: string; fileName: string }) =>
      downloadMyDocument(documentId, fileName),
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : "Could not download document.";
      toast.error(message);
    },
  });

  return (
    <div className="mt-4 w-full">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mb-4 w-full sm:w-auto px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Eye className="w-5 h-5" />
        <span>{showDetails ? "Hide" : "Show"} Complete Form Data</span>
      </button>

      {showDetails && (
        <>
          {!formData ? (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden w-full">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 w-full">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  Complete Application Form Data
                </h4>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600">No detailed form data available</p>
                <p className="text-xs text-gray-400 mt-2">Status: {application.status}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden w-full">
              {/* HEADER */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 w-full">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  Complete Application Form Data
                </h4>
              </div>

              {/* BODY - FULL FRAME TABLES */}
              <div className="p-2 space-y-3 w-full">

                {/* PERSONAL INFORMATION */}
            <div className="w-full">
              <h5 className="text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                Personal Information
              </h5>

              <div className="bg-gray-50 rounded-lg overflow-hidden w-full">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 w-1/3">Information Type</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 w-1/3">Information</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 w-1/3">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-700">Full Name</td>
                      <td className="px-4 py-3 text-gray-900">{formData.fullName || "-"}</td>
                      <td className="px-4 py-3 text-gray-600">-</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-700">Staff ID</td>
                      <td className="px-4 py-3 text-gray-900">{formData.staffId || "-"}</td>
                      <td className="px-4 py-3 text-gray-600">-</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-700">Email</td>
                      <td className="px-4 py-3 text-gray-900">{formData.email || "-"}</td>
                      <td className="px-4 py-3 text-gray-600">-</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-700">Phone Number</td>
                      <td className="px-4 py-3 text-gray-900">{formData.phoneNumber || "-"}</td>
                      <td className="px-4 py-3 text-gray-600">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ACADEMIC INFORMATION */}
            <div className="w-full">
              <h5 className="text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-gray-600" />
                Academic Information
              </h5>

              <div className="bg-gray-50 rounded-lg overflow-hidden w-full">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 w-1/3">Information Type</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 w-1/3">Information</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 w-1/3">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-700">College</td>
                      <td className="px-4 py-3 text-gray-900">{formData.college || "-"}</td>
                      <td className="px-4 py-3 text-gray-600">-</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-700">College / Unit</td>
                      <td className="px-4 py-3 text-gray-900">{formData.department || "-"}</td>
                      <td className="px-4 py-3 text-gray-600">-</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-700">Educational Title</td>
                      <td className="px-4 py-3 text-gray-900">{formData.educationalTitle || "-"}</td>
                      <td className="px-4 py-3 text-green-600 font-semibold">{formData.score?.educationalTitle || 0}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-700">Educational Level</td>
                      <td className="px-4 py-3 text-gray-900">{formData.educationalLevel || "-"}</td>
                      <td className="px-4 py-3 text-green-600 font-semibold">{formData.score?.educationalLevel || 0}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-700">Start Date at UOG</td>
                      <td className="px-4 py-3 text-gray-900">{formData.startDateAtUog || "-"}</td>
                      <td className="px-4 py-3 text-green-600 font-semibold">{formData.score?.serviceYears || 0}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-700">Responsibility</td>
                      <td className="px-4 py-3 text-gray-900">{formData.responsibility || "-"}</td>
                      <td className="px-4 py-3 text-green-600 font-semibold">{formData.score?.responsibility || 0}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-700">Family Status</td>
                      <td className="px-4 py-3 text-gray-900">{formData.familyStatus || "-"}</td>
                      <td className="px-4 py-3 text-green-600 font-semibold">{formData.score?.familyStatus || 0}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ADDITIONAL INFORMATION */}
            <div className="w-full">
              <h5 className="text-md font-semibold text-gray-800 mb-2">Additional Information</h5>

              <div className="bg-gray-50 rounded-lg overflow-hidden w-full">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 w-1/3">Information Type</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 w-1/3">Information</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 w-1/3">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-700">Spouse Name</td>
                      <td className="px-4 py-3 text-gray-900">{formData.spouseName || "-"}</td>
                      <td className="px-4 py-3 text-gray-600">-</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-700">Spouse Staff ID</td>
                      <td className="px-4 py-3 text-gray-900">{formData.spouseStaffId || "-"}</td>
                      <td className="px-4 py-3 text-gray-600">-</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-700">Number of Dependents</td>
                      <td className="px-4 py-3 text-gray-900">{formData.numberOfDependents || "-"}</td>
                      <td className="px-4 py-3 text-gray-600">-</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-700">Female</td>
                      <td className="px-4 py-3 text-gray-900">{formData.isFemale ? "Yes" : "No"}</td>
                      <td className="px-4 py-3 text-green-600 font-semibold">{formData.score?.femaleBonus || 0}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-700">Disabled</td>
                      <td className="px-4 py-3 text-gray-900">{formData.isDisabled ? "Yes" : "No"}</td>
                      <td className="px-4 py-3 text-green-600 font-semibold">{formData.score?.disabilityBonus || 0}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-700">Has Chronic Illness</td>
                      <td className="px-4 py-3 text-gray-900">{formData.hasChronicIllness ? "Yes" : "No"}</td>
                      <td className="px-4 py-3 text-green-600 font-semibold">{formData.score?.chronicIllnessBonus || 0}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-gray-700">Spouse at UOG</td>
                      <td className="px-4 py-3 text-gray-900">{formData.hasSpouseAtUog ? "Yes" : "No"}</td>
                      <td className="px-4 py-3 text-green-600 font-semibold">{formData.score?.spouseBonus || 0}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SCORE INFORMATION */}
            {formData.score && (
              <div className="w-full">
                <h5 className="text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-gray-600" />
                  Score Breakdown
                </h5>

                <div className="bg-blue-50 rounded-lg overflow-hidden w-full border border-blue-200">
                  <table className="w-full">
                    <thead className="bg-blue-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-blue-700 w-1/2">Score Type</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-blue-700 w-1/2">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-200">
                      <tr>
                        <td className="px-4 py-3 font-medium text-blue-900">Base Score</td>
                        <td className="px-4 py-3 text-xl font-bold text-blue-900">{formData.score.baseTotal || 0}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-blue-900">Bonus Score</td>
                        <td className="px-4 py-3 text-xl font-bold text-green-600">
                          +{((formData.score.femaleBonus || 0) + 
                            (formData.score.disabilityBonus || 0) + 
                            (formData.score.chronicIllnessBonus || 0) + 
                            (formData.score.spouseBonus || 0)).toFixed(2)}
                        </td>
                      </tr>
                      <tr className="bg-blue-100">
                        <td className="px-4 py-3 font-bold text-blue-900">Final Score</td>
                        <td className="px-4 py-3 text-2xl font-bold text-blue-900">{formData.score.final || 0}/100</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* DOCUMENTS */}
            <div className="w-full">
              <h5 className="text-md font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-600" />
                Uploaded Documents
              </h5>

              {documentsQuery.isLoading ? (
                <p className="text-sm text-gray-600">Loading documents...</p>
              ) : applicationDocuments.length === 0 ? (
                <p className="text-sm text-gray-600">No documents uploaded for this application.</p>
              ) : (
                <div className="bg-gray-50 rounded-lg overflow-hidden w-full border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 w-1/3">File Name</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 w-1/3">Purpose</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 w-1/3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {applicationDocuments.map((doc: LecturerDocumentRow) => (
                        <tr key={doc.id}>
                          <td className="px-4 py-3 font-medium text-gray-700">{doc.originalFileName}</td>
                          <td className="px-4 py-3 text-gray-900">{doc.purpose}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => openMutation.mutate(doc.id)}
                                busy={openMutation.isPending && openMutation.variables === doc.id}
                              >
                                <FolderOpen className="w-4 h-4 mr-1" />
                                Open
                              </Button>
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => downloadMutation.mutate({ documentId: doc.id, fileName: doc.originalFileName })}
                                busy={downloadMutation.isPending && downloadMutation.variables?.documentId === doc.id}
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>
          )}
        </>
      )}
    </div>
  );
}

export function MyApplicationsPanel() {
  const queryClient = useQueryClient();
  
  const {
    data: applications,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["my-applications"],
    queryFn: async () => {
      console.log('Fetching applications...');
      try {
        const result = await getMyApplications();
        console.log('Applications fetched successfully:', result);
        console.log('Number of applications:', Array.isArray(result) ? result.length : 'Not an array');
        return result;
      } catch (err) {
        console.error('Error in queryFn:', err);
        throw err;
      }
    },
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error instanceof ApiError && error.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Auto-refresh on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  const submitMutation = useMutation({
    mutationFn: submitApplication,
    onSuccess: () => {
      toast.success("Application submitted.");
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
    },
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Failed to submit application.";
      toast.error(message);
    },
  });

  const firstApplication = applications?.[0];
  const isRoundOpen = firstApplication?.roundStatus === "OPEN";

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Unified Header */}
      <div className="p-8 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-[var(--color-primary)]" />
              My Applications
            </h2>
            <p className="mt-2 text-gray-600">
              Track your housing applications, review scores, and manage submissions
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gray-50 rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">Total Applications</p>
              <p className="text-2xl font-bold text-[var(--color-primary)]">{applications?.length || 0}</p>
            </div>
            {firstApplication && (
              <Button 
                onClick={() => window.location.href = '/dashboard/lecturer/application'}
                variant="outline"
                className="flex items-center gap-2"
                disabled={!isRoundOpen}
                title={!isRoundOpen ? "Application can only be edited when the round is open" : "Edit your application"}
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Unified Content Area */}
      <div className="p-8">
        {/* Loading/Error/Empty States */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your applications...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <p className="mt-4 text-red-700">
              {error instanceof ApiError && error.status === 401 
                ? "Please log in to view your applications." 
                : "Could not load applications. Please try again."
              }
            </p>
            {error instanceof ApiError && error.status === 401 && (
              <Button 
                className="mt-4" 
                onClick={() => window.location.href = '/auth/login'}
              >
                Go to Login
              </Button>
            )}
          </div>
        ) : !applications || applications.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="mt-4 text-gray-600">No applications yet.</p>
            <p className="text-sm text-gray-500 mt-2">Start by filling out a new housing application.</p>
          </div>
        ) : (
          /* Applications List - Full Frame */
          <div className="space-y-6">
          {applications.map((application) => (
            <div key={application.id} className="border-b border-gray-200 last:border-b-0">
              {/* Application Header - Integrated into main frame */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg">
                    <h3 className="font-semibold">
                      {application.roundName || "Application Round"}
                    </h3>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    {application.status}
                  </div>
                </div>
              </div>

              {/* Application Content - Full width */}
              <div className="pb-6 space-y-4">
                {/* Date Information */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Updated</p>
                    <p className="text-sm text-gray-600">{formatDate(application.updatedAt)}</p>
                    {application.submittedAt && (
                      <p className="text-xs text-gray-500 mt-1">Submitted: {formatDate(application.submittedAt)}</p>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4 border-t border-gray-100">
                  {application.status === "DRAFT" ? (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => submitMutation.mutate(application.id)}
                      disabled={submitMutation.isPending && submitMutation.variables === application.id}
                    >
                      {submitMutation.isPending && submitMutation.variables === application.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Application Submitted</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Full Application Form Data */}
                <ApplicationDetails application={application} />
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}
