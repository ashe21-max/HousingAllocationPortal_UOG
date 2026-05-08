"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Megaphone, Calendar, Users, GraduationCap, X, Bell } from "lucide-react";
import { getActiveAnnouncements } from "@/lib/api/announcements";

export function LecturerAnnouncementsPanel() {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  
  const announcementsQuery = useQuery({
    queryKey: ["lecturer-announcements"],
    queryFn: getActiveAnnouncements,
  });

  const items = announcementsQuery.data?.items?.filter(
    (a) => !dismissedIds.includes(a.id)
  ) ?? [];

  if (items.length === 0) {
    return null;
  }

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => [...prev, id]);
  };

  return (
    <div className="space-y-3 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-4 h-4 text-amber-600" />
        <span className="text-xs font-semibold uppercase tracking-wide text-amber-700">
          Important Announcements
        </span>
      </div>
      {items.map((announcement) => (
        <div
          key={announcement.id}
          className="relative bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-50 border-l-4 border-amber-500 rounded-lg p-4 shadow-md animate-pulse-once"
        >
          <button
            onClick={() => handleDismiss(announcement.id)}
            className="absolute top-2 right-2 p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-200 rounded-full transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-start gap-3 pr-8">
            <div className="shrink-0 mt-0.5">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <Megaphone className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h4 className="font-bold text-amber-900 text-base">
                  {announcement.title}
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 border border-amber-300 font-medium">
                  {announcement.type === "ALL_USERS" ? (
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      All Users
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      Lecturers Only
                    </span>
                  )}
                </span>
              </div>
              <p className="text-sm text-amber-900 whitespace-pre-wrap leading-relaxed">
                {announcement.content}
              </p>
              {(announcement.startsAt || announcement.endsAt) && (
                <div className="flex items-center gap-1 mt-3 text-xs text-amber-700 font-medium bg-amber-200/50 w-fit px-2 py-1 rounded">
                  <Calendar className="w-3 h-3" />
                  Valid: {announcement.startsAt
                    ? new Date(announcement.startsAt).toLocaleDateString()
                    : "Now"}
                  {announcement.endsAt && (
                    <> - {new Date(announcement.endsAt).toLocaleDateString()}</>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
