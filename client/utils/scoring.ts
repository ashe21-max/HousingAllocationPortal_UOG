export function fmt(n: number | null | undefined): string {
  if (n === null || n === undefined) {
    return "—";
  }
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}