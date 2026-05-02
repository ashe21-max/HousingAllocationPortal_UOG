"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/client";
import {
  approveSignupRequest,
  getPendingSignupRequests,
  rejectSignupRequest,
  type AdminUser,
} from "@/lib/api/auth";

export function PendingSignupRequestsPanel() {
  const queryClient = useQueryClient();

  const pendingQuery = useQuery({
    queryKey: ["pending-signup-requests"],
    queryFn: getPendingSignupRequests,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => approveSignupRequest(id),
    onSuccess: () => {
      toast.success("Signup request approved. User can now log in.");
      queryClient.invalidateQueries({ queryKey: ["pending-signup-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Could not approve request.";
      toast.error(message);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => rejectSignupRequest(id),
    onSuccess: () => {
      toast.success("Signup request rejected.");
      queryClient.invalidateQueries({ queryKey: ["pending-signup-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Could not reject request.";
      toast.error(message);
    },
  });

  if (pendingQuery.isLoading) {
    return (
      <div className="panel p-8">
        <p className="text-sm text-muted">Loading pending requests...</p>
      </div>
    );
  }

  if (pendingQuery.isError) {
    return (
      <div className="panel p-8">
        <p className="text-sm text-[var(--color-danger)]">Could not load pending requests.</p>
      </div>
    );
  }

  const pendingRequests = pendingQuery.data?.items ?? [];

  if (pendingRequests.length === 0) {
    return null;
  }

  return (
    <div className="panel overflow-hidden">
      <div className="p-6 border-b border-[var(--border)]">
        <h2 className="text-lg font-bold uppercase tracking-tight text-[var(--color-primary)]">
          Pending Signup Requests ({pendingRequests.length})
        </h2>
        <p className="mt-2 text-sm text-muted">
          Review and approve or reject user signup requests
        </p>
      </div>

      <div className="divide-y divide-[var(--border)]">
        {pendingRequests.map((user) => (
          <div key={user.id} className="p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="h-10 w-10 rounded-full bg-[var(--color-blue)]/10 flex items-center justify-center">
                <UserRound className="h-5 w-5 text-[var(--color-blue)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--color-primary)]">{user.name}</p>
                <p className="text-xs text-muted">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-blue)]">
                    {user.role}
                  </span>
                  {user.department && (
                    <>
                      <span className="text-muted">•</span>
                      <span className="text-xs text-muted">{user.department}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="primary"
                busy={approveMutation.isPending && approveMutation.variables === user.id}
                onClick={() => approveMutation.mutate(user.id)}
                className="gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="danger"
                busy={rejectMutation.isPending && rejectMutation.variables === user.id}
                onClick={() => rejectMutation.mutate(user.id)}
                className="gap-2"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
