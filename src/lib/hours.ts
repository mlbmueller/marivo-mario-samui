/** Opening-hours day codes as used by schema.org: "Mo", "Mo-Sa", "Su". */
const DAY_CODES = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as const;

/** 1 Jan 2024 was a Monday — used to get localised weekday names from Intl. */
const dayName = (code: string, locale: string) => {
  const index = DAY_CODES.indexOf(code as (typeof DAY_CODES)[number]);
  if (index < 0) return code;
  return new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2024, 0, 1 + index)));
};

/** "Mo-Sa" → "Monday – Saturday" (localised); unknown codes are returned unchanged. */
export function formatDays(days: string, locale: string): string {
  return days
    .split('-')
    .map((code) => dayName(code.trim(), locale))
    .join(' – ');
}

/** "2026-12" → "December 2026" in the given language. */
export function formatMonth(month: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${month}-01T00:00:00Z`));
}
