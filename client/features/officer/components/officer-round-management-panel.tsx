"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ApiError } from "@/lib/api/client";
import {
  createOfficerRound,
  getOfficerManagedRounds,
  updateOfficerRoundStatus,
} from "@/lib/api/officer";

export function OfficerRoundManagementPanel() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "OPEN" | "CLOSED" | "ARCHIVED">(
    "DRAFT",
  );
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  const roundsQuery = useQuery({
    queryKey: ["officer-managed-rounds"],
    queryFn: getOfficerManagedRounds,
  });

  const createMutation = useMutation({
    mutationFn: createOfficerRound,
    onSuccess: () => {
      toast.success("Application round created.");
      setName("");
      setDescription("");
      setStatus("DRAFT");
      setStartsAt("");
      setEndsAt("");
      queryClient.invalidateQueries({ queryKey: ["officer-managed-rounds"] });
      queryClient.invalidateQueries({ queryKey: ["officer-rounds"] });
      queryClient.invalidateQueries({ queryKey: ["application-form-options"] });
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : "Could not create round.";
      toast.error(message);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ roundId, nextStatus }: { roundId: string; nextStatus: "DRAFT" | "OPEN" | "CLOSED" | "ARCHIVED" }) =>
      updateOfficerRoundStatus(roundId, nextStatus),
    onSuccess: () => {
      toast.success("Round status updated.");
      queryClient.invalidateQueries({ queryKey: ["officer-managed-rounds"] });
      queryClient.invalidateQueries({ queryKey: ["officer-rounds"] });
      queryClient.invalidateQueries({ queryKey: ["application-form-options"] });
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : "Could not update round status.";
      toast.error(message);
    },
  });

  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <h2 className="text-lg font-bold uppercase tracking-tight text-[var(--color-primary)]">
          Create Application Round
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input
            label="Round Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Phase 1 - 2026"
          />
          <Select
            label="Initial Status"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "DRAFT" | "OPEN" | "CLOSED" | "ARCHIVED")
            }
            options={[
              { label: "DRAFT", value: "DRAFT" },
              { label: "OPEN", value: "OPEN" },
              { label: "CLOSED", value: "CLOSED" },
              { label: "ARCHIVED", value: "ARCHIVED" },
            ]}
          />
          <Input
            label="Start Date/Time"
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
          />
          <Input
            label="End Date/Time"
            type="datetime-local"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
          />
          <label className="md:col-span-2 flex w-full flex-col gap-2 text-sm font-medium text-[var(--color-primary)]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
              Description
            </span>
            <textarea
              className="min-h-24 w-full resize-y border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>
        <div className="mt-4">
          <Button
            onClick={() =>
              createMutation.mutate({
                name,
                description: description.trim() || null,
                status,
                startsAt: new Date(startsAt).toISOString(),
                endsAt: new Date(endsAt).toISOString(),
              })
            }
            busy={createMutation.isPending}
            disabled={!name.trim() || !startsAt || !endsAt}
          >
            Create Round
          </Button>
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="p-6 border-b border-[var(--border)]">
          <h3 className="text-base font-bold uppercase tracking-tight text-[var(--color-primary)]">
            Existing Rounds
          </h3>
        </div>
        {roundsQuery.isLoading ? (
          <div className="p-8 text-sm text-muted">Loading rounds...</div>
        ) : roundsQuery.isError ? (
          <div className="p-8 text-sm text-[var(--color-danger)]">Could not load rounds.</div>
        ) : !roundsQuery.data || roundsQuery.data.length === 0 ? (
          <div className="p-8 text-sm text-muted">No rounds yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--surface-muted)] border-b border-[var(--border)]">
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                    Name
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                    Status
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                    Ranking
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                    Window
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {roundsQuery.data.map((round) => (
                  <tr key={round.id}>
                    <td className="px-4 py-4 text-sm text-[var(--color-primary)]">
                      {round.name}
                    </td>
                    <td className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                      {round.status}
                    </td>
                    <td className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                      {round.committeeRankingStatus}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted">
                      {new Date(round.startsAt).toLocaleString()} -{" "}
                      {new Date(round.endsAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Select
                        label=""
                        className="inline-flex w-36"
                        value={round.status}
                        onChange={(e) =>
                          statusMutation.mutate({
                            roundId: round.id,
                            nextStatus: e.target.value as
                              | "DRAFT"
                              | "OPEN"
                              | "CLOSED"
                              | "ARCHIVED",
                          })
                        }
                        options={[
                          { label: "DRAFT", value: "DRAFT" },
                          { label: "OPEN", value: "OPEN" },
                          { label: "CLOSED", value: "CLOSED" },
                          { label: "ARCHIVED", value: "ARCHIVED" },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
