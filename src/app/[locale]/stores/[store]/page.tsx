import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { exteriorImageFor, isStoreId, storeIds, stores } from '@/content/stores';
import type { StoreId } from '@/content/types';
import { Icon } from '@/components/Icon';
import { Media } from '@/components/Media';
import { ClosingCta, DirectionsButton, PageHead, StoreFacts } from '@/components/Sections';
import { TrackedLink } from '@/components/TrackedLink';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { fmt, localePath } from '@/lib/i18n';
import { pageMetadata, resolveLocale } from '@/lib/page';
import { getSiteUrl, isPreview, shown, routedLocales } from '@/lib/site';
import { storeJsonLd } from '@/lib/structured-data';

type Params = Promise<{ locale: string; store: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return routedLocales().flatMap((locale) => storeIds.map((store) => ({ locale, store })));
}

async function resolve(params: Params) {
  const { store } = await params;
  if (!isStoreId(store)) notFound();
  const { locale, t } = await resolveLocale(params);
  return { locale, t, id: store as StoreId };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, t, id } = await resolve(params);
  const name = t.storeNames[id];
  return pageMetadata(locale, `/stores/${id}`, fmt(t.stores.storeTitle, { store: name }), fmt(t.stores.storeIntro, { store: name }));
}

export default async function StorePage({ params }: { params: Params }) {
  const { locale, t, id } = await resolve(params);
  const name = t.storeNames[id];
  const s = stores[id];
  const other = storeIds.find((x) => x !== id)!;
  const siteUrl = getSiteUrl();
  const directionsFact = shown(s.directions);
  const directions = directionsFact ? (directionsFact[locale] ?? directionsFact.en ?? null) : null;
  const jsonLd = storeJsonLd(id, siteUrl ? `${siteUrl}${localePath(locale, `/stores/${id}`)}` : null);

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />}
      <PageHead
        title={fmt(t.stores.storeTitle, { store: name })}
        lead={fmt(t.stores.storeIntro, { store: name })}
        eyebrow={t.common.koh}
        crumbLabel={t.common.breadcrumb}
        crumbs={[
          { href: localePath(locale, '/'), label: t.common.home },
          { href: localePath(locale, '/stores'), label: t.nav.stores },
        ]}
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container detail-grid">
          <div className="stack">
            <Media id={exteriorImageFor(s)} dict={t} alt={fmt(t.stores.exteriorAlt, { store: name })} ratio="4 / 3" sizes="(min-width: 900px) 66vw, 100vw" />
            <Media id={s.interiorImage} dict={t} alt={fmt(t.stores.interiorAlt, { store: name })} ratio="4 / 3" sizes="(min-width: 900px) 66vw, 100vw" />
          </div>
          <aside className="sticky-aside card stack">
            <StoreFacts store={id} t={t} />
            {(directions || isPreview()) && (
              <div>
                <h2 style={{ fontSize: '1.1rem' }}>{t.stores.directionsLabel}</h2>
                {directions ? <p>{directions}</p> : <p className="pending">{t.stores.directionsText}</p>}
              </div>
            )}
            <div className="btn-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <TrackedLink href={`${localePath(locale, '/contact')}?store=${id}`} className="btn" event="contact_cta_click" params={{ store: id }}>
                <Icon name="calendar" />
                {fmt(t.stores.requestHere, { store: name })}
              </TrackedLink>
              <WhatsAppButton dict={t} store={id} />
              <DirectionsButton store={id} t={t} />
            </div>
          </aside>
        </div>
      </section>
      <section className="section-tight section-white">
        <div className="container">
          <p className="eyebrow">{t.stores.otherStore}</p>
          <Link href={localePath(locale, `/stores/${other}`)} className="text-link" style={{ fontSize: '1.3rem' }}>
            {t.storeNames[other]}, {t.common.koh}
            <Icon name="arrow" />
          </Link>
        </div>
      </section>
      <ClosingCta locale={locale} t={t} />
    </>
  );
}
