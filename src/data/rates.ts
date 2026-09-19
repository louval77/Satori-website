/*
 * Currency conversion for rough USD comparisons.
 * Source: European Central Bank euro foreign exchange reference rates, 18 September 2026
 * https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html
 * The ECB publishes rates against the euro, so each USD rate below is derived as (EUR->X) / (EUR->USD).
 */
export type Currency = 'CNY' | 'HKD' | 'KRW' | 'JPY' | 'USD';

const EUR_TO: Record<Currency, number> = {
  USD: 1.146,
  CNY: 7.6755,
  HKD: 8.9903,
  KRW: 1590.76,
  JPY: 180.94,
};

export const RATES_DATE = '18 September 2026';
export const RATES_SOURCE = 'European Central Bank reference rates';
export const RATES_URL =
  'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html';

export function toUsd(amount: number, currency: Currency): number {
  return (amount / EUR_TO[currency]) * EUR_TO.USD;
}

const SYMBOL: Record<Currency, string> = { CNY: 'CNY ', HKD: 'HK$', KRW: 'KRW ', JPY: 'JPY ', USD: '$' };

export function formatMoney(amount: number, currency: Currency): string {
  return `${SYMBOL[currency]}${Math.round(amount).toLocaleString('en-US')}`;
}

export function formatUsd(amount: number): string {
  // Round to the nearest 100 so the conversion never looks more precise than it is.
  return `$${(Math.round(amount / 100) * 100).toLocaleString('en-US')}`;
}
