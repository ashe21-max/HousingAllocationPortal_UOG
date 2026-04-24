export function validateOtp(value: string): string | null {
  const normalizedValue = value.trim().toUpperCase();

  if (!normalizedValue) {
    return "Verification code is required.";
  }

  if (!/^(?=(?:.*\d){4})(?=(?:.*[A-Z]){2})[A-Z0-9]{6}$/.test(normalizedValue)) {
    return "Code must contain 4 digits and 2 uppercase letters.";
  }

  return null;
}
