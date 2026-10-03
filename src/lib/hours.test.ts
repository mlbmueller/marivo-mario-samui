import { describe, expect, it } from 'vitest';
import { formatDays } from './hours';

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
