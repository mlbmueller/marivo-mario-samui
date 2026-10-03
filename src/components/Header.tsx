'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { switchLocalePath } from '@/lib/i18n';
import type { Locale } from '@/content/locales/config';

export type NavItem = { href: string; label: string; path: string };
export type LanguageOption = { code: Locale; label: string; short: string; hreflang: string };

type Props = {
  logo: React.ReactNode;
  nav: NavItem[];
  cta: { href: string; label: string };
  languages: LanguageOption[];
  current: string;
  labels: { openMenu: string; closeMenu: string; mainNav: string; changeLanguage: string; language: string };
};

function isActive(pathname: string, href: string, home: string) {
  return href === home ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header({ logo, nav, cta, languages, current, labels }: Props) {
  const pathname = usePathname() ?? '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const langButton = useRef<HTMLButtonElement>(null);
  const home = `/${current}`;

  // Close menus after navigation (state adjusted during render, no effect needed).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
    setLangOpen(false);
  }

  // Move focus into the mobile menu when it opens; Escape closes and returns focus.
  useEffect(() => {
    if (!menuOpen) return;
    panel.current?.querySelector<HTMLElement>('a, button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (!langOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLangOpen(false);
        langButton.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [langOpen]);

  const currentLang = languages.find((l) => l.code === current);

  // Keeps the query string (e.g. a preselected product on /contact) when switching language.
  const onLanguageClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (window.location.search) {
      e.preventDefault();
      window.location.assign(href + window.location.search);
    }
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        {logo}
        <nav className="main-nav" aria-label={labels.mainNav}>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isActive(pathname, item.href, home) ? 'page' : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-actions">
          <div className="lang-switch" ref={langRef}>
            <button
              ref={langButton}
              type="button"
              className="lang-button"
              aria-expanded={langOpen}
              aria-controls="language-menu"
              aria-label={`${labels.changeLanguage} (${currentLang?.label ?? current})`}
              onClick={() => setLangOpen((open) => !open)}
            >
              <Icon name="globe" className="icon" />
              <span aria-hidden="true">{currentLang?.short}</span>
            </button>
            {langOpen && (
              <ul className="lang-menu" id="language-menu" aria-label={labels.language}>
                {languages.map((lang) => {
                  const href = switchLocalePath(pathname, lang.code);
                  return (
                    <li key={lang.code}>
                      <a
                        href={href}
                        hrefLang={lang.hreflang}
                        lang={lang.hreflang}
                        aria-current={lang.code === current ? 'true' : undefined}
                        onClick={(e) => onLanguageClick(e, href)}
                      >
                        <span>{lang.label}</span>
                        <span className="muted small">{lang.short}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <Link href={cta.href} className="btn btn-sm header-cta">
            {cta.label}
          </Link>
          <button
            ref={menuButton}
            type="button"
            className="menu-button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? labels.closeMenu : labels.openMenu}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
      <div className="mobile-panel" id="mobile-menu" ref={panel} hidden={!menuOpen}>
        <nav className="container" aria-label={labels.mainNav}>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isActive(pathname, item.href, home) ? 'page' : undefined} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={cta.href} className="btn" onClick={() => setMenuOpen(false)}>
            {cta.label}
          </Link>
        </nav>
      </div>
    </header>
  );
}
