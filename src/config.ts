/*
 * Site-wide settings. This is the one file to edit for names, contact details,
 * prices and analytics. Everything here is public (it ships to every visitor),
 * so never put passwords or API keys in this file.
 */

export const SITE = {
  name: 'SATORI',
  product: 'Personal Admission Route',
  team: 'SATORI',
  country: 'Kazakhstan',
  contactEmail: 'alimzhanaxmetov83@gmail.com',
  // Shown on the legal pages. Update if the team registers a company.
  legalStatus: 'a student hackathon team (not a registered company)',
  lastUpdated: '19 September 2026',
  dataCheckedOn: '19 September 2026',
} as const;

export const PRICING = {
  currency: 'USD',
  monthly: 29,
  yearly: 119,
  freeMatches: 3,
  // Payments are not connected. The pricing is shown as planned prices only.
  paymentsEnabled: false,
} as const;

/*
 * Analytics: GoatCounter (free for non-commercial use, no cookies).
 * 1. Create an account at https://www.goatcounter.com/signup
 * 2. Pick a code, for example "satori-route" (your dashboard becomes satori-route.goatcounter.com)
 * 3. Put that code between the quotes on the next line and publish again.
 * While the code is empty, no analytics requests are ever sent.
 */
const GOATCOUNTER_CODE = '';

export const ANALYTICS = {
  // The automated tests supply a fake code through VITE_GOATCOUNTER_CODE instead.
  goatcounterCode: GOATCOUNTER_CODE || String(import.meta.env.VITE_GOATCOUNTER_CODE ?? ''),
} as const;

/*
 * Developer access unlocks Pro on this device without payment.
 * Only a salted SHA-256 fingerprint is stored here; the code itself is kept
 * in DEVELOPER-ACCESS.txt on the developer's computer (not uploaded to GitHub).
 * This is a demo convenience, not real security: see README "How Pro access works".
 */
export const DEV_ACCESS = {
  salt: 'e87042125709f4bb3d8d2cbc9447d18b',
  sha256: 'f1d0a51b3a6ff6ec2c004fe86d95a084a11363bde1b396444964ea0ef42d8363',
  maxAttempts: 5,
  lockoutSeconds: 60,
} as const;
