/**
 * Format a Date as YYYY-MM-DD using the local calendar day.
 * Avoid toISOString() for this: it converts to UTC and can shift the day.
 */
export function toLocalISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
