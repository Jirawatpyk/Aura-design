/* Pilot pages: the three examples built by `npm run examples`, opened from disk. One retry — a pass on retry is
 * reported as flaky, not hidden; on GitHub Actions failures and flaky tests become annotations on the run page.
 *   npm run test:pilots -w packages/react        (CHROMIUM=/path/to/chrome to use a given browser) */
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: ['orders.spec.ts', 'pilots.spec.ts'],
  timeout: 60_000,
  retries: 1,
  /* One page at a time, as before: the checks wait for transitions and timers, which a busy CPU stretches. */
  workers: 1,
  reporter: process.env.GITHUB_ACTIONS ? [['github'], ['list']] : [['list']],
  use: {
    reducedMotion: 'reduce',
    launchOptions: process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {},
  },
});
