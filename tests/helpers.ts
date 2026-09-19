import type { Page } from '@playwright/test';

export const SAMPLE_PROFILE = {
  destinations: ['HK', 'KR', 'CN'],
  field: 'engineering',
  focus: 'Artificial intelligence',
  gpaScale: '5',
  gpa: 4.7,
  sat: 1450,
  englishTest: 'ielts',
  englishScore: 6.5,
  hsk: 0,
  topik: 0,
  teaching: 'english-only',
  budgetUsd: 15000,
  scholarship: 'yes',
  targetYear: 2027,
};

/** Puts values into localStorage before any page script runs. */
export async function seed(page: Page, values: Record<string, unknown>): Promise<void> {
  await page.addInitScript((entries) => {
    for (const [k, v] of Object.entries(entries)) window.localStorage.setItem(k, JSON.stringify(v));
  }, values);
}

export const DECLINED = { 'satori.consent.v1': { value: 'denied' } };

/** Collects console errors and uncaught exceptions for a page. */
export function watchErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

export const STATIC_PAGES = ['/privacy/', '/terms/', '/refund/', '/credits/'];
