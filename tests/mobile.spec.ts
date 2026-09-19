import { test, expect } from '@playwright/test';
import { DECLINED, SAMPLE_PROFILE, STATIC_PAGES, seed } from './helpers';

test.describe('layout and speed', () => {
  for (const path of ['/', '/#start', '/#route', ...STATIC_PAGES]) {
    test(`no sideways scrolling on ${path}`, async ({ page }) => {
      await seed(page, { ...DECLINED, 'satori.profile.v1': SAMPLE_PROFILE });
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });
  }

  test('tap targets in the questionnaire are at least 24px', async ({ page }) => {
    await seed(page, DECLINED);
    await page.goto('/#start');
    const small = await page.$$eval('form button, form a[href], form label:has(input)', (els) =>
      els
        .map((el) => ({ el: el.textContent?.trim().slice(0, 30), r: el.getBoundingClientRect() }))
        .filter(({ r }) => r.width > 0 && r.height > 0 && (r.width < 24 || r.height < 24))
        .map(({ el }) => el),
    );
    expect(small).toEqual([]);
  });

  test('landing page loads fast and stays small', async ({ page }) => {
    await seed(page, DECLINED);
    let bytes = 0;
    page.on('response', async (res) => {
      const len = Number(res.headers()['content-length'] ?? 0);
      if (len) bytes += len;
      else {
        try {
          bytes += (await res.body()).length;
        } catch {
          /* ignore */
        }
      }
    });
    await page.goto('/');
    const lcp = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let value = 0;
          new PerformanceObserver((list) => {
            for (const e of list.getEntries()) value = e.startTime;
          }).observe({ type: 'largest-contentful-paint', buffered: true });
          setTimeout(() => resolve(value), 2500);
        }),
    );
    await page.waitForLoadState('networkidle');
    const cls = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let total = 0;
          new PerformanceObserver((list) => {
            for (const e of list.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) if (!e.hadRecentInput) total += e.value;
          }).observe({ type: 'layout-shift', buffered: true });
          setTimeout(() => resolve(total), 500);
        }),
    );
    console.log(`LCP ${Math.round(lcp)} ms, CLS ${cls.toFixed(3)}, transferred ${(bytes / 1024).toFixed(0)} KB`);
    expect(lcp).toBeLessThan(2500);
    expect(cls).toBeLessThan(0.1);
    expect(bytes).toBeLessThan(1_500_000);
  });
});
