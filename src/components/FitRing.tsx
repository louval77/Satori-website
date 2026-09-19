import { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface FitRingProps {
  score: number;
  size?: number;
  label?: string;
}

/** Circular fit forecast. The number is always shown as text too, so colour is never the only signal. */
export function FitRing({ score, size = 96, label = 'fit' }: FitRingProps) {
  const reduce = useReducedMotion();
  const gradId = `fit-grad-${useId().replace(/:/g, '')}`;
  const stroke = Math.max(6, Math.round(size / 12));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(255 240 220 / 0.1)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: reduce ? c * (1 - pct) : c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: reduce ? 0 : 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFE08A" />
            <stop offset="1" stopColor="var(--accent-a)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold leading-none text-ink" style={{ fontSize: size * 0.3 }}>
          {Math.round(score)}
          <span style={{ fontSize: size * 0.15 }}>%</span>
        </span>
        <span className="mt-0.5 text-[11px] font-semibold text-dusk">{label}</span>
      </div>
    </div>
  );
}
