import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { DECLINED, SAMPLE_PROFILE, seed } from './helpers';

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}

test.describe('security and privacy', () => {
  test('pages ship a strict Content Security Policy', async ({ page }) => {
    await page.goto('/');
    const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain('upgrade-insecure-requests');
  });

  test('no secrets in the published files', async () => {
    const files = walk('dist-test').filter((f) => /\.(js|html|css|txt|xml|json)$/.test(f));
    const devCode = fs.existsSync('.dev-access.json') ? JSON.parse(fs.readFileSync('.dev-access.json', 'utf8')).code : null;
    const patterns = [/sk-[A-Za-z0-9]{20,}/, /AKIA[0-9A-Z]{16}/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/, /ghp_[A-Za-z0-9]{30,}/];
    for (const f of files) {
      const text = fs.readFileSync(f, 'utf8');
      if (devCode) expect(text.includes(devCode), `developer code found in ${f}`).toBe(false);
      for (const p of patterns) expect(p.test(text), `${p} in ${f}`).toBe(false);
    }
  });

  test('only our own files load (no third-party scripts, fonts or embeds)', async ({ page, baseURL }) => {
    const external: string[] = [];
    page.on('request', (r) => {
      if (!r.url().startsWith(baseURL!) && !r.url().startsWith('data:')) external.push(r.url());
    });
    await seed(page, { ...DECLINED, 'satori.profile.v1': SAMPLE_PROFILE });
    for (const p of ['/', '/#route', '/privacy/', '/credits/']) {
      await page.goto(p);
      await page.waitForLoadState('networkidle');
    }
    expect(external).toEqual([]);
    await expect(page.locator('iframe')).toHaveCount(0);
  });

  test('links that leave the site open safely', async ({ page, baseURL }) => {
    await seed(page, { ...DECLINED, 'satori.profile.v1': SAMPLE_PROFILE });
    for (const p of ['/#route', '/credits/', '/privacy/']) {
      await page.goto(p);
      const unsafe = await page.$$eval(
        'a[target="_blank"]',
        (as) => as.filter((a) => !(a.getAttribute('rel') ?? '').includes('noopener')).map((a) => (a as HTMLAnchorElement).href),
      );
      expect(unsafe, p).toEqual([]);
      const insecure = await page.$$eval('a[href^="http:"]', (as) => as.map((a) => (a as HTMLAnchorElement).href));
      expect(insecure.filter((h) => !h.startsWith(baseURL!)), p).toEqual([]);
    }
  });

  test('the site sets no cookies', async ({ page, context }) => {
    await seed(page, { 'satori.profile.v1': SAMPLE_PROFILE });
    await page.goto('/');
    await page.getByRole('button', { name: 'Allow analytics' }).click();
    await page.goto('/#route');
    expect(await context.cookies()).toEqual([]);
  });
});
