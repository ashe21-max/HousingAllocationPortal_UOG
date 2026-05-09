/**
 * Full-viewport backdrop matching auth layout: `.page-shell`-style layers + grid,
 * diagonal brand gradient, floating blur orbs.
 */
export function DashboardMainAuthBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(var(--color-blue-rgb), 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(var(--color-green-rgb), 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(var(--color-yellow-rgb), 0.1) 0%, transparent 50%),
            radial-gradient(circle at 10% 10%, rgba(139, 92, 246, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 90% 90%, rgba(236, 72, 153, 0.1) 0%, transparent 40%),
            linear-gradient(135deg, var(--background) 0%, var(--background-secondary) 100%)
          `,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(var(--color-blue-rgb), 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--color-blue-rgb), 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-blue)] via-[var(--color-green)] to-[var(--color-yellow)] opacity-90" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 h-32 w-32 rounded-full bg-white/10 blur-xl animate-pulse" />
        <div
          className="absolute bottom-32 right-32 h-48 w-48 rounded-full bg-white/10 blur-xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/3 h-40 w-40 rounded-full bg-white/10 blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>
    </div>
  );
}
