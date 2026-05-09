import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
      {children}
    </Suspense>
  );
}
