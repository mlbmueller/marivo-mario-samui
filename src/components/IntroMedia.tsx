'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Icon } from './Icon';

export type IntroMediaSlide = { src: string; alt: string; focus: string; mobileFocus: string; width: number; height: number };
export type IntroMediaVideo = { src: string; mobileSrc: string | null; poster: IntroMediaSlide };

type Props = {
  slides: IntroMediaSlide[];
  video: IntroMediaVideo | null;
  labels: { pause: string; play: string };
};

/** Each photo stays ~5 s; the cross-fade overlaps the next one. */
const SLIDE_MS = 5000;

const REDUCED = '(prefers-reduced-motion: reduce)';
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const getReduced = () => window.matchMedia(REDUCED).matches;

/**
 * Background of the intro hero: a muted looping video when one is configured, otherwise a
 * calm sequence of real photos (slow zoom, soft cross-fade). The first image is part of the
 * server HTML, so it is visible immediately. With prefers-reduced-motion nothing starts on
 * its own; the visible button pauses or plays the motion at any time.
 */
export function IntroMedia({ slides, video, labels }: Props) {
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);
  // 'auto' follows the motion preference until the visitor decides.
  const [choice, setChoice] = useState<'auto' | 'playing' | 'paused'>('auto');
  const playing = choice === 'auto' ? !reduced : choice === 'playing';
  const [{ active, previous }, setSlide] = useState<{ active: number; previous: number | null }>({ active: 0, previous: null });
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const showVideo = !!video && !videoFailed;
  const count = slides.length;

  // Photo sequence
  useEffect(() => {
    if (showVideo || !playing || count < 2) return;
    const id = window.setInterval(() => {
      setSlide((s) => ({ previous: s.active, active: (s.active + 1) % count }));
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [showVideo, playing, count]);

  // Video: start/stop with the control; a blocked autoplay falls back to the poster.
  useEffect(() => {
    const el = videoRef.current;
    if (!showVideo || !el) return;
    if (playing) {
      el.play().catch(() => setVideoFailed(true));
    } else {
      el.pause();
    }
  }, [showVideo, playing]);

  const toggle = () => setChoice(playing ? 'paused' : 'playing');

  return (
    <div className={`intro-media${playing ? '' : ' is-paused'}`}>
      {showVideo && video ? (
        <video
          ref={videoRef}
          className="intro-video"
          muted
          playsInline
          loop
          preload="metadata"
          poster={video.poster.src}
          aria-hidden="true"
          onError={() => setVideoFailed(true)}
        >
          {video.mobileSrc && <source src={video.mobileSrc} media="(max-width: 959px)" />}
          <source src={video.src} />
        </video>
      ) : (
        slides.map((s, i) => (
          <div
            key={s.src}
            className={`intro-slide${i === active ? ' is-active' : ''}${i === previous ? ' is-prev' : ''}`}
            style={{ '--focus': s.focus, '--focus-m': s.mobileFocus } as React.CSSProperties}
            aria-hidden={i === active ? undefined : true}
          >
            <Image
              src={s.src}
              alt={i === active ? s.alt : ''}
              fill
              priority={i === 0}
              sizes="(min-width: 960px) 66vw, 100vw"
            />
          </div>
        ))
      )}
      {(showVideo || count > 1) && (
        <button type="button" className="intro-toggle" onClick={toggle} aria-pressed={!playing} aria-label={playing ? labels.pause : labels.play} title={playing ? labels.pause : labels.play}>
          <Icon name={playing ? 'pause' : 'play'} />
        </button>
      )}
    </div>
  );
}
