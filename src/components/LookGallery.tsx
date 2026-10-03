'use client';

import { useRef, useState } from 'react';
import type { CategoryId } from '@/content/types';
import { Icon } from './Icon';

export type GalleryItem = {
  id: string;
  category: CategoryId;
  title: string;
  card: React.ReactNode;
  text: React.ReactNode;
  dialogText: React.ReactNode;
  image: React.ReactNode;
  askHref: string;
  whatsapp: React.ReactNode;
};

type Props = {
  items: GalleryItem[];
  filters: { id: CategoryId; label: string }[];
  labels: { filter: string; all: string; count: string; ask: string; view: string; close: string };
};

/**
 * Filterable look gallery. The detail view is a native <dialog> (focus is kept inside while
 * open, Escape closes); focus returns to the card that opened it.
 */
export function LookGallery({ items, filters, labels }: Props) {
  const [filter, setFilter] = useState<CategoryId | 'all'>('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const shown = filter === 'all' ? items : items.filter((i) => i.category === filter);
  const open = items.find((i) => i.id === openId);

  const openDialog = (id: string, opener: HTMLButtonElement) => {
    openerRef.current = opener;
    setOpenId(id);
    // Wait for the dialog content to render before showing it.
    requestAnimationFrame(() => dialogRef.current?.showModal());
  };

  const onClose = () => {
    setOpenId(null);
    openerRef.current?.focus();
  };

  return (
    <>
      {filters.length > 1 && (
        <div className="filter-row" role="group" aria-label={labels.filter}>
          <button type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
            {labels.all}
          </button>
          {filters.map((f) => (
            <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </div>
      )}
      <p className="muted small" aria-live="polite">
        {labels.count.replace('{count}', String(shown.length))}
      </p>
      <div className="looks-grid">
        {shown.map((item) => (
          <article key={item.id} className="look-card" data-look={item.id}>
            <button type="button" className="look-image-button" aria-label={`${labels.view}: ${item.title}`} onClick={(e) => openDialog(item.id, e.currentTarget)}>
              {item.card}
            </button>
            {item.text}
            <a href={item.askHref} className="btn btn-secondary btn-sm">
              {labels.ask}
              <Icon name="arrow" />
            </a>
          </article>
        ))}
      </div>

      <dialog ref={dialogRef} className="look-dialog" aria-label={open?.title} onClose={onClose}>
        {open && (
          <div className="look-dialog-inner">
            <div>{open.image}</div>
            <div className="stack">
              <div>{open.dialogText}</div>
              <div className="btn-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <a href={open.askHref} className="btn">
                  {labels.ask}
                  <Icon name="arrow" />
                </a>
                {open.whatsapp}
              </div>
            </div>
            <button type="button" className="dialog-close" aria-label={labels.close} onClick={() => dialogRef.current?.close()}>
              <Icon name="close" />
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
