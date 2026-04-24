"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/client";
import {
  getCommitteeComplaintThread,
  getCommitteeComplaintThreads,
  sendCommitteeComplaintMessage,
} from "@/lib/api/complaints";

export function CommitteeComplaintsPanel() {
  const queryClient = useQueryClient();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  const threadsQuery = useQuery({
    queryKey: ["committee-complaint-threads"],
    queryFn: getCommitteeComplaintThreads,
  });

  const threadDetailsQuery = useQuery({
    queryKey: ["committee-complaint-thread", selectedThreadId],
    queryFn: () => getCommitteeComplaintThread(selectedThreadId!),
    enabled: !!selectedThreadId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({ threadId, message }: { threadId: string; message: string }) =>
      sendCommitteeComplaintMessage(threadId, message),
    onSuccess: () => {
      setReplyMessage("");
      queryClient.invalidateQueries({
        queryKey: ["committee-complaint-thread", selectedThreadId],
      });
      queryClient.invalidateQueries({ queryKey: ["committee-complaint-threads"] });
    },
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Could not send reply.";
      toast.error(message);
    },
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="panel p-6">
        <h3 className="text-base font-bold uppercase tracking-tight text-[var(--color-primary)]">
          Department Complaints
        </h3>
        {threadsQuery.isLoading ? (
          <p className="mt-3 text-sm text-muted">Loading...</p>
        ) : !threadsQuery.data || threadsQuery.data.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            No complaints assigned to your department.
          </p>
        ) : (
          <div className="mt-4 space-y-2">
            {threadsQuery.data.map((thread) => (
              <button
                key={thread.id}
                className={`w-full border p-3 text-left ${
                  selectedThreadId === thread.id
                    ? "border-[var(--color-accent)] bg-[var(--surface-muted)]"
                    : "border-[var(--border)]"
                }`}
                onClick={() => setSelectedThreadId(thread.id)}
              >
                <p className="text-sm font-semibold text-[var(--color-primary)]">
                  {thread.subject}
                </p>
                <p className="text-xs text-muted">
                  {thread.lecturerName ?? thread.lecturerUserId} | {thread.status}
                </p>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="panel p-6">
        {!selectedThreadId ? (
          <p className="text-sm text-muted">Select a complaint to respond.</p>
        ) : threadDetailsQuery.isLoading ? (
          <p className="text-sm text-muted">Loading thread...</p>
        ) : threadDetailsQuery.isError || !threadDetailsQuery.data ? (
          <p className="text-sm text-[var(--color-danger)]">Could not load thread.</p>
        ) : (
          <div className="space-y-4">
            <div className="border-b border-[var(--border)] pb-3">
              <h3 className="text-base font-bold text-[var(--color-primary)]">
                {threadDetailsQuery.data.thread.subject}
              </h3>
              <p className="text-xs text-muted">
                {threadDetailsQuery.data.thread.targetDepartment} |{" "}
                {threadDetailsQuery.data.thread.status}
              </p>
            </div>
            <div className="max-h-[360px] space-y-2 overflow-y-auto border border-[var(--border)] p-3">
              {threadDetailsQuery.data.messages.map((msg) => (
                <div key={msg.id} className="border border-[var(--border)] p-2">
                  <p className="text-xs font-semibold text-[var(--color-primary)]">
                    {msg.senderName ?? msg.senderRole ?? msg.senderUserId}
                  </p>
                  <p className="text-sm text-[var(--color-primary)]">{msg.message}</p>
                  <p className="text-[10px] text-muted">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <label className="flex w-full flex-col gap-2 text-sm font-medium text-[var(--color-primary)]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                Reply
              </span>
              <textarea
                className="min-h-24 w-full resize-y border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                value={replyMessage}
                onChange={(event) => setReplyMessage(event.target.value)}
              />
            </label>
            <Button
              onClick={() =>
                sendMessageMutation.mutate({
                  threadId: selectedThreadId,
                  message: replyMessage,
                })
              }
              busy={sendMessageMutation.isPending}
              disabled={!replyMessage.trim()}
            >
              Send Reply
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
