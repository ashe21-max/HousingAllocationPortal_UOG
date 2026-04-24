export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
