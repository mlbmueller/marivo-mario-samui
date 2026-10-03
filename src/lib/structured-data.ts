/**
 * JSON-LD for stores. Generated only from confirmed facts that are also visible on the
 * page. No ratings, review counts or combined scores. Returns null when the essentials
 * (confirmed brand name and address) are missing.
 */
import { brand } from '@/content/brand';
import { stores } from '@/content/stores';
import type { StoreId } from '@/content/types';

export function storeJsonLd(id: StoreId, pageUrl: string | null): Record<string, unknown> | null {
  const store = stores[id];
  if (brand.name.status !== 'confirmed' || store.address.status !== 'confirmed') return null;

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: `${brand.name.value} – ${store.name.value}`,
    address: store.address.value,
  };
  if (pageUrl) data.url = pageUrl;
  if (store.phone.status === 'confirmed') data.telephone = store.phone.value;
  if (store.mapUrl.status === 'confirmed') data.hasMap = store.mapUrl.value;
  if (store.hours.status === 'confirmed') {
    data.openingHours = store.hours.value.map((h) => `${h.days} ${h.open}-${h.close}`);
  }
  return data;
}
