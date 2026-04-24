"use client";

import { Bell, Search } from "lucide-react";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardSidebar } from "./dashboard-sidebar";
import { ProfileComponent } from "./profile-component";

type DashboardShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function DashboardShell({
  title,
  description,
  children,
}: DashboardShellProps) {
  return (
    <div className="flex h-screen w-full bg-[var(--background)] text-[var(--foreground)]">
      {/* Sidebar Component */}
      <DashboardSidebar />

      {/* Top Right Profile */}
      <ProfileComponent />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-[var(--border)] sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
             <div className="relative w-full max-w-md lg:hidden">
                <BrandLockup logoSize={32} subtitle="" />
             </div>
             <div className="hidden lg:flex relative w-full max-w-md">
                <Search className="absolute left-3 bottom-3 h-4 w-4 text-muted z-10" />
                <Input 
                  label=""
                  placeholder="Search workspace..." 
                  className="pl-10 h-11 bg-[var(--surface-muted)] border-none rounded-none focus-visible:ring-1 focus-visible:ring-[var(--border)]"
                />
             </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Notification bell removed */}
          </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto space-y-10">
            {/* Page Header */}
            <div className="border-b border-[var(--border)] pb-8">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.24em] text-muted mb-4">
                <span>Workspace</span>
                <span className="text-[var(--border)]">/</span>
                <span className="text-[var(--color-primary)] font-bold">{title}</span>
              </div>
              <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold text-[var(--color-primary)] tracking-tight uppercase">
                {title}
              </h1>
              <p className="text-muted mt-3 max-w-3xl leading-relaxed">
                {description}
              </p>
            </div>

            {/* Content Slot */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
