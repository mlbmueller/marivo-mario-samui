import type { ContentStatus } from '@/content/types';
import { isPreview } from '@/lib/site';

/** Small "Draft" marker, rendered only in preview mode for non-confirmed content. */
export function DraftBadge({ status, label }: { status: ContentStatus; label: string }) {
  if (status === 'confirmed' || !isPreview()) return null;
  return <span className="draft-badge">{label}</span>;
}

/** Preview-only explanatory notice. */
export function PreviewNotice({ children }: { children: React.ReactNode }) {
  if (!isPreview()) return null;
  return (
    <p className="notice" role="note">
      {children}
    </p>
  );
}
