"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { departmentOptions } from "@/constants/user";
import { ApiError } from "@/lib/api/client";
import {
  createComplaintThread,
  getMyComplaintThread,
  getMyComplaintThreads,
  sendMyComplaintMessage,
} from "@/lib/api/complaints";

export function LecturerComplaintsPanel() {
  const queryClient = useQueryClient();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [targetDepartment, setTargetDepartment] = useState("");
  const [subject, setSubject] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState("");

  const threadsQuery = useQuery({
    queryKey: ["lecturer-complaint-threads"],
    queryFn: getMyComplaintThreads,
  });

  const threadDetailsQuery = useQuery({
    queryKey: ["lecturer-complaint-thread", selectedThreadId],
    queryFn: () => getMyComplaintThread(selectedThreadId!),
    enabled: !!selectedThreadId,
  });

  const createThreadMutation = useMutation({
    mutationFn: createComplaintThread,
    onSuccess: (created) => {
      toast.success("Complaint thread created.");
      setTargetDepartment("");
      setSubject("");
      setInitialMessage("");
      setSelectedThreadId(created.id);
      queryClient.invalidateQueries({ queryKey: ["lecturer-complaint-threads"] });
    },
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Could not create complaint.";
      toast.error(message);
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({ threadId, message }: { threadId: string; message: string }) =>
      sendMyComplaintMessage(threadId, message),
    onSuccess: () => {
      setReplyMessage("");
      queryClient.invalidateQueries({
        queryKey: ["lecturer-complaint-thread", selectedThreadId],
      });
      queryClient.invalidateQueries({ queryKey: ["lecturer-complaint-threads"] });
    },
    onError: (error) => {
      const message =
        error instanceof ApiError ? error.message : "Could not send message.";
      toast.error(message);
    },
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="panel p-6 space-y-6">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-tight text-[var(--color-primary)]">
            File Complaint
          </h2>
          <p className="mt-2 text-sm text-muted">
            Choose the target college/department committee and start a thread.
          </p>
        </div>
        <Select
          label="Target College/Department"
          options={departmentOptions}
          value={targetDepartment}
          onChange={(event) => setTargetDepartment(event.target.value)}
        />
        <Input
          label="Subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="Short complaint title"
        />
        <label className="flex w-full flex-col gap-2 text-sm font-medium text-[var(--color-primary)]">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
            Message
          </span>
          <textarea
            className="min-h-32 w-full resize-y border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
            value={initialMessage}
            onChange={(event) => setInitialMessage(event.target.value)}
          />
        </label>
        <Button
          onClick={() =>
            createThreadMutation.mutate({
              targetDepartment,
              subject,
              message: initialMessage,
            })
          }
          busy={createThreadMutation.isPending}
          disabled={!targetDepartment || !subject.trim() || !initialMessage.trim()}
        >
          Create Complaint
        </Button>

        <div className="border-t border-[var(--border)] pt-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--color-primary)]">
            My Threads
          </h3>
          {threadsQuery.isLoading ? (
            <p className="mt-2 text-sm text-muted">Loading...</p>
          ) : !threadsQuery.data || threadsQuery.data.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No complaint threads yet.</p>
          ) : (
            <div className="mt-3 space-y-2">
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
                    {thread.targetDepartment} | {thread.status}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="panel p-6">
        {!selectedThreadId ? (
          <p className="text-sm text-muted">Select a thread to chat with committee.</p>
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
              Send Message
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
