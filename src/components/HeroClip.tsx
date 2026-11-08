'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';

type Props = { src: string; poster: string; label: string; labels: { pause: string; play: string } };

/**
 * Small looping store film in the home hero (desktop only; the slot is hidden on phones).
 * Muted, no autoplay with prefers-reduced-motion, nothing is downloaded until it plays,
 * and a visible button pauses or plays it.
 */
export function HeroClip({ src, poster, label, labels }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const desktop = window.matchMedia('(min-width: 960px)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (desktop && !reduced) el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, []);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <figure className="media hero-clip" style={{ aspectRatio: '16 / 9' }}>
      <video ref={ref} muted loop playsInline preload="none" poster={poster} aria-label={label}>
        <source src={src} type="video/mp4" />
      </video>
      <button type="button" className="intro-toggle" onClick={toggle} aria-pressed={!playing} aria-label={playing ? labels.pause : labels.play} title={playing ? labels.pause : labels.play}>
        <Icon name={playing ? 'pause' : 'play'} />
      </button>
    </figure>
  );
}
