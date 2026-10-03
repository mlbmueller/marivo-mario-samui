import type { Dictionary, Locale } from '@/content/locales';
import { interests } from '@/content/services';
import { localePath } from '@/lib/i18n';
import { Icon } from './Icon';

/**
 * Compact "When are you visiting Samui?" module. A plain GET form to /contact:
 * interest and dates are taken over into the full request form (no double entry).
 * Nothing is sent here and nothing is confirmed automatically. Works without JavaScript.
 */
export function PlanStay({ locale, t }: { locale: Locale; t: Dictionary }) {
  const f = t.form;
  return (
    <form action={localePath(locale, '/contact')} method="get" className="card" data-testid="plan-stay">
      <div className="plan-module">
        <div className="field">
          <label htmlFor="plan-interest">{f.interest}</label>
          <select id="plan-interest" name="interest" defaultValue="unsure">
            {interests.map((i) => (
              <option key={i} value={i}>
                {f.interests[i]}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="plan-arrival">{f.arrival}</label>
          <input id="plan-arrival" name="arrival" type="date" />
        </div>
        <div className="field">
          <label htmlFor="plan-departure">{f.departure}</label>
          <input id="plan-departure" name="departure" type="date" />
        </div>
        <label className="checkbox">
          <input type="checkbox" name="datesOpen" value="1" />
          {f.datesOpen}
        </label>
        <button type="submit" className="btn">
          {t.home.planSubmit}
          <Icon name="arrow" />
        </button>
      </div>
    </form>
  );
}
