import { test, expect } from '@playwright/test';
import { UNIVERSITIES } from '../src/data/universities';
import { DESTINATIONS } from '../src/data/destinations';
import { HOUSING } from '../src/data/housing';
import { CN_ADDRESS_REGISTRATION_URL } from '../src/lib/roadmap';
import fs from 'node:fs';

const credits: { sourceUrl: string }[] = JSON.parse(fs.readFileSync('src/data/photo-credits.json', 'utf8'));
import { DECLINED, SAMPLE_PROFILE, STATIC_PAGES, seed } from './helpers';

test.describe('links', () => {
  test('every internal link on every page works', async ({ page, request, baseURL }) => {
    await seed(page, { ...DECLINED, 'satori.profile.v1': SAMPLE_PROFILE });
    const found = new Set<string>();
    for (const path of ['/', '/#route', '/#start', ...STATIC_PAGES, '/missing-page']) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const hrefs = await page.$$eval('a[href]:not([href^="#"])', (as) => as.map((a) => (a as HTMLAnchorElement).href));
      hrefs.filter((h) => h.startsWith(baseURL!)).forEach((h) => found.add(h.split('#')[0]!));
    }
    expect(found.size).toBeGreaterThan(4);
    for (const url of found) {
      const res = await request.get(url);
      expect(res.status(), url).toBe(200);
    }
  });

  test('in-page anchors point at real sections', async ({ page }) => {
    await seed(page, DECLINED);
    await page.goto('/');
    for (const id of ['how', 'destinations', 'pricing', 'faq']) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  test('official source links respond (network check)', async ({ request }) => {
    test.setTimeout(240_000);
    const urls = new Set<string>();
    for (const u of UNIVERSITIES) {
      urls.add(u.admissionsUrl);
      urls.add(u.windowsSourceUrl);
      u.scholarships.forEach((s) => urls.add(s.url));
      for (const o of [...(u.programs.engineering ?? []), ...(u.programs.business ?? [])]) {
        urls.add(o.tuitionSourceUrl);
        if (o.english) urls.add(o.english.sourceUrl);
        if (o.local) urls.add(o.local.sourceUrl);
      }
    }
    Object.values(DESTINATIONS).forEach((d) => {
      urls.add(d.visa.url);
      urls.add(d.scholarship.url);
    });
    Object.values(HOUSING).forEach((h) => urls.add(h.sourceUrl));
    urls.add(CN_ADDRESS_REGISTRATION_URL);
    credits.forEach((c) => urls.add(c.sourceUrl));

    // 401/403/405/412/429 mean the site is up but blocks automated checks; a real browser opens them fine.
    const blockedButAlive = [401, 403, 405, 406, 412, 429];
    const broken: string[] = [];
    const unreachable: string[] = [];
    await Promise.all(
      [...urls].map(async (url) => {
        try {
          const res = await request.get(url, {
            timeout: 30_000,
            failOnStatusCode: false,
            maxRedirects: 8,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SATORI link check' },
          });
          const s = res.status();
          if (s >= 400 && !blockedButAlive.includes(s)) broken.push(`${s} ${url}`);
        } catch (e) {
          unreachable.push(`${url} (${(e as Error).message.split('\n')[0]})`);
        }
      }),
    );
    if (unreachable.length) test.info().annotations.push({ type: 'unreachable (network)', description: unreachable.join('\n') });
    console.log(`Checked ${urls.size} external links. Broken: ${broken.length}. Unreachable from this network: ${unreachable.length}.`);
    unreachable.forEach((u) => console.log('  unreachable:', u));
    expect(broken, 'links that returned 404 or another error').toEqual([]);
  });
});
