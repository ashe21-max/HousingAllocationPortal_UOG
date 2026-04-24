export function validateEmail(value: string): string | null {
  const normalizedValue = value.trim().toLowerCase();

  if (!normalizedValue) {
    return "Email is required.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValue)) {
    return "Enter a valid email address.";
  }

  return null;
}
