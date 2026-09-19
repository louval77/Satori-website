import { test, expect } from '@playwright/test';
import { UNIVERSITIES } from '../src/data/universities';
import { HOUSING } from '../src/data/housing';
import { DECLINED, SAMPLE_PROFILE, seed, watchErrors } from './helpers';

test('every university has official housing facts', () => {
  for (const u of UNIVERSITIES) {
    const h = HOUSING[u.id];
    expect(h, u.id).toBeDefined();
    expect(h!.sourceUrl, u.id).toMatch(/^https:\/\//);
    expect(h!.summary.length, u.id).toBeGreaterThan(0);
  }
  expect(Object.keys(HOUSING).sort()).toEqual(UNIVERSITIES.map((u) => u.id).sort());
});

test.describe('landing page', () => {
  test('loads without errors and has one clear call to action', async ({ page }) => {
    const errors = watchErrors(page);
    await seed(page, DECLINED);
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Your admission route');
    // Only one gold (primary) button above the fold.
    const primaryInHero = page.locator('main section').first().locator('.btn-primary');
    await expect(primaryInHero).toHaveCount(1);
    await expect(primaryInHero).toHaveText(/Build my route/);
    expect(errors).toEqual([]);
  });

  test('destination switcher changes the photos and accent colours', async ({ page }) => {
    await seed(page, DECLINED);
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-dest', 'CN');
    await page.locator('header label:visible', { hasText: 'Japan' }).first().click();
    await expect(html).toHaveAttribute('data-dest', 'JP');
    await expect(page.locator('figure img').first()).toHaveAttribute('src', /jp-kyoto-clock-tower/);
    const accent = await page.evaluate(() => document.documentElement.style.getPropertyValue('--accent-a'));
    expect(accent.toLowerCase()).toBe('#ffb3c6');
  });
});

test.describe('questionnaire', () => {
  test('validates every step and builds a roadmap', async ({ page }) => {
    const errors = watchErrors(page);
    await seed(page, DECLINED);
    await page.goto('/#start');

    // Step 1: nothing chosen yet.
    await page.getByRole('button', { name: /Continue/ }).click();
    await expect(page.getByText('Choose at least one destination.')).toBeVisible();
    await page.getByText('Hong Kong SAR', { exact: true }).click();
    await page.getByText('South Korea', { exact: true }).click();
    await page.getByRole('button', { name: /Continue/ }).click();

    // Step 2: field and focus are required.
    await expect(page.getByRole('heading', { name: 'What do you want to study?' })).toBeVisible();
    await page.getByRole('button', { name: /Continue/ }).click();
    await expect(page.getByText('Choose Engineering & CS or Business & Finance.')).toBeVisible();
    await page.getByText('Business & Finance', { exact: true }).click();
    await page.getByText('Economics', { exact: true }).click();
    await page.getByRole('button', { name: /Continue/ }).click();

    // Step 3: grade must be in range, SAT must be a real SAT total, English score in range.
    await expect(page.getByRole('heading', { name: 'Your grades and tests' })).toBeVisible();
    await page.getByLabel('Average grade').fill('7');
    await page.getByLabel('SAT total').fill('1455');
    await page.getByLabel('English test').selectOption('ielts');
    await page.getByLabel('English score').fill('9.5');
    await page.getByRole('button', { name: /Continue/ }).click();
    await expect(page.getByText(/must be between 1 and 5/)).toBeVisible();
    await expect(page.getByText(/SAT totals run from 400 to 1600/)).toBeVisible();
    await expect(page.getByText(/enter a value from 0 to 9/)).toBeVisible();
    await expect(page.getByLabel('Average grade')).toBeFocused();
    await expect(page.getByLabel('Average grade')).toHaveAttribute('aria-invalid', 'true');
    await page.getByLabel('Average grade').fill('4,6');
    await page.getByLabel('SAT total').fill('1450');
    await page.getByLabel('English score').fill('7');
    await page.getByRole('button', { name: /Continue/ }).click();

    // Step 4: scholarship and housing answers required.
    await expect(page.getByRole('heading', { name: 'Budget and housing' })).toBeVisible();
    await page.getByRole('button', { name: /Continue/ }).click();
    await expect(page.getByText('Tell us whether you need a scholarship.')).toBeVisible();
    await expect(page.getByText('Tell us where you would like to live.')).toBeVisible();
    await page.getByText('It would help', { exact: true }).click();
    await page.getByText('University dormitory', { exact: true }).click();
    await page.getByRole('button', { name: /Continue/ }).click();

    // Step 5: start year, then build.
    await expect(page.getByText('Housing:', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: /Build my route/ }).click();
    await expect(page.getByText('Choose when you want to start.')).toBeVisible();
    await page.getByText('2027', { exact: true }).click();
    await page.getByRole('button', { name: /Build my route/ }).click();

    await expect(page).toHaveURL(/#route$/);
    await expect(page.getByRole('heading', { name: 'Your admission route' })).toBeVisible();
    const cards = page.getByTestId('match-card');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeLessThanOrEqual(3);
    // Every card shows its dormitory facts.
    await expect(page.getByTestId('housing')).toHaveCount(await cards.count());
    await expect(page.getByText('Housing: university dormitory')).toBeVisible();
    await expect(page.getByTestId('checklist-progress')).toHaveText(/^0 of \d+ tasks completed$/);
    expect(errors).toEqual([]);
  });

  test('can be completed with the keyboard only', async ({ page }) => {
    await seed(page, DECLINED);
    await page.goto('/#start');
    await expect(page.getByRole('heading', { name: 'Where do you want to study?' })).toBeFocused();
    // Tab to the first destination checkbox and tick it with Space.
    await page.keyboard.press('Tab');
    await expect(page.locator('input[name="destinations"]').first()).toBeFocused();
    await page.keyboard.press('Space');
    await expect(page.locator('input[name="destinations"]').first()).toBeChecked();
    // Enter submits the step form.
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: 'What do you want to study?' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator('input[name="field"]').first()).toBeFocused();
    await page.keyboard.press('Space');
    await expect(page.locator('input[name="field"]').first()).toBeChecked();
  });
});

test.describe('dashboard', () => {
  test('checklist ticks are saved and survive a reload', async ({ page }) => {
    await seed(page, { ...DECLINED, 'satori.profile.v1': SAMPLE_PROFILE });
    await page.goto('/#route');
    const progress = page.getByTestId('checklist-progress');
    await expect(progress).toHaveText(/^0 of (\d+) tasks completed$/);
    const total = Number((await progress.textContent())!.match(/of (\d+)/)![1]);
    await page.getByText('Check your passport expiry date').last().click();
    await expect(progress).toHaveText(`1 of ${total} tasks completed`);
    await page.reload();
    await expect(page.getByTestId('checklist-progress')).toHaveText(`1 of ${total} tasks completed`);
  });

  test('free plan shows 3 matches and locks the rest', async ({ page }) => {
    await seed(page, { ...DECLINED, 'satori.profile.v1': SAMPLE_PROFILE });
    await page.goto('/#route');
    await expect(page.getByTestId('match-card')).toHaveCount(3);
    await expect(page.getByRole('heading', { name: /more match(es)? with Pro/ })).toBeVisible();
    await expect(page.getByTestId('compare-table')).toHaveCount(0);
  });

  test('start over deletes saved answers', async ({ page }) => {
    await seed(page, { ...DECLINED, 'satori.profile.v1': SAMPLE_PROFILE });
    await page.goto('/#route');
    await page.getByRole('button', { name: 'Start over' }).click();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page).toHaveURL(/#start$/);
    const stored = await page.evaluate(() => localStorage.getItem('satori.profile.v1'));
    expect(stored).toBeNull();
  });

  test('dorm preference adds housing notes and a housing task per match', async ({ page }) => {
    await seed(page, { ...DECLINED, 'satori.profile.v1': { ...SAMPLE_PROFILE, housing: 'dorm' } });
    await page.goto('/#route');
    const cards = page.getByTestId('match-card');
    await expect(cards).toHaveCount(3);
    for (const card of await cards.all()) {
      const housing = card.getByTestId('housing');
      await expect(housing.locator('dd')).not.toHaveCount(0);
      await expect(card.getByRole('link', { name: /Housing source/ })).toHaveAttribute('href', /^https:\/\//);
    }
    await expect(page.locator('label', { hasText: /housing (place|options|early)/ })).toHaveCount(3);
  });

  test('flat preference adds a rental task instead of dorm tasks', async ({ page }) => {
    await seed(page, { ...DECLINED, 'satori.profile.v1': { ...SAMPLE_PROFILE, housing: 'flat' } });
    await page.goto('/#route');
    await expect(page.getByText('Plan your rental near campus')).toBeVisible();
    // SAMPLE_PROFILE includes mainland China, so the police registration rule is listed.
    await expect(page.getByText(/register your address with the local police within 24 hours/)).toBeVisible();
    await expect(page.getByText('Housing: my own flat')).toBeVisible();
  });

  test('plans saved before the housing question still load', async ({ page }) => {
    await seed(page, { ...DECLINED, 'satori.profile.v1': SAMPLE_PROFILE });
    await page.goto('/#route');
    await expect(page.getByTestId('match-card')).toHaveCount(3);
    await expect(page.getByText('Housing: not sure yet')).toBeVisible();
  });

  test('a route link without saved answers goes to the questionnaire', async ({ page }) => {
    await seed(page, DECLINED);
    await page.goto('/#route');
    await expect(page.getByRole('heading', { name: 'Where do you want to study?' })).toBeVisible();
  });
});
