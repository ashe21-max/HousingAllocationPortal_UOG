"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { PerformanceMonitor, fastRedirect, prefetchRoute } from "@/utils/performance";

export function useOptimizedNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  // Optimized navigation with performance tracking
  const navigate = useCallback((path: string, options?: { replace?: boolean; message?: string }) => {
    const from = pathname || "unknown";
    const to = path;
    
    PerformanceMonitor.logNavigation(from, to);
    
    if (options?.message) {
      toast.loading(options.message);
    }

    if (options?.replace) {
      router.replace(path);
    } else {
      router.push(path);
    }
  }, [router, pathname]);

  // Optimized back navigation
  const goBack = useCallback((fallbackPath = "/dashboard") => {
    try {
      PerformanceMonitor.logNavigation(pathname || "unknown", "back");
      
      if (window.history.length > 1) {
        router.back();
        toast.success("Navigated back");
      } else {
        fastRedirect(router, fallbackPath, "No history available");
      }
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Navigation failed, redirecting to dashboard");
      fastRedirect(router, fallbackPath);
    }
  }, [router, pathname]);

  // Prefetch routes on hover for better perceived performance
  const prefetch = useCallback((path: string) => {
    prefetchRoute(router, path);
  }, [router]);

  // Fast refresh
  const refresh = useCallback(() => {
    try {
      toast.loading("Refreshing page...");
      PerformanceMonitor.measurePageLoad("refresh");
      window.location.reload();
    } catch (error) {
      console.error("Refresh error:", error);
      toast.error("Refresh failed");
    }
  }, []);

  return {
    navigate,
    goBack,
    prefetch,
    refresh,
    currentPath: pathname,
  };
}
