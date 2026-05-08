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
      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xl transition hover:-translate-y-1 hover:border-[var(--color-blue)]/30 space-y-6">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-tight text-[var(--foreground)]">
            File Complaint
          </h2>
          <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
            Choose the target college committee and start a thread.
          </p>
        </div>
        <Select
          label="Target College"
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
        <label className="flex w-full flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-secondary)]">
            Message
          </span>
          <textarea
            className="min-h-32 w-full resize-y border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--color-blue)] focus:ring-2 focus:ring-[var(--color-blue)]/20 rounded-lg transition-all"
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
          className="bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-green)] to-[var(--color-yellow)] text-white shadow-lg shadow-[rgba(var(--color-blue-rgb),0.25)] hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          Create Complaint
        </Button>

        <div className="border-t border-[var(--border)] pt-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-[var(--foreground)]">
            My Threads
          </h3>
          {threadsQuery.isLoading ? (
            <p className="mt-2 text-sm text-[var(--foreground-secondary)]">Loading...</p>
          ) : !threadsQuery.data || threadsQuery.data.length === 0 ? (
            <p className="mt-2 text-sm text-[var(--foreground-secondary)]">No complaint threads yet.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {threadsQuery.data.map((thread) => (
                <button
                  key={thread.id}
                  className={`w-full rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                    selectedThreadId === thread.id
                      ? "border-[var(--color-blue)] bg-[var(--background)] shadow-md"
                      : "border-[var(--border)] bg-[var(--surface)]"
                  }`}
                  onClick={() => setSelectedThreadId(thread.id)}
                >
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {thread.subject}
                  </p>
                  <p className="text-xs text-[var(--foreground-secondary)]">
                    {thread.targetDepartment} | {thread.status}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xl transition hover:-translate-y-1 hover:border-[var(--color-green)]/30">
        {!selectedThreadId ? (
          <p className="text-sm text-[var(--foreground-secondary)]">Select a thread to chat with committee.</p>
        ) : threadDetailsQuery.isLoading ? (
          <p className="text-sm text-[var(--foreground-secondary)]">Loading thread...</p>
        ) : threadDetailsQuery.isError || !threadDetailsQuery.data ? (
          <p className="text-sm text-[var(--color-danger)]">Could not load thread.</p>
        ) : (
          <div className="space-y-4">
            <div className="border-b border-[var(--border)] pb-3">
              <h3 className="text-base font-bold text-[var(--foreground)]">
                {threadDetailsQuery.data.thread.subject}
              </h3>
              <p className="text-xs text-[var(--foreground-secondary)]">
                {threadDetailsQuery.data.thread.targetDepartment} |{" "}
                {threadDetailsQuery.data.thread.status}
              </p>
            </div>
            <div className="max-h-[360px] space-y-2 overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
              {threadDetailsQuery.data.messages.map((msg) => (
                <div key={msg.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 hover:shadow-sm transition">
                  <p className="text-xs font-semibold text-[var(--foreground)]">
                    {msg.senderName ?? msg.senderRole ?? msg.senderUserId}
                  </p>
                  <p className="text-sm text-[var(--foreground)]">{msg.message}</p>
                  <p className="text-[10px] text-[var(--foreground-secondary)]">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <label className="flex w-full flex-col gap-2 text-sm font-medium text-[var(--foreground)]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-secondary)]">
                Reply
              </span>
              <textarea
                className="min-h-24 w-full resize-y border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--color-green)] focus:ring-2 focus:ring-[var(--color-green)]/20 rounded-lg transition-all"
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
              className="bg-gradient-to-r from-[var(--color-green)] via-[var(--color-blue)] to-[var(--color-yellow)] text-white shadow-lg shadow-[rgba(var(--color-green-rgb),0.25)] hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Send Message
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
