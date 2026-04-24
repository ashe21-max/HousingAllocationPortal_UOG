import type { HousingStatus } from "@/lib/api/housing";

export function HousingStatusBadge({ status }: { status: HousingStatus }) {
  const tone =
    status === "Available"
      ? "border-[#b7e4cd] bg-[#edf9f1] text-[#1e8a5a]"
      : status === "Occupied"
        ? "border-[#f2c3c3] bg-[#fff0f0] text-[#c43c3c]"
        : "border-[#e7d4a8] bg-[#fff7e3] text-[#b87017]";

  return (
    <span
      className={`inline-flex min-h-8 items-center border px-3 text-xs font-semibold uppercase tracking-[0.16em] rounded-none ${tone}`}
    >
      {status}
    </span>
  );
}
