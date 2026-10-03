/**
 * Release gate (npm run check:release, also run before every build).
 * Prints all open items. In SITE_MODE=production it fails while blockers remain,
 * so a production build cannot be created from unapproved content.
 */
import { describe, expect, it } from 'vitest';
import { getReleaseReport } from '../src/lib/release';

describe('release check', () => {
  const mode = process.env.SITE_MODE === 'production' ? 'production' : 'preview';
  const report = getReleaseReport(process.env);

  it(`content and configuration (${mode})`, () => {
    const lines = [
      `Mode: ${mode}`,
      `Blocking items (${report.blockers.length}):`,
      ...report.blockers.map((b) => `  ✗ [${b.area}] ${b.item}`),
      `Automatically hidden in production (${report.hidden.length}):`,
      ...report.hidden.map((h) => `  – [${h.area}] ${h.item}`),
    ];
    console.log(lines.join('\n'));
    if (mode === 'production') expect(report.blockers, 'Resolve all blocking items before a production build').toEqual([]);
  });
});
