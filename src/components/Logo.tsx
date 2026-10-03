import Link from 'next/link';
import { brand } from '@/content/brand';

/**
 * TEMPORARY wordmark (draft): simple geometric mark left of the name.
 * Mark = a diamond with a vertical stitch line. Replace once a final logo is approved
 * (brand.logo in src/content/brand.ts). No third-party marks, no imitation of other logotypes.
 */
export function LogoMark({ className = 'logo-mark' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <rect x="8.5" y="8.5" width="23" height="23" transform="rotate(45 20 20)" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M20 9v22" stroke="var(--accent)" strokeWidth="2" strokeDasharray="2.5 2.5" />
    </svg>
  );
}

export function Logo({ href }: { href: string }) {
  return (
    <Link href={href} className="logo" aria-label={`${brand.name.value} ${brand.suffix.value}`}>
      <LogoMark />
      <span className="logo-text" aria-hidden="true">
        <span className="logo-name">{brand.name.value}</span>
        <span className="logo-suffix">{brand.suffix.value}</span>
      </span>
    </Link>
  );
}
