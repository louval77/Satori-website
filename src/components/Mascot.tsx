import { useId } from 'react';
import { AnimatePresence, motion, useReducedMotion, type TargetAndTransition, type Transition } from 'motion/react';

export type MascotMood = 'idle' | 'happy' | 'think' | 'cheer' | 'oops';

interface MascotProps {
  message: string;
  mood?: MascotMood;
  /** Change this number to make Tori bounce (for example after each answer). */
  pulse?: number;
  layout?: 'stack' | 'inline';
}

const EASE = [0.45, 0, 0.55, 1] as const;

/**
 * Tori, the onboarding guide: an original vector character drawn for this project
 * (a small bird in a graduation cap; "tori" means bird in Japanese).
 */
function ToriSvg({ mood }: { mood: MascotMood }) {
  const reduce = useReducedMotion();
  const happyEyes = mood === 'happy' || mood === 'cheer';
  const uid = useId().replace(/:/g, '');
  const bodyId = `tori-body-${uid}`;
  const wingId = `tori-wing-${uid}`;
  const loop = (animate: TargetAndTransition, duration: number, delay = 0): { animate?: TargetAndTransition; transition?: Transition } =>
    reduce ? {} : { animate, transition: { duration, repeat: Infinity, ease: EASE, delay } };

  return (
    <svg viewBox="0 0 200 220" className="h-full w-full overflow-visible" role="img" aria-label="Tori, a friendly bird mascot wearing a graduation cap">
      <defs>
        <linearGradient id={bodyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE08A" />
          <stop offset="1" stopColor="#F4A11E" />
        </linearGradient>
        <linearGradient id={wingId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F7B23B" />
          <stop offset="1" stopColor="#E08A12" />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="209" rx="48" ry="7" fill="#0a0205" opacity="0.45" />
      <ellipse cx="82" cy="199" rx="12" ry="6" fill="#FF8A5B" />
      <ellipse cx="118" cy="199" rx="12" ry="6" fill="#FF8A5B" />

      {/* Wings */}
      <motion.path
        d="M42 118 C 20 126 16 162 34 176 C 46 164 52 140 42 118 Z"
        fill={`url(#${wingId})`}
        style={{ transformBox: 'fill-box', transformOrigin: '80% 10%' }}
        {...(mood === 'cheer' ? loop({ rotate: [0, -22, 0] }, 0.5) : loop({ rotate: [0, -4, 0] }, 3.2))}
      />
      <motion.path
        d="M158 118 C 180 126 184 162 166 176 C 154 164 148 140 158 118 Z"
        fill={`url(#${wingId})`}
        style={{ transformBox: 'fill-box', transformOrigin: '20% 10%' }}
        {...(mood === 'cheer' ? loop({ rotate: [0, 22, 0] }, 0.5, 0.08) : loop({ rotate: [0, 4, 0] }, 3.2, 0.2))}
      />

      {/* Body and belly */}
      <path d="M100 56 C 148 56 168 100 168 140 C 168 180 138 204 100 204 C 62 204 32 180 32 140 C 32 100 52 56 100 56 Z" fill={`url(#${bodyId})`} />
      <ellipse cx="100" cy="160" rx="42" ry="36" fill="#FFF3D1" />
      <path d="M78 150 q6 6 12 0 M94 150 q6 6 12 0 M110 150 q6 6 12 0 M86 164 q6 6 12 0 M102 164 q6 6 12 0" fill="none" stroke="#F2C66B" strokeWidth="2.2" strokeLinecap="round" />

      {/* Face */}
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        {...(mood === 'think' ? loop({ rotate: [0, -5, 4, 0] }, 2.4) : {})}
      >
        <ellipse cx="62" cy="134" rx="10" ry="6" fill="var(--accent-b)" opacity="0.5" />
        <ellipse cx="138" cy="134" rx="10" ry="6" fill="var(--accent-b)" opacity="0.5" />
        {happyEyes ? (
          <g fill="none" stroke="#2A0716" strokeWidth="5" strokeLinecap="round">
            <path d="M65 116 Q78 102 91 116" />
            <path d="M109 116 Q122 102 135 116" />
          </g>
        ) : (
          <motion.g
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            {...(reduce ? {} : { animate: { scaleY: [1, 1, 0.1, 1] }, transition: { duration: 4.2, times: [0, 0.9, 0.95, 1], repeat: Infinity } })}
          >
            <circle cx="78" cy="112" r="16" fill="#FFFDF7" />
            <circle cx="122" cy="112" r="16" fill="#FFFDF7" />
            <circle cx={mood === 'think' ? 75 : 80} cy={mood === 'think' ? 108 : 114} r="7.5" fill="#2A0716" />
            <circle cx={mood === 'think' ? 119 : 124} cy={mood === 'think' ? 108 : 114} r="7.5" fill="#2A0716" />
            <circle cx={mood === 'think' ? 78 : 83} cy={mood === 'think' ? 105 : 110} r="2.6" fill="#fff" />
            <circle cx={mood === 'think' ? 122 : 127} cy={mood === 'think' ? 105 : 110} r="2.6" fill="#fff" />
          </motion.g>
        )}
        <path d="M91 128 L100 141 L109 128 Q100 123 91 128 Z" fill="#FF7A45" />
        {mood === 'oops' && <path d="M150 88 q6 10 0 14 q-6 -4 0 -14 Z" fill="#9FD8FF" opacity="0.9" />}
      </motion.g>

      {/* Graduation cap */}
      <path d="M72 56 L72 72 Q100 86 128 72 L128 56 Q100 70 72 56 Z" fill="#4A0A23" />
      <path d="M100 32 L152 49 L100 66 L48 49 Z" fill="#5B0E2D" stroke="#FFC940" strokeWidth="2" strokeLinejoin="round" />
      <motion.g
        style={{ transformBox: 'fill-box', transformOrigin: '100% 0%' }}
        {...loop({ rotate: [-6, 8, -6] }, 2.8)}
      >
        <path d="M100 49 Q124 50 143 55 L143 80" fill="none" stroke="#FFC940" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="138.5" y="78" width="9" height="15" rx="3.5" fill="#FFC940" />
      </motion.g>
      <circle cx="100" cy="49" r="4" fill="#FFC940" />
    </svg>
  );
}

export function Mascot({ message, mood = 'idle', pulse = 0, layout = 'stack' }: MascotProps) {
  const reduce = useReducedMotion();
  const bubble = (
    <div className={`glass glass-accent relative rounded-3xl px-4 py-3 ${layout === 'stack' ? 'w-full' : 'min-w-0 flex-1'}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={message}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="text-[15px] font-semibold leading-snug text-ink"
          aria-hidden="true"
        >
          {message}
        </motion.p>
      </AnimatePresence>
      {/* Speech bubble tail */}
      <span
        aria-hidden="true"
        className={`absolute h-4 w-4 rotate-45 border-white/10 bg-wine-600/80 ${
          layout === 'stack' ? '-bottom-2 left-1/2 -ml-2 border-b border-r' : 'top-1/2 -left-2 -mt-2 border-b border-l'
        }`}
      />
      <p className="sr-only" role="status" aria-live="polite">
        {message}
      </p>
    </div>
  );

  const character = (
    <motion.div
      className={layout === 'stack' ? 'mx-auto h-44 w-40' : 'h-20 w-[72px] shrink-0'}
      {...(reduce ? {} : { animate: { y: [0, -8, 0] }, transition: { duration: 3.4, repeat: Infinity, ease: EASE } })}
    >
      <motion.div
        key={pulse}
        className="h-full w-full"
        initial={reduce || pulse === 0 ? false : { scale: 0.88, rotate: -6 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 11 }}
      >
        <ToriSvg mood={mood} />
      </motion.div>
    </motion.div>
  );

  return layout === 'stack' ? (
    <div className="flex flex-col items-center gap-5" data-testid="mascot">
      {bubble}
      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-x-2 bottom-4 top-10 -z-10 rounded-full blur-2xl"
          style={{ background: 'color-mix(in oklab, var(--accent-b) 35%, transparent)' }}
        />
        {character}
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-3" data-testid="mascot">
      {character}
      {bubble}
    </div>
  );
}
