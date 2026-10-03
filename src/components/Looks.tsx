import type { Dictionary, Locale } from '@/content/locales';
import type { Look } from '@/content/looks';
import { categories } from '@/content/services';
import { localePath } from '@/lib/i18n';
import { isPreview, visibleLooks } from '@/lib/site';
import { Icon } from './Icon';
import { LookGallery, type GalleryItem } from './LookGallery';
import { Media } from './Media';
import { WhatsAppButton } from './WhatsAppButton';

type LookTitleKey = keyof Dictionary['looks']['items'];

export const lookTitle = (t: Dictionary, id: string) => t.looks.items[id as LookTitleKey]?.title ?? id;

/** Look id → title/interest for the request form (visible, removable look reference). */
export function lookInfoFor(t: Dictionary): Record<string, { title: string; interest: string }> {
  return Object.fromEntries(visibleLooks().map((l) => [l.id, { title: lookTitle(t, l.id), interest: categories[l.category].interest }]));
}

/** Link into the request form with look context. Contains no personal data. */
export const askHref = (locale: Locale, id: string) => `${localePath(locale, '/contact')}?look=${encodeURIComponent(id)}`;

function LookText({ look, locale, t, headingLevel = 3 }: { look: Look; locale: Locale; t: Dictionary; headingLevel?: 2 | 3 }) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3';
  const occasion = look.occasion?.[locale] ?? look.occasion?.en;
  const fabric = look.fabric?.[locale] ?? look.fabric?.en;
  return (
    <>
      <p className="look-meta">{t.categories[look.category].worldName}</p>
      <Heading>{lookTitle(t, look.id)}</Heading>
      {occasion && (
        <p className="look-meta">
          {t.looks.occasionLabel}: {occasion}
        </p>
      )}
      {fabric && (
        <p className="look-meta">
          {t.looks.fabricLabel}: {fabric}
        </p>
      )}
      {look.status !== 'confirmed' && isPreview() && <p className="look-meta pending small">{t.looks.slotNotice}</p>}
    </>
  );
}

/** Static look card (home page, category pages). Every action works without hover. */
export function LookCard({ look, locale, t }: { look: Look; locale: Locale; t: Dictionary }) {
  return (
    <article className="look-card" data-look={look.id}>
      <Media id={look.image} dict={t} ratio="3 / 4" sizes="(min-width: 900px) 33vw, 50vw" />
      <LookText look={look} locale={locale} t={t} />
      <a href={askHref(locale, look.id)} className="btn btn-secondary btn-sm">
        {t.looks.askLook}
        <Icon name="arrow" />
      </a>
    </article>
  );
}

export function LookGrid({ looks, locale, t }: { looks: Look[]; locale: Locale; t: Dictionary }) {
  if (looks.length === 0) return null;
  return (
    <div className="looks-grid">
      {looks.map((l) => (
        <LookCard key={l.id} look={l} locale={locale} t={t} />
      ))}
    </div>
  );
}

/** Filterable gallery with an accessible detail dialog (Our Work page). */
export function LookGalleryServer({ locale, t }: { locale: Locale; t: Dictionary }) {
  const items: GalleryItem[] = visibleLooks().map((look) => ({
    id: look.id,
    category: look.category,
    title: lookTitle(t, look.id),
    card: (
      <>
        <Media id={look.image} dict={t} ratio="3 / 4" sizes="(min-width: 900px) 33vw, 50vw" />
      </>
    ),
    text: <LookText look={look} locale={locale} t={t} />,
    dialogText: <LookText look={look} locale={locale} t={t} headingLevel={2} />,
    image: <Media id={look.image} dict={t} ratio="3 / 4" sizes="(min-width: 760px) 50vw, 100vw" />,
    askHref: askHref(locale, look.id),
    whatsapp: <WhatsAppButton dict={t} category={look.category} look={look.id} className="btn btn-secondary btn-sm" />,
  }));
  const categoriesPresent = [...new Set(items.map((i) => i.category))];
  return (
    <LookGallery
      items={items}
      filters={categoriesPresent.map((c) => ({ id: c, label: t.categories[c].worldName }))}
      labels={{ filter: t.ourWork.filterLabel, all: t.ourWork.filterAll, count: t.ourWork.countLabel, ask: t.looks.askLook, view: t.looks.viewLook, close: t.common.close }}
    />
  );
}
