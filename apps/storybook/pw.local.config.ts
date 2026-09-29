import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: '/home/claude/aura/repo/apps/storybook/scripts', testMatch: ['components.spec.ts', 'a11y.spec.ts'], timeout: 900000, workers: 3,
  use: { baseURL: 'http://localhost:6006', launchOptions: { executablePath: '/opt/pw-browsers/chromium' } },
  webServer: { command: 'npx http-server storybook-static -p 6006 -s', port: 6006, reuseExistingServer: true, cwd: '/home/claude/aura/repo/apps/storybook' },
});
