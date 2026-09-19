import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { DECLINED, SAMPLE_PROFILE, STATIC_PAGES, seed } from './helpers';

// WCAG 2.2 A and AA rules, checked by axe-core.
async function scan(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  return results.violations.map((v) => `${v.id} (${v.impact}): ${v.help} -> ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
}

test.describe('accessibility (axe-core)', () => {
  test.use({ reducedMotion: 'reduce' });

  test('landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('cookie-banner')).toBeVisible();
    expect(await scan(page)).toEqual([]);
  });

  test('questionnaire steps', async ({ page }) => {
    await seed(page, DECLINED);
    await page.goto('/#start');
    expect(await scan(page)).toEqual([]);
    await page.getByRole('button', { name: /Continue/ }).click(); // show an error state too
    expect(await scan(page)).toEqual([]);
  });

  test('dashboard', async ({ page }) => {
    await seed(page, { ...DECLINED, 'satori.profile.v1': SAMPLE_PROFILE });
    await page.goto('/#route');
    await expect(page.getByTestId('match-card').first()).toBeVisible();
    expect(await scan(page)).toEqual([]);
  });

  for (const path of [...STATIC_PAGES, '/this-page-does-not-exist']) {
    test(`page ${path}`, async ({ page }) => {
      await seed(page, DECLINED);
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(await scan(page)).toEqual([]);
    });
  }

  test('every image has an alt attribute', async ({ page }) => {
    await seed(page, { ...DECLINED, 'satori.profile.v1': SAMPLE_PROFILE });
    for (const path of ['/', '/#route', '/credits/']) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const missing = await page.locator('img:not([alt])').count();
      expect(missing, `images without alt on ${path}`).toBe(0);
    }
  });

  test('buttons and links all have an accessible name', async ({ page }) => {
    await seed(page, { ...DECLINED, 'satori.profile.v1': SAMPLE_PROFILE });
    await page.goto('/#route');
    const unnamed = await page.evaluate(() =>
      [...document.querySelectorAll('button, a[href]')]
        .filter((el) => !(el.textContent ?? '').trim() && !el.getAttribute('aria-label'))
        .map((el) => el.outerHTML.slice(0, 80)),
    );
    expect(unnamed).toEqual([]);
  });
});
