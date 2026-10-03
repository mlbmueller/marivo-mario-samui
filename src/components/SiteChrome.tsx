import Link from 'next/link';
import { brand, operator, privacyNotice } from '@/content/brand';
import { localeMeta, locales, type Dictionary, type Locale } from '@/content/locales';
import { storeIds } from '@/content/stores';
import { localePath } from '@/lib/i18n';
import { isPageAvailable, isPreview, isPublishable } from '@/lib/site';
import { buildWhatsAppLink, whatsappNumberFor } from '@/lib/whatsapp';
import { FooterLanguages } from './FooterLanguages';
import { Header, type NavItem } from './Header';
import { Icon } from './Icon';
import { Logo } from './Logo';

export function mainNav(locale: Locale, t: Dictionary): NavItem[] {
  const items: { path: string; label: string }[] = [
    { path: '/tailoring', label: t.nav.tailoring },
    { path: '/how-it-works', label: t.nav.howItWorks },
    { path: '/about', label: t.nav.team },
    { path: '/stores', label: t.nav.stores },
    { path: '/contact', label: t.nav.contact },
  ];
  return items.filter((i) => isPageAvailable(i.path)).map((i) => ({ ...i, href: localePath(locale, i.path) }));
}

export function SiteHeader({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <Header
      logo={<Logo href={localePath(locale, '/')} />}
      nav={mainNav(locale, t)}
      cta={{ href: localePath(locale, '/contact'), label: t.common.planFitting }}
      current={locale}
      languages={locales.map((code) => ({ code, ...localeMeta[code] }))}
      labels={{
        openMenu: t.common.openMenu,
        closeMenu: t.common.closeMenu,
        mainNav: t.common.mainNav,
        changeLanguage: t.common.changeLanguage,
        language: t.common.language,
      }}
    />
  );
}

export function SiteFooter({ locale, t }: { locale: Locale; t: Dictionary }) {
  const lp = (path: string) => localePath(locale, path);
  const more = [
    { path: '/craftsmanship', label: t.nav.craftsmanship },
    { path: '/our-work', label: t.nav.ourWork },
    { path: '/faq', label: t.nav.faq },
    { path: '/our-new-name', label: t.nav.newName },
  ].filter((i) => isPageAvailable(i.path) && (i.path !== '/our-new-name' || brand.transition.active));
  // Legal pages are linked once approved; in preview always, so they can be reviewed.
  const legal = [
    { path: '/privacy', label: t.nav.privacy, show: isPublishable(privacyNotice.status) },
    { path: '/legal', label: t.nav.legal, show: isPreview() || operator.status === 'confirmed' },
  ].filter((i) => i.show);
  const year = new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Asia/Bangkok' }).format(new Date());

  return (
    <footer className="site-footer on-dark">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo href={lp('/')} />
            <p className="muted" style={{ marginTop: '1.25rem', maxWidth: '32ch', color: '#c9d0d8' }}>
              {t.footer.tagline}
            </p>
          </div>
          <div>
            <h2>{t.footer.storesHeading}</h2>
            <ul>
              {storeIds.map((id) => (
                <li key={id}>
                  <Link href={lp(`/stores/${id}`)}>
                    {t.storeNames[id]}, {t.common.koh}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>{t.footer.contactHeading}</h2>
            <ul>
              <li>
                <Link href={lp('/contact')}>{t.common.planFitting}</Link>
              </li>
              {(() => {
                const wa = buildWhatsAppLink({ number: whatsappNumberFor(null), dict: t });
                return wa ? (
                  <li>
                    <a href={wa} target="_blank" rel="noopener noreferrer">
                      {t.common.chatWhatsApp}
                    </a>
                  </li>
                ) : null;
              })()}
              {brand.email.status === 'confirmed' && (
                <li>
                  <a href={`mailto:${brand.email.value}`}>{brand.email.value}</a>
                </li>
              )}
              <li>
                <Link href={lp('/returning-customers')}>{t.nav.returning}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2>{t.footer.moreHeading}</h2>
            <ul>
              {more.map((i) => (
                <li key={i.path}>
                  <Link href={lp(i.path)}>{i.label}</Link>
                </li>
              ))}
              {legal.map((i) => (
                <li key={i.path}>
                  <Link href={lp(i.path)}>{i.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-meta">
          <span>
            © {year} {brand.name.value} {brand.suffix.value}
          </span>
          <FooterLanguages label={t.common.language} current={locale} languages={locales.map((code) => ({ code, label: localeMeta[code].label, hreflang: localeMeta[code].hreflang }))} />
        </div>
      </div>
    </footer>
  );
}

/** Quick-contact bar on phones. Body gets bottom padding (.has-mobile-bar) so it never hides content. */
export function MobileBar({ locale, t }: { locale: Locale; t: Dictionary }) {
  const wa = buildWhatsAppLink({ number: whatsappNumberFor(null), dict: t });
  return (
    <div className="mobile-bar" role="region" aria-label={t.mobileBar.label}>
      {wa ? (
        <a href={wa} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
          <Icon name="chat" />
          {t.mobileBar.whatsapp}
        </a>
      ) : (
        <span className="btn btn-secondary" aria-disabled="true" role="link" title={t.common.whatsappPending}>
          <Icon name="chat" />
          {t.mobileBar.whatsapp}
        </span>
      )}
      <Link href={localePath(locale, '/contact')} className="btn">
        <Icon name="calendar" />
        {t.mobileBar.plan}
      </Link>
    </div>
  );
}
