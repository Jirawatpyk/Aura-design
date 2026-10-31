// @ts-check
/* Every AURA link in the starter navigates client-side through TanStack Router (no full page load), with AURA's own
 * aria-current, and new-tab clicks stay with the browser.
 * Run after `npm run build`: node e2e/links.mjs  (starts `vite preview` itself; CHROMIUM=/path/to/chrome optional). */
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const PORT = Number(process.env.PORT) || 3219;
const base = 'http://127.0.0.1:' + PORT;
/** @param {string} why */
const bail = (why) => {
  console.error('Client-side links FAIL: ' + why);
  process.exit(1);
};
/* Something already on the port would answer for this build and the test would check the wrong server. */
if (
  await fetch(base, { signal: AbortSignal.timeout(1000) }).then(
    () => true,
    () => false,
  )
)
  bail(`port ${PORT} is already in use — stop that server or set PORT`);
/* Own process group, so the whole tree (npx → vite) stops at the end. */
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  stdio: 'ignore',
  detached: true,
});
const stop = () => {
  try {
    if (server.pid) process.kill(-server.pid);
  } catch {}
};
let up = false;
for (let i = 0; i < 60 && !up && server.exitCode == null; i++) {
  try {
    up = (await fetch(base, { signal: AbortSignal.timeout(2000) })).ok;
  } catch {}
  if (!up) await new Promise((r) => setTimeout(r, 500));
}
if (!up || server.exitCode != null) {
  stop();
  bail('vite preview did not start on ' + base + (server.exitCode != null ? ' (exited ' + server.exitCode + ')' : ''));
}
/** @type {string[]} */
const fails = [];
/** @type {import('playwright').Browser | undefined} */
let browser;
try {
  browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  /** @type {string[]} */
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(e.message));

  const mark = () =>
    page.evaluate(() => {
      /** @type {any} */ (window).__noReload = true;
    });
  /* Clicks before hydration would be plain <a> loads — reported below as a full page load, never passed over. */
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await mark();

  /**
   * @param {string} name
   * @param {() => Promise<unknown>} click
   * @param {string} url
   */
  async function step(name, click, url) {
    try {
      await click();
    } catch (e) {
      fails.push(`${name}: ${String(e).split('\n')[0]}`);
      return;
    }
    await page
      .waitForURL(base + url, { timeout: 10000 })
      .catch(() => fails.push(`${name}: did not reach ${url} (at ${page.url().replace(base, '')})`));
    if (!(await page.evaluate(() => /** @type {any} */ (window).__noReload === true))) {
      fails.push(`${name}: full page load`);
      await mark();
    }
  }
  /** @param {import('playwright').Locator} link @param {string} name @param {string | null} want */
  async function current(link, name, want) {
    const got = await link.getAttribute('aria-current');
    if (got !== want) fails.push(`${name}: aria-current ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
  }
  /** @param {string | RegExp} label */
  const nav = (label) => page.getByRole('navigation', { name: label });

  /* Orders page */
  await step('Button href', () => page.getByRole('link', { name: 'สมาชิก' }).first().click(), '/members');
  /* Members page */
  await current(nav('ส่วนงาน').getByRole('link', { name: 'สมาชิก' }), 'SideNav current item', 'page');
  await current(nav('ส่วนงาน').getByRole('link', { name: 'คำสั่งซื้อ' }), 'SideNav "/" item on /members', null);
  await current(nav('มุมมองสมาชิก').getByRole('link', { name: 'รอต่ออายุ' }), 'Tabs link not chosen', null);
  await step(
    'Pagination page 3',
    () => page.getByRole('link', { name: /3/ }).filter({ hasText: '3' }).first().click(),
    '/members?page=3',
  );
  if ((await page.getByTestId('members-page').textContent()) !== 'Members page 3')
    fails.push('Pagination: the route did not render page 3');
  /* One current page: TanStack's <Link> would also mark page 1 (/members) current, its search being a subset. */
  const pager = nav(/pagination|หน้า/i);
  await current(pager.getByRole('link', { name: /3/ }).filter({ hasText: '3' }).first(), 'Pagination page 3', 'page');
  await current(
    pager.getByRole('link', { name: /1/ }).filter({ hasText: /^1$/ }).first(),
    'Pagination page 1 while on page 3',
    null,
  );
  await step('Pagination next', () => page.locator('a[rel="next"]').click(), '/members?page=4');
  await step('Pagination previous', () => page.locator('a[rel="prev"]').click(), '/members?page=3');
  await step(
    'Tabs link',
    () => nav('มุมมองสมาชิก').getByRole('link', { name: 'รอต่ออายุ' }).click(),
    '/members?view=renewals',
  );
  await current(nav('มุมมองสมาชิก').getByRole('link', { name: 'รอต่ออายุ' }), 'Tabs link chosen', 'page');
  await current(nav('มุมมองสมาชิก').getByRole('link', { name: 'ทั้งหมด' }), 'Tabs link not chosen (other tab)', null);
  await step('Tabs link back', () => nav('มุมมองสมาชิก').getByRole('link', { name: 'ทั้งหมด' }).click(), '/members');
  await step('Th sortHref', () => page.locator('th a').first().click(), '/members?sort=name');
  if ((await page.locator('th').first().getAttribute('aria-sort')) !== 'ascending')
    fails.push('Th sortHref: aria-sort not ascending after the click');
  await step('SideNav item', () => nav('ส่วนงาน').getByRole('link', { name: 'คำสั่งซื้อ' }).click(), '/');
  /* Orders page */
  await step('Stat href', () => page.locator('a.aura-stat').first().click(), '/members');
  await step(
    'Breadcrumb',
    () =>
      nav(/breadcrumb|เส้นทาง/i)
        .getByRole('link')
        .first()
        .click(),
    '/',
  );
  await step('StatusTile href', () => page.locator('a.aura-status-tile').first().click(), '/members?view=renewals');
  await page.setViewportSize({ width: 390, height: 800 });
  await step(
    'BottomNav item',
    () => page.locator('.aura-bottom-nav a, .aura-bottomnav a').filter({ hasText: 'คำสั่งซื้อ' }).first().click(),
    '/',
  );
  await page.setViewportSize({ width: 1280, height: 900 });
  await step('DataTable pager next', () => page.locator('.aura-table a.aura-icon-btn').last().click(), '/?page=2');
  await step('DataTable pager previous', () => page.locator('.aura-table a.aura-icon-btn').first().click(), '/');
  /* Keyboard paging: PageDown / PageUp in the grid follow the pager links (DataTable clicks them through a ref). */
  await step(
    'DataTable PageDown',
    async () => {
      await page.locator('.aura-table [role="gridcell"]').first().focus();
      await page.keyboard.press('PageDown');
    },
    '/?page=2',
  );
  await step('DataTable PageUp', () => page.keyboard.press('PageUp'), '/');
  await step(
    'DataTable row link',
    () => page.locator('.aura-table__row-link').first().click(),
    '/members?order=ORD-1042',
  );
  if ((await page.getByTestId('order').textContent()) !== 'คำสั่งซื้อ ORD-1042')
    fails.push('DataTable row link: the route did not read the order');
  await step(
    'DataTable row (a cell elsewhere in the row)',
    async () => {
      await page.goBack();
      await page.waitForURL(base + '/');
      await page.locator('.aura-table__row').nth(1).locator('[role="gridcell"]').nth(2).click();
    },
    '/members?order=ORD-1043',
  );
  await step(
    'DropdownMenu link item',
    async () => {
      await page.goBack();
      await page.waitForURL(base + '/');
      await page.getByRole('button', { name: 'ไปที่' }).click();
      await page.getByRole('menuitem', { name: 'รอต่ออายุ' }).click();
    },
    '/members?view=renewals',
  );
  await step(
    'Toast action link',
    async () => {
      await page.goBack();
      await page.waitForURL(base + '/');
      await page.getByRole('button', { name: 'บันทึก' }).click();
      await page.getByRole('link', { name: 'ดูสมาชิก' }).click();
    },
    '/members',
  );
  /* ⌘/Ctrl-click stays with the browser: a new tab opens and this page stays where it is. */
  const popup = context.waitForEvent('page', { timeout: 5000 }).catch(() => null);
  await nav('มุมมองสมาชิก')
    .getByRole('link', { name: 'รอต่ออายุ' })
    .click({ modifiers: ['ControlOrMeta'] });
  const tab = await popup;
  if (!tab) fails.push('Ctrl/⌘-click: no new tab');
  else await tab.close();
  if (page.url() !== base + '/members')
    fails.push('Ctrl/⌘-click: this page navigated to ' + page.url().replace(base, ''));
  /* A direct load of a deep link renders on the server, then hydrates without errors. */
  await page.goto(base + '/members?view=renewals');
  await page.waitForTimeout(800);
  await current(nav('มุมมองสมาชิก').getByRole('link', { name: 'รอต่ออายุ' }), 'Tabs after a direct load', 'page');
  const real = errors.filter((t) => !/Download the React DevTools/.test(t));
  if (real.length) fails.push('console: ' + JSON.stringify(real.slice(0, 5)));
} catch (e) {
  fails.push('stopped: ' + String(e).split('\n')[0]);
} finally {
  await browser?.close().catch(() => undefined);
  stop();
}
if (fails.length) {
  console.error('Client-side links FAIL:\n  ' + fails.join('\n  '));
  process.exit(1);
}
console.log(
  "Client-side links OK — Button, Pagination (pages, previous, next), link Tabs, Th sortHref, SideNav, Stat, Breadcrumb, StatusTile, BottomNav, DataTable pager (click and PageDown / PageUp) and rows, DropdownMenu and toast action links navigate through TanStack Router with no full page load; aria-current is AURA's; Ctrl/⌘-click opens a tab.",
);
process.exit(0);
