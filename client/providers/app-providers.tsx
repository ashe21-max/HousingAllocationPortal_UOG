"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";

import { AuthProvider } from "@/providers/auth-provider";
import { QueryProvider } from "@/providers/query-provider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              borderRadius: 0,
            },
          }}
        />
      </AuthProvider>
    </QueryProvider>
  );
}
