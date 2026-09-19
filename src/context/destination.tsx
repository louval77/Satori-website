import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DESTINATIONS, DESTINATION_ORDER, type DestinationId } from '../data/destinations';
import { KEYS, readJson, writeJson } from '../lib/storage';

interface DestinationState {
  dest: DestinationId;
  setDest: (d: DestinationId) => void;
}

const Ctx = createContext<DestinationState | null>(null);

function initialDestination(): DestinationId {
  const saved = readJson<DestinationId>(KEYS.destination);
  return saved && DESTINATION_ORDER.includes(saved) ? saved : 'CN';
}

export function DestinationProvider({ children }: { children: ReactNode }) {
  const [dest, setDestState] = useState<DestinationId>(initialDestination);

  useEffect(() => {
    const { a, b } = DESTINATIONS[dest].accent;
    const root = document.documentElement;
    root.style.setProperty('--accent-a', a);
    root.style.setProperty('--accent-b', b);
    root.dataset.dest = dest;
  }, [dest]);

  const setDest = useCallback((d: DestinationId) => {
    setDestState(d);
    writeJson(KEYS.destination, d);
  }, []);

  const value = useMemo(() => ({ dest, setDest }), [dest, setDest]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDestination(): DestinationState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useDestination must be used inside DestinationProvider');
  return v;
}
