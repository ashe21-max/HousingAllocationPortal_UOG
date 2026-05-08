"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { 
  LayoutDashboard, 
  LogOut,
  Users, 
  UserPlus,
  CalendarRange,
  FileText,
  Home,
  Settings,
  Building2,
  ClipboardList,
  ClipboardCheck,
  HelpCircle,
  MessageSquareWarning,
  Scale,
  Bell,
  Search,
  User,
  ChevronDown,
  Activity,
  X,
  Database,
  Shield,
  Download,
  History,
  Megaphone
} from "lucide-react";
import { toast } from "sonner";

import { BrandLockup } from "@/components/brand/brand-lockup";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { logout } from "@/lib/api/auth";
import { getDashboardPath } from "@/lib/auth/redirect-by-role";

type DashboardSidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export function DashboardSidebar({ isOpen = true, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, clearSession } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");


  const navigation = [
    {
      name: "Overview",
      href: session ? getDashboardPath(session.role) : "/auth/login",
      icon: LayoutDashboard,
    },
    ...(session?.role === "ADMIN" 
      ? [
          { name: "Create User", href: "/dashboard/admin/create-user", icon: UserPlus },
          { name: "Manage Users", href: "/dashboard/admin/manage-users", icon: Users },
          { name: "Backup", href: "/dashboard/admin/backup", icon: Database },
          { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
          { name: "Support", href: "/dashboard/admin/support", icon: HelpCircle },
        ] 
      : []),
    ...(session?.role === "LECTURER" 
      ? [
          { name: "New Application", href: "/dashboard/lecturer/application", icon: FileText },
          { name: "My Applications", href: "/dashboard/lecturer/my-applications", icon: FileText },
          { name: "View Results", href: "/dashboard/lecturer/results", icon: FileText },
          { name: "File Complaint", href: "/dashboard/lecturer/complaints", icon: FileText },
          { name: "Settings", href: "/dashboard/lecturer/settings", icon: Settings },
          { name: "Support", href: "/dashboard/lecturer/support", icon: HelpCircle },
        ] 
      : []),
    ...(session?.role === "OFFICER"
      ? [
          { name: "Manage Rounds", href: "/dashboard/officer/rounds", icon: CalendarRange },
          { name: "Run Allocation", href: "/dashboard/officer/allocation", icon: ClipboardCheck },
          { name: "Generate Report", href: "/dashboard/officer/reports", icon: Download },
          { name: "Announcements", href: "/dashboard/officer/announcements", icon: Megaphone },
          { name: "Manage Housing", href: "/dashboard/officer/housing", icon: Building2 },
           { name: "Settings", href: "/dashboard/officer/settings", icon: Settings },
          { name: "Support", href: "/dashboard/officer/support", icon: HelpCircle },
        ]
      : []),
    ...(session?.role === "COMMITTEE"
      ? [
          { name: "Review & Rank", href: "/dashboard/committee/review", icon: Scale },
          { name: "Respond Complaints", href: "/dashboard/committee/complaints", icon: MessageSquareWarning },
           { name: "Settings", href: "/dashboard/committee/settings", icon: Settings },
          { name: "Support", href: "/dashboard/committee/support", icon: HelpCircle },
        ]
      : []),
  ];

  return (
    <aside className={`
      fixed lg:static top-0 left-0 z-50 h-full w-72 flex-col border-r border-[var(--border)] 
      bg-gradient-to-br from-[var(--background-secondary)] to-[var(--background)] transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      lg:translate-x-0 lg:flex
    `}>
      {/* Mobile Close Button */}
      <div className="lg:hidden absolute top-4 right-4 z-60">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex flex-col h-full pt-12 lg:pt-0">
        {/* Header */}
        <div className="h-20 flex items-center px-8 border-b border-[var(--border)] bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-green)] to-[var(--color-yellow)] text-white shadow-lg">
          <BrandLockup logoSize={48} subtitle="" title="UOG" />
        </div>

      {/* Search Bar */}
        <div className="px-4 py-3 border-b border-[var(--border)] bg-white/50 backdrop-blur-sm">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-blue)]/10 via-[var(--color-green)]/10 to-[var(--color-yellow)]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-secondary)] transition-all duration-300 group-hover:text-[var(--color-blue)] group-hover:scale-110 z-10" />
            <input
              type="text"
              placeholder="Search navigation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[var(--border)] rounded-xl 
                       focus:outline-none focus:border-[var(--color-blue)] focus:bg-white 
                       focus:ring-2 focus:ring-[var(--color-blue)]/30 transition-all duration-300 shadow-sm hover:shadow-md
                       placeholder:text-[var(--foreground-secondary)] relative z-10"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col gap-1">
              {(() => {
                // Filter navigation items based on search query
                const filteredNavigation = navigation.filter((item) =>
                  item.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                
                if (filteredNavigation.length === 0) {
                  return (
                    <div className="text-center py-8 px-4">
                      <div className="w-12 h-12 bg-[var(--background)] rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search className="w-6 h-6 text-[var(--foreground-secondary)]" />
                      </div>
                      <p className="text-sm text-[var(--foreground-secondary)]">No navigation items found</p>
                      <p className="text-xs text-[var(--foreground-tertiary)] mt-1">
                        {searchQuery.trim() 
                          ? `No items match "${searchQuery}"` 
                          : "Try searching for navigation items"}
                      </p>
                    </div>
                  );
                }
                
                return filteredNavigation.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <div className={`
                      flex items-center gap-3 px-4 py-3 rounded-3xl text-sm font-medium
                      transition duration-300 hover:-translate-y-0.5 hover:shadow-md
                      ${isActive 
                        ? 'bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-green)] to-[var(--color-yellow)] text-white shadow-lg shadow-[rgba(var(--color-blue-rgb),0.25)]' 
                        : 'bg-white text-[var(--foreground)] hover:bg-gradient-to-r hover:from-[var(--color-blue)]/10 hover:via-[var(--color-green)]/10 hover:to-[var(--color-yellow)]/10 border border-[var(--border)] hover:border-[var(--color-blue)]'
                      }
                    `}
                  >
                    <item.icon className={`
                      h-5 w-5 shrink-0 transition duration-300
                      ${isActive 
                        ? 'text-white' 
                        : 'text-[var(--foreground-secondary)] hover:text-[var(--color-blue)]'
                      }
                    `} />
                    
                    <span className={`
                      transition duration-300
                      ${isActive 
                        ? 'text-white font-semibold' 
                        : 'text-[var(--foreground)] font-medium hover:text-[var(--color-blue)]'
                      }
                    `}>
                      {item.name}
                    </span>
                  </div>
                </Link>
              );
                });
              })()}
            </nav>
        </div>

        {/* Logout Section */}
        <div className={`p-4 border-t border-[var(--border)] backdrop-blur-sm bg-white/50 transition-all duration-300`}>
          <Button 
            variant="ghost" 
            className={`w-full justify-start gap-3 h-12 px-4 rounded-3xl
                     text-[var(--foreground)] hover:bg-gradient-to-r hover:from-[var(--color-blue)] hover:via-[var(--color-green)] hover:to-[var(--color-yellow)] hover:text-white 
                     border border-[var(--border)] hover:border-transparent transition-all duration-300
                     hover:-translate-y-0.5 hover:shadow-lg shadow-sm`}
            onClick={async () => {
              try {
                await logout();
                clearSession();
                toast.success("Logged out successfully");
                router.push("/auth/login");
              } catch (error) {
                toast.error("Failed to logout");
              }
            }}
          >
            <LogOut className="h-5 w-5 shrink-0 transition-all duration-300" />
            <span className="truncate font-medium">Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
