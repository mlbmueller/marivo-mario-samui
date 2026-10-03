import Link from 'next/link';
import { brand } from '@/content/brand';

/**
 * The approved three-line word mark as delivered (outlined SVG). Never rebuilt from text,
 * never stretched: width is set by CSS, height follows the viewBox ratio (height: auto).
 */
export function LogoImage({ className = 'logo-img', priority = false }: { className?: string; priority?: boolean }) {
  const { web, webWidth, webHeight, alt } = brand.logo;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static vector file, no optimisation needed
    <img src={web} width={webWidth} height={webHeight} alt={alt} className={className} decoding="async" fetchPriority={priority ? 'high' : undefined} />
  );
}

export function Logo({ href, priority }: { href: string; priority?: boolean }) {
  return (
    <Link href={href} className="logo">
      <LogoImage priority={priority} />
    </Link>
  );
}
