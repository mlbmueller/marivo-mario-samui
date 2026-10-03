'use client';

import { usePathname } from 'next/navigation';
import type { Locale } from '@/content/locales/config';
import { switchLocalePath } from '@/lib/i18n';
import { Icon } from './Icon';

type Props = { label: string; current: Locale; languages: { code: Locale; label: string; hreflang: string }[] };

/** Footer language links — like the header switcher, they keep the current page. */
export function FooterLanguages({ label, current, languages }: Props) {
  const pathname = usePathname() ?? '/';
  return (
    <nav aria-label={label} className="footer-langs">
      <Icon name="globe" className="icon" />
      {languages.map((l) => (
        <a key={l.code} href={switchLocalePath(pathname, l.code)} hrefLang={l.hreflang} lang={l.hreflang} aria-current={l.code === current ? 'true' : undefined}>
          {l.label}
        </a>
      ))}
    </nav>
  );
}
