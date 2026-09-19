import { defineConfig, devices } from '@playwright/test';

/*
 * Automated checks for the built site. Run with:  npm test
 * The tests build a separate copy in "dist-test" with a fake analytics code
 * ("satori-test") so the consent logic can be verified without a real account.
 */
const PORT = 4174;

export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `npx vite build --outDir dist-test --emptyOutDir && npx vite preview --outDir dist-test --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: false,
    timeout: 180_000,
    env: { VITE_GOATCOUNTER_CODE: 'satori-test' },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testMatch: /(mobile|e2e)\.spec\.ts/ },
  ],
});
