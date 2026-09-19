import { motion } from 'motion/react';
import { useId } from 'react';
import { useDestination } from '../context/destination';
import { DESTINATIONS, DESTINATION_ORDER } from '../data/destinations';
import { Flag } from './Flag';

/**
 * Destination switcher built from native radio buttons, so arrow keys, Tab and
 * screen readers work without extra code. The gold pill slides with a shared layout animation.
 */
export function DestinationSwitcher({ compact = false }: { compact?: boolean }) {
  const { dest, setDest } = useDestination();
  const name = useId();
  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">Destination for photos and colours</legend>
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-wine-950/50 p-1">
        {DESTINATION_ORDER.map((id) => {
          const d = DESTINATIONS[id];
          const active = id === dest;
          return (
            <label
              key={id}
              className={`relative flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full py-1.5 font-semibold transition-colors ${compact ? 'px-2 text-[13px]' : 'px-2.5 text-sm'} ${
                active ? 'text-wine-900' : 'text-mist hover:text-ink'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={id}
                checked={active}
                onChange={() => setDest(id)}
                className="peer sr-only"
              />
              {active && (
                <motion.span
                  layoutId={`dest-pill-${compact ? 'c' : 'f'}`}
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'linear-gradient(180deg, #ffe08a, var(--accent-a))' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="pointer-events-none absolute inset-0 rounded-full peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold" />
              <span className="relative flex items-center gap-1.5">
                <Flag id={id} className={`h-3.5 w-[18px] ${compact ? 'max-[430px]:hidden' : ''}`} />
                <span>{d.short}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
