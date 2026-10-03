'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isLocale } from '@/content/locales/config';

type Texts = Record<string, { title: string; text: string; back: string }>;

export function NotFoundContent({ texts }: { texts: Texts }) {
  const segment = (usePathname() ?? '').split('/')[1];
  const locale = isLocale(segment) ? segment : 'en';
  const t = texts[locale] ?? texts.en!;
  return (
    <section className="section">
      <div className="container prose">
        <h1>{t.title}</h1>
        <p className="lead">{t.text}</p>
        <Link href={`/${locale}`} className="btn">
          {t.back}
        </Link>
      </div>
    </section>
  );
}
