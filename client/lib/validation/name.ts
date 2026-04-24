export function validateName(value: string): string | null {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return "Name is required.";
  }

  if (normalizedValue.length < 3) {
    return "Name must be at least 3 characters.";
  }

  if (/\d/.test(normalizedValue)) {
    return "Name cannot contain numbers.";
  }

  return null;
}
