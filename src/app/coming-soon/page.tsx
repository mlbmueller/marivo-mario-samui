import { brand } from '@/content/brand';
import { closureOf, stores, storeIds } from '@/content/stores';
import { Icon } from '@/components/Icon';
import { LogoImage } from '@/components/Logo';
import { buildWhatsAppLink, whatsappNumberFor } from '@/lib/whatsapp';
import { dictionaries, localeMeta, locales, type Locale } from '@/content/locales';
import { formatMonth } from '@/lib/hours';
import { fmt } from '@/lib/i18n';

/** Holding texts per language (the rest comes from the site dictionaries). */
const TEXT: Record<Locale, { title: string; text: string }> = {
  en: { title: 'Our new website is coming soon.', text: 'Until then, we look forward to welcoming you on Koh Samui.' },
  de: { title: 'Unsere neue Webseite kommt bald.', text: 'Bis dahin freuen wir uns auf deinen Besuch auf Koh Samui.' },
  th: { title: 'เว็บไซต์ใหม่ของเรากำลังจะเปิดเร็วๆ นี้', text: 'ระหว่างนี้ ยินดีต้อนรับคุณที่เกาะสมุย' },
  fr: { title: 'Notre nouveau site arrive bientôt.', text: 'D’ici là, nous nous réjouissons de vous accueillir à Koh Samui.' },
  it: { title: 'Il nostro nuovo sito arriva presto.', text: 'Nel frattempo ti aspettiamo a Koh Samui.' },
};

const isLocale = (v: unknown): v is Locale => typeof v === 'string' && (locales as readonly string[]).includes(v);

/**
 * Public holding page for www.nickyfashionsamui.com while the full site is prepared.
 * Only confirmed facts. Language via ?lang= (EN default), same five languages as the site.
 */
export default async function ComingSoonPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  const locale: Locale = isLocale(lang) ? lang : 'en';
  const t = dictionaries[locale];
  const text = TEXT[locale];
  const wa = buildWhatsAppLink({ number: whatsappNumberFor(null), dict: t });
  const year = new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Asia/Bangkok' }).format(new Date());

  return (
    <main className="holding" lang={localeMeta[locale].hreflang}>
      <nav className="holding-switch" aria-label="Language">
        {locales.map((l) => (
          <a key={l} href={l === 'en' ? '?' : `?lang=${l}`} lang={localeMeta[l].hreflang} aria-current={l === locale ? 'true' : undefined}>
            {localeMeta[l].short}
          </a>
        ))}
      </nav>
      <div className="holding-inner">
        <h1 className="visually-hidden">{brand.logo.alt}</h1>
        <LogoImage className="holding-logo" priority />

        <p className="holding-eyebrow">{t.home.eyebrow}</p>

        <div className="holding-langs">
          <section>
            <h2>{text.title}</h2>
            <p>{text.text}</p>
          </section>
        </div>

        <ul className="holding-stores" aria-label={t.nav.stores}>
          {storeIds.map((id) => {
            const s = stores[id];
            const address = s.address.status === 'confirmed' ? s.address.value : null;
            const map = s.mapUrl.status === 'confirmed' ? s.mapUrl.value : null;
            const closed = closureOf(s);
            return (
              <li key={id}>
                <Icon name="pin" />
                <span>
                  <strong>{t.storeNames[id]}</strong>, {t.common.koh}
                  {address && <span className="holding-address">{address}</span>}
                  {closed && (
                    <span className="holding-closed">
                      {t.stores.temporarilyClosed} · {fmt(t.stores.reopening, { month: formatMonth(closed, localeMeta[locale].intl) })}
                    </span>
                  )}
                  {map && (
                    <a href={map} target="_blank" rel="noopener noreferrer" className="holding-map">
                      {t.common.getDirections}
                    </a>
                  )}
                </span>
              </li>
            );
          })}
        </ul>

        {wa && (
          <a href={wa} className="btn" target="_blank" rel="noopener noreferrer">
            <Icon name="chat" />
            {t.common.chatWhatsApp}
          </a>
        )}
      </div>
      <footer className="holding-footer">© {year} {brand.name.value}</footer>
    </main>
  );
}
