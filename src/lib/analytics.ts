/*
 * Privacy-friendly analytics with GoatCounter's no-JavaScript pixel.
 * - Nothing is sent unless the visitor clicked "Allow analytics" AND a GoatCounter
 *   code is set in src/config.ts.
 * - No cookies, no third-party script: only an image request to <code>.goatcounter.com.
 * - We send the page path, title, referrer and screen size. Questionnaire answers are never sent.
 * - GoatCounter says it does not store IP addresses or the full User-Agent (goatcounter.com/help/privacy).
 */
import { ANALYTICS } from '../config';
import { getConsent } from './consent';

function enabled(): boolean {
  // The code becomes part of a web address, so only letters, digits and dashes are accepted.
  return /^[a-z0-9-]{2,50}$/.test(ANALYTICS.goatcounterCode) && getConsent() === 'granted';
}

function ping(params: Record<string, string>): void {
  if (!enabled()) return;
  const url = new URL(`https://${ANALYTICS.goatcounterCode}.goatcounter.com/count`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  url.searchParams.set('s', `${window.screen.width},${window.screen.height},${window.devicePixelRatio || 1}`);
  // Automated browsers (for example our Playwright tests) are flagged so GoatCounter ignores them.
  if (navigator.webdriver) url.searchParams.set('b', '153');
  url.searchParams.set('rnd', Math.random().toString(36).slice(2));
  const img = new Image();
  img.referrerPolicy = 'no-referrer-when-downgrade';
  img.src = url.toString();
}

export function trackPageview(): void {
  ping({ p: window.location.pathname + window.location.hash, t: document.title, r: document.referrer });
}

/** Named events, for example "cta-build-route". Never include personal data in the name. */
export function trackEvent(name: string): void {
  ping({ p: name, t: name, e: 'true' });
}
