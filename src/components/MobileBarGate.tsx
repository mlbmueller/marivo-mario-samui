'use client';

import { usePathname } from 'next/navigation';
import { stripLocale } from '@/lib/i18n';

/** Pages with their own request form get no quick-contact bar (no redundant action, no overlap). */
const HIDDEN_ON = ['/contact', '/returning-customers'];

export function MobileBarGate({ children }: { children: React.ReactNode }) {
  const path = stripLocale(usePathname() ?? '/');
  if (HIDDEN_ON.includes(path)) return null;
  return <>{children}</>;
}
