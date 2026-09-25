/* Shared checks for the pilot pages (examples/<name>/dist/index.html). */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const here = path.dirname(fileURLToPath(import.meta.url));
export const example = (name: string) => 'file://' + path.join(here, '../examples', name, 'dist/index.html');
const AXE = fs.readFileSync(process.env.AXE || createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');

/* An uncaught error on the page fails the test it happened in. */
export function failOnPageErrors(): void {
  const errors = new WeakMap<Page, string[]>();
  test.beforeEach(({ page }) => {
    const list: string[] = [];
    errors.set(page, list);
    page.on('pageerror', (e) => list.push(e.message.slice(0, 200)));
  });
  test.afterEach(({ page }) => {
    expect(errors.get(page) || [], 'pageerror').toEqual([]);
  });
}

/* A theme switch starts ~90 CSS colour transitions (150–250ms). Text colours flip at once while backgrounds fade, so
 * axe run mid-fade can measure a half-changed pair (seen in CI: .aura-nav__count on the active item). Wait until every
 * CSS transition has finished — deterministic, unlike a fixed sleep. */
export async function axe(page: Page, label: string): Promise<void> {
  await page.waitForFunction(
    () => document.getAnimations().every((a) => !(a instanceof CSSTransition) || a.playState === 'finished'),
    null,
    { timeout: 5000 },
  );
  await page.addScriptTag({ content: AXE });
  const v = await page.evaluate(async () => {
    const axe = (window as unknown as { axe: { run: (c: Document, o: object) => Promise<AxeResult> } }).axe;
    type AxeResult = { violations: { id: string; nodes: { target: string[] }[] }[] };
    const r = await axe.run(document, { resultTypes: ['violations'] });
    return r.violations.map((x) => x.id + ' (' + x.nodes.length + '): ' + (x.nodes[0]?.target.join(' ') ?? ''));
  });
  expect(v, label + ' axe').toEqual([]);
}

export const setTheme = (page: Page, theme: 'light' | 'dark' | null) =>
  page.evaluate((t) => {
    if (t) document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.removeAttribute('data-theme');
  }, theme);

/** The toggle switches the page, the choice survives a reload (head script, before paint), System follows the OS. */
export async function colorScheme(
  page: Page,
  name: string,
  dark: string,
  system: string,
  afterReload: (page: Page) => Promise<unknown>,
): Promise<void> {
  const root = () =>
    page.evaluate(() => [document.documentElement.dataset.theme, document.documentElement.classList.contains('dark')]);
  const canvas = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const lightBg = await canvas();
  await page.getByRole('button', { name: new RegExp('^' + name) }).click();
  await page.getByRole('menuitemcheckbox', { name: dark }).click();
  expect(await root()).toEqual(['dark', true]);
  await axe(page, 'toggled dark');
  await page.reload();
  await afterReload(page);
  expect(await root(), 'after reload').toEqual(['dark', true]);
  await expect(page.getByRole('button', { name: new RegExp('^' + name + '.*' + dark) })).toBeVisible();
  await page.getByRole('button', { name: new RegExp('^' + name) }).click();
  await page.getByRole('menuitemcheckbox', { name: system }).click();
  expect(await root()).toEqual(['system', false]);
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.waitForTimeout(400);
  expect(await root(), 'system should follow the OS').toEqual(['system', true]);
  expect(await canvas(), 'system dark canvas').not.toBe(lightBg);
  await axe(page, 'system dark');
}

/* Compact density (4.14): data-density="compact" on <html> gives 36px fields/buttons and 40px rows; nothing may clip
 * that didn't already (ellipsis columns do on purpose), and axe stays clean in both themes. */
const clipped = (page: Page) =>
  page.evaluate(() =>
    [
      ...document.querySelectorAll<HTMLElement>(
        '.aura-btn, .aura-input__control, .aura-table__th-label, .aura-tabs__tab, .aura-page, .aura-seg__item, .aura-choice__label',
      ),
    ]
      .filter((e) => e.offsetParent && (e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 2))
      .map(
        (e) =>
          e.className.split(' ')[0] + ': ' + (e.textContent || (e as HTMLInputElement).value || '').trim().slice(0, 30),
      ),
  );
export async function compact(page: Page, label: string): Promise<void> {
  const before = new Set(await clipped(page));
  await page.evaluate(() => document.documentElement.setAttribute('data-density', 'compact'));
  const h = await page.evaluate(() => getComputedStyle(document.querySelector('.aura-btn')!).height);
  expect(h, label + ' compact button height').toBe('36px');
  const added = (await clipped(page)).filter((c) => !before.has(c));
  expect(added.slice(0, 5), label + ' clipped in compact').toEqual([]);
  await axe(page, label + ' compact light');
  await setTheme(page, 'dark');
  await axe(page, label + ' compact dark');
  await page.evaluate(() => {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-density');
  });
}

export const scrollWidth = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth);
export const activeAttr = (page: Page, name: string) =>
  page.evaluate((n) => document.activeElement?.getAttribute(n) ?? null, name);
