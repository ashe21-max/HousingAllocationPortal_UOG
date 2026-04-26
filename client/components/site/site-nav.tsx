"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BrandLockup } from "@/components/brand/brand-lockup";
import { Button } from "@/components/ui/button";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <BrandLockup href="/" logoSize={44} subtitle="House Allocation Portal" />
        <nav className="flex items-center gap-3">
          {/* Permanent Open Portal Button - Always Visible */}
          <Link href="/auth/login">
            <Button className="min-w-40 gap-2">
              Open Portal <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
