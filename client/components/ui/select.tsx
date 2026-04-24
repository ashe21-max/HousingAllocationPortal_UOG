import type { SelectHTMLAttributes } from "react";

type Option = {
  label: string;
  value: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: Option[];
  error?: string | null;
};

export function Select({ label, options, error, className = "", ...props }: SelectProps) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm font-medium text-[var(--color-primary)]">
      <span>{label}</span>
      <select
        className={`min-h-12 border border-[var(--border)] bg-white px-4 text-[var(--color-primary)] outline-none rounded-none focus:border-[var(--color-accent)] ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs text-[var(--color-danger)]">{error}</span> : null}
    </label>
  );
}
