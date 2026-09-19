import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useDestination } from '../context/destination';
import { DESTINATIONS } from '../data/destinations';
import credits from '../data/photo-credits.json';
import { imageUrl } from '../lib/links';
import { useMediaQuery } from '../lib/useMediaQuery';

const ALT = Object.fromEntries(credits.map((c) => [c.id, c.alt]));

function Rail({ side, photoId }: { side: 'left' | 'right'; photoId: string }) {
  const reduce = useReducedMotion();
  const offset = side === 'left' ? -36 : 36;
  return (
    <div
      className={`absolute inset-y-0 ${side === 'left' ? 'left-0' : 'right-0'} overflow-hidden`}
      style={{
        width: 'clamp(180px, calc((100vw - 1120px) / 2 + 110px), 560px)',
        maskImage: `linear-gradient(to ${side === 'left' ? 'right' : 'left'}, black 30%, transparent 96%)`,
        WebkitMaskImage: `linear-gradient(to ${side === 'left' ? 'right' : 'left'}, black 30%, transparent 96%)`,
      }}
    >
      <AnimatePresence initial={false}>
        <motion.img
          key={photoId}
          src={imageUrl(photoId, 'rail')}
          alt={ALT[photoId] ?? ''}
          width={640}
          height={1100}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: offset, scale: 1.06 }}
          animate={{ opacity: 0.62, x: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: -offset / 2, scale: 1.02 }}
          transition={{ duration: reduce ? 0.2 : 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </AnimatePresence>
      {/* Wine and accent tint so the photos sit inside the brand palette and text stays readable. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgb(31 6 17 / 0.35), rgb(31 6 17 / 0.1) 40%, rgb(20 4 11 / 0.75)), linear-gradient(0deg, color-mix(in oklab, var(--accent-b) 14%, transparent), transparent)',
        }}
      />
    </div>
  );
}

/** Atmospheric photos of the selected destination in the left and right page margins (wide screens only). */
export function SideRails() {
  const { dest } = useDestination();
  // Rails only exist on wide screens, so phones and tablets never download these photos.
  const wide = useMediaQuery('(min-width: 1280px)');
  const d = DESTINATIONS[dest];
  if (!wide) return null;
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" data-testid="side-rails">
      <Rail side="left" photoId={d.photos.left} />
      <Rail side="right" photoId={d.photos.right} />
    </div>
  );
}
