import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useDestination } from '../context/destination';
import { DESTINATIONS } from '../data/destinations';
import credits from '../data/photo-credits.json';
import { imageUrl, PAGES } from '../lib/links';
import { trackEvent } from '../lib/analytics';

const CAPTION: Record<string, string> = {
  'cn-tsinghua-old-gate': 'Old Gate, Tsinghua University, Beijing',
  'hk-hku-main-building': 'Main Building, The University of Hong Kong',
  'kr-yonsei-underwood-hall': 'Underwood Hall, Yonsei University, Seoul',
  'jp-kyoto-clock-tower': 'Clock Tower, Kyoto University',
};
const ALT = Object.fromEntries(credits.map((c) => [c.id, c.alt]));

// The route drawn over the photo: four stops from documents to arrival.
const ROUTE = 'M 40 296 C 110 270 90 205 170 192 S 280 152 250 98 S 330 36 372 46';
const STOPS = [
  { x: 40, y: 296 },
  { x: 170, y: 192 },
  { x: 250, y: 98 },
  { x: 372, y: 46 },
];

export function Hero() {
  const { dest } = useDestination();
  const reduce = useReducedMotion();
  const d = DESTINATIONS[dest];
  const photo = d.photos.hero;

  return (
    <section className="mx-auto grid max-w-[1120px] items-center gap-10 px-4 pt-10 pb-16 sm:px-6 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-20">
      <motion.div
        initial={reduce ? false : { y: 14 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]">
          Your admission route to <span style={{ color: 'var(--accent-a)' }}>East Asia</span>, step by step
        </h1>
        <p className="mt-5 max-w-[34rem] text-lg leading-relaxed text-mist">
          Answer five short questions. Get matched universities, real deadlines and a checklist for China, Hong Kong, Korea or
          Japan.
        </p>
        <div className="mt-8">
          <a href={PAGES.start} className="btn-primary px-7 py-3.5 text-base" onClick={() => trackEvent('cta-hero')}>
            Build my route
            <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
          </a>
        </div>
      </motion.div>

      <motion.figure
        className="relative"
        initial={reduce ? false : { scale: 0.98 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="glass glass-accent relative aspect-[4/3.4] overflow-hidden rounded-3xl p-2">
          <div className="relative h-full w-full overflow-hidden rounded-[18px]">
            <AnimatePresence initial={false}>
              <motion.img
                key={photo}
                src={imageUrl(photo, 'wide')}
                srcSet={`${imageUrl(photo, 'sm')} 720w, ${imageUrl(photo, 'wide')} 1400w`}
                sizes="(min-width: 1024px) 520px, 92vw"
                alt={ALT[photo] ?? ''}
                width={1400}
                height={933}
                {...({ fetchpriority: 'high' } as Record<string, string>)}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, scale: reduce ? 1 : 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0.2 : 1, ease: [0.16, 1, 0.3, 1] }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-wine-950/85 via-wine-950/10 to-transparent" />
            <svg viewBox="0 0 400 340" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <path d={ROUTE} fill="none" stroke="rgb(255 240 220 / 0.35)" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 8" />
              <motion.path
                key={`route-${dest}`}
                d={ROUTE}
                fill="none"
                stroke="var(--accent-a)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: reduce ? 1 : 0, opacity: 0.9 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduce ? 0 : 1.8, ease: 'easeInOut', delay: 0.3 }}
              />
              {STOPS.map((s, i) => (
                <motion.circle
                  key={`${dest}-${i}`}
                  cx={s.x}
                  cy={s.y}
                  r={i === STOPS.length - 1 ? 9 : 6}
                  fill={i === STOPS.length - 1 ? '#FFC940' : 'var(--accent-a)'}
                  stroke="#1f0611"
                  strokeWidth="3"
                  initial={reduce ? false : { scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.35, type: 'spring', stiffness: 300, damping: 16 }}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                />
              ))}
            </svg>
          </div>
        </div>
        <figcaption className="mt-3 flex items-center justify-between gap-3 px-1 text-sm text-dusk">
          <span>{CAPTION[photo]}</span>
          <a href={PAGES.credits} className="shrink-0 underline-offset-2 hover:text-mist hover:underline">
            Photo credit
          </a>
        </figcaption>
      </motion.figure>
    </section>
  );
}
