import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './scripts',
  testMatch: 'components.spec.ts',
  use: { baseURL: 'http://localhost:6006' },
  webServer: { command: 'npx http-server storybook-static -p 6006 -s', port: 6006, reuseExistingServer: true },
});
