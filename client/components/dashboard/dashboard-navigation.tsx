"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home,
  FileText,
  Users,
  Settings,
  HelpCircle,
  CreditCard,
  Calendar,
  MessageSquare,
  Building,
  Award,
  ClipboardList,
  Bell,
  Search,
  User,
  LogOut
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard/lecturer",
    icon: Home,
    current: false,
  },
  {
    name: "My Applications",
    href: "/dashboard/lecturer/my-applications",
    icon: FileText,
    current: false,
  },
  {
    name: "New Application",
    href: "/dashboard/lecturer/application",
    icon: ClipboardList,
    current: false,
  },
  {
    name: "Results",
    href: "/dashboard/lecturer/results",
    icon: Award,
    current: false,
  },
  {
    name: "Documents",
    href: "/dashboard/lecturer/documents",
    icon: Users,
    current: false,
  },
  {
    name: "Complaints",
    href: "/dashboard/lecturer/complaints",
    icon: MessageSquare,
    current: false,
  },
  {
    name: "Settings",
    href: "/dashboard/lecturer/settings",
    icon: Settings,
    current: false,
  },
  {
    name: "Support",
    href: "/dashboard/lecturer/support",
    icon: HelpCircle,
    current: false,
  },
];

interface DashboardNavigationProps {
  user?: {
    name: string;
    email: string;
    role: string;
  };
}

export function DashboardNavigation({ user }: DashboardNavigationProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
          <Building className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Gondar Housing</h1>
          <p className="text-xs text-gray-500">Management System</p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || "John Doe"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || "john.doe@gondar.edu.et"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" className="flex-1">
            <Bell className="w-4 h-4 mr-1" />
            Alerts
          </Button>
          <Button variant="ghost" className="flex-1">
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
