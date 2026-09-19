import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import { DECLINED, SAMPLE_PROFILE, seed } from './helpers';

// The real code lives only in the untracked local file created during setup.
const DEV_FILE = '.dev-access.json';
const devCode: string | null = fs.existsSync(DEV_FILE) ? JSON.parse(fs.readFileSync(DEV_FILE, 'utf8')).code : null;

test.describe('Pro plan and developer access', () => {
  test('wrong codes are rejected and repeated attempts lock the form', async ({ page }) => {
    await seed(page, { ...DECLINED, 'satori.profile.v1': SAMPLE_PROFILE });
    await page.goto('/#route');
    await page.getByRole('button', { name: 'See Pro' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Payments are not open yet');

    const input = dialog.getByLabel('Developer access code');
    await dialog.getByRole('button', { name: 'Unlock Pro' }).click();
    await expect(dialog.getByRole('alert')).toHaveText('Enter the developer access code.');

    for (let i = 0; i < 4; i++) {
      await input.fill(`WRONG-${i}`);
      await dialog.getByRole('button', { name: 'Unlock Pro' }).click();
      await expect(dialog.getByRole('alert')).toHaveText('That code is not correct.');
    }
    await input.fill('WRONG-5');
    await dialog.getByRole('button', { name: 'Unlock Pro' }).click();
    await expect(dialog.getByRole('alert')).toContainText('Too many attempts');

    // Escape closes the dialog (keyboard friendly).
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('the developer code unlocks Pro on this device', async ({ page }) => {
    test.skip(!devCode, 'No local developer code file');
    await seed(page, { ...DECLINED, 'satori.profile.v1': SAMPLE_PROFILE });
    await page.goto('/#route');
    await page.getByRole('button', { name: 'See Pro' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('Developer access code').fill(devCode!.toLowerCase());
    await dialog.getByRole('button', { name: 'Unlock Pro' }).click();
    await expect(dialog.getByRole('heading', { name: 'Pro is active' })).toBeVisible();
    await dialog.getByRole('button', { name: 'Done' }).click();
    await expect(page.getByTestId('compare-table')).toBeVisible();
    const rows = page.getByTestId('compare-table').locator('tbody tr');
    expect(await rows.count()).toBeGreaterThan(3);
  });
});
