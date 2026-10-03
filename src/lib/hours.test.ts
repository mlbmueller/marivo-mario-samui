import { describe, expect, it } from 'vitest';
import { formatDays, formatMonth } from './hours';

describe('formatDays', () => {
  it('localises single days and ranges', () => {
    expect(formatDays('Mo-Sa', 'en')).toBe('Monday – Saturday');
    expect(formatDays('Su', 'de')).toBe('Sonntag');
    expect(formatDays('Mo-Sa', 'de')).toBe('Montag – Samstag');
  });
  it('leaves unknown codes unchanged', () => {
    expect(formatDays('Holidays', 'en')).toBe('Holidays');
  });
});

describe('formatMonth', () => {
  it('formats a planned month in the page language', () => {
    expect(formatMonth('2026-12', 'en')).toBe('December 2026');
    expect(formatMonth('2026-12', 'de')).toBe('Dezember 2026');
  });
});
