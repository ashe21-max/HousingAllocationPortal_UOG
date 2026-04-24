import type { HousingCondition } from "@/lib/api/housing";

export function HousingConditionBadge({
  condition,
}: {
  condition: HousingCondition;
}) {
  const tone =
    condition === "Under Maintenance"
      ? "border-[#e7d4a8] bg-[#fff7e3] text-[#b87017]"
      : condition === "Needs Repair"
        ? "border-[#f2c3c3] bg-[#fff4f4] text-[#c43c3c]"
        : "border-[var(--border)] bg-white text-[var(--color-primary)]";

  return (
    <span
      className={`inline-flex min-h-8 items-center border px-3 text-xs font-semibold uppercase tracking-[0.16em] rounded-none ${tone}`}
    >
      {condition}
    </span>
  );
}
