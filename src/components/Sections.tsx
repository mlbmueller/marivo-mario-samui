import Link from 'next/link';
import type { Dictionary, Locale } from '@/content/locales';
import { categories, categoryIds, processSteps } from '@/content/services';
import { exteriorImageFor, stores } from '@/content/stores';
import { formatDays } from '@/lib/hours';
import type { StoreId } from '@/content/types';
import { fmt, localePath } from '@/lib/i18n';
import { isPageAvailable, isPreview, isPublishable, shown } from '@/lib/site';
import { DraftBadge, PreviewNotice } from './Draft';
import { Icon } from './Icon';
import { Media } from './Media';
import { TrackedLink } from './TrackedLink';
import { WhatsAppButton } from './WhatsAppButton';

export function PageHead({
  title,
  lead,
  eyebrow,
  crumbs,
  badge,
  crumbLabel = 'Breadcrumb',
}: {
  title: string;
  lead?: string;
  eyebrow?: string;
  crumbs?: { href: string; label: string }[];
  badge?: React.ReactNode;
  crumbLabel?: string;
}) {
  return (
    <header className="page-head">
      <div className="container">
        {crumbs && crumbs.length > 0 && (
          <nav className="breadcrumb" aria-label={crumbLabel}>
            <ol>
              {crumbs.map((c) => (
                <li key={c.href}>
                  <Link href={c.href}>{c.label}</Link>
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>
          {title}
          {badge}
        </h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
    </header>
  );
}

/** Categories that may be shown in the current mode. */
export const visibleCategories = () => categoryIds.filter((id) => isPageAvailable(`/tailoring/${id}`));

/** The four style worlds (Suits · Linen & Holiday · Women · Weddings), each with its own page. */
export function CategoryCards({ locale, t }: { locale: Locale; t: Dictionary }) {
  const ids = visibleCategories();
  if (ids.length === 0) return null;
  return (
    <div className="worlds">
      {ids.map((id) => (
        <Link key={id} href={localePath(locale, `/tailoring/${id}`)} className="world">
          <Media id={categories[id].image} dict={t} ratio="4 / 5" sizes="(min-width: 960px) 25vw, (min-width: 480px) 50vw, 100vw" />
          <h3>
            <span>
              {t.categories[id].worldName}
              <DraftBadge status={categories[id].offered.status} label={t.common.draft} />
            </span>
            <Icon name="arrow" className="icon arrow" />
          </h3>
          <p>{t.categories[id].worldText}</p>
        </Link>
      ))}
    </div>
  );
}

/** The proposed fitting process. Hidden in production until confirmed. */
export function ProcessSteps({ t }: { t: Dictionary }) {
  const steps = shown(processSteps);
  if (!steps) return null;
  return (
    <>
      <ol className="steps">
        {steps.map((key) => (
          <li key={key}>
            <h3>{t.process.steps[key].title}</h3>
            <p>{t.process.steps[key].text}</p>
          </li>
        ))}
      </ol>
      {processSteps.status !== 'confirmed' && isPreview() && (
        <p className="small" style={{ marginTop: '1.5rem', opacity: 0.85 }}>
          <span className="draft-badge" style={{ marginInlineStart: 0, marginInlineEnd: '0.5rem' }}>
            {t.common.draft}
          </span>
          {t.process.proposedNotice}
        </p>
      )}
    </>
  );
}

function Fact({ label, value, t }: { label: string; value: React.ReactNode | null; t: Dictionary }) {
  if (value === null && !isPreview()) return null;
  return (
    <>
      <dt>{label}</dt>
      <dd>{value ?? <span className="pending">{t.common.toBeConfirmed}</span>}</dd>
    </>
  );
}

export function DirectionsButton({ store, t }: { store: StoreId; t: Dictionary }) {
  const mapUrl = stores[store].mapUrl.status === 'confirmed' ? stores[store].mapUrl.value : null;
  if (mapUrl) {
    return (
      <TrackedLink href={mapUrl} className="btn btn-secondary" external event="directions_click" params={{ store }}>
        <Icon name="pin" />
        {t.common.getDirections}
      </TrackedLink>
    );
  }
  if (!isPreview()) return null;
  return (
    <span className="whatsapp-disabled">
      <span className="btn btn-secondary" aria-disabled="true" role="link">
        <Icon name="pin" />
        {t.common.getDirections}
      </span>
      <span className="disabled-hint">{t.common.directionsPending}</span>
    </span>
  );
}

export function StoreFacts({ store, locale, t }: { store: StoreId; locale: Locale; t: Dictionary }) {
  const s = stores[store];
  const hours = shown(s.hours);
  const phone = shown(s.phone);
  return (
    <dl className="facts">
      <Fact label={t.stores.addressLabel} value={shown(s.address)} t={t} />
      <Fact
        label={t.stores.hoursLabel}
        value={
          hours ? (
            <ul className="list-plain">
              {hours.map((h) => (
                <li key={h.days}>
                  {formatDays(h.days, locale)}: {h.open}–{h.close}
                </li>
              ))}
            </ul>
          ) : null
        }
        t={t}
      />
      <Fact label={t.stores.phoneLabel} value={phone ? <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a> : null} t={t} />
    </dl>
  );
}

export function StoreCard({ store, locale, t, headingLevel = 3 }: { store: StoreId; locale: Locale; t: Dictionary; headingLevel?: 2 | 3 }) {
  const s = stores[store];
  const Heading = `h${headingLevel}` as 'h2' | 'h3';
  return (
    <article className="store-card card">
      <Media id={exteriorImageFor(s)} dict={t} alt={fmt(t.stores.exteriorAlt, { store: t.storeNames[store] })} ratio="4 / 3" sizes="(min-width: 720px) 50vw, 100vw" />
      <div>
        <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>
          {t.common.koh}
        </p>
        <Heading>{t.storeNames[store]}</Heading>
      </div>
      <StoreFacts store={store} locale={locale} t={t} />
      <div className="btn-row">
        <Link href={localePath(locale, `/stores/${store}`)} className="btn">
          {t.common.viewStore}
        </Link>
        <DirectionsButton store={store} t={t} />
      </div>
      <WhatsAppButton dict={t} store={store} className="btn btn-secondary btn-sm" />
    </article>
  );
}

export function ClosingCta({ locale, t, heading, text }: { locale: Locale; t: Dictionary; heading?: string; text?: string }) {
  return (
    <section className="section section-dark on-dark">
      <div className="container">
        <div className="section-head" style={{ marginBottom: '2rem' }}>
          <h2>{heading ?? t.home.closingHeading}</h2>
          <p>{text ?? t.home.closingText}</p>
        </div>
        <div className="btn-row">
          <TrackedLink href={localePath(locale, '/contact')} className="btn" event="contact_cta_click">
            <Icon name="calendar" />
            {t.common.planFitting}
          </TrackedLink>
          <WhatsAppButton dict={t} />
        </div>
      </div>
    </section>
  );
}

/** Draft marker + notice for a not yet confirmed category. */
export function CategoryDraftNotice({ id, t }: { id: keyof typeof categories; t: Dictionary }) {
  if (isPublishable(categories[id].offered.status, 'production')) return null;
  return <PreviewNotice>{t.categories.shared.unconfirmedNotice}</PreviewNotice>;
}
