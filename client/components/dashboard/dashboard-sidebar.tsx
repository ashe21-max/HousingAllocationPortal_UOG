"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  X
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
          { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
          { name: "Support", href: "/dashboard/admin/support", icon: HelpCircle },
        ] 
      : []),
    ...(session?.role === "LECTURER" 
      ? [
          { name: "New Application", href: "/dashboard/lecturer/application", icon: FileText },
          { name: "My Applications", href: "/dashboard/lecturer/my-applications", icon: FileText },
          { name: "Upload Documents", href: "/dashboard/lecturer/documents", icon: FileText },
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
      fixed lg:static top-0 left-0 z-50 h-full w-72 flex-col border-r border-[#2a5298] 
      bg-gradient-to-br from-[#f5f7fa] to-[#e9edf2] transform transition-transform duration-300 ease-in-out
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
        <div className="h-16 flex items-center px-6 border-b border-[#2a5298] bg-gradient-to-r from-[#1e3c72] via-[#2b4c7c] to-[#2a5298] text-white shadow-lg">
          <BrandLockup logoSize={40} subtitle="" />
        </div>

      {/* Search Bar */}
        <div className="px-4 py-3 border-b border-[#2a5298] bg-gradient-to-r from-transparent to-[#2a5298]/10">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1e3c72]/10 via-[#2b4c7c]/10 to-[#2a5298]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b] transition-all duration-300 group-hover:text-[#1e3c72] group-hover:scale-110 z-10" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-[#ffffff] border border-[#cbd5e1] rounded-xl 
                       focus:outline-none focus:border-[#2a5298] focus:bg-[#ffffff] 
                       focus:ring-2 focus:ring-[#2a5298]/30 transition-all duration-300 shadow-sm hover:shadow-md
                       placeholder:text-[#64748b] relative z-10"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col gap-1">
              {navigation.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <div className={`
                      relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                      transition-all duration-500 transform hover:scale-105 hover:-translate-y-1
                      ${isActive 
                        ? 'bg-gradient-to-r from-[#1e3c72] via-[#2b4c7c] to-[#2a5298] text-white shadow-xl shadow-[#2a5298]/40 border border-[#2a5298]' 
                        : 'bg-[#ffffff] hover:bg-gradient-to-r hover:from-[#f5f7fa] hover:via-[#e9edf2] hover:to-[#e9edf2] text-[#475569] hover:shadow-xl hover:border-[#2a5298] border border-[#cbd5e1]'
                      }
                    `}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Multi-layer animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2a5298]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-600 rounded-xl blur-md" />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1e3c72]/20 via-transparent to-[#2b4c7c]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl blur-lg" />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#2a5298]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-800 rounded-xl blur-xl" />
                    
                    {/* Premium shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffffff]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-xl -translate-x-full group-hover:translate-x-full ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1e3c72]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1200 rounded-xl -translate-x-full group-hover:translate-x-full ease-in-out" />
                    
                    {/* Animated glow and pulse effects */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#2a5298]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-xl group-hover:blur-2xl" />
                    <div className="absolute inset-0 rounded-xl border border-[#2a5298]/20 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-[#2a5298]/50" />
                    
                    <item.icon className={`
                      h-5 w-5 shrink-0 transition-all duration-500 relative z-10
                      ${isActive 
                        ? 'text-white drop-shadow-xl scale-125 filter brightness-110' 
                        : 'text-[#64748b] group-hover:text-[#1e3c72] group-hover:scale-125 group-hover:drop-shadow-lg'
                      }
                    `} />
                    
                    {/* Icon glow effect for active state */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#2a5298]/50 to-transparent rounded-xl blur-2xl animate-pulse" />
                    )}
                    
                    <span className={`
                      transition-all duration-500 relative z-10
                      ${isActive 
                        ? 'text-white font-bold tracking-wide' 
                        : 'text-[#475569] font-medium group-hover:text-[#1e3c72] group-hover:font-semibold group-hover:tracking-wide'
                      }
                    `}>
                      {item.name}
                    </span>
                    
                    {/* Premium active indicator */}
                    {isActive && (
                      <div className="absolute right-3 top-1/2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-[#2a5298] to-[#1e3c72] rounded-full animate-pulse shadow-lg shadow-[#2a5298]/50" />
                        <div className="w-1 h-1 bg-[#ffffff] rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
                        <div className="w-1 h-1 bg-[#ffffff]/80 rounded-full animate-ping" style={{ animationDelay: '0.6s' }} />
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
            </nav>
        </div>

        {/* Logout Section */}
        <div className={`p-4 border-t border-[#2a5298] backdrop-blur-sm bg-gradient-to-r from-transparent to-[#2a5298]/10 transition-all duration-500`}>
          <Button 
            variant="ghost" 
            className={`w-full justify-start gap-3 h-12 px-4 rounded-xl
                     text-[#64748b] hover:bg-gradient-to-r hover:from-red-600/20 hover:to-pink-600/20 hover:text-white 
                     border-transparent hover:border-[#2a5298]/50 transition-all duration-500 transform hover:scale-[1.02]
                     relative overflow-hidden group`}
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
            {/* Multi-layer animated hover background */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 via-transparent to-pink-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-transparent to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-800 rounded-xl" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-red-600/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-900 rounded-xl" />
            
            {/* Premium shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffffff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1200 rounded-xl -translate-x-full group-hover:translate-x-full ease-out" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1500 rounded-xl -translate-x-full group-hover:translate-x-full ease-in-out" />
            
            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl blur-xl group-hover:blur-2xl" />
            <div className="absolute inset-0 rounded-xl border border-red-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-red-600/50" />
            
            <LogOut className="h-5 w-5 shrink-0 transition-all duration-500 text-[#64748b] group-hover:text-red-400 group-hover:scale-110 relative z-10" />
            <span className="truncate font-medium transition-all duration-500 text-[#64748b] group-hover:text-white group-hover:translate-x-1 relative z-10">Logout</span>
            
            {/* Premium warning indicator */}
            <div className="ml-auto">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 animate-pulse shadow-lg shadow-red-500/50" />
              <div className="w-1 h-1 bg-red-400 rounded-full animate-ping absolute top-1/2 left-1/2" style={{ animationDelay: '0.5s' }} />
            </div>
          </Button>
        </div>
      </div>
    </aside>
  );
}
