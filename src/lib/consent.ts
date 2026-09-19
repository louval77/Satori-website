/*
 * Consent for optional analytics. The site sets no cookies at all; this choice
 * only decides whether anonymous page counts are sent to GoatCounter.
 */
import { useSyncExternalStore } from 'react';
import { KEYS, readJson, writeJson } from './storage';

export type ConsentValue = 'granted' | 'denied' | null;

const listeners = new Set<() => void>();
let cached: ConsentValue | undefined;

export function getConsent(): ConsentValue {
  if (cached === undefined) {
    const stored = readJson<{ value: ConsentValue }>(KEYS.consent);
    cached = stored?.value === 'granted' || stored?.value === 'denied' ? stored.value : null;
  }
  return cached;
}

export function setConsent(value: Exclude<ConsentValue, null>): void {
  cached = value;
  writeJson(KEYS.consent, { value, at: new Date().toISOString() });
  listeners.forEach((l) => l());
}

/** Clears the saved choice so the banner shows again ("Privacy choices" in the footer). */
export function resetConsent(): void {
  cached = null;
  listeners.forEach((l) => l());
}

export function useConsent(): ConsentValue {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    getConsent,
    () => null,
  );
}
