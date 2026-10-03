import Image from 'next/image';
import { media, type MediaId } from '@/content/media';
import type { Dictionary } from '@/content/locales';
import { isPreview } from '@/lib/site';
import { Icon } from './Icon';

type Props = {
  id: MediaId;
  dict: Dictionary;
  /** Override alt text (e.g. with the localised store name). */
  alt?: string;
  sizes?: string;
  priority?: boolean;
  /** Override the aspect ratio for cropping, e.g. "4 / 5". */
  ratio?: string;
};

/**
 * Renders an approved photo, or — while none exists — a calm, clearly labelled placeholder
 * with the correct aspect ratio, so layout and cropping can be reviewed. Placeholders never
 * show human faces. In production, sections decide whether to render at all.
 */
export function Media({ id, dict, alt, sizes = '(min-width: 1000px) 50vw, 100vw', priority, ratio }: Props) {
  const asset = media[id];
  const altText = alt ?? dict.media[id];
  const aspectRatio = ratio ?? `${asset.width} / ${asset.height}`;

  if (asset.src && asset.rights === 'approved') {
    const style = asset.focus ? { objectPosition: asset.focus } : undefined;
    return (
      <figure className="media" style={{ aspectRatio }}>
        {asset.mobileSrc ? (
          <picture>
            <source media="(max-width: 959px)" srcSet={asset.mobileSrc} />
            <Image src={asset.src} alt={altText} width={asset.width} height={asset.height} sizes={sizes} priority={priority} style={style} />
          </picture>
        ) : (
          <Image src={asset.src} alt={altText} width={asset.width} height={asset.height} sizes={sizes} priority={priority} style={style} />
        )}
      </figure>
    );
  }

  // Placeholders are a review aid only — production renders nothing instead.
  if (!isPreview()) return null;

  return (
    <div className="placeholder" style={{ aspectRatio }} role="img" aria-label={`${dict.common.photoPlaceholder}: ${altText}`}>
      <span className="placeholder-label">
        <Icon name="image" className="placeholder-icon" />
        <strong>{dict.common.photoPlaceholder}</strong>
        <span>{altText}</span>
      </span>
    </div>
  );
}
