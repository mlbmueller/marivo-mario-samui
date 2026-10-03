'use client';

import Link from 'next/link';
import { track, type AnalyticsEvent } from '@/lib/analytics';

type Props = {
  href: string;
  className?: string;
  external?: boolean;
  event: AnalyticsEvent;
  params?: { store?: string; category?: string };
  children: React.ReactNode;
};

/** Link that reports a prepared, non-personal analytics event (no-op while analytics is off). */
export function TrackedLink({ href, className, external, event, params, children }: Props) {
  const onClick = () => track(event, params ?? {});
  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
