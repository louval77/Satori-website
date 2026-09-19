/*
 * Safe wrappers around localStorage. Storage can be blocked (private mode,
 * strict browser settings), so every call is guarded and the site keeps working
 * without it. Nothing stored here ever leaves the visitor's browser.
 */
export const KEYS = {
  profile: 'satori.profile.v1',
  checklist: 'satori.checklist.v1',
  destination: 'satori.destination.v1',
  consent: 'satori.consent.v1',
  plan: 'satori.plan.v1',
  devLock: 'satori.devlock.v1',
} as const;

export function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable: the page still works for this visit.
  }
}

export function removeKey(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/** Removes everything this site has stored in the browser. */
export function clearAllSiteData(): void {
  Object.values(KEYS).forEach(removeKey);
}
