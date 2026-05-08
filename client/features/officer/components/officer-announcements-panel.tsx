"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Megaphone, Trash2, Pencil, Plus, X, Calendar, Users, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ApiError } from "@/lib/api/client";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  type Announcement,
} from "@/lib/api/announcements";

export function OfficerAnnouncementsPanel() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("ALL_USERS");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  const announcementsQuery = useQuery({
    queryKey: ["officer-announcements"],
    queryFn: () => getAnnouncements(),
  });

  const createMutation = useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      toast.success("Announcement created successfully");
      queryClient.invalidateQueries({ queryKey: ["officer-announcements"] });
      resetForm();
      setIsCreating(false);
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : "Failed to create announcement";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateAnnouncement>[1] }) =>
      updateAnnouncement(id, payload),
    onSuccess: () => {
      toast.success("Announcement updated successfully");
      queryClient.invalidateQueries({ queryKey: ["officer-announcements"] });
      resetForm();
      setEditingId(null);
      setIsCreating(false);
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : "Failed to update announcement";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      toast.success("Announcement deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["officer-announcements"] });
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : "Failed to delete announcement";
      toast.error(message);
    },
  });

  function resetForm() {
    setTitle("");
    setContent("");
    setType("ALL_USERS");
    setStartsAt("");
    setEndsAt("");
  }

  function startEdit(announcement: Announcement) {
    setEditingId(announcement.id);
    setTitle(announcement.title);
    setContent(announcement.content);
    setType(announcement.type);
    setStartsAt(announcement.startsAt ? announcement.startsAt.split("T")[0] : "");
    setEndsAt(announcement.endsAt ? announcement.endsAt.split("T")[0] : "");
    setIsCreating(true);
  }

  function handleSubmit() {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    const payload = {
      title: title.trim(),
      content: content.trim(),
      type,
      targetRoles: type === "ALL_USERS" ? undefined : ["LECTURER"],
      startsAt: startsAt || undefined,
      endsAt: endsAt || undefined,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  function handleCancel() {
    resetForm();
    setIsCreating(false);
    setEditingId(null);
  }

  const isBusy = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--color-primary)]">Manage Announcements</h2>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Announcement
          </Button>
        )}
      </div>

      {isCreating && (
        <div className="bg-white border border-[var(--border)] rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[var(--color-primary)]">
              {editingId ? "Edit Announcement" : "New Announcement"}
            </h3>
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Announcement title"
          />

          <div className="grid gap-2">
            <label className="text-sm font-medium text-[var(--color-primary)]">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Full announcement text..."
              rows={4}
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)]/30 focus:border-[var(--color-blue)] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Target Audience"
              options={[
                { label: "All Users", value: "ALL_USERS" },
                { label: "Lecturers Only", value: "LECTURERS" },
              ]}
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
            <Input
              label="Start Date"
              type="date"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleSubmit} busy={isBusy}>
              {editingId ? "Save Changes" : "Publish Announcement"}
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {announcementsQuery.data?.items && announcementsQuery.data.items.length > 0 ? (
          announcementsQuery.data.items.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white border border-[var(--border)] rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Megaphone className="w-4 h-4 text-[var(--color-blue)] shrink-0" />
                    <h4 className="font-semibold text-[var(--color-primary)] truncate">
                      {announcement.title}
                    </h4>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        announcement.isActive
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      }`}
                    >
                      {announcement.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-muted whitespace-pre-wrap mb-3">
                    {announcement.content}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      {announcement.type === "ALL_USERS" ? (
                        <Users className="w-3 h-3" />
                      ) : (
                        <GraduationCap className="w-3 h-3" />
                      )}
                      {announcement.type === "ALL_USERS" ? "All Users" : "Lecturers"}
                    </span>
                    {(announcement.startsAt || announcement.endsAt) && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {announcement.startsAt
                          ? new Date(announcement.startsAt).toLocaleDateString()
                          : "No start"}
                        {announcement.endsAt && (
                          <> - {new Date(announcement.endsAt).toLocaleDateString()}</>
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(announcement)}
                    className="flex items-center gap-1"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteMutation.mutate(announcement.id)}
                    disabled={deleteMutation.isPending}
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
          <div className="text-center py-12 bg-white border border-[var(--border)] rounded-xl">
            <Megaphone className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">No announcements yet</h3>
            <p className="text-xs text-gray-500">Create your first announcement to notify users</p>
          </div>
        )}
      </div>
    </div>
  );
}
