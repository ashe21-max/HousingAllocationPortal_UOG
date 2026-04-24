export type PasswordStrength = {
  score: number;
  label: "Weak" | "Fair" | "Strong" | "Excellent";
  checks: {
    minLength: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
};

export function getPasswordStrength(value: string): PasswordStrength {
  const checks = {
    minLength: value.length >= 8,
    uppercase: /[A-Z]/.test(value),
    lowercase: /[a-z]/.test(value),
    number: /\d/.test(value),
    special: /[^A-Za-z0-9]/.test(value),
  };

  const score = Object.values(checks).filter(Boolean).length;

  if (score <= 2) {
    return { score, label: "Weak", checks };
  }

  if (score === 3) {
    return { score, label: "Fair", checks };
  }

  if (score === 4) {
    return { score, label: "Strong", checks };
  }

  return { score, label: "Excellent", checks };
}

export function validatePassword(value: string): string | null {
  const strength = getPasswordStrength(value);

  if (!strength.checks.minLength) {
    return "Password must be at least 8 characters.";
  }

  if (
    !strength.checks.uppercase ||
    !strength.checks.lowercase ||
    !strength.checks.number ||
    !strength.checks.special
  ) {
    return "Password must include uppercase, lowercase, number, and special character.";
  }

  return null;
}
