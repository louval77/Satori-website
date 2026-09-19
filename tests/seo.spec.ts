import { test, expect } from '@playwright/test';
import { STATIC_PAGES } from './helpers';

const INDEXABLE = ['/', ...STATIC_PAGES];

test.describe('SEO and site files', () => {
  for (const path of INDEXABLE) {
    test(`meta tags on ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(/SATORI/);
      const title = await page.title();
      expect(title.length).toBeLessThanOrEqual(60);
      const desc = await page.locator('meta[name="description"]').getAttribute('content');
      expect(desc?.length ?? 0).toBeGreaterThan(50);
      expect(desc?.length ?? 0).toBeLessThanOrEqual(160);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`${path.replace(/\//g, '\\/')}$`));
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og-image\.jpg$/);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveCount(1);
    });
  }

  test('favicon, touch icon and social image are served', async ({ request }) => {
    for (const file of ['/favicon.svg', '/favicon-32.png', '/apple-touch-icon.png', '/og-image.jpg']) {
      const res = await request.get(file);
      expect(res.status(), file).toBe(200);
    }
    const og = await request.get('/og-image.jpg');
    expect((await og.body()).length).toBeLessThan(200_000);
  });

  test('robots.txt points to the sitemap and every sitemap URL exists', async ({ request, baseURL }) => {
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).toContain('Sitemap:');
    const sitemap = await (await request.get('/sitemap.xml')).text();
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
    expect(locs.length).toBe(INDEXABLE.length);
    for (const loc of locs) {
      const path = new URL(loc).pathname;
      const res = await request.get(new URL(path, baseURL).toString());
      expect(res.status(), loc).toBe(200);
    }
  });

  test('unknown pages show the custom 404 page with status 404', async ({ page }) => {
    const res = await page.goto('/no/such/page');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    await page.getByRole('link', { name: /Back to the homepage/ }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Your admission route');
  });
});
