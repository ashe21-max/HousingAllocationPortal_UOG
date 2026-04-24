import type { UserRole } from "@/lib/auth/session-storage";

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "LECTURER":
      return "/dashboard/lecturer";
    case "OFFICER":
      return "/dashboard/officer";
    case "COMMITTEE":
      return "/dashboard/committee";
    default:
      return "/auth/login";
  }
}
