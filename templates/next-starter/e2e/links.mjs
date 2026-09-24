/* Every AURA link in the starter navigates client-side through next/link (no full page load).
 * Run after `next build`: node e2e/links.mjs  (starts `next start` itself; CHROMIUM=/path/to/chrome optional). */
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const PORT = 3217;
/* Own process group, so the whole tree (npx → next) stops at the end. */
const server = spawn('npx', ['next', 'start', '-p', String(PORT)], { stdio: 'ignore', detached: true });
const stop = () => {
  try {
    process.kill(-server.pid);
  } catch {}
};
const base = 'http://127.0.0.1:' + PORT;
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(base, { signal: AbortSignal.timeout(2000) })).ok) break;
  } catch {}
  await new Promise((r) => setTimeout(r, 500));
}
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const fails = [];
await page.goto(base + '/');
await page.evaluate(() => {
  window.__noReload = true;
});
async function step(name, click, url) {
  await click();
  await page
    .waitForURL(base + url, { timeout: 10000 })
    .catch(() => fails.push(`${name}: did not reach ${url} (at ${page.url()})`));
  if (!(await page.evaluate(() => window.__noReload === true))) {
    fails.push(`${name}: full page load`);
    await page.evaluate(() => {
      window.__noReload = true;
    });
  }
}
await step('Button href', () => page.getByRole('link', { name: 'สมาชิก' }).first().click(), '/members');
await step(
  'Pagination page 3',
  () => page.getByRole('link', { name: /3/ }).filter({ hasText: '3' }).first().click(),
  '/members?page=3',
);
await step('Pagination next', () => page.locator('a[rel="next"]').click(), '/members?page=4');
await step('Pagination previous', () => page.locator('a[rel="prev"]').click(), '/members?page=3');
await step(
  'Breadcrumb',
  () =>
    page
      .getByRole('navigation', { name: /breadcrumb|เส้นทาง/i })
      .getByRole('link')
      .first()
      .click(),
  '/',
);
await step('Stat href', () => page.locator('a.aura-stat').first().click(), '/members');
await browser.close();
stop();
if (fails.length) {
  console.error('Client-side links FAIL:\n  ' + fails.join('\n  '));
  process.exit(1);
}
console.log(
  'Client-side links OK — Button, Pagination (pages, previous, next), Breadcrumb and Stat navigate through next/link with no full page load.',
);
process.exit(0);
