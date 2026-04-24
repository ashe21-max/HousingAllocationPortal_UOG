"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { UserRole } from "@/lib/auth/session-storage";
import { getDashboardPath } from "@/lib/auth/redirect-by-role";
import { useAuth } from "@/hooks/use-auth";

type DashboardGateProps = {
  role: UserRole;
  children: React.ReactNode;
};

export function DashboardGate({ role, children }: DashboardGateProps) {
  const router = useRouter();
  const { isReady, session } = useAuth();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!session) {
      router.replace("/auth/login");
      return;
    }

    if (session.role !== role) {
      router.replace(getDashboardPath(session.role));
    }
  }, [isReady, role, router, session]);

  if (!isReady || !session || session.role !== role) {
    return (
      <div className="panel flex min-h-[320px] items-center justify-center p-8 text-sm text-muted">
        Loading secure workspace...
      </div>
    );
  }

  return <>{children}</>;
}
