/**
 * Get the start of the week (Monday) for a given date.
 * Returns a new Date at 00:00:00.
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the date number (day of month) for a date.
 */
export function getDateNumber(date: Date): number {
  return date.getDate();
}

/**
 * Get day of week (0 = Sunday, 1 = Monday, ... 6 = Saturday).
 */
export function getDayOfWeek(date: Date): number {
  return date.getDay();
}

/**
 * Day abbreviations for header.
 */
export const DAY_ABBREVS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;

/**
 * Check if two dates are the same calendar day.
 */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
