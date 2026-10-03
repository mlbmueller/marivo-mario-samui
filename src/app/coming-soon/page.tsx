import { brand } from '@/content/brand';
import { closureOf, stores, storeIds } from '@/content/stores';
import { formatMonth } from '@/lib/hours';
import { Icon } from '@/components/Icon';
import { LogoImage } from '@/components/Logo';
import { buildWhatsAppLink, whatsappNumberFor } from '@/lib/whatsapp';
import { dictionaries } from '@/content/locales';
import { fmt } from '@/lib/i18n';

/**
 * Public holding page for www.nickyfashionsamui.com while the full site is prepared.
 * Only confirmed facts: brand, the two store areas. No placeholders, no form, no invented data.
 * A WhatsApp button appears automatically once a number is confirmed in src/content/brand.ts.
 */
export default function ComingSoonPage() {
  const wa = buildWhatsAppLink({ number: whatsappNumberFor(null), dict: dictionaries.en });
  const year = new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Asia/Bangkok' }).format(new Date());

  return (
    <main className="holding">
      <div className="holding-inner">
        <h1 className="visually-hidden">{brand.logo.alt}</h1>
        <LogoImage className="holding-logo" priority />

        <p className="holding-eyebrow">Custom tailoring · Koh Samui</p>

        <div className="holding-langs">
          <section lang="en">
            <h2>Our new website is coming soon.</h2>
            <p>Until then, we look forward to welcoming you on Koh Samui.</p>
          </section>
          <section lang="de">
            <h2>Unsere neue Webseite kommt bald.</h2>
            <p>Bis dahin freuen wir uns auf deinen Besuch auf Koh Samui.</p>
          </section>
        </div>

        <ul className="holding-stores" aria-label="Stores">
          {storeIds.map((id) => {
            const s = stores[id];
            const address = s.address.status === 'confirmed' ? s.address.value : null;
            const map = s.mapUrl.status === 'confirmed' ? s.mapUrl.value : null;
            const closed = closureOf(s);
            return (
              <li key={id}>
                <Icon name="pin" />
                <span>
                  <strong>{s.name.value}</strong>, {s.area.value}
                  {address && <span className="holding-address">{address}</span>}
                  {closed && (
                    <span className="holding-closed">
                      <span lang="en">
                        {dictionaries.en.stores.temporarilyClosed} · {fmt(dictionaries.en.stores.reopening, { month: formatMonth(closed, 'en') })}
                      </span>
                      <span lang="de">
                        {dictionaries.de.stores.temporarilyClosed} · {fmt(dictionaries.de.stores.reopening, { month: formatMonth(closed, 'de') })}
                      </span>
                    </span>
                  )}
                  {map && (
                    <a href={map} target="_blank" rel="noopener noreferrer" className="holding-map">
                      Directions
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
            Chat on WhatsApp
          </a>
        )}
      </div>
      <footer className="holding-footer">© {year} {brand.name.value}</footer>
    </main>
  );
}
