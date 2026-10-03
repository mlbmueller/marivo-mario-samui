import type { Dictionary } from '@/content/locales';
import type { CategoryId, StoreId } from '@/content/types';
import { buildWhatsAppLink, whatsappNumberFor } from '@/lib/whatsapp';
import { isPreview } from '@/lib/site';
import { Icon } from './Icon';
import { TrackedLink } from './TrackedLink';

type Props = {
  dict: Dictionary;
  store?: StoreId | null;
  category?: CategoryId | null;
  look?: string | null;
  label?: string;
  className?: string;
};

/**
 * WhatsApp contact. Only a confirmed number produces a working link. Without one, the
 * preview shows a visibly disabled button with an explanation; production hides it.
 */
export function WhatsAppButton({ dict, store = null, category = null, look = null, label, className = 'btn btn-secondary' }: Props) {
  const href = buildWhatsAppLink({ number: whatsappNumberFor(store), dict, category, store, look });
  const text = label ?? dict.common.chatWhatsApp;

  if (href) {
    return (
      <TrackedLink
        href={href}
        className={className}
        external
        event="whatsapp_click"
        params={{ store: store ?? undefined, category: category ?? undefined }}
      >
        <Icon name="chat" />
        {text}
      </TrackedLink>
    );
  }

  if (!isPreview()) return null;

  return (
    <span className="whatsapp-disabled">
      <span className={className} aria-disabled="true" role="link" title={dict.common.whatsappPending}>
        <Icon name="chat" />
        {text}
      </span>
      <span className="disabled-hint">{dict.common.whatsappPending}</span>
    </span>
  );
}
