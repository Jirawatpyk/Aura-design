import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './scripts',
  testMatch: 'a11y.spec.ts',
  timeout: 300_000,
  use: { baseURL: 'http://localhost:6006' },
  webServer: { command: 'npx http-server storybook-static -p 6006 -s', port: 6006, reuseExistingServer: true },
});
