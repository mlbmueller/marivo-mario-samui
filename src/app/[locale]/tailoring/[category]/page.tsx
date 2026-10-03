import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categories, categoryIds, isCategoryId } from '@/content/services';
import { locales } from '@/content/locales';
import type { CategoryId } from '@/content/types';
import { DraftBadge } from '@/components/Draft';
import { Icon } from '@/components/Icon';
import { Media } from '@/components/Media';
import { CategoryDraftNotice, ClosingCta, PageHead } from '@/components/Sections';
import { TrackedLink } from '@/components/TrackedLink';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { fmt, localePath } from '@/lib/i18n';
import { pageMetadata, requireAvailable, resolveLocale } from '@/lib/page';
import { shown } from '@/lib/site';

type Params = Promise<{ locale: string; category: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => categoryIds.map((category) => ({ locale, category })));
}

async function resolve(params: Params) {
  const { category } = await params;
  if (!isCategoryId(category)) notFound();
  const { locale, t } = await resolveLocale(params);
  return { locale, t, id: category as CategoryId };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, t, id } = await resolve(params);
  return pageMetadata(locale, `/tailoring/${id}`, t.categories[id].title, t.categories[id].intro);
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { locale, t, id } = await resolve(params);
  requireAvailable(`/tailoring/${id}`);
  const c = t.categories[id];
  const s = t.categories.shared;
  const price = shown(categories[id].price);
  const contactHref = `${localePath(locale, '/contact')}?product=${id}${id === 'weddings' ? '&concern=wedding' : ''}`;

  return (
    <>
      <PageHead
        title={c.title}
        lead={c.intro}
        crumbLabel={t.common.breadcrumb}
        crumbs={[
          { href: localePath(locale, '/'), label: t.common.home },
          { href: localePath(locale, '/tailoring'), label: t.nav.tailoring },
        ]}
        badge={<DraftBadge status={categories[id].offered.status} label={t.common.draft} />}
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container detail-grid">
          <div className="stack">
            <CategoryDraftNotice id={id} t={t} />
            <Media id={categories[id].image} dict={t} ratio="3 / 2" sizes="(min-width: 900px) 66vw, 100vw" />
            <div className="prose">
              <h2>{s.audienceHeading}</h2>
              <p>{c.audience}</p>
            </div>
            <div>
              <h2>{s.occasionsHeading}</h2>
              <ul className="tag-list">
                {c.occasions.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2>{s.garmentsHeading}</h2>
              <ul className="tag-list">
                {c.garments.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </div>
            <div className="prose">
              <h2>{s.optionsHeading}</h2>
              <p>{s.optionsText}</p>
            </div>
            <div className="prose">
              <h2>{s.fabricsHeading}</h2>
              <p>{s.fabricsText}</p>
              <Link href={localePath(locale, '/craftsmanship')} className="text-link">
                {t.nav.craftsmanship}
                <Icon name="arrow" />
              </Link>
            </div>
            {id === 'weddings' && (
              <div className="prose">
                <h2>{s.groupHeading}</h2>
                <p>{s.groupText}</p>
              </div>
            )}
          </div>
          <aside className="sticky-aside card">
            <h2 style={{ fontSize: '1.3rem' }}>{s.priceHeading}</h2>
            {price ? (
              <>
                <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>{fmt(s.priceFrom, { amount: price.fromThb.toLocaleString('en-US') })}</p>
                <p className="small muted">{price.scope}</p>
                <p className="small muted">{price.surcharges}</p>
              </>
            ) : (
              <p>{s.priceText}</p>
            )}
            <h2 style={{ fontSize: '1.3rem', marginTop: '1.5rem' }}>{s.nextHeading}</h2>
            <p>{s.nextText}</p>
            <div className="btn-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <TrackedLink href={contactHref} className="btn" event="contact_cta_click" params={{ category: id }}>
                <Icon name="calendar" />
                {fmt(s.inquire, { category: c.name })}
              </TrackedLink>
              <WhatsAppButton dict={t} category={id} />
            </div>
          </aside>
        </div>
      </section>
      <ClosingCta locale={locale} t={t} />
    </>
  );
}
