import { brand } from './brand';
import type { MediaId } from './media';
import { confirmed, missing, type Fact, type StoreId } from './types';

export type OpeningHours = { days: string; open: string; close: string }[];

export type Store = {
  id: StoreId;
  /** Display name of the location (the area), used as the store label. */
  name: Fact<string>;
  area: Fact<string>;
  /** Full postal address as it should appear on the site. */
  address: Fact<string>;
  /** Which previous business name belongs to this store — unconfirmed. */
  previousName: Fact<string>;
  hours: Fact<OpeningHours>;
  /** International format, e.g. "+66 ..." */
  phone: Fact<string>;
  /** International format without spaces, e.g. "+66..." */
  whatsapp: Fact<string>;
  /** Link to an external map (Google Maps / Apple Maps) for this exact store. No guessed pins. */
  mapUrl: Fact<string>;
  /** Short directions per language code (e.g. { en: '…', de: '…' }). English is the fallback. */
  directions: Fact<Partial<Record<string, string>>>;
  /** Image ids from media.ts */
  exteriorImage: MediaId;
  /** Facade after the rename; replaces exteriorImage once brand.transition.active is true. */
  exteriorImageAfterRename?: MediaId;
  interiorImage: MediaId;
};

const unknownStoreFields = () => ({
  address: missing('Exact address not confirmed') as Fact<string>,
  previousName: missing('Mapping of previous names to stores not confirmed') as Fact<string>,
  hours: missing('Opening hours not confirmed') as Fact<OpeningHours>,
  phone: missing('No confirmed phone number') as Fact<string>,
  whatsapp: missing('No confirmed WhatsApp number') as Fact<string>,
  mapUrl: missing('No confirmed map link') as Fact<string>,
  directions: missing('No directions yet') as Fact<Partial<Record<string, string>>>,
});

export const stores: Record<StoreId, Store> = {
  chaweng: {
    id: 'chaweng',
    name: confirmed('Chaweng'),
    area: confirmed('Koh Samui'),
    ...unknownStoreFields(),
    exteriorImage: 'store-chaweng-exterior',
    interiorImage: 'store-chaweng-interior',
  },
  'fishermans-village': {
    id: 'fishermans-village',
    name: confirmed('Fisherman’s Village'),
    area: confirmed('Koh Samui'),
    ...unknownStoreFields(),
    previousName: confirmed('Samui Armani By Mario', 'Owner, 3 Oct 2026: current facade signage until the rename in 2027'),
    exteriorImage: 'store-fishermans-village-exterior',
    exteriorImageAfterRename: 'store-fishermans-village-exterior-renamed',
    interiorImage: 'store-fishermans-village-interior',
  },
};

/** Facade photo matching the signage customers currently see on site. */
export const exteriorImageFor = (s: Store): MediaId =>
  brand.transition.active && s.exteriorImageAfterRename ? s.exteriorImageAfterRename : s.exteriorImage;

export const storeIds = Object.keys(stores) as StoreId[];

export const isStoreId = (value: unknown): value is StoreId =>
  typeof value === 'string' && (storeIds as string[]).includes(value);
