import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
      <div className="min-h-screen bg-[var(--background-secondary)] relative">
        {/* Top gradient background */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
          style={{
            background: 'radial-gradient(circle at top, rgba(var(--color-blue-rgb), 0.18), transparent 45%)',
          }}
        />
        {/* Bottom gradient background */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background: 'radial-gradient(circle at bottom, rgba(var(--color-green-rgb), 0.14), transparent 50%)',
          }}
        />
        <div className="relative">
          {children}
        </div>
      </div>
    </Suspense>
  );
}
