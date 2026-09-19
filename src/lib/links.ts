/*
 * Builds internal links that work both locally ("/") and on GitHub Pages
 * ("/<repository-name>/"). Always use these helpers instead of hard-coded paths.
 */
export const BASE = import.meta.env.BASE_URL;

export const PAGES = {
  home: BASE,
  start: `${BASE}#start`,
  route: `${BASE}#route`,
  pricing: `${BASE}#pricing`,
  privacy: `${BASE}privacy/`,
  terms: `${BASE}terms/`,
  refund: `${BASE}refund/`,
  credits: `${BASE}credits/`,
} as const;

export function imageUrl(photoId: string, variant: 'rail' | 'wide' | 'sm'): string {
  return `${BASE}images/${photoId}-${variant}.webp`;
}

/** Props for links that leave the site: new tab, no referrer leakage, no window.opener access. */
export const EXTERNAL = { target: '_blank', rel: 'noopener noreferrer' } as const;
