export const SCORING_CONSTANTS = {
  MIN_SERVICE_YEARS: 0,
  MAX_SERVICE_YEARS: 60,
  MIN_TITLE_LENGTH: 2,
  MIN_DESCRIPTION_LENGTH: 2,
};

export const SCORING_FIELD_STYLES = {
  TEXTAREA: "min-h-12 w-full border border-[var(--border)] bg-white px-4 py-3 text-[var(--color-primary)] outline-none rounded-none placeholder:text-[#8d93a8] focus:border-[var(--color-accent)] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60",
};

export const scoringStatusConfig = {
  DRAFT: {
    label: "Draft Status",
    className: "bg-amber-50 text-amber-600 border-amber-200",
  },
  ACTIVE: {
    label: "Active Application",
    className: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
};
