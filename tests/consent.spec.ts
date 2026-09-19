import { test, expect, type Page } from '@playwright/test';
import { seed } from './helpers';

// The test build uses the fake GoatCounter code "satori-test". Requests are intercepted, never sent.
function recordAnalytics(page: Page): string[] {
  const hits: string[] = [];
  void page.route('**://*.goatcounter.com/**', (route) => {
    hits.push(route.request().url());
    return route.fulfill({ status: 204, body: '' });
  });
  return hits;
}

test.describe('cookie consent and analytics', () => {
  test('nothing is sent before a choice is made', async ({ page }) => {
    const hits = recordAnalytics(page);
    await page.goto('/');
    await expect(page.getByTestId('cookie-banner')).toBeVisible();
    await page.goto('/#start');
    await page.waitForTimeout(500);
    expect(hits).toEqual([]);
  });

  test('declining sends nothing and hides the banner for good', async ({ page }) => {
    const hits = recordAnalytics(page);
    await page.goto('/');
    await page.getByRole('button', { name: 'Decline' }).click();
    await expect(page.getByTestId('cookie-banner')).toBeHidden();
    await page.reload();
    await expect(page.getByTestId('cookie-banner')).toBeHidden();
    await page.goto('/privacy/');
    await page.waitForTimeout(500);
    expect(hits).toEqual([]);
  });

  test('allowing sends cookieless page counts with no personal answers', async ({ page, context }) => {
    const hits = recordAnalytics(page);
    await seed(page, {
      'satori.profile.v1': {
        destinations: ['JP'],
        field: 'business',
        focus: 'Economics',
        gpaScale: '4',
        gpa: 3.91,
        sat: null,
        englishTest: 'ielts',
        englishScore: 7.5,
        hsk: 0,
        topik: 0,
        teaching: 'english-only',
        budgetUsd: 12345,
        scholarship: 'yes',
        targetYear: 2027,
      },
    });
    await page.goto('/');
    await page.getByRole('button', { name: 'Allow analytics' }).click();
    await expect.poll(() => hits.length).toBeGreaterThan(0);
    await page.goto('/#route');
    await expect.poll(() => hits.some((h) => decodeURIComponent(h).includes('#route'))).toBe(true);
    for (const h of hits) {
      const url = new URL(h);
      expect(url.hostname).toBe('satori-test.goatcounter.com');
      // Answers such as the budget or grades must never appear in analytics.
      expect(h).not.toContain('12345');
      expect(h).not.toContain('3.91');
    }
    expect(await context.cookies()).toEqual([]);
  });

  test('"Privacy choices" in the footer lets people change their mind', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Decline' }).click();
    await page.getByRole('button', { name: 'Privacy choices' }).click();
    await expect(page.getByTestId('cookie-banner')).toBeVisible();
  });
});
