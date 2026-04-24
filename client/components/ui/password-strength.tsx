import { CheckCircle2, Circle } from "lucide-react";

import { getPasswordStrength } from "@/lib/validation/password";

type PasswordStrengthProps = {
  value: string;
};

const barClasses = [
  "bg-[var(--color-danger)]",
  "bg-[var(--color-warning)]",
  "bg-[var(--color-accent)]",
  "bg-[var(--color-success)]",
];

export function PasswordStrength({ value }: PasswordStrengthProps) {
  const strength = getPasswordStrength(value);
  const activeBars = Math.max(1, Math.min(4, strength.score));

  return (
    <div className="flex flex-col gap-3 border border-[var(--border)] bg-[var(--surface-muted)] p-4 rounded-none">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-[var(--color-primary)]">
        <span>Password strength</span>
        <span>{strength.label}</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className={`h-2 ${index < activeBars ? barClasses[Math.max(0, activeBars - 1)] : "bg-white"} border border-[var(--border)]`}
          />
        ))}
      </div>
      <div className="grid gap-2 text-xs text-[var(--color-primary)] sm:grid-cols-2">
        <StrengthRule checked={strength.checks.minLength} label="8+ characters" />
        <StrengthRule checked={strength.checks.uppercase} label="Uppercase letter" />
        <StrengthRule checked={strength.checks.lowercase} label="Lowercase letter" />
        <StrengthRule checked={strength.checks.number} label="Number" />
        <StrengthRule checked={strength.checks.special} label="Special symbol" />
      </div>
    </div>
  );
}

function StrengthRule({ checked, label }: { checked: boolean; label: string }) {
  const Icon = checked ? CheckCircle2 : Circle;

  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-4 w-4 ${checked ? "text-[var(--color-success)]" : "text-[#8d93a8]"}`} />
      <span>{label}</span>
    </div>
  );
}
