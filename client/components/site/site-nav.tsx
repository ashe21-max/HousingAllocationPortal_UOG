"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  UserCircle2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { BrandLockup } from "@/components/brand/brand-lockup";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { logout } from "@/lib/api/auth";
import { getDashboardPath } from "@/lib/auth/redirect-by-role";

export function SiteNav() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isReady, session, clearSession } = useAuth();

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // backend cleanup is best-effort, local session still needs removal
    }

    clearSession();
    setIsMenuOpen(false);
    toast.success("Signed out successfully.");
    router.replace("/auth/login");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <BrandLockup href="/" logoSize={44} subtitle="House Allocation Portal" />
        <nav className="flex items-center gap-3">
          {isReady && session ? (
            <div className="relative" ref={menuRef}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsMenuOpen((current) => !current)}
                className="min-w-44 gap-3 border-[var(--border)] bg-white px-4"
              >
                <div className="flex h-9 w-9 items-center justify-center bg-[var(--surface-muted)] text-[var(--color-primary)] rounded-none">
                  <UserCircle2 className="h-5 w-5" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-semibold text-[var(--color-primary)]">
                    {session.name}
                  </div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                    {session.role}
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-[var(--color-primary)] transition-transform ${
                    isMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              
            </div>
          ) : (
            <>
              
              <Link href="/auth/login">
                <Button className="min-w-40 gap-2">
                  Open Portal <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
