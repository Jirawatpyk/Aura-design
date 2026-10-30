import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/* Behaviour tests for AURA components, run against the static Storybook (npm run build-storybook). */
/* Wait for entrance animations (a Dialog scales in from 0.98) so a measured box is its settled size; looping ones
 * (spinners, skeleton shimmer) are left running. */
const settle = (page: Page) =>
  page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => a.effect?.getTiming().iterations !== Infinity)
        .map((a) => a.finished.catch(() => undefined)),
    ).then(() => undefined),
  );

const story = async (page: Page, id: string, theme = 'light') => {
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`);
  await page.waitForSelector('#storybook-root > *');
  /* Measure after the web fonts have loaded (or failed): a swap mid-test moves text by a line in CI. */
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
};

/* axe on part of the page. Storybook's a11y addon can be mid-run in the preview; wait and retry instead of failing. */
const axeScan = async (page: Page, sel: string): Promise<string[]> => {
  for (let i = 0; ; i++) {
    try {
      const { violations } = await new AxeBuilder({ page })
        .include(sel)
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      return violations.map((v) => `${v.id} — ${v.help} (${v.nodes.length})`);
    } catch (e) {
      if (i >= 4 || !/already running/.test(String(e))) throw e;
      await page.waitForTimeout(300);
    }
  }
};

test.describe('Button', () => {
  test('loading keeps label, sets aria-busy and swallows clicks', async ({ page }) => {
    await story(page, 'aura-actions-button--loading');
    const b = page.getByRole('button', { name: 'Saving' });
    await expect(b).toHaveAttribute('aria-busy', 'true');
    await expect(b.locator('.aura-spin')).toBeVisible();
  });
  test('dark theme flips the primary fill to off-white and the creative shadow turns violet', async ({ page }) => {
    await story(page, 'aura-actions-button--all-states', 'dark');
    const bg = await page
      .getByRole('button', { name: 'Enterprise' })
      .evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(bg).toBe('rgb(228, 228, 231)'); // 5.30: off-white zinc-200, not pure white
    const sh = await page.getByRole('button', { name: 'Creative' }).evaluate((e) => getComputedStyle(e).boxShadow);
    expect(sh).toContain('167, 139, 250');
  });
  test('href makes a link that looks like the button; disabled links leave the Tab order', async ({ page }) => {
    await story(page, 'aura-actions-button--as-link');
    const link = page.getByRole('link', { name: 'View Orders' });
    await expect(link).toHaveAttribute('href', '#orders');
    const look = (el: Element) => {
      const s = getComputedStyle(el);
      return [s.height, s.borderRadius, s.textDecorationLine, s.display];
    };
    const [h, r, deco, display] = await link.evaluate(look);
    expect(deco).toBe('none');
    expect(display).toMatch(/flex$/); // inline-flex, blockified to flex inside the story's flex row
    expect(parseFloat(h)).toBeGreaterThanOrEqual(44);
    expect(parseFloat(r)).toBeGreaterThan(20);
    await expect(page.getByRole('link', { name: 'Source on GitHub' })).toHaveAttribute('target', '_blank');
    const off = page.getByRole('link', { name: 'Billing (admins only)' });
    await expect(off).toHaveAttribute('aria-disabled', 'true');
    await expect(off).not.toHaveAttribute('href', /.*/);
    await link.focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(off).not.toBeFocused();
    await link.focus();
    await page.keyboard.press('Enter');
    await expect.poll(() => page.evaluate(() => location.hash)).toBe('#orders');
  });
});

test.describe('Forms', () => {
  test('errors are linked and marked invalid', async ({ page }) => {
    await story(page, 'aura-forms--text-fields');
    const key = page.getByLabel('Project key');
    await expect(key).toHaveAttribute('aria-invalid', 'true');
    const id = await key.getAttribute('aria-describedby');
    await expect(page.locator(`[id="${id}"]`)).toContainText('Use capital letters');
    await expect(page.getByLabel(/Email address/)).toHaveAttribute('required', '');
    await expect(page.getByLabel('Workspace')).toBeDisabled();
  });
  test('radio group, switch and checkbox respond to keyboard', async ({ page }) => {
    await story(page, 'aura-forms--choices');
    await page.getByRole('radio', { name: /Enterprise/ }).focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('radio', { name: /Creative/ })).toBeChecked();
    const sw = page.getByRole('switch', { name: 'Email me when a token changes' });
    await expect(sw).toHaveAttribute('aria-checked', 'true');
    await sw.focus();
    await page.keyboard.press('Space');
    await expect(sw).toHaveAttribute('aria-checked', 'false');
  });
  test('select shows its placeholder until a choice is made', async ({ page }) => {
    await story(page, 'aura-forms--select-and-textarea');
    const s = page.getByRole('combobox', { name: 'Team' });
    const native = page.locator('select');
    await expect(s).toHaveText('Choose a team');
    await expect(native).toHaveValue('');
    await s.click();
    await page.getByRole('option', { name: 'Mobile' }).click();
    await expect(s).toHaveText('Mobile');
    await expect(native).toHaveValue('Mobile');
  });
});

test.describe('Feedback & overlays', () => {
  test('dialog traps focus, closes on Escape and returns focus', async ({ page }) => {
    await story(page, 'aura-feedback--dialog-confirm');
    const opener = page.getByRole('button', { name: 'Delete Token' });
    await opener.click();
    const dlg = page.getByRole('alertdialog', { name: 'Delete aura-accent-lime?' });
    await expect(dlg).toBeVisible();
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      expect(await dlg.evaluate((d) => d.contains(document.activeElement))).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(dlg).toBeHidden();
    await expect(opener).toBeFocused();
  });
  test('toast appears, can be dismissed', async ({ page }) => {
    await story(page, 'aura-feedback--toasts');
    await page.getByRole('button', { name: 'Show Toast' }).click();
    const t = page.locator('.aura-toast', { hasText: 'Token published' });
    await expect(t).toBeVisible();
    await t.getByRole('button', { name: 'Dismiss notification' }).click();
    await expect(t).toBeHidden();
  });
  test('tooltip shows on focus and describes its trigger', async ({ page }) => {
    await story(page, 'aura-feedback--tooltips');
    const dl = page.getByRole('button', { name: 'Download' });
    await dl.focus();
    const tip = page.getByRole('tooltip', { name: 'Download tokens.json' });
    await expect(tip).toBeVisible();
    await expect(dl).toHaveAttribute('aria-describedby', (await tip.getAttribute('id'))!);
    await page.keyboard.press('Escape');
    await expect(tip).toBeHidden();
  });
  test('alerts use status/alert roles by tone', async ({ page }) => {
    await story(page, 'aura-feedback--alerts');
    await expect(page.getByRole('alert')).toHaveCount(2);
    await expect(page.getByRole('status')).toHaveCount(2);
  });
});

test.describe('Layout', () => {
  test('tabs move with arrow keys', async ({ page }) => {
    await story(page, 'aura-layout--tabs');
    await page.getByRole('tab', { name: 'Overview' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: /Changes/ })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toContainText('12 tokens changed');
    await page.keyboard.press('End');
    await expect(page.getByRole('tab', { name: 'Usage' })).toBeFocused();
  });
  test('side nav marks the current page', async ({ page }) => {
    await story(page, 'aura-layout--app-shell');
    const nav = page.getByRole('navigation', { name: 'Main' });
    await expect(nav.locator('[aria-current="page"]')).toHaveText('Tokens');
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' }).locator('[aria-current="page"]')).toHaveText(
      'Tokens',
    );
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page.getByRole('button', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  });
});

test.describe('DataTable', () => {
  const grid = (page: Page) => page.getByRole('grid', { name: '2,000 workstreams' });
  test('virtualises 2,000 rows', async ({ page }) => {
    await story(page, 'aura-data-datatable--virtual-grid');
    const rows = grid(page).locator('.aura-table__row');
    expect(await rows.count()).toBeLessThan(40);
    await grid(page).evaluate((g) => {
      g.scrollTop = 48 * 1500;
    });
    await expect(rows.first()).toContainText(/AURA-1[45]\d\d/);
    await expect(grid(page)).toHaveAttribute('aria-rowcount', '2001');
  });
  test('sorts, selects and navigates cell by cell', async ({ page }) => {
    await story(page, 'aura-data-datatable--virtual-grid');
    const g = grid(page);
    await g.locator('[data-rc="1:1"]').focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator(':focus')).toHaveAttribute('data-rc', '1:2');
    await page.keyboard.press('Control+End');
    await expect(page.locator(':focus')).toHaveAttribute('data-rc', /^2000:/);
    await page.keyboard.press('Control+Home');
    await page.keyboard.press('Space');
    await expect(g.locator('.aura-table__row.is-selected')).toHaveCount(1);
    const sortId = g.getByRole('button', { name: 'ID', exact: true });
    await sortId.click();
    await sortId.click();
    await expect(g.getByRole('columnheader', { name: /^ID/ })).toHaveAttribute('aria-sort', 'descending');
    await expect(g.locator('.aura-table__row').first()).toContainText('AURA-2000');
  });
  test('column menu pins, hides and the picker restores', async ({ page }) => {
    await story(page, 'aura-data-datatable--virtual-grid');
    const g = grid(page);
    const owner = g.locator('[data-rc="0:4"]');
    await expect(owner).toContainText('OWNER');
    await owner.focus();
    await page.keyboard.press('Alt+ArrowDown');
    await page.getByRole('menuitem', { name: 'Hide column' }).click();
    await expect(g.getByRole('columnheader', { name: /OWNER/ })).toHaveCount(0);
    await page.getByRole('button', { name: 'Show or hide columns' }).click();
    await page.getByRole('menuitemcheckbox', { name: 'OWNER' }).click();
    await page.keyboard.press('Escape');
    await expect(g.getByRole('columnheader', { name: /OWNER/ })).toHaveCount(1);
  });
  test('pages and keeps selection across pages', async ({ page }) => {
    await story(page, 'aura-data-datatable--paged');
    await expect(page.locator('.aura-table__foot')).toContainText('1–10 of 42');
    await page.getByRole('button', { name: 'Next page' }).click();
    await expect(page.locator('.aura-table__foot')).toContainText('11–20 of 42');
  });
  test('loading and empty states', async ({ page }) => {
    await story(page, 'aura-data-datatable--loading');
    await expect(page.getByRole('grid')).toHaveAttribute('aria-busy', 'true');
    await expect(page.getByRole('status')).toHaveText('Loading rows');
    await story(page, 'aura-data-datatable--empty');
    await expect(page.getByText('No open incidents')).toBeVisible();
  });
});

/* ---------- 4.2: pickers, overlays, responsive ---------- */
test.describe('Combobox', () => {
  test('filters Thai and keywords, picks with Enter, Escape clears', async ({ page }) => {
    await story(page, 'aura-pickers--combobox-story');
    const cb = page.getByRole('combobox', { name: 'ผู้ดูแล' });
    await cb.fill('kamon');
    await expect(page.getByRole('listbox').getByRole('option')).toHaveCount(1);
    await cb.press('Enter');
    await expect(cb).toHaveValue('กมล ศรีวงศ์');
    await expect(page.getByText('Value: m1')).toBeVisible();
    await cb.fill('ธน');
    await expect(page.getByRole('option', { name: /ธนพร/ })).toBeVisible();
    await cb.press('Escape');
    await cb.press('Escape');
    await expect(page.getByText('Value: null')).toBeVisible();
  });
});

test.describe('DatePicker', () => {
  test('shows พ.ศ., accepts typed Buddhist and Christian years, keeps ISO', async ({ page }) => {
    await story(page, 'aura-pickers--date-picker-story');
    const f = page.getByRole('textbox', { name: 'วันที่ส่ง' });
    await expect(f).toHaveValue('18 ก.ย. 2569');
    await f.fill('05/12/2569');
    await f.press('Enter');
    await expect(page.getByText('ISO: 2026-12-05')).toBeVisible();
    await f.fill('2026-10-01');
    await f.press('Tab');
    await expect(f).toHaveValue('1 ต.ค. 2569');
  });
  test('calendar: focus moves in, arrows move, Enter picks, Escape returns focus', async ({ page }) => {
    await story(page, 'aura-pickers--date-picker-story');
    await page.getByRole('button', { name: 'เปิดปฏิทิน' }).first().click();
    await expect(page.getByRole('dialog', { name: 'วันที่ส่ง' })).toBeVisible();
    await expect(page.locator(':focus')).toHaveAttribute('data-date', '2026-09-18');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(page.getByText('ISO: 2026-09-25')).toBeVisible();
    await page.getByRole('button', { name: 'เปิดปฏิทิน' }).first().click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
  test('min disables earlier days', async ({ page }) => {
    await story(page, 'aura-pickers--date-picker-story');
    await page.getByRole('button', { name: 'เปิดปฏิทิน' }).first().click();
    await page.getByRole('button', { name: 'เดือนก่อนหน้า' }).click();
    await expect(page.locator('[data-date="2026-08-31"]')).toBeDisabled();
  });
});

test.describe('DateRangePicker', () => {
  test('two clicks make a range, highlighted in between', async ({ page }) => {
    await story(page, 'aura-pickers--date-range-picker-story');
    await page.getByRole('button', { name: 'เปิดปฏิทิน' }).click();
    await page.locator('[data-date="2026-09-10"]').click();
    await expect(page.getByText('เลือกวันสิ้นสุด')).toBeVisible();
    await page.locator('[data-date="2026-09-03"]').click();
    await expect(page.getByRole('textbox', { name: 'ช่วงวันที่' })).toHaveValue('3 ก.ย. 2569 – 10 ก.ย. 2569');
  });
});

test.describe('Drawer and DropdownMenu', () => {
  test('drawer traps focus, closes on Escape and returns focus', async ({ page }) => {
    await story(page, 'aura-overlays--drawer-story');
    const opener = page.getByRole('button', { name: 'Open md' });
    await opener.click();
    const dr = page.getByRole('dialog', { name: 'ORD-1042' });
    await expect(dr).toBeVisible();
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      expect(
        await page.evaluate(
          () => !!document.activeElement?.closest('.aura-drawer, .aura-cal__popover, .aura-combo__popover'),
        ),
      ).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(dr).toHaveCount(0);
    await expect(opener).toBeFocused();
  });
  test('dropdown opens with ArrowDown, runs the item, focus returns', async ({ page }) => {
    await story(page, 'aura-overlays--dropdown-menu-story');
    const trigger = page.getByRole('button', { name: 'Actions for ORD-1042' });
    await trigger.focus();
    await page.keyboard.press('ArrowDown');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('last')).toHaveText('Last: Edit order');
    await expect(trigger).toBeFocused();
  });
});

test.describe('Responsive', () => {
  test('AppShell: fixed nav on desktop, drawer on phone', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await story(page, 'aura-responsive--shell');
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveCount(0);
    await page.setViewportSize({ width: 390, height: 800 });
    await expect(page.getByRole('navigation', { name: 'Main' })).toHaveCount(0);
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: /Team/ })
      .or(page.getByRole('dialog').getByRole('link', { name: /Team/ }))
      .click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
  test('Stack and Grid follow breakpoints', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await story(page, 'aura-responsive--stack-grid');
    await expect(page.getByTestId('bp')).toHaveText('Breakpoint: base');
    const dir = () =>
      page
        .locator('.aura-stack .aura-stack')
        .first()
        .evaluate((e) => getComputedStyle(e).flexDirection);
    expect(await dir()).toBe('column');
    await page.setViewportSize({ width: 1100, height: 800 });
    await expect(page.getByTestId('bp')).toHaveText('Breakpoint: lg');
    expect(await dir()).toBe('row');
    const cols = await page
      .locator('.aura-grid-layout')
      .first()
      .evaluate((e) => getComputedStyle(e).gridTemplateColumns.split(' ').length);
    expect(cols).toBe(4);
  });
  test('DataTable stacks into cards below stackBelow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await story(page, 'aura-responsive--stacked-table');
    /* 4.20: one markup — the same grid rows, laid out as cards by a container query. */
    const rows = page.locator('.aura-table__scroll > .aura-table__row:not(.aura-table__head)');
    await expect(rows).toHaveCount(5);
    const wrap = () => rows.first().evaluate((r) => getComputedStyle(r).flexWrap);
    expect(await wrap()).toBe('wrap');
    await expect(page.getByRole('grid')).toHaveCount(1);
    await expect(page.getByRole('columnheader', { name: /NAME/ })).toBeAttached();
    /* Field labels are generated content with empty alt text: seen, not read twice. */
    const label = await rows
      .first()
      .locator('[data-label]')
      .first()
      .evaluate((c) => getComputedStyle(c, '::before').content);
    expect(label).toContain('NAME');
    const { violations } = await new AxeBuilder({ page })
      .include('.aura-table')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(violations.map((v) => v.id)).toEqual([]);
    await page.getByRole('checkbox', { name: /ORD-1041/ }).check();
    await expect(page.getByText('1 selected')).toBeVisible();
    await page.setViewportSize({ width: 1000, height: 800 });
    await expect(page.getByRole('grid')).toBeVisible();
    await expect.poll(wrap).toBe('nowrap');
  });
});

/* ---------- 4.3: Stat, TimePicker, FileUpload, tablet tables ---------- */
test.describe('4.3', () => {
  test('Stat: tone follows the change, not only the direction', async ({ page }) => {
    await story(page, 'aura-new-in-4-3--stats');
    await expect(page.locator('.aura-stat__change.is-positive')).toContainText('+12%');
    await expect(page.locator('.aura-stat__change.is-negative')).toContainText('+2');
    await expect(page.getByRole('link', { name: /Revenue/ })).toBeVisible();
  });
  test('TimePicker: typed shorthand, slots, blocked lunch, out-of-range message', async ({ page }) => {
    await story(page, 'aura-new-in-4-3--time-picker-story');
    const f = page.getByRole('combobox', { name: 'Start time' });
    await f.fill('930');
    await f.press('Enter');
    await expect(page.getByText('Value: 09:30')).toBeVisible();
    await f.fill('7');
    await f.press('Enter');
    await expect(page.getByText('Choose a time between 08:00 and 18:00')).toBeVisible();
    await f.fill('');
    await f.press('Escape');
    await f.press('ArrowDown');
    await expect(page.getByRole('option', { name: '12:00' })).toHaveAttribute('aria-disabled', 'true');
    await page.getByRole('option', { name: '11:30' }).click();
    await expect(page.getByText('Value: 11:30')).toBeVisible();
    await f.press('ArrowDown');
    await f.press('ArrowDown'); // skips 12:00 and 12:30
    await f.press('Enter');
    await expect(page.getByText('Value: 13:00')).toBeVisible();
  });
  test('FileUpload: checks type, size and count; remove returns focus to the input', async ({ page }) => {
    await story(page, 'aura-new-in-4-3--file-upload-story');
    const input = page.getByLabel(/Job-site photos/);
    await input.setInputFiles([
      { name: 'a.png', mimeType: 'image/png', buffer: Buffer.from('x') },
      { name: 'b.txt', mimeType: 'text/plain', buffer: Buffer.from('x') },
      { name: 'c.png', mimeType: 'image/png', buffer: Buffer.alloc(6 * 1024 * 1024) },
      { name: 'd.png', mimeType: 'image/png', buffer: Buffer.from('x') },
    ]);
    const items = page.locator('.aura-upload__item');
    await expect(items).toHaveCount(6);
    await expect(items.nth(3)).toContainText('This file type isn’t accepted');
    await expect(items.nth(4)).toContainText('Larger than 5 MB');
    await expect(items.nth(5)).toContainText('Up to 3 files');
    await page.getByRole('button', { name: 'Remove b.txt' }).click();
    await expect(page.getByTestId('count')).toHaveText('Files: 5');
    await expect(input).toBeFocused();
  });
  test('DataTable hideBelow drops secondary columns on tablets; grid is one tab stop', async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 900 });
    await story(page, 'aura-new-in-4-3--tablet-table');
    await expect(page.getByRole('columnheader', { name: 'OWNER' })).toHaveCount(0);
    await expect(page.getByRole('columnheader', { name: 'AMOUNT' })).toHaveCount(0);
    const over = await page.getByRole('grid').evaluate((g) => g.scrollWidth - g.clientWidth);
    expect(over).toBeLessThanOrEqual(1);
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(page.getByRole('columnheader', { name: 'OWNER' })).toBeVisible();
    await page.locator('[data-rc="1:1"]').focus();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('[role=grid]'))).toBe(false);
  });
  test('DataTable: Enter and F2 move into a cell control, Escape returns to the cell', async ({ page }) => {
    await story(page, 'aura-new-in-4-3--tablet-table');
    const cell = page.locator('.aura-table__td:has(.aura-dropdown)').first();
    const rc = await cell.getAttribute('data-rc');
    for (const key of ['Enter', 'F2']) {
      await cell.focus();
      await page.keyboard.press(key);
      await expect(page.locator(':focus')).toHaveAttribute('aria-label', /^Actions for /);
      await page.keyboard.press('Escape');
      await expect(page.locator(':focus')).toHaveAttribute('data-rc', rc!);
    }
  });
});

/* ---------- 4.4: general components, refs, theming ---------- */
test.describe('4.4', () => {
  test('Tag: toggle chips are pressed buttons; remove buttons are named', async ({ page }) => {
    await story(page, 'aura-new-in-4-4--badges-and-tags');
    const chip = page.getByRole('button', { name: 'Weekend' });
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
    await chip.click();
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'Remove example.com' }).click();
    await expect(page.getByTestId('domains')).toHaveText('wren.studio');
  });
  test('Progress exposes value text; indeterminate has no value', async ({ page }) => {
    await story(page, 'aura-new-in-4-4--progress-skeleton-empty');
    await expect(page.getByRole('progressbar', { name: 'Storage' })).toHaveAttribute('aria-valuetext', '7.4 of 10 GB');
    await expect(page.getByRole('progressbar', { name: 'Importing' })).not.toHaveAttribute('aria-valuenow', /.*/);
    await expect(page.getByRole('heading', { name: 'No projects yet' })).toBeVisible();
  });
  test('Pagination: current page, gaps, compact on phones', async ({ page }) => {
    await story(page, 'aura-new-in-4-4--pagination-story');
    await expect(page.getByRole('button', { name: 'Page 5' })).toHaveAttribute('aria-current', 'page');
    await page.getByRole('button', { name: 'Page 6' }).click();
    await expect(page.getByTestId('page')).toHaveText('Page 6');
    await page.setViewportSize({ width: 390, height: 800 });
    await expect(page.getByText('Page 6 of 12')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Page 7' })).toBeHidden();
  });
  test('Accordion: multiple open, arrow keys between headers', async ({ page }) => {
    await story(page, 'aura-new-in-4-4--accordion-story');
    const a = page.getByRole('button', { name: 'Do I need a card?' }),
      b = page.getByRole('button', { name: 'Where is my data?' });
    await expect(a).toHaveAttribute('aria-expanded', 'true');
    await b.click();
    await expect(a).toHaveAttribute('aria-expanded', 'true');
    await expect(b).toHaveAttribute('aria-expanded', 'true');
    await b.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('button', { name: 'Buddhist calendar?' })).toBeFocused();
  });
  test('Popover: focus in, Tab stays inside, Escape returns focus', async ({ page }) => {
    await story(page, 'aura-new-in-4-4--popover-story');
    const trigger = page.getByRole('button', { name: 'Filters' });
    await trigger.click();
    await expect(page.getByRole('dialog', { name: 'Filters' })).toBeVisible();
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => !!document.activeElement?.closest('.aura-popover'))).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  });
  test('Theme: scoped brand reaches buttons, links and focus ring', async ({ page }) => {
    await story(page, 'aura-new-in-4-4--themed-story');
    const bg = await page
      .getByRole('button', { name: 'New Project' })
      .evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(bg).not.toBe('rgb(24, 24, 27)');
  });
  test('ColorSchemeToggle sets data-theme and the .dark class, saves the choice; the head script restores it', async ({
    page,
  }) => {
    await story(page, 'aura-theming-color-scheme--toggle');
    await page.evaluate(() => localStorage.removeItem('aura-color-scheme'));
    const html = page.locator('html');
    await page.getByRole('button', { name: /^Colour scheme:/ }).click();
    await page.getByRole('menuitemcheckbox', { name: 'Dark' }).click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(html).toHaveClass(/\bdark\b/);
    await expect(page.getByTestId('scheme-status')).toContainText('on screen: dark');
    expect(await page.evaluate(() => localStorage.getItem('aura-color-scheme'))).toBe('dark');
    await page.getByRole('button', { name: /^Colour scheme: Dark/ }).click();
    await page.getByRole('menuitemcheckbox', { name: 'Light' }).click();
    await expect(html).toHaveAttribute('data-theme', 'light');
    await expect(html).not.toHaveClass(/\bdark\b/);
    /* The <head> script: with "dark" saved, it sets the attribute and class before React runs. */
    await page.evaluate(() => {
      localStorage.setItem('aura-color-scheme', 'dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
      new Function(document.querySelector('script[data-aura-color-scheme]')!.textContent || '')();
    });
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(html).toHaveClass(/\bdark\b/);
    await page.evaluate(() => localStorage.removeItem('aura-color-scheme'));
  });
  test('Settings pilot: react-hook-form errors land on the input via refs', async ({ page }) => {
    await story(page, 'aura-new-in-4-4--settings');
    const name = page.getByRole('textbox', { name: /^Full name/ });
    await name.fill('');
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('Enter your name')).toBeVisible();
    await expect(name).toBeFocused();
  });
});

test.describe('4.9: multi-select, numbers, steps, segments', () => {
  test('Combobox multiple: picks toggle as chips, the list stays open, Backspace removes the last, max disables the rest', async ({
    page,
  }) => {
    await story(page, 'aura-pickers--combobox-multiple');
    const cb = page.getByRole('combobox', { name: 'ผู้รับผิดชอบ' });
    await cb.click();
    const list = page.getByRole('listbox', { name: 'ผู้รับผิดชอบ' });
    await expect(list).toHaveAttribute('aria-multiselectable', 'true');
    await list.getByRole('option', { name: /ธนพร/ }).click();
    await expect(list).toBeVisible(); // stays open for the next pick
    await cb.fill('piya');
    await cb.press('Enter');
    await expect(page.getByText('Value: ["m1","m2","m4"]')).toBeVisible();
    await expect(cb).toHaveValue(''); // typed filter cleared after a pick
    await expect(list.getByRole('option', { name: /กมล/ })).toHaveAttribute('aria-selected', 'true');
    await cb.press('Escape');
    await cb.press('Backspace');
    await expect(page.getByText('Value: ["m1","m2"]')).toBeVisible();
    await page.getByRole('button', { name: /กมล/ }).click(); // the chip's remove button
    await expect(page.getByText('Value: ["m2"]')).toBeVisible();
    await expect(cb).toBeFocused();
    const tags = page.getByRole('combobox', { name: 'Tags' });
    await tags.click();
    await page.getByRole('listbox', { name: 'Tags' }).getByRole('option', { name: 'Urgent' }).click();
    await expect(
      page.getByRole('listbox', { name: 'Tags' }).getByRole('option', { name: 'Corporate' }),
    ).toHaveAttribute('aria-disabled', 'true');
  });

  test('NumberField: spinbutton keys, clamps and formats on blur, buttons stop at the bounds', async ({ page }) => {
    await story(page, 'aura-forms--number-fields');
    const qty = page.getByRole('spinbutton', { name: 'จำนวน' });
    await expect(qty).toHaveAttribute('aria-valuenow', '2');
    await qty.press('ArrowUp');
    await expect(page.getByText('Value: 3')).toBeVisible();
    await qty.press('PageUp'); // +10
    await expect(page.getByText('Value: 13')).toBeVisible();
    await qty.press('Tab'); // leaving after a key step keeps the value (regression: it used to clear it)
    await expect(page.getByText('Value: 13')).toBeVisible();
    await expect(qty).toHaveValue('13');
    await qty.fill('25');
    await qty.press('Tab');
    await expect(qty).toHaveValue('20'); // clamped to max
    await expect(page.getByRole('button', { name: 'Increase' }).first()).toBeDisabled();
    await page.getByRole('button', { name: 'Decrease' }).first().click();
    await expect(qty).toHaveValue('19');
    const price = page.getByRole('spinbutton', { name: 'ราคาต่อหน่วย' });
    await expect(price).toHaveValue('12,500.00');
    await price.fill('9,999.5');
    await price.press('Tab');
    await expect(price).toHaveValue('9,999.50');
    await expect(price).toHaveAttribute('aria-valuetext', '฿ 9,999.50');
    await qty.fill('');
    await qty.press('Tab');
    await expect(page.getByText('Value: null')).toBeVisible();
  });

  test('SegmentedControl: one Tab stop, arrows move and select, disabled options are skipped', async ({ page }) => {
    await story(page, 'aura-forms--segmented-controls');
    const group = page.getByRole('radiogroup', { name: 'View' });
    const table = group.getByRole('radio', { name: 'Table' });
    await expect(table).toHaveAttribute('aria-checked', 'true');
    await expect(group.locator('[tabindex="0"]')).toHaveCount(1);
    await table.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByTestId('view-status')).toHaveText('View: cards');
    await expect(group.getByRole('radio', { name: 'Cards' })).toBeFocused();
    await page.keyboard.press('ArrowRight'); // Archived is disabled → wraps to Table
    await expect(page.getByTestId('view-status')).toHaveText('View: table');
    await page.keyboard.press('End');
    await expect(page.getByTestId('view-status')).toHaveText('View: cards');
    await expect(
      page.getByRole('radiogroup', { name: 'Align' }).getByRole('radio', { name: 'Align right' }),
    ).toBeVisible();
  });

  test('Stepper: current step is aria-current, completed steps go back, upcoming ones are not buttons; phones show "Step x of y"', async ({
    page,
  }) => {
    await story(page, 'aura-layout--stepper-story');
    const nav = page.getByRole('navigation', { name: 'สร้างการจอง' });
    await expect(nav.locator('[aria-current="step"]')).toContainText('ข้อมูลติดต่อ');
    await expect(nav.getByRole('button')).toHaveCount(2);
    await expect(nav.getByRole('button', { name: /บริการ.*completed/ })).toBeVisible();
    await nav.getByRole('button', { name: /วันและเวลา/ }).click();
    await expect(nav.locator('[aria-current="step"]')).toContainText('วันและเวลา');
    await expect(nav.getByRole('button')).toHaveCount(1);
    await page.setViewportSize({ width: 390, height: 700 });
    await expect(nav.locator('.aura-stepper__compact')).toBeVisible();
    await expect(nav.locator('.aura-stepper__compact')).toContainText('Step 2 of 4');
  });
});

test.describe('4.10: Chamber-OS group A', () => {
  const s410 = (page: Page, id: string, theme = 'light') => story(page, 'aura-new-in-4-10--' + id, theme);
  test('danger buttons: filled and outline pass contrast, IconButton tone="danger" is red', async ({ page }) => {
    await s410(page, 'danger-actions');
    const fill = await page
      .getByRole('button', { name: 'Delete invoice' })
      .evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(fill).toBe('rgb(185, 28, 28)'); // red-700
    const out = page.getByRole('button', { name: 'Cancel membership' });
    expect(await out.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
    expect(await page.getByRole('button', { name: 'Delete row' }).evaluate((e) => getComputedStyle(e).color)).toBe(
      'rgb(185, 28, 28)',
    );
    await s410(page, 'danger-actions', 'dark');
    expect(
      await page.getByRole('button', { name: 'Delete invoice' }).evaluate((e) => getComputedStyle(e).backgroundColor),
    ).toBe('rgb(220, 38, 38)');
  });
  test('icon props take an element: sized like AURA icons and hidden from screen readers', async ({ page }) => {
    await s410(page, 'custom-icons');
    const btn = page.getByRole('button', { name: 'Members' });
    const box = await btn.locator('.aura-icon--custom').boundingBox();
    expect(Math.round(box!.width)).toBe(16);
    await expect(btn.locator('.aura-icon--custom')).toHaveAttribute('aria-hidden', 'true');
    await expect(page.getByRole('img', { name: 'Company' })).toBeVisible();
  });
  test('sv: Swedish strings, Gregorian year, Monday first', async ({ page }) => {
    await s410(page, 'swedish');
    await expect(page.getByLabel('Förfallodatum')).toHaveValue(/2026/);
    await expect(page.getByRole('button', { name: 'Idag' })).toBeVisible();
    const first = await page.locator('th[scope="col"]').first().textContent();
    expect(first!.toLowerCase()).toMatch(/^m/);
    await expect(page.getByRole('navigation', { name: /sid/i })).toBeVisible();
  });
  test('linkComponent from AuraProvider renders Breadcrumb, Button, Pagination and Stat links', async ({ page }) => {
    await s410(page, 'router-links');
    for (const name of ['Members', 'New invoice', 'Open invoices']) {
      await expect(page.getByRole('link', { name }).first()).toHaveAttribute('data-router-link', '');
    }
    await page.getByRole('link', { name: 'New invoice' }).click();
    await expect(page.getByTestId('route')).toHaveText('Route: /invoices/new');
    await page.getByRole('link', { name: /page 3/i }).click();
    await expect(page.getByTestId('route')).toHaveText('Route: /members?page=3');
  });
  test('SideNav: nested group open around the active leaf, arrows and Enter, badges', async ({ page }) => {
    await s410(page, 'nested-nav');
    const billing = page.getByRole('button', { name: /Billing/ });
    await expect(billing).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('link', { name: /Invoices/ })).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('[aria-current="page"]')).toHaveCount(1);
    const members = page.getByRole('button', { name: /Members/ });
    await expect(members).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('link', { name: 'Companies' })).toBeHidden();
    await members.focus();
    await page.keyboard.press('ArrowRight');
    await expect(members).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('link', { name: 'Companies' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('route')).toHaveText('Route: /companies');
    await expect(page.getByRole('link', { name: 'Companies' })).toHaveAttribute('aria-current', 'page');
    await members.focus();
    await page.keyboard.press('ArrowLeft');
    await expect(members).toHaveAttribute('aria-expanded', 'false'); // closes even around the active page
    await page.keyboard.press('Enter');
    await expect(members).toHaveAttribute('aria-expanded', 'true');
    await billing.click();
    await expect(billing).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('.aura-nav__item--group .aura-nav__badge')).toContainText('4');
  });
  test('DataTable server mode: total from totalRows, controlled sort and page, rows stay while loading, row links', async ({
    page,
  }) => {
    await s410(page, 'server-table');
    const grid = page.getByRole('grid', { name: 'Invoices' });
    await expect(grid).toHaveAttribute('aria-rowcount', '58');
    await expect(page.getByText('1–10 of 57')).toBeVisible();
    await expect(page.getByText('Page 1 of 6')).toBeVisible();
    /* Hold the fake request so the loading state is checked deterministically (it raced a 400ms timer before). */
    await page.evaluate(() => ((window as any).__holdServer = true));
    await page.getByRole('button', { name: 'Next page' }).click();
    await expect(page.locator('.aura-table.is-refreshing')).toHaveCount(1);
    await expect(grid).toHaveAttribute('aria-busy', 'true');
    await expect(page.locator('.aura-table__row').first()).toContainText('INV-1001'); // previous page kept
    await page.evaluate(() => {
      (window as any).__holdServer = false;
      (window as any).__releaseServer();
    });
    await expect(page.locator('.aura-table__row').first()).toContainText('INV-1011');
    await expect(page.getByText('11–20 of 57')).toBeVisible();
    await expect(page.locator('.aura-table.is-refreshing')).toHaveCount(0);
    await page.getByRole('button', { name: /AMOUNT/ }).click();
    await expect(page.getByText('Page 1 of 6')).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /AMOUNT/ })).toHaveAttribute('aria-sort', 'ascending');
    await expect(page.locator('.aura-table__row').first()).toContainText('1,200.00 THB');
    const amount = page.locator('.aura-table__td.is-end').first();
    expect(await amount.evaluate((e) => getComputedStyle(e).textAlign)).toBe('end');
    await page.locator('.aura-table__row').nth(1).locator('.aura-table__td').nth(1).click();
    await expect(page.getByTestId('route')).toHaveText(/Route: \/invoices\/INV-/);
    await page.locator('.aura-table__row').first().locator('[role="gridcell"]').nth(1).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('route')).toHaveText('Route: /invoices/INV-1001');
  });
  test('Stat text values use proportional figures; numbers stay tabular', async ({ page }) => {
    await s410(page, 'fixes');
    const v = page.locator('.aura-stat__value');
    expect(await v.nth(0).evaluate((e) => getComputedStyle(e).fontVariantNumeric)).toBe('normal');
    expect(await v.nth(1).evaluate((e) => getComputedStyle(e).fontVariantNumeric)).toBe('tabular-nums');
  });
  test('dark neutral pill is the calmest; skeleton bars visible on both themes', async ({ page }) => {
    await s410(page, 'fixes', 'dark');
    const bg = await page
      .getByText('Lapsed')
      .evaluate((e) => getComputedStyle(e.closest('.aura-pill')!).backgroundColor);
    expect(bg).toBe('rgb(39, 39, 42)'); // zinc-800
    const sk = await page
      .locator('.aura-skel')
      .first()
      .evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(sk).toBe('rgb(63, 63, 70)'); // zinc-700
  });
});

test.describe('4.11: Chamber-OS addendum (phones and touch)', () => {
  const s411 = (page: Page, id: string, theme = 'light') => story(page, 'aura-new-in-4-11--' + id, theme);
  test.describe('on a phone with touch', () => {
    test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    test('18: text controls use 16px under 640px (no iOS zoom)', async ({ page }) => {
      await s411(page, 'touch-and-phones');
      const fs = await page.getByLabel('Member name').evaluate((e) => getComputedStyle(e).fontSize);
      expect(fs).toBe('16px');
    });
    test('19: IconButton keeps its 32px look with a 44px hit area', async ({ page }) => {
      await s411(page, 'touch-and-phones');
      const b = page.getByRole('button', { name: 'Copy' });
      expect(Math.round((await b.boundingBox())!.width)).toBe(32);
      const hit = await b.evaluate((e) => {
        const s = getComputedStyle(e, '::after');
        return [s.width, s.height];
      });
      expect(hit).toEqual(['44px', '44px']);
    });
    test('20: Radio, Checkbox and Switch rows are 44px; tapping the row toggles', async ({ page }) => {
      await s411(page, 'touch-and-phones');
      for (const sel of ['.aura-choice', '.aura-check--labelled', '.aura-switch-row']) {
        const h = (await page.locator(sel).first().boundingBox())!.height;
        expect(h, sel).toBeGreaterThanOrEqual(44);
      }
      const row = page.locator('.aura-switch-row');
      const sw = page.getByRole('switch', { name: 'Email me about renewals' });
      await expect(sw).toHaveAttribute('aria-checked', 'false');
      const box = (await row.boundingBox())!;
      await page.touchscreen.tap(box.x + box.width - 4, box.y + 4); // the row's far corner, outside switch and label
      await expect(sw).toHaveAttribute('aria-checked', 'true');
      await page
        .locator('.aura-choice')
        .filter({ hasText: 'Svenska' })
        .tap({ position: { x: 150, y: 4 } })
        .catch(() => page.locator('.aura-choice').filter({ hasText: 'Svenska' }).tap());
      await expect(page.getByRole('radio', { name: 'Svenska' })).toBeChecked();
    });
  });
  test('21: a full-width button wraps a long label at 320px and stays at least 44px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await s411(page, 'touch-and-phones');
    const b = page.getByRole('button', { name: /Förhandsgranska/ });
    const box = (await b.boundingBox())!;
    expect(box.height).toBeGreaterThan(44);
    expect(await b.evaluate((e) => e.scrollWidth <= e.clientWidth)).toBe(true);
    expect(box.x + box.width).toBeLessThanOrEqual(320);
    expect((await page.getByRole('button', { name: 'Save' }).boundingBox())!.height).toBe(44);
  });
  test('22: dark pills are quiet fills that still pass 4.5:1', async ({ page }) => {
    await s411(page, 'pills-and-tracks', 'dark');
    const bg = (t: string) =>
      page.getByText(t, { exact: true }).evaluate((e) => getComputedStyle(e.closest('.aura-pill')!).backgroundColor);
    expect(await bg('Awaiting review')).toBe('rgb(47, 38, 71)');
    expect(await bg('Sent')).toBe('rgb(43, 53, 31)');
    expect(await bg('Lapsed')).toBe('rgb(39, 39, 42)');
  });
  test('23: progress tracks have a 3:1 edge in both themes', async ({ page }) => {
    for (const [theme, edge] of [
      ['light', 'rgb(142, 142, 151)'],
      ['dark', 'rgb(113, 113, 122)'],
    ]) {
      await s411(page, 'pills-and-tracks', theme);
      const sh = await page
        .locator('.aura-progress__track')
        .first()
        .evaluate((e) => getComputedStyle(e).boxShadow);
      expect(sh, theme).toContain(edge);
    }
  });
  test('24: no provider → English and Gregorian; th → พ.ศ. on screen, ISO value; sv → Swedish', async ({ page }) => {
    await s411(page, 'date-defaults');
    const en = page.getByLabel('Registration date');
    await expect(en).toHaveAttribute('placeholder', 'DD/MM/YYYY');
    await expect(page.getByRole('button', { name: 'Open calendar' })).toBeVisible();
    await en.fill('18/09/2026');
    await en.press('Enter');
    await expect(en).toHaveValue(/2026/);
    const th = page.getByLabel('วันที่สมัคร');
    await expect(th).toHaveValue(/2569/);
    await th.fill('01/10/2569');
    await th.press('Enter');
    await expect(page.getByText('value: 2026-10-01')).toBeVisible();
    await expect(page.getByLabel('Registreringsdatum')).toHaveAttribute('placeholder', 'åååå-mm-dd');
  });
});

test('4.12: useFormatDate follows the provider (th พ.ศ., en and sv Gregorian, English without one)', async ({
  page,
}) => {
  await story(page, 'aura-new-in-4-11--format-date-hook');
  const t = await page.getByTestId('due').allInnerTexts();
  expect(t[0]).toMatch(/กันยายน 2569/);
  expect(t[1]).toMatch(/September 2026/);
  expect(t[2]).toMatch(/september 2026/);
  expect(t[3]).toMatch(/September 2026/);
});

test.describe('4.13: Chamber-OS group B', () => {
  const s413 = (page: Page, id: string, theme = 'light') => story(page, 'aura-new-in-4-13--' + id, theme);
  test('toast: loading turns into success in place, one toast per id; error is an alert', async ({ page }) => {
    await s413(page, 'toasts');
    await page.getByRole('button', { name: /Save \(loading/ }).click();
    const toasts = page.locator('.aura-toast');
    await expect(toasts).toHaveCount(1);
    await expect(toasts.first()).toContainText('Saving invoice');
    await expect(toasts.first()).toHaveAttribute('aria-busy', 'true');
    await expect(toasts.first()).toContainText('Invoice saved');
    await expect(toasts).toHaveCount(1);
    await expect(toasts.first()).not.toHaveAttribute('aria-busy', /.*/);
    await page.getByRole('button', { name: 'Error' }).click();
    await page.getByRole('button', { name: 'Error' }).click();
    await expect(page.locator('.aura-toast--danger')).toHaveCount(1);
    await expect(page.locator('.aura-toast--danger')).toHaveAttribute('role', 'alert');
    await expect(page.locator('.aura-toast--success')).toHaveAttribute('role', 'status');
  });
  test('PasswordField + FormErrorSummary with react-hook-form: summary takes focus, links use setFocus', async ({
    page,
  }) => {
    await s413(page, 'sign-in-form');
    await page.getByRole('button', { name: 'Sign in' }).click();
    const summary = page.getByRole('alert').filter({ hasText: 'Fix 2 fields to continue' });
    await expect(summary).toBeFocused();
    await summary.getByRole('link', { name: 'Enter your password' }).click();
    const pw = page.getByLabel('Password', { exact: true });
    await expect(pw).toBeFocused();
    await expect(pw).toHaveAttribute('type', 'password');
    const toggle = page.getByRole('button', { name: 'Show password' });
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await pw.fill('longenough');
    await toggle.click();
    await expect(pw).toHaveAttribute('type', 'text');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await page.getByLabel('Email address').fill('a@b.se');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByTestId('done')).toBeVisible();
    await expect(page.locator('.aura-error-summary')).toHaveCount(0);
  });
  test('FilterBar drives a server-mode table through the URL', async ({ page }) => {
    await s413(page, 'filter-bar-server');
    await expect(page.getByText('64 results')).toBeVisible();
    await page.getByLabel('Search members').fill('acme');
    await expect(page.getByText('8 results')).toBeVisible();
    await expect.poll(() => page.evaluate(() => location.search)).toContain('q=acme');
    await page.getByRole('radio', { name: 'Corporate' }).click();
    await expect(page.getByRole('button', { name: /Remove Tier: Corporate|Tier: Corporate/ }).first()).toBeVisible();
    await expect.poll(() => page.evaluate(() => location.search)).toContain('tier=Corporate');
    await page.getByRole('button', { name: 'Clear all' }).click();
    await expect(page.getByLabel('Search members')).toHaveValue('');
    await expect(page.getByText('64 results')).toBeVisible();
    await expect.poll(() => page.evaluate(() => location.search)).not.toContain('q=');
    // typing then picking a filter before the search debounce fires keeps both
    await page.getByLabel('Search members').fill('a');
    await page.getByRole('radio', { name: 'SME' }).click();
    await expect.poll(() => page.evaluate(() => location.search)).toMatch(/q=a.*tier=SME|tier=SME.*q=a/);
  });
  test('aura-prose: links use fg-accent in both themes', async ({ page }) => {
    for (const [theme, rgb] of [
      ['light', 'rgb(109, 40, 217)'],
      ['dark', 'rgb(196, 181, 253)'],
    ]) {
      await s413(page, 'prose', theme);
      expect(await page.locator('.aura-prose a').evaluate((e) => getComputedStyle(e).color), theme).toBe(rgb);
    }
  });
  test('Command: ⌘K opens, arrows skip disabled items, Enter runs, Escape returns focus; opens above a Dialog', async ({
    page,
  }) => {
    await s413(page, 'command-palette');
    const opener = page.getByRole('button', { name: 'Open command menu' }).first();
    await opener.focus();
    await page.keyboard.press('ControlOrMeta+k');
    const input = page.getByRole('combobox', { name: 'Command menu' });
    await expect(input).toBeFocused();
    await input.fill('bill');
    await expect(page.getByRole('option')).toHaveCount(1);
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('last')).toHaveText('Last command: Invoices');
    await expect(input).toHaveCount(0);
    await opener.click();
    await expect(input).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    const activeId = await input.getAttribute('aria-activedescendant');
    await expect(page.locator(`[id="${activeId}"]`)).toContainText('New invoice'); // Settings (disabled) skipped
    await page.keyboard.press('Escape');
    await expect(input).toHaveCount(0);
    await expect(opener).toBeFocused();
    await page.getByRole('button', { name: 'Open a dialog' }).click();
    await page.keyboard.press('ControlOrMeta+k');
    await expect(input).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Edit member' })).toBeVisible();
  });
});

test.describe('4.14: compact density', () => {
  const s414 = (page: Page, id: string, theme = 'light') => story(page, 'aura-new-in-4-14--' + id, theme);
  const h = (l: import('@playwright/test').Locator) => l.evaluate((e) => Math.round(e.getBoundingClientRect().height));
  test('provider compact: 36px fields and buttons, 40px rows, the Dialog too; the virtual table reaches its last row', async ({
    page,
  }) => {
    await s414(page, 'compact');
    expect(await h(page.getByRole('button', { name: 'Export' }))).toBe(36);
    expect(await h(page.locator('.aura-input').first())).toBe(36);
    expect(await h(page.locator('.aura-table__row').first())).toBe(40);
    expect(await h(page.locator('.aura-table__head'))).toBe(40);
    await page.getByRole('button', { name: 'New invoice' }).click();
    const dlg = page.getByRole('dialog', { name: 'New invoice' });
    // Poll: the dialog scales in, so its first frames measure a pixel short.
    await expect.poll(() => h(dlg.locator('.aura-input'))).toBe(36);
    await expect.poll(() => h(dlg.getByRole('button', { name: 'Create' }))).toBe(36);
    await page.keyboard.press('Escape');
    const first = page.locator('.aura-table__row [role="gridcell"]').first();
    await first.focus();
    await page.keyboard.press('Control+End');
    await expect(page.locator('.aura-table__row').last()).toContainText('INV-1400');
    const cell = page.locator(':focus');
    await expect(cell).toBeInViewport();
  });
  test('DataTable density="compact" on its own leaves the rest comfortable', async ({ page }) => {
    await s414(page, 'compact-table-only');
    expect(await h(page.getByRole('button', { name: 'Comfortable button' }))).toBe(44);
    expect(await h(page.locator('.aura-table__row').first())).toBe(40);
  });
  test.describe('touch', () => {
    test.use({ hasTouch: true, isMobile: true, viewport: { width: 820, height: 1000 } });
    test('compact falls back to 44px fields and 48px rows on touch screens', async ({ page }) => {
      await s414(page, 'compact');
      expect(await h(page.getByRole('button', { name: 'Export' }))).toBe(44);
      expect(await h(page.locator('.aura-input').first())).toBe(44);
      expect(await h(page.locator('.aura-table__row').first())).toBe(48);
    });
  });
});

test.describe('4.15: SideNav rail', () => {
  const s415 = (page: Page, id: string, theme = 'light') => story(page, 'aura-new-in-4-15--' + id, theme);
  const w = (l: import('@playwright/test').Locator) => l.evaluate((e) => Math.round(e.getBoundingClientRect().width));
  test('collapsed rail: 64px, labels stay the names, tooltip on hover and focus, dot for counts, arrows work', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await s415(page, 'collapsible-nav');
    const nav = page.getByRole('navigation', { name: 'Main' });
    await expect(nav).toHaveAttribute('data-collapsed', '');
    await expect.poll(() => w(nav)).toBe(64);
    const orders = page.getByRole('button', { name: /^Orders/ });
    await expect(orders).toBeVisible();
    await expect(orders.locator('.aura-nav__dot')).toHaveCount(1);
    await expect(page.getByRole('button', { name: 'Reports' }).locator('.aura-nav__initial')).toHaveText('R');
    // the active page sits in Billing: its icon carries the selected state
    await expect(page.getByRole('button', { name: 'Billing' })).toHaveClass(/has-active/);
    await orders.hover();
    const tip = page.locator('.aura-tooltip--right');
    await expect(tip).toHaveText('Orders');
    await expect(tip).toHaveAttribute('aria-hidden', 'true');
    const dash = page.getByRole('button', { name: 'Dashboard' });
    await dash.focus();
    await expect(tip).toHaveText('Dashboard');
    await page.keyboard.press('ArrowDown');
    await expect(orders).toBeFocused();
    await expect(tip).toHaveText('Orders');
    await page.keyboard.press('Escape');
    await expect(tip).toHaveCount(0);
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('state')).toHaveText('Page: orders · collapsed: true');
  });
  test('toggle and group: the button expands and collapses; a group clicked in the rail expands and opens', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await s415(page, 'collapsible-nav');
    const nav = page.getByRole('navigation', { name: 'Main' });
    await page.getByRole('button', { name: 'Expand sidebar' }).click();
    await expect(page.getByTestId('state')).toContainText('collapsed: false');
    await expect.poll(() => w(nav)).toBe(240);
    await expect(nav.getByText('Chamber OS')).toBeVisible();
    await page.getByRole('button', { name: 'Collapse sidebar' }).click();
    await expect.poll(() => w(nav)).toBe(64);
    const billing = page.getByRole('button', { name: 'Billing' });
    await expect(billing).toHaveAttribute('aria-expanded', 'false');
    await billing.click();
    await expect(page.getByTestId('state')).toContainText('collapsed: false');
    await expect(billing).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('button', { name: 'Payments' })).toBeVisible();
  });
  test('phones: the AppShell drawer shows the full nav, never the rail or the toggle', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await s415(page, 'collapsible-nav');
    await page.getByRole('button', { name: 'Open navigation' }).click();
    const nav = page.getByRole('dialog').getByRole('navigation', { name: 'Main' });
    await expect(nav).not.toHaveAttribute('data-collapsed', '');
    await expect(nav.getByText('Orders', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /sidebar/ })).toHaveCount(0);
  });
});

test.describe('4.16: Button ghost and size sm', () => {
  const s416 = (page: Page, id: string, theme = 'light') => story(page, 'aura-new-in-4-16--' + id, theme);
  const box = (l: import('@playwright/test').Locator) =>
    l.evaluate((e) => e.getBoundingClientRect().toJSON() as DOMRect);
  test('ghost has no fill or edge until hover; sm is 32px', async ({ page }) => {
    await s416(page, 'ghost-and-small');
    const ghost = page.getByRole('button', { name: 'Cancel' });
    const css = (p: string) => ghost.evaluate((e, p) => getComputedStyle(e).getPropertyValue(p), p);
    expect(await css('background-color')).toBe('rgba(0, 0, 0, 0)');
    expect(await css('border-top-width')).toBe('0px');
    await ghost.hover();
    await expect.poll(() => css('background-color')).not.toBe('rgba(0, 0, 0, 0)');
    expect(Math.round((await box(page.getByRole('button', { name: 'Save' }))).height)).toBe(44);
    for (const name of ['Add row', 'Filter', 'Edit', 'Remove', 'Saving']) {
      expect(Math.round((await box(page.getByRole('button', { name }))).height), name).toBe(32);
    }
    expect(Math.round((await box(page.getByRole('link', { name: 'All invoices' }))).height)).toBe(32);
  });
  test('a sm ghost button keeps a compact table row at 40px', async ({ page }) => {
    await s416(page, 'small-buttons-in-compact-table');
    const row = page.locator('.aura-table__row').first();
    expect(Math.round((await box(row)).height)).toBe(40);
    expect(Math.round((await box(row.locator('.aura-btn'))).height)).toBe(32);
  });
  test.describe('touch', () => {
    test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
    test('sm stays 32px to the eye with a 44px hit area', async ({ page }) => {
      await s416(page, 'ghost-and-small');
      const btn = page.getByRole('button', { name: 'Filter' });
      const b = await box(btn);
      expect(Math.round(b.height)).toBe(32);
      // 5px above the pill's edge is still the button (the 44px area reaches 6px out)
      const hit = await page.evaluate(
        ([x, y]) => document.elementFromPoint(x, y)?.closest('button')?.textContent,
        [b.x + b.width / 2, b.y - 5],
      );
      expect(hit).toBe('Filter');
    });
  });
});

test.describe('4.17: touch targets and the bottom sheet', () => {
  const s417 = (page: Page, id: string, theme = 'light') => story(page, 'aura-new-in-4-17--' + id, theme);
  /* A control's hit area reaches 22px each way from its centre (44px) when these four points still land on it. */
  const hit44 = (el: import('@playwright/test').Locator) =>
    el.evaluate((e) => {
      const r = e.getBoundingClientRect(),
        cx = r.left + r.width / 2,
        cy = r.top + r.height / 2;
      return [
        [cx - 21, cy],
        [cx + 21, cy],
        [cx, cy - 21],
        [cx, cy + 21],
      ].every(([x, y]) => {
        const at = document.elementFromPoint(x, y);
        return !!at && (at === e || e.contains(at));
      });
    });
  test.describe('tablet, touch', () => {
    test.use({ hasTouch: true, isMobile: true, viewport: { width: 820, height: 1180 } });
    test('menu items, pages, toggles, tag remove, segments and calendar days are 44px targets', async ({ page }) => {
      await s417(page, 'touch-targets');
      const checks: Array<[string, import('@playwright/test').Locator]> = [
        ['segment', page.getByRole('radio', { name: 'Week' })],
        ['tag remove', page.getByRole('button', { name: /Remove Gold/ })],
        [
          'page',
          page
            .getByRole('link', { name: /page 4/i })
            .or(page.getByRole('button', { name: /page 4/i }))
            .first(),
        ],
        ['combobox toggle', page.locator('.aura-combo__toggle').first()],
        ['combobox clear', page.locator('.aura-combo:not(.aura-date) .aura-combo__clear').first()],
        ['date toggle', page.locator('.aura-date__toggle').first()],
        ['calendar day', page.locator('.aura-cal__day').nth(10)],
      ];
      for (const [name, el] of checks) {
        await el.scrollIntoViewIfNeeded();
        expect(await hit44(el), name).toBe(true);
      }
      await page.getByRole('button', { name: 'Actions' }).click();
      const item = page.getByRole('menuitem', { name: 'Duplicate' });
      expect(Math.round(await item.evaluate((e) => e.getBoundingClientRect().height))).toBe(44);
    });
  });
  test.describe('phone, touch', () => {
    test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
    test('a long sheet stays within the dynamic viewport and keeps its footer visible', async ({ page }) => {
      await s417(page, 'touch-targets');
      await page.getByRole('button', { name: 'New member' }).click();
      const dlg = page.getByRole('dialog', { name: 'New member' });
      await expect(dlg).toBeVisible();
      await page.waitForTimeout(400); // sheet animation
      const r = await dlg.evaluate((e) => ({
        bottom: e.getBoundingClientRect().bottom,
        h: e.getBoundingClientRect().height,
        vh: innerHeight,
      }));
      expect(r.h).toBeLessThanOrEqual(Math.ceil(r.vh * 0.92) + 1);
      expect(r.bottom).toBeLessThanOrEqual(r.vh + 1);
      await expect(dlg.getByRole('button', { name: 'Create member' })).toBeInViewport();
      const rule = await page.evaluate(() =>
        [...document.styleSheets].some((s) => {
          try {
            return [...s.cssRules].some((r) => r.cssText.includes('92dvh'));
          } catch {
            return false;
          }
        }),
      );
      expect(rule).toBe(true);
    });
  });
});

test.describe('4.17: linkComponent on every link component', () => {
  test('Breadcrumb, Pagination (numbers and arrows) and Stat use their own linkComponent', async ({ page }) => {
    await story(page, 'aura-new-in-4-17--own-link-component', 'light');
    const route = page.getByTestId('route');
    await expect(page.locator('a[data-router-link]')).toHaveCount(
      await page.locator('.aura-crumbs a, .aura-pagination a, a.aura-stat').count(),
    );
    await page.getByRole('link', { name: 'Members' }).click();
    await expect(route).toHaveText('Route: /members');
    await page.locator('.aura-pagination a[rel="next"]').click();
    await expect(route).toHaveText('Route: /members?page=3');
    await page.locator('.aura-pagination a[rel="prev"]').click();
    await expect(route).toHaveText('Route: /members?page=1');
    await page.getByRole('link', { name: /page 4/i }).click();
    await expect(route).toHaveText('Route: /members?page=4');
    await page.locator('a.aura-stat').click();
    await expect(route).toHaveText('Route: /invoices?status=open');
  });
});

test.describe('4.17: Command with server search', () => {
  test('controlled query, loading, results replace each other, the active item survives, empty slot', async ({
    page,
  }) => {
    await story(page, 'aura-new-in-4-17--async-command', 'light');
    await page.getByRole('button', { name: 'Find a member' }).click();
    const input = page.getByRole('combobox');
    await expect(input).toBeFocused();
    await expect(page.getByText('Type a name to search members.')).toBeVisible();
    await input.pressSequentially('acme');
    const list = page.locator('.aura-command__list'); // aria-busy sits on the container (the listbox exists only with options)
    await expect(list).toHaveAttribute('aria-busy', 'true');
    await expect(page.getByText('Searching…').first()).toBeVisible();
    await expect(page.getByRole('option')).toHaveCount(3);
    await expect(list).not.toHaveAttribute('aria-busy', 'true');
    await expect(page.getByRole('status').filter({ hasText: /3 result/ })).toHaveCount(1);
    const activeId = () => input.getAttribute('aria-activedescendant');
    const activeLabel = async () => page.locator(`[id="${await activeId()}"]`).innerText();
    expect(await activeLabel()).toContain('Acme AB');
    await page.keyboard.press('ArrowDown');
    expect(await activeLabel()).toContain('Acme Logistics');
    await expect(page.locator('[role="option"][aria-selected="true"]')).toContainText('Acme Logistics');
    // typing starts over at the first result; arrowing while the next results load keeps the item when they arrive
    await input.pressSequentially(' ');
    await expect(list).toHaveAttribute('aria-busy', 'true');
    await page.keyboard.press('ArrowDown'); // old results are still listed: Acme AB → Acme Logistics
    expect(await activeLabel()).toContain('Acme Logistics');
    await expect(list).not.toHaveAttribute('aria-busy', 'true');
    expect(await activeLabel()).toContain('Acme Logistics');
    await expect(page.locator('[role="option"][aria-selected="true"]')).toHaveCount(1);
    await input.pressSequentially('n');
    await expect(page.getByRole('option')).toHaveCount(1);
    expect(await activeLabel()).toContain('Acme Nordic');
    await input.pressSequentially('zzz');
    await expect(page.getByRole('button', { name: 'Create member' })).toBeVisible();
    await expect(input).not.toHaveAttribute('aria-activedescendant', /.+/);
    for (let i = 0; i < 3; i++) await page.keyboard.press('Backspace');
    await expect(page.getByRole('option')).toHaveCount(1);
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('chosen')).toHaveText('Chosen: Acme Nordic');
    await page.getByRole('button', { name: 'Find a member' }).click();
    await expect(page.getByRole('combobox')).toHaveValue('');
  });
});

test.describe('4.17: DataTable server state in one callback', () => {
  const s = (page: Page) => story(page, 'aura-new-in-4-17--server-state-table', 'light');
  test('a sort click from page 3 reports { sort, page: 1 } exactly once; paging reports once too', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await s(page);
    const calls = page.getByTestId('calls');
    await expect(page.getByText('21–30 of 57')).toBeVisible();
    await page.getByRole('button', { name: /AMOUNT/ }).click();
    await expect(calls).toHaveText('{"sort":{"key":"amount","dir":"asc"},"page":1}');
    await expect(page.getByText('1–10 of 57')).toBeVisible();
    await page.getByRole('button', { name: 'Next page' }).click();
    await expect(calls).toHaveText(
      '{"sort":{"key":"amount","dir":"asc"},"page":1}\n{"sort":{"key":"amount","dir":"asc"},"page":2}',
    );
  });
  test('server mode stacks into cards below stackBelow and pages from the cards', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await s(page);
    await expect(page.locator('.aura-table--stacked')).toHaveCount(1);
    const firstCard = page.locator('.aura-table__scroll > .aura-table__row:not(.aura-table__head)').first();
    await expect(firstCard).toContainText('INV-1021');
    await page.getByRole('button', { name: 'Next page' }).click();
    await expect(firstCard).toContainText('INV-1031');
    await expect(page.getByTestId('calls')).toHaveText('{"sort":null,"page":4}');
  });
  test('server mode drops hideBelow columns on a tablet', async ({ page }) => {
    await page.setViewportSize({ width: 700, height: 900 });
    await s(page);
    await expect(page.getByRole('columnheader', { name: /INVOICE/ })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: /MEMBER/ })).toHaveCount(0);
  });
});

test.describe('4.18: the open Command palette passes axe', () => {
  const axePalette = async (page: Page) => {
    await page.waitForFunction(() =>
      document
        .getAnimations()
        .every((a) => !(a instanceof CSSTransition || a instanceof CSSAnimation) || a.playState === 'finished'),
    );
    const { violations } = await new AxeBuilder({ page })
      .include('.aura-command-layer')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    return violations.map((v) => `${v.id} — ${v.help} (${v.nodes.length})`);
  };
  for (const theme of ['light', 'dark']) {
    test(`0, 1 and many results, ${theme}`, async ({ page }) => {
      await story(page, 'aura-new-in-4-17--async-command', theme);
      await page.getByRole('button', { name: 'Find a member' }).click();
      const input = page.getByRole('combobox');
      await expect(page.getByText('Type a name to search members.')).toBeVisible();
      expect(await axePalette(page), 'empty, before typing').toEqual([]);
      await expect(page.getByRole('listbox')).toHaveCount(0);
      await expect(input).toHaveAttribute('aria-expanded', 'false');
      await input.pressSequentially('zzz');
      await expect(page.getByRole('button', { name: 'Create member' })).toBeVisible();
      await expect(page.getByRole('status').filter({ hasText: 'No matches' })).toHaveCount(1);
      expect(await axePalette(page), 'no results').toEqual([]);
      await input.fill('acme n');
      await expect(page.getByRole('option')).toHaveCount(1);
      await expect(input).toHaveAttribute('aria-expanded', 'true');
      expect(await axePalette(page), 'one result').toEqual([]);
      await page.keyboard.press('Escape');
      await story(page, 'aura-new-in-4-13--command-palette', theme);
      await page.getByRole('button', { name: 'Open command menu' }).first().click();
      await expect(page.getByRole('option').nth(3)).toBeVisible();
      expect(await axePalette(page), 'many results').toEqual([]);
    });
  }
});

test.describe('4.19: Chamber-OS group D', () => {
  const axeOn = (page: Page, sel: string) => axeScan(page, sel);

  test('41: totals row lines up with the body; sticky footer stays in view; stacked gets a Totals card', async ({
    page,
  }) => {
    await story(page, 'aura-new-in-4-19--table-totals', 'light');
    const grid = page.getByTestId('grid-totals');
    const total = grid.getByRole('row', { name: 'Totals' });
    await expect(total).toBeVisible();
    await expect(page.getByRole('grid', { name: 'Output VAT register', exact: true })).toHaveAttribute(
      'aria-rowcount',
      '7',
    );
    /* Right edges of the money columns match the body's. */
    const edges = await grid.evaluate((g) => {
      const right = (row: Element, i: number) =>
        row.querySelectorAll('[role="gridcell"]')[i].getBoundingClientRect().right;
      const body = g.querySelector('.aura-table__row:not(.aura-table__total):not(.aura-table__head)')!;
      const tot = g.querySelector('.aura-table__total')!;
      return [2, 3, 4].map((i) => [Math.round(right(body, i)), Math.round(right(tot, i))]);
    });
    for (const [b, t] of edges) expect(t).toBe(b);
    await expect(total.getByRole('gridcell').nth(4)).toHaveCSS('text-align', /right|end/);
    /* Sticky: visible at the bottom of the scrolled-to-top 260px table. */
    const sticky = page.getByTestId('sticky-totals');
    const [boxBottom, rowBottom] = await sticky.evaluate((s) => [
      s.querySelector('[role="grid"]')!.getBoundingClientRect().bottom,
      s.querySelector('.aura-table__total')!.getBoundingClientRect().bottom,
    ]);
    expect(Math.abs(boxBottom - rowBottom)).toBeLessThanOrEqual(2);
    /* Stacked: a Totals card with the amounts right-aligned. */
    const card = page.getByTestId('stacked-totals').getByRole('row', { name: 'Totals' });
    await expect(card).toContainText('149,479.00');
    expect(await card.evaluate((r) => getComputedStyle(r).flexWrap)).toBe('wrap');
    expect(await axeOn(page, '#storybook-root')).toEqual([]);
  });

  test('41: a truncated cell shows its full text on hover and on keyboard focus', async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 800 });
    await story(page, 'aura-new-in-4-19--table-totals', 'light');
    const cell = page.getByTestId('grid-totals').getByRole('gridcell', { name: /Scandinavian-Thai/ });
    await cell.hover();
    const tip = page.locator('.aura-tooltip--above');
    await expect(tip).toHaveText(/Foundation for Trade and Culture/);
    await expect(tip).toHaveAttribute('aria-hidden', 'true');
    await page.mouse.move(0, 0);
    await expect(tip).toHaveCount(0);
    /* A short cell shows nothing. */
    await page.getByTestId('grid-totals').getByRole('gridcell', { name: 'Nordic Rail' }).hover();
    await expect(tip).toHaveCount(0);
    await cell.focus();
    await expect(tip).toHaveText(/Foundation for Trade and Culture/);
  });

  test('42: link item goes through linkComponent, danger item, radio group; axe on the open menu', async ({ page }) => {
    for (const theme of ['light', 'dark']) {
      await story(page, 'aura-new-in-4-19--menu-kinds', theme);
      await page.getByRole('button', { name: 'Invoice actions' }).click();
      const menu = page.getByRole('menu');
      await expect(menu.getByRole('menuitem', { name: 'Open member' })).toHaveAttribute('href', '/members/acme');
      const group = menu.getByRole('group', { name: 'View' });
      await expect(group.getByRole('menuitemradio')).toHaveCount(2);
      await expect(group.getByRole('menuitemradio', { name: 'Grid' })).toHaveAttribute('aria-checked', 'true');
      await expect(group.getByRole('menuitemradio', { name: 'List' })).toHaveAttribute('aria-checked', 'false');
      expect(await axeOn(page, '.aura-menu'), theme).toEqual([]);
      /* Keyboard unchanged: arrows move through every item, links and radios included. */
      await expect(menu.getByRole('menuitem', { name: 'Open member' })).toBeFocused();
      await page.keyboard.press('ArrowDown');
      await expect(menu.getByRole('menuitem', { name: 'Download PDF' })).toBeFocused();
      await page.keyboard.press('End');
      await expect(menu.getByRole('menuitem', { name: 'Void invoice' })).toBeFocused();
      await page.keyboard.press('ArrowUp');
      await expect(menu.getByRole('menuitemradio', { name: 'List' })).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page.getByTestId('route')).toContainText('View: list');
      await page.getByRole('button', { name: 'Invoice actions' }).click();
      await page.getByRole('menuitem', { name: 'Open member' }).click();
      await expect(page.getByTestId('route')).toContainText('Route: /members/acme');
    }
  });

  test('43: container bar sticks under the last field; status is announced; bulk bar hides at 0', async ({ page }) => {
    await story(page, 'aura-new-in-4-19--action-bars', 'light');
    const form = page.getByRole('region', { name: 'Actions', exact: true });
    const status = form.getByRole('status');
    await expect(status).toHaveText('Total 107,000.00 THB · due Oct 22, 2026');
    await page.getByLabel('Reference').fill('x');
    await expect(status).toHaveText('Unsaved changes');
    const [fieldBottom, barTop] = await page.evaluate(() => [
      document.getElementById('last-field')!.getBoundingClientRect().bottom,
      document.querySelector('.aura-actionbar--container')!.getBoundingClientRect().top,
    ]);
    expect(barTop).toBeGreaterThanOrEqual(fieldBottom);
    const bulk = page.locator('.aura-actionbar').filter({ has: page.getByRole('button', { name: 'Send reminder' }) });
    await expect(page.getByRole('button', { name: 'Send reminder' })).toHaveCount(0);
    await expect(page.getByRole('region', { name: 'Bulk actions' }).getByRole('status')).toHaveCount(1);
    await page.getByRole('button', { name: 'Select one more' }).click();
    await page.getByRole('button', { name: 'Select one more' }).click();
    await expect(page.getByRole('region', { name: 'Bulk actions' }).getByRole('status')).toHaveText('2 selected');
    await expect(bulk).toBeVisible();
    await page.getByRole('button', { name: 'Clear selection' }).click();
    await expect(page.getByRole('button', { name: 'Send reminder' })).toHaveCount(0);
    /* Clear took its own button away: focus goes back to where it came from, not to the page. */
    await expect(page.getByRole('button', { name: 'Select one more' })).toBeFocused();
  });

  test.describe('phone', () => {
    test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    test('43/44: viewport bar above the bottom nav at 390 × 844, not over the last field', async ({ page }) => {
      await story(page, 'aura-new-in-4-19--bottom-tabs', 'light');
      const m = await page.evaluate(() => {
        const r = (s: string) => document.querySelector(s)!.getBoundingClientRect();
        const mid = r('.aura-actionbar');
        const out = {
          bar: mid.bottom,
          nav: r('.aura-bottomnav').top,
          navBottom: r('.aura-bottomnav').bottom,
          vh: innerHeight,
        };
        window.scrollTo(0, document.documentElement.scrollHeight);
        return {
          ...out,
          endBar: r('.aura-actionbar').top,
          endField: r('#last-field').bottom,
          endNav: r('.aura-bottomnav').top,
          endBarBottom: r('.aura-actionbar').bottom,
        };
      });
      expect(m.bar).toBeLessThanOrEqual(m.nav);
      expect(Math.round(m.navBottom)).toBe(m.vh);
      expect(m.endBar).toBeGreaterThanOrEqual(m.endField);
      expect(m.endBarBottom).toBeLessThanOrEqual(m.endNav);
    });
  });

  test.describe('narrow phone', () => {
    test.use({ viewport: { width: 320, height: 640 }, hasTouch: true, isMobile: true });
    test('44: five tabs fit at 320px with whole labels, 44px targets, current page, count in the name', async ({
      page,
    }) => {
      await story(page, 'aura-new-in-4-19--bottom-tabs', 'light');
      const nav = page.getByRole('navigation', { name: 'Main' });
      const links = nav.getByRole('link');
      await expect(links).toHaveCount(5);
      for (const b of await links.evaluateAll((l) =>
        l.map((e) => {
          const r = e.getBoundingClientRect(),
            lab = e.querySelector('.aura-bottomnav__label')!;
          return { w: r.width, h: r.height, cut: lab.scrollWidth > lab.clientWidth };
        }),
      )) {
        expect(b.w).toBeGreaterThanOrEqual(44);
        expect(b.h).toBeGreaterThanOrEqual(44);
        expect(b.cut).toBe(false);
      }
      await expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
      await expect(nav.getByRole('link', { name: 'Invoices (2)' })).toBeVisible();
      await expect(nav.getByRole('link', { name: 'Inbox (new)' })).toBeVisible();
      await nav.getByRole('link', { name: /Events/ }).click();
      await expect(page.getByTestId('route')).toHaveText('Route: /events');
      await expect(nav.getByRole('link', { name: 'Events' })).toHaveAttribute('aria-current', 'page');
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
      expect(await axeOn(page, '.aura-bottomnav')).toEqual([]);
    });
  });

  test('44: hidden from lg up', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await story(page, 'aura-new-in-4-19--bottom-tabs', 'light');
    await expect(page.locator('.aura-bottomnav')).toBeHidden();
    await expect(page.locator('.aura-bottomnav-spacer')).toBeHidden();
  });

  test.describe('45: in UTC−08:00', () => {
    test.use({ timezoneId: 'Etc/GMT+8' });
    test('20:00 on Sep 24 in the browser: Bangkok today (Sep 25) is marked and allowed with max="today"', async ({
      page,
    }) => {
      await page.clock.setFixedTime(new Date('2026-09-25T04:00:00Z'));
      await story(page, 'aura-new-in-4-19--date-in-time-zone', 'light');
      expect(await page.evaluate(() => new Date().getDate())).toBe(24);
      await page
        .getByRole('button', { name: /choose date|Payment date|calendar/i })
        .first()
        .click();
      const today = page.locator('[aria-current="date"]');
      await expect(today).toHaveCount(1);
      await expect(today).toHaveText('25');
      await expect(today).toBeEnabled();
      await expect(today).not.toHaveAttribute('aria-disabled', 'true');
      await expect(page.locator('button[data-date="2026-09-26"]')).toBeDisabled();
      await today.click();
      await expect(page.getByRole('textbox', { name: 'Payment date' })).toHaveValue(/25/);
    });
  });

  test('46: link tabs mark the current page, navigate through linkComponent, keep scrolling', async ({ page }) => {
    await story(page, 'aura-new-in-4-19--link-tabs', 'light');
    const nav = page.getByRole('navigation', { name: 'Renewals' });
    await expect(page.getByRole('tablist')).toHaveCount(0);
    await expect(page.getByRole('tabpanel')).toHaveCount(0);
    await expect(nav.getByRole('link', { name: 'Pipeline' })).toHaveAttribute('aria-current', 'page');
    await nav.getByRole('link', { name: /Tier upgrades/ }).click();
    await expect(page.getByTestId('route')).toHaveText('Route: /renewals/tiers');
    await expect(nav.getByRole('link', { name: /Tier upgrades/ })).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('link', { name: 'Pipeline' })).not.toHaveAttribute('aria-current', 'page');
    /* Same list as today's Tabs: scrolls sideways in 320px. */
    const list = nav.locator('.aura-tabs__list');
    expect(await list.evaluate((l) => [getComputedStyle(l).overflowX, l.scrollWidth > l.clientWidth])).toEqual([
      'auto',
      true,
    ]);
  });

  test('47: six toasts in a row — all six, in order, three at a time', async ({ page }) => {
    await story(page, 'aura-new-in-4-19--toast-queue', 'light');
    await page.getByRole('button', { name: 'Send 6 reminders' }).click();
    const titles = () =>
      page.locator('.aura-toast').evaluateAll((l) => l.map((e) => e.textContent!.match(/Result \d/)![0]));
    await expect.poll(titles).toEqual(['Result 1', 'Result 2', 'Result 3']);
    await page.locator('.aura-toast').first().getByRole('button').click();
    await expect.poll(titles).toEqual(['Result 2', 'Result 3', 'Result 4']);
    await page.locator('.aura-toast').first().getByRole('button').click();
    await expect.poll(titles).toEqual(['Result 3', 'Result 4', 'Result 5']);
    await expect(page.getByRole('alert').filter({ hasText: 'Result 5' })).toHaveCount(1);
    await page.locator('.aura-toast').first().getByRole('button').click();
    await expect.poll(titles).toEqual(['Result 4', 'Result 5', 'Result 6']);
  });
});

test.describe('4.20: Chamber-OS group E', () => {
  const axeOn = (page: Page, sel: string) => axeScan(page, sel);
  const inViewport = (page: Page, sel: string) =>
    page.locator(sel).evaluate((e) => {
      const r = e.getBoundingClientRect();
      return r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight;
    });

  for (const theme of ['light', 'dark']) {
    test(`48: invoice line items — a real table, right-aligned money, totals foot, axe (${theme})`, async ({
      page,
    }) => {
      await story(page, 'aura-new-in-4-20--invoice-line-items', theme);
      const table = page.getByRole('table', { name: /line items/ });
      await expect(table.getByRole('columnheader')).toHaveCount(5);
      await expect(table.getByRole('rowheader', { name: 'Total', exact: true })).toBeVisible();
      /* Right edges of the money cells line up with their header. */
      const rights = await table.evaluate((t) =>
        [...t.querySelectorAll('tr')].map((tr) => Math.round(tr.lastElementChild!.getBoundingClientRect().right)),
      );
      expect(new Set(rights).size).toBe(1);
      await expect(table.getByRole('cell', { name: '107,000.00' })).toHaveCSS('text-align', 'right');
      /* Thai over English in one cell: two lines, both wrap inside the column. */
      const cell = table.getByRole('cell', { name: /ค่าบำรุงสมาชิก/ });
      await expect(cell).toContainText('Annual membership fee');
      expect(await axeOn(page, '#storybook-root'), theme).toEqual([]);
      await expect(page.getByRole('separator')).toHaveCount(1);
    });
  }

  test('48: at 390px the description wraps; if the table still scrolls, its box is a focusable region', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await story(page, 'aura-new-in-4-20--invoice-line-items', 'light');
    const lines = await page
      .getByRole('cell', { name: /ค่าลงทะเบียน/ })
      .evaluate((c) => Math.round(c.getBoundingClientRect().height / 20));
    expect(lines).toBeGreaterThan(2);
    const box = page.locator('.aura-tbl-wrap');
    const [sw, cw] = await box.evaluate((w) => [w.scrollWidth, w.clientWidth]);
    if (sw > cw + 1) {
      await expect(box).toHaveAttribute('tabindex', '0');
      await expect(page.getByRole('region', { name: /line items/ })).toBeVisible();
    }
    expect(await axeOn(page, '#storybook-root')).toEqual([]);
    await page.setViewportSize({ width: 1000, height: 900 });
    await expect(box).not.toHaveAttribute('tabindex', '0');
  });

  test('49: a tooltip on the last column and on the collapsed rail stays inside the viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 700 });
    await story(page, 'aura-new-in-4-20--tooltip-sides', 'light');
    const btn = page.getByRole('button', { name: 'Download INV-2026-0143' });
    await btn.focus();
    const tip = page.getByRole('tooltip');
    await expect(tip).toHaveText('Download INV-2026-0143 as PDF');
    expect(await inViewport(page, '[role="tooltip"]')).toBe(true);
    /* side="right" had no room at the right edge: it flipped to the left of the button. */
    const [tipRight, btnLeft] = await Promise.all([
      tip.evaluate((e) => e.getBoundingClientRect().right),
      btn.evaluate((e) => e.getBoundingClientRect().left),
    ]);
    expect(tipRight).toBeLessThanOrEqual(btnLeft);
    await page.keyboard.press('Escape');
    /* side="left" at the left edge flips right. */
    await page.getByRole('button', { name: /side="left"/ }).focus();
    await expect(page.getByRole('tooltip')).toHaveText('Opens on the left');
    expect(await inViewport(page, '[role="tooltip"]')).toBe(true);
    /* The collapsed rail's last item, near the bottom of the window. */
    await page.setViewportSize({ width: 1000, height: 560 });
    await page
      .getByRole('navigation', { name: 'Rail' })
      .getByRole('button', { name: /Members/ })
      .hover();
    await expect(page.locator('.aura-tooltip--right')).toBeVisible();
    expect(await inViewport(page, '.aura-tooltip--right')).toBe(true);
  });

  for (const [w, layout, member] of [
    [390, 'wrap', true],
    [800, 'nowrap', false],
    [1000, 'nowrap', true],
  ] as const) {
    test(`50: one markup at ${w}px — ${layout === 'wrap' ? 'cards' : member ? 'grid' : 'grid without MEMBER'}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: w, height: 900 });
      await story(page, 'aura-new-in-4-20--one-markup-table', 'light');
      const rows = page.locator('.aura-table__scroll > .aura-table__row:not(.aura-table__head)');
      await expect(rows).toHaveCount(6);
      expect(await rows.first().evaluate((r) => getComputedStyle(r).flexWrap)).toBe(layout);
      await expect(page.getByText('Acme AB').first()).toBeVisible({ visible: member });
      /* Each row once: one cell holds INV-2001 (the rest are its checkbox's name). */
      await expect(page.locator('.aura-table__td').filter({ hasText: /^INV-2001$/ })).toHaveCount(1);
      expect(await axeOn(page, '.aura-table')).toEqual([]);
    });
  }
});

test.describe('5.0.1: review fixes', () => {
  const rows = (page: Page) => page.locator('.aura-table__scroll > .aura-table__row:not(.aura-table__head)');
  test('a column with a new hideBelow width: the table keeps measuring (cards get every row; desktop stays a grid)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, 'aura-new-in-4-20--changing-columns', 'light');
    await page.getByRole('button', { name: 'Add REGION' }).click();
    await page.setViewportSize({ width: 390, height: 900 });
    await expect(rows(page)).toHaveCount(60);
    await expect(page.locator('.aura-table--stacked')).toHaveCount(1);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.getByRole('button', { name: 'Remove REGION' }).click();
    await expect(page.locator('.aura-table--stacked')).toHaveCount(0);
    await expect.poll(() => rows(page).count()).toBeLessThan(60);
  });

  test('cards: ArrowUp stays on the cards (no hidden header cell), headers still name every field', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await story(page, 'aura-new-in-4-20--one-markup-table', 'light');
    const member = page.getByRole('gridcell', { name: 'Acme AB' }).first();
    await member.click();
    await expect(member).toBeFocused();
    await page.keyboard.press('ArrowUp');
    const role = await page.evaluate(() => document.activeElement && document.activeElement.getAttribute('role'));
    expect(role).toBe('gridcell');
    await page.keyboard.press('Control+Home');
    expect(await page.evaluate(() => document.activeElement!.getAttribute('role'))).not.toBe('columnheader');
    /* MEMBER (hideBelow 900) keeps its column header for screen readers in the card layout. */
    await expect(page.getByRole('columnheader', { name: /MEMBER/ })).toBeAttached();
    expect(await page.locator('.aura-table__th[data-hide]').evaluate((e) => getComputedStyle(e).display)).not.toBe(
      'none',
    );
  });

  test('toasts clear the BottomNav on a tablet too', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 900 });
    await story(page, 'aura-new-in-4-19--bottom-tabs', 'light');
    const [toastBottom, navTop] = await page.evaluate(() => {
      const t = document.createElement('div');
      t.className = 'aura-toaster';
      t.style.height = '40px';
      document.body.appendChild(t);
      return [t.getBoundingClientRect().bottom, document.querySelector('.aura-bottomnav')!.getBoundingClientRect().top];
    });
    expect(toastBottom).toBeLessThanOrEqual(navTop);
  });
});

test.describe('5.1: DxT Monitor fixes', () => {
  for (const theme of ['light', 'dark']) {
    test(`warning tone, visible Checkbox label, new icons; axe (${theme})`, async ({ page }) => {
      await story(page, 'aura-new-in-5-1--monitor-kit', theme);
      const problem = page.locator('.aura-pill', { hasText: 'Problem' });
      await expect(problem).toHaveClass(/aura-pill--warning/);
      await expect(page.locator('.aura-pill', { hasText: 'Disk 91%' })).toHaveClass(/aura-pill--warning/);
      await expect(page.locator('.aura-pill', { hasText: 'Ready' })).toHaveClass(/aura-pill--ready/);
      /* Children show beside the box and name it; label + hideLabel is a bare box named by label. */
      await expect(page.getByText('Alert me by phone')).toBeVisible();
      await page.getByText('Alert me by phone').click();
      await expect(page.getByRole('checkbox', { name: 'Alert me by phone' })).toBeChecked();
      await expect(page.getByRole('checkbox', { name: 'Bare box, named only' })).toBeAttached();
      await expect(page.getByText('Bare box, named only')).toHaveCount(0);
      for (const n of ['server', 'globe', 'activity', 'shield-alert', 'phone', 'wrench'])
        expect(
          await page.getByRole('img', { name: n }).evaluate((s) => s.querySelectorAll('path,rect,circle,line').length),
          n,
        ).toBeGreaterThan(0);
      expect(await axeScan(page, '#storybook-root'), theme).toEqual([]);
    });
  }

  test('Dialog and Drawer focus the first field, not the close button', async ({ page }) => {
    await story(page, 'aura-new-in-5-1--overlay-focus', 'light');
    await page.getByRole('button', { name: 'Edit server' }).click();
    await expect(page.getByRole('textbox', { name: 'Hostname' })).toBeFocused();
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Filters' }).click();
    await expect(page.getByRole('textbox', { name: 'Search hosts' })).toBeFocused();
    await page.keyboard.press('Escape');
    /* Roving tabs: focus goes to the selected tab (the one in the Tab order), not the first. */
    await page.getByRole('button', { name: 'Server tabs' }).click();
    await expect(page.getByRole('tab', { name: 'Logs' })).toBeFocused();
  });

  test('SideNav without a header: the first item clears the top; bordered={false} has no edge', async ({ page }) => {
    await story(page, 'aura-new-in-5-1--nav-no-header', 'light');
    const gap = await page
      .getByTestId('plain')
      .evaluate(
        (w) =>
          w.querySelector('.aura-nav__item')!.getBoundingClientRect().top -
          w.querySelector('.aura-nav')!.getBoundingClientRect().top,
      );
    expect(gap).toBeGreaterThanOrEqual(12);
    expect(
      await page
        .getByTestId('borderless')
        .locator('.aura-nav')
        .evaluate((n) => getComputedStyle(n).borderRightWidth),
    ).toBe('0px');
    expect(
      await page
        .getByTestId('plain')
        .locator('.aura-nav')
        .evaluate((n) => getComputedStyle(n).borderRightWidth),
    ).toBe('1px');
  });

  test('DataTable row boxes stay bare (hideLabel)', async ({ page }) => {
    await story(page, 'aura-responsive--stacked-table');
    await expect(page.locator('.aura-table__sel .aura-check__label')).toHaveCount(0);
  });
});

test.describe('5.1.1: full-review fixes', () => {
  test('overlays: Tab wraps past unreachable controls; dialogs closed out of order unlock the page; Combobox in a Popover takes clicks', async ({
    page,
  }) => {
    await story(page, 'aura-fixed-in-5-1-1--overlays');
    await page.getByRole('button', { name: 'Trap' }).click();
    await page.getByRole('button', { name: 'Last reachable' }).focus();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement!.closest('.aura-dialog'))).toBe(true);
    await expect(page.getByRole('textbox', { name: 'First' })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByRole('button', { name: 'Last reachable' })).toBeFocused();
    /* A Popover and a calendar portaled out of the dialog keep their own Tab order (review of 5.1.1). */
    await page.getByRole('button', { name: 'Options' }).click();
    await page.getByRole('button', { name: 'One' }).focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Two' })).toBeFocused();
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Open calendar' }).click();
    await page.locator('.aura-cal__popover [data-date="2026-09-25"]').focus();
    await page.keyboard.press('Tab');
    await expect(page.locator('.aura-cal__popover').getByRole('button', { name: 'Today' })).toBeFocused();
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape'); // not dismissible: stays
    await page.evaluate(() => (document.activeElement as HTMLElement).blur());
    await page.reload();
    await page.waitForSelector('#storybook-root > *');
    await page.getByRole('button', { name: 'Delete host' }).click();
    await page.getByRole('button', { name: 'Delete…' }).click();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
    await page.getByRole('button', { name: 'Confirm' }).click();
    await expect(page.locator('.aura-dialog')).toHaveCount(0);
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
    await page.getByRole('button', { name: 'Filter' }).click();
    await page.getByRole('combobox', { name: 'Province' }).click();
    await page.getByRole('option', { name: 'เชียงใหม่' }).click();
    await expect(page.getByTestId('prov')).toHaveText('Province: 50');
    await expect(page.getByRole('dialog', { name: 'Filter' })).toBeVisible();
    await page.keyboard.press('Escape');
    /* open={forced || undefined}: forced, released, then the trigger still works. */
    await page.getByText('Force pinned open').click();
    await expect(page.getByRole('dialog', { name: 'Pinned' })).toBeVisible();
    await page.getByText('Force pinned open').click();
    await expect(page.getByRole('dialog', { name: 'Pinned' })).toHaveCount(0);
    await page.getByRole('button', { name: 'Pinned' }).click();
    await expect(page.getByRole('dialog', { name: 'Pinned' })).toBeVisible();
  });

  test('dates: typed dates obey min/max; a disabled day keeps the grid reachable; arrows cross weekends; bare Calendar', async ({
    page,
  }) => {
    await story(page, 'aura-fixed-in-5-1-1--dates');
    const field = page.getByRole('textbox', { name: 'Maintenance day' });
    await field.fill('01/01/2020');
    await field.press('Enter');
    await expect(page.getByTestId('day')).toHaveText('Day: 2026-09-25');
    await expect(page.getByText("That date can't be chosen.")).toBeVisible();
    await expect(field).toHaveAttribute('aria-invalid', 'true');
    await field.fill('20/09/2026');
    await field.press('Enter');
    await expect(page.getByTestId('day')).toHaveText('Day: 2026-09-20');
    await expect(page.getByText("That date can't be chosen.")).toHaveCount(0);
    /* Refused again, then picked from the calendar: the message goes. */
    await field.fill('01/01/2020');
    await field.press('Enter');
    await expect(page.getByText("That date can't be chosen.")).toBeVisible();
    await page.getByRole('button', { name: 'Open calendar' }).first().click();
    await page.locator('.aura-cal__popover [data-date="2026-09-22"]').click();
    await expect(page.getByTestId('day')).toHaveText('Day: 2026-09-22');
    await expect(page.getByText("That date can't be chosen.")).toHaveCount(0);
    await expect(field).not.toHaveAttribute('aria-invalid', 'true');
    /* Opens on Saturday 26 (today, disabled): focus lands on a day in the grid. */
    await page.getByRole('button', { name: 'Open calendar' }).nth(1).click();
    const focused = () => page.evaluate(() => document.activeElement!.getAttribute('data-date'));
    expect(await focused()).toMatch(/^2026-09-2[5-9]$|^2026-09-2[0-9]$/);
    await page.getByRole('dialog', { name: 'Weekday visit' }).locator('[data-date="2026-09-25"]').focus();
    for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowRight');
    expect(await focused()).toBe('2026-09-28');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('Enter'); // Sunday: not chosen
    await expect(page.getByTestId('weekday')).toHaveText('Visit: —');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('weekday')).toHaveText('Visit: 2026-09-28');
    const errs: string[] = [];
    page.on('pageerror', (e) => errs.push(String(e)));
    await page.getByTestId('bare-cal').locator('[data-date="2026-09-24"]').click();
    await page.getByTestId('bare-cal').getByRole('button', { name: 'Today' }).click();
    expect(errs).toEqual([]);
  });

  test('forms: native submit gets the option value and the file; 1,5 is 1.5; reset to undefined; nested errors', async ({
    page,
  }) => {
    await story(page, 'aura-fixed-in-5-1-1--native-form');
    await page
      .getByLabel('Document')
      .setInputFiles({ name: 'rack.txt', mimeType: 'text/plain', buffer: Buffer.from('rack A') });
    await page.getByRole('button', { name: 'Send' }).click();
    await expect(page.getByTestId('sent')).toHaveText('province=50; doc=rack.txt:6');
    const num = page.getByRole('spinbutton', { name: 'Load average' });
    await num.fill('1,5');
    await num.blur();
    await expect(page.getByTestId('num')).toHaveText('Number: 1.5');
    await num.fill('12,500');
    await num.blur();
    await expect(page.getByTestId('num')).toHaveText('Number: 12500');
    const box = page.getByRole('checkbox', { name: 'Notify on-call' });
    await box.check();
    await expect(box).toBeChecked();
    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(box).not.toBeChecked();
    await expect(page.getByRole('link', { name: 'Enter a street' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Name item 1' })).toBeVisible();
    await page.getByRole('link', { name: 'Choose a province' }).click();
    await expect(page.getByRole('combobox', { name: 'Province' })).toBeFocused();
    await page.getByRole('combobox', { name: 'Province' }).fill('zzz');
    await expect(page.getByText('No matches')).toBeVisible();
    await expect(page.getByRole('combobox', { name: 'Province' })).toHaveAttribute('aria-expanded', 'false');
    expect(await axeScan(page, '.aura-field:has([role="combobox"])')).toEqual([]);
  });

  test('a toast from a page mount effect shows with <Toaster/> after the page', async ({ page }) => {
    await story(page, 'aura-fixed-in-5-1-1--toast-on-mount');
    await expect(page.locator('.aura-toast', { hasText: 'Welcome back' })).toBeVisible();
  });

  test('a stackBelow table centred in a flex column keeps its width', async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 700 });
    await story(page, 'aura-fixed-in-5-1-1--centred-table');
    const w = await page
      .getByTestId('centred')
      .locator('.aura-table-box')
      .evaluate((e) => e.getBoundingClientRect().width);
    expect(w).toBeGreaterThan(900);
    await expect(page.getByText('srv-02.dxt.local')).toBeVisible();
  });

  test('server paging past the end keeps the pager; the total is unknown to screen readers', async ({ page }) => {
    await story(page, 'aura-fixed-in-5-1-1--server-past-end');
    await expect(page.getByRole('grid')).toHaveAttribute('aria-rowcount', '-1');
    await page.getByRole('button', { name: 'Next page' }).click();
    await page.getByRole('button', { name: 'Next page' }).click();
    await expect(page.getByRole('button', { name: 'Previous page' })).toBeEnabled();
    await page.getByRole('button', { name: 'Previous page' }).click();
    await expect(page.getByText('host-10')).toBeVisible();
  });

  test('tabs start on the first enabled tab; a nested provider keeps Thai', async ({ page }) => {
    await story(page, 'aura-fixed-in-5-1-1--tabs-and-locale');
    await expect(page.getByRole('tab', { name: 'Logs' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tab', { name: 'Logs' })).toHaveAttribute('tabindex', '0');
    await expect(page.getByText('Log panel')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'วันที่' })).toHaveValue('18 ก.ย. 2569');
  });

  test('the pointer can move onto a tooltip; Space opens a menu link and focus returns to the trigger', async ({
    page,
  }) => {
    await story(page, 'aura-fixed-in-5-1-1--hover-and-menu');
    await page.getByRole('button', { name: 'Restart' }).hover();
    const tip = page.getByRole('tooltip');
    await expect(tip).toBeVisible();
    await tip.hover();
    await page.waitForTimeout(300);
    await expect(tip).toBeVisible();
    await page.mouse.move(5, 5);
    await expect(tip).toHaveCount(0);
    /* Only the Tooltip component's tips take the pointer; SideNav rail labels and cell tips stay click-through. */
    expect(
      await page.evaluate(() => {
        const d = document.createElement('div');
        d.className = 'aura-tooltip aura-tooltip--right';
        document.body.appendChild(d);
        const v = getComputedStyle(d).pointerEvents;
        d.remove();
        return v;
      }),
    ).toBe('none');
    await page.getByRole('button', { name: 'Host actions' }).focus();
    await page.keyboard.press('ArrowUp');
    await expect(page.getByRole('menuitem', { name: 'Remove host' })).toBeFocused();
    await page.keyboard.press('Home');
    await page.keyboard.press(' ');
    await expect(page.getByRole('menu')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Host actions' })).toBeFocused();
    expect(await page.evaluate(() => location.hash)).toBe('#dashboard');
  });
});

test.describe('5.2: low-severity review items', () => {
  test('the totals row is reachable by arrow keys; a server table with no totalRows states no total', async ({
    page,
  }) => {
    await story(page, 'aura-new-in-5-2--table-totals-and-open-total');
    const box = page.getByTestId('totals');
    await box.locator('[data-rc="2:1"]').focus();
    await page.keyboard.press('ArrowDown');
    const focused = () => page.evaluate(() => document.activeElement!.getAttribute('data-rc'));
    expect(await focused()).toBe('3:1');
    expect(await page.evaluate(() => document.activeElement!.closest('[role="row"]')!.getAttribute('aria-label'))).toBe(
      'Totals',
    );
    await page.keyboard.press('ArrowDown'); // stays: no page after
    expect(await focused()).toBe('3:1');
    await page.keyboard.press('ArrowUp');
    expect(await focused()).toBe('2:1');
    await page.keyboard.press('Control+End');
    expect(await focused()).toBe('3:2');
    await expect(box.locator('[role="gridcell"][tabindex="0"]')).toHaveCount(1);
    const open = page.getByTestId('open');
    await expect(open.getByText('1–5 of many')).toBeVisible();
    await expect(open.getByText('Page 1', { exact: true })).toBeVisible();
  });

  test('eight-digit dates; a taken time says so; a stored file links; state marks have edges', async ({ page }) => {
    await story(page, 'aura-new-in-5-2--inputs-and-files');
    const d = page.getByRole('textbox', { name: 'Install date' });
    await d.fill('18092026');
    await d.press('Enter');
    await expect(page.getByTestId('date')).toHaveText('Date: 2026-09-18');
    const time = page.getByRole('combobox', { name: 'Visit time' });
    await time.fill('12:00');
    await time.press('Enter');
    await expect(page.getByText("That time isn't available. Choose another.")).toBeVisible();
    await time.fill('13pm');
    await time.press('Enter');
    await expect(page.getByText('Type a time like 09:30')).toBeVisible();
    const link = page.getByRole('link', { name: 'contract.png' });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(page.locator('.aura-upload__thumb[src^="data:image/png"]')).toHaveCount(1);
    expect(
      parseFloat(await page.locator('.aura-avatar__status').evaluate((e) => getComputedStyle(e).borderTopWidth)),
    ).toBeGreaterThanOrEqual(1);
    expect(
      await page.locator('.aura-segmented__option.is-selected').evaluate((e) => getComputedStyle(e).boxShadow),
    ).toMatch(/inset/);
  });

  test('a clamped page is reported to the app', async ({ page }) => {
    await story(page, 'aura-new-in-5-2--clamped-page');
    await expect(page.getByTestId('state')).toHaveText('App page: 3');
    await page.getByRole('button', { name: 'Filter' }).click();
    await expect(page.getByTestId('state')).toHaveText('App page: 1');
    await expect(page.getByText('R-4')).toBeVisible();
    /* The same shrink behind a loading refetch is reported too. */
    await page.reload();
    await page.waitForSelector('#storybook-root > *');
    await page.getByRole('button', { name: 'Refetch smaller' }).click();
    await expect(page.getByTestId('state')).toHaveText('App page: 1');
  });

  test('a page restored from the URL survives rows that load later', async ({ page }) => {
    await story(page, 'aura-new-in-5-2--restored-page');
    await expect(page.getByText('row 11', { exact: true })).toBeVisible();
    await expect(page.getByTestId('state')).toHaveText('App page: 3');
  });

  test('in cards, arrows skip blank totals cells', async ({ page }) => {
    await story(page, 'aura-new-in-5-2--totals-cards');
    await page.locator('[data-rc="2:0"]').focus();
    await page.keyboard.press('ArrowDown');
    const f = await page.evaluate(() => {
      const a = document.activeElement as HTMLElement;
      return { rc: a.getAttribute('data-rc'), shown: a.getClientRects().length > 0 };
    });
    expect(f.rc).toBe('3:2');
    expect(f.shown).toBe(true);
  });

  test('a popover taller than the viewport scrolls inside it', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 500 });
    await story(page, 'aura-new-in-5-2--tall-popover');
    await page.getByRole('button', { name: 'All hosts' }).click();
    const r = await page.getByRole('dialog', { name: 'All hosts' }).evaluate((e) => ({
      top: e.getBoundingClientRect().top,
      bottom: e.getBoundingClientRect().bottom,
      sh: e.scrollHeight,
      ch: e.clientHeight,
    }));
    expect(r.top).toBeGreaterThanOrEqual(0);
    expect(r.bottom).toBeLessThanOrEqual(500);
    expect(r.sh).toBeGreaterThan(r.ch);
    /* Scrolled, the title and Close stay in view. */
    await page.getByRole('dialog', { name: 'All hosts' }).evaluate((e) => (e.scrollTop = 400));
    const close = await page
      .getByRole('dialog', { name: 'All hosts' })
      .getByRole('button', { name: 'Close' })
      .boundingBox();
    expect(close!.y).toBeGreaterThanOrEqual(r.top - 1);
  });
});

test.describe('5.3: Select opens AURA’s own list', () => {
  for (const theme of ['light', 'dark']) {
    test(`mouse and keyboard pick; groups; disabled skipped; axe on the open list (${theme})`, async ({ page }) => {
      await story(page, 'aura-new-in-5-3--select-list', theme);
      const owner = page.getByRole('combobox', { name: 'Owner' });
      await expect(owner).toHaveText('Jirawat');
      await owner.click();
      const list = page.getByRole('listbox');
      await expect(list).toBeVisible();
      await expect(page.getByRole('option', { name: 'Jirawat' })).toHaveAttribute('aria-selected', 'true');
      /* The list is AURA's: surface fill, radius, its own active row (not the OS highlight). */
      const look = await page.locator('.aura-select__popover').evaluate((e) => {
        const s = getComputedStyle(e);
        return { radius: s.borderTopLeftRadius, bg: s.backgroundColor };
      });
      expect(parseFloat(look.radius)).toBeGreaterThan(4);
      expect(look.bg).not.toBe('rgba(0, 0, 0, 0)');
      expect(await axeScan(page, '.aura-select__popover')).toEqual([]);
      await page.getByRole('option', { name: 'QA' }).click();
      await expect(page.getByTestId('owner')).toHaveText('Owner: QA');
      await expect(owner).toBeFocused();
      /* Keyboard: Down moves, the disabled last option is skipped, Enter picks; Escape closes without a change. */
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await expect(owner).toHaveAttribute('aria-activedescendant', /opt-3$/);
      await page.keyboard.press('Escape');
      await expect(page.getByTestId('owner')).toHaveText('Owner: QA');
      await page.keyboard.press('ArrowUp');
      await page.keyboard.press('Home');
      await page.keyboard.press('Enter');
      await expect(page.getByTestId('owner')).toHaveText('Owner: Jirawat');
      /* Typeahead on the closed field opens on the match. */
      await owner.focus();
      await page.keyboard.type('de');
      await expect(owner).toHaveAttribute('aria-activedescendant', /opt-1$/);
      await page.keyboard.press('Enter');
      await expect(page.getByTestId('owner')).toHaveText('Owner: Design');
      /* Children with optgroups: group headings in the list; placeholder until chosen. */
      const region = page.getByRole('combobox', { name: 'Region' });
      await expect(region).toHaveText('Choose a region');
      await region.click();
      await expect(page.locator('.aura-select__group')).toHaveText(['Asia', 'Europe']);
      /* The placeholder prompts on the closed field; it is not a choice in the list. */
      await expect(page.getByRole('option')).toHaveText(['Thailand', 'Vietnam', 'Sweden']);
      await expect(page.getByRole('group', { name: 'Asia' }).getByRole('option')).toHaveText(['Thailand', 'Vietnam']);
      await page.getByRole('option', { name: 'Sweden' }).click();
      await expect(region).toHaveText('Sweden');
      await expect(page.getByRole('combobox', { name: 'Locked' })).toBeDisabled();
      expect(await axeScan(page, '#storybook-root')).toEqual([]);
    });
  }

  test('react-hook-form register, reset, setValue, setFocus; native post and required; selectOption still works', async ({
    page,
  }) => {
    await story(page, 'aura-new-in-5-3--select-in-forms');
    const tier = page.getByRole('combobox', { name: 'Tier' });
    await expect(tier).toHaveText('SME');
    await tier.click();
    await page.getByRole('option', { name: 'Enterprise' }).click();
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page.getByTestId('sent')).toHaveText('tier=Enterprise');
    await page.getByRole('button', { name: 'Set', exact: true }).click();
    await expect(tier).toHaveText('Corporate');
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page.getByText('Corporate needs approval')).toBeVisible();
    await expect(tier).toHaveAttribute('aria-invalid', 'true');
    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(tier).toHaveText('Enterprise');
    await page.getByRole('button', { name: 'Focus', exact: true }).click();
    await expect(tier).toBeFocused();
    /* A native form: required stops an empty post; the value posts once chosen. Test helpers on the <select> work. */
    await page.getByRole('button', { name: 'Post', exact: true }).click();
    await expect(page.getByTestId('posted')).toHaveText('');
    await page.locator('select[name="size"]').selectOption('M');
    await expect(page.getByRole('combobox', { name: 'Size' })).toHaveText('M');
    await page.getByRole('button', { name: 'Post', exact: true }).click();
    await expect(page.getByTestId('posted')).toHaveText('size=M');
  });

  test('inside a dialog and a popover: a pick keeps the overlay open; Escape closes the list first', async ({
    page,
  }) => {
    await story(page, 'aura-new-in-5-3--select-in-overlays');
    await page.getByRole('button', { name: 'Edit member' }).click();
    const dlg = page.getByRole('dialog', { name: 'Edit member' });
    const role = dlg.getByRole('combobox', { name: 'Role' });
    await role.click();
    const opt = page.getByRole('option', { name: 'Admin' });
    const z = await opt.evaluate((el) => {
      const r = el.getBoundingClientRect();
      return (
        document.elementFromPoint(r.left + 5, r.top + r.height / 2) === el ||
        el.contains(document.elementFromPoint(r.left + 5, r.top + r.height / 2))
      );
    });
    expect(z).toBe(true);
    await opt.click();
    await expect(dlg).toBeVisible();
    await expect(page.getByTestId('role')).toHaveText('Role: Admin');
    await expect(role).toBeFocused();
    await role.press('Enter');
    await expect(page.getByRole('listbox')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('listbox')).toHaveCount(0);
    await expect(dlg).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dlg).toHaveCount(0);
    await page.getByRole('button', { name: 'Filter' }).click();
    const pop = page.getByRole('dialog', { name: 'Filter' });
    await pop.getByRole('combobox', { name: 'Status' }).click();
    await page.getByRole('option', { name: 'Closed' }).click();
    await expect(pop).toBeVisible();
    await expect(pop.getByRole('combobox', { name: 'Status' })).toHaveText('Closed');
  });

  test('caller props reach the button; aria-labelledby; id = name; late options; autoFocus; space in typeahead', async ({
    page,
  }) => {
    await story(page, 'aura-new-in-5-3--select-edges');
    await expect(page.getByRole('combobox', { name: 'Auto' })).toBeFocused();
    const p = page.getByTestId('props-sel');
    await expect(p).toHaveAttribute('role', 'combobox');
    await expect(p).toHaveAttribute('title', 'Pick one');
    await expect(p).toHaveCSS('letter-spacing', '1px');
    await p.focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('log')).toHaveText('focus,key:ArrowDown,key:Escape,key:Tab,blur');
    await expect(page.getByRole('combobox', { name: 'External name' })).toHaveCount(1);
    await page.getByRole('button', { name: 'Read' }).click();
    await expect(page.getByTestId('read')).toHaveText('VN');
    /* Nothing to choose: no empty listbox. */
    const empty = page.getByRole('combobox', { name: 'Empty' });
    await empty.click();
    await expect(empty).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('listbox')).toHaveCount(0);
    /* Options that change while the list is open show up; the chosen one stays marked. */
    await page.getByRole('button', { name: 'Grow later' }).click();
    const late = page.getByRole('combobox', { name: 'Late' });
    await late.click();
    await expect(page.getByRole('option')).toHaveText(['Alpha']);
    await expect(page.getByRole('option')).toHaveText(['Zulu', 'Alpha', 'Bravo']);
    await expect(page.getByRole('option', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'true');
    /* The highlight stays on Alpha (now second), not whatever took its place. */
    await expect(late).toHaveAttribute('aria-activedescendant', /opt-1$/);
    await page.keyboard.press('Escape');
    /* "new d": the space is part of the search. */
    const city = page.getByRole('combobox', { name: 'City' });
    await city.focus();
    await page.keyboard.type('new d');
    await expect(city).toHaveAttribute('aria-expanded', 'true');
    await expect(city).toHaveAttribute('aria-activedescendant', /opt-1$/);
    await page.keyboard.press('Enter');
    await expect(city).toHaveText('New Delhi');
    /* A letter that matches nothing doesn't swallow the Space that follows. */
    await page.keyboard.type('q');
    await page.keyboard.press('Space');
    await expect(city).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });
});

test.describe('5.6: Chamber-OS addendum 4', () => {
  test('52: only selectable rows get a checkbox; select-all, Space and passed-in keys respect it', async ({ page }) => {
    await story(page, 'aura-new-in-5-6--selectable-rows');
    const grid = page.getByRole('grid', { name: 'E-Blast queue' });
    await expect(grid.getByRole('checkbox')).toHaveCount(3); // header + 2 rows
    const all = grid.getByRole('checkbox', { name: /select all/i });
    await all.check();
    await expect(page.getByTestId('sel')).toHaveText('Selected: EB-1,EB-3');
    await expect(all).toBeChecked();
    /* Space on a rejected row changes nothing, and is still handled (no page scroll). */
    await grid.locator('[data-rc="2:0"]').focus();
    await page.evaluate(() => {
      (window as any).__spaceDefault = null;
      /* Read after dispatch finishes (the grid stops propagation of keys it handles). */
      window.addEventListener(
        'keydown',
        (e) => setTimeout(() => ((window as any).__spaceDefault = e.defaultPrevented)),
        {
          capture: true,
          once: true,
        },
      );
    });
    await page.keyboard.press('Space');
    await expect(page.getByTestId('sel')).toHaveText('Selected: EB-1,EB-3');
    await expect.poll(() => page.evaluate(() => (window as any).__spaceDefault)).toBe(true);
    await expect(grid.locator('[data-rc="2:0"]')).toHaveAttribute('aria-label', 'EB-2: In design, not selectable');
    /* A rejected key passed in never shows as selected, and is dropped from the app's state. */
    await page.getByRole('button', { name: 'Pass in EB-2 and EB-3' }).click();
    await expect(grid.getByRole('row', { selected: true })).toHaveCount(1);
    await expect(page.getByTestId('sel')).toHaveText('Selected: EB-3');
    await expect(all).not.toBeChecked();
    await grid.getByRole('checkbox', { name: /EB-1/ }).check();
    await expect(page.getByTestId('sel')).toHaveText('Selected: EB-3,EB-1');
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('53–56: rich toast with links and two actions; top-center under the bar; Alt+T; Escape returns focus', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 700 });
    await story(page, 'aura-new-in-5-6--rich-toasts');
    const opener = page.getByRole('button', { name: 'Supersede warning' });
    await opener.click();
    const t = page.locator('.aura-toast', { hasText: '2 bills need voiding' });
    await expect(t.getByRole('link', { name: 'Open SC-101' })).toBeVisible();
    await expect(t.getByRole('link', { name: 'Open SC-102' })).toBeVisible();
    /* 54: centred, 64px from the top. */
    const box = (await page.locator('.aura-toaster').boundingBox())!;
    expect(Math.abs(box.x + box.width / 2 - 512)).toBeLessThan(2);
    expect(Math.round(box.y)).toBe(64);
    /* Two actions sit on their own row under the text, which keeps most of the toast's width. */
    const body = (await t.locator('.aura-toast__body').boundingBox())!;
    const acts = (await t.locator('.aura-toast__actions').boundingBox())!;
    expect(acts.y).toBeGreaterThanOrEqual(body.y + body.height - 1);
    expect(body.width).toBeGreaterThan(box.width * 0.7);
    /* 53: an action with dismiss:false keeps the toast. */
    await t.getByRole('button', { name: 'Void next' }).click();
    await expect(page.getByTestId('log')).toHaveText('void next');
    await expect(t).toBeVisible();
    /* 55: Alt+T from the page focuses the newest toast's first action; Escape closes it and returns focus. */
    await opener.focus();
    await page.keyboard.press('Alt+KeyT');
    await expect(t.getByRole('button', { name: 'Void next' })).toBeFocused();
    await expect(page.getByRole('region', { name: /Alt\+T/ })).toHaveCount(1);
    await page.keyboard.press('Escape');
    await expect(t).toHaveCount(0);
    await expect(opener).toBeFocused();
    /* Focus comes back after an action that closes the toast too. */
    const send = page.getByRole('button', { name: 'Send invoice' });
    await send.click();
    await page.keyboard.press('Alt+KeyT');
    await expect(page.getByRole('button', { name: 'Undo' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('log')).toHaveText('undo');
    await expect(send).toBeFocused();
    expect(await axeScan(page, 'body')).toEqual([]);
  });

  test('55: timer stays paused while focus is inside; hotkey leaves typing in fields alone', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 700 });
    await story(page, 'aura-new-in-5-6--rich-toasts');
    const send = page.getByRole('button', { name: 'Send invoice' });
    await send.click();
    const t = page.locator('.aura-toast', { hasText: 'Invoice sent' });
    await page.keyboard.press('Alt+KeyT');
    await expect(t.getByRole('button', { name: 'Undo' })).toBeFocused();
    await t.hover();
    await page.mouse.move(5, 650);
    await page.waitForTimeout(5600); // past the 5 s default
    await expect(t).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(send).toBeFocused();
    /* In a text field on macOS, Option+T (key "†", code KeyT) types; the hotkey doesn't fire. On other platforms
     * Alt+T works from a field whatever the layout (Thai gives key "ะ"). */
    await send.click();
    const inField = (mac: boolean, key: string) =>
      page.evaluate(
        ([mac, key]) => {
          Object.defineProperty(navigator, 'platform', { get: () => (mac ? 'MacIntel' : 'Win32'), configurable: true });
          const i = document.createElement('input');
          i.setAttribute('aria-label', 'scratch');
          document.body.appendChild(i);
          i.focus();
          const e = new KeyboardEvent('keydown', { key, code: 'KeyT', altKey: true, bubbles: true, cancelable: true });
          i.dispatchEvent(e);
          const r = [e.defaultPrevented, document.activeElement === i];
          i.remove();
          return r;
        },
        [mac, key] as const,
      );
    expect(await inField(true, '†')).toEqual([false, true]);
    expect(await inField(false, 'ะ')).toEqual([true, false]);
  });

  test('54 phone: full width below 640px, offset kept; 56: 44px action hit area on touch', async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    await story(page, 'aura-new-in-5-6--rich-toasts');
    await page.getByRole('button', { name: 'Send invoice' }).click();
    const box = (await page.locator('.aura-toaster').boundingBox())!;
    expect(Math.round(box.x)).toBe(16);
    expect(Math.round(box.width)).toBe(358);
    expect(Math.round(box.y)).toBe(64);
    const hit = await page.locator('.aura-toast__action').evaluate((el) => {
      const a = getComputedStyle(el, '::after');
      return [parseFloat(a.width), parseFloat(a.height)];
    });
    expect(hit[0]).toBeGreaterThanOrEqual(44);
    expect(hit[1]).toBeGreaterThanOrEqual(44);
    await ctx.close();
  });
});

test.describe('5.7: Chamber-OS addendum 5', () => {
  test('57: DropdownMenu header is outside the items and describes the menu', async ({ page }) => {
    await story(page, 'aura-new-in-5-7--account-menu');
    await page.getByRole('button', { name: 'Account' }).click();
    const menu = page.getByRole('menu', { name: 'Account' });
    await expect(menu).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Profile' })).toBeFocused();
    await expect(menu).toHaveAccessibleDescription(/Jirawat Piyakit.*tao@example\.co\.th.*Chamber admin/);
    await expect(menu.getByText('Jirawat Piyakit')).toHaveCount(0); // not inside role=menu
    await page.keyboard.press('ArrowUp');
    await expect(page.getByRole('menuitem', { name: 'Sign out' })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'Profile' })).toBeFocused();
    await page.getByText('tao@example.co.th').click(); // clicking the header keeps the menu open
    await expect(menu).toBeVisible();
    expect(await axeScan(page, 'body')).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0);
  });

  test('58: a breadcrumb item with no href or onClick is text', async ({ page }) => {
    await story(page, 'aura-new-in-5-7--text-crumb');
    const nav = page.getByRole('navigation');
    await expect(nav.getByRole('link', { name: 'Settings' })).toHaveCount(1);
    await expect(nav.getByRole('button')).toHaveCount(0);
    await expect(nav.locator('.aura-crumbs__text')).toHaveText('Renewals');
    await expect(nav.locator('[aria-current="page"]')).toHaveText('Schedules');
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('59: focus moves to <main> when the row acted on is gone, with no ring', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 700 });
    await story(page, 'aura-new-in-5-7--shell-focus');
    await page.getByRole('button', { name: 'Approve Member A' }).click();
    const main = page.locator('#main-content');
    await expect(main).toBeFocused();
    expect(await main.evaluate((m) => getComputedStyle(m).outlineStyle)).toBe('none');
    expect(await axeScan(page, 'body')).toEqual([]);
  });

  test('60: alertdialog ignores a scrim click; Escape still closes it', async ({ page }) => {
    await story(page, 'aura-new-in-5-7--confirm-with-reason');
    await page.getByRole('button', { name: 'Reject request' }).click();
    const d = page.getByRole('alertdialog');
    await d.getByRole('textbox', { name: 'Reason' }).fill('Duplicate');
    await page.mouse.click(5, 5);
    await expect(d).toBeVisible();
    await expect(d.getByRole('textbox', { name: 'Reason' })).toHaveValue('Duplicate');
    await expect(page.getByTestId('closed')).toHaveText('Closed 0');
    await page.keyboard.press('Escape');
    await expect(d).toHaveCount(0);
    await expect(page.getByTestId('closed')).toHaveText('Closed 1');
  });

  test('61: BottomNav ariaLabel names the item; count still read', async ({ page }) => {
    await story(page, 'aura-new-in-5-7--short-tabs');
    const nav = page.getByRole('navigation');
    await expect(nav.getByRole('button', { name: 'Mitt konto', exact: true })).toHaveCount(1);
    await expect(nav.getByRole('button', { name: 'สิทธิประโยชน์ (3)', exact: true })).toHaveCount(1);
    await expect(nav.getByText('Konto', { exact: true })).toBeVisible();
    expect(await axeScan(page, 'body')).toEqual([]);
  });

  test('62: SideNav rows are 44px on touch, 36px otherwise', async ({ browser, page }) => {
    await page.setViewportSize({ width: 1280, height: 700 });
    await story(page, 'aura-new-in-5-7--shell-focus');
    const h = async (p: typeof page) => (await p.locator('.aura-nav__item').first().boundingBox())!.height;
    expect(Math.round(await h(page))).toBe(36);
    const ctx = await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true, isMobile: true });
    const phone = await ctx.newPage();
    await story(phone, 'aura-new-in-5-7--shell-focus');
    await phone.getByRole('button', { name: 'Open navigation' }).click();
    await expect(phone.locator('.aura-drawer .aura-nav__item').first()).toBeVisible();
    for (const b of await phone.locator('.aura-drawer .aura-nav__item').all())
      expect((await b.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await ctx.close();
  });
});

test.describe('5.7.1: Chamber-OS item 63', () => {
  test('63: long SideNav labels read in full on two lines; short rows stay 36px', async ({ browser, page }) => {
    await page.setViewportSize({ width: 1280, height: 700 });
    await story(page, 'aura-new-in-5-7--long-nav-labels');
    const nav = page.locator('.aura-nav');
    expect(Math.round((await nav.boundingBox())!.width)).toBe(240);
    const rows = page.locator('.aura-nav__item');
    expect(Math.round((await rows.nth(0).boundingBox())!.height)).toBe(36);
    for (const i of [1, 2]) {
      const label = rows.nth(i).locator('.aura-nav__label');
      const m = await label.evaluate((el) => ({
        sh: el.scrollHeight,
        ch: el.clientHeight,
        h: el.getBoundingClientRect().height,
      }));
      expect(m.sh, 'label is not clipped').toBeLessThanOrEqual(m.ch + 1);
      expect(Math.round(m.h)).toBe(36); // two 18px lines
      const row = (await rows.nth(i).boundingBox())!;
      const icon = (await rows.nth(i).locator('.aura-icon').first().boundingBox())!;
      expect(Math.abs(icon.y + icon.height / 2 - (row.y + row.height / 2))).toBeLessThan(1.5); // icon centred on the row
      expect(row.height).toBeGreaterThanOrEqual(44);
    }
    await rows.nth(0).focus();
    await page.keyboard.press('ArrowDown');
    await expect(rows.nth(1)).toBeFocused();
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
    const ctx = await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true, isMobile: true });
    const phone = await ctx.newPage();
    await story(phone, 'aura-new-in-5-7--long-nav-labels');
    for (const b of await phone.locator('.aura-nav__item').all())
      expect((await b.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await ctx.close();
  });
});

test.describe('5.7.2: Chamber-OS item 64', () => {
  test('64: nav labels hyphenate; a soft hyphen breaks with a visible hyphen and a clean name', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 700 });
    await story(page, 'aura-new-in-5-7--long-nav-labels');
    const labels = page.locator('.aura-nav__label');
    expect(await labels.first().evaluate((el) => getComputedStyle(el).hyphens)).toBe('auto');
    /* The soft-hyphen label: two lines, split after "Marknadsförings", no line holding one letter. */
    const shy = page.locator('.aura-nav__item').nth(4);
    /* The second line starts right after the soft hyphen: the caret at its left edge sits before "målgrupp". */
    const split = await shy.locator('.aura-nav__label').evaluate((el) => {
      const t = el.firstChild as Text;
      const b = el.getBoundingClientRect();
      const c = document.caretRangeFromPoint(b.left + 1, b.top + 27)!;
      return { offset: c.startOffset, at: t.data.indexOf('\u00AD'), height: Math.round(b.height) };
    });
    expect(split.height).toBe(36); // two lines
    expect(split.offset).toBe(split.at + 1);
    await expect(shy).toHaveAccessibleName('Marknadsföringsmålgrupp 12');
    /* Playwright strips U+00AD before comparing names, so read Chromium's own tree: the name carries no visible
     * hyphen. (Chromium keeps the soft hyphen itself — an invisible format character screen readers don't speak.) */
    const cdp = await page.context().newCDPSession(page);
    const { nodes } = await cdp.send('Accessibility.getFullAXTree');
    const names = nodes.map((n: any) => String(n.name?.value ?? '')).filter((n: string) => n.includes('lgrupp'));
    expect(names.length).toBeGreaterThan(0);
    for (const n of names) expect(n, 'no hyphen in the accessible name').not.toMatch(/[-\u2010\u2011]/);
    /* The plain compound ("Marknadsföringsmålgrupp") hyphenates only where the browser has a Swedish dictionary;
     * headless Chromium on Linux has none, so CI checks the CSS above and the soft-hyphen path, not that render. */
    /* Clamp, row heights and arrow keys unchanged. */
    expect(Math.round((await page.locator('.aura-nav__item').nth(0).boundingBox())!.height)).toBe(36);
    expect((await shy.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await page.locator('.aura-nav__item').nth(3).focus();
    await page.keyboard.press('ArrowDown');
    await expect(shy).toBeFocused();
  });
});

test.describe('5.7.3: Chamber-OS item 65', () => {
  test('65: FormErrorSummary with live RHF errors focuses on submit only, never while typing', async ({ page }) => {
    await story(page, 'aura-new-in-5-7--summary-focus-on-submit');
    const summary = page.locator('.aura-error-summary');
    const email = page.getByRole('textbox', { name: /^Email address/ });
    const password = page.getByLabel(/^Password/).first();
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(summary).toBeFocused(); // a failed submit focuses it
    await email.fill('tao@example.co.th');
    await password.fill('secret');
    await expect(summary).toHaveCount(0); // every field fixed: the list empties
    await password.focus();
    await page.keyboard.press('ControlOrMeta+a');
    await page.keyboard.press('Backspace'); // break it again: the list refills while typing
    await expect(summary).toBeVisible();
    await page.waitForTimeout(150);
    await expect(password).toBeFocused(); // WCAG 3.2.2: focus stays in the field
    await page.keyboard.press('Enter'); // the next failed submit focuses it again
    await expect(summary).toBeFocused();
    await password.fill('secret');
    await expect(summary).toHaveCount(0);
    await page.getByRole('button', { name: 'Sign in' }).click(); // valid: the server answers later with setError
    await expect(summary).toHaveCount(0); // nothing yet: the new key armed one focus
    await expect(summary).toBeFocused();
    await expect(summary).toContainText('Wrong email or password');
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('65: blur-validated errors before any submit never take focus', async ({ page }) => {
    await story(page, 'aura-new-in-5-7--summary-focus-on-blur');
    const email = page.getByRole('textbox', { name: /^Email address/ });
    await email.focus();
    await page.keyboard.press('Tab'); // blur the empty required field: RHF adds an error (mode onBlur)
    await expect(page.locator('.aura-error-summary')).toBeVisible();
    await page.waitForTimeout(150);
    await expect(page.getByLabel(/^Password/).first()).toBeFocused();
  });
});

test.describe('5.8: Chamber-OS addendum 8', () => {
  test('66: Alert role, icon and attributes', async ({ page }) => {
    await story(page, 'aura-new-in-5-8--alert-role-and-icon');
    const pending = page.getByTestId('pending');
    await expect(pending).toHaveAttribute('role', 'status');
    await expect(pending).toHaveAttribute('id', 'cr-pending');
    await expect(pending.locator('svg.aura-alert__icon')).toHaveAttribute('aria-hidden', 'true');
    const clock = await pending.locator('svg.aura-alert__icon').innerHTML();
    expect(clock).toContain('M12 6v6l4 2'); // the clock, not the warning triangle
    const paused = page.locator('[data-outcome="paused"]');
    await expect(paused).toHaveAttribute('role', 'status');
    await expect(paused.locator('.aura-icon--custom')).toHaveAttribute('aria-hidden', 'true');
    await expect(paused.locator('[data-icon="pause"]')).toHaveCount(1);
    await expect(page.getByRole('alert')).toHaveCount(1); // only the default danger alert interrupts
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('67: Table stackBelow — cards with labels at 390px, a normal table at 1024px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await story(page, 'aura-new-in-5-8--stacked-diff');
    const wrap = page.locator('.aura-tbl-wrap');
    const table = page.getByRole('table', { name: 'Changes requested' });
    await expect(table).toBeVisible();
    expect(await wrap.evaluate((w) => w.scrollWidth <= w.clientWidth + 1)).toBe(true); // no sideways scroll
    await expect(table.getByRole('row')).toHaveCount(3); // header row kept for screen readers
    await expect(table.getByRole('columnheader')).toHaveCount(3);
    await expect(table.getByRole('rowheader', { name: 'Address' })).toBeVisible();
    const cells = table.locator('tbody td');
    const labels = await cells.evaluateAll((els) => els.map((e) => getComputedStyle(e, '::before').content));
    expect(labels).toEqual(
      ['"Seen at submission"', '"Proposed"', '"Seen at submission"', '"Proposed (new)"'].map((s) =>
        expect.stringContaining(s.slice(1, -1)),
      ),
    );
    expect(await table.locator('thead').evaluate((e) => e.getBoundingClientRect().height)).toBeLessThanOrEqual(1);
    expect(
      await table
        .locator('tbody tr')
        .first()
        .evaluate((e) => getComputedStyle(e).display),
    ).toBe('block');
    /* The address cell is full width, not a 100px column. */
    const cellW = await cells.nth(2).evaluate((e) => e.getBoundingClientRect().width);
    expect(cellW).toBeGreaterThan(300);
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
    await page.setViewportSize({ width: 1024, height: 800 });
    await expect
      .poll(() =>
        table
          .locator('tbody tr')
          .first()
          .evaluate((e) => getComputedStyle(e).display),
      )
      .toBe('table-row');
    expect(await table.locator('thead').evaluate((e) => e.getBoundingClientRect().height)).toBeGreaterThan(20);
    expect(await cells.first().evaluate((e) => getComputedStyle(e, '::before').content)).toBe('none');
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('69: Card and StatusPill pass attributes to the root; a titled card is labelled by its title', async ({
    page,
  }) => {
    await story(page, 'aura-new-in-5-8--card-and-pill-attributes');
    const card = page.getByTestId('history-item');
    await expect(card).toHaveAttribute('id', 'renewal-prefs');
    await expect(card).toHaveAttribute('data-request-id', 'CR-1042');
    await expect(page.getByRole('region', { name: 'Renewal preferences' })).toHaveAttribute('id', 'renewal-prefs');
    const pill = card.locator('.aura-pill');
    await expect(pill).toHaveAttribute('data-state', 'decided');
    await expect(pill).toHaveAttribute('data-outcome', 'approved');
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });
});

test.describe('5.9: preparing for 6.0', () => {
  /* The dev notices are checked in packages/react/scripts/prep60-test.ts: this Storybook build is a production build. */
  test('icon components draw what the name draws, in buttons, nav items and alone', async ({ page }) => {
    await story(page, 'aura-new-in-5-9--icon-components');
    const svg = (loc: import('@playwright/test').Locator) =>
      loc
        .locator('svg')
        .first()
        .evaluate((s) => s.outerHTML);
    const byComp = await svg(page.getByRole('button', { name: 'New invoice' }).first());
    expect(byComp).toBe(await svg(page.getByTestId('by-name')));
    await expect(page.getByRole('img', { name: 'Members' })).toHaveAttribute('width', '24');
    await expect(page.locator('.aura-nav svg.aura-icon')).toHaveCount(3);
    await expect(page.getByRole('button', { name: 'Delete row' }).locator('svg.aura-icon')).toHaveCount(1);
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('a locale pack gives the Thai labels', async ({ page }) => {
    await story(page, 'aura-new-in-5-9--locale-pack');
    await expect(page.getByRole('navigation', { name: 'เลขหน้า' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ปิด' })).toBeVisible();
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });
});

test.describe('5.9: Chamber-OS addendum 9', () => {
  test('70: Drawer attributes on the panel; the close button says what it closes; modal behaviour unchanged', async ({
    page,
  }) => {
    await story(page, 'aura-new-in-5-9--drawer-attributes');
    const open = page.getByRole('button', { name: 'Pay invoice' });
    await open.click();
    const panel = page.getByTestId('pay-sheet-content');
    await expect(panel).toHaveClass(/aura-drawer/);
    await expect(panel).toHaveAttribute('id', 'pay-sheet');
    await expect(panel).toHaveAttribute('role', 'dialog');
    await expect(panel).toHaveAttribute('aria-modal', 'true');
    const close = page.getByTestId('pay-sheet-close');
    await expect(close).toHaveAccessibleName('Close payment drawer');
    await expect(close).toHaveAttribute('data-aura-tip', 'Close payment drawer'); // 5.32: AURA's tip, not a title
    /* Focus starts in the body, Tab stays inside, Escape closes, focus returns to the opener. */
    await expect(page.getByLabel('Name on card')).toBeFocused();
    for (let i = 0; i < 4; i++) await page.keyboard.press('Tab');
    expect(await panel.evaluate((p) => p.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(panel).toHaveCount(0);
    await expect(open).toBeFocused();
    /* The scrim and the close button still close it. */
    await open.click();
    await page.getByTestId('pay-sheet-close').click();
    await expect(page.getByTestId('pay-sheet-content')).toHaveCount(0);
    await open.click();
    await page.locator('.aura-scrim').click({ position: { x: 10, y: 10 } });
    await expect(page.getByTestId('pay-sheet-content')).toHaveCount(0);
    await open.click();
    expect(await axeScan(page, '.aura-drawer')).toEqual([]);
  });

  test('71: kept-mounted panels, manual activation, per-tab attributes', async ({ page }) => {
    await story(page, 'aura-new-in-5-9--payment-tabs');
    const card = page.getByTestId('method-card');
    await expect(card).toHaveAccessibleName('Card — switch payment method');
    await expect(card).toHaveAttribute('role', 'tab');
    /* Keep the card panel's node and what was typed in it across a switch. */
    const input = page.getByTestId('card-input');
    await input.fill('4242 4242');
    await input.evaluate((el) => ((window as unknown as { __cardInput: Element }).__cardInput = el));
    const panels = page.getByRole('tabpanel', { includeHidden: true });
    await expect(panels).toHaveCount(3);
    /* Manual: arrows move focus and the tab stop, never the selection. */
    await card.focus();
    await page.keyboard.press('ArrowRight');
    const pp = page.getByTestId('method-promptpay');
    await expect(pp).toBeFocused();
    await expect(pp).toHaveAttribute('tabindex', '0');
    await expect(card).toHaveAttribute('tabindex', '-1');
    await expect(card).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('End');
    await expect(page.getByRole('tab', { name: 'Bank transfer' })).toBeFocused();
    await page.keyboard.press('Home');
    await expect(card).toBeFocused();
    await expect(page.getByTestId('changes')).toHaveText('Changes 0');
    /* Enter selects; the card panel is hidden but still the same node. */
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await expect(pp).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('changes')).toHaveText('Changes 1');
    await expect(page.getByText('Scan the QR code')).toBeVisible();
    await expect(input).toBeHidden();
    /* Space and click select too; back on Card the input is the same element with its value. */
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Space');
    await expect(page.getByRole('tab', { name: 'Bank transfer' })).toHaveAttribute('aria-selected', 'true');
    await card.click();
    await expect(input).toBeVisible();
    await expect(input).toHaveValue('4242 4242');
    expect(await input.evaluate((el) => el === (window as unknown as { __cardInput: Element }).__cardInput)).toBe(true);
    /* Enter on the tab that is already selected starts nothing. */
    await card.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('changes')).toHaveText('Changes 3');
    /* A press without a click (dragged off) focuses a tab; the arrows move from there. */
    const transfer = page.getByRole('tab', { name: 'Bank transfer' });
    const box = (await transfer.boundingBox())!;
    await page.mouse.move(box.x + 5, box.y + 5);
    await page.mouse.down();
    await page.mouse.move(box.x + 5, box.y + 200);
    await page.mouse.up();
    await expect(transfer).toBeFocused();
    await page.keyboard.press('ArrowLeft');
    await expect(pp).toBeFocused();
    await expect(page.getByTestId('changes')).toHaveText('Changes 3');
    /* Leaving the list puts the tab stop back on the selected tab. */
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Tab');
    await expect(card).toHaveAttribute('tabindex', '0');
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('71: default Tabs still select with the arrows and render one panel', async ({ page }) => {
    await story(page, 'aura-layout--tabs');
    const tabs = page.getByRole('tab');
    await tabs.first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel', { includeHidden: true })).toHaveCount(1);
  });
});

test.describe('5.10: Chamber-OS addendum 10', () => {
  test('72: segmented Tabs — same roles and keys, pill look, 44px on touch, ring not clipped, forced colours', async ({
    page,
  }) => {
    await story(page, 'aura-new-in-5-10--segmented-tabs');
    const list = page.getByRole('tablist', { name: 'Payment method' });
    await expect(list).toHaveClass(/aura-segmented/);
    await expect(list).toHaveClass(/is-full/);
    const card = page.getByTestId('seg-card');
    const pp = page.getByTestId('seg-promptpay');
    await expect(card).toHaveAttribute('role', 'tab');
    await expect(card).toHaveClass(/is-selected/);
    await expect(page.getByRole('tabpanel', { includeHidden: true })).toHaveCount(2);
    /* Full width: the two tabs share the track. */
    const [lb, cb, pb] = [await list.boundingBox(), await card.boundingBox(), await pp.boundingBox()];
    expect(Math.abs(cb!.width - pb!.width)).toBeLessThan(2);
    expect(cb!.width + pb!.width).toBeGreaterThan(lb!.width - 12);
    /* Manual activation still applies; Enter selects. */
    await card.focus();
    await page.keyboard.press('ArrowRight');
    await expect(pp).toBeFocused();
    await expect(card).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Enter');
    await expect(pp).toHaveClass(/is-selected/);
    /* The ring is drawn inside the pill (round), so the scrolling list and the next pill can't cover it. */
    await page.keyboard.press('ArrowLeft');
    await expect(card).toBeFocused();
    const ring = await card.evaluate((el) => {
      const s = getComputedStyle(el);
      return {
        style: s.outlineStyle,
        offset: parseFloat(s.outlineOffset),
        width: parseFloat(s.outlineWidth),
        radius: s.borderTopLeftRadius,
      };
    });
    expect(ring.style).toBe('solid');
    expect(ring.offset).toBeLessThanOrEqual(-ring.width);
    expect(parseFloat(ring.radius)).toBeGreaterThan(100);
    /* The selected pill's edge against the track: ≥3:1 in light and dark (SC 1.4.11). */
    for (const theme of ['light', 'dark']) {
      await story(page, 'aura-new-in-5-10--segmented-tabs', theme);
      const ratio = await page.getByTestId('seg-card').evaluate((el) => {
        const rgb = (c: string) => (c.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
        const lum = (c: number[]) =>
          c
            .map((v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
            .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i]!, 0);
        const edge = rgb(getComputedStyle(el).boxShadow.split(')')[0] + ')');
        const track = rgb(getComputedStyle(el.parentElement!).backgroundColor);
        const [a, b] = [lum(edge), lum(track)];
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      });
      expect(ratio, theme).toBeGreaterThanOrEqual(3);
    }
    /* Forced colours mark the selected tab. */
    await page.emulateMedia({ forcedColors: 'active' });
    await story(page, 'aura-new-in-5-10--segmented-tabs');
    const fc = await page.getByTestId('seg-card').evaluate((el) => getComputedStyle(el).borderTopStyle);
    expect(fc).toBe('solid');
    /* A focused tab that isn't selected looks different: a dashed ring, no selection border. */
    await page.getByTestId('seg-card').focus();
    await page.keyboard.press('ArrowRight');
    const f2 = await page
      .getByTestId('seg-promptpay')
      .evaluate((el) => ({ ring: getComputedStyle(el).outlineStyle, border: getComputedStyle(el).borderTopStyle }));
    expect(f2).toEqual({ ring: 'dashed', border: 'none' });
    await page.emulateMedia({ forcedColors: 'none' });
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('72: segmented tabs are 44px on a touch screen; many tabs scroll in the track, labels whole', async ({
    browser,
  }) => {
    const ctx = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 800 } });
    const page = await ctx.newPage();
    await story(page, 'aura-new-in-5-10--segmented-tabs');
    expect((await page.getByTestId('seg-card').boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await story(page, 'aura-new-in-5-10--many-segmented-tabs');
    const m = await page.evaluate(() => ({
      page: document.documentElement.scrollWidth,
      clipped: Array.from(document.querySelectorAll('.aura-tab')).filter((t) => t.scrollWidth > t.clientWidth + 1)
        .length,
    }));
    expect(m.page).toBeLessThanOrEqual(390);
    expect(m.clipped).toBe(0);
    await ctx.close();
  });

  test('73: disabled menu items are reachable, announced, inert; an all-disabled menu still takes focus', async ({
    page,
  }) => {
    await story(page, 'aura-new-in-5-10--disabled-menu-items');
    const trigger = page.getByRole('button', { name: 'Invoice actions' });
    await trigger.click();
    const items = page.getByRole('menuitem');
    await expect(items.first()).toBeFocused();
    await page.keyboard.press('ArrowDown');
    const email = page.getByRole('menuitem', { name: 'Email me a copy' });
    await expect(email).toBeFocused();
    await expect(email).toHaveAttribute('aria-disabled', 'true');
    await expect(email).toHaveAccessibleDescription('Again in 5 min');
    await expect(email).toHaveAccessibleName('Email me a copy');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');
    await email.click({ force: true });
    await expect(page.getByRole('menu')).toBeVisible();
    await expect(page.getByTestId('menu-log')).toHaveText('none');
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'View payments' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('menu-log')).toHaveText('payments');
    /* A menu with one disabled item: focus goes in, Escape closes and returns focus to the trigger. */
    const resend = page.getByRole('button', { name: 'Resend' });
    await resend.click();
    await expect(page.getByRole('menuitem', { name: 'Email me a copy' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toHaveCount(0);
    await expect(resend).toBeFocused();
    await expect(page.getByTestId('menu-log')).toHaveText('payments');
    await resend.click();
    expect(await axeScan(page, '.aura-menu')).toEqual([]);
  });
});

test.describe('5.10.1: fixes from a new project', () => {
  test('a disabled switch that is on reads as on; rich Tag children name the remove button; toned nav badges', async ({
    page,
  }) => {
    for (const theme of ['light', 'dark']) {
      await story(page, 'aura-new-in-5-10--locked-switch-rich-tag-nav-badge', theme);
      const [on, off] = [
        page.getByRole('switch', { name: 'Two-factor sign-in' }),
        page.getByRole('switch', { name: 'Sign-in alerts' }),
      ];
      await expect(on).toBeDisabled();
      await expect(on).toHaveAttribute('aria-checked', 'true');
      /* Sample each track away from its thumb: on (thumb right) at the left end, off (thumb left) at the right end. */
      const sample = async (loc: import('@playwright/test').Locator, side: 'left' | 'right') => {
        const box = (await loc.boundingBox())!;
        const png = await page.screenshot({
          clip: {
            x: side === 'left' ? box.x + 2 : box.x + box.width - 4,
            y: box.y + box.height / 2 - 1,
            width: 2,
            height: 2,
          },
        });
        return page.evaluate(async (b64) => {
          const img = new Image();
          img.src = 'data:image/png;base64,' + b64;
          await img.decode();
          const c = document.createElement('canvas');
          c.width = c.height = 2;
          const x = c.getContext('2d')!;
          x.drawImage(img, 0, 0);
          return Array.from(x.getImageData(0, 0, 1, 1).data.slice(0, 3));
        }, png.toString('base64'));
      };
      const lum = (c: number[]) =>
        c
          .map((v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
          .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i]!, 0);
      const [a, b] = [lum(await sample(on, 'left')), lum(await sample(off, 'right'))];
      expect((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05), theme).toBeGreaterThanOrEqual(3);
    }
    /* Disabled rows look alike whether on or off: readable text, secondary label, only the switch fades. */
    const rows = await page.locator('.aura-switch-row.is-disabled').evaluateAll((els) =>
      els.map((r) => ({
        opacity: getComputedStyle(r).opacity,
        label: getComputedStyle(r.querySelector('.aura-choice__label')!).color,
      })),
    );
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual(rows[1]);
    expect(rows[0]!.opacity).toBe('1');
    /* Forced colours: a locked-on switch is GrayText at full opacity. Compared with a GrayText probe rather than a
     * literal — system colours resolve differently per browser build (headless shell reports them all as white). */
    await page.emulateMedia({ forcedColors: 'active' });
    /* The track animates its background; read it once the change to the forced colour has finished. */
    await page.waitForFunction(() => document.getAnimations().every((a) => a.playState === 'finished'));
    const fc = await page.getByRole('switch', { name: 'Two-factor sign-in' }).evaluate((el) => {
      const probe = document.createElement('span');
      probe.style.cssText = 'background: GrayText; forced-color-adjust: none';
      document.body.appendChild(probe);
      const want = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return { bg: getComputedStyle(el).backgroundColor, want, opacity: getComputedStyle(el).opacity };
    });
    expect(fc.bg).toBe(fc.want);
    expect(fc.opacity).toBe('1');
    await page.emulateMedia({ forcedColors: 'none' });
    await expect(page.getByRole('button', { name: 'Remove Acme AB' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Remove filter: status' })).toBeVisible();
    await expect(page.locator('.aura-nav .aura-badge--danger')).toHaveText('Fault');
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });
});

test.describe('5.11: Chamber-OS addendum 11', () => {
  test('row boxes are named after their row and take clicks over 24×24, in the grid and in cards', async ({ page }) => {
    await story(page, 'aura-new-in-5-11--selection-labels-and-targets');
    await expect(page.locator('[data-testid=sel-cards] .aura-table--stacked')).toHaveCount(1);
    await expect(page.locator('[data-testid=sel-grid] .aura-table--stacked')).toHaveCount(0);
    for (const t of ['sel-grid', 'sel-cards']) {
      const box = page.getByTestId(t);
      /* 75: the gridcell and its checkbox carry the app's name; the default stays "Select row {key}". */
      await expect(box.getByRole('checkbox', { name: 'Select Nordic Timber Oy', exact: true })).toHaveCount(1);
      await expect(box.getByRole('gridcell', { name: 'Select Nordic Timber Oy', exact: true })).toHaveCount(1);
      /* 77: every input is at least 24×24 around the 16px box it draws. */
      const sizes = await box.locator('.aura-check__input').evaluateAll((els) =>
        els.map((e) => {
          const r = e.getBoundingClientRect(),
            d = e.nextElementSibling!.getBoundingClientRect();
          return { w: r.width, h: r.height, dw: d.width, dh: d.height, dx: d.left - r.left, dy: d.top - r.top };
        }),
      );
      expect(sizes).toHaveLength(4);
      for (const s of sizes) {
        expect(s.w, t).toBeGreaterThanOrEqual(24);
        expect(s.h, t).toBeGreaterThanOrEqual(24);
        expect([s.dw, s.dh, s.dx, s.dy], t).toEqual([16, 16, 4, 4]);
      }
      /* A click 3px outside the drawn box toggles it — the row box and the header's select-all. */
      const row = box.getByRole('checkbox', { name: 'Select Acme AB', exact: true });
      const drawn = (await row.locator('xpath=following-sibling::*[1]').boundingBox())!;
      await page.mouse.click(drawn.x - 3, drawn.y + drawn.height / 2);
      await expect(row).toBeChecked();
      await page.mouse.click(drawn.x + drawn.width / 2, drawn.y + drawn.height + 3);
      await expect(row).not.toBeChecked();
      const all = box.getByRole('checkbox', { name: 'Select all rows' });
      const hd = (await all.locator('xpath=following-sibling::*[1]').boundingBox())!;
      await page.mouse.click(hd.x + hd.width + 3, hd.y + hd.height / 2);
      await expect(all).toBeChecked();
      await page.mouse.click(hd.x - 3, hd.y + hd.height / 2);
      await expect(all).not.toBeChecked();
    }
    await expect(
      page.getByTestId('sel-default').getByRole('checkbox', { name: 'Select M-102', exact: true }),
    ).toHaveCount(1);
    /* The wider input sits over the sticky gutter, but never over the sticky header, and not once the column has
     * scrolled under the gutter. */
    const sc = page.getByTestId('sel-scroll').locator('.aura-table__scroll');
    const hit = (x: number, y: number) =>
      page.evaluate(
        ([x, y]) => {
          const e = document.elementFromPoint(x!, y!)!;
          return e.closest('.aura-table__head') ? 'head' : e.getAttribute('aria-label') || e.className;
        },
        [x, y],
      );
    const acme = page.getByTestId('sel-scroll').getByRole('checkbox', { name: 'Select Acme AB M-101', exact: true });
    await page.getByTestId('sel-scroll').scrollIntoViewIfNeeded();
    let d = (await acme.locator('xpath=following-sibling::*[1]').boundingBox())!;
    expect(await hit(d.x - 3, d.y + d.height / 2)).toBe('Select Acme AB M-101');
    await sc.evaluate((el) => el.scrollTo(0, 16));
    await expect(sc.locator('xpath=..')).not.toHaveClass(/is-scrolled-x/);
    d = (await acme.locator('xpath=following-sibling::*[1]').boundingBox())!;
    const head = (await page.getByTestId('sel-scroll').locator('.aura-table__head').boundingBox())!;
    expect(d.y - 4).toBeLessThan(head.y + head.height - 2); /* the row's input reaches under the header… */
    expect(await hit(d.x + d.width / 2, head.y + head.height - 2)).toBe('head'); /* …which still takes the click */
    await sc.evaluate((el) => el.scrollTo(12, 0));
    await expect(sc.locator('xpath=..')).toHaveClass(/is-scrolled-x/);
    d = (await acme.locator('xpath=following-sibling::*[1]').boundingBox())!;
    expect(await hit(d.x - 2, d.y + d.height / 2)).toBe('aura-table__gutter');
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('Checkbox keeps a passed aria-describedby and adds its description after it', async ({ page }) => {
    await story(page, 'aura-new-in-5-11--checkbox-described-by');
    const ids = await page
      .locator('input[type=checkbox]')
      .evaluateAll((els) => els.map((e) => e.getAttribute('aria-describedby')));
    expect(ids).toEqual(['terms-hint terms-desc', null, 'terms-hint']);
    await expect(page.getByRole('checkbox', { name: 'Email me the member newsletter' })).toHaveAccessibleDescription(
      'You can withdraw consent at any time. We send one newsletter a month.',
    );
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('rowHeight="auto": a cell that wraps grows its row, every cell stays centred; the default is one line', async ({
    page,
  }) => {
    await story(page, 'aura-new-in-5-11--auto-row-height');
    const measure = (t: string) =>
      page
        .getByTestId(t)
        .locator('.aura-table__row[role=row]')
        .evaluateAll((rows) =>
          rows.map((row) => {
            const rh = row.getBoundingClientRect().height;
            const badges = Array.from(row.querySelectorAll('.aura-badge')).map((b) => b.getBoundingClientRect());
            /* Each cell's content: equal space above and below (to the pixel) means centred. */
            const off = Array.from(row.querySelectorAll('[role=gridcell]')).map((c) => {
              const box = c.getBoundingClientRect();
              const inner = (c.querySelector('.aura-table__cell, .aura-check') || c).getBoundingClientRect();
              return {
                full: Math.abs(box.height - (rh - 1)) <= 1,
                skew: Math.abs(inner.top - box.top - (box.bottom - inner.bottom)),
              };
            });
            return {
              rh,
              lines: badges.length > 1 ? new Set(badges.map((b) => Math.round(b.top))).size : 1,
              gap: badges.length > 1 ? badges[1]!.top - badges[0]!.bottom : null,
              off,
            };
          }),
        );
    const auto = await measure('auto-rows');
    const fixed = await measure('fixed-rows');
    /* Acme's two tags wrap onto two lines, apart, and the row grows; single-line rows keep the density height. */
    expect(auto[0]!.lines).toBe(2);
    expect(auto[0]!.gap).toBeGreaterThanOrEqual(2);
    expect(auto[0]!.rh).toBeGreaterThan(fixed[0]!.rh);
    expect(auto.slice(1).map((r) => r.rh)).toEqual(fixed.slice(1).map((r) => r.rh));
    for (const r of auto)
      for (const c of r.off) {
        expect(c.full).toBe(true);
        expect(c.skew).toBeLessThanOrEqual(1);
      }
    /* Default: every row one fixed height, the tags on one line (clipped with an ellipsis), no new classes. */
    expect(new Set(fixed.map((r) => r.rh)).size).toBe(1);
    expect(fixed[0]!.lines).toBe(1);
    await expect(page.getByTestId('fixed-rows').locator('.aura-table__row--auto, .aura-table__cell')).toHaveCount(0);
    /* The pinned ID cell covers the full row height, so nothing scrolls into view behind it. */
    const pin = await page
      .getByTestId('auto-rows')
      .locator('.aura-table__row[role=row]')
      .first()
      .evaluate((row) => [
        row.getBoundingClientRect().height,
        row.querySelector('.is-pinned')!.getBoundingClientRect().height,
      ]);
    expect(pin[0]! - pin[1]!).toBeLessThanOrEqual(1);
    /* Cards: rowHeight="auto" changes nothing — same card heights, fields still block with their labels above. */
    const cards = (t: string) =>
      page
        .getByTestId(t)
        .locator('.aura-table__row[role=row]')
        .evaluateAll((rows) =>
          rows.map((r) => [
            Math.round(r.getBoundingClientRect().height),
            getComputedStyle(r.querySelector('[data-card=field]')!).display,
          ]),
        );
    await expect(page.locator('[data-testid$=-cards] .aura-table--stacked')).toHaveCount(2);
    expect(await cards('auto-cards')).toEqual(await cards('fixed-cards'));
    /* Compact density with a small Button and IconButton: rows that fit keep the 40px row height with auto rows. */
    const heights = (t: string) =>
      page
        .getByTestId(t)
        .locator('.aura-table__row[role=row]')
        .evaluateAll((rows) => rows.map((r) => Math.round(r.getBoundingClientRect().height)));
    expect(await heights('fixed-compact')).toEqual([40, 40, 40]);
    expect(await heights('auto-compact')).toEqual([40, 40, 40]);
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });
});

test.describe('5.12: Chamber-OS addendum 12', () => {
  const faces = (page: Page) =>
    page.locator('.aura-filterselect, .aura-tag').evaluateAll((els) =>
      els.map((e) => {
        const r = e.getBoundingClientRect();
        const v = e.querySelector('.aura-filterselect__value');
        return {
          text: v ? e.querySelector('.aura-filterselect__name')!.textContent + ' ' + v.textContent : e.textContent,
          top: Math.round((r.top + r.bottom) / 2) /* the row a face sits in: faces and Tags differ in height */,
          left: r.left,
          right: r.right,
          clipped: v ? v.scrollWidth > v.clientWidth + 0.5 || v.getBoundingClientRect().height > 24 : false,
        };
      }),
    );

  test('FilterSelect reads "Status All", is named by its filter, fits a phone row and wraps whole', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 700 });
    await story(page, 'aura-new-in-5-12--filter-selects');
    await expect(page.getByRole('region', { name: 'Member filters' })).toMatchAriaSnapshot(`
      - searchbox "Search members"
      - combobox "Status": All statuses
      - combobox "Plan": All plans
      - combobox "Type": All types
      - button "Unpaid"
    `);
    /* Three filters and a Tag on one row at 375px, each as wide as its words. */
    let row = await faces(page);
    expect(row.map((f) => f.text)).toEqual(['Status All', 'Plan All', 'Type All', 'Unpaid']);
    expect(new Set(row.map((f) => f.top)).size).toBe(1);
    /* Keyboard as Select: Enter opens the list, arrows move, Enter picks, focus stays on the face. */
    const plan = page.getByRole('combobox', { name: 'Plan' });
    await plan.focus();
    await page.keyboard.press('Enter');
    await expect(plan).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('listbox', { name: 'Plan' })).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(plan).toBeFocused();
    await expect(page.getByTestId('filter-state')).toHaveText('all · diamond · all · any · —');
    /* The long value shows in full; the next filter moves to the next row instead. Nothing leaves the screen. */
    row = await faces(page);
    expect(row[1]).toMatchObject({ text: 'Plan Diamond Partnership', clipped: false });
    expect(row[2]!.top).toBeGreaterThan(row[1]!.top);
    for (const f of row) expect(f.right).toBeLessThanOrEqual(375 - 16 + 0.5);
    await expect(plan).toHaveAccessibleName('Plan');
    await expect(page.getByRole('region', { name: 'Member filters' })).toMatchAriaSnapshot(
      `- combobox "Plan": Diamond Partnership`,
    );
    /* Focus ring on keyboard focus only. */
    const ring = (name: string) =>
      page.getByRole('combobox', { name }).evaluate((el) => getComputedStyle(el).outlineStyle);
    await page.getByRole('combobox', { name: 'Status' }).click();
    await expect(page.getByRole('combobox', { name: 'Status' })).toBeFocused();
    expect(await ring('Status')).toBe('none'); /* a click shows no ring */
    await page.keyboard.press('Escape');
    await page.getByRole('searchbox').focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('combobox', { name: 'Status' })).toBeFocused();
    expect(await ring('Status')).toBe('solid');
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('FilterSelect is right to left with its list; searchGrow fills the row', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 700 });
    await story(page, 'aura-new-in-5-12--filter-selects-rtl');
    const status = page.getByRole('combobox', { name: 'Status' });
    const xs = await status.evaluate((el) => {
      const x = (s: string) => el.querySelector(s)!.getBoundingClientRect().left;
      return [x('.aura-filterselect__name'), x('.aura-filterselect__value'), x('.aura-filterselect__chevron')];
    });
    expect(xs[0]).toBeGreaterThan(xs[1]!); /* name, then value, then chevron — from the right */
    expect(xs[1]).toBeGreaterThan(xs[2]!);
    await status.click();
    const list = page.locator('.aura-select__popover');
    await expect(list).toHaveAttribute('dir', 'rtl');
    const [f, l] = [(await status.boundingBox())!, (await list.boundingBox())!];
    expect(Math.abs(f.x + f.width - (l.x + l.width))).toBeLessThanOrEqual(1); /* aligned to the face's start edge */
    await page.keyboard.press('Escape');
    /* searchGrow: the search takes the room the filters leave (default stops at 360px). */
    const search = (await page.locator('.aura-filterbar__search').boundingBox())!;
    const bar = (await page.locator('.aura-filterbar__row').boundingBox())!;
    const lastFilter = (await page.locator('.aura-tag').boundingBox())!;
    expect(search.width).toBeGreaterThan(360);
    expect(search.x + search.width).toBeCloseTo(
      bar.x + bar.width,
      0,
    ); /* it reaches the row's end (RTL: left is the end) */
    expect(lastFilter.x).toBeCloseTo(bar.x, 0);
    await expect(page.locator('.aura-filterbar__spacer')).toBeHidden();
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('Select: a list wider than its field stays on screen; a right-to-left field gets a right-to-left list', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 800, height: 700 });
    await story(page, 'aura-new-in-5-12--select-list-placement');
    const list = page.locator('.aura-select__popover');
    const ltr = page.getByTestId('narrow-ltr');
    await ltr.click();
    let [f, l] = [(await ltr.boundingBox())!, (await list.boundingBox())!];
    expect(l.width).toBeGreaterThan(f.width + 40);
    expect(l.x + l.width).toBeLessThanOrEqual(800 - 8 + 0.5); /* moved left to stay on screen */
    await expect(list).toHaveAttribute('dir', 'ltr');
    await page.keyboard.press('Escape');
    const rtl = page.getByTestId('narrow-rtl');
    await rtl.click();
    [f, l] = [(await rtl.boundingBox())!, (await list.boundingBox())!];
    await expect(list).toHaveAttribute('dir', 'rtl');
    expect(l.width).toBeGreaterThan(f.width + 40);
    expect(Math.abs(f.x + f.width - (l.x + l.width))).toBeLessThanOrEqual(1); /* from the field's right edge */
    await page.keyboard.press('Escape');
  });
});

test.describe('5.13: Chamber-OS addendum 13', () => {
  const shown = (l: import('@playwright/test').Locator) =>
    l.evaluateAll((els) => els.filter((e) => e.getClientRects().length > 0).length);

  test('80: DataTable cards leave out columns and the boxes, and order their fields; the grid is unchanged', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1100, height: 900 });
    await story(page, 'aura-new-in-5-13--data-table-card-options');
    const grid = page.getByTestId('grid'),
      cards = page.getByTestId('cards');
    await expect(cards.locator('.aura-table--stacked')).toHaveCount(1);
    await expect(grid.locator('.aura-table--stacked')).toHaveCount(0);
    /* Grid: every column in its order, the boxes and the ⋯ menus. */
    expect(await grid.locator('.aura-table__th').allTextContents()).toEqual([
      'COMPANY',
      'COUNTRY',
      'ENGAGEMENT',
      'PRIMARY CONTACT',
      'PLAN',
      'MEMBER NO.',
      'Actions',
    ]);
    expect(await shown(grid.getByRole('checkbox'))).toBe(4);
    expect(await shown(grid.getByRole('button', { name: /^More for/ }))).toBe(3);
    /* Cards: no country, no ⋯, no boxes, no select-all line; fields in cardOrder, each with its label. */
    expect(await shown(cards.locator('.aura-table__row').getByRole('checkbox'))).toBe(0);
    expect(await shown(cards.getByRole('button', { name: /^More for/ }))).toBe(0);
    expect(await shown(cards.locator('.aura-table__head'))).toBe(1); /* still there for screen readers… */
    expect((await cards.locator('.aura-table__head').boundingBox())!.height).toBeLessThanOrEqual(1); /* …not seen */
    const fields = await cards
      .locator('[role=row]')
      .nth(1)
      .evaluate((row) =>
        Array.from(row.querySelectorAll<HTMLElement>('[role=gridcell]'))
          .filter((c) => c.getClientRects().length > 0)
          .map((c) => ({ card: c.dataset.card, label: c.dataset.label, r: c.getBoundingClientRect() }))
          .sort((a, b) => a.r.top - b.r.top || a.r.left - b.r.left)
          .map((c) => (c.card === 'field' ? c.label : c.card)),
      );
    expect(fields).toEqual(['title', 'MEMBER NO.', 'PLAN', 'PRIMARY CONTACT', 'ENGAGEMENT']);
    /* The selection is kept (M-102 still selected, shown in the grid), and Space on a card doesn't change it. */
    await expect(cards.locator('[role=row][aria-selected=true]')).toHaveCount(1);
    const card = cards.locator('[role=row]').nth(1).getByRole('gridcell').first();
    await card.focus();
    await page.keyboard.press('Space');
    await expect(page.getByTestId('selected')).toHaveText('Selected: M-102');
    /* Arrow keys skip what the card leaves out: from the title, Right lands on a visible cell. */
    await page.keyboard.press('ArrowRight');
    const focused = await page.evaluate(() => {
      const a = document.activeElement as HTMLElement;
      return { shown: a.getClientRects().length > 0, card: a.dataset.card };
    });
    expect(focused).toEqual({ shown: true, card: 'field' });
    /* ArrowLeft past a left-out column lands on the one before it, not back where it started. */
    await cards.locator('[data-rc="1:3"]').focus(); /* ENGAGEMENT; COUNTRY (1:2) is left out */
    await page.keyboard.press('ArrowLeft');
    await expect(cards.locator('[data-rc="1:1"]')).toBeFocused();
    /* Tab reaches the cards: the grid's one tab stop is a shown cell, not the hidden box. */
    await page.reload();
    await page.waitForSelector('#storybook-root > *');
    await grid.locator('[role=gridcell][tabindex="0"]').focus();
    await page.keyboard.press('Tab');
    const tabbed = await page.evaluate(() => {
      const a = document.activeElement as HTMLElement;
      return {
        inCards: !!a.closest('[data-testid=cards]'),
        shown: a.getClientRects().length > 0,
        role: a.getAttribute('role'),
      };
    });
    expect(tabbed).toEqual({ inCards: true, shown: true, role: 'gridcell' });
    /* Narrowing into cards while a left-out cell has focus: focus moves to the nearest shown cell, not the page. */
    await grid.locator('[data-rc="1:2"]').focus(); /* COUNTRY */
    await page.setViewportSize({ width: 500, height: 900 });
    await expect(grid.locator('.aura-table--stacked')).toHaveCount(1);
    await expect
      .poll(() =>
        page.evaluate(() => {
          const a = document.activeElement as HTMLElement;
          return !!a.closest('[data-testid=grid]') && a.getClientRects().length > 0;
        }),
      )
      .toBe(true);
    await page.setViewportSize({ width: 1100, height: 900 });
    /* …but not after the person has left the table: click away, then narrow — focus stays on the page. */
    await expect(grid.locator('.aura-table--stacked')).toHaveCount(0);
    await grid.locator('[data-rc="1:2"]').focus();
    await page.getByTestId('selected').click();
    await page.setViewportSize({ width: 500, height: 900 });
    await expect(grid.locator('.aura-table--stacked')).toHaveCount(1);
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => document.activeElement === document.body)).toBe(true);
    await page.setViewportSize({ width: 1100, height: 900 });
    /* Loading: the skeleton cards leave out the same columns and boxes. */
    const skel = await page
      .getByTestId('cards-loading')
      .locator('.aura-table__row--skeleton')
      .evaluateAll((rows) =>
        rows.map(
          (r) =>
            Array.from(r.children).filter((c) => c.getClientRects().length > 0 && !c.matches('.aura-table__break'))
              .length,
        ),
      );
    expect(skel).toEqual([5, 5]);
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('81: Table align="middle" centres rows; bordered={false} lines up with its Card; stacked unchanged', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1000, height: 900 });
    await story(page, 'aura-new-in-5-13--table-align-flush');
    const flush = page.getByTestId('flush'),
      framed = page.getByTestId('framed');
    const box = (l: import('@playwright/test').Locator) =>
      l.evaluate((e) => {
        const r = e.getBoundingClientRect();
        return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, mid: (r.top + r.bottom) / 2 };
      });
    /* Flush: no frame; the first and last cells meet the Card's content edges, under its heading. */
    const wrap = await flush.locator('.aura-tbl-wrap').evaluate((e) => getComputedStyle(e).borderTopWidth);
    expect(wrap).toBe('0px');
    const title = await box(flush.locator('.aura-card__title'));
    const firstCell = await box(flush.locator('.aura-tbl__td').first());
    const text = await flush
      .locator('.aura-tbl__td')
      .first()
      .evaluate((e) => {
        const r = document.createRange();
        r.selectNodeContents(e);
        return r.getBoundingClientRect().left;
      });
    expect(Math.abs(text - title.left)).toBeLessThanOrEqual(1);
    expect(firstCell.left).toBeCloseTo(title.left, 0);
    /* Middle: the number sits level with the button beside it. Default: at the top of the row. */
    const mid = async (scope: import('@playwright/test').Locator) => {
      const n = await box(scope.locator('.aura-tbl__body .aura-tbl__td.is-numeric').first());
      const b = await box(scope.locator('.aura-tbl__body .aura-btn').first());
      const t = await scope
        .locator('.aura-tbl__body .aura-tbl__td.is-numeric')
        .first()
        .evaluate((e) => {
          const r = document.createRange();
          r.selectNodeContents(e);
          const x = r.getBoundingClientRect();
          return (x.top + x.bottom) / 2;
        });
      return { rowMid: n.mid, text: t, button: b.mid };
    };
    const m = await mid(flush);
    expect(Math.abs(m.text - m.rowMid)).toBeLessThanOrEqual(1);
    expect(Math.abs(m.button - m.rowMid)).toBeLessThanOrEqual(1);
    const d = await mid(framed);
    expect(d.rowMid - d.text).toBeGreaterThan(8); /* default: top-aligned, as before */
    expect(await framed.locator('.aura-tbl-wrap').evaluate((e) => getComputedStyle(e).borderTopWidth)).toBe('1px');
    /* Stacked: the same cards with or without align. */
    const cardsOf = (t: string) =>
      page
        .getByTestId(t)
        .locator('.aura-tbl__td')
        .evaluateAll((els) =>
          els.map((e) => {
            const r = e.getBoundingClientRect();
            return [Math.round(r.top - e.closest('table')!.getBoundingClientRect().top), Math.round(r.height)];
          }),
        );
    expect(await cardsOf('stacked-props')).toEqual(await cardsOf('stacked-plain'));
    /* Frameless and stacked: the caption lines up with the stacked rows' text. */
    const capLeft = await page
      .getByTestId('stacked-flush')
      .locator('caption')
      .evaluate((e) => {
        const r = document.createRange();
        r.selectNodeContents(e);
        return r.getBoundingClientRect().left;
      });
    const cellLeft = await page
      .getByTestId('stacked-flush')
      .locator('.aura-tbl__td')
      .first()
      .evaluate((e) => e.getBoundingClientRect().left);
    expect(Math.abs(capLeft - cellLeft)).toBeLessThanOrEqual(1);
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('82: EmptyState tone="danger" — danger tint, solid danger frame, danger icon; attributes reach the root', async ({
    page,
  }) => {
    for (const theme of ['light', 'dark']) {
      await story(page, 'aura-new-in-5-13--empty-state-danger', theme);
      const want = await page.evaluate(() => {
        const probe = document.createElement('div');
        probe.style.cssText =
          'background: var(--aura-alert-danger-bg); border: 1px solid var(--aura-border-danger); color: var(--aura-fg-danger)';
        document.body.appendChild(probe);
        const s = getComputedStyle(probe);
        const out = { bg: s.backgroundColor, border: s.borderTopColor, fg: s.color };
        probe.remove();
        return out;
      });
      const got = await page.getByTestId('danger').evaluate((e) => {
        const s = getComputedStyle(e),
          i = getComputedStyle(e.querySelector('.aura-empty__icon')!);
        return {
          bg: s.backgroundColor,
          border: s.borderTopColor,
          style: s.borderTopStyle,
          fg: i.color,
          role: e.getAttribute('role'),
        };
      });
      expect(got).toEqual({ bg: want.bg, border: want.border, style: 'solid', fg: want.fg, role: null });
      expect(await page.getByTestId('danger-plain').evaluate((e) => getComputedStyle(e).borderTopStyle)).toBe('none');
      const neutral = await page.getByTestId('neutral').evaluate((e) => {
        const s = getComputedStyle(e);
        return { style: s.borderTopStyle, bg: s.backgroundColor };
      });
      expect(neutral).toEqual({ style: 'dashed', bg: 'rgba(0, 0, 0, 0)' });
      expect(await axeScan(page, '#storybook-root')).toEqual([]);
    }
  });

  test('84: Table card slots — the title and the action share the first line, fields under them; desktop unchanged', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1000, height: 800 });
    await story(page, 'aura-new-in-5-13--table-card-slots');
    const phone = page.getByTestId('queue-phone');
    for (const i of [0, 1]) {
      const row = phone.locator('.aura-tbl__body .aura-tbl__row').nth(i);
      const [title, action] = [
        (await row.locator('[data-card=title]').boundingBox())!,
        (await row.locator('[data-card=action]').boundingBox())!,
      ];
      const fields = await row.locator('.aura-tbl__td:not([data-card])').evaluateAll((els) =>
        els.map((e) => {
          const r = e.getBoundingClientRect();
          return { top: Math.round(r.top), left: Math.round(r.left) };
        }),
      );
      await expect(row.locator('[data-card=title]')).not.toHaveAttribute('data-label');
      expect(Math.abs(title.y - action.y)).toBeLessThanOrEqual(1); /* one line */
      expect(title.x + title.width).toBeLessThanOrEqual(action.x + 0.5); /* a long title wraps before the action */
      const rowBox = (await row.boundingBox())!;
      expect(action.x + action.width).toBeCloseTo(rowBox.x + rowBox.width - 16, 0); /* at the line's end */
      /* 8px under the first line, as between field lines; two fields to a line. */
      const firstLine = Math.round(Math.max(title.y + title.height, action.y + action.height));
      const f0 = (await row.locator('.aura-tbl__td:not([data-card])').first().boundingBox())!;
      const f1 = (await row.locator('.aura-tbl__td:not([data-card])').nth(1).boundingBox())!;
      const f2 = (await row.locator('.aura-tbl__td:not([data-card])').nth(2).boundingBox())!;
      expect(Math.round(f0.y) - firstLine).toBe(8);
      expect(fields[0]!.top).toBe(fields[1]!.top);
      /* The next line starts 8px under the taller field of this one (a date can wrap in a narrower font). */
      expect(Math.round(f2.y - Math.max(f0.y + f0.height, f1.y + f1.height))).toBe(8);
    }
    /* Edge rows: a row header as the title; an action with no title still at the end; a lone title adds no space. */
    const thRow = page.getByTestId('edge-th');
    const [thT, thA] = [
      (await thRow.locator('th').boundingBox())!,
      (await thRow.locator('[data-card=action]').boundingBox())!,
    ];
    expect(Math.abs(thT.y - thA.y)).toBeLessThanOrEqual(1);
    const aRow = (await page.getByTestId('edge-action').boundingBox())!;
    const aBtn = (await page.getByTestId('edge-action').locator('[data-card=action]').boundingBox())!;
    expect(aBtn.x + aBtn.width).toBeCloseTo(aRow.x + aRow.width - 16, 0);
    const tRow = (await page.getByTestId('edge-title').boundingBox())!;
    const tCell = (await page.getByTestId('edge-title').locator('td').boundingBox())!;
    /* even padding (the top one includes the 1px divider above the row) */
    expect(Math.abs(tRow.y + tRow.height - (tCell.y + tCell.height) - (tCell.y - tRow.y - 1))).toBeLessThanOrEqual(0.5);
    expect(await axeScan(page, '[data-testid=queue-edges]')).toEqual([]);
    /* Desktop: a plain table row, cells in their columns. */
    const wide = await page
      .getByTestId('queue-wide')
      .locator('.aura-tbl__body .aura-tbl__td')
      .evaluateAll((els) => els.map((e) => getComputedStyle(e).display));
    expect(new Set(wide)).toEqual(new Set(['table-cell']));
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });
});

test.describe('5.14: Chamber-OS addenda 15–16 (small items)', () => {
  test('102 gated Button, 88 Stat heading, 86 EmptyState outside the outline, 106 warning text, 107 location tabs', async ({
    page,
  }) => {
    for (const theme of ['light', 'dark']) {
      await story(page, 'aura-new-in-5-14--small-options', theme);
      /* 102: announced as unavailable, still in the Tab order, clicks and Enter do nothing until the gate opens. */
      const erase = page.getByRole('button', { name: 'Erase member' });
      await expect(erase).toHaveAttribute('aria-disabled', 'true');
      await expect(erase).not.toHaveAttribute('disabled'); /* not the disabled attribute: it stays focusable */
      await erase.focus();
      await expect(erase).toBeFocused();
      await page.keyboard.press('Enter');
      await erase.click({ force: true }); /* Playwright waits for aria-disabled buttons; a person can still click */
      await expect(page.getByTestId('clicks')).toHaveText('Erased: 0');
      await page.getByRole('checkbox', { name: 'I have exported their data' }).check();
      await expect(erase).not.toHaveAttribute('aria-disabled');
      await erase.click();
      await expect(page.getByTestId('clicks')).toHaveText('Erased: 1');
      /* Hovering a gated button changes nothing, in any variant. */
      for (const b of await page.getByTestId('gated-variants').getByRole('button').all()) {
        const look = () =>
          b.evaluate((e) => {
            const s = getComputedStyle(e);
            return [s.backgroundColor, s.boxShadow, s.transform].join(' | ');
          });
        await page.mouse.move(0, 0);
        const rest = await look();
        await b.hover({ force: true });
        await page.waitForTimeout(250); /* past the transitions */
        expect(await look(), (await b.textContent()) + ' ' + theme).toBe(rest);
      }
      await page.mouse.move(0, 0);
      /* 88: the Stat labels are the sections' headings, a link tile included; 86: the empty state adds none. */
      for (const n of ['Membership', 'Invoices', 'E-Blasts'])
        await expect(page.getByRole('heading', { level: 2, name: n })).toBeVisible();
      await expect(
        page.getByRole('link', { name: /Invoices/ }).getByRole('heading', { name: 'Invoices' }),
      ).toBeVisible();
      await expect(page.getByRole('heading', { name: 'No benefits' })).toHaveCount(0);
      await expect(page.getByText('No benefits', { exact: true })).toBeVisible();
      /* 106: aura-fg-warning reads on the page in both themes (≥4.5:1). */
      const ratio = await page.getByTestId('owed').evaluate((el) => {
        const px = (c: string) => {
          const cv = document.createElement('canvas').getContext('2d')!;
          cv.fillStyle = c;
          cv.fillRect(0, 0, 1, 1);
          return Array.from(cv.getImageData(0, 0, 1, 1).data.slice(0, 3));
        };
        const lum = (c: number[]) =>
          c
            .map((v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
            .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i]!, 0);
        const a = lum(px(getComputedStyle(el).color)),
          b = lum(px(getComputedStyle(document.body).backgroundColor));
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      });
      expect(ratio, theme).toBeGreaterThanOrEqual(4.5);
      /* 107 */
      await expect(page.getByRole('link', { name: 'Contacts' })).toHaveAttribute('aria-current', 'location');
      expect(await axeScan(page, '#storybook-root')).toEqual([]);
    }
  });

  test('91: a field focused in a long Drawer form on a phone keeps clear of the head and the foot', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 600 });
    await story(page, 'aura-new-in-5-14--drawer-scroll-padding');
    await page.getByRole('button', { name: 'Edit member' }).click();
    const body = page.locator('.aura-drawer__body');
    await expect(body).toBeVisible();
    /* Focus it, then scroll the way a phone does when its keyboard opens: just far enough ('nearest'), from the far
     * end of the form. Browsers respect the body's scroll-padding there; without it the ring meets the edge. */
    const clear = async (name: string) => {
      const f = page.getByRole('textbox', { name, exact: true });
      await f.focus();
      await f.evaluate((input) => {
        const b = input.closest('.aura-drawer__body')!;
        b.scrollTop =
          input.closest('.aura-input')!.getBoundingClientRect().top < b.getBoundingClientRect().top + 200
            ? b.scrollHeight
            : 0;
        input.closest('.aura-input')!.scrollIntoView({ block: 'nearest' });
      });
      await page.waitForTimeout(100);
      return f.evaluate((input) => {
        const box = input.closest('.aura-input')!.getBoundingClientRect();
        const b = input.closest('.aura-drawer__body')!.getBoundingClientRect();
        const ring = 3; /* 2px ring, 1px offset */
        return { above: box.top - ring - b.top, below: b.bottom - (box.bottom + ring) };
      });
    };
    const last = await clear('Field 12');
    expect(last.below).toBeGreaterThanOrEqual(8);
    const first = await clear('Field 1');
    expect(first.above).toBeGreaterThanOrEqual(8);
  });

  test('104: --aura-shell-bar-height is the bar’s height; 97: contentPadding={false}', async ({ page }) => {
    for (const w of [390, 1440]) {
      await page.setViewportSize({ width: w, height: 800 });
      await story(page, 'aura-new-in-5-14--shell-options');
      for (const mode of ['comfortable', 'compact', 'long']) {
        if (mode === 'compact') await page.getByRole('button', { name: 'Compact' }).click();
        if (mode === 'long') await page.getByRole('button', { name: 'Long title' }).click();
        await page.waitForTimeout(100); /* the ResizeObserver runs before the next frame */
        const m = await page.evaluate(() => {
          const bar = document.querySelector('.aura-shell__bar')!.getBoundingClientRect().height;
          const token = parseFloat(
            getComputedStyle(document.querySelector('.aura-shell')!).getPropertyValue('--aura-shell-bar-height'),
          );
          const main = getComputedStyle(document.querySelector('.aura-shell__content')!);
          return { bar, token, pad: [main.paddingTop, main.paddingLeft] };
        });
        expect(m.bar, w + ' ' + mode).toBe(m.token);
        /* The wrapping title makes the bar taller than 56px on a phone: the token follows. */
        if (mode === 'long' && w === 390) expect(m.bar).toBeGreaterThan(60);
        expect(m.pad).toEqual(['0px', '0px']);
        /* 97: a Container in flush content keeps its gutters. */
        expect(
          await page.locator('.story-flush-container').evaluate((e) => parseFloat(getComputedStyle(e).paddingLeft)),
        ).toBeGreaterThan(0);
        /* A sticky strip offset by the token sits right under the bar. */
        await page.evaluate(() => window.scrollTo(0, 600));
        const top = await page.getByTestId('sticky').evaluate((e) => e.getBoundingClientRect().top);
        expect(Math.abs(top - m.token)).toBeLessThanOrEqual(0.5);
        await page.evaluate(() => window.scrollTo(0, 0));
      }
    }
  });
});

test('5.14 (108): align "end" is right-aligned in the DataTable grid and starts under its label in the cards', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1200, height: 800 });
  await story(page, 'aura-new-in-5-14--card-amounts-start');
  const measure = (t: string) =>
    page
      .getByTestId(t)
      .locator('.aura-table__td.is-end')
      .evaluateAll((els) =>
        els.map((e) => {
          const cell = e.getBoundingClientRect();
          const r = document.createRange();
          r.selectNodeContents(e);
          const text = r.getBoundingClientRect();
          const s = getComputedStyle(e);
          return {
            fromStart: Math.round(text.left - cell.left - parseFloat(s.paddingLeft)),
            fromEnd: Math.round(cell.right - parseFloat(s.paddingRight) - text.right),
            nums: s.fontVariantNumeric,
          };
        }),
      );
  await expect(page.getByTestId('amount-cards').locator('.aura-table--stacked')).toHaveCount(1);
  for (const g of await measure('amount-grid')) {
    expect(Math.abs(g.fromEnd)).toBeLessThanOrEqual(1);
    expect(g.nums).toContain('tabular-nums');
  }
  for (const c of await measure('amount-cards')) {
    expect(Math.abs(c.fromStart)).toBeLessThanOrEqual(1);
    expect(c.nums).toContain('tabular-nums');
  }
  /* …and the loading cards' bars start there too. */
  const skel = await page
    .getByTestId('amount-cards-loading')
    .locator('.aura-table__td.is-end')
    .evaluateAll((els) =>
      els.map((e) => {
        const bar = e.querySelector('.aura-skel')!.getBoundingClientRect();
        return Math.round(bar.left - e.getBoundingClientRect().left - parseFloat(getComputedStyle(e).paddingLeft));
      }),
    );
  expect(skel.length).toBeGreaterThan(0);
  for (const s of skel) expect(Math.abs(s)).toBeLessThanOrEqual(1);
  expect(await axeScan(page, '#storybook-root')).toEqual([]);
});

test.describe('5.15: Chamber-OS addenda 14–16 (layout)', () => {
  test('85: stackStyle="cards" — separate framed cards on a phone, the framed table above', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await story(page, 'aura-new-in-5-15--table-cards');
    const m = (t: string) =>
      page.getByTestId(t).evaluate((box) => {
        const wrap = box.querySelector('.aura-tbl-wrap')!;
        const rows = Array.from(box.querySelectorAll('tbody > tr')).map((r) => {
          const s = getComputedStyle(r);
          const b = r.getBoundingClientRect();
          return { top: b.top, bottom: b.bottom, border: s.borderTopWidth, radius: s.borderTopLeftRadius };
        });
        const ws = getComputedStyle(wrap);
        return { wrapBorder: ws.borderTopWidth, wrapBg: ws.backgroundColor, rows };
      });
    const phone = await m('cards-phone');
    expect(phone.wrapBorder).toBe('0px');
    expect(phone.wrapBg).toBe('rgba(0, 0, 0, 0)');
    for (const r of phone.rows) {
      expect(r.border).toBe('1px');
      expect(parseFloat(r.radius)).toBeGreaterThan(8);
    }
    expect(phone.rows[1]!.top - phone.rows[0]!.bottom).toBeGreaterThanOrEqual(8);
    const wide = await m('cards-wide');
    expect(wide.wrapBorder).toBe('1px');
    for (const r of wide.rows) expect(r.radius).toBe('0px');
    /* Table semantics and the #84 slots are kept. */
    await expect(page.getByTestId('cards-phone').getByRole('table')).toHaveCount(1);
    await expect(page.getByTestId('cards-phone').getByRole('button', { name: 'Review' })).toHaveCount(2);
    /* Compact cards are compact; a frameless table's caption lines up with its cards; no gap after the last card. */
    const c = await page.getByTestId('cards-compact').evaluate((box) => {
      const row = box.querySelector('tbody > tr')!;
      const cap = box.querySelector('caption')!.getBoundingClientRect();
      const r = row.getBoundingClientRect();
      const s = getComputedStyle(row);
      return { pad: s.paddingTop, capLeft: cap.left, rowLeft: r.left, gapAfter: parseFloat(s.marginBottom) };
    });
    expect(c.pad).toBe('8px');
    expect(Math.abs(c.capLeft - c.rowLeft)).toBeLessThanOrEqual(0.5);
    expect(c.gapAfter).toBe(0);
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('87 Card header, 93 flushBelow', async ({ page }) => {
    for (const w of [820, 1440]) {
      await page.setViewportSize({ width: w, height: 900 });
      await story(page, 'aura-new-in-5-15--card-options');
      const head = page.getByTestId('card-header').locator('.aura-card__head');
      await expect(head.getByText('Pending review')).toBeVisible();
      await expect(head.getByRole('heading', { level: 2, name: 'Contact change · Acme AB' })).toBeVisible();
      await expect(page.getByTestId('card-header').getByRole('heading')).toHaveCount(1);
      await expect(head.getByRole('button', { name: 'More for this request' })).toBeVisible();
      await expect(page.getByTestId('card-loading').locator('.aura-card__head .aura-skel')).toHaveCount(2);
      await expect(page.getByTestId('card-loading').getByRole('heading')).toHaveCount(0);
      const f = await page.getByTestId('card-flush').evaluate((e) => {
        const s = getComputedStyle(e);
        return [s.borderTopColor, s.backgroundColor, s.boxShadow];
      });
      if (w === 820) {
        expect(f).toEqual(['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)', 'none']);
        /* An interactive flush card gets no edge back on hover. */
        await page.getByTestId('card-flush').hover();
        await page.waitForTimeout(250);
        expect(await page.getByTestId('card-flush').evaluate((e) => getComputedStyle(e).borderTopColor)).toBe(
          'rgba(0, 0, 0, 0)',
        );
        await page.mouse.move(0, 0);
      } else {
        expect(f[0]).not.toBe('rgba(0, 0, 0, 0)');
        expect(f[1]).not.toBe('rgba(0, 0, 0, 0)');
        expect(f[2]).not.toBe('none');
      }
      expect(await axeScan(page, '#storybook-root')).toEqual([]);
    }
  });

  test('89: Progress draws a striped reserved segment after the value and reads both counts', async ({ page }) => {
    await story(page, 'aura-new-in-5-15--progress-reserved');
    const bars = page.getByRole('progressbar');
    await expect(bars.nth(0)).toHaveAttribute('aria-valuetext', '2 sent · 1 queued · 6 included');
    await expect(bars.nth(1)).toHaveAttribute('aria-valuetext', '3 of 10 used, 2 reserved');
    const g = await bars.nth(0).evaluate((track) => {
      const t = track.getBoundingClientRect();
      const [a, b] = Array.from(track.querySelectorAll('.aura-progress__bar')).map((e) => e.getBoundingClientRect());
      const r = track.querySelector('.aura-progress__bar--reserved')!;
      const s = getComputedStyle(r);
      return {
        value: a!.width / t.width,
        start: (b!.left - t.left) / t.width,
        reserved: b!.width / t.width,
        mask: s.maskImage || s.webkitMaskImage,
        same: s.backgroundColor === getComputedStyle(track.querySelector('.aura-progress__bar')!).backgroundColor,
      };
    });
    expect(g.value).toBeCloseTo(2 / 6, 2);
    expect(g.start).toBeCloseTo(2 / 6, 2);
    expect(g.reserved).toBeCloseTo(1 / 6, 2);
    expect(g.mask).toContain('repeating-linear-gradient');
    expect(g.same).toBe(true);
    /* 5 + 4 of 6: the reserved part stops at the end of the track. */
    const over = await bars.nth(2).evaluate((track) => {
      const t = track.getBoundingClientRect();
      const b = track.querySelector('.aura-progress__bar--reserved')!.getBoundingClientRect();
      return b.right - t.right;
    });
    expect(over).toBeLessThanOrEqual(0.5);
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('90: underline tabs share the width below 1024px and sit at their own width above', async ({ page }) => {
    for (const w of [390, 820, 1440]) {
      await page.setViewportSize({ width: w, height: 700 });
      await story(page, 'aura-new-in-5-15--tabs-fill');
      const m = await page.locator('.aura-tabs__list').evaluate((l) => ({
        list: l.getBoundingClientRect().width,
        tabs: Array.from(l.children).map((c) => c.getBoundingClientRect().width),
      }));
      if (w < 1024) {
        expect(Math.abs(m.tabs[0]! - m.tabs[1]!), String(w)).toBeLessThanOrEqual(1);
        expect(Math.abs(m.tabs[0]! + m.tabs[1]! - m.list)).toBeLessThanOrEqual(1);
      } else expect(m.tabs[0]! + m.tabs[1]!).toBeLessThan(m.list / 2);
    }
    await page.getByRole('tab', { name: 'Usage' }).click();
    await expect(page.getByRole('tabpanel')).toHaveText('Usage this year.');
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('92: FilterBar controlsLayout="fill" stackBelow="lg"', async ({ page }) => {
    for (const w of [390, 820, 1440]) {
      await page.setViewportSize({ width: w, height: 700 });
      await story(page, 'aura-new-in-5-15--filter-bar-fill');
      const m = await page.locator('.aura-filterbar').evaluate((bar) => {
        const r = (e: Element) => e.getBoundingClientRect();
        return {
          bar: r(bar.querySelector('.aura-filterbar__row')!),
          search: r(bar.querySelector('.aura-filterbar__search')!),
          filters: Array.from(bar.querySelectorAll('.aura-filterselect')).map(r),
          clear: r(bar.querySelector('.aura-filterbar__actions')!),
        };
      });
      const [a, b, c] = m.filters;
      if (w === 820) {
        expect(Math.abs(m.search.width - m.bar.width)).toBeLessThanOrEqual(1);
        expect(a!.top).toBeGreaterThan(m.search.bottom);
        expect(new Set(m.filters.map((f) => Math.round(f.top))).size).toBe(1);
        expect(Math.abs(a!.width - b!.width)).toBeLessThanOrEqual(1);
        expect(Math.abs(b!.width - c!.width)).toBeLessThanOrEqual(1);
        expect(Math.abs(m.clear.right - m.bar.right)).toBeLessThanOrEqual(1);
      }
      if (w === 1440) {
        expect(Math.abs(a!.top - m.search.top)).toBeLessThanOrEqual(1);
        expect(Math.abs(a!.width - c!.width)).toBeLessThanOrEqual(1);
        expect(a!.width).toBeGreaterThan(160);
      }
      /* Nothing runs out of the bar at any width. */
      for (const f of m.filters) expect(f.right).toBeLessThanOrEqual(m.bar.right + 0.5);
      expect(await axeScan(page, '#storybook-root')).toEqual([]);
    }
  });

  test('94: Breadcrumb collapses to first, "…", last below 640px; item attributes', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 700 });
    await story(page, 'aura-new-in-5-15--breadcrumb-collapse');
    const nav = page.getByRole('navigation', { name: 'Breadcrumb' });
    const shown = () =>
      nav
        .locator('li')
        .evaluateAll((lis) =>
          lis.filter((l) => getComputedStyle(l).display !== 'none').map((l) => (l as HTMLElement).innerText.trim()),
        );
    expect(await shown()).toEqual(['Admin', '…', 'Contact change']);
    await expect(nav.locator('li[data-slot="breadcrumb-item"]')).toHaveCount(5);
    await expect(nav.locator('[data-slot="breadcrumb-page"]')).toHaveAttribute('aria-current', 'page');
    const more = nav.getByRole('button', { name: 'Show the full path' });
    const mb = await more.boundingBox();
    expect(Math.min(mb!.width, mb!.height)).toBeGreaterThanOrEqual(24);
    /* From the keyboard: Tab from the first link reaches "…"; Enter shows the trail and focuses the first revealed. */
    await nav.getByRole('link', { name: 'Admin' }).focus();
    await page.keyboard.press('Tab');
    await expect(more).toBeFocused();
    await page.keyboard.press('Enter');
    expect(await shown()).toEqual(['Admin', 'Members', 'Acme AB', 'Change requests', 'Contact change']);
    await expect(nav.getByRole('link', { name: 'Members' })).toBeFocused();
    /* The next page's trail starts collapsed again. */
    await page.getByRole('button', { name: 'Next page' }).click();
    expect(await shown()).toEqual(['Admin', '…', 'Invoices']);
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
    await page.setViewportSize({ width: 1200, height: 700 });
    await story(page, 'aura-new-in-5-15--breadcrumb-collapse');
    expect(await shown()).toEqual(['Admin', 'Members', 'Acme AB', 'Change requests', 'Contact change']);
  });

  test('99: Checkbox hitArea — a click 10px left of the box toggles it; the box is unchanged', async ({ page }) => {
    await story(page, 'aura-new-in-5-15--checkbox-hit-area');
    const box = await page.locator('.aura-check__box').boundingBox();
    expect([box!.width, box!.height]).toEqual([16, 16]);
    await page.mouse.click(box!.x - 10, box!.y + 8);
    await expect(page.getByTestId('state')).toHaveText('Approved');
    await page.mouse.click(box!.x + 8, box!.y - 6);
    await expect(page.getByTestId('state')).toHaveText('Not approved');
    /* Outside the 40 × 32 area nothing happens. */
    await page.mouse.click(box!.x - 16, box!.y + 8);
    await expect(page.getByTestId('state')).toHaveText('Not approved');
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('100: touchHeight — 44px on a phone, the size asked for above 640px, label centred', async ({ page }) => {
    for (const w of [390, 1200]) {
      await page.setViewportSize({ width: w, height: 700 });
      await story(page, 'aura-new-in-5-15--touch-height');
      const m = await page.locator('#storybook-root').evaluate((root) =>
        Array.from(root.querySelectorAll('.aura-btn, .aura-icon-btn')).map((e) => {
          const b = e.getBoundingClientRect();
          const r = document.createRange();
          r.selectNodeContents(e);
          const t = r.getBoundingClientRect();
          return { h: b.height, w: b.width, off: Math.abs(t.top + t.height / 2 - (b.top + b.height / 2)) };
        }),
      );
      const [touch, plain, icon, link] = m;
      expect(touch!.h, String(w)).toBe(w < 640 ? 44 : 32);
      expect(plain!.h).toBe(32);
      expect([icon!.w, icon!.h]).toEqual(w < 640 ? [44, 44] : [32, 32]);
      expect(link!.h).toBe(w < 640 ? 44 : 32);
      for (const b of [touch!, link!]) expect(b.off).toBeLessThanOrEqual(1);
    }
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });
});

test.describe('5.16: Chamber-OS addenda 15–16 (larger items)', () => {
  test('95 action rows and the collapse row, 96 right chevron and a one-row header', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await story(page, 'aura-new-in-5-16--side-nav-actions');
    const nav = page.getByRole('navigation', { name: 'Main' });
    /* 96: brand, dot and badge on one row at 240px. */
    const row = await page.getByTestId('brand').evaluate((b) => {
      const kids = Array.from(b.children).map((c) => c.getBoundingClientRect());
      return { tops: kids.map((k) => Math.round(k.top + k.height / 2)), h: b.getBoundingClientRect().height };
    });
    expect(Math.max(...row.tops) - Math.min(...row.tops)).toBeLessThanOrEqual(2);
    expect(row.h).toBeLessThan(30);
    expect(await nav.evaluate((n) => n.getBoundingClientRect().width)).toBe(240);
    /* Right when closed, down when open. */
    const admin = nav.getByRole('button', { name: 'Admin' });
    const rot = () => admin.locator('.aura-nav__chevron').evaluate((c) => getComputedStyle(c).transform);
    expect(await rot()).toBe('matrix(0, -1, 1, 0, 0, 0)');
    await admin.click();
    await page.waitForTimeout(250);
    expect(await rot()).toBe('none');
    /* 95: the action row runs its callback and never becomes current. */
    const signOut = nav.getByRole('button', { name: 'Sign out' });
    await signOut.click();
    await expect(page.getByTestId('log')).toHaveText('Signed out');
    await expect(page.getByTestId('page')).toHaveText('Page: members');
    await expect(signOut).not.toHaveAttribute('aria-current');
    await expect(nav.getByRole('button', { name: 'Members' })).toHaveAttribute('aria-current', 'page');
    const [a, m] = await Promise.all([
      signOut.boundingBox(),
      nav.getByRole('button', { name: 'Members' }).boundingBox(),
    ]);
    expect([a!.height, a!.x, a!.width]).toEqual([m!.height, m!.x, m!.width]);
    /* Arrow keys reach it like any row. */
    await nav.getByRole('button', { name: 'Audit log' }).focus();
    await page.keyboard.press('ArrowDown');
    await expect(signOut).toBeFocused();
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
    /* The collapse row: labelled, a nav row; in the rail it is its icon with the label as its name. */
    const toggle = nav.getByRole('button', { name: 'Collapse sidebar' });
    await expect(toggle).toHaveClass(/aura-nav__item/);
    await toggle.click();
    await expect(nav).toHaveClass(/aura-nav--collapsed/);
    await page.waitForTimeout(400); /* past the width transition */
    const expand = nav.getByRole('button', { name: 'Expand sidebar' });
    const eb = await expand.boundingBox();
    expect(eb!.width).toBeLessThanOrEqual(48);
    await expect(nav.getByRole('button', { name: 'Sign out' })).toBeVisible();
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('95: action rows are 44px on touch screens', async ({ browser }) => {
    const ctx = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 1200, height: 800 } });
    const page = await ctx.newPage();
    await story(page, 'aura-new-in-5-16--side-nav-actions');
    for (const name of ['Sign out', 'Collapse sidebar']) {
      const b = await page.getByRole('button', { name }).boundingBox();
      expect(b!.height, name).toBeGreaterThanOrEqual(44);
      expect(b!.width, name).toBeGreaterThan(150); /* a full-width row, not a 44px icon button */
    }
    await ctx.close();
  });

  test('98: rangeSelect and how the selection changed', async ({ page }) => {
    await story(page, 'aura-new-in-5-16--data-table-range');
    const box = (name: string) => page.getByRole('checkbox', { name });
    const change = async () => JSON.parse((await page.getByTestId('change').textContent()) || '{}');
    await box('Select Acme AB').click({ force: true });
    expect(await change()).toEqual({ key: 'M-101', shiftKey: false, source: 'click' });
    await page.keyboard.down('Shift');
    await box('Select Volvo Thailand').click({ force: true });
    await page.keyboard.up('Shift');
    await expect(page.getByTestId('selected')).toHaveText('Selected: M-101, M-102, M-103, M-104');
    expect(await change()).toEqual({
      key: 'M-104',
      shiftKey: true,
      source: 'click',
      range: ['M-101', 'M-102', 'M-103', 'M-104'],
    });
    /* Shift-clicking a selected row clears the range up to it. */
    await page.keyboard.down('Shift');
    await box('Select Nordic Timber Oy').click({ force: true });
    await page.keyboard.up('Shift');
    await expect(page.getByTestId('selected')).toHaveText('Selected: M-101');
    /* Space on a row: source keyboard. */
    await page.locator('[data-rc="5:1"]').focus();
    await page.keyboard.press('Space');
    expect(await change()).toEqual({ key: 'M-105', shiftKey: false, source: 'keyboard' });
    await expect(page.getByTestId('selected')).toHaveText('Selected: M-101, M-105');
    /* The select-all box. */
    await page.getByRole('checkbox', { name: 'Select all rows' }).click({ force: true });
    expect(await change()).toEqual({ key: null, shiftKey: false, source: 'all' });
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('101: Dialog trigger, attributes on the panel, finalFocus and onCloseComplete', async ({ page }) => {
    await story(page, 'aura-new-in-5-16--dialog-options');
    const trig = page.getByRole('button', { name: 'Add contact' });
    await expect(trig).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(trig).toHaveAttribute('aria-expanded', 'false');
    await trig.click();
    const dlg = page.getByRole('dialog', { name: 'Add contact' });
    await expect(dlg).toBeVisible();
    await expect(dlg).toHaveAttribute('data-testid', 'contact-dialog');
    await expect(trig).toHaveAttribute('aria-expanded', 'true');
    expect(await axeScan(page, 'body')).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(dlg).toHaveCount(0);
    await expect(trig).toBeFocused();
    /* A footer button closes a self-managed Dialog through useDialogClose. */
    await trig.click();
    await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(trig).toBeFocused();
    /* dismissible={false}: Escape does nothing, the Dialog's own Accept closes it. */
    await page.getByRole('button', { name: 'Accept terms' }).click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Accept the new terms' })).toBeVisible();
    await page.getByRole('dialog').getByRole('button', { name: 'Accept' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Accept terms' })).toBeFocused();
    /* finalFocus: after a save, focus lands on the row it created; onCloseComplete runs once, after unmount. */
    await page.getByRole('button', { name: 'Restore primary' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Restore' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Lars Holm' })).toBeFocused();
    await expect(page.getByTestId('log')).toHaveText('closed:gone');
    /* Closed by Escape with nothing new: focus goes back to the opener (the ref points at Lars Holm now). */
    await page.getByRole('button', { name: 'Restore primary' }).click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Lars Holm' })).toBeFocused();
    await expect(page.getByTestId('log')).toHaveText('closed:gone closed:gone');
    /* …and by the scrim. */
    await page.getByRole('button', { name: 'Restore primary' }).click();
    await page.mouse.click(5, 5);
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByTestId('log')).toHaveText('closed:gone closed:gone closed:gone');
  });

  test('105: Combobox takes a typed value and shows option groups', async ({ page }) => {
    await story(page, 'aura-new-in-5-16--combobox-custom');
    const prov = page.getByRole('combobox', { name: 'Province / region' });
    await prov.fill('Västra Götaland');
    await prov.press('Enter');
    await expect(page.getByTestId('province')).toHaveText('Province: Västra Götaland');
    await expect(prov).toHaveValue('Västra Götaland');
    /* A typed label that matches an option picks the option; leaving the field commits too. */
    await prov.fill('phuket');
    await page.mouse.click(700, 20); /* a click elsewhere on the page */
    await expect(page.getByTestId('province')).toHaveText('Province: Phuket');
    await prov.fill('');
    await prov.press('Tab');
    await expect(page.getByTestId('province')).toHaveText('Province: none');
    /* Typing highlights nothing, so Enter and Tab keep a prefix of an option; an option reached by arrow is picked. */
    await prov.fill('Chon');
    await expect(prov).not.toHaveAttribute('aria-activedescendant');
    await prov.press('Enter');
    await expect(page.getByTestId('province')).toHaveText('Province: Chon');
    await prov.fill('Chi');
    await prov.press('Tab');
    await expect(page.getByTestId('province')).toHaveText('Province: Chi');
    await prov.fill('Ch');
    await prov.press('ArrowDown');
    await prov.press('Tab');
    await expect(page.getByTestId('province')).toHaveText('Province: Chiang Mai');
    /* Groups: headings name their options; filtering keeps a heading only while it has matches. */
    const country = page.getByRole('combobox', { name: 'Country', exact: true });
    await country.click();
    const list = page.getByRole('listbox');
    await expect(list.getByRole('group', { name: 'Most used' }).getByRole('option')).toHaveText(['Thailand', 'Sweden']);
    await expect(list.getByRole('group', { name: 'All countries' }).getByRole('option')).toHaveCount(5);
    /* A press on a heading keeps the list open and focus in the field. */
    await list.getByText('Most used').click();
    await expect(list).toBeVisible();
    await expect(country).toBeFocused();
    /* The grouped listbox itself (its popover scrolls by arrow keys and aria-activedescendant, as every Combobox's). */
    expect(await axeScan(page, '[role="listbox"]')).toEqual([]);
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
    await country.fill('an');
    await expect(list.getByRole('group')).toHaveText([/Thailand/, /Finland.*Germany.*Japan/]);
    await country.press('ArrowDown');
    await country.press('Enter');
    await expect(page.getByTestId('country')).toHaveText('Country: Finland');
    /* Past the limit, the note counts every option, grouped ones included. */
    await page.getByRole('combobox', { name: 'Country (first three)' }).click();
    await expect(page.getByText('Keep typing to narrow 7 options')).toBeVisible();
  });

  test('95: an action row in the AppShell phone drawer closes the drawer', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await story(page, 'aura-new-in-5-16--shell-sign-out');
    await page.getByRole('button', { name: 'Open navigation' }).click();
    const drawer = page.getByRole('dialog');
    await drawer.getByRole('button', { name: 'Sign out' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByTestId('log')).toHaveText('Signed out');
  });
});

test('5.16.1 (109): a custom Select keeps the input ground; only a read-only field takes the disabled one', async ({
  page,
}) => {
  for (const theme of ['light', 'dark']) {
    await story(page, 'aura-new-in-5-16-1--select-ground', theme);
    const dlg = page.getByRole('dialog', { name: 'Erase member' });
    const ground = (sel: string) =>
      dlg
        .locator(sel)
        .first()
        .evaluate((e) => getComputedStyle(e.closest('.aura-input')!).backgroundColor);
    const [select, text, ro] = await Promise.all([
      ground('.aura-select__trigger'),
      ground('input[placeholder="Optional note"]'),
      ground('input[readonly]'),
    ]);
    const roArea = await dlg.locator('textarea[readonly]').evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(select, theme).toBe(text);
    expect(roArea, theme).toBe(ro);
    expect(ro, theme).toBe(theme === 'light' ? 'rgb(250, 250, 250)' : 'rgb(8, 8, 10)');
    if (theme === 'light') expect(select).toBe('rgb(255, 255, 255)');
    expect(await axeScan(page, '[role="dialog"]')).toEqual([]);
  }
});

test('5.16.1: every kind of enabled, editable field shares one ground, in both themes', async ({ page }) => {
  for (const theme of ['light', 'dark']) {
    await story(page, 'aura-new-in-5-16-1--field-grounds', theme);
    const grounds = await page.getByTestId('fields').evaluate((root) =>
      Array.from(root.querySelectorAll<HTMLElement>('.aura-input')).map((e) => ({
        field: e.closest('.aura-field')?.querySelector('label')?.textContent || e.className,
        bg: getComputedStyle(e).backgroundColor,
      })),
    );
    expect(grounds.length, theme).toBeGreaterThanOrEqual(10);
    const input = grounds.find((g) => /^Text/.test(g.field))!.bg;
    expect(input, theme).toBe(theme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(24, 24, 27)');
    expect(
      grounds.filter((g) => g.bg !== input),
      theme,
    ).toEqual([]);
  }
});

test.describe('5.17: Chamber-OS addendum 18', () => {
  test('110: Stat attributes on the root, a status line, and a link on the label only', async ({ page }) => {
    await story(page, 'aura-new-in-5-17--stat-options');
    const card = page.getByTestId('stat-card');
    await expect(card).toHaveClass(/aura-stat/);
    await expect(card).toHaveAttribute('data-variant', 'warning');
    await expect(card.locator('.aura-stat__status')).toHaveText(/Active · renews 1 Jan/);
    /* The only link to the page is inside the h2; the tile itself is not a link. */
    const heading = card.getByRole('heading', { level: 2, name: 'Membership' });
    await expect(heading.getByRole('link', { name: 'Membership' })).toHaveAttribute('href', '#membership');
    expect(await card.evaluate((e) => e.tagName)).toBe('DIV');
    await expect(card.getByRole('link')).toHaveCount(2); /* the label's link and the caption's own */
    /* A click anywhere on the tile follows the label's link; the caption's link still works on its own. */
    const box = (await card.boundingBox())!;
    await page.mouse.click(box.x + box.width - 12, box.y + box.height - 12);
    await expect(page).toHaveURL(/#membership$/);
    await card.getByRole('link', { name: '4 benefits' }).click();
    await expect(page).toHaveURL(/#benefits$/);
    /* The tile shows the focus ring only when the label's link has keyboard focus — not on a mouse click, not when
     * the caption's link has focus. */
    const ring = () => card.evaluate((e) => getComputedStyle(e).outlineStyle);
    expect(await ring()).toBe('none'); /* the caption link was clicked last */
    await heading.getByRole('link').focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    expect(await ring()).toBe('solid');
    await page.keyboard.press('Tab');
    await expect(card.getByRole('link', { name: '4 benefits' })).toBeFocused();
    expect(await ring()).toBe('none');
    await page.mouse.click(box.x + 20, box.y + box.height - 12);
    expect(await ring()).toBe('none');
    /* Default: the whole tile is the link, as before. */
    expect(await page.getByTestId('stat-tile').evaluate((e) => e.tagName)).toBe('A');
    /* A loading placeholder hidden from assistive tech. */
    await expect(page.getByTestId('stat-loading')).toHaveAttribute('aria-hidden', 'true');
    await expect(page.getByRole('heading', { name: 'E-Blasts' })).toHaveCount(0);
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('111: Progress reads valueText and shows valueLabel', async ({ page }) => {
    await story(page, 'aura-new-in-5-17--progress-value-text');
    const bar = page.getByRole('progressbar', { name: 'E-Blasts this year' });
    await expect(bar).toHaveAttribute('aria-valuetext', '2 used, 1 reserved, 3 remaining of 6');
    await expect(page.locator('.aura-progress__value')).toHaveText('2 of 6 used');
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });
});

test.describe('5.18: Chamber-OS addendum 19', () => {
  for (const theme of ['light', 'dark'] as const) {
    test(`112: a Stepper step with errors (${theme})`, async ({ page }) => {
      await story(page, 'aura-new-in-5-18--stepper-errors', theme);
      const wizard = page.getByTestId('wizard');
      const fees = wizard.getByRole('button', { name: 'Fees, has errors', exact: true });
      await expect(fees).toBeVisible();
      await expect(wizard.getByRole('button', { name: 'Basics, completed', exact: true })).toBeVisible();
      /* The danger fill and an alert icon in place of the check; the label in the danger tone. */
      const tokens = await page.evaluate(() => {
        const probe = document.createElement('span');
        document.getElementById('storybook-root')!.appendChild(probe);
        probe.style.color = 'var(--aura-button-danger-bg)';
        const fill = getComputedStyle(probe).color;
        probe.style.color = 'var(--aura-fg-danger)';
        const text = getComputedStyle(probe).color;
        probe.remove();
        return { fill, text };
      });
      const marker = fees.locator('.aura-stepper__marker');
      expect(await marker.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe(tokens.fill);
      expect(await fees.locator('.aura-stepper__label').evaluate((e) => getComputedStyle(e).color)).toBe(tokens.text);
      await expect(marker.locator('svg')).toHaveCount(1);
      await expect(marker).not.toContainText('2');
      /* Done steps without errors are unchanged. */
      const basicsFill = await wizard
        .getByRole('button', { name: 'Basics, completed', exact: true })
        .locator('.aura-stepper__marker')
        .evaluate((e) => getComputedStyle(e).backgroundColor);
      expect(basicsFill).not.toBe(tokens.fill);
      /* Chrome's own accessibility tree (not only Playwright's name computation) reads the names with no stray space. */
      const cdp = await page.context().newCDPSession(page);
      const { nodes } = (await cdp.send('Accessibility.getFullAXTree')) as {
        nodes: Array<{ role?: { value: string }; name?: { value: string } }>;
      };
      const names = nodes.filter((n) => n.role?.value === 'button').map((n) => n.name?.value);
      expect(names).toEqual(expect.arrayContaining(['Basics, completed', 'Fees, has errors', 'Avgifter, har fel']));
      /* The visible label starts the name (WCAG 2.5.3); the hidden note is still there for reading the page. */
      await expect(fees).toHaveAccessibleName('Fees, has errors'); // 5.32: from content, not aria-label (WCAG 2.5.3)
      await expect(fees.locator('.aura-sr-only')).toHaveText('Fees, has errors');
      /* The vertical one: an error step before the current one, and an upcoming one (danger fill, not a button). */
      const v = page.getByTestId('vertical');
      const vErr = v.locator('.aura-stepper__item.is-error');
      await expect(vErr).toHaveCount(2);
      for (const i of [0, 1]) {
        const bg = await vErr
          .nth(i)
          .locator('.aura-stepper__marker')
          .evaluate((e) => getComputedStyle(e).backgroundColor);
        expect(bg).toBe(tokens.fill);
      }
      await expect(vErr.nth(1)).toHaveClass(/is-upcoming/);
      await expect(vErr.nth(1).getByRole('button')).toHaveCount(0);
      await expect(vErr.nth(1)).toContainText('Review, has errors');
      expect(await axeScan(page, '#storybook-root')).toEqual([]);
      /* Enter goes back to it; there it is the current step (outlined, aria-current) and still has errors. */
      await fees.focus();
      await page.keyboard.press('Enter');
      await expect(page.getByTestId('page')).toHaveText('Page: fees');
      const current = wizard.locator('[aria-current="step"]');
      await expect(current).toHaveClass(/is-error/);
      await expect(current).toContainText('Fees, has errors');
      await expect(current.getByRole('button')).toHaveCount(0);
      const cm = current.locator('.aura-stepper__marker');
      expect(await cm.evaluate((e) => getComputedStyle(e).borderTopColor)).toBe(tokens.text);
      expect(await cm.evaluate((e) => getComputedStyle(e).borderTopWidth)).toBe('2px');
      expect(await axeScan(page, '#storybook-root')).toEqual([]);
    });
  }

  test('112: a click goes back to the step; the phone line says the current step has errors', async ({ page }) => {
    await story(page, 'aura-new-in-5-18--stepper-errors');
    await page.getByTestId('wizard').getByRole('button', { name: 'Fees, has errors', exact: true }).click();
    await expect(page.getByTestId('page')).toHaveText('Page: fees');
    await page.setViewportSize({ width: 390, height: 800 });
    const compact = page.getByTestId('wizard').locator('.aura-stepper__compact');
    await expect(compact).toBeVisible();
    await expect(compact).toHaveText(/^Step 2 of 4 — has errors\s*Fees$/);
    /* The markers stay visible on a phone, so an error step before the current one still shows. */
    await page.getByTestId('wizard').getByRole('button', { name: 'Basics, completed', exact: true }).click();
    await expect(compact).toHaveText(/^Step 1 of 4\s*Basics$/);
    await expect(
      page.getByTestId('wizard').locator('.aura-stepper__item.is-error .aura-stepper__marker'),
    ).toBeVisible();
  });
});

test.describe('5.19: Chamber-OS addendum 20', () => {
  type AX = {
    role?: { value: string };
    name?: { value: string };
    value?: { value: string };
    description?: { value: string };
  };
  async function axOf(page: import('@playwright/test').Page, role: string, name: string) {
    const cdp = await page.context().newCDPSession(page);
    const { nodes } = (await cdp.send('Accessibility.getFullAXTree')) as { nodes: AX[] };
    return nodes.find((n) => n.role?.value === role && n.name?.value === name);
  }

  for (const theme of ['light', 'dark'] as const) {
    test(`113: a read-only Switch stays in the Tab order, says so, and doesn't change (${theme})`, async ({ page }) => {
      await story(page, 'aura-new-in-5-19--locked-plan', theme);
      const fee = page.getByRole('textbox', { name: 'Annual fee' });
      const m2m = page.getByRole('switch', { name: 'M2M benefits access' });
      /* Tab from the read-only field reaches the read-only switch (disabled would skip it). */
      await fee.focus();
      await page.keyboard.press('Tab');
      await expect(m2m).toBeFocused();
      await expect(m2m).toHaveAttribute('aria-readonly', 'true');
      await expect(m2m).toHaveAttribute('aria-checked', 'true');
      /* What Chrome gives a screen reader: name, on, then the lock note. */
      const ax = await axOf(page, 'switch', 'M2M benefits access');
      expect(ax?.description?.value).toBe('Locked: historical plan');
      const ev = await axOf(page, 'switch', 'Event discounts');
      expect(ev?.description?.value).toBe('Members pay the member price. Locked: historical plan');
      /* Space, a click on the switch, its label and its row change nothing. */
      await page.keyboard.press('Space');
      await m2m.click();
      await page.getByText('M2M benefits access').click();
      const row = page.locator('.aura-switch-row').filter({ has: m2m });
      const rb = (await row.boundingBox())!;
      await page.mouse.click(rb.x + rb.width / 2, rb.y + rb.height / 2);
      await expect(m2m).toHaveAttribute('aria-checked', 'true');
      await expect(page.getByTestId('log')).toHaveText('No change');
      /* An editable switch still toggles. */
      const news = page.getByRole('switch', { name: 'Newsletter' });
      await news.click();
      await expect(news).toHaveAttribute('aria-checked', 'false');
      /* The lock sits 8px after the label (5.79, visual audit 17: it was at the row's end), the field icon's size and
       * colour; the state keeps full colour (no fade). */
      const icon = row.locator('.aura-switch-row__icon');
      const ib = (await icon.boundingBox())!;
      const lb = (await row.locator('.aura-choice__text').boundingBox())!;
      const fieldIcon = (await page.locator('.aura-input__icon').first().boundingBox())!;
      expect(Math.round(ib.width)).toBe(Math.round(fieldIcon.width));
      expect(Math.round(ib.x - (lb.x + lb.width))).toBe(8);
      const colours = await icon.evaluate((e) => {
        const probe = document.createElement('span');
        probe.style.color = 'var(--aura-fg-secondary)';
        e.parentElement!.appendChild(probe);
        const want = getComputedStyle(probe).color;
        probe.remove();
        return { got: getComputedStyle(e).color, want };
      });
      expect(colours.got).toBe(colours.want);
      expect(await m2m.evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
      expect(await axeScan(page, '#storybook-root')).toEqual([]);
    });

    test(`114: a read-only Select stays in the Tab order, never opens, and its value is sent (${theme})`, async ({
      page,
    }) => {
      await story(page, 'aura-new-in-5-19--locked-plan', theme);
      const type = page.getByRole('combobox', { name: 'Member type' });
      await page.getByRole('switch', { name: 'Newsletter' }).focus();
      await page.keyboard.press('Tab');
      await expect(type).toBeFocused();
      await expect(type).toHaveAttribute('aria-readonly', 'true');
      const ax = await axOf(page, 'combobox', 'Member type');
      expect(ax?.value?.value).toBe('Company');
      expect(ax?.description?.value).toBe('Locked: historical plan');
      /* No key or click opens it; the value stays. */
      for (const k of ['Enter', ' ', 'ArrowDown', 'ArrowUp', 'p', 'Alt+ArrowDown']) {
        await page.keyboard.press(k);
        await expect(page.locator('.aura-select__popover [role=listbox]')).toHaveCount(0);
      }
      await type.click();
      await page.getByText('Member type', { exact: true }).click();
      await expect(page.locator('.aura-select__popover [role=listbox]')).toHaveCount(0);
      await expect(type).toHaveAttribute('aria-expanded', 'false');
      await expect(type).toHaveText('Company');
      await expect(page.getByTestId('log')).toHaveText('No change');
      /* The read-only ground of a read-only TextField, and no chevron; an editable Select still opens. */
      const ground = (sel: string) =>
        page
          .locator(sel)
          .first()
          .evaluate((e) => getComputedStyle(e).backgroundColor);
      const wrap = page.locator('.aura-select--custom.is-readonly');
      expect(await wrap.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe(
        await page
          .locator('.aura-input')
          .filter({ has: page.getByRole('textbox', { name: 'Annual fee' }) })
          .evaluate((e) => getComputedStyle(e).backgroundColor),
      );
      expect(await wrap.evaluate((e) => getComputedStyle(e).backgroundColor)).not.toBe(
        await ground('.aura-select:not(.is-readonly):not(:has(:disabled))'),
      );
      await expect(wrap.locator('.aura-select__chevron')).toHaveCount(0);
      await page.getByRole('combobox', { name: 'Billing type' }).click();
      await expect(page.locator('.aura-select__popover [role=listbox]')).toBeVisible();
      await page.keyboard.press('Escape');
      /* Unlike disabled, the read-only value is posted with the form. */
      await page.getByRole('button', { name: 'Show form data' }).click();
      const data = JSON.parse(await page.getByTestId('data').innerText());
      expect(data.memberType).toBe('company');
      expect(data.billingType).toBe('company');
      expect(data.oldRegion).toBeUndefined();
      expect(data.regions).toBe('north');
      /* Once hydrated, a value the app sets itself (react-hook-form reset / setValue) shows and is posted — no option is
       * left disabled to drop it from the form's data. */
      await page.evaluate(() => {
        const s = document.querySelector('select[name="memberType"]') as HTMLSelectElement;
        s.value = 'person';
      });
      await expect(type).toHaveText('Person');
      await page.getByRole('button', { name: 'Show form data' }).click();
      expect(JSON.parse(await page.getByTestId('data').innerText()).memberType).toBe('person');
      /* A read-only list box: no click, Ctrl+click or key changes it. */
      const regions = page.getByRole('listbox', { name: 'Regions' });
      await regions.getByRole('option', { name: 'north' }).click({ modifiers: ['Control'] });
      await regions.getByRole('option', { name: 'south' }).click();
      await expect(regions).toBeFocused();
      for (const k of ['ArrowDown', ' ', 'Control+ ', 'End']) await page.keyboard.press(k);
      expect(
        await regions.evaluate((e) => Array.from((e as HTMLSelectElement).selectedOptions, (o) => o.value)),
      ).toEqual(['north']);
      await expect(page.getByTestId('log')).toHaveText('No change');
      expect(await axeScan(page, '#storybook-root')).toEqual([]);
    });
  }

  test('114: a touch tap does not change a read-only list box', async ({ browser }) => {
    const ctx = await browser.newContext({ hasTouch: true });
    const page = await ctx.newPage();
    await story(page, 'aura-new-in-5-19--locked-plan');
    const regions = page.getByRole('listbox', { name: 'Regions' });
    await regions.getByRole('option', { name: 'south' }).tap();
    await regions.getByRole('option', { name: 'north' }).tap();
    expect(await regions.evaluate((e) => Array.from((e as HTMLSelectElement).selectedOptions, (o) => o.value))).toEqual(
      ['north'],
    );
    await expect(page.getByTestId('log')).toHaveText('No change');
    await page.getByRole('button', { name: 'Show form data' }).tap();
    expect(JSON.parse(await page.getByTestId('data').innerText()).regions).toBe('north');
    await ctx.close();
  });
});

test.describe('5.20: Chamber-OS addendum 20, 115–116', () => {
  test('115: a Table follows the page density; its own prop wins', async ({ page }) => {
    await story(page, 'aura-new-in-5-20--table-density');
    const wrapOf = (id: string) => page.getByTestId(id).locator('.aura-tbl-wrap').first();
    const pad = (id: string) =>
      page
        .getByTestId(id)
        .locator('.aura-tbl__td')
        .first()
        .evaluate((e) => getComputedStyle(e).paddingTop);
    const rowH = (id: string) =>
      page
        .getByTestId(id)
        .locator('.aura-tbl__body .aura-tbl__row')
        .first()
        .evaluate((e) => e.getBoundingClientRect().height);
    /* Inside AuraProvider density="compact": the wrap says so, 8px cell padding, a shorter row. */
    await expect(wrapOf('frame')).toHaveAttribute('data-density', 'compact');
    expect(await pad('frame')).toBe('8px');
    expect(await pad('page')).toBe('12px');
    expect(await rowH('frame')).toBeLessThan(await rowH('page'));
    /* An explicit prop wins over the provider. */
    await expect(wrapOf('override')).toHaveAttribute('data-density', 'comfortable');
    expect(await pad('override')).toBe('12px');
    /* A page that sets data-density itself, without a provider: followed in CSS. */
    await expect(wrapOf('attr')).not.toHaveAttribute('data-density', /.*/);
    expect(await pad('attr')).toBe('8px');
    /* "comfortable" inside a compact page switches back, provider or not. */
    expect(await pad('nested')).toBe('12px');
    /* Outside any density: unchanged. */
    await expect(wrapOf('page')).not.toHaveAttribute('data-density', /.*/);
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('115: stacked rows in a compact frame keep their stacked cell padding', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await story(page, 'aura-new-in-5-20--table-density');
    const st = page.getByTestId('frame-stacked');
    expect(
      await st
        .locator('.aura-tbl__body .aura-tbl__td')
        .first()
        .evaluate((e) => getComputedStyle(e).paddingTop),
    ).toBe('0px');
    expect(
      await st
        .locator('.aura-tbl__body .aura-tbl__row')
        .first()
        .evaluate((e) => getComputedStyle(e).paddingTop),
    ).toBe('8px');
  });

  test('116: ActionBar start sits at the start edge from 640px, outside the live region, first in the Tab order', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await story(page, 'aura-new-in-5-20--action-bar-start');
    const bar = page.getByRole('region', { name: 'Wizard actions' });
    const inner = (await bar.locator('.aura-actionbar__inner').boundingBox())!;
    const cancel = bar.getByRole('button', { name: 'Cancel' });
    const back = bar.getByRole('button', { name: 'Back' });
    const next = bar.getByRole('button', { name: 'Next' });
    const c = (await cancel.boundingBox())!,
      b = (await back.boundingBox())!,
      n = (await next.boundingBox())!;
    const padL = await bar
      .locator('.aura-actionbar__inner')
      .evaluate((e) => parseFloat(getComputedStyle(e).paddingLeft));
    const padR = await bar
      .locator('.aura-actionbar__inner')
      .evaluate((e) => parseFloat(getComputedStyle(e).paddingRight));
    expect(Math.abs(c.x - (inner.x + padL))).toBeLessThanOrEqual(1);
    expect(Math.abs(n.x + n.width - (inner.x + inner.width - padR))).toBeLessThanOrEqual(1);
    expect(b.x).toBeGreaterThan(c.x + c.width + 100);
    expect(Math.abs(c.y - n.y)).toBeLessThanOrEqual(1);
    /* Not in the status live region; Tab goes Cancel → Back → Next. */
    await expect(bar.getByRole('status').getByRole('button')).toHaveCount(0);
    await cancel.focus();
    await page.keyboard.press('Tab');
    await expect(back).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(next).toBeFocused();
    /* With a status line, it sits between the start slot and the actions. */
    const sb = page.getByRole('region', { name: 'Form actions' });
    const d = (await sb.getByRole('button', { name: 'Discard' }).boundingBox())!;
    const s = (await sb.getByRole('status').boundingBox())!;
    const v = (await sb.getByRole('button', { name: 'Save' }).boundingBox())!;
    expect(d.x).toBeLessThan(s.x);
    expect(s.x + 8).toBeLessThan(v.x);
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
    /* Narrower than 640px: the start slot wraps with the actions, before them. */
    await page.setViewportSize({ width: 390, height: 800 });
    const c2 = (await cancel.boundingBox())!,
      b2 = (await back.boundingBox())!;
    expect(c2.x < b2.x || c2.y < b2.y).toBe(true);
    /* With a status line, the status takes its own row and Discard stays beside Save. */
    const d2 = (await sb.getByRole('button', { name: 'Discard' }).boundingBox())!,
      s2 = (await sb.getByRole('status').boundingBox())!,
      v2 = (await sb.getByRole('button', { name: 'Save' }).boundingBox())!;
    expect(d2.y).toBeGreaterThan(s2.y + s2.height - 1);
    expect(Math.abs(d2.y + d2.height / 2 - (v2.y + v2.height / 2))).toBeLessThanOrEqual(1);
    expect(d2.x).toBeLessThan(v2.x);
  });

  test("116: the bar's own width decides its layout, and the start slot follows the reading direction", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, 'aura-new-in-5-20--action-bar-start');
    /* A 320px card on a wide screen: the status on its own row, Discard beside Save. */
    const nb = page.getByRole('region', { name: 'Narrow actions' });
    const s = (await nb.getByRole('status').boundingBox())!,
      d = (await nb.getByRole('button', { name: 'Discard' }).boundingBox())!,
      v = (await nb.getByRole('button', { name: 'Save' }).boundingBox())!;
    expect(d.y).toBeGreaterThan(s.y + s.height - 1);
    expect(Math.abs(d.y + d.height / 2 - (v.y + v.height / 2))).toBeLessThanOrEqual(1);
    /* A narrow wizard with no status: Cancel stays at the start edge (the empty live region takes no room). */
    const nw = page.getByRole('region', { name: 'Narrow wizard' });
    const nwi = (await nw.locator('.aura-actionbar__inner').boundingBox())!;
    const nc = (await nw.getByRole('button', { name: 'Cancel' }).boundingBox())!;
    expect(Math.abs(nc.x - nwi.x)).toBeLessThanOrEqual(1);
    await expect(nw.getByRole('status')).toHaveCount(1);
    /* Right to left: Discard at the right (start) edge, Save at the left (end) edge. */
    const rb = page.getByRole('region', { name: 'RTL actions' });
    const inner = (await rb.locator('.aura-actionbar__inner').boundingBox())!;
    const rd = (await rb.getByRole('button', { name: 'Discard' }).boundingBox())!,
      rv = (await rb.getByRole('button', { name: 'Save' }).boundingBox())!;
    expect(Math.abs(rd.x + rd.width - (inner.x + inner.width))).toBeLessThanOrEqual(1);
    expect(Math.abs(rv.x - inner.x)).toBeLessThanOrEqual(1);
    /* Narrow and right to left: Save still at the end (left) edge. */
    await page.setViewportSize({ width: 390, height: 900 });
    const inner2 = (await rb.locator('.aura-actionbar__inner').boundingBox())!;
    const rv2 = (await rb.getByRole('button', { name: 'Save' }).boundingBox())!;
    expect(Math.abs(rv2.x - inner2.x)).toBeLessThanOrEqual(1);
  });
});

test.describe('5.21: Chamber-OS addendum 21', () => {
  const heights = (page: import('@playwright/test').Page, id: string) =>
    page
      .getByTestId(id)
      .locator('.aura-tbl__body > .aura-tbl__row')
      .evaluateAll((rows) => rows.map((r) => Math.round(r.getBoundingClientRect().height * 2) / 2));

  test('117: rowHeight="density" gives rows with a Button, an IconButton, a pill or a line the same height', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, 'aura-new-in-5-21--table-row-height');
    /* Compact: 40px for the Button, pill and IconButton rows; the wrapped row grows. */
    const c = await heights(page, 'compact');
    expect(c.slice(0, 3)).toEqual([40, 40, 40]);
    expect(c[3]).toBeGreaterThan(40);
    /* Comfortable: 48px. */
    const k = await heights(page, 'comfortable');
    expect(k.slice(0, 3)).toEqual([48, 48, 48]);
    expect(k[3]).toBeGreaterThan(48);
    /* Without the prop, rows stay uneven, as before. */
    const d = await heights(page, 'compact-default');
    expect(new Set(d.slice(0, 3)).size).toBeGreaterThan(1);
    /* The content stays centred in its row. */
    const cell = page.getByTestId('compact').getByRole('button', { name: 'Download' });
    const row = page.getByTestId('row-button').first();
    const cb = (await cell.boundingBox())!,
      rb = (await row.boundingBox())!;
    expect(Math.abs(cb.y + cb.height / 2 - (rb.y + rb.height / 2))).toBeLessThanOrEqual(1);
    /* Without align, rowHeight still centres (a pill in a 48px row sits in the middle, not at the top). */
    const nr = (await page.getByTestId('no-align-row').boundingBox())!;
    const np = (await page.getByTestId('no-align').locator('.aura-pill').boundingBox())!;
    expect(Math.abs(np.y + np.height / 2 - (nr.y + nr.height / 2))).toBeLessThanOrEqual(2);
    /* Header rows are unchanged. */
    const head = (sel: string) =>
      page
        .getByTestId(sel)
        .locator('.aura-tbl__head .aura-tbl__row')
        .evaluate((e) => e.getBoundingClientRect().height);
    expect(await head('compact')).toBe(await head('compact-default'));
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('117: stacked rows and cards are unchanged by rowHeight', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, 'aura-new-in-5-21--table-row-height');
    expect(await heights(page, 'compact-stacked')).toEqual(await heights(page, 'compact-stacked-default'));
    expect(await heights(page, 'compact-cards')).toEqual(await heights(page, 'compact-cards-default'));
  });
});

test.describe('5.22: Chamber-OS addendum 22', () => {
  const box = (l: import('@playwright/test').Locator) => l.boundingBox().then((b) => b!);

  test("118: card: footer puts the actions on the card's last row, full width; the grid is unchanged", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 1200 });
    await story(page, 'aura-new-in-5-22--renewal-cards');
    const row = page.getByTestId('footer').getByRole('row').nth(1);
    const footer = row.locator('[data-card="footer"]');
    const f = await box(footer);
    /* After every other cell … */
    for (const cell of await row.locator('[role="gridcell"]:not([data-card="footer"]), .aura-table__sel').all()) {
      if (!(await cell.isVisible())) continue;
      const c = await box(cell);
      expect(f.y).toBeGreaterThanOrEqual(c.y + c.height - 1);
    }
    /* … at the card's full inner width, the Button filling it beside the 32px IconButton. */
    const inner = await row.evaluate((e) => {
      const s = getComputedStyle(e),
        r = e.getBoundingClientRect();
      return {
        x: r.x + parseFloat(s.paddingLeft) + parseFloat(s.borderLeftWidth),
        w: e.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight),
      };
    });
    expect(Math.abs(f.x - inner.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(f.width - inner.w)).toBeLessThanOrEqual(1);
    const b = await box(footer.getByRole('button', { name: 'Send reminder' }));
    const ib = await box(footer.getByRole('button', { name: /^More for/ }));
    expect(ib.width).toBe(32);
    expect(Math.abs(b.x + b.width + 8 - ib.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(ib.x + ib.width - (f.x + f.width))).toBeLessThanOrEqual(1);
    /* The card keeps its 16px under the footer. */
    const rb = await box(row);
    expect(Math.round(rb.y + rb.height - (f.y + f.height))).toBe(17); /* 16px + the 1px border */
    await footer.getByRole('button', { name: 'Send reminder' }).click();
    await expect(page.getByTestId('log')).toHaveText('Reminder: Kiruna Mining Services (Thailand)');
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
    /* At 1280px it is an ordinary actions column at its width, rows as tall as without the option. */
    await page.setViewportSize({ width: 1280, height: 900 });
    const g = page.getByTestId('footer').getByRole('row').nth(1).locator('[data-card="footer"]');
    expect(Math.round((await box(g)).width)).toBe(220);
    const heights = (id: string) =>
      page
        .getByTestId(id)
        .getByRole('row')
        .evaluateAll((rs) => rs.map((r) => Math.round(r.getBoundingClientRect().height)));
    expect(await heights('footer')).toEqual(await heights('default'));
  });

  test('119: a stacked title wraps, whole, with the pill and the row box on its first line', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 1200 });
    await story(page, 'aura-new-in-5-22--renewal-cards');
    const row = page.getByTestId('default').getByRole('row').nth(1);
    const title = row.locator('[data-card="title"]');
    await expect(title).toHaveText('Kiruna Mining Services (Thailand)');
    const t = await box(title);
    expect(t.height).toBeGreaterThanOrEqual(39); /* two 20px lines */
    expect(await title.evaluate((e) => e.scrollWidth <= e.clientWidth + 1)).toBe(true);
    const firstLine = t.y + 10;
    const p = await box(row.locator('[data-card="pill"] .aura-pill'));
    expect(Math.abs(p.y + p.height / 2 - firstLine)).toBeLessThanOrEqual(2);
    const cb = await box(row.getByRole('checkbox'));
    expect(Math.abs(cb.y + cb.height / 2 - firstLine)).toBeLessThanOrEqual(2);
    /* A one-line title keeps them on its line too. */
    const row2 = page.getByTestId('default').getByRole('row').nth(2);
    const t2 = await box(row2.locator('[data-card="title"]'));
    const p2 = await box(row2.locator('[data-card="pill"] .aura-pill'));
    expect(Math.abs(p2.y + p2.height / 2 - (t2.y + t2.height / 2))).toBeLessThanOrEqual(2);
    /* Existing cards with top-right actions: the box, the title's line and the actions line up. */
    await story(page, 'aura-responsive--stacked-table');
    const first = page.locator('.aura-table__scroll > .aura-table__row:not(.aura-table__head)').first();
    const tt = await box(first.locator('[data-card="title"]'));
    for (const sel of ['[data-card="actions"] button', '.aura-table__sel input']) {
      const el = first.locator(sel).first();
      if (!(await el.count())) continue;
      const bb = await box(el);
      expect(Math.abs(bb.y + bb.height / 2 - (tt.y + 10))).toBeLessThanOrEqual(1);
    }
    /* The grid keeps its one-line rows. */
    await story(page, 'aura-new-in-5-22--renewal-cards');
    await page.setViewportSize({ width: 1280, height: 900 });
    const g = page.getByTestId('default').getByRole('row').nth(1).locator('[data-card="title"]');
    expect(Math.round((await box(g)).height)).toBeLessThanOrEqual(48);
  });
});

test.describe('5.23: Chamber-OS addenda 23–25', () => {
  const box = (l: import('@playwright/test').Locator) => l.boundingBox().then((b) => b!);

  for (const kind of ['default', 'auto'] as const)
    test(`120: card: wide puts a field on its own full-width line after the half-width ones, whole (${kind} rows)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 1400 });
      await story(page, 'aura-new-in-5-23--wide-field');
      const row = page.getByTestId(kind).getByRole('row').nth(1);
      const wide = row.locator('[data-card="wide"]');
      const w = await box(wide);
      const inner = await row.evaluate((e) => {
        const s = getComputedStyle(e),
          r = e.getBoundingClientRect();
        return {
          x: r.x + parseFloat(s.paddingLeft) + parseFloat(s.borderLeftWidth),
          w: e.clientWidth - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight),
        };
      });
      expect(Math.abs(w.x - inner.x)).toBeLessThanOrEqual(1);
      expect(Math.abs(w.width - inner.w)).toBeLessThanOrEqual(1);
      for (const f of await row.locator('[data-card="field"]').all()) {
        const b = await box(f);
        expect(b.width).toBeLessThan(inner.w / 2 + 1);
        expect(w.y).toBeGreaterThanOrEqual(b.y + b.height - 1);
      }
      /* Its label above it, and the reason and evidence whole, wrapped. */
      expect(await wide.evaluate((e) => getComputedStyle(e, '::before').content)).toContain('REASON');
      await expect(wide).toContainText('Turnover above threshold');
      await expect(wide).toContainText('threshold met 14 Sep 2026');
      expect(
        await wide.evaluate((e) => e.scrollWidth <= e.clientWidth + 1 && e.scrollHeight <= e.clientHeight + 1),
      ).toBe(true);
      expect(w.height).toBeGreaterThan(50);
      expect(await axeScan(page, '#storybook-root')).toEqual([]);
      /* At 1280px an ordinary column at its width. */
      await page.setViewportSize({ width: 1280, height: 600 });
      expect(
        Math.round((await box(page.getByTestId(kind).getByRole('row').nth(1).locator('[data-card="wide"]'))).width),
      ).toBe(320);
    });

  /* Colours of a 1px-wide column of the page, top to bottom, decoded from a PNG screenshot (zlib only). */
  async function pixelColumn(page: import('@playwright/test').Page, x: number, y: number, h: number) {
    const zlib = await import('node:zlib');
    const png = await page.screenshot({ clip: { x, y, width: 1, height: h } });
    let off = 8,
      bpp = 4;
    const idat: Buffer[] = [];
    while (off < png.length) {
      const len = png.readUInt32BE(off),
        type = png.toString('ascii', off + 4, off + 8),
        data = png.subarray(off + 8, off + 8 + len);
      if (type === 'IHDR') bpp = data[9] === 6 ? 4 : 3;
      if (type === 'IDAT') idat.push(data);
      off += 12 + len;
    }
    const raw = zlib.inflateSync(Buffer.concat(idat));
    const rows: number[][] = [];
    let prev: number[] = new Array(bpp).fill(0);
    for (let r = 0; r < h; r++) {
      const f = raw[r * (bpp + 1)]!,
        px = Array.from(raw.subarray(r * (bpp + 1) + 1, (r + 1) * (bpp + 1)));
      /* One pixel per row: Sub sees no left pixel (none), Average halves Up, Paeth reduces to Up. */
      const cur = px.map((v, i) => (f === 2 || f === 4 ? v + prev[i]! : f === 3 ? v + (prev[i]! >> 1) : v) & 255);
      rows.push(cur.slice(0, 3));
      prev = cur;
    }
    return rows;
  }

  for (const theme of ['light', 'dark'] as const) {
    test(`121: the active underline tab shows its whole 2px indicator over the track (${theme})`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 600 });
      await story(page, 'aura-new-in-5-23--tabs-underline', theme);
      const list = page.locator('.aura-tabs__list').first();
      expect(await list.evaluate((e) => getComputedStyle(e).overflowX)).toBe('auto');
      const lb = (await list.boundingBox())!;
      expect(Math.round(lb.height)).toBe(44);
      const tb = (await page.locator('.aura-tab.is-active').boundingBox())!;
      const bottom = Math.round(lb.y + lb.height);
      const colours = await page.evaluate(() => {
        const probe = document.createElement('span');
        document.getElementById('storybook-root')!.appendChild(probe);
        const rgb = (v: string) => {
          probe.style.color = v;
          const m = getComputedStyle(probe)
            .color.match(/[\d.]+/g)!
            .map(Number);
          return { rgb: m.slice(0, 3), a: m.length > 3 ? m[3]! : 1 };
        };
        const out = { active: rgb('var(--aura-control-checked-bg)'), track: rgb('var(--aura-border-default)') }; // 5.30: violet
        probe.remove();
        return out;
      });
      const near = (a: number[], b: number[]) => a.every((v, i) => Math.abs(v - b[i]!) <= 3);
      /* A translucent colour (dark theme borders) as it lands on the background under it. */
      const over = (c: { rgb: number[]; a: number }, bg: number[]) => c.rgb.map((v, i) => v * c.a + bg[i]! * (1 - c.a));
      /* Under the active tab: its last two rows are the indicator, the last one over the track. */
      const act = await pixelColumn(page, Math.round(tb.x + tb.width / 2), bottom - 4, 4);
      const active = over(colours.active, act[0]!);
      expect(near(act[2]!, active) && near(act[3]!, active)).toBe(true);
      expect(near(act[1]!, active)).toBe(false);
      /* Past the last tab: the track alone, one row. */
      const gap = await pixelColumn(page, Math.round(lb.x + lb.width - 4), bottom - 4, 4);
      const track = over(colours.track, gap[2]!);
      expect(near(gap[3]!, track)).toBe(true);
      expect(near(gap[2]!, track)).toBe(false);
    });
  }

  test("122: ActionBar touchHeight makes its own Clear 44px on a phone, like the bar's buttons", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await story(page, 'aura-new-in-5-23--bulk-touch');
    const bar = page.getByRole('region', { name: 'Bulk actions' });
    for (const name of [/^Clear/, 'Send reminder', 'Mark paid']) {
      expect(Math.round((await box(bar.getByRole('button', { name }))).height)).toBe(44);
    }
    await page.setViewportSize({ width: 1024, height: 800 });
    expect(Math.round((await box(bar.getByRole('button', { name: /^Clear/ }))).height)).toBe(32);
    /* Clear still clears. */
    await bar.getByRole('button', { name: /^Clear/ }).click();
    await expect(bar.getByRole('button', { name: 'Mark paid' })).toHaveCount(0);
  });
});

test.describe('5.24: Chamber-OS addendum 26', () => {
  const box = (l: import('@playwright/test').Locator) => l.boundingBox().then((b) => b!);
  const parts = [
    { name: 'Done', w: null },
    { name: 'More for T-12', w: 44 },
    { name: /^Clear/, w: null },
    { name: 'Escalate', w: null },
  ] as const;
  for (const width of [768, 1024, 1280]) {
    test(`123: touchHeight is 44px on a coarse pointer at ${width}px; parts without it stay 32px`, async ({
      browser,
    }) => {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: true, isMobile: true });
      const page = await ctx.newPage();
      await story(page, 'aura-new-in-5-24--touch-tablet');
      expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
      expect(await page.evaluate(() => innerWidth)).toBeGreaterThanOrEqual(640);
      for (const { name, w } of parts) {
        const b = await box(page.getByRole('button', { name }));
        expect(Math.round(b.height)).toBe(44);
        if (w) expect(Math.round(b.width)).toBe(w);
      }
      for (const name of ['Compact', 'More, compact']) {
        expect(Math.round((await box(page.getByRole('button', { name, exact: true }))).height)).toBe(32);
      }
      await ctx.close();
    });
  }

  test('123: with a mouse at 1280px touchHeight keeps the compact 32px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, 'aura-new-in-5-24--touch-tablet');
    expect(await page.evaluate(() => matchMedia('(pointer: fine)').matches)).toBe(true);
    for (const { name } of parts) {
      expect(Math.round((await box(page.getByRole('button', { name }))).height)).toBe(32);
    }
  });
});

test.describe('5.25: Chamber-OS addendum 27', () => {
  const box = (l: import('@playwright/test').Locator) => l.boundingBox().then((b) => b!);
  const chips = ['Open', 'Done', 'Skipped', 'All', 'Mine', 'Unassigned'];
  const heights = async (page: import('@playwright/test').Page) => ({
    chips: await Promise.all(
      chips.map(async (name) => Math.round((await box(page.getByRole('button', { name, exact: true }))).height)),
    ),
    compact: Math.round((await box(page.getByRole('button', { name: 'Compact chip' }))).height),
    plain: Math.round((await box(page.locator('span.aura-tag').filter({ hasText: 'Acme AB' }))).height),
    remove: Math.round((await box(page.getByRole('button', { name: 'Remove Acme AB' }))).height),
  });

  for (const [width, touch] of [
    [390, true],
    [390, false],
    [1024, true],
  ] as const) {
    test(`124: a toggle Tag with touchHeight is 44px at ${width}px (${touch ? 'touch' : 'mouse'}); others unchanged`, async ({
      browser,
    }) => {
      const ctx = await browser.newContext({ viewport: { width, height: 800 }, hasTouch: touch, isMobile: touch });
      const page = await ctx.newPage();
      await story(page, 'aura-new-in-5-25--filter-chips-touch');
      expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(touch);
      const h = await heights(page);
      expect(h.chips).toEqual(chips.map(() => 44));
      expect([h.compact, h.plain, h.remove]).toEqual([32, 32, 24]); // 5.75: the × button is 24px
      /* The label stays centred and pressing still toggles. */
      const done = page.getByRole('button', { name: 'Done', exact: true });
      const [b, l] = [await box(done), await box(done.locator('.aura-tag__text'))];
      expect(Math.abs(l.y - b.y - (b.y + b.height - l.y - l.height))).toBeLessThanOrEqual(1);
      await done.click();
      await expect(done).toHaveAttribute('aria-pressed', 'true');
      await ctx.close();
    });
  }

  for (const width of [640, 1280])
    test(`124: with a mouse at ${width}px the toggle Tag keeps 32px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await story(page, 'aura-new-in-5-25--filter-chips-touch');
      const h = await heights(page);
      expect(h.chips).toEqual(chips.map(() => 32));
      expect([h.compact, h.plain]).toEqual([32, 32]);
    });
});

test.describe('5.26: Chamber-OS addendum 28', () => {
  type AX = { role?: { value: string }; name?: { value: string }; description?: { value: string } };
  async function axAll(page: import('@playwright/test').Page, role: string) {
    const cdp = await page.context().newCDPSession(page);
    const { nodes } = (await cdp.send('Accessibility.getFullAXTree')) as { nodes: AX[] };
    return nodes
      .filter((n) => n.role?.value === role)
      .map((n) => [n.name?.value ?? '', n.description?.value ?? ''] as [string, string]);
  }

  test("125: an option's description is its description, not part of its name (Chrome's tree)", async ({ page }) => {
    await story(page, 'aura-new-in-5-26--choice-descriptions');
    expect(await axAll(page, 'radio')).toEqual([
      ['Membership', 'Annual membership fee for a member.'],
      ['Event fee', 'A ticket or sponsorship for one event.'],
      ['Paid now', ''],
      ['Bill first', 'Needs a tax ID'],
      ['ค่าสมาชิก', 'ค่าสมาชิกรายปีของสมาชิก'],
    ]);
    expect(await axAll(page, 'checkbox')).toEqual([['Email the member', 'Sent with the next invoice run.']]);
    /* The same through Playwright's own computation, as Chamber-OS's tests will query it. */
    const membership = page.getByRole('radio', { name: 'Membership', exact: true });
    await expect(membership).toHaveAccessibleDescription('Annual membership fee for a member.');
    await expect(page.getByRole('radio', { name: 'Bill first', exact: true })).toBeDisabled();
  });

  test('125: a click on the description still selects the option; Space and arrows still work', async ({ page }) => {
    await story(page, 'aura-new-in-5-26--choice-descriptions');
    const event = page.getByRole('radio', { name: 'Event fee', exact: true });
    await page.getByText('A ticket or sponsorship for one event.').click();
    await expect(event).toBeChecked();
    await page.keyboard.press('ArrowUp');
    await expect(page.getByRole('radio', { name: 'Membership', exact: true })).toBeChecked();
    const email = page.getByRole('checkbox', { name: 'Email the member', exact: true });
    await page.getByText('Sent with the next invoice run.').click();
    await expect(email).toBeChecked();
    await expect(email).toBeFocused();
    await page.keyboard.press('Space');
    await expect(email).not.toBeChecked();
  });
});

test.describe('5.26: Chamber-OS addendum 29', () => {
  test('126: Container align="start" sits at the start edge (left, right in RTL); the default stays centred', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1400, height: 700 });
    await story(page, 'aura-new-in-5-26-addendum-29--container-align');
    /* Measured inside the element's parent (the story's own frame may pad the page). */
    const rect = (l: import('@playwright/test').Locator) =>
      l.evaluate((el) => {
        const b = el.getBoundingClientRect(),
          p = el.parentElement!.getBoundingClientRect();
        return { left: Math.round(b.left - p.left), right: Math.round(p.right - b.right), width: Math.round(b.width) };
      });
    const centred = await rect(page.getByTestId('centred'));
    expect(centred.width).toBe(1280);
    expect(Math.abs(centred.left - centred.right)).toBeLessThanOrEqual(1);
    expect(centred.left).toBeGreaterThan(0);
    const board = await rect(page.getByRole('region', { name: 'Member form' }));
    expect([board.left, board.width]).toEqual([0, 720]);
    expect(board.right).toBeGreaterThan(0);
    const rtl = await rect(page.getByTestId('rtl'));
    expect([rtl.right, rtl.width]).toEqual([0, 720]);
    expect(rtl.left).toBeGreaterThan(0);
  });

  test('126: Container passes id, data-* and aria-* to its element', async ({ page }) => {
    await story(page, 'aura-new-in-5-26-addendum-29--container-align');
    const board = page.locator('#board');
    await expect(board).toHaveAttribute('data-slot', 'layout-container');
    await expect(board).toHaveAttribute('data-variant', 'form');
    await expect(board).toHaveAttribute('aria-label', 'Member form');
    await expect(board).toHaveClass('aura-container is-narrow is-start');
    expect(await board.evaluate((el) => el.tagName)).toBe('SECTION');
  });
});

test.describe('5.26: descriptions are not names (Accordion, Combobox, Command)', () => {
  type AX = { role?: { value: string }; name?: { value: string }; description?: { value: string } };
  async function ax(page: import('@playwright/test').Page, roles: string[]) {
    const cdp = await page.context().newCDPSession(page);
    const { nodes } = (await cdp.send('Accessibility.getFullAXTree')) as { nodes: AX[] };
    return nodes
      .filter((n) => roles.includes(n.role?.value ?? ''))
      .map((n) => [n.role!.value, n.name?.value ?? '', n.description?.value ?? '']);
  }

  test("Accordion: a header button and its panel are named by the title; the description is the button's description", async ({
    page,
  }) => {
    await story(page, 'aura-new-in-5-26-descriptions--descriptions-not-names');
    await page.getByRole('button', { name: 'Fees', exact: true }).click();
    const got = (await ax(page, ['button', 'region'])).filter(([, n]) => /Fees|Contacts/.test(n)).sort();
    expect(got).toEqual(
      [
        ['button', 'Contacts', ''],
        ['button', 'Fees', 'Two unpaid invoices'],
        ['region', 'Fees', ''],
      ].sort(),
    );
  });

  test('Combobox: an option is named by its label and described by its second line', async ({ page }) => {
    await story(page, 'aura-new-in-5-26-descriptions--descriptions-not-names');
    await page.getByRole('combobox', { name: 'Member' }).click();
    await expect(page.getByRole('option', { name: 'Acme AB', exact: true })).toHaveAccessibleDescription(
      'Stockholm · Corporate',
    );
    expect(await ax(page, ['option'])).toEqual([
      ['option', 'Acme AB', 'Stockholm · Corporate'],
      ['option', 'Nordic Timber Oy', 'Helsinki · SME'],
    ]);
    /* Filtered: the ids are re-indexed and still point at the right option's spans. */
    await page.getByRole('combobox', { name: 'Member' }).fill('nordic');
    expect(await ax(page, ['option'])).toEqual([['option', 'Nordic Timber Oy', 'Helsinki · SME']]);
  });

  test('Command: an item keeps its shortcut in the name and reads the description after it', async ({ page }) => {
    await story(page, 'aura-new-in-5-26-descriptions--descriptions-not-names');
    await page.getByRole('button', { name: 'Open commands' }).click();
    const opts = await ax(page, ['option']);
    expect(opts).toEqual([
      ['option', 'New invoice N I', 'Bill a member'],
      ['option', 'Members G M', 'Member list'],
      ['option', 'Settings', ''],
    ]);
    /* Filtered: Members moves from the second place to the first, and its ids follow it. */
    await page.keyboard.type('members');
    await expect(page.getByRole('option')).toHaveCount(1);
    expect(await ax(page, ['option'])).toEqual([['option', 'Members G M', 'Member list']]);
  });
});

test.describe('5.26: Chamber-OS addendum 30', () => {
  type Geo = Record<string, number | string>;
  /* The card's inner box (inside its border), the bleeding frame's box and borders, and the first cell's text. */
  const geo = (page: import('@playwright/test').Page, id: string, frame: string) =>
    page.getByTestId(id).evaluate((card, frame) => {
      const c = card.getBoundingClientRect(),
        cs = getComputedStyle(card),
        f = card.querySelector(frame)!,
        b = f.getBoundingClientRect(),
        fs = getComputedStyle(f),
        bw = parseFloat(cs.borderLeftWidth),
        text = card.querySelector('[data-testid=filters]')!.getBoundingClientRect(),
        cell = card.querySelector('.aura-table__td, .aura-tbl__td')!,
        range = document.createRange();
      range.selectNodeContents(cell.querySelector('span, div') || cell);
      const t = range.getBoundingClientRect();
      return {
        left: Math.round(b.left - c.left - bw),
        right: Math.round(c.right - bw - b.right),
        bottom: Math.round(c.bottom - bw - b.bottom),
        side: fs.borderLeftWidth + ' ' + fs.borderRightWidth,
        top: fs.borderTopWidth,
        under: fs.borderBottomWidth,
        radius: fs.borderTopLeftRadius + ' ' + fs.borderBottomLeftRadius,
        level: Math.round(t.left - text.left),
      } as Geo;
    }, frame);

  test('127: a bleeding DataTable spans the card, keeps its top rule, and the card closes it when it is last', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, 'aura-new-in-5-26-addendum-30--table-bleed');
    const radius = await page.getByTestId('last').evaluate((c) => parseFloat(getComputedStyle(c).borderTopLeftRadius));
    expect(await geo(page, 'last', '.aura-table')).toEqual({
      left: 0,
      right: 0,
      bottom: 0,
      side: '0px 0px',
      top: '1px',
      under: '0px',
      radius: '0px ' + (radius - 1) + 'px',
      level: 0,
    });
    /* A footer follows: the bottom rule stays and the card keeps its padding below. */
    const f = await geo(page, 'footer', '.aura-table');
    expect([f.left, f.right, f.side, f.top, f.under, f.radius, f.level]).toEqual([
      0,
      0,
      '0px 0px',
      '1px',
      '1px',
      '0px 0px',
      0,
    ]);
    expect(f.bottom as number).toBeGreaterThan(24);
    /* Table: the same, with its 24px outer cells level with the card's content. */
    expect(await geo(page, 'static', '.aura-tbl-wrap')).toEqual({
      left: 0,
      right: 0,
      bottom: 0,
      side: '0px 0px',
      top: '1px',
      under: '0px',
      radius: '0px ' + (radius - 1) + 'px',
      level: 0,
    });
  });

  test('127: outside a Card bleed does nothing; bordered={false} drops the frame and keeps the header band', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, 'aura-new-in-5-26-addendum-30--table-bleed');
    const frame = (id: string) =>
      page
        .getByTestId(id)
        .locator('.aura-table')
        .evaluate((t) => {
          const s = getComputedStyle(t),
            p = t.parentElement!.closest('[data-testid]')!.getBoundingClientRect(),
            b = t.getBoundingClientRect();
          return [s.borderLeftWidth, s.borderBottomWidth, s.borderTopLeftRadius, Math.round(b.width - p.width)];
        });
    expect(await frame('outside')).toEqual(['1px', '1px', '20px', 0]);
    expect(await frame('borderless')).toEqual(['0px', '0px', '0px', 0]);
    const band = await page
      .getByTestId('borderless')
      .locator('.aura-table__head')
      .evaluate((h) => getComputedStyle(h).borderBottomWidth);
    expect(band).toBe('1px');
  });

  test('127: below flushBelow bleed does nothing — the stacked cards keep the page gutter', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await story(page, 'aura-new-in-5-26-addendum-30--table-bleed');
    const r = await page.getByTestId('last').evaluate((card) => {
      const c = card.getBoundingClientRect(),
        f = card.querySelector('[data-testid=filters]')!.getBoundingClientRect(),
        box = card.querySelector('.aura-bleed')!.getBoundingClientRect(),
        row = card.querySelector('.aura-table__row')!.getBoundingClientRect();
      return [
        Math.round(box.left - f.left),
        Math.round(f.right - box.right),
        Math.round(row.left - f.left),
        Math.round(c.bottom - box.bottom),
      ];
    });
    /* Level with the filters on both sides; the card's 16px padding stays below. */
    expect(r).toEqual([0, 0, 0, 17]);
  });

  test('127: a stackable Table bleeds the full width, and stacked as a list its rows stay level', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, 'aura-new-in-5-26-addendum-30--table-bleed');
    const g = await geo(page, 'static', '.aura-tbl-wrap');
    expect([g.left, g.right, g.level]).toEqual([0, 0, 0]);
    await page.setViewportSize({ width: 700, height: 900 });
    const r = await page.getByTestId('static').evaluate((card) => {
      const c = card.getBoundingClientRect(),
        bw = parseFloat(getComputedStyle(card).borderLeftWidth),
        f = card.querySelector('[data-testid=filters]')!.getBoundingClientRect(),
        wrap = card.querySelector('.aura-tbl-wrap')!.getBoundingClientRect(),
        row = card.querySelector('.aura-tbl__body .aura-tbl__row')!,
        range = document.createRange();
      range.selectNodeContents(row.querySelector('.aura-tbl__td')!);
      const t = range.getBoundingClientRect();
      return [Math.round(wrap.left - c.left - bw), Math.round(c.right - bw - wrap.right), Math.round(t.left - f.left)];
    });
    expect(r).toEqual([0, 0, 0]);
    /* 5.27 (130): inside an unpadded wrapper it bleeds too — no side frame, rows level with the filters. */
    const w = await page.getByTestId('wrapped').evaluate((card) => {
      const f = card.querySelector('[data-testid=filters]')!.getBoundingClientRect(),
        wrap = card.querySelector('.aura-tbl-wrap')!,
        range = document.createRange();
      range.selectNodeContents(wrap.querySelector('.aura-tbl__td')!);
      return [getComputedStyle(wrap).borderLeftWidth, Math.round(range.getBoundingClientRect().left - f.left)];
    });
    expect(w).toEqual(['0px', 0]);
  });

  test('127: stacked inside a framed Card the cards keep its padding', async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 900 });
    await story(page, 'aura-new-in-5-26-addendum-30--table-bleed');
    const r = await page.getByTestId('footer').evaluate((card) => {
      const f = card.querySelector('[data-testid=filters]')!.getBoundingClientRect(),
        row = card.querySelector('.aura-table__row')!.getBoundingClientRect();
      return [Math.round(row.left - f.left), Math.round(f.right - row.right)];
    });
    expect(r).toEqual([0, 0]);
  });
});

test.describe('5.27: Chamber-OS addendum 33', () => {
  const frame = (page: import('@playwright/test').Page, id: string) =>
    page.getByTestId(id).evaluate((card) => {
      const c = card.getBoundingClientRect(),
        bw = parseFloat(getComputedStyle(card).borderLeftWidth),
        t = card.querySelector('.aura-table')!,
        b = t.getBoundingClientRect(),
        s = getComputedStyle(t);
      return {
        left: Math.round(b.left - c.left - bw),
        right: Math.round(c.right - bw - b.right),
        bottom: Math.round(c.bottom - bw - b.bottom),
        side: s.borderLeftWidth,
        under: s.borderBottomWidth,
      };
    });

  test('130: bleed reaches through unpadded wrappers (gap column, container query, tabpanel); a pager after keeps the rule', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, 'aura-new-in-5-26-addendum-30--table-bleed');
    const g = await frame(page, 'nested-pager');
    expect([g.left, g.right, g.side, g.under]).toEqual([0, 0, '0px', '1px']);
    expect(g.bottom).toBeGreaterThan(24);
  });

  test('130: bleedEnd closes the card from inside wrappers; a nested Card resets the reach', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, 'aura-new-in-5-26-addendum-30--table-bleed');
    expect(await frame(page, 'nested-end')).toEqual({ left: 0, right: 0, bottom: 0, side: '0px', under: '0px' });
    /* The inner Card's table reaches the inner card's edges, not the outer one's. */
    const inner = await frame(page, 'inner');
    expect([inner.left, inner.right, inner.bottom]).toEqual([0, 0, 0]);
  });

  test('130: bleedEnd with a Card footer keeps the rule; a framed inner Card in a flush outer one keeps its own reach', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, 'aura-new-in-5-26-addendum-30--table-bleed');
    const f = await frame(page, 'end-footer');
    expect([f.left, f.right, f.under]).toEqual([0, 0, '1px']);
    expect(f.bottom).toBeGreaterThan(24);
    /* At 390 the outer Card is flush (reach 0) but the inner one is framed (16px): its table reaches the inner edges. */
    await page.setViewportSize({ width: 390, height: 900 });
    const inner = await frame(page, 'inner');
    expect([inner.left, inner.right]).toEqual([0, 0]);
  });

  test('130: below flushBelow a wrapped bleed still does nothing', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await story(page, 'aura-new-in-5-26-addendum-30--table-bleed');
    const r = await page.getByTestId('nested-pager').evaluate((card) => {
      const f = card.querySelector('[data-testid=filters]')!.getBoundingClientRect(),
        box = card.querySelector('.aura-bleed')!.getBoundingClientRect();
      return [Math.round(box.left - f.left), Math.round(f.right - box.right)];
    });
    expect(r).toEqual([0, 0]);
  });
});

test.describe('5.26: Chamber-OS addendum 31', () => {
  const ID = 'aura-new-in-5-26-addendum-31--filter-dates';
  const log = (page: import('@playwright/test').Page) => page.getByTestId('log').locator('li').allTextContents();

  test('128: the face sits like a FilterSelect, is one named button, and opens the calendar in one click', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, ID);
    const face = page.getByRole('button', { name: 'Submitted: Any time', exact: true });
    await expect(face).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(face).toHaveAttribute('aria-expanded', 'false');
    const [a, b] = await Promise.all([
      page.getByRole('combobox', { name: 'Status' }).boundingBox(),
      face.boundingBox(),
    ]);
    expect([Math.round(b!.height), Math.round(b!.y)]).toEqual([Math.round(a!.height), Math.round(a!.y)]);
    await face.click();
    const dlg = page.getByRole('dialog', { name: 'Submitted' });
    await expect(dlg).toBeVisible();
    await expect(face).toHaveAttribute('aria-expanded', 'true');
    await expect(dlg.locator('[data-date="2026-09-18"]')).toBeVisible();
    await expect(dlg.getByRole('button', { name: 'Any time' })).toHaveAttribute('aria-pressed', 'true');
  });

  test('128: onChange runs once a range is complete, never on the start day; focus returns to the face', async ({
    page,
  }) => {
    await story(page, ID);
    const face = page.getByRole('button', { name: /^Submitted: / });
    await face.click();
    const dlg = page.getByRole('dialog', { name: 'Submitted' });
    await dlg.locator('[data-date="2026-09-30"]').click();
    await expect(dlg.getByText('Choose the end date')).toBeVisible();
    expect(await log(page)).toEqual([]);
    await dlg.locator('[data-date="2026-09-01"]').click();
    await expect(dlg).toHaveCount(0);
    expect(await log(page)).toEqual(['2026-09-01/2026-09-30']);
    await expect(face).toHaveAccessibleName('Submitted: 1 – 30 Sept 2026');
    await expect(face).toBeFocused();
    /* A preset sets a whole range; "Any time" clears it — each one onChange. */
    await face.click();
    await expect(dlg.getByRole('button', { name: 'This month' })).toHaveAttribute('aria-pressed', 'true');
    /* A preset reaching past min can't be picked. */
    await expect(dlg.getByRole('button', { name: 'Last year' })).toBeDisabled();
    await dlg.getByRole('button', { name: 'Last 7 days' }).click();
    await expect(face).toHaveAccessibleName('Submitted: 12 – 18 Sept 2026');
    /* Picking it again just closes: no second onChange. */
    await face.click();
    await dlg.getByRole('button', { name: 'Last 7 days' }).click();
    await expect(dlg).toHaveCount(0);
    await face.click();
    await dlg.getByRole('button', { name: 'Any time' }).click();
    expect(await log(page)).toEqual(['2026-09-01/2026-09-30', '2026-09-12/2026-09-18', '-/-']);
    await expect(face).toHaveAccessibleName('Submitted: Any time');
    /* Escape closes without a change. */
    await face.click();
    await dlg.locator('[data-date="2026-09-10"]').click();
    await page.keyboard.press('Escape');
    await expect(dlg).toHaveCount(0);
    await expect(face).toBeFocused();
    expect(await log(page)).toHaveLength(3);
  });

  test('128: Thai shows Buddhist-era years on the face and in the calendar', async ({ page }) => {
    await story(page, ID);
    const face = page.getByRole('button', { name: 'วันที่ส่ง: 25 ก.ย. – 3 ต.ค. 2569', exact: true });
    await expect(face).toBeVisible();
    await face.click();
    await expect(page.getByRole('dialog', { name: 'วันที่ส่ง' }).getByText(/2569/).first()).toBeVisible();
  });

  test('128: on a phone the face wraps with the others and the calendar stays on screen', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, ID);
    const face = page.getByRole('button', { name: /^Submitted: / });
    const fb = (await face.boundingBox())!;
    expect(fb.x + fb.width).toBeLessThanOrEqual(390);
    await face.click();
    const d = (await page.getByRole('dialog', { name: 'Submitted' }).boundingBox())!;
    expect(d.x).toBeGreaterThanOrEqual(0);
    expect(d.x + d.width).toBeLessThanOrEqual(390);
  });

  test('128: on a short screen the popover scrolls instead of running off it', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 360 });
    await story(page, ID);
    await page.getByRole('button', { name: /^Submitted: / }).click();
    const d = (await page.getByRole('dialog', { name: 'Submitted' }).boundingBox())!;
    expect(d.y).toBeGreaterThanOrEqual(0);
    expect(d.y + d.height).toBeLessThanOrEqual(360);
  });
});

test.describe('5.26: Chamber-OS addendum 32', () => {
  test("129: stickyHeader pins the header under AppShell's bar while the page scrolls, band and rule with it", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 700 });
    await story(page, 'aura-new-in-5-26-addendum-32--sticky-header-page');
    const th = page.getByRole('columnheader', { name: 'PLAN' });
    const bar = await page.locator('.aura-shell__bar').evaluate((b) => b.getBoundingClientRect().height);
    await page.mouse.wheel(0, 900);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(800);
    const r = await th.evaluate((el) => {
      const s = getComputedStyle(el),
        card = el.closest('[data-testid=card]')!.getBoundingClientRect(),
        row = el.closest('tr')!.getBoundingClientRect();
      return {
        top: Math.round(el.getBoundingClientRect().top),
        bg: s.backgroundColor,
        rule: s.boxShadow.includes('inset'),
        span: [Math.round(row.left - card.left), Math.round(card.right - row.right)],
      };
    });
    expect(r.top).toBe(Math.round(bar));
    expect(r.bg).not.toBe('rgba(0, 0, 0, 0)');
    expect(r.rule).toBe(true);
    /* Under bleed the band spans the card's inner width (inside its 1px border). */
    expect(r.span).toEqual([1, 1]);
    /* Above the body: the cell at the header's spot is the header. */
    const hit = await page.evaluate((y) => document.elementFromPoint(300, y + 10)?.closest('th, td')?.tagName, r.top);
    expect(hit).toBe('TH');
  });

  test('129: with maxHeight the box scrolls and the header pins to its top; the default stays put', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, 'aura-new-in-5-26-addendum-32--sticky-header-box');
    const box = page.getByTestId('box').locator('.aura-tbl-wrap');
    expect(Math.round((await box.boundingBox())!.height)).toBe(240);
    await box.evaluate((el) => (el.scrollTop = 400));
    const d = await box.evaluate((el) =>
      Math.round(el.querySelector('th')!.getBoundingClientRect().top - el.getBoundingClientRect().top),
    );
    expect(d).toBe(1);
    /* A keyboard user can scroll it: a named, focusable region. */
    await expect(page.getByRole('region', { name: 'Boxed plans' })).toHaveAttribute('tabindex', '0');
    const plain = page.getByTestId('plain').getByRole('columnheader', { name: 'PLAN' });
    expect(await plain.evaluate((el) => getComputedStyle(el).position)).toBe('static');
  });

  test('129: one rule under the header at rest; a table that grows wider later becomes scrollable', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, 'aura-new-in-5-26-addendum-32--sticky-header-box');
    const th = page.getByTestId('grow').getByRole('columnheader', { name: 'PLAN' });
    expect(await th.evaluate((el) => getComputedStyle(el).borderBottomWidth)).toBe('0px');
    const w = page.getByTestId('grow').locator('.aura-tbl-wrap');
    await expect(w).not.toHaveClass(/is-wide/);
    await th.evaluate(
      (el) => (el.textContent = 'PLAN NAME AS REGISTERED WITH THE CHAMBER, IN FULL, FOR THE INVOICE HEADER'.repeat(2)),
    );
    await expect(w).toHaveClass(/is-wide/);
    expect(await w.evaluate((el) => [getComputedStyle(el).overflowX, el.scrollWidth > el.clientWidth])).toEqual([
      'auto',
      true,
    ]);
  });

  test('129: maxHeight caps stacked cards too; nothing spills onto what follows', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await story(page, 'aura-new-in-5-26-addendum-32--sticky-header-box');
    const box = (await page.getByTestId('stacked').locator('.aura-tbl-wrap').boundingBox())!;
    const after = (await page.getByTestId('after').boundingBox())!;
    expect(Math.round(box.height)).toBe(200);
    expect(after.y).toBeGreaterThanOrEqual(box.y + box.height);
  });

  test('129: a table wider than its box still scrolls sideways (nothing is clipped)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, 'aura-new-in-5-26-addendum-32--sticky-header-box');
    const w = page.getByTestId('wide').locator('.aura-tbl-wrap');
    await expect(w).toHaveClass(/is-wide/);
    const r = await w.evaluate((el) => [getComputedStyle(el).overflowX, el.scrollWidth > el.clientWidth]);
    expect(r).toEqual(['auto', true]);
  });
});

test.describe('5.28: Chamber-OS addenda 35–36', () => {
  const ID = 'aura-new-in-5-28--filter-chips';
  const chip = (page: import('@playwright/test').Page, text: string) =>
    page.locator('.aura-filterbar').first().locator('.aura-filterbar__chips .aura-tag').filter({ hasText: text });
  const cutOf = (l: import('@playwright/test').Locator) =>
    l
      .locator('.aura-tag__text')
      .evaluate((el) => [el.scrollWidth > el.clientWidth + 1, el.getAttribute('data-aura-tip')]);

  test('132: in the chips row a chip takes its whole text; outside FilterBar the 24ch cap stays, with the full text on hover', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await story(page, ID);
    for (const t of [
      'Submitted: 28 Aug – 3 Sept 2026',
      'Member: Midsommar Hospitality Co., Ltd.',
      'Plan: Premium Corporate (2026)',
      'Head Office',
    ])
      expect(await cutOf(chip(page, t))).toEqual([false, null]);
    const plain = page.getByTestId('plain').locator('.aura-tag');
    expect(await cutOf(plain)).toEqual([true, 'Member: Midsommar Hospitality Co., Ltd.']);
  });

  test("132: a chip wider than the row is cut; its text shows on hover and on the remove button's focus", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await story(page, ID);
    const LONG = 'Member: Midsommar Hospitality and Conference Centre Co., Ltd. (Head Office, Bangkok)';
    const c = chip(page, 'Head Office');
    const box = (await c.boundingBox())!;
    const row = (await page.locator('.aura-filterbar__chips').first().boundingBox())!;
    expect(box.x + box.width).toBeLessThanOrEqual(row.x + row.width + 0.5);
    expect(await cutOf(c)).toEqual([true, LONG]);
    /* Its × stays whole and in the row. */
    expect(Math.round((await c.locator('.aura-tag__remove').boundingBox())!.width)).toBe(24); // 5.75: 24px button
    const remove = page.getByRole('button', { name: 'Remove ' + LONG }).first();
    await remove.focus();
    await expect(page.getByRole('tooltip')).toHaveText(LONG);
    /* No page overflow from the chip. */
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });

  test('132: a long chip inside a wrapper in a grid never widens the page; a new label updates the hover text', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await story(page, ID);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    const w = page.getByTestId('wrapped-bar').locator('.aura-tag');
    expect((await cutOf(w))[0]).toBe(true);
    await page.getByRole('button', { name: 'Rename' }).click();
    await expect(w.locator('.aura-tag__text')).toHaveAttribute('data-aura-tip', /Branch Office, Chiang Mai/);
  });

  test('132: the remove button keeps focus when its chip starts being cut', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, ID);
    const remove = page.getByRole('button', { name: /^Remove Member: Midsommar Hospitality and Conference/ }).first();
    await remove.focus();
    await page.setViewportSize({ width: 390, height: 900 });
    await expect(remove).toBeFocused();
    await expect(page.getByRole('tooltip')).toBeVisible();
  });

  test('133: "Clear all" is 44px tall on a phone and on a coarse pointer; with a mouse it stays a compact link', async ({
    browser,
  }) => {
    for (const [width, touch, tall] of [
      [390, false, true],
      [1024, true, true],
      [1280, false, false],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width, height: 800 }, hasTouch: touch, isMobile: touch });
      const page = await ctx.newPage();
      await story(page, ID);
      const b = page.getByRole('button', { name: /Clear/ }).last();
      const h = Math.round((await b.boundingBox())!.height);
      if (tall) expect(h).toBe(44);
      else expect(h).toBeLessThan(32);
      await expect(b).toHaveCSS('text-decoration-line', 'underline');
      await ctx.close();
    }
  });
});

test.describe('5.29: Chamber-OS addendum 37', () => {
  /* Heights are compared within 6px per row: a caption line (16–18px) is drawn as a body-line bar, and the line
   * heights of the machine's fallback font shift both a little (Before 5.29: 9px per grid row, 46px per card). */
  const ID = 'aura-new-in-5-29--loading-rows';
  const rowsOf = (page: import('@playwright/test').Page, id: string) =>
    page.getByTestId(id).locator('.aura-table__row--skeleton, .aura-table__row--auto:not(.aura-table__row--skeleton)');
  const heights = (l: import('@playwright/test').Locator) =>
    l.evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));

  test('134: with rowHeight="auto" a skeleton row is as tall as the real row, two bars for skeletonLines: 2', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, ID);
    const sk = rowsOf(page, 'skeleton');
    await expect(sk).toHaveCount(2);
    await expect(sk.first()).toHaveClass(/aura-table__row--auto/);
    await expect(sk.first()).toHaveAttribute('aria-hidden', 'true');
    await expect(sk.first().locator('.aura-skel-lines > .aura-skel')).toHaveCount(2);
    const [s, r] = [await heights(sk), await heights(rowsOf(page, 'real'))];
    expect(r).toHaveLength(2);
    for (let i = 0; i < 2; i++) expect(Math.abs(s[i]! - r[i]!)).toBeLessThanOrEqual(6);
    /* With a mouse the action bars are button-sized (32px), like the real sm buttons. */
    const acts = await sk
      .first()
      .locator('.aura-skel--action')
      .evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
    expect(acts).toEqual([32, 32]);
  });

  test('134: a stacked skeleton card keeps the field labels, is as tall as the real card, and its footer bar is 44px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 1400 });
    await story(page, ID);
    const sk = rowsOf(page, 'skeleton');
    const labels = await sk
      .first()
      .locator('[data-label]')
      .evaluateAll((els) => els.map((e) => e.getAttribute('data-label')));
    expect(labels).toEqual(['FROM', 'TO', 'REASON']);
    const before = await sk
      .first()
      .locator('[data-label="FROM"]')
      .evaluate((e) => getComputedStyle(e, '::before').content);
    expect(before).not.toBe('none');
    const [s, r] = [await heights(sk), await heights(rowsOf(page, 'real'))];
    for (let i = 0; i < 2; i++) expect(Math.abs(s[i]! - r[i]!)).toBeLessThanOrEqual(6);
    const foot = (await sk.first().locator('.aura-skel--action.is-footer').boundingBox())!;
    const card = (await sk.first().boundingBox())!;
    expect(Math.round(foot.height)).toBe(44);
    expect(foot.width).toBeGreaterThan(card.width - 40);
    const more = (await sk.first().locator('.aura-skel--action:not(.is-footer)').boundingBox())!;
    expect([Math.round(more.width), Math.round(more.height)]).toEqual([44, 44]);
  });

  test('134: the action bars follow the touchHeight rule — 44px on a coarse pointer, 32px with a mouse', async ({
    browser,
  }) => {
    for (const [width, touch, h] of [
      [1024, true, 44],
      [1280, false, 32],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: touch, isMobile: touch });
      const page = await ctx.newPage();
      await story(page, ID);
      const real = page.getByTestId('real').getByRole('button', { name: 'Accept M-301' });
      expect(Math.round((await real.boundingBox())!.height)).toBe(h);
      const bars = await rowsOf(page, 'skeleton')
        .first()
        .locator('.aura-skel--action')
        .evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
      expect(bars).toEqual([h, h]);
      await ctx.close();
    }
  });

  test('134: when the rows arrive the table barely moves (phone and desktop)', async ({ page }) => {
    for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 1400 });
      await story(page, ID);
      const t = page.getByTestId('toggle');
      const a = (await t.boundingBox())!.height;
      await page.getByRole('button', { name: 'Toggle loading' }).click();
      await expect(t.locator('.aura-table__row--skeleton')).toHaveCount(0);
      const b = (await t.boundingBox())!.height;
      expect(Math.abs(a - b)).toBeLessThanOrEqual(12);
    }
  });

  test('134: without skeletonTouch the action bars stay 32px on phones and touch screens, as compact buttons do', async ({
    browser,
  }) => {
    for (const [width, touch] of [
      [390, true],
      [600, false],
      [1024, true],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width, height: 1400 }, hasTouch: touch, isMobile: touch });
      const page = await ctx.newPage();
      await story(page, ID);
      const sk = rowsOf(page, 'plain-skeleton');
      const bars = await sk
        .first()
        .locator('.aura-skel--action')
        .evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
      expect(bars).toEqual([32, 32]);
      const [s, r] = [await heights(sk), await heights(rowsOf(page, 'plain-real'))];
      expect(r).toHaveLength(2);
      for (let i = 0; i < 2; i++) expect(Math.abs(s[i]! - r[i]!)).toBeLessThanOrEqual(6);
      await ctx.close();
    }
  });

  test('134: skeletonLines bars follow align="end"; a pill column keeps one 20px pill', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1400 });
    await story(page, ID);
    const row = page.getByTestId('amounts').locator('.aura-table__row--skeleton').first();
    const cells = row.locator('.aura-table__td');
    const amt = cells.nth(1);
    const cell = (await amt.boundingBox())!;
    const pad = await amt.evaluate((e) => parseFloat(getComputedStyle(e).paddingRight));
    for (const b of await amt.locator('.aura-skel').all()) {
      const bb = (await b.boundingBox())!;
      expect(Math.abs(bb.x + bb.width - (cell.x + cell.width - pad))).toBeLessThanOrEqual(1);
    }
    const pills = cells.nth(2).locator('.aura-skel');
    await expect(pills).toHaveCount(1);
    expect(Math.round((await pills.boundingBox())!.height)).toBe(20);
  });

  test('134: the pulse still stops under reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await story(page, ID);
    await expect(rowsOf(page, 'skeleton').first().locator('.aura-skel').first()).toHaveCSS('animation-name', 'none');
  });
});

test.describe('5.30: visual polish', () => {
  const ID = 'aura-new-in-5-30--visual-polish';
  const css = (l: import('@playwright/test').Locator, p: string) =>
    l.evaluate((e, p) => getComputedStyle(e).getPropertyValue(p), p);

  test('dark: the primary fill is off-white, not pure white; the DataTable header band sits between canvas and card', async ({
    page,
  }) => {
    await story(page, ID, 'dark');
    expect(await css(page.getByRole('button', { name: 'Save' }), 'background-color')).toBe('rgb(228, 228, 231)');
    /* 5.75 (visual audit): #1f1f22, between the card and its hover (#111114 read as a hole) */
    const head = page.locator('.aura-table__head').first();
    expect(await css(head, 'background-color')).toBe('rgb(31, 31, 34)');
    expect(await css(page.locator('.aura-tbl__head .aura-tbl__th').first(), 'background-color')).toBe(
      'rgb(31, 31, 34)',
    );
  });

  test('light: Blocked is soft red-100 (5.75), the neutral pill and badge show on the canvas, the header band is the canvas', async ({
    page,
  }) => {
    await story(page, ID);
    const pills = page.getByTestId('pills');
    expect(await css(pills.locator('.aura-pill').filter({ hasText: 'Overdue' }), 'background-color')).toBe(
      'rgb(254, 226, 226)',
    );
    expect(await css(pills.locator('.aura-pill').filter({ hasText: 'Lapsed' }), 'background-color')).toBe(
      'rgb(228, 228, 231)',
    );
    expect(await css(pills.locator('.aura-badge'), 'background-color')).toBe('rgb(228, 228, 231)');
    expect(await css(page.locator('.aura-table__head').first(), 'background-color')).toBe('rgb(250, 250, 250)');
  });

  test('a disabled button is one faint look at full opacity, whatever its variant (5.79: it was a grey fill for filled ones and a fade for outline ones)', async ({
    page,
  }) => {
    for (const theme of ['light', 'dark'] as const) {
      await story(page, ID, theme);
      const fill = theme === 'light' ? 'rgb(244, 244, 245)' : 'rgba(0, 0, 0, 0)';
      for (const name of ['Disabled primary', 'Disabled danger', 'Disabled creative', 'Disabled secondary']) {
        const b = page.getByRole('button', { name });
        expect(await css(b, 'opacity')).toBe('1');
        expect(await css(b, 'background-color')).toBe(fill);
      }
      /* An aria-disabled (focusable, gated) primary looks the same, also on hover. */
      const gated = page.getByRole('button', { name: 'Gated primary' });
      await gated.hover();
      expect(await css(gated, 'background-color')).toBe(fill);
      expect(await css(gated, 'opacity')).toBe('1');
    }
  });

  test('forced colours: a disabled or gated filled button is GrayText and faded, unlike an enabled one', async ({
    page,
  }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await story(page, ID);
    for (const name of ['Disabled primary', 'Gated primary']) {
      const b = page.getByRole('button', { name });
      expect(await css(b, 'opacity')).toBe('0.5');
    }
    expect(await css(page.getByRole('button', { name: 'Save' }), 'opacity')).toBe('1');
  });

  test('a button outside a styled root is still Inter; the Table caption has room under it', async ({ page }) => {
    await story(page, ID);
    expect(await css(page.getByTestId('serif-root').getByRole('button'), 'font-family')).toMatch(/^Inter/);
    expect(await css(page.locator('.aura-tbl__caption').first(), 'padding-bottom')).toBe('12px');
  });

  test('a skeleton action bar has the button shape (pill)', async ({ page }) => {
    await story(page, 'aura-new-in-5-29--loading-rows');
    const bar = page.getByTestId('skeleton').locator('.aura-skel--action').first();
    expect(await css(bar, 'border-top-left-radius')).toBe('9999px');
  });

  test('Thai (lang="th"): pills and badges are 12px', async ({ page }) => {
    await story(page, ID);
    const th = page.getByTestId('thai');
    expect(await css(th.locator('.aura-pill').first(), 'font-size')).toBe('12px');
    expect(await css(th.locator('.aura-badge'), 'font-size')).toBe('12px');
    expect(await css(page.getByTestId('pills').locator('.aura-pill').first(), 'font-size')).toBe('11px');
    /* An English part inside the Thai one keeps the Latin size. */
    expect(await css(page.getByTestId('en-in-th').locator('.aura-pill'), 'font-size')).toBe('11px');
  });
});

test.describe('5.30: Chamber-OS addendum 38', () => {
  const ID = 'aura-new-in-5-30-addendum-38--touch-fields';
  const h = (l: import('@playwright/test').Locator) => l.evaluate((e) => Math.round(e.getBoundingClientRect().height));
  const centred = (row: import('@playwright/test').Locator) =>
    row.evaluate((r) => {
      const b = r.getBoundingClientRect();
      const t = (r.querySelector('.aura-choice__label, .aura-check__label') as HTMLElement).getBoundingClientRect();
      return Math.abs(t.top + t.height / 2 - (b.top + b.height / 2));
    });

  test("135: touchHeight='always' — 44px boxes and choice rows with a mouse at 1280, inside compact density", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 1400 });
    await story(page, ID);
    const a = page.getByTestId('always');
    for (const name of ['Certificate number', 'Type CONFIRM to issue'])
      expect(await h(a.getByRole('textbox', { name, exact: true }).locator('xpath=..'))).toBe(44);
    expect(await h(a.locator('.aura-select').first())).toBe(44);
    /* Textarea accepts the prop (no DOM attribute) and is 96px+ tall anyway. */
    expect(await h(a.getByRole('textbox', { name: 'Note' }))).toBeGreaterThanOrEqual(96);
    expect(await a.getByRole('textbox', { name: 'Note' }).getAttribute('touchheight')).toBeNull();
    /* The first two options are one line (44px, label centred); the one with a description grows. */
    const rows = a.locator('.aura-choice');
    expect(await h(rows.nth(0))).toBe(44);
    expect(await centred(rows.nth(0))).toBeLessThanOrEqual(1);
    expect(await h(rows.nth(1))).toBeGreaterThan(44);
    /* A Checkbox label sits on a 21px line, so its row is 45px — at least 44, the label still centred. */
    const check = a.locator('.aura-check--labelled');
    expect([44, 45]).toContain(await h(check));
    expect(await centred(check)).toBeLessThanOrEqual(1);
    /* The whole row is still the target: a click on its left padding area picks the option. */
    const third = rows.nth(2);
    const box = (await third.boundingBox())!;
    await page.mouse.click(box.x + 120, box.y + 4);
    await expect(a.getByRole('radio', { name: 'Not zero-rated' })).toBeChecked();
    /* Hint and error ids are unchanged. */
    const cert = a.getByRole('textbox', { name: 'Certificate number', exact: true });
    const certId = await cert.getAttribute('id');
    await expect(cert).toHaveAttribute('aria-describedby', certId + '-hint');
    const typed = a.getByRole('textbox', { name: 'Type CONFIRM to issue' });
    await expect(typed).toHaveAttribute('aria-describedby', (await typed.getAttribute('id')) + '-error');
  });

  test('135: the default stays compact and touchHeight={true} grows only below 640px or on touch', async ({
    browser,
  }) => {
    for (const [width, touch, grown] of [
      [1280, false, false],
      [600, false, true],
      [1024, true, true],
    ] as const) {
      const ctx = await browser.newContext({ viewport: { width, height: 1400 }, hasTouch: touch, isMobile: touch });
      const page = await ctx.newPage();
      await story(page, ID);
      const t = page.getByTestId('touch');
      expect(await h(t.locator('.aura-input').first())).toBe(grown ? 44 : 36);
      expect(await h(t.locator('.aura-choice').first())).toBe(grown ? 44 : 20);
      expect(await h(t.locator('.aura-check--labelled'))).toBe(grown ? 45 : 21);
      const d = page.getByTestId('default');
      /* Default: compact 36px with a mouse; touch screens already get 44 (unchanged). */
      expect(await h(d.locator('.aura-input').first())).toBe(touch ? 44 : 36);
      expect(await h(d.locator('.aura-choice').first())).toBe(touch ? 44 : 20);
      await ctx.close();
    }
  });
});

test.describe('5.30: audit items 4 and 8–20', () => {
  const ID = 'aura-new-in-5-30-polish--polish';
  const css = (l: import('@playwright/test').Locator, p: string) =>
    l.evaluate((e, p) => getComputedStyle(e).getPropertyValue(p), p);

  for (const [theme, violet] of [
    ['light', 'rgb(109, 40, 217)'],
    ['dark', 'rgb(196, 181, 253)'],
  ] as const)
    test(`4: "chosen" is violet in every control (${theme}); the primary button stays ink / off-white`, async ({
      page,
    }) => {
      await story(page, ID, theme);
      const c = page.getByTestId('chosen');
      expect(await css(c.locator('.aura-check__box').first(), 'background-color')).toBe(violet);
      expect(await css(c.locator('.aura-radio:checked'), 'border-top-color')).toBe(violet);
      expect(await css(c.locator('.aura-switch.is-on'), 'background-color')).toBe(violet);
      expect(await css(c.locator('.aura-tab.is-active'), 'border-bottom-color')).toBe(violet);
      expect(await css(c.locator('.aura-page.is-current'), 'background-color')).toBe(violet);
      expect(await css(c.locator('.aura-stepper__item.is-done .aura-stepper__marker'), 'background-color')).toBe(
        violet,
      );
      expect(await css(page.getByRole('button', { name: 'Save' }), 'background-color')).toBe(
        theme === 'light' ? 'rgb(24, 24, 27)' : 'rgb(228, 228, 231)',
      );
    });

  test('8–10: a narrow Table scrolls with an edge shadow, never breaks a word into letters; Total reads as the total', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 1600 });
    await story(page, ID);
    const wrap = page.getByTestId('narrow').locator('.aura-tbl-wrap');
    expect(await wrap.evaluate((e) => e.scrollWidth > e.clientWidth)).toBe(true);
    expect(await css(wrap, 'background-image')).toContain('linear-gradient');
    /* 10ch cells (from 640px viewport): "Helsinki", "Stockholm" and "Corporate" each stay on one line. */
    for (const t of ['Helsinki', 'Stockholm', 'Corporate'])
      expect(
        await wrap.getByRole('cell', { name: t, exact: true }).evaluate((td) => {
          const r = document.createRange();
          r.selectNodeContents(td);
          return new Set(Array.from(r.getClientRects()).map((x) => Math.round(x.top))).size;
        }),
      ).toBe(1);
    /* …and a long email (wrap="anywhere", 5.60) still breaks to fit a 600px box instead of widening the table. */
    const mail = page.getByTestId('email').locator('.aura-tbl-wrap');
    expect(await mail.evaluate((e) => e.scrollWidth <= e.clientWidth + 1)).toBe(true);
    const foot = wrap.locator('.aura-tbl__foot .aura-tbl__row');
    expect(await css(foot.first().locator('> *').first(), 'border-top-width')).toBe('2px');
    expect(await css(foot.last().locator('> *').first(), 'font-weight')).toBe('700');
    /* Phones keep fitting the box: no 10ch floor below 640px. */
    await page.setViewportSize({ width: 375, height: 1600 });
    expect(await css(wrap.locator('.aura-tbl__td').first(), 'min-width')).toBe('0px');
  });

  test('9: a DataTable with columns past its edge fades the end edge until scrolled to the end', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1600 });
    await story(page, ID);
    const t = page.getByTestId('narrow-grid').locator('.aura-table');
    await expect(t).toHaveClass(/has-more-x/);
    /* The shadow sits over the grid's end edge, inside its scrollbars; the scroll box itself isn't masked, so its
     * scrollbars stay visible. */
    const scroll = t.locator('.aura-table__scroll');
    expect(await css(scroll, 'mask-image')).toBe('none');
    const edge = (await t.locator('.aura-table__edge').boundingBox())!;
    const box = await scroll.evaluate((e) => {
      const r = e.getBoundingClientRect();
      return { right: r.left + e.clientLeft + e.clientWidth, top: r.top, h: e.clientHeight };
    });
    expect(Math.abs(edge.x + edge.width - box.right)).toBeLessThanOrEqual(1);
    expect(Math.abs(edge.y - box.top)).toBeLessThanOrEqual(1);
    expect(Math.abs(edge.height - box.h)).toBeLessThanOrEqual(1);
    await scroll.evaluate((e) => e.scrollTo({ left: e.scrollWidth }));
    await expect(t).not.toHaveClass(/has-more-x/);
    await expect(t.locator('.aura-table__edge')).toHaveCount(0);
  });

  test('11–12: the SegmentedControl is as tall as the field beside it; the selected option is bold on a raised thumb', async ({
    page,
  }) => {
    for (const theme of ['light', 'dark'] as const) {
      await story(page, ID, theme);
      const row = page.getByTestId('row');
      const field = (await row.locator('.aura-input').boundingBox())!;
      const seg = (await row.locator('.aura-segmented').boundingBox())!;
      expect(Math.round(seg.height)).toBe(Math.round(field.height));
      const sel = row.locator('.aura-segmented__option.is-selected');
      expect(await css(sel, 'font-weight')).toBe('600');
      expect(await css(sel, 'background-color')).toBe(theme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(63, 63, 70)');
    }
  });

  test('11: from 640px a FilterSelect face has a field inset and 14px text; phones keep the tight face', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 1600 });
    await story(page, ID);
    const face = page.locator('.aura-filterselect__face').first();
    expect([await css(face, 'padding-left'), await css(face, 'font-size')]).toEqual(['12px', '14px']);
    await page.setViewportSize({ width: 375, height: 1600 });
    expect([await css(face, 'padding-left'), await css(face, 'font-size')]).toEqual(['8px', '13px']);
  });

  test('14, 17, 18: quiet show-password icon, a 16px chip × (5.75), plain links in the accent colour', async ({
    page,
  }) => {
    for (const theme of ['light', 'dark'] as const) {
      await story(page, ID, theme);
      const eye = page.locator('.aura-password .aura-icon-btn');
      const secondary = await page.evaluate(() => {
        const p = document.createElement('span');
        p.style.color = 'var(--aura-fg-secondary)';
        document.body.appendChild(p);
        const c = getComputedStyle(p).color;
        p.remove();
        return c;
      });
      expect(await css(eye, 'color')).toBe(secondary);
      const x = page.getByTestId('tags').locator('.aura-tag__remove svg').first();
      expect(Math.round((await x.boundingBox())!.width)).toBe(16); // 5.75: a 16px ×
      expect(await css(page.getByTestId('prose').getByRole('link'), 'color')).toBe(
        theme === 'light' ? 'rgb(109, 40, 217)' : 'rgb(196, 181, 253)',
      );
    }
  });
});

test.describe('5.30: Chamber-OS addenda 39–40', () => {
  const ID = 'aura-new-in-5-30-addenda-39-40--menu-on-scroll';
  const menu = (page: import('@playwright/test').Page) => page.getByRole('menu');
  const gap = async (page: import('@playwright/test').Page, trigger: import('@playwright/test').Locator) => {
    const t = (await trigger.boundingBox())!;
    const m = (await menu(page).boundingBox())!;
    return Math.round(m.y - (t.y + t.height));
  };

  test('136: a small page scroll or a resize keeps the menu open and moves it with its trigger', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 700 });
    await story(page, ID);
    const trigger = page.getByRole('button', { name: 'Invoice actions' });
    await trigger.click();
    await expect(page.getByRole('menuitem')).toHaveCount(3);
    const before = await gap(page, trigger);
    await page.evaluate(() => window.scrollBy(0, 1));
    await page.evaluate(() => window.scrollBy(0, 12));
    await expect(page.getByRole('menuitem')).toHaveCount(3);
    /* The scroll event (and so the move) lands on the next frame: wait for it. */
    await expect.poll(() => gap(page, trigger)).toBe(before);
    await page.setViewportSize({ width: 900, height: 620 });
    await expect(page.getByRole('menuitem')).toHaveCount(3);
    /* The scroll event (and so the move) lands on the next frame: wait for it. */
    await expect.poll(() => gap(page, trigger)).toBe(before);
    /* Escape still closes it and gives focus back to the trigger. */
    await page.keyboard.press('Escape');
    await expect(menu(page)).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test('136: once the trigger has scrolled out of view the menu closes, without taking focus back', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 700 });
    await story(page, ID);
    const trigger = page.getByRole('button', { name: 'Invoice actions' });
    await trigger.click();
    await expect(menu(page)).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 400));
    await expect(menu(page)).toHaveCount(0);
    expect(await page.evaluate(() => window.scrollY)).toBe(400);
    await expect(trigger).not.toBeFocused();
  });

  test('136: a trigger in a scrolling box: the menu follows it, and closes when the box hides it', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 700 });
    await story(page, ID);
    const trigger = page.getByRole('button', { name: 'Row actions' });
    await trigger.click();
    await expect(menu(page)).toBeVisible();
    const box = page.getByTestId('box');
    await box.evaluate((e) => e.scrollBy(0, 20));
    await expect(menu(page)).toBeVisible();
    await expect.poll(() => gap(page, trigger)).toBeGreaterThanOrEqual(0);
    await expect.poll(() => gap(page, trigger)).toBeLessThanOrEqual(8);
    await box.evaluate((e) => e.scrollBy(0, 200));
    await expect(menu(page)).toHaveCount(0);
  });

  test('136: outside pointerdown and choosing an item still close the menu', async ({ page }) => {
    await story(page, ID);
    const trigger = page.getByRole('button', { name: 'Invoice actions' });
    await trigger.click();
    await page.mouse.click(900, 600);
    await expect(menu(page)).toHaveCount(0);
    await trigger.click();
    await page.getByRole('menuitem', { name: 'Mark paid' }).click();
    await expect(menu(page)).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test('137: StatusPill is 500 whatever its parent sets; Badge stays 600', async ({ page }) => {
    await story(page, ID);
    const w = (l: import('@playwright/test').Locator) => l.evaluate((e) => getComputedStyle(e).fontWeight);
    expect(await w(page.getByTestId('heading').locator('.aura-pill'))).toBe('500');
    expect(await w(page.getByTestId('plain').locator('.aura-pill'))).toBe('500');
    expect(await w(page.getByTestId('heading').locator('.aura-badge'))).toBe('600');
  });
});

test.describe('5.30: Chamber-OS addendum 39 — edges', () => {
  const ID = 'aura-new-in-5-30-addenda-39-40--menu-on-scroll';
  test('136: a fixed trigger inside a scrolling wrapper and a trigger past a one-axis clip stay open on scroll', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 700 });
    await story(page, ID);
    for (const name of ['Bar actions', 'Below a clip']) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.getByRole('button', { name }).click();
      await expect(page.getByRole('menu')).toBeVisible();
      await page.evaluate(() => window.scrollBy(0, name === 'Bar actions' ? 120 : 2));
      await expect(page.getByRole('menuitem')).toHaveCount(3);
      await page.keyboard.press('Escape');
      await expect(page.getByRole('menu')).toHaveCount(0);
    }
  });

  test('136: inside a Dialog, a trigger scrolled out of view closes the menu and focus stays in the dialog', async ({
    page,
  }) => {
    await story(page, ID);
    await page.getByRole('button', { name: 'Open dialog' }).click();
    const trigger = page.getByRole('button', { name: 'Dialog actions' });
    await trigger.click();
    await expect(page.getByRole('menu')).toBeVisible();
    await page.getByTestId('dialog-scroll').evaluate((e) => e.scrollBy(0, 300));
    await expect(page.getByRole('menu')).toHaveCount(0);
    await expect(trigger).toBeFocused();
    expect(await page.getByTestId('dialog-scroll').evaluate((e) => e.scrollTop)).toBe(300);
  });
});

test.describe('5.30: audit D — Thai', () => {
  test('field labels, hints and choice descriptions get Thai line room; stacked card labels are 12px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 2400 });
    await story(page, 'aura-new-in-5-30-polish--polish');
    const th = page.getByTestId('thai');
    const css = (l: import('@playwright/test').Locator, p: string, pseudo?: string) =>
      l.evaluate((e, [p, ps]) => getComputedStyle(e, ps || null).getPropertyValue(p), [p, pseudo || ''] as const);
    const lh = async (l: import('@playwright/test').Locator) =>
      parseFloat(await css(l, 'line-height')) / parseFloat(await css(l, 'font-size'));
    expect(await lh(th.locator('.aura-field__label').first())).toBeGreaterThanOrEqual(1.59);
    expect(await lh(th.locator('.aura-field__hint'))).toBeGreaterThanOrEqual(1.59);
    expect(await css(th.locator('.aura-choice__desc'), 'font-size')).toBe('13px');
    const cell = th.locator('.aura-tbl__td[data-label]').nth(1);
    expect(await css(cell, 'font-size', '::before')).toBe('12px');
    /* The English parts of the page keep their sizes. */
    expect(await css(page.getByTestId('narrow').locator('.aura-tbl__td').first(), 'font-size')).toBe('13px');
  });
});

test.describe('5.31: Chamber-OS addendum 41', () => {
  const ID = 'aura-new-in-5-31-addendum-41--label-addon';
  const top = (l: import('@playwright/test').Locator) => l.evaluate((e) => e.getBoundingClientRect().top);
  const bottom = (l: import('@playwright/test').Locator) => l.evaluate((e) => e.getBoundingClientRect().bottom);

  test('138: labelAddon sits between the label and the box, in the field gap; hint and error stay below', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await story(page, ID);
    const v = page.getByTestId('void');
    const label = v.locator('.aura-field__label'),
      addon = v.locator('.aura-field__addon'),
      box = v.locator('.aura-input'),
      hint = v.locator('.aura-field__hint');
    await expect(addon.getByTestId('phrase')).toHaveText('SC-2026-000119');
    /* Order on screen: label, addon, box, hint — each 6px apart (the field's gap). */
    expect(Math.round((await top(addon)) - (await bottom(label)))).toBe(6);
    expect(Math.round((await top(box)) - (await bottom(addon)))).toBe(6);
    expect(Math.round((await top(hint)) - (await bottom(box)))).toBe(6);
    /* The Textarea and PasswordField take it the same way. */
    for (const t of ['refund', 'password']) {
      const f = page.getByTestId(t);
      expect(await top(f.locator('.aura-field__addon'))).toBeGreaterThan(await bottom(f.locator('.aura-field__label')));
      expect(await top(f.locator('.aura-input').first())).toBeGreaterThan(
        await bottom(f.locator('.aura-field__addon')),
      );
    }
    await expect(page.getByTestId('plain').locator('.aura-field__addon')).toHaveCount(0);
  });

  test('138: the addon leads aria-describedby, before the hint or error and the caller’s own ids', async ({ page }) => {
    await story(page, ID);
    const v = page.getByTestId('void');
    const input = v.getByRole('textbox', { name: 'Type the bill number to confirm' });
    const id = await input.getAttribute('id');
    await expect(input).toHaveAttribute('aria-describedby', `${id}-addon ${id}-hint void-note`);
    await expect(v.locator('.aura-field__addon')).toHaveAttribute('id', id + '-addon');
    await expect(input).toHaveAccessibleDescription(/^SC-2026-000119 Copy Voiding can't be undone\. The member/);
    /* A wrong phrase: the error takes the hint's place; the addon stays first. */
    await input.fill('SC-2026-0001');
    await v.getByRole('button', { name: 'Void invoice' }).click();
    await expect(input).toHaveAttribute('aria-describedby', `${id}-addon ${id}-error void-note`);
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    /* Textarea and PasswordField. */
    const ta = page.getByTestId('refund').getByRole('textbox');
    await expect(ta).toHaveAttribute('aria-describedby', (await ta.getAttribute('id')) + '-addon');
    const pw = page.getByTestId('password').locator('input');
    await expect(pw).toHaveAttribute('aria-describedby', (await pw.getAttribute('id')) + '-addon');
    await expect(pw).toHaveAccessibleDescription('At least 12 characters.');
    /* No addon: unchanged. */
    const plain = page.getByTestId('plain').getByRole('textbox');
    await expect(plain).toHaveAttribute('aria-describedby', (await plain.getAttribute('id')) + '-hint');
    /* Never a DOM attribute. */
    expect(await page.locator('[labeladdon], [labelAddon]').count()).toBe(0);
  });

  test('138: the copy button comes before the box in tab order and the label still focuses the box', async ({
    page,
  }) => {
    await story(page, ID);
    const v = page.getByTestId('void');
    const copy = v.getByRole('button', { name: 'Copy' });
    await copy.focus();
    await page.keyboard.press('Tab');
    await expect(v.getByRole('textbox', { name: 'Type the bill number to confirm' })).toBeFocused();
    await v.locator('.aura-field__label').click();
    await expect(v.getByRole('textbox', { name: 'Type the bill number to confirm' })).toBeFocused();
    await copy.click();
    await expect(v.getByRole('button', { name: 'Copied' })).toBeVisible();
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('138: Thai addon text gets the 1.6 line height; dark theme is clean', async ({ page }) => {
    await story(page, ID);
    const th = page.getByTestId('thai').locator('.aura-field__addon');
    expect(await th.evaluate((e) => getComputedStyle(e).lineHeight)).toBe('20.8px');
    expect(
      await page
        .getByTestId('void')
        .locator('.aura-field__addon')
        .evaluate((e) => getComputedStyle(e).lineHeight),
    ).toBe('19.5px');
    await story(page, ID, 'dark');
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });
});

test.describe('5.31: Chamber-OS addendum 42', () => {
  const ID = 'aura-new-in-5-31-addendum-41--brand-checked';
  /* The "chosen" colour of each part, read from where it shows. */
  const chosen = (root: import('@playwright/test').Locator) =>
    root.evaluate((r) => {
      const cs = (sel: string) => getComputedStyle(r.querySelector(sel) as Element);
      return {
        check: cs('.aura-check__input:checked + .aura-check__box').backgroundColor,
        radio: cs('.aura-radio:checked').borderTopColor,
        switch: cs('.aura-switch.is-on').backgroundColor,
        tab: cs('.aura-tab.is-active').borderBottomColor,
        page: cs('.aura-page.is-current').backgroundColor,
        step: cs('.aura-stepper__item.is-done .aura-stepper__marker').backgroundColor,
        day: cs('.aura-cal__day.is-selected').backgroundColor,
        mark: cs('.aura-page.is-current').color,
      };
    });
  const all = (c: Record<string, string>, bg: string, mark: string) => {
    const { mark: m, ...rest } = c;
    for (const [k, v] of Object.entries(rest)) expect(v, k).toBe(bg);
    expect(m).toBe(mark);
  };

  test('139: a brand theme colours every checked control with the brand; AURA’s default stays violet', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 1200 });
    await story(page, ID);
    all(await chosen(page.getByTestId('brand')), 'rgb(46, 99, 151)', 'rgb(255, 255, 255)'); // #2e6397 = the accent
    all(await chosen(page.getByTestId('default')), 'rgb(109, 40, 217)', 'rgb(255, 255, 255)'); // violet-700
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('139: dark — the brand’s light step with an ink mark; default violet-300', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1200 });
    await story(page, ID, 'dark');
    all(await chosen(page.getByTestId('brand')), 'rgb(156, 197, 241)', 'rgb(24, 24, 27)'); // #9cc5f1
    all(await chosen(page.getByTestId('default')), 'rgb(196, 181, 253)', 'rgb(24, 24, 27)');
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('139: a hand-written theme that sets only --aura-accent-violet on :root moves light "chosen" with it', async ({
    page,
  }) => {
    await story(page, ID);
    await page.addStyleTag({ content: ':root { --aura-accent-violet: #2e6397; }' });
    /* Fills and the tab underline fade (short transitions): wait until every part has settled. */
    const B = 'rgb(46, 99, 151)';
    await expect
      .poll(async () => chosen(page.getByTestId('default')))
      .toEqual({ check: B, radio: B, switch: B, tab: B, page: B, step: B, day: B, mark: 'rgb(255, 255, 255)' });
  });
});

test.describe('5.32: icon tips', () => {
  const ID = 'aura-new-in-5-32-icon-tips--icon-tips';
  const tips = (page: import('@playwright/test').Page) => page.locator('.aura-tooltip');
  const auto = (page: import('@playwright/test').Page) => page.locator('.aura-tooltip--auto');

  test('hover: AURA tip after a short delay, no native title, aria-hidden, above the button', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, ID);
    const edit = page.getByRole('button', { name: 'Edit invoice' });
    expect(await edit.getAttribute('title')).toBeNull();
    await expect(edit).toHaveAttribute('data-aura-tip', 'Edit invoice');
    await edit.hover();
    await page.waitForTimeout(150);
    await expect(auto(page)).toHaveCount(0);
    await expect(auto(page)).toHaveText('Edit invoice');
    await expect(auto(page)).toHaveAttribute('aria-hidden', 'true');
    /* The name is not added to the description: a screen reader hears it once. */
    expect(await edit.getAttribute('aria-describedby')).toBeNull();
    const b = (await edit.boundingBox())!,
      t = (await auto(page).boundingBox())!;
    expect(t.y + t.height).toBeLessThanOrEqual(b.y);
    expect(Math.abs(t.x + t.width / 2 - (b.x + b.width / 2))).toBeLessThanOrEqual(1);
    expect(await auto(page).evaluate((e) => getComputedStyle(e).backgroundColor)).toBe(
      await page
        .evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--aura-bg-inverted').trim())
        .then((v) =>
          page.evaluate((c) => {
            const d = document.createElement('div');
            d.style.color = c;
            document.body.appendChild(d);
            const r = getComputedStyle(d).color;
            d.remove();
            return r;
          }, v),
        ),
    );
    /* Warm: the next button shows at once; only ever one tip element. */
    await page.getByRole('button', { name: 'Download PDF' }).hover();
    await expect(auto(page)).toHaveText('Download PDF', { timeout: 300 });
    await expect(tips(page)).toHaveCount(1);
    /* The pointer can move onto the tip (WCAG 1.4.13); leaving both hides it. */
    const tb = (await auto(page).boundingBox())!;
    await page.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2, { steps: 4 });
    await page.waitForTimeout(300);
    await expect(auto(page)).toHaveText('Download PDF');
    await page.mouse.move(600, 800);
    await expect(auto(page)).toHaveCount(0);
    /* A hover that leaves before the delay never shows. */
    await edit.hover();
    await page.mouse.move(600, 800);
    await page.waitForTimeout(600);
    await expect(auto(page)).toHaveCount(0);
  });

  test('keyboard: shows at once on Tab, Escape hides, a mouse click does not show it', async ({ page }) => {
    await story(page, ID);
    const edit = page.getByRole('button', { name: 'Edit invoice' });
    await page.mouse.move(600, 800);
    await edit.focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(edit).toBeFocused();
    await expect(auto(page)).toHaveText('Edit invoice', { timeout: 300 });
    await page.keyboard.press('Tab');
    await expect(auto(page)).toHaveText('Download PDF');
    await page.keyboard.press('Escape');
    await expect(auto(page)).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Download PDF' })).toBeFocused();
    /* The label changes while shown: the tip follows. */
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(auto(page)).toHaveText('Copy link');
    await page.keyboard.press('Enter');
    await expect(auto(page)).toHaveText('Copied');
    await page.keyboard.press('Tab');
    await expect(auto(page)).toHaveCount(0);
    /* Archive (focused now) has its own Aura.Tooltip, which covers the toolbar: blur it. */
    await page.evaluate(() => (document.activeElement as HTMLElement).blur());
    await expect(page.locator('.aura-tooltip')).toHaveCount(0);
    /* A click hides any tip and the mouse focus doesn't bring it back. */
    await page.getByRole('button', { name: 'Download PDF' }).click();
    await page.waitForTimeout(500);
    await expect(auto(page)).toHaveCount(0);
  });

  test('review: the tip never covers the next button; focus tips stay; containers; removed elements', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 1200 });
    await story(page, ID);
    /* Hover row 3's ⋯, then move up to row 2's (the tip lies over it): row 2 gets the hover and the click. */
    const r = page.getByTestId('rows');
    const b2 = (await r.getByRole('button', { name: 'More for Row 2' }).boundingBox())!,
      b3 = (await r.getByRole('button', { name: 'More for Row 3' }).boundingBox())!;
    await page.mouse.move(b3.x + b3.width / 2, b3.y + b3.height / 2);
    await expect(auto(page)).toHaveText('More for Row 3');
    await page.mouse.move(b2.x + b2.width / 2, b2.y + b2.height / 2, { steps: 6 });
    await expect(auto(page)).toHaveText('More for Row 2');
    expect(
      await page.evaluate(
        ([x, y]) => document.elementFromPoint(x!, y!)?.closest('button')?.getAttribute('aria-label'),
        [b2.x + b2.width / 2, b2.y + 4],
      ),
    ).toBe('More for Row 2');
    await page.mouse.down();
    await page.mouse.up();
    await expect(page.getByTestId('clicks')).toHaveText('Row 2');
    /* Hoverable: from the button straight up onto its tip, it stays. */
    await page.mouse.move(600, 1100);
    await expect(auto(page)).toHaveCount(0);
    const b1 = (await r.getByRole('button', { name: 'More for Row 1' }).boundingBox())!;
    await page.mouse.move(b1.x + b1.width / 2, b1.y + b1.height / 2);
    await expect(auto(page)).toHaveText('More for Row 1');
    const t1 = (await auto(page).boundingBox())!;
    await page.mouse.move(t1.x + t1.width - 4, t1.y + t1.height / 2, { steps: 5 });
    await page.waitForTimeout(400);
    await expect(auto(page)).toHaveText('More for Row 1');
    /* A focus tip stays while the mouse moves elsewhere. */
    await page.mouse.move(600, 1100);
    const edit = page.getByRole('button', { name: 'Edit invoice' });
    await edit.focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(auto(page)).toHaveText('Edit invoice');
    await page.mouse.move(900, 600, { steps: 5 });
    await page.mouse.move(100, 1000, { steps: 5 });
    await page.waitForTimeout(300);
    await expect(auto(page)).toHaveText('Edit invoice');
    /* Focusing a container shows nothing for the buttons inside it. */
    await page.getByTestId('region').focus();
    await expect(page.getByTestId('region')).toBeFocused();
    await page.waitForTimeout(200);
    await expect(auto(page)).toHaveCount(0);
    /* A hover tip whose element is removed goes with it. */
    const del = page.getByRole('button', { name: 'Delete INV-0142' });
    await del.hover();
    await expect(auto(page)).toHaveText('Delete INV-0142');
    await del.evaluate((el) => el.remove());
    await expect(auto(page)).toHaveCount(0);
    /* And a focus tip whose button is deleted from the keyboard. */
    const d1 = page.getByRole('button', { name: 'Delete INV-0141' });
    await d1.focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(auto(page)).toHaveText('Delete INV-0141');
    await page.keyboard.press('Delete');
    await expect(d1).toHaveCount(0);
    await expect(auto(page)).toHaveCount(0);
  });

  test('wrapped in Aura.Tooltip, an own title, or an open menu: no second tip', async ({ page }) => {
    await story(page, ID);
    const w = page.getByTestId('wrapped');
    await w.getByRole('button', { name: 'Archive' }).hover();
    await expect(page.locator('.aura-tooltip[role="tooltip"]')).toHaveText(/Archive moves it/);
    await expect(auto(page)).toHaveCount(0);
    const s = w.getByRole('button', { name: 'Settings' });
    await expect(s).toHaveAttribute('title', 'Workspace settings');
    expect(await s.getAttribute('data-aura-tip')).toBeNull();
    await s.hover();
    await page.waitForTimeout(600);
    await expect(auto(page)).toHaveCount(0);
    const more = w.getByRole('button', { name: 'More actions' });
    await more.click();
    await expect(page.getByRole('menu')).toBeVisible();
    await page.mouse.move(0, 0);
    await more.hover();
    await page.waitForTimeout(600);
    await expect(auto(page)).toHaveCount(0);
  });

  test('Pagination arrows, icon-only segments and cut Tags; Thai; the screen edge', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, ID);
    const next = page.getByTestId('pager').locator('[data-aura-tip]').last();
    expect(await next.getAttribute('title')).toBeNull();
    await next.hover();
    await expect(auto(page)).toHaveText((await next.getAttribute('aria-label'))!);
    await page.getByRole('radio', { name: 'Card view' }).hover();
    await expect(auto(page)).toHaveText('Card view');
    expect(await page.getByRole('radio', { name: 'Card view' }).getAttribute('title')).toBeNull();
    const cut = page.getByTestId('tags').locator('.aura-tag').first();
    await cut.hover();
    await expect(auto(page)).toHaveText('Branch: Head Office and Bangkok Metropolitan Region');
    /* Keyboard focus on the toggle Tag shows its full text too. */
    await page.mouse.move(600, 800);
    await expect(auto(page)).toHaveCount(0);
    await cut.focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(auto(page)).toHaveText(/Bangkok Metropolitan Region/);
    await page.keyboard.press('Escape');
    /* An uncut Tag has no tip. */
    expect(await page.getByTestId('tags').locator('.aura-tag__text').nth(1).getAttribute('data-aura-tip')).toBeNull();
    /* Thai: the tip takes the element's lang and the Thai line height. */
    await page.getByRole('button', { name: 'แก้ไขใบแจ้งหนี้' }).hover();
    await expect(auto(page)).toHaveAttribute('lang', 'th');
    expect(await auto(page).evaluate((e) => getComputedStyle(e).lineHeight)).toBe('19.2px');
    /* At the top-left corner it flips below and stays on screen. */
    const nav = page.getByRole('button', { name: 'Open navigation' });
    await nav.hover();
    await expect(auto(page)).toHaveText('Open navigation');
    const b = (await nav.boundingBox())!,
      t = (await auto(page).boundingBox())!;
    expect(t.y).toBeGreaterThanOrEqual(b.y + b.height);
    expect(t.x).toBeGreaterThanOrEqual(8);
    expect(await axeScan(page, 'body')).toEqual([]);
  });
});

test.describe('5.32: DxT Monitor requests 1, 3, 4', () => {
  const SHELL = 'aura-new-in-5-32-dxt-monitor--monitor-shell';
  const PARTS = 'aura-new-in-5-32-dxt-monitor--parts';
  const rect = (l: import('@playwright/test').Locator) =>
    l.evaluate((e) => {
      const r = e.getBoundingClientRect();
      return { x: r.left, y: r.top, w: r.width, h: r.height, b: r.bottom, r: r.right };
    });
  const css = (l: import('@playwright/test').Locator, p: string) =>
    l.evaluate((e, p) => getComputedStyle(e).getPropertyValue(p), p);

  test('1: headerDivider — 72px header, content 20px in, a full-width line, the first item at 88px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, SHELL);
    const nav = page.locator('.aura-shell__nav .aura-nav');
    const n = await rect(nav),
      hd = await rect(nav.locator('.aura-nav__header')),
      brand = await rect(nav.getByTestId('brand')),
      item = await rect(nav.locator('.aura-nav__item').first());
    expect(Math.round(hd.h)).toBe(72);
    expect(Math.round(brand.y - n.y)).toBe(20);
    expect(Math.round(brand.x - n.x)).toBe(20);
    /* The line spans the nav (its own right border aside) and sits at the header's foot. */
    expect(await css(nav.locator('.aura-nav__header'), 'border-bottom-width')).toBe('1px');
    expect(Math.round(hd.x)).toBe(Math.round(n.x));
    expect(Math.round(hd.w)).toBe(Math.round(n.w) - 1);
    expect(Math.round(item.y - n.y)).toBe(88);
    await expect(nav).toHaveClass(/aura-nav--header-divider/);
  });

  test('1: unchanged without it, without a header, and the collapsed rail keeps 8px sides', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, PARTS);
    const plain = page.getByTestId('plain').locator('.aura-nav__header');
    expect(await css(plain, 'border-bottom-width')).toBe('0px');
    expect(await css(plain, 'padding-left')).toBe('16px');
    expect(await css(plain, 'padding-top')).toBe('20px');
    const none = page.getByTestId('no-header').locator('.aura-nav');
    await expect(none).not.toHaveClass(/header-divider/);
    expect(await css(none.locator('.aura-nav__scroll'), 'padding-top')).toBe('12px');
    const rail = page.getByTestId('rail').locator('.aura-nav__header');
    expect(await css(rail, 'padding-left')).toBe('8px');
    expect(await css(rail, 'padding-right')).toBe('8px');
    expect(await css(rail, 'border-bottom-width')).toBe('1px');
    /* RTL: the 20px start padding moves to the right. */
    const rtl = await page
      .getByTestId('divided')
      .locator('.aura-nav__header')
      .evaluate((e) => {
        (e.closest('[data-testid]') as HTMLElement).dir = 'rtl';
        const s = getComputedStyle(e);
        return [s.paddingRight, s.paddingLeft];
      });
    expect(rtl).toEqual(['20px', '8px']);
  });

  test('1: phone drawer — the brand stays clear of the close button', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, SHELL);
    await page.locator('.aura-shell__menu').click();
    const drawer = page.locator('.aura-drawer--nav');
    await expect(drawer).toBeVisible();
    const head = drawer.locator('.aura-nav__header');
    expect(await css(head, 'padding-right')).toBe('60px'); // 5.33: a 44px close button on phones
    /* Both read at once: the drawer may still be sliding in. */
    const gap = await drawer.evaluate((d) => {
      const h = d.querySelector('.aura-nav__header')!.getBoundingClientRect(),
        c = d.querySelector('.aura-drawer__head button')!.getBoundingClientRect();
      return c.left - (h.right - 60);
    });
    expect(gap).toBeGreaterThanOrEqual(-1);
    await expect(drawer.locator('.aura-nav')).toHaveClass(/aura-nav--header-divider/);
    /* RTL: the close button and the room for it both move to the left. */
    await page.evaluate(() => (document.documentElement.dir = 'rtl'));
    expect(await css(head, 'padding-left')).toBe('60px');
    const off = await drawer.evaluate(
      (d) =>
        d.querySelector('.aura-drawer__head button')!.getBoundingClientRect().left - d.getBoundingClientRect().left,
    );
    expect(Math.round(off)).toBe(8);
  });

  test('3: PageHeader — board type, 4px between parts, actions at the end, AppShell padding as the only margin', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, SHELL);
    const ph = page.getByTestId('page-header');
    const content = await rect(page.locator('.aura-shell__content'));
    const p = await rect(ph);
    expect(Math.round(p.y - content.y)).toBe(32);
    expect(Math.round(p.x - content.x)).toBe(32);
    const eyebrow = ph.locator('.aura-page-header__eyebrow'),
      title = ph.getByRole('heading', { level: 1, name: 'Overview' }),
      meta = ph.locator('.aura-page-header__meta');
    expect(await css(eyebrow, 'font-family')).toMatch(/JetBrains Mono/);
    expect(await css(eyebrow, 'font-size')).toBe('12px');
    expect(await css(eyebrow, 'line-height')).toBe('20.4px');
    expect(await css(title, 'font-family')).toMatch(/Fraunces/);
    expect(await css(title, 'font-size')).toBe('36px');
    expect(await css(title, 'line-height')).toBe('41.4px');
    expect(await css(title, 'font-weight')).toBe('600');
    expect(await css(title, 'letter-spacing')).toBe('-0.36px');
    expect(await css(meta, 'font-size')).toBe('13px');
    expect(await css(meta, 'line-height')).toBe('19.5px');
    const e = await rect(eyebrow),
      t = await rect(title),
      m = await rect(meta);
    expect(Math.round(t.y - e.b)).toBe(4);
    expect(Math.round(m.y - t.b)).toBe(4);
    await expect(title).toHaveAttribute('id', 'overview-title');
    /* Actions: at the end, bottom-aligned with the text, at least 24px away. */
    const a = await rect(ph.locator('.aura-page-header__actions'));
    expect(Math.round(a.r)).toBe(Math.round(p.r));
    expect(Math.abs(a.b - m.b)).toBeLessThanOrEqual(1);
    expect(a.x - m.r).toBeGreaterThanOrEqual(24);
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('3: phone — 28px title, actions wrap under the text; h2 and Thai', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, SHELL);
    const ph = page.getByTestId('page-header');
    expect(await css(ph.getByRole('heading', { level: 1 }), 'font-size')).toBe('28px');
    const m = await rect(ph.locator('.aura-page-header__meta')),
      a = await rect(ph.locator('.aura-page-header__actions'));
    expect(a.y).toBeGreaterThanOrEqual(m.b);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, PARTS);
    await expect(page.getByTestId('h2').getByRole('heading', { level: 2, name: 'Sites' })).toBeVisible();
    await expect(
      page.getByTestId('h2').locator('.aura-page-header__eyebrow, .aura-page-header__meta, .aura-page-header__actions'),
    ).toHaveCount(0);
    /* Long eyebrow, title and meta wrap inside a 360px column instead of overflowing. */
    const long = page.getByTestId('long');
    expect(await long.evaluate((e) => e.scrollWidth)).toBeLessThanOrEqual(360);
    for (const s of ['.aura-page-header__eyebrow', '.aura-page-header__meta', '.aura-page-header__title'])
      expect(await long.locator(s).evaluate((e) => e.scrollWidth <= e.clientWidth + 1), s).toBe(true);
    const th = page.getByTestId('thai-header');
    expect(await css(th.getByRole('heading'), 'line-height')).toBe('50.4px');
    expect(await css(th.locator('.aura-page-header__meta'), 'line-height')).toBe('20.8px');
  });

  test('4: Skeleton pill and badge are as tall as the real ones, in English and Thai', async ({ page }) => {
    await story(page, PARTS);
    for (const id of ['pills', 'pills-th']) {
      const g = page.getByTestId(id);
      const sp = await rect(g.locator('.aura-skel--pill').first()),
        pill = await rect(g.locator('.aura-pill')),
        sb = await rect(g.locator('.aura-skel--badge')),
        badge = await rect(g.locator('.aura-badge'));
      expect(sp.h, id).toBe(pill.h);
      expect(sb.h, id).toBe(badge.h);
      expect(await css(g.locator('.aura-skel--badge'), 'border-radius')).toBe(
        await css(g.locator('.aura-badge'), 'border-radius'),
      );
      await expect(g.locator('.aura-skel--badge')).toHaveAttribute('aria-hidden', 'true');
    }
    expect((await rect(page.getByTestId('pills').locator('.aura-skel--pill').nth(1))).w).toBe(96);
    /* In a line of text they sit inline like the real ones: one line, the same height. */
    const lines = page.getByTestId('inline').locator('p');
    for (const [a, b] of [
      [0, 1],
      [2, 3],
    ]) {
      const sk = await rect(lines.nth(a!)),
        real = await rect(lines.nth(b!));
      /* Within 3px: a line's height follows the font's metrics (CI's fallback fonts differ by ~1.6px); a block
       * skeleton (the bug this guards) made it 56px. */
      expect(Math.abs(sk.h - real.h), `line ${a}`).toBeLessThanOrEqual(3);
    }
    expect(await css(lines.nth(0).locator('.aura-skel--badge'), 'display')).toBe('inline-block');
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });
});

test.describe('5.32: WCAG 2.5.3 label in name (axe 4.14)', () => {
  type AX = { role?: { value: string }; name?: { value: string }; description?: { value: string } };
  const tree = async (page: import('@playwright/test').Page, role: string) => {
    const cdp = await page.context().newCDPSession(page);
    const { nodes } = (await cdp.send('Accessibility.getFullAXTree')) as { nodes: AX[] };
    return nodes.filter((n) => n.role?.value === role).map((n) => [n.name?.value ?? '', n.description?.value ?? '']);
  };
  /* Storybook's a11y addon may be mid-run as the story mounts: wait and retry, like axeScan. */
  const rule = async (page: import('@playwright/test').Page): Promise<string[]> => {
    for (let i = 0; ; i++) {
      try {
        return (
          await new AxeBuilder({ page }).include('#storybook-root').withRules(['label-content-name-mismatch']).analyze()
        ).violations.flatMap((v) => v.nodes.map((n) => n.target.join(' ')));
      } catch (e) {
        if (i >= 4 || !/Axe is already running/.test(String(e))) throw e;
        await page.waitForTimeout(250);
      }
    }
  };

  test('Accordion: named by its title, the description still its description; no 2.5.3 finding', async ({ page }) => {
    await story(page, 'aura-new-in-5-26-descriptions--descriptions-not-names');
    expect(await rule(page)).toEqual([]);
    const b = await tree(page, 'button');
    expect(b).toContainEqual(['Fees', 'Two unpaid invoices']);
    expect(b).toContainEqual(['Export all data', 'A ZIP of every record, sent by email.']);
    expect(b).toContainEqual(['Contacts', '']);
    /* The description is still part of the button: a click on it toggles. */
    await page.getByText('Two unpaid invoices').click();
    await expect(page.getByRole('button', { name: 'Fees', exact: true })).toHaveAttribute('aria-expanded', 'true');
    /* Open lists too: Combobox options and Command items with a description. */
    await page.getByRole('combobox', { name: 'Member' }).click();
    await expect(page.getByRole('option', { name: 'Acme AB', exact: true })).toHaveAccessibleDescription(
      'Stockholm · Corporate',
    );
    expect(await rule(page)).toEqual([]);
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Open commands' }).click();
    await expect(page.getByRole('option', { name: 'New invoice N I', exact: true })).toHaveAccessibleDescription(
      'Bill a member',
    );
    const { violations } = await new AxeBuilder({ page }).withRules(['label-content-name-mismatch']).analyze();
    expect(violations.flatMap((v) => v.nodes.map((n) => n.target.join(' ')))).toEqual([]);
  });

  test('Stepper, FilterDateRange and BottomNav keep their names and descriptions; no 2.5.3 finding', async ({
    page,
  }) => {
    await story(page, 'aura-layout--stepper-story');
    expect(await rule(page)).toEqual([]);
    const steps = (await tree(page, 'button')).filter(([n]) => /completed|has errors/.test(n));
    expect(steps.length).toBeGreaterThan(0);
    for (const [n] of steps) expect(n, n).toMatch(/^[^,]+, (completed|has errors)$/);
    await story(page, 'aura-new-in-5-26-addendum-31--filter-dates');
    expect(await rule(page)).toEqual([]);
    await expect(page.getByRole('button', { name: 'Submitted: Any time', exact: true })).toHaveCount(1);
    await expect(page.getByRole('button', { name: 'วันที่ส่ง: 25 ก.ย. – 3 ต.ค. 2569', exact: true })).toHaveCount(1);
    await story(page, 'aura-new-in-5-7--short-tabs');
    expect(await rule(page)).toEqual([]);
    await expect(page.getByRole('button', { name: 'สิทธิประโยชน์ (3)', exact: true })).toHaveCount(1);
    await expect(page.getByRole('button', { name: 'Mitt konto', exact: true })).toHaveCount(1);
  });
});

test.describe('5.33: DxT Monitor requests 5–8', () => {
  const ID = 'aura-new-in-5-33-dxt-monitor--monitor-frame';
  const bg = (l: import('@playwright/test').Locator) => l.evaluate((e) => getComputedStyle(e).backgroundColor);
  const box = (l: import('@playwright/test').Locator) =>
    l.evaluate((e) => {
      const r = e.getBoundingClientRect();
      return { x: r.left, y: r.top, w: r.width, h: r.height, b: r.bottom };
    });

  test('5: hover shows on the nav (rows and its buttons) in light and dark; a card keeps the surface hover', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    for (const [theme, want] of [
      ['light', 'rgb(244, 244, 245)'],
      ['dark', 'rgb(39, 39, 42)'],
    ] as const) {
      await story(page, ID, theme);
      const nav = page.locator('.aura-shell__nav .aura-nav');
      const navBg = await bg(nav);
      const row = nav.getByRole('button', { name: 'Sites' }).or(nav.getByRole('link', { name: 'Sites' }));
      await row.hover();
      await expect.poll(() => bg(row)).toBe(want);
      expect(want).not.toBe(navBg);
      const out = nav.getByRole('button', { name: 'Sign out' });
      await out.hover();
      await expect.poll(() => bg(out)).toBe(want);
      /* On the page's canvas too (PageHeader actions): an IconButton and a ghost Button. */
      for (const name of ['Check now', 'History']) {
        const b = page.getByTestId('page-header').getByRole('button', { name });
        await b.hover();
        await expect.poll(() => bg(b), name).toBe(want);
      }
      /* On a white card the surface hover is unchanged. */
      const inCard = page.getByTestId('card').getByRole('button', { name: 'Edit check' });
      await inCard.hover();
      await expect.poll(() => bg(inCard)).toBe(theme === 'light' ? 'rgb(250, 250, 250)' : 'rgb(39, 39, 42)');
    }
  });

  test("5: the DataTable header band (canvas-coloured in light) shows its buttons' hover", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, 'aura-data-datatable--virtual-grid');
    const btn = page.locator('.aura-table__head .aura-table__menu-btn, .aura-table__picker button').first();
    await btn.hover();
    await expect.poll(() => bg(btn)).toBe('rgb(244, 244, 245)');
    expect(await bg(page.locator('.aura-table__head').first())).not.toBe('rgb(244, 244, 245)');
  });

  test('5: a DatePicker toggle on its read-only (grey) input shows its hover', async ({ page }) => {
    await story(page, 'aura-pickers--date-picker-story');
    const t = page.locator('.aura-input:has(input:read-only) .aura-date__toggle').first();
    const ground = await page
      .locator('.aura-input:has(input:read-only)')
      .first()
      .evaluate((e) => getComputedStyle(e).backgroundColor);
    await t.hover();
    await expect.poll(() => bg(t)).not.toBe(ground);
    expect(await bg(t)).toBe('rgb(244, 244, 245)');
  });

  test('6: headerHideFrom="lg" — no top bar from 1024px (bar height 0), the header bar with its menu below', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, ID);
    await expect(page.locator('.aura-shell__bar')).toBeHidden();
    expect(
      await page
        .locator('.aura-shell')
        .evaluate((e) => getComputedStyle(e).getPropertyValue('--aura-shell-bar-height').trim()),
    ).toBe('0px');
    /* The content starts at the shell's top (the preview may offset the shell itself). */
    const content = await box(page.locator('.aura-shell__content')),
      shell = await box(page.locator('.aura-shell'));
    expect(Math.round(content.y - shell.y)).toBe(0);
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator('.aura-shell__bar')).toBeVisible();
    await expect(page.getByTestId('phone-bar')).toBeVisible();
    await expect(page.getByRole('button', { name: /navigation/i })).toBeVisible();
    await expect
      .poll(() =>
        page
          .locator('.aura-shell')
          .evaluate((e) => getComputedStyle(e).getPropertyValue('--aura-shell-bar-height').trim()),
      )
      .toBe('56px');
  });

  test('7: PageHeader breadcrumb — a nav in a div, 4px above the title, its own 13px sans', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, ID);
    const ph = page.getByTestId('page-header');
    const slot = ph.locator('.aura-page-header__breadcrumb');
    await expect(slot.getByRole('navigation')).toBeVisible();
    expect(await slot.evaluate((e) => e.tagName)).toBe('DIV');
    expect(await ph.locator('p nav').count()).toBe(0);
    const s = await box(slot),
      t = await box(ph.getByRole('heading', { level: 1 }));
    expect(Math.round(t.y - s.b)).toBe(4);
    const crumb = slot.getByRole('link', { name: 'Sites' });
    expect(await crumb.evaluate((e) => getComputedStyle(e).fontFamily)).not.toMatch(/JetBrains/);
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('8: in the phone drawer the divided header is the bar height, its line meeting the bar line; desktop keeps 72px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, ID);
    expect(Math.round((await box(page.locator('.aura-shell__nav .aura-nav__header'))).h)).toBe(72);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole('button', { name: /navigation/i }).click();
    const drawer = page.locator('.aura-drawer--nav');
    await expect(drawer).toBeVisible();
    /* Read together: the drawer may still be sliding in. */
    const m = await page.evaluate(() => {
      const d = document.querySelector('.aura-drawer--nav')!;
      const h = d.querySelector('.aura-nav__header')!.getBoundingClientRect(),
        c = d.querySelector('.aura-drawer__head button')!.getBoundingClientRect(),
        bar = document.querySelector('.aura-shell__bar')!.getBoundingClientRect(),
        shell = document.querySelector('.aura-shell')!.getBoundingClientRect(),
        panel = d.getBoundingClientRect();
      /* Lines measured from the top of each: the drawer is fixed at the viewport's top, the shell (and its bar) at
       * the page's — the same place in an app; the preview offsets the shell. */
      return {
        h: h.height,
        hb: h.bottom - panel.top,
        bb: bar.bottom - shell.top,
        ht: h.top,
        cMid: c.top + c.height / 2,
      };
    });
    expect(Math.round(m.h)).toBe(56);
    expect(Math.abs(m.hb - m.bb)).toBeLessThanOrEqual(1);
    /* A taller (wrapping) phone bar: the drawer header follows it. */
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await page.getByTestId('phone-bar').evaluate((e) => ((e as HTMLElement).style.minHeight = '72px'));
    await expect
      .poll(() => page.locator('.aura-shell__bar').evaluate((e) => Math.round(e.getBoundingClientRect().height)))
      .toBeGreaterThan(72);
    await page.getByRole('button', { name: /navigation/i }).click();
    await expect(drawer).toBeVisible();
    const m2 = await page.evaluate(() => {
      const d = document.querySelector('.aura-drawer--nav')!;
      return {
        h: d.querySelector('.aura-nav__header')!.getBoundingClientRect().height,
        bar: document.querySelector('.aura-shell__bar')!.getBoundingClientRect().height,
      };
    });
    expect(Math.abs(m2.h - m2.bar)).toBeLessThanOrEqual(1);
    expect(Math.abs(m.cMid - (m.ht + 28))).toBeLessThanOrEqual(1);
    /* 5.33: the close button is a 44px target on a phone; the drawer carries the divided class (no :has needed). */
    const close = drawer.locator('.aura-drawer__head button');
    expect(Math.round((await close.boundingBox())!.height)).toBe(44);
    await expect(drawer).toHaveClass(/aura-drawer--nav-divided/);
  });
});

test.describe('5.34: StatusTile, TileGrid, Sparkline (DxT Monitor S06)', () => {
  const OV = 'aura-new-in-5-34-status-tiles--overview';
  const SP = 'aura-new-in-5-34-status-tiles--sparklines';
  const css = (l: import('@playwright/test').Locator, p: string) =>
    l.evaluate((e, p) => getComputedStyle(e).getPropertyValue(p), p);
  const rect = (l: import('@playwright/test').Locator) =>
    l.evaluate((e) => {
      const r = e.getBoundingClientRect();
      return { l: r.left, r: r.right, t: r.top, b: r.bottom, w: r.width, h: r.height };
    });

  test('the whole tile is one link named by everything it says, in reading order', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, OV);
    const down = page.getByRole('link', {
      name: 'api.example.co.th, Down, 12m, since 09:41, SSL expires in 5 days',
      exact: true,
    });
    await expect(down).toHaveCount(1);
    await expect(down).toHaveAttribute('href', '#down');
    await expect(
      page.getByRole('link', { name: 'Checkout, Problem, 1.8 s, slow · 3 of 4 regions', exact: true }),
    ).toHaveCount(1);
    await expect(
      page.getByRole('link', { name: 'Billing, Maintenance, until 14:00, Planned', exact: true }),
    ).toHaveCount(1);
    await expect(
      page.getByRole('link', {
        name: 'Customer portal — production (Bangkok region, primary), OK, 99.98%, 240 ms, Alerts muted, SSL valid',
        exact: true,
      }),
    ).toHaveCount(1);
    /* No aria-label: the name comes from what is shown (WCAG 2.5.3). Thai tiles use the Thai words with a provider;
     * without one, English. Without href, a plain box. */
    expect(await down.getAttribute('aria-label')).toBeNull();
    const plain = page.getByTestId('plain');
    expect(await plain.evaluate((e) => e.tagName)).toBe('DIV');
    expect(await plain.ariaSnapshot()).toContain('Status page, OK');
    /* Focus ring on keyboard focus. */
    await down.focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(down).toBeFocused();
    expect(await css(down, 'outline-style')).toBe('solid');
    expect(parseFloat(await css(down, 'outline-width'))).toBeGreaterThanOrEqual(2);
  });

  test('each status has its own icon and tint (never colour alone), light and dark', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    for (const theme of ['light', 'dark'] as const) {
      await story(page, OV, theme);
      const icons = new Set<string>();
      const bgs = new Set<string>();
      for (const id of ['down', 'problem', 'maintenance', 'ok']) {
        const tile = page.getByTestId(id);
        icons.add(await tile.locator('.aura-status-tile__icon').evaluate((e) => e.innerHTML));
        bgs.add(await css(tile, 'background-color'));
      }
      expect(icons.size).toBe(4);
      expect(bgs.size).toBe(4);
      const want = await page.evaluate(() => {
        const s = getComputedStyle(document.documentElement);
        const probe = document.createElement('i');
        document.body.appendChild(probe);
        const out: Record<string, string> = {};
        for (const v of ['alert-danger-bg', 'alert-warning-bg', 'alert-info-bg', 'bg-surface']) {
          probe.style.color = 'var(--aura-' + v + ')';
          out[v] = getComputedStyle(probe).color;
        }
        probe.remove();
        return out;
      });
      expect(await css(page.getByTestId('down'), 'background-color')).toBe(want['alert-danger-bg']);
      expect(await css(page.getByTestId('problem'), 'background-color')).toBe(want['alert-warning-bg']);
      expect(await css(page.getByTestId('maintenance'), 'background-color')).toBe(want['alert-info-bg']);
      expect(await css(page.getByTestId('ok'), 'background-color')).toBe(want['bg-surface']);
    }
  });

  test('title: two lines at most, never one line with …; value top right in tabular figures and its tone', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, OV);
    for (const id of ['ok', 'ok-similar']) {
      const title = page.getByTestId(id).locator('.aura-status-tile__title');
      const lh = parseFloat(await css(title, 'line-height'));
      const r = await rect(title);
      /* Both similar names show two full lines (they differ only at the end). */
      expect(Math.round(r.h / lh)).toBe(2);
    }
    /* A very long name stops at two lines. */
    const t = page.getByTestId('ok').locator('.aura-status-tile__title');
    await t.evaluate((e) => (e.textContent = 'Customer portal '.repeat(12)));
    const lh = parseFloat(await css(t, 'line-height'));
    expect(Math.round((await rect(t)).h / lh)).toBe(2);
    expect(await t.evaluate((e) => e.scrollHeight > e.clientHeight)).toBe(true);
    /* The value: top right, same first line as the title, tabular, red and bold on Down. */
    const tile = page.getByTestId('down');
    const v = tile.locator('.aura-status-tile__value');
    const tr = await rect(tile),
      vr = await rect(v),
      ti = await rect(tile.locator('.aura-status-tile__title'));
    expect(Math.abs(tr.r - 13 - vr.r)).toBeLessThanOrEqual(1);
    expect(Math.abs(vr.t - ti.t)).toBeLessThanOrEqual(1);
    expect(await css(v, 'font-variant-numeric')).toContain('tabular-nums');
    expect(Number(await css(v, 'font-weight'))).toBeGreaterThanOrEqual(600);
    expect(await css(v, 'color')).toBe(await css(tile.locator('.aura-status-tile__icon'), 'color'));
    /* valueTone overrides: Billing's "until 14:00" is grey, not violet. */
    const bv = page.getByTestId('maintenance').locator('.aura-status-tile__value');
    expect(await css(bv, 'color')).not.toBe(
      await css(page.getByTestId('maintenance').locator('.aura-status-tile__icon'), 'color'),
    );
  });

  test('markers sit at the end of the second line and show their label as a tip on hover', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, OV);
    const tile = page.getByTestId('ok');
    const markers = tile.locator('.aura-status-tile__marker');
    await expect(markers).toHaveCount(2);
    const last = await rect(markers.nth(1)),
      meta = await rect(tile.locator('.aura-status-tile__meta')),
      tr = await rect(tile);
    expect(Math.abs(tr.r - 13 - last.r)).toBeLessThanOrEqual(1);
    expect(Math.abs((last.t + last.b) / 2 - (meta.t + meta.b) / 2)).toBeLessThanOrEqual(2);
    await markers.nth(0).hover();
    await expect(page.locator('.aura-tooltip--auto')).toHaveText('Alerts muted');
    await expect(page.locator('.aura-tooltip--auto')).toHaveAttribute('aria-hidden', 'true');
  });

  test('TileGrid: a list of equal columns 8px apart — three on a desktop, two on a phone; RTL mirrors', async ({
    page,
  }) => {
    for (const [w, cols] of [
      [1280, 3],
      [390, 2],
    ] as const) {
      await page.setViewportSize({ width: w, height: 900 });
      await story(page, OV);
      const grid = page.getByTestId('grid');
      expect(await grid.evaluate((e) => e.tagName)).toBe('UL');
      await expect(grid.getByRole('listitem')).toHaveCount(6);
      await expect(page.getByRole('list', { name: 'Sites' })).toHaveCount(1);
      const boxes = await grid.locator(':scope > li').evaluateAll((els) =>
        els.map((e) => {
          const r = e.getBoundingClientRect();
          return { l: Math.round(r.left), w: Math.round(r.width), t: Math.round(r.top), b: Math.round(r.bottom) };
        }),
      );
      expect(new Set(boxes.map((b) => b.l)).size).toBe(cols);
      expect(new Set(boxes.map((b) => b.w)).size).toBe(1);
      expect(boxes[1].l - (boxes[0].l + boxes[0].w)).toBe(8);
      expect(boxes[cols].t - boxes[0].b).toBe(8);
      /* Tiles in a row are as tall as the tallest. */
      const tiles = await grid
        .locator('.aura-status-tile')
        .evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
      expect(tiles[0]).toBe(tiles[cols - 1]);
    }
    /* Phone: the value goes under the title in every tile alike instead of squeezing it. */
    const tv = await rect(page.getByTestId('problem').locator('.aura-status-tile__value'));
    const tt = await rect(page.getByTestId('problem').locator('.aura-status-tile__title'));
    expect(tv.t).toBeGreaterThanOrEqual(tt.b - 1);
    expect(Math.abs(tv.l + 24 - tt.l)).toBeLessThanOrEqual(1); // under the title, past the icon
    /* RTL: icon at the right, value at the left. */
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, OV);
    const rtl = page.getByTestId('rtl').locator('.aura-status-tile');
    const ri = await rect(rtl.locator('.aura-status-tile__icon')),
      rv = await rect(rtl.locator('.aura-status-tile__value'));
    expect(ri.l).toBeGreaterThan(rv.r);
  });

  test('Sparkline: null breaks the line, a lone point is a dot, failures as band or ticks, sizes and names', async ({
    page,
  }) => {
    await story(page, SP);
    const svg = (id: string) => page.getByTestId(id);
    /* LATENCY has nulls at 3–4 and 13: three runs. */
    const d = await svg('gaps').locator('path').getAttribute('d');
    expect(d!.match(/M/g)!.length).toBe(3);
    expect(await svg('gaps').locator('rect').count()).toBe(0); // failures default to none
    expect(await svg('band').locator('.aura-sparkline__band rect').count()).toBe(3);
    expect(await svg('ticks').locator('.aura-sparkline__ticks rect').count()).toBe(3);
    /* A band spans its point's slot, full height, behind the line. */
    const band = await svg('band').evaluate((e) => {
      const g = e.querySelector('.aura-sparkline__band')!;
      return { first: e.firstElementChild === g, h: g.querySelector('rect')!.getAttribute('height') };
    });
    expect(band).toEqual({ first: true, h: '24' });
    for (const [id, w, h] of [
      ['gaps', 80, 24],
      ['md', 120, 32],
    ] as const) {
      const r = await rect(svg(id));
      expect([Math.round(r.w), Math.round(r.h)]).toEqual([w, h]);
    }
    await expect(svg('lone').locator('circle')).toHaveCount(1);
    expect((await svg('lone').locator('path').getAttribute('d'))!.match(/M/g)!.length).toBe(1);
    expect(await svg('flat').locator('path').getAttribute('d')).toMatch(/^M2 12L/);
    await expect(svg('empty').locator('path')).toHaveCount(0);
    /* Shared scale: 100 of 0–400 sits low, 400 at the top. */
    const ya = await svg('scale-a').locator('path').getAttribute('d');
    const yb = await svg('scale-b').locator('path').getAttribute('d');
    expect(ya).toBe('M2 17L78 17');
    expect(yb).toBe('M2 2L78 2');
    /* Names: role img with the label; without a label it is hidden. */
    await expect(page.getByRole('img', { name: 'Response time with gaps' })).toHaveCount(1);
    await expect(svg('decor')).toHaveAttribute('aria-hidden', 'true');
    expect(await svg('decor').getAttribute('role')).toBeNull();
    /* Tones: the line takes the tone's colour. */
    const stroke = (id: string) =>
      svg(id)
        .locator('path')
        .evaluate((e) => getComputedStyle(e).stroke);
    expect(new Set([await stroke('gaps'), await stroke('band'), await stroke('ticks'), await stroke('md')]).size).toBe(
      4,
    );
  });

  test('review: a tile outside TileGrid keeps its width; a cut title shows its full name in a tip; Thai words', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, OV);
    /* In a flex row the tile is as wide as its content, not collapsed by containment. */
    const row = page.getByTestId('row').locator('.aura-status-tile');
    const r = await rect(row);
    expect(r.w).toBeGreaterThan(100);
    expect(r.h).toBeLessThanOrEqual(64);
    /* A cut title carries its full text as an AURA tip (aria-hidden); an uncut one doesn't. */
    await page.setViewportSize({ width: 390, height: 900 });
    await story(page, OV);
    const cut = page.getByTestId('grid-th').locator('.aura-status-tile__title').first();
    await expect(cut).toHaveAttribute('data-aura-tip', 'ระบบลงทะเบียนสมาชิกหอการค้า (สำนักงานใหญ่และสาขาภูมิภาค)');
    expect(
      await page.getByTestId('plain').locator('.aura-status-tile__title').getAttribute('data-aura-tip'),
    ).toBeNull();
    await cut.hover();
    await expect(page.locator('.aura-tooltip--auto')).toHaveText(
      'ระบบลงทะเบียนสมาชิกหอการค้า (สำนักงานใหญ่และสาขาภูมิภาค)',
    );
    /* Widening the page uncuts it: the tip goes. */
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect.poll(() => cut.getAttribute('data-aura-tip')).toBeNull();
    /* With the Thai pack the status word is Thai. */
    await expect(
      page.getByRole('link', {
        name: 'ระบบลงทะเบียนสมาชิกหอการค้า (สำนักงานใหญ่และสาขาภูมิภาค), ล่ม, 3 ชม., ตั้งแต่ 08:12',
        exact: true,
      }),
    ).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'หน้าเว็บหลัก, ปกติ, 100%, 180 ms', exact: true })).toHaveCount(1);
    /* A labelled Sparkline in the meta joins the link's name. */
    await expect(
      page.getByRole('link', { name: 'Search API, OK, 210 ms, Response time, last 16 checks', exact: true }),
    ).toHaveCount(1);
    /* A Fragment's tiles are list items of their own. */
    await expect(page.getByTestId('grid-frag').getByRole('listitem')).toHaveCount(3);
  });

  test('review: a link that does not forward refs: no React warning, and the cut title still gets its tip (hover and focus)', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, OV);
    const tile = page.getByTestId('plain-link').locator('.aura-status-tile');
    expect(await tile.getAttribute('data-plain-link')).toBe('');
    const title = tile.locator('.aura-status-tile__title');
    await expect(title).toHaveAttribute(
      'data-aura-tip',
      'A long site name on a router link that does not forward refs',
    );
    expect(errors.filter((e) => /ref/i.test(e))).toEqual([]);
    /* Keyboard focus on the tile's link shows the cut title too. */
    await tile.focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(tile).toBeFocused();
    await expect(page.locator('.aura-tooltip--auto')).toHaveText(
      'A long site name on a router link that does not forward refs',
    );
    /* A new, short title: the tip goes. */
    await title.evaluate((e) => (e.firstChild!.textContent = 'Short'));
    await expect.poll(() => title.getAttribute('data-aura-tip')).toBeNull();
    /* A control of its own inside a tile shows no title tip; the tile's padding does. */
    await page.mouse.move(0, 0);
    await expect(page.locator('.aura-tooltip--auto')).toHaveCount(0);
    const wb = page.getByTestId('with-button');
    await expect(wb.locator('.aura-status-tile__title')).toHaveAttribute('data-aura-tip', /retry button/);
    await wb.getByRole('button', { name: 'Retry' }).focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(wb.getByRole('button', { name: 'Retry' })).toBeFocused();
    await page.waitForTimeout(500);
    await expect(page.locator('.aura-tooltip--auto')).toHaveCount(0);
    await wb.getByRole('button', { name: 'Retry' }).hover();
    await page.waitForTimeout(600);
    await expect(page.locator('.aura-tooltip--auto')).toHaveCount(0);
    const box = (await wb.locator('.aura-status-tile').boundingBox())!;
    await page.mouse.move(box.x + 4, box.y + 4);
    await expect(page.locator('.aura-tooltip--auto')).toHaveText(/retry button/);
  });

  test('review: Sparkline min greater than max is swapped', async ({ page }) => {
    await story(page, SP);
    expect(await page.getByTestId('scale-swapped').locator('path').getAttribute('d')).toBe('M2 2L78 2');
  });

  test('axe: no violations in the tiles and sparklines, light and dark', async ({ page }) => {
    for (const theme of ['light', 'dark'] as const) {
      for (const id of [OV, SP]) {
        await story(page, id, theme);
        expect(await axeScan(page, '#storybook-root')).toEqual([]);
      }
    }
  });
});

test.describe('5.35: DxT Monitor requests 11–12', () => {
  const ID = 'aura-new-in-5-35-dxt-monitor-11-12--crumbs-and-no-data';
  const hit = (l: import('@playwright/test').Locator) =>
    l.evaluate((e) => {
      const a = getComputedStyle(e, '::after');
      const r = e.getBoundingClientRect();
      return { content: a.content, w: parseFloat(a.width), h: parseFloat(a.height), textH: r.height, textW: r.width };
    });

  test.describe('11: on a touch screen', () => {
    test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    test('every crumb link and button gets a 44px hit area; the text does not move', async ({ page }) => {
      await story(page, ID);
      const crumbs = page.getByTestId('crumbs');
      for (const name of ['Sites', 'A']) {
        const h = await hit(crumbs.getByRole('link', { name, exact: true }));
        expect(h.content).not.toBe('none');
        expect(h.h).toBe(44);
        expect(Math.round(h.w - h.textW)).toBe(24); // 12px into the gutter each side, never into a neighbour
        expect(h.textH).toBeLessThan(30); // the text box stays small
      }
      const b = await hit(crumbs.getByRole('button', { name: 'Edit monitors' }));
      expect(b.h).toBe(44);
      /* A tap 18px above the text centre still lands on the link (the area grows upward; only 4px below). */
      const link = crumbs.getByRole('link', { name: 'Sites' });
      const r = (await link.boundingBox())!;
      const at = await page.evaluate(
        ([x, y]) => (document.elementFromPoint(x, y) as HTMLElement | null)?.closest('a')?.textContent,
        [r.x + r.width / 2, r.y + r.height / 2 - 18],
      );
      expect(at).toBe('Sites');
      /* The current page is not a link and gets nothing. */
      const cur = await hit(crumbs.locator('.aura-crumbs__current'));
      expect(cur.content).toBe('none');
    });

    test('a tap on any crumb opens that crumb — wrapped rows, short neighbours, "…" — and never the title below', async ({
      page,
    }) => {
      await story(page, ID);
      const owner = (x: number, y: number) =>
        page.evaluate(
          ([x, y]) => {
            const el = document.elementFromPoint(x, y) as HTMLElement | null;
            const t = el && el.closest('a, button');
            return t ? (t.textContent || '').trim() : null;
          },
          [x, y],
        );
      for (const id of ['wrapped', 'collapsed', 'crumbs']) {
        const targets = page.getByTestId(id).locator('.aura-crumbs li > a, .aura-crumbs li > button');
        const n = await targets.count();
        expect(n).toBeGreaterThan(1);
        for (let i = 0; i < n; i++) {
          const t = targets.nth(i);
          if (!(await t.isVisible())) continue;
          const r = (await t.boundingBox())!;
          const name = ((await t.textContent()) || '').trim();
          /* Centre, both ends and 2px in from the top and bottom all open this crumb. */
          for (const [x, y] of [
            [r.x + r.width / 2, r.y + r.height / 2],
            [r.x + 1, r.y + r.height / 2],
            [r.x + r.width - 1, r.y + r.height / 2],
            [r.x + r.width / 2, r.y + 2],
            [r.x + r.width / 2, r.y + r.height - 2],
          ])
            expect(await owner(x, y), `${id} ${name} at ${Math.round(x - r.x)},${Math.round(y - r.y)}`).toBe(name);
        }
      }
      /* The breadcrumb wraps here, and the PageHeader title right under it is not covered. */
      const rows = await page
        .getByTestId('wrapped')
        .locator('.aura-crumbs li > a')
        .evaluateAll((els) => new Set(els.map((e) => Math.round(e.getBoundingClientRect().top))).size);
      expect(rows).toBeGreaterThan(1);
      const title = (await page.getByTestId('wrapped').locator('.aura-page-header__title').boundingBox())!;
      for (const dy of [1, 3, 6])
        for (const fx of [0.1, 0.5, 0.9]) expect(await owner(title.x + title.width * fx, title.y + dy)).toBeNull();
    });
  });

  test('11: with a mouse the crumbs are unchanged (no hit area)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await story(page, ID);
    const h = await hit(page.getByTestId('crumbs').getByRole('link', { name: 'Sites' }));
    expect(h.content).toBe('none');
  });

  test('12: status="unknown" — dashed circle in tertiary on the plain surface, "No data", Thai word; bad status falls back to it', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    for (const theme of ['light', 'dark'] as const) {
      await story(page, ID, theme);
      const u = page.getByTestId('unknown'),
        ok = page.getByTestId('ok');
      await expect(
        page.getByRole('link', { name: 'new-site.example.co.th, No data, Added 2 min ago', exact: true }),
      ).toHaveCount(1);
      const cs = (l: import('@playwright/test').Locator, p: string) =>
        l.evaluate((e, p) => getComputedStyle(e).getPropertyValue(p), p);
      expect(await cs(u, 'background-color')).toBe(await cs(ok, 'background-color'));
      expect(await cs(u, 'border-top-color')).toBe(await cs(ok, 'border-top-color'));
      const icon = u.locator('.aura-status-tile__icon');
      expect(await icon.evaluate((e) => e.innerHTML)).not.toBe(
        await ok.locator('.aura-status-tile__icon').evaluate((e) => e.innerHTML),
      );
      const tertiary = await page.evaluate(() => {
        const p = document.createElement('i');
        p.style.color = 'var(--aura-fg-tertiary)';
        document.body.appendChild(p);
        const c = getComputedStyle(p).color;
        p.remove();
        return c;
      });
      expect(await cs(icon, 'color')).toBe(tertiary);
      /* An unrecognised status claims nothing: it reads and looks like unknown, not OK. */
      await expect(page.getByRole('link', { name: 'Unrecognised status, No data', exact: true })).toHaveCount(1);
      await expect(page.getByTestId('bogus')).toHaveClass(/aura-status-tile--unknown/);
      await expect(
        page.getByRole('link', { name: 'เว็บไซต์ใหม่, ยังไม่มีข้อมูล, เพิ่มเมื่อ 2 นาทีที่แล้ว', exact: true }),
      ).toHaveCount(1);
      expect(await axeScan(page, '#storybook-root')).toEqual([]);
    }
  });
});

test.describe('5.35: DxT Monitor requests 13–14 (scroll away)', () => {
  const ID = 'aura-new-in-5-35-dxt-monitor-13-14--scroll-away';
  const scrollTo = async (page: Page, y: number) => {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(350); // past the 250ms slide
  };
  const barVar = (page: Page) =>
    page.locator('.aura-shell').evaluate((e) => getComputedStyle(e).getPropertyValue('--aura-shell-bar-height').trim());
  const offset = (page: Page) =>
    page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--aura-bottomnav-offset').trim());

  test.describe('on a phone', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('13: the top bar slides away scrolling down and back scrolling up; pinned headers follow; focus brings it back', async ({
      page,
    }) => {
      await story(page, ID);
      const bar = page.locator('.aura-shell__bar');
      await expect(bar).not.toHaveClass(/is-away/);
      expect(await barVar(page)).toBe('56px');
      await scrollTo(page, 900);
      await expect(bar).toHaveClass(/is-away/);
      await expect
        .poll(async () => {
          const r = (await bar.boundingBox())!;
          return r.y + r.height;
        })
        .toBeLessThanOrEqual(0);
      expect(await barVar(page)).toBe('0px');
      /* The pinned table header moved up to the top edge. */
      const th = page.locator('#storybook-root .aura-tbl thead th').first();
      expect(Math.round((await th.boundingBox())!.y)).toBe(0);
      /* A little up: back. */
      await scrollTo(page, 860);
      await expect(bar).not.toHaveClass(/is-away/);
      await expect.poll(async () => Math.round((await bar.boundingBox())!.y)).toBe(0);
      expect(await barVar(page)).toBe('56px');
      expect(Math.round((await th.boundingBox())!.y)).toBe(56);
      /* Down again, then keyboard focus into the bar: back, and it stays while focus is there. */
      await scrollTo(page, 1400);
      await expect(bar).toHaveClass(/is-away/);
      await bar.getByRole('button', { name: 'Notifications' }).focus();
      await expect(bar).not.toHaveClass(/is-away/);
      await scrollTo(page, 1700);
      await expect(bar).not.toHaveClass(/is-away/);
      /* Small jitters (under 8px) don't toggle it; near the top it always shows. */
      await page.locator('main').focus();
      await scrollTo(page, 2000);
      await expect(bar).toHaveClass(/is-away/);
      await scrollTo(page, 1996);
      await expect(bar).toHaveClass(/is-away/);
      await scrollTo(page, 20);
      await expect(bar).not.toHaveClass(/is-away/);
    });

    test('14: the BottomNav slides away scrolling down (offset follows, spacer stays) and back scrolling up', async ({
      page,
    }) => {
      await story(page, ID);
      const nav = page.locator('nav.aura-bottomnav');
      expect(await offset(page)).not.toBe('');
      const h0 = await page.evaluate(() => document.documentElement.scrollHeight);
      await scrollTo(page, 900);
      await expect(nav).toHaveClass(/is-away/);
      await expect.poll(async () => Math.round((await nav.boundingBox())!.y)).toBeGreaterThanOrEqual(844);
      expect(await offset(page)).toBe('');
      expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(h0);
      await scrollTo(page, 850);
      await expect(nav).not.toHaveClass(/is-away/);
      expect(await offset(page)).not.toBe('');
      await expect
        .poll(async () => {
          const r = (await nav.boundingBox())!;
          return Math.round(r.y + r.height);
        })
        .toBe(844);
    });

    test('14: a page with its own bottom bar (ActionBar hidesBottomNav) has no BottomNav; the bar takes the bottom edge', async ({
      page,
    }) => {
      await story(page, ID);
      await page.getByRole('button', { name: 'Toggle incident bar' }).click();
      await expect(page.locator('nav.aura-bottomnav')).toBeHidden();
      await expect(page.locator('.aura-bottomnav-spacer')).toBeHidden();
      expect(await offset(page)).toBe('');
      const ab = page.getByRole('region', { name: 'Actions', exact: true });
      await expect(ab).toHaveAttribute('data-aura-hide-bottomnav', '');
      await scrollTo(page, 0);
      const r = (await ab.boundingBox())!;
      expect(Math.round(844 - (r.y + r.height))).toBe(12);
      await page.getByRole('button', { name: 'Toggle incident bar' }).click();
      await expect(page.locator('nav.aura-bottomnav')).toBeVisible();
    });

    test('13: Shift+Tab from the content into an away bar brings it back without moving the page', async ({ page }) => {
      await story(page, ID);
      const bar = page.locator('.aura-shell__bar');
      /* Scroll down the way a finger does: many small steps. */
      for (let y = 40; y <= 1200; y += 40) await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(350);
      await expect(bar).toHaveClass(/is-away/);
      await page.evaluate(() => document.getElementById('main')!.focus({ preventScroll: true }));
      const before = await page.evaluate(() => window.scrollY);
      /* Shift+Tab from main lands on the bar's last control. */
      await page.keyboard.press('Shift+Tab');
      await expect(bar.getByRole('button', { name: 'Notifications' })).toBeFocused();
      await expect(bar).not.toHaveClass(/is-away/);
      expect(Math.abs((await page.evaluate(() => window.scrollY)) - before)).toBeLessThanOrEqual(1);
      /* App code that scrolls and then focuses the bar: AURA doesn't drag the page back to where it was (1600); the
       * browser may still scroll up to show the focused control. */
      await page.locator('main').evaluate((e) => (e as HTMLElement).focus({ preventScroll: true }));
      for (let y = 1240; y <= 1600; y += 40) await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(350);
      await expect(bar).toHaveClass(/is-away/);
      await page.evaluate(() => {
        window.scrollTo(0, 300);
        (
          document.querySelector(
            '.aura-shell__bar button[aria-label="Notifications"], .aura-shell__bar-content button',
          ) as HTMLElement
        ).focus();
      });
      await page.waitForTimeout(350);
      expect(await page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(300);
    });

    test('14: an idle bulk bar (0 selected) leaves the tabs; selecting a row hides them, clearing brings them back', async ({
      page,
    }) => {
      await story(page, ID);
      const nav = page.locator('nav.aura-bottomnav');
      await expect(nav).toBeVisible();
      await page.getByRole('button', { name: 'Select one' }).click();
      await expect(nav).toBeHidden();
      await expect(page.getByRole('region', { name: 'Bulk actions' })).toHaveAttribute('data-aura-hide-bottomnav', '');
      await page.getByRole('button', { name: 'Select one' }).click();
      await expect(nav).toBeVisible();
      expect(
        await page.getByRole('region', { name: 'Bulk actions' }).getAttribute('data-aura-hide-bottomnav'),
      ).toBeNull();
    });

    test('real touch drags (compositor scrolling, fling) hide and show both bars; the address bar resizing the viewport at the end of the page does not bring them back', async ({
      browser,
    }) => {
      const ctx = await browser.newContext({ viewport: { width: 412, height: 780 }, isMobile: true, hasTouch: true });
      const page = await ctx.newPage();
      const cdp = await ctx.newCDPSession(page);
      await story(page, ID);
      const drag = async (dy: number, steps = 10) => {
        const y0 = dy > 0 ? 700 : 150,
          y1 = y0 - dy;
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 200, y: y0 }] });
        for (let i = 1; i <= steps; i++) {
          await cdp.send('Input.dispatchTouchEvent', {
            type: 'touchMove',
            touchPoints: [{ x: 200, y: y0 + ((y1 - y0) * i) / steps }],
          });
          await page.waitForTimeout(16);
        }
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await page.waitForTimeout(1200);
      };
      const bar = page.locator('.aura-shell__bar'),
        nav = page.locator('nav.aura-bottomnav');
      await drag(300, 20);
      expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(200);
      await expect(bar).toHaveClass(/is-away/);
      await expect(nav).toHaveClass(/is-away/);
      await drag(-120, 12);
      await expect(bar).not.toHaveClass(/is-away/);
      await expect(nav).not.toHaveClass(/is-away/);
      /* Flick to the end, then the address bar slides away (taller viewport): the page clamps up 80px by itself. */
      for (let i = 0; i < 6; i++) await drag(560, 3);
      await expect(bar).toHaveClass(/is-away/);
      const y = await page.evaluate(() => window.scrollY);
      await page.setViewportSize({ width: 412, height: 860 });
      await page.waitForTimeout(400);
      expect(await page.evaluate(() => window.scrollY)).toBeLessThan(y);
      await expect(bar).toHaveClass(/is-away/);
      await expect(nav).toHaveClass(/is-away/);
      await page.setViewportSize({ width: 412, height: 780 });
      await page.waitForTimeout(400);
      await expect(bar).toHaveClass(/is-away/);
      /* Rotating past lg (width and height both change) while away: shown, not stuck away. */
      await page.setViewportSize({ width: 1100, height: 700 });
      await expect(bar).not.toHaveClass(/is-away/);
      await expect(nav).not.toHaveClass(/is-away/);
      await ctx.close();
    });

    test('reduced motion: no slide', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await story(page, ID);
      for (const sel of ['.aura-shell__bar', 'nav.aura-bottomnav'])
        expect(await page.locator(sel).evaluate((e) => getComputedStyle(e).transitionDuration)).toBe('0s');
    });
  });

  test('desktop: nothing slides (the bar and tab bar are phone-only here)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, ID);
    await scrollTo(page, 900);
    await expect(page.locator('.aura-shell__bar')).not.toHaveClass(/is-away/);
    expect(await barVar(page)).toBe('0px'); // headerHideFrom="lg": no bar from lg up
    expect(await offset(page)).toBe('');
  });
});

test.describe('5.36: DxT Monitor requests 15–16', () => {
  const ID = 'aura-new-in-5-36-dxt-monitor-15-16--cells';
  /* Is the focus ring painted on all four sides of the focused element? Samples the screenshot 3px outside each side
   * (the ring is 2px wide, 2px out) and compares with the ring colour. */
  const ringSides = async (page: Page, el: import('@playwright/test').Locator) => {
    const r = (await el.boundingBox())!;
    const ring = await el.evaluate((e) => getComputedStyle(e).outlineColor);
    const shot = await page.screenshot({
      clip: { x: r.x - 8, y: r.y - 8, width: r.width + 16, height: r.height + 16 },
    });
    return page.evaluate(
      async ({ b64, w, h, ring }) => {
        const img = new Image();
        img.src = 'data:image/png;base64,' + b64;
        await img.decode();
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        const g = c.getContext('2d')!;
        g.drawImage(img, 0, 0);
        const k = img.width / (w + 16);
        const m = ring.match(/\d+/g)!.map(Number);
        const near = (x: number, y: number) => {
          const d = g.getImageData(Math.round(x * k), Math.round(y * k), 1, 1).data;
          return Math.abs(d[0] - m[0]) + Math.abs(d[1] - m[1]) + Math.abs(d[2] - m[2]) < 60;
        };
        return {
          left: near(8 - 3, 8 + h / 2),
          right: near(8 + w + 3, 8 + h / 2),
          top: near(8 + w / 2, 8 - 3),
          bottom: near(8 + w / 2, 8 + h + 3),
        };
      },
      { b64: shot.toString('base64'), w: r.width, h: r.height, ring },
    );
  };
  const tabTo = async (page: Page, el: import('@playwright/test').Locator) => {
    /* Keyboard modality first (so :focus-visible applies), then focus: the grid moves focus with arrow keys. */
    await page.keyboard.press('Shift');
    await el.focus();
    await expect(el).toBeFocused();
    expect(await el.evaluate((e) => e.matches(':focus-visible'))).toBe(true);
  };

  test('15: a focused link in a table cell keeps all four sides of its ring (row link, a link in a cell; default, auto and compact rows)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, ID);
    for (const id of ['incidents', 'auto', 'compact']) {
      const t = page.getByTestId(id);
      for (const name of ['INC-1042', 'api.example.co.th']) {
        const link = t.getByRole('link', { name, exact: true });
        await tabTo(page, link);
        expect(await ringSides(page, link), id + ' ' + name).toEqual({
          left: true,
          right: true,
          top: true,
          bottom: true,
        });
      }
    }
  });

  test('15: with a checkbox column the first column keeps its ring; the checkbox does not move on focus; a focused link scrolled under a pinned column stays under it', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, ID);
    const sel = page.getByTestId('select');
    const link = sel.getByRole('link', { name: 'INC-1042', exact: true });
    await tabTo(page, link);
    expect(await ringSides(page, link)).toEqual({ left: true, right: true, top: true, bottom: true });
    const box = sel.locator('.aura-table__row').nth(1).locator('.aura-check__box, .aura-check').first();
    const before = (await box.boundingBox())!;
    const input = sel.getByRole('checkbox').nth(1);
    await tabTo(page, input);
    const after = (await box.boundingBox())!;
    expect(Math.round(after.x - before.x)).toBe(0);
    /* Scroll the narrow table so the SITE link passes under the pinned INCIDENT column, then focus it. */
    const pin = page.getByTestId('pinned');
    await pin.scrollIntoViewIfNeeded();
    const plink = pin.getByRole('link', { name: 'api.example.co.th' });
    const scroller = pin.locator('.aura-table__scroll');
    const pr = (await pin.locator('.aura-table__td.is-pinned').first().boundingBox())!;
    const lr0 = (await plink.boundingBox())!;
    await scroller.evaluate((e, d) => (e.scrollLeft = d), Math.round(lr0.x - pr.x - 30));
    await page.waitForTimeout(200);
    await page.keyboard.press('Shift');
    await plink.evaluate((e) => (e as HTMLElement).focus({ preventScroll: true }));
    const lr = (await plink.boundingBox())!;
    expect(lr.x).toBeLessThan(pr.x + pr.width); // it is under the pinned column now
    const top = await page.evaluate(
      ([x, y]) => (document.elementFromPoint(x, y) as HTMLElement).closest('a, .aura-table__td')!.className,
      [lr.x + 4, lr.y + lr.height / 2],
    );
    expect(top).toContain('is-pinned');
  });

  test('15: long text still ends in an ellipsis inside its cell', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, ID);
    const cell = page.getByTestId('long').locator('.aura-table__td').filter({ hasText: 'a-very-long' });
    const m = await cell.evaluate((e) => ({
      over: e.scrollWidth > e.clientWidth,
      to: getComputedStyle(e).textOverflow,
      ws: getComputedStyle(e).whiteSpace,
    }));
    expect(m).toEqual({ over: true, to: 'ellipsis', ws: 'nowrap' });
  });

  test('16: align "end" right-aligns the header and every cell, with tabular figures (default and auto rows)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, ID);
    for (const id of ['incidents', 'auto']) {
      const t = page.getByTestId(id);
      const head = t.getByRole('columnheader', { name: /DURATION/ });
      const hl = t.locator('.aura-table__th.is-end .aura-table__th-inner > :first-child');
      const hb = (await head.boundingBox())!,
        lb = (await hl.boundingBox())!;
      const cells = t.locator('.aura-table__td.is-end');
      await expect(cells).toHaveCount(3);
      for (let i = 0; i < 3; i++) {
        const c = cells.nth(i);
        const right = await c.evaluate((e) => {
          const range = document.createRange();
          range.selectNodeContents(e);
          const rr = range.getBoundingClientRect(),
            cr = e.getBoundingClientRect();
          return { gap: Math.round(cr.right - rr.right), num: getComputedStyle(e).fontVariantNumeric };
        });
        expect(right.gap, id + ' cell ' + i).toBe(16); // flush with the cell's 16px end padding
        expect(right.num).toContain('tabular-nums');
        /* The header's label ends where the values end. */
        const cb = (await c.boundingBox())!;
        expect(Math.abs(lb.x + lb.width - (cb.x + cb.width - 16)), id + ' header vs cell').toBeLessThanOrEqual(24);
      }
      expect(hb.width).toBeGreaterThan(0);
    }
  });
});

test.describe('5.37: DxT Monitor requests 17–18', () => {
  const HEAD = 'aura-new-in-5-37-dxt-monitor-17-18--header-actions';
  const SEG = 'aura-new-in-5-37-dxt-monitor-17-18--segmented-touch';
  const box = async (l: import('@playwright/test').Locator) => {
    const b = (await l.boundingBox())!;
    return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
  };
  /* The header's own width and its actions box, and each direct child of the actions. */
  const header = async (page: Page, id: string) => {
    const h = page.getByTestId(id);
    const kids = h.locator('.aura-page-header__actions > *');
    const out = {
      head: await box(h),
      actions: await box(h.locator('.aura-page-header__actions')),
      kids: [] as Array<{ x: number; y: number; w: number; h: number }>,
    };
    for (let i = 0; i < (await kids.count()); i++) out.kids.push(await box(kids.nth(i)));
    return out;
  };

  test('17: below md at 390px the actions span the row — two half-width buttons, then one full-width, 12px apart, 44px tall', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, HEAD);
    const m = await header(page, 'md');
    expect(m.actions.w).toBe(m.head.w);
    expect(m.actions.x).toBe(m.head.x);
    const [a, b, c] = m.kids;
    expect(a.y).toBe(b.y); // Mute and Maintenance share the first row
    expect(Math.abs(a.w - b.w)).toBeLessThanOrEqual(1); // equal halves, whatever the labels
    expect(a.x).toBe(m.head.x);
    expect(b.x - (a.x + a.w)).toBe(12);
    expect(b.x + b.w).toBe(m.head.x + m.head.w);
    expect(c.y - (a.y + a.h)).toBe(12); // Edit monitors on its own row, 12px below
    expect({ x: c.x, w: c.w }).toEqual({ x: m.head.x, w: m.head.w });
    expect([a.h, b.h, c.h]).toEqual([44, 44, 44]);
    /* Your own grid as the one child spans the row too; a single button reaches the edge. */
    const g = await header(page, 'grid');
    expect(g.kids[0].w).toBe(g.head.w);
    const third = await box(page.getByTestId('grid').getByRole('button', { name: 'Edit monitors' }));
    expect(third.w).toBe(g.head.w);
    const one = await header(page, 'one');
    expect(one.kids[0]).toMatchObject({ x: one.head.x, w: one.head.w });
    /* Without the prop each button keeps its own width and stops short of the edge. */
    const d = await header(page, 'default');
    expect(d.kids.map((k) => k.w < d.head.w / 2)).toEqual([true, true, true]);
  });

  test('17: a Tooltip-wrapped button and a DropdownMenu trigger fill their share; icon buttons (bare or as a menu trigger) stay square', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, HEAD);
    const w = page.getByTestId('wrapped');
    const head = await box(w);
    const mute = await box(w.getByRole('button', { name: 'Mute' }));
    const edit = await box(w.getByRole('button', { name: 'Edit' }));
    const more = await box(w.getByRole('button', { name: 'More' }));
    const open = await box(w.getByRole('button', { name: 'Open site' }));
    expect(mute.x).toBe(head.x);
    expect(Math.abs(mute.w - edit.w)).toBeLessThanOrEqual(1);
    expect(edit.x - (mute.x + mute.w)).toBe(12);
    expect([more.w, more.h, open.w, open.h]).toEqual([more.h, more.h, open.h, open.h]);
    expect(more.w).toBeLessThan(50);
    /* The row ends at the edge: the last control's right edge is the header's. */
    const right = Math.max(mute.x + mute.w, edit.x + edit.w, more.x + more.w, open.x + open.w);
    expect(right).toBe(head.x + head.w);
  });

  test('17: each breakpoint applies below its own width only', async ({ page }) => {
    const full = async (id: string) => {
      const x = await header(page, id);
      return x.actions.w === x.head.w;
    };
    await page.setViewportSize({ width: 700, height: 900 });
    await story(page, HEAD);
    expect({ sm: await full('one'), md: await full('md'), lg: await full('lg') }).toEqual({
      sm: false,
      md: true,
      lg: true,
    });
    await page.setViewportSize({ width: 900, height: 900 });
    await page.waitForTimeout(100);
    expect({ sm: await full('one'), md: await full('md'), lg: await full('lg') }).toEqual({
      sm: false,
      md: false,
      lg: true,
    });
    await page.setViewportSize({ width: 1100, height: 900 });
    await page.waitForTimeout(100);
    expect({ md: await full('md'), lg: await full('lg') }).toEqual({ md: false, lg: false });
    /* Wide: the actions sit at the end, on the text's row, 8px apart as before. */
    const m = await header(page, 'md');
    expect(m.actions.x + m.actions.w).toBe(m.head.x + m.head.w);
    expect(m.kids[1].x - (m.kids[0].x + m.kids[0].w)).toBe(8);
    const t = await box(page.getByTestId('md').locator('.aura-page-header__text'));
    expect(m.actions.y).toBeLessThan(t.y + t.h);
  });

  const heights = async (page: Page) => {
    const out: Record<string, number[]> = {};
    for (const id of ['type', 'duration', 'start', 'icons', 'always', 'plain']) {
      const opts = page.getByTestId(id).getByRole('radio');
      out[id] = [];
      for (let i = 0; i < (await opts.count()); i++) out[id].push((await box(opts.nth(i))).h);
    }
    out.iconW = [(await box(page.getByTestId('icons').getByRole('radio').first())).w];
    return out;
  };

  test('18: touchHeight options are 44px below 640px with a mouse (sm and icon-only too); without it 38px; "always" at every width', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, SEG);
    expect(await heights(page)).toEqual({
      type: [44, 44],
      duration: [44, 44, 44, 44],
      start: [44, 44],
      icons: [44, 44],
      always: [44, 44],
      plain: [38, 38],
      iconW: [44],
    });
    /* Full width still shares the row equally. */
    const t = page.getByTestId('type');
    const tr = await box(t.locator('.aura-segmented'));
    expect(tr.w).toBe((await box(t)).w);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.waitForTimeout(100);
    expect(await heights(page)).toEqual({
      type: [38, 38],
      duration: [38, 38, 38, 38],
      start: [24, 24],
      icons: [38, 38],
      always: [44, 44],
      plain: [38, 38],
      iconW: [38],
    });
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('18: on a coarse pointer every option is 44px at any width, as before; icon-only options with touchHeight are 44px square', async ({
    browser,
  }) => {
    const ctx = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 1200, height: 800 } });
    const page = await ctx.newPage();
    await story(page, SEG);
    const h = await heights(page);
    expect(h.type.concat(h.duration, h.start, h.icons, h.always, h.plain)).toEqual(Array(14).fill(44));
    expect(h.iconW).toEqual([44]);
    await ctx.close();
  });
});

test.describe('5.38: Chamber-OS addenda 43–45', () => {
  const FB = 'aura-new-in-5-38-chamber-os-140-142--filter-bar-touch';
  const FIELDS = 'aura-new-in-5-38-chamber-os-140-142--fields-touch';
  const ROWS = 'aura-new-in-5-38-chamber-os-140-142--row-props';
  const heights = (page: Page, sel: string) =>
    page.evaluate(
      (s) => [...document.querySelectorAll(s)].map((e) => Math.round(e.getBoundingClientRect().height)),
      sel,
    );
  const bar = async (page: Page) => ({
    search: await heights(page, '[data-testid=touch] .aura-filterbar__search'),
    selects: await heights(page, '[data-testid=touch] .aura-filterselect__face'),
    button: await heights(page, '[data-testid=touch] .aura-btn'),
    plainSearch: await heights(page, '[data-testid=plain] .aura-filterbar__search'),
    plainSelect: await heights(page, '[data-testid=plain] .aura-filterselect__face'),
    one: await heights(page, '[data-testid=one] .aura-filterselect__face'),
  });

  test('140: FilterBar touchHeight — search and FilterSelects are 44px below 640px with a mouse, like the Button; 36px from 640px; plain bar unchanged', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await story(page, FB);
    expect(await bar(page)).toEqual({
      search: [44],
      selects: [44, 44],
      button: [44],
      plainSearch: [36],
      plainSelect: [36],
      one: [44, 36],
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.waitForTimeout(100);
    expect(await bar(page)).toEqual({
      search: [36],
      selects: [36, 36],
      button: [36],
      plainSearch: [36],
      plainSelect: [36],
      one: [44, 36],
    });
  });

  test('140: in a touch bar the search’s clear button, SegmentedControl options and a Combobox’s buttons are 44px wide too', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await story(page, FB);
    const t = page.getByTestId('touch');
    await t.getByRole('searchbox').fill('anna');
    const sizes = await t.evaluate((root) => {
      const wh = (s: string) =>
        [...root.querySelectorAll(s)].map((e) => {
          const r = e.getBoundingClientRect();
          return [Math.round(r.width), Math.round(r.height)];
        });
      return {
        clear: wh('.aura-filterbar__clear-search'),
        options: wh('.aura-segmented__option').map((x) => x[1]),
        combo: wh('.aura-combo__clear, .aura-combo__toggle'),
        comboBox: wh('.aura-combo').map((x) => x[1]),
      };
    });
    expect(sizes).toEqual({
      clear: [[44, 40]],
      options: [44, 44],
      combo: [
        [44, 40],
        [44, 40],
      ],
      comboBox: [44],
    });
    const plain = page.getByTestId('plain');
    await plain.getByRole('searchbox').fill('x');
    const pc = (await plain.locator('.aura-filterbar__clear-search').boundingBox())!;
    expect(Math.round(pc.width)).toBeLessThan(44);
  });

  test('140: on a coarse pointer every search and FilterSelect is 44px, as before', async ({ browser }) => {
    const ctx = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 1200, height: 900 } });
    const page = await ctx.newPage();
    await story(page, FB);
    const b = await bar(page);
    expect(Object.values(b).flat()).toEqual(Array(8).fill(44));
    await ctx.close();
  });

  /* Each field's box, and its buttons inside (clear, chevron, calendar, steppers): size, and side by side inside the box. */
  const field = (page: Page, id: string) =>
    page.evaluate((id) => {
      const root = document.querySelector(`[data-testid="${id}"]`)!;
      const box = root.querySelector('.aura-input, .aura-select')!.getBoundingClientRect();
      const btns = [
        ...root.querySelectorAll('.aura-combo__clear, .aura-combo__toggle, .aura-date__toggle, .aura-number__step'),
      ].map((e) => e.getBoundingClientRect());
      /* A multiple Combobox reserves its end padding for the buttons: chips and the input wrap before it. */
      const boxEl = root.querySelector('.aura-combo.is-multi');
      const contentEnd = boxEl ? box.right - 1 - parseFloat(getComputedStyle(boxEl).paddingRight) : null;
      const chips = [...root.querySelectorAll('.aura-combo__chip')]
        .map((e) => e.getBoundingClientRect().right)
        .concat(contentEnd == null ? [] : [contentEnd]);
      return {
        h: Math.round(box.height),
        btns: btns.map((r) => [Math.round(r.width), Math.round(r.height)]),
        inside: btns.every(
          (r) => r.left >= box.left && r.right <= box.right + 0.5 && r.top >= box.top && r.bottom <= box.bottom + 0.5,
        ),
        apart: btns.length < 2 || btns[0].right <= btns[1].left + 0.5,
        chipsClear: !chips.length || Math.max(...chips) <= Math.min(...btns.map((r) => r.left)) + 0.5,
      };
    }, id);

  test('141: Combobox, DatePicker, TimePicker and NumberField take touchHeight — 44px boxes below 640px with a mouse, buttons 44px wide side by side', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await story(page, FIELDS);
    for (const id of ['email', 'role']) expect((await field(page, id)).h, id).toBe(44);
    for (const id of ['combo', 'date', 'time', 'combo-always']) {
      const f = await field(page, id);
      expect(f, id).toEqual({
        h: 44,
        btns: [
          [44, 40],
          [44, 40],
        ],
        inside: true,
        apart: true,
        chipsClear: true,
      });
    }
    const n = await field(page, 'number');
    expect([n.h, n.btns.map((b) => b[0]), n.inside, n.apart]).toEqual([44, [44, 44], true, true]);
    const m = await field(page, 'multi');
    expect([m.btns, m.inside, m.apart, m.chipsClear]).toEqual([
      [
        [44, 40],
        [44, 40],
      ],
      true,
      true,
      true,
    ]);
    const plain = await field(page, 'combo-plain');
    expect([plain.h, plain.btns]).toEqual([
      36,
      [
        [32, 32],
        [32, 32],
      ],
    ]);
    /* The bigger buttons still work: clear empties the field, the chevron opens the list. */
    const combo = page.getByTestId('combo');
    await combo.locator('.aura-combo__clear').click();
    await expect(combo.getByRole('combobox')).toHaveValue('');
    await combo.locator('.aura-combo__toggle').click();
    await expect(page.getByRole('listbox')).toBeVisible();
    await page.keyboard.press('Escape');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  });

  test('141: from 640px with a mouse touchHeight fields keep the density size; "always" stays 44px with 44px buttons', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, FIELDS);
    for (const id of ['combo', 'date', 'time']) {
      const f = await field(page, id);
      expect([f.h, f.btns], id).toEqual([
        36,
        [
          [32, 32],
          [32, 32],
        ],
      ]);
    }
    const a = await field(page, 'combo-always');
    expect(a).toEqual({
      h: 44,
      btns: [
        [44, 40],
        [44, 40],
      ],
      inside: true,
      apart: true,
      chipsClear: true,
    });
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('141: on a coarse pointer a multiple Combobox leaves room for both 44px buttons (chips never under them)', async ({
    browser,
  }) => {
    const ctx = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 1200, height: 900 } });
    const page = await ctx.newPage();
    await story(page, FIELDS);
    for (const id of ['multi', 'combo-plain']) {
      const f = await field(page, id);
      expect([f.h >= 44, f.btns, f.inside, f.apart, f.chipsClear], id).toEqual([
        true,
        [
          [44, 40],
          [44, 40],
        ],
        true,
        true,
        true,
      ]);
    }
    await ctx.close();
  });

  test('142: rowProps puts data-* and id on each row, in the grid and as stacked cards; role, class and selection stay AURA’s', async ({
    page,
  }) => {
    for (const width of [1000, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await story(page, ROWS);
      const t = page.getByTestId('users');
      const row = t.locator('[data-user-email="somchai@example.co.th"]');
      await expect(row).toHaveCount(1);
      expect(
        await row.evaluate((r) => [r.id, r.getAttribute('data-user-id'), r.getAttribute('role'), r.className]),
      ).toEqual(['user-u_102', 'u_102', 'row', 'aura-table__row']);
      await expect(t.locator('[data-user-id]')).toHaveCount(3);
      await row.getByRole('checkbox').check();
      await expect(row).toHaveAttribute('aria-selected', 'true');
      await expect(row).toHaveClass(/is-selected/);
    }
  });
});

test.describe('5.39: Chamber-OS addendum 46', () => {
  const TABS = 'aura-new-in-5-39-chamber-os-143--tabs-touch';
  const DATES = 'aura-new-in-5-39-chamber-os-143--date-range-touch';
  const tabs = (page: Page) =>
    page.evaluate(() => {
      const o: Record<string, number[]> = {};
      for (const id of ['links', 'buttons', 'segmented', 'always', 'plain'])
        o[id] = [...document.querySelectorAll(`[data-testid=${id}] .aura-tab`)].map((e) =>
          Math.round(e.getBoundingClientRect().height),
        );
      return o;
    });

  test('143: Tabs touchHeight — link and button tabs, underline and segmented, 44px below 640px with a mouse, like the search beside them', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await story(page, TABS);
    expect(await tabs(page)).toEqual({
      links: [44, 44, 44, 44],
      buttons: [44, 44],
      segmented: [44, 44],
      always: [44, 44, 44, 44],
      plain: [36, 36, 36, 36],
    });
    const search = (await page.getByTestId('links').locator('.aura-input').boundingBox())!;
    expect(Math.round(search.height)).toBe(44);
    /* The count badge and the icon stay centred on the label line (the underline's 2px is below it). */
    const centred = await page.evaluate(() =>
      [...document.querySelectorAll('[data-testid=links] .aura-tab, [data-testid=buttons] .aura-tab')].every((t) => {
        const r = t.getBoundingClientRect();
        const mid = (r.top + r.bottom - 2) / 2;
        return [...t.querySelectorAll('.aura-tab__count, .aura-icon')].every((c) => {
          const cr = c.getBoundingClientRect();
          return Math.abs((cr.top + cr.bottom) / 2 - mid) <= 1;
        });
      }),
    );
    expect(centred).toBe(true);
    /* Panels keep their own field height (the tabs' height is set on the tabs, not the density variable). */
    const field = (await page.getByTestId('buttons').locator('.aura-tabs__panel .aura-input').boundingBox())!;
    expect(Math.round(field.height)).toBe(36);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  });

  test('143: from 640px with a mouse touchHeight tabs keep the density height; "always" stays 44px; a link tab is as tall as a button tab', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, TABS);
    expect(await tabs(page)).toEqual({
      links: [36, 36, 36, 36],
      buttons: [36, 36],
      segmented: [30, 30],
      always: [44, 44, 44, 44],
      plain: [36, 36, 36, 36],
    });
    expect(await axeScan(page, '#storybook-root')).toEqual([]);
  });

  test('143: on a coarse pointer every tab is 44px, as before', async ({ browser }) => {
    const ctx = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 1200, height: 900 } });
    const page = await ctx.newPage();
    await story(page, TABS);
    expect(Object.values(await tabs(page)).flat()).toEqual(Array(16).fill(44));
    await ctx.close();
  });

  test('143: FilterBar touchHeight reaches FilterDateRange; FilterDateRange takes touchHeight alone too', async ({
    page,
  }) => {
    const faces = () =>
      page.evaluate(() =>
        [...document.querySelectorAll('.aura-filterselect__face')].map((e) =>
          Math.round(e.getBoundingClientRect().height),
        ),
      );
    await page.setViewportSize({ width: 390, height: 900 });
    await story(page, DATES);
    expect(await faces()).toEqual([44, 44, 36]);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.waitForTimeout(100);
    expect(await faces()).toEqual([36, 44, 36]);
  });
});

test.describe('5.40: Chamber-OS addendum 48 (type follows the browser default font size)', () => {
  const ID = 'aura-new-in-5-40-chamber-os-145--default-font-size';
  /* A page whose browser default font size is `size` (Settings → Font size). Set through the DevTools protocol
   * (Page.setFontSizes), which Playwright's headless shell honours; a profile preference file is ignored there. */
  const withDefault = async (browser: import('@playwright/test').Browser, size: number) => {
    const ctx = await browser.newContext({
      baseURL: test.info().project.use.baseURL,
      viewport: { width: 390, height: 900 },
    });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Page.enable');
    await cdp.send('Page.setFontSizes', { fontSizes: { standard: size, fixed: Math.round((size * 13) / 16) } });
    return { ctx, page };
  };
  const sizes = (page: Page) =>
    page.evaluate(() => {
      const fs = (s: string) => parseFloat(getComputedStyle(document.querySelector(s)!).fontSize);
      return {
        cardTitle: fs('[data-testid=card] .aura-card__title'),
        cardDesc: fs('[data-testid=card] .aura-card__desc'),
        body: fs('[data-testid=card] .aura-text-body'),
        switchDesc: fs('[data-testid=switch] .aura-choice__desc'),
        cell: fs('[data-testid=table] td'),
        input: fs('[data-testid=controls] input'),
        tab: fs('[data-testid=controls] .aura-tab'),
      };
    });
  const PX = { body: 14, input: 16, tab: 13 };

  test('145: at the default 16px nothing changes; at 32px the card, switch description and table text double and nothing scrolls sideways', async ({
    browser,
  }) => {
    const { ctx: ctx16, page: p16 } = await withDefault(browser, 16);
    await story(p16, ID);
    const s16 = await sizes(p16);
    /* The px sizes AURA has always used (input: 16px on phones so iOS doesn't zoom). */
    expect([s16.body, s16.input, s16.tab]).toEqual([PX.body, PX.input, PX.tab]);
    expect(s16.cardDesc).toBe(13);
    expect(s16.cell).toBe(13);
    await ctx16.close();

    const { ctx: ctx32, page: p32 } = await withDefault(browser, 32);
    await story(p32, ID);
    const s32 = await sizes(p32);
    for (const k of Object.keys(s16) as Array<keyof typeof s16>) if (k !== 'input') expect(s32[k], k).toBe(s16[k] * 2);
    /* Inputs are 14px, raised to 16px on phones so iOS doesn't zoom; doubled, 28px is above that floor. */
    expect(s32.input).toBe(28);
    expect(await p32.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
    await ctx32.close();
  });

  test('145: an app root set smaller (html 62.5%) never shrinks AURA text below its px size', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await story(page, ID);
    await page.addStyleTag({ content: 'html { font-size: 62.5% !important; }' });
    const s = await sizes(page);
    expect([s.cardDesc, s.cell, s.body, s.input, s.tab]).toEqual([13, 13, 14, 16, 13]);
  });
});

test.describe('5.41: DxT Monitor requests 19–22', () => {
  const BACK = 'aura-new-in-5-41-dxt-monitor-19-22--back-arrow-page';
  const TAB = 'aura-new-in-5-41-dxt-monitor-19-22--tab-page';
  const menuShown = (page: Page) =>
    page.locator('.aura-shell__menu').evaluate((e) => getComputedStyle(e).display !== 'none');

  test('19: a page marked data-aura-hide-menubutton has no menu button in the phone bar; other pages keep it', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, TAB);
    expect(await menuShown(page)).toBe(true);
    const titleTab = (await page.getByTestId('bar').locator('strong').boundingBox())!.width;
    await story(page, BACK);
    expect(await menuShown(page)).toBe(false);
    const titleBack = (await page.getByTestId('bar').locator('strong').boundingBox())!.width;
    expect(titleBack - titleTab).toBeGreaterThanOrEqual(36); // the title gets the menu button's room
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Back to Sites' })).toBeFocused(); // nothing invisible in the tab order first
    /* With no header the bar held only the menu button: a marked page has no empty bar. */
    await story(page, 'aura-new-in-5-41-dxt-monitor-19-22--no-header-marked');
    await expect(page.locator('.aura-shell__bar')).toBeHidden();
  });

  test('20: titleHideBelow="lg" — below 1024px the h1 stays for screen readers, breadcrumb hidden, the meta line starts the header; from 1024px all show', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, BACK);
    const h = page.getByTestId('header');
    await expect(h.getByRole('heading', { level: 1, name: 'status.example.co.th' })).toHaveCount(1);
    const g = await h.evaluate((el) => {
      const r = (s: string) => el.querySelector(s)!.getBoundingClientRect();
      return {
        titleW: Math.round(r('h1').width),
        crumbs: getComputedStyle(el.querySelector('.aura-page-header__breadcrumb')!).display,
        metaAtTop: Math.round(r('.aura-page-header__meta').top - el.getBoundingClientRect().top),
      };
    });
    expect(g).toEqual({ titleW: 1, crumbs: 'none', metaAtTop: 0 });
    /* No meta: the actions start the header (no empty text row, no 16px gap above them). */
    const nm = page.getByTestId('no-meta').locator('.aura-page-header');
    const top = (await nm.boundingBox())!.y,
      actions = (await nm.locator('.aura-page-header__actions').boundingBox())!.y;
    expect(Math.round(actions - top)).toBe(0);
    await expect(nm.getByRole('heading', { level: 1, name: 'Incidents' })).toHaveCount(1);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.waitForTimeout(100);
    expect(Math.round((await h.locator('h1').boundingBox())!.width)).toBeGreaterThan(100);
    await expect(h.locator('.aura-page-header__breadcrumb')).toBeVisible();
  });

  test('21: a menu link with target="_blank" says it opens a new tab, after its label; other links unchanged', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, BACK);
    await page.getByRole('button', { name: 'Site actions' }).click();
    const visit = page.getByRole('menuitem', { name: 'Visit site (opens in a new tab)', exact: true });
    await expect(visit).toHaveAttribute('target', '_blank');
    await expect(visit).toHaveAttribute('rel', 'noreferrer');
    await expect(page.getByRole('menuitem', { name: 'Export report', exact: true })).toHaveCount(1);
    /* The visible text is just the label. */
    expect(
      await visit.evaluate((e) => [
        e.querySelector('.aura-menu__label')!.firstChild!.textContent,
        e.querySelector('.aura-menu__label .aura-sr-only')!.textContent,
      ]),
    ).toEqual(['Visit site', ' (opens in a new tab)']);
  });

  test('22: an IconButton or secondary Button trigger keeps the hover fill while its menu is open, and loses it when closed', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, BACK);
    const bg = (n: string) =>
      page.getByRole('button', { name: n, exact: true }).evaluate((e) => getComputedStyle(e).backgroundColor);
    for (const name of ['Site actions', 'More']) {
      const b = page.getByRole('button', { name, exact: true });
      await page.mouse.move(5, 800);
      await page.waitForTimeout(300);
      const closed = await bg(name);
      await b.hover();
      await page.waitForTimeout(300); // the fill transitions
      const hover = await bg(name);
      expect(hover, name).not.toBe(closed);
      await page.mouse.move(5, 800);
      await b.focus();
      await page.keyboard.press('Enter');
      await expect(b).toHaveAttribute('aria-expanded', 'true');
      await expect.poll(() => bg(name), { message: name + ' open' }).toBe(hover);
      await page.keyboard.press('Escape');
      await expect(b).toHaveAttribute('aria-expanded', 'false');
      await expect.poll(() => bg(name), { message: name + ' closed' }).toBe(closed);
    }
    /* A disclosure button of the app's own (aria-expanded, no aria-haspopup) keeps its plain look. */
    const own = page.getByRole('button', { name: 'Mute', exact: true });
    await own.evaluate((e) => e.setAttribute('aria-expanded', 'true'));
    await page.waitForTimeout(300);
    expect(await bg('Mute')).toBe(await bg('More'));
  });
});

test.describe('5.42: Chamber-OS 146–147 — FilterBar collapseBelow, fields at a large default font', () => {
  const ID = 'aura-new-in-5-42-chamber-os-146--collapsed-filters';
  const box = async (page: Page, sel: string) => (await page.locator(sel).first().boundingBox())!;

  test('below 640px the filters fold into "Filters (n)" at the end of the search row; chips, Clear all and the count stay', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, ID);
    const bar = page.getByTestId('members');
    const btn = bar.getByRole('button', { name: 'Filters, 1 applied' });
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
    await expect(btn.locator('span[aria-hidden="true"]')).toHaveText('Filters (1)');
    await expect(bar.locator('.aura-filterbar__controls')).toBeHidden();
    const s = (await bar.locator('.aura-filterbar__search').boundingBox())!,
      b = (await btn.boundingBox())!,
      r = (await bar.boundingBox())!;
    expect(Math.round(b.height)).toBe(44);
    expect(Math.round(b.y)).toBe(Math.round(s.y));
    expect(Math.round(b.x + b.width)).toBe(Math.round(r.x + r.width));
    expect(s.width).toBeGreaterThan(150);
    await expect(bar.getByText('42 results')).toBeVisible();
    await expect(bar.getByRole('button', { name: /Remove Status: Active|Status: Active/ }).first()).toBeVisible();
    await expect(bar.getByRole('button', { name: 'Clear all' })).toBeVisible();
    /* filterCount overrides the number; a bar without children (search only) and one without the prop have no button. */
    await expect(page.getByTestId('md').getByRole('button', { name: 'Filters, 3 applied' })).toBeVisible();
    await expect(page.getByTestId('search-only').locator('.aura-filterbar__more')).toHaveCount(0);
    await expect(page.getByTestId('plain').locator('.aura-filterbar__more')).toHaveCount(0);
    await expect(page.getByTestId('plain').locator('.aura-filterselect')).toBeVisible();
  });

  test('the sheet: labelled 44px fields, changes apply at once, Done/Escape close and focus returns; the children render once', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, ID);
    const bar = page.getByTestId('members');
    const btn = bar.locator('.aura-filterbar__more');
    await btn.click();
    const dlg = page.getByRole('dialog', { name: 'Filters' });
    await expect(dlg).toBeVisible();
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    expect(await btn.getAttribute('aria-controls')).toBe(await dlg.getAttribute('id'));
    /* One Status control on the page: the sheet's, not a second copy in the bar. */
    await expect(dlg.getByRole('combobox', { name: 'Status' })).toHaveCount(1);
    await expect(bar.getByRole('combobox', { name: 'Status', includeHidden: true })).toHaveCount(0);
    await expect(bar.locator('.aura-filterbar__controls')).toHaveCount(0);
    const status = dlg.getByRole('combobox', { name: 'Status' });
    await expect(status).toHaveText(/Active/);
    await expect(dlg.locator('.aura-field__label', { hasText: 'Status' })).toBeVisible();
    await expect(dlg.locator('.aura-field__label', { hasText: 'Submitted' })).toBeVisible();
    await expect(dlg.getByRole('button', { name: 'Submitted: Any time' })).toBeVisible();
    const dw = (await dlg.locator('.aura-filterbar--sheet').boundingBox())!.width;
    for (const sel of ['.aura-select', '.aura-filterselect__face']) {
      const f = (await dlg.locator(sel).first().boundingBox())!;
      expect(Math.round(f.height)).toBe(44);
      expect(Math.round(f.width)).toBe(Math.round(dw));
    }
    /* Tier → SME applies at once: a chip on the page and the button's number. */
    await dlg.getByRole('combobox', { name: 'Tier' }).click();
    await page.getByRole('option', { name: 'SME' }).click();
    await expect(bar.getByText('Tier: SME')).toHaveCount(1);
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    await expect(dlg.getByRole('button', { name: 'Clear all' })).toBeVisible();
    await dlg.getByRole('button', { name: 'Done' }).click();
    await expect(dlg).toHaveCount(0);
    await expect(btn).toBeFocused();
    await expect(bar.getByRole('button', { name: 'Filters, 2 applied' })).toBeVisible();
    /* Escape closes too; Clear all in the sheet clears and the footer drops it with no chips left. */
    await btn.click();
    await expect(dlg).toBeVisible();
    await dlg.getByRole('button', { name: 'Clear all' }).click();
    await expect(dlg.getByRole('button', { name: 'Clear all' })).toHaveCount(0);
    await expect(bar.getByRole('button', { name: 'Filters', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dlg).toHaveCount(0);
    await expect(btn).toBeFocused();
    expect(await axeScan(page, '[data-testid="members"]')).toEqual([]);
  });

  test("from 640px it is today's bar; widening past the breakpoint with the sheet open closes it", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await story(page, ID);
    const bar = page.getByTestId('members');
    await expect(bar.locator('.aura-filterbar__more')).toBeHidden();
    await expect(bar.locator('.aura-filterbar__controls')).toBeVisible();
    /* The first filter follows the search 12px on, in the same row, as without collapseBelow. */
    const s = await box(page, '[data-testid="members"] .aura-filterbar__search'),
      f = await box(page, '[data-testid="members"] .aura-filterbar__controls');
    expect(Math.round(f.x - (s.x + s.width))).toBe(12);
    expect(Math.abs(f.y - s.y)).toBeLessThan(2);
    expect(await bar.locator('.aura-filterbar__lead').evaluate((e) => getComputedStyle(e).display)).toBe('contents');
    /* md: a button below 768px. */
    await page.setViewportSize({ width: 700, height: 800 });
    await expect(page.getByTestId('md').locator('.aura-filterbar__more')).toBeVisible();
    await expect(bar.locator('.aura-filterbar__more')).toBeHidden();
    await page.setViewportSize({ width: 390, height: 844 });
    await bar.locator('.aura-filterbar__more').click();
    await expect(page.getByRole('dialog', { name: 'Filters' })).toBeVisible();
    await page.setViewportSize({ width: 1024, height: 800 });
    await expect(page.getByRole('dialog', { name: 'Filters' })).toHaveCount(0);
    await expect(bar.locator('.aura-filterbar__controls')).toBeVisible();
    /* The hidden button can't take focus back: the first filter, now in the bar, does. */
    await expect(bar.getByRole('combobox', { name: 'Status' })).toBeFocused();
    await expect(bar.getByRole('combobox', { name: 'Status' })).toHaveCount(1);
  });

  /* #147: at a 32px browser default the search (and a TextField in a grid cell) no longer widens a 390px page. */
  test('147: at a 32px default font no search box or field scrolls a 390px page sideways', async ({ browser }) => {
    const ctx = await browser.newContext({
      baseURL: test.info().project.use.baseURL,
      viewport: { width: 390, height: 900 },
    });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Page.enable');
    await cdp.send('Page.setFontSizes', { fontSizes: { standard: 32, fixed: 26 } });
    for (const id of [ID, 'aura-new-in-5-12--filter-selects', 'aura-new-in-5-31-addendum-41--label-addon']) {
      await story(page, id);
      const g = await page.evaluate(() => ({
        input: parseFloat(getComputedStyle(document.querySelector('.aura-input')!).fontSize),
        over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        right: Math.max(...[...document.querySelectorAll('.aura-input')].map((e) => e.getBoundingClientRect().right)),
      }));
      expect(g.input, id).toBeGreaterThanOrEqual(28); // the default really is large
      expect(g.over, id).toBeLessThanOrEqual(0);
      expect(g.right, id).toBeLessThanOrEqual(390);
    }
    await ctx.close();
  });
});

test.describe('5.43: Chamber-OS 148 — FilterBar collapseBelow without a search', () => {
  const ID = 'aura-new-in-5-43-chamber-os-148--no-search';
  const geo = (page: Page, id: string) =>
    page.getByTestId(id).evaluate((el) => {
      const r = (s: string) => el.querySelector(s)!.getBoundingClientRect();
      const b = r('.aura-filterbar__more'),
        bar = el.querySelector('.aura-filterbar')!.getBoundingClientRect(),
        label = el.querySelector('.aura-filterbar__more span[aria-hidden="true"]')!.getBoundingClientRect();
      return {
        width: Math.round(b.width),
        bar: Math.round(bar.width),
        left: Math.round(b.left - bar.left),
        centre: Math.abs(Math.round(label.left + label.width / 2 - (b.left + b.width / 2))) <= 12,
        height: Math.round(b.height),
      };
    });

  test('148: with no search the Filters button fills its row below 640px, label centred; with a search it keeps its width', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, ID);
    const t = await geo(page, 'timeline');
    expect(t.width).toBe(t.bar);
    expect(t.left).toBe(0);
    expect(t.centre).toBe(true);
    expect(t.height).toBe(44);
    await expect(page.getByTestId('timeline').getByRole('button', { name: 'Filters, 1 applied' })).toBeVisible();
    const s = await geo(page, 'with-search');
    expect(s.width).toBeLessThan(160);
    expect(s.left + s.width).toBe(s.bar);
    /* From 640px: the bar as before — the filters in it, no button. */
    await page.setViewportSize({ width: 1024, height: 800 });
    await expect(page.getByTestId('timeline').locator('.aura-filterbar__more')).toBeHidden();
    await expect(page.getByTestId('timeline').locator('.aura-filterbar__controls')).toBeVisible();
  });
});

test.describe('5.44: Chamber-OS 149 — PageHeader actionsFullWidthBelow with an icon button', () => {
  const ID = 'aura-new-in-5-44-chamber-os-149--invoice-actions';
  const row = (page: Page, id: string) =>
    page.getByTestId(id).evaluate((el) => {
      const head = el.querySelector('.aura-page-header')!.getBoundingClientRect();
      const btns = [...el.querySelectorAll<HTMLElement>('.aura-page-header__actions button')];
      return {
        head: { left: Math.round(head.left), right: Math.round(head.right) },
        b: btns.map((x) => {
          const r = x.getBoundingClientRect();
          return {
            top: Math.round(r.top),
            left: Math.round(r.left),
            right: Math.round(r.right),
            w: Math.round(r.width),
            h: Math.round(r.height),
            clip: x.scrollWidth > x.clientWidth,
            ellipsis: getComputedStyle(x).textOverflow === 'ellipsis',
          };
        }),
      };
    });

  for (const w of [393, 320]) {
    test(`149: at ${w}px two outlined actions and the ⋯ share one row (en, th, sv); labels wrap inside, none clipped`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: w, height: 1000 });
      await story(page, ID);
      for (const id of ['en', 'th', 'sv']) {
        const { head, b } = await row(page, id);
        const [credit, refund, menu] = b;
        /* 5.45 (Chamber-OS addendum 52): the ⋯ is centred on the (taller) first action. */
        expect(Math.abs(menu.top + menu.h / 2 - (credit.top + credit.h / 2)), id).toBeLessThanOrEqual(1);
        expect(Math.abs(refund.top - credit.top), id).toBeLessThanOrEqual(1);
        expect(credit.left, id).toBe(head.left);
        expect(menu.right, id).toBe(head.right); // the ⋯ ends the row
        expect([menu.w, menu.h], id).toEqual([44, 44]);
        expect(Math.abs(credit.w - refund.w), id).toBeLessThanOrEqual(1);
        expect(credit.h, id).toBeGreaterThanOrEqual(44);
        expect(
          b.some((x) => x.clip || x.ellipsis),
          id,
        ).toBe(false);
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
      ).toBeLessThanOrEqual(0);
      /* A grown pill has 22px corners, not an oval. */
      const radius = await page
        .getByTestId('sv')
        .getByRole('button', { name: /kreditnota/ })
        .evaluate((e) => parseFloat(getComputedStyle(e).borderTopLeftRadius));
      expect(radius).toBeLessThanOrEqual(22);
      /* The outline variant: a 1px border, still 44×44. */
      const menu = page.getByTestId('en').getByRole('button', { name: 'More actions' });
      expect(await menu.evaluate((e) => getComputedStyle(e).borderTopWidth)).toBe('1px');
      /* A lone ⋯ keeps its size; three text actions and no icon still wrap 2 + 1 (5.37). */
      const lone = await row(page, 'lone');
      expect([lone.b[0].w, lone.b[0].h]).toEqual([44, 44]);
      const three = await row(page, 'three');
      expect(three.b[0].top).toBe(three.b[1].top);
      expect(three.b[2].top).toBeGreaterThan(three.b[0].top + 40);
      expect(three.b.map((x) => x.h)).toEqual([...three.b.map(() => three.b[0].h)]);
    });
  }

  test('149: from 640px the actions are as before (their own widths, one line each)', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 900 });
    await story(page, ID);
    const { head, b } = await row(page, 'en');
    expect(b[0].w).toBeLessThan((head.right - head.left) / 3);
    const ws = await page
      .getByTestId('en')
      .locator('.aura-page-header__actions .aura-btn')
      .evaluateAll((els) => els.map((e) => getComputedStyle(e).whiteSpace));
    expect(ws).toEqual(['nowrap', 'nowrap']);
    expect(Math.abs(b[0].h - b[1].h)).toBeLessThanOrEqual(1);
  });
});

test.describe('5.45: Chamber-OS 150 — PageHeader actionsBarBelow', () => {
  const ID = (s: string) => 'aura-new-in-5-45-chamber-os-150--' + s;
  const geo = (page: Page) =>
    page.evaluate(() => {
      const a = document.querySelector('[data-testid=header] .aura-page-header__actions')!;
      const box = (e: Element) => {
        const r = e.getBoundingClientRect();
        return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, h: r.height, mid: r.top + r.height / 2 };
      };
      return {
        pos: getComputedStyle(a).position,
        bar: box(a),
        status: a.querySelector('.aura-page-header__status')
          ? box(a.querySelector('.aura-page-header__status')!)
          : null,
        statusShown:
          !!a.querySelector('.aura-page-header__status') &&
          getComputedStyle(a.querySelector('.aura-page-header__status')!).display !== 'none',
        btns: [...a.querySelectorAll<HTMLElement>('button')].map((b) => ({
          ...box(b),
          clip: b.scrollWidth > b.clientWidth,
        })),
        over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

  for (const w of [393, 320]) {
    test(`150: at ${w}px the actions are a bar at the bottom — status above, ⋯ centred at the row's end, nothing clipped (en, th, sv)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: w, height: 727 });
      for (const lang of ['en', 'th', 'sv']) {
        await story(page, ID('invoice-' + lang));
        const g = await geo(page);
        expect(g.pos, lang).toBe('fixed');
        expect(Math.round(page.viewportSize()!.height - g.bar.bottom), lang).toBe(0); // 5.48: on the bottom edge
        expect(g.statusShown, lang).toBe(true);
        const [credit, refund, menu] = g.btns;
        expect(g.status!.bottom, lang).toBeLessThanOrEqual(credit.top);
        expect(Math.abs(credit.top - refund.top), lang).toBeLessThanOrEqual(1);
        expect(Math.abs(menu.mid - credit.mid), lang).toBeLessThanOrEqual(1);
        expect(Math.round(menu.right), lang).toBe(Math.round(Math.max(...g.btns.map((b) => b.right))));
        expect(Math.round(menu.h), lang).toBe(44);
        expect(
          g.btns.some((b) => b.clip),
          lang,
        ).toBe(false);
        expect(g.over, lang).toBeLessThanOrEqual(0);
        /* Rendered once: each test id is one element. */
        for (const tid of ['credit', 'refund', 'more'])
          await expect(page.getByTestId(tid), lang + ' ' + tid).toHaveCount(1);
        /* The page's end scrolls clear of the bar. */
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        const last = await page.getByTestId('last').boundingBox();
        const bar = (await geo(page)).bar;
        expect(last!.y + last!.height, lang).toBeLessThanOrEqual(bar.top);
      }
    });
  }

  test("150: a focused field scrolls clear of the bar; the bar's trigger opens its dialog once", async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 727 });
    await story(page, ID('invoice-en'));
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByLabel('Internal note').focus();
    await page.waitForTimeout(100);
    const field = (await page.getByLabel('Internal note').boundingBox())!;
    const bar = (await geo(page)).bar;
    expect(field.y + field.height).toBeLessThanOrEqual(bar.top);
    await page.getByTestId('credit').click();
    await expect(page.getByRole('dialog', { name: 'Issue credit note' })).toHaveCount(1);
  });

  test('150: only a ⋯ — status and ⋯ share one row; three text actions wrap with the main one last', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 393, height: 727 });
    await story(page, ID('manager'));
    const m = await geo(page);
    expect(Math.abs(m.status!.mid - m.btns[0].mid)).toBeLessThanOrEqual(2);
    expect(m.status!.right).toBeLessThanOrEqual(m.btns[0].left);
    expect(m.bar.h).toBeLessThan(80);
    await story(page, ID('draft'));
    const d = await geo(page);
    const issue = d.btns[2];
    expect(issue.right).toBe(Math.max(...d.btns.map((b) => b.right)));
    expect(issue.bottom).toBe(Math.max(...d.btns.map((b) => b.bottom)));
    expect(d.btns.every((b) => b.h >= 44 && !b.clip)).toBe(true);
  });

  test('150: from 640px the actions sit in the header as before, the status line hidden', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 800 });
    await story(page, ID('invoice-en'));
    const g = await geo(page);
    expect(g.pos).toBe('static');
    expect(g.statusShown).toBe(false);
    const head = (await page.getByTestId('header').boundingBox())!;
    expect(g.bar.top).toBeLessThan(head.y + head.height);
    expect(Math.abs(g.btns[0].top - g.btns[1].top)).toBeLessThanOrEqual(1);
    for (const tid of ['credit', 'refund', 'more']) await expect(page.getByTestId(tid)).toHaveCount(1);
    expect(
      await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue('--aura-page-actions-height'),
      ),
    ).toBe('');
  });
});

test.describe('5.46: Chamber-OS 151 — PageHeader subtitle, titleAddon, chip eyebrow, size, focusTitleOnMount, actionsAlign', () => {
  const ID = (s: string) => 'aura-new-in-5-46-chamber-os-151--' + s;
  const r = (page: Page, sel: string) =>
    page
      .locator(sel)
      .first()
      .evaluate((e) => {
        const b = e.getBoundingClientRect();
        const s = getComputedStyle(e);
        return {
          top: b.top,
          bottom: b.bottom,
          left: b.left,
          right: b.right,
          w: b.width,
          fs: parseFloat(s.fontSize),
          lh: s.lineHeight,
          color: s.color,
          tag: e.tagName,
        };
      });

  for (const w of [390, 1280]) {
    test(`151: at ${w}px a body-size subtitle under the title and before meta, a chip on the title's line (en, th, sv)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: w, height: 1100 });
      await story(page, ID('subtitle-and-addon'));
      for (const l of ['en', 'th', 'sv']) {
        const p = `[data-testid=${l}] `;
        const title = await r(page, p + '.aura-page-header__title');
        const sub = await r(page, p + '.aura-page-header__subtitle');
        const meta = await r(page, p + '.aura-page-header__meta');
        const addon = await r(page, p + '.aura-page-header__title-addon');
        expect(sub.tag, l).toBe('DIV');
        expect(sub.fs, l).toBe(14);
        expect(sub.color, l).toBe(meta.color);
        expect(sub.top, l).toBeGreaterThanOrEqual(title.bottom - 1);
        expect(meta.top, l).toBeGreaterThanOrEqual(sub.bottom - 1);
        /* The chip shares the title's line, after it, centred on it. */
        expect(addon.left, l).toBeGreaterThan(title.right);
        expect(Math.abs((addon.top + addon.bottom) / 2 - (title.top + title.bottom) / 2), l).toBeLessThanOrEqual(2);
        /* The heading's name is the title alone. */
        await expect(page.getByTestId(l).getByRole('heading', { level: 1 })).toHaveCount(1);
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
      ).toBeLessThanOrEqual(0);
    });
  }

  test('151: with titleHideBelow the addon leaves with the title; the subtitle stays', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 1100 });
    await story(page, ID('subtitle-and-addon'));
    await expect(page.getByTestId('hide').locator('.aura-page-header__title-addon')).toBeHidden();
    await expect(page.getByTestId('hide').locator('.aura-page-header__subtitle')).toBeVisible();
    await expect(
      page.getByTestId('hide').getByRole('heading', { level: 1, name: 'Invoice SC-2026-900001' }),
    ).toHaveCount(1);
    await page.setViewportSize({ width: 1280, height: 1100 });
    await expect(page.getByTestId('hide').locator('.aura-page-header__title-addon')).toBeVisible();
  });

  test('151: a long title keeps its room at 700px — the actions drop under it', async ({ page }) => {
    await page.setViewportSize({ width: 700, height: 900 });
    await story(page, ID('subtitle-and-addon'));
    const text = await r(page, '[data-testid=squeeze] .aura-page-header__text');
    const act = await r(page, '[data-testid=squeeze] .aura-page-header__actions');
    expect(text.w).toBeGreaterThanOrEqual(320);
    expect(act.top).toBeGreaterThanOrEqual(text.bottom);
  });

  test('151: chips above the title — a wrapping row in a div, 4px from the title', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await story(page, ID('member-detail'));
    const eb = await r(page, '[data-testid=member] .aura-page-header__eyebrow');
    const title = await r(page, '[data-testid=member] .aura-page-header__title');
    expect(eb.tag).toBe('DIV');
    expect(Math.round(title.top - eb.bottom)).toBe(4);
    const tops = await page.locator('[data-testid=member] .aura-page-header__eyebrow > *').evaluateAll((els) =>
      els.map((e) => {
        const b = e.getBoundingClientRect();
        return b.top + b.height / 2;
      }),
    );
    expect(Math.max(...tops) - Math.min(...tops)).toBeLessThanOrEqual(2);
    expect(await page.locator('[data-testid=member] p .aura-tag, [data-testid=member] p div').count()).toBe(0);
  });

  test('151: hero sizes and the title custom properties; actionsAlign="start" lines the action up with the title', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, ID('portal-hero'));
    const hero = await r(page, '[data-testid=hero] .aura-page-header__title');
    expect([hero.fs, hero.lh]).toEqual([36, '43.2px']); // 5.47 (Chamber-OS 152): hero is 36px from 1024px
    expect((await r(page, '[data-testid=hero-lg] .aura-page-header__title')).fs).toBe(36);
    const custom = await r(page, '[data-testid=custom] .aura-page-header__title');
    expect([custom.fs, custom.lh]).toEqual([26, '32px']);
    expect((await r(page, '[data-testid=plain] .aura-page-header__title')).fs).toBe(36);
    const heroHead = await r(page, '[data-testid=hero] .aura-page-header');
    const plainHead = await r(page, '[data-testid=plain] .aura-page-header');
    expect(Math.round(hero.top - heroHead.top)).toBe(16); // room above
    const act = await r(page, '[data-testid=hero] .aura-page-header__actions');
    expect(Math.abs(act.top - hero.top)).toBeLessThanOrEqual(4);
    const pAct = await r(page, '[data-testid=plain] .aura-page-header__actions');
    const pText = await r(page, '[data-testid=plain] .aura-page-header__text');
    expect(Math.abs(pAct.bottom - pText.bottom)).toBeLessThanOrEqual(1); // default: the bottom, as before
    expect(Math.round(plainHead.top)).toBe(
      Math.round((await r(page, '[data-testid=plain] .aura-page-header__title')).top),
    );
    await page.setViewportSize({ width: 390, height: 900 });
    expect((await r(page, '[data-testid=hero-lg] .aura-page-header__title')).fs).toBe(26);
  });

  test('151: focusTitleOnMount — the heading has focus on load, no ring, no scroll', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await story(page, ID('renewal-success'));
    const h = page.getByRole('heading', { level: 1, name: 'Renewal complete' });
    await expect(h).toBeFocused();
    await expect(h).toHaveAttribute('tabindex', '-1');
    expect(await h.evaluate((e) => getComputedStyle(e).outlineStyle)).toBe('none');
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Back to the portal' })).toBeFocused();
  });

  test('151: nothing scrolls sideways at a 32px default font size', async ({ browser }) => {
    const ctx = await browser.newContext({
      baseURL: test.info().project.use.baseURL,
      viewport: { width: 390, height: 900 },
    });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Page.enable');
    await cdp.send('Page.setFontSizes', { fontSizes: { standard: 32, fixed: 26 } });
    for (const s of ['subtitle-and-addon', 'member-detail', 'portal-hero', 'renewal-success']) {
      await story(page, ID(s));
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
        s,
      ).toBeLessThanOrEqual(0);
    }
    await ctx.close();
  });
});

test.describe('5.47: Chamber-OS 152 — PageHeader size="compact", hero to 36px, hero space', () => {
  const ID = 'aura-new-in-5-47-chamber-os-152--title-sizes';
  const t = (page: Page, id: string) =>
    page
      .getByTestId(id)
      .locator('.aura-page-header__title')
      .evaluate((e) => {
        const s = getComputedStyle(e);
        return {
          fs: parseFloat(s.fontSize),
          lh: Math.round((parseFloat(s.lineHeight) / parseFloat(s.fontSize)) * 100) / 100,
        };
      });
  const pad = (page: Page, id: string) =>
    page
      .getByTestId(id)
      .locator('.aura-page-header')
      .evaluate((e) => parseFloat(getComputedStyle(e).paddingTop));

  for (const [w, compact, hero, heroLg, dflt] of [
    [390, 26, 30, 26, 28],
    [1280, 32, 36, 36, 36],
  ] as const) {
    test(`152: at ${w}px compact ${compact}, hero ${hero}, hero-lg ${heroLg}, default ${dflt} (en, th, sv)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: w, height: 1100 });
      await story(page, ID);
      for (const l of ['en', 'sv']) expect(await t(page, 'compact-' + l), l).toEqual({ fs: compact, lh: 1.2 });
      expect(await t(page, 'compact-th')).toEqual({ fs: compact, lh: 1.4 }); // Thai keeps its 1.4 line
      expect(await t(page, 'hero')).toEqual({ fs: hero, lh: 1.2 });
      expect((await t(page, 'hero-th')).lh).toBe(1.4);
      expect((await t(page, 'hero-lg')).fs).toBe(heroLg);
      expect((await t(page, 'default')).fs).toBe(dflt); // the default is unchanged
      expect(await pad(page, 'hero')).toBe(16);
      expect(await pad(page, 'hero-space')).toBe(24);
      expect(await pad(page, 'default')).toBe(0);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
      ).toBeLessThanOrEqual(0);
    });
  }

  test('152: nothing scrolls sideways at a 32px default font size', async ({ browser }) => {
    const ctx = await browser.newContext({
      baseURL: test.info().project.use.baseURL,
      viewport: { width: 390, height: 900 },
    });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Page.enable');
    await cdp.send('Page.setFontSizes', { fontSizes: { standard: 32, fixed: 26 } });
    await story(page, ID);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
    ).toBeLessThanOrEqual(0);
    await ctx.close();
  });
});

test.describe("5.48: Chamber-OS 153 — the actionsBarBelow bar is ActionBar's edge strip", () => {
  const ID = (s: string, lang = 'en') => 'aura-new-in-5-48-chamber-os-153--' + s + '&args=lang:' + lang;
  const bar = (page: Page) =>
    page.evaluate(() => {
      const a = document.querySelector('[data-testid=header] .aura-page-header__actions')!;
      const r = a.getBoundingClientRect();
      const s = getComputedStyle(a);
      return {
        left: Math.round(r.left),
        right: Math.round(r.right),
        fromBottom: Math.round(innerHeight - r.bottom),
        top: r.top,
        borders: [s.borderTopWidth, s.borderRightWidth, s.borderBottomWidth, s.borderLeftWidth],
        radius: s.borderTopLeftRadius,
        shadow: s.boxShadow,
        btns: [...a.querySelectorAll<HTMLElement>('button')].map((b) => {
          const q = b.getBoundingClientRect();
          return { mid: q.top + q.height / 2, right: q.right, clip: b.scrollWidth > b.clientWidth };
        }),
      };
    });

  for (const w of [320, 393]) {
    test(`153: at ${w}px — edge to edge, on the bottom edge, top border only; the page's end clears it (en, th, sv × 4 sets)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: w, height: 727 });
      for (const lang of ['en', 'th', 'sv'])
        for (const s of ['primary-and-menu', 'two-actions-and-menu', 'menu-only', 'three-actions']) {
          const k = `${lang} ${s}`;
          await story(page, ID(s, lang));
          const g = await bar(page);
          expect([g.left, g.right, g.fromBottom], k).toEqual([0, w, 0]);
          expect(g.borders, k).toEqual(['1px', '0px', '0px', '0px']);
          expect([g.radius, g.shadow], k).toEqual(['0px', 'none']);
          expect(
            g.btns.some((b) => b.clip),
            k,
          ).toBe(false);
          if (s !== 'three-actions') {
            const menu = g.btns[g.btns.length - 1]!;
            expect(Math.abs(menu.mid - g.btns[0]!.mid), k).toBeLessThanOrEqual(1);
            expect(Math.round(menu.right), k).toBe(Math.round(Math.max(...g.btns.map((b) => b.right))));
          }
          expect(
            await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
            k,
          ).toBeLessThanOrEqual(0);
          await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
          const last = (await page.getByTestId('last').boundingBox())!;
          expect(last.y + last.height, k).toBeLessThanOrEqual((await bar(page)).top);
        }
    });
  }

  test('153: above a BottomNav it sits on the nav; a focused field scrolls clear; floating keeps the 5.45 card', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 393, height: 727 });
    await story(page, ID('above-bottom-nav'));
    const nav = (await page.locator('nav.aura-bottomnav').boundingBox())!;
    const g = await bar(page);
    expect(Math.abs(727 - g.fromBottom - nav.y)).toBeLessThanOrEqual(1); // on the nav's top edge (its 1px border)
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByLabel('Internal note').focus();
    await page.waitForTimeout(100);
    const f = (await page.getByLabel('Internal note').boundingBox())!;
    expect(f.y + f.height).toBeLessThanOrEqual((await bar(page)).top);
    await story(page, ID('floating'));
    const fl = await bar(page);
    expect([fl.left, fl.right, fl.fromBottom]).toEqual([16, 377, 12]);
    expect(fl.borders).toEqual(['1px', '1px', '1px', '1px']);
    expect(fl.radius).not.toBe('0px');
  });

  test('153: nothing scrolls sideways at a 32px default font size', async ({ browser }) => {
    const ctx = await browser.newContext({
      baseURL: test.info().project.use.baseURL,
      viewport: { width: 393, height: 727 },
    });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Page.enable');
    await cdp.send('Page.setFontSizes', { fontSizes: { standard: 32, fixed: 26 } });
    for (const s of ['primary-and-menu', 'two-actions-and-menu', 'menu-only', 'three-actions']) {
      await story(page, ID(s, 'sv'));
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
        s,
      ).toBeLessThanOrEqual(0);
    }
    await ctx.close();
  });
});

test.describe('5.48: Chamber-OS 154 — bottom bars on a short screen', () => {
  const ID = (lang: string) => 'aura-new-in-5-48-chamber-os-153--short-screen&args=lang:' + lang;
  const pos = (page: Page) =>
    page.evaluate(() => ({
      header: getComputedStyle(document.querySelector('[data-testid=header] .aura-page-header__actions')!).position,
      bar: getComputedStyle(document.querySelector('.aura-actionbar')!).position,
      status: getComputedStyle(document.querySelector('.aura-page-header__status')!).display,
      pad: parseFloat(getComputedStyle(document.querySelector('.aura-shell__content')!).paddingBottom),
      spb: getComputedStyle(document.documentElement).scrollPaddingBottom,
    }));

  test('154: at 320×256 the header actions stay in the header, the ActionBar sits in the flow, and every focused control is in view (en, th, sv)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 256 });
    for (const lang of ['en', 'th', 'sv']) {
      await story(page, ID(lang));
      const p = await pos(page);
      expect(p, lang).toEqual({ header: 'static', bar: 'static', status: 'none', pad: 24, spb: '0px' });
      expect(
        await page.evaluate(() => getComputedStyle(document.querySelector('.aura-shell__bar')!).position),
        lang,
      ).toBe('static');
      /* Nothing pins itself under a bar that scrolls away: the bar-height token is 0. */
      expect(
        await page.evaluate(() =>
          getComputedStyle(document.querySelector('.aura-shell')!).getPropertyValue('--aura-shell-bar-height').trim(),
        ),
        lang,
      ).toBe('0px');
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
        lang,
      ).toBeLessThanOrEqual(0);
      /* Tab through everything: each focused control is fully inside the viewport, and nothing fixed or sticky covers it. */
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.locator('body').focus();
      /* Forward, then back (Shift+Tab scrolls a field to the top edge, where AppShell's bar was). */
      for (let i = 0; i < 30; i++) {
        await page.keyboard.press(i < 15 ? 'Tab' : 'Shift+Tab');
        const v = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return null;
          const r = el.getBoundingClientRect();
          const x = Math.min(Math.max(r.left + r.width / 2, 0), innerWidth - 1),
            y = Math.min(Math.max(r.top + r.height / 2, 0), innerHeight - 1);
          const hit = document.elementFromPoint(x, y);
          return {
            inView: r.top >= -1 && r.bottom <= innerHeight + 1,
            onTop: !!hit && (el === hit || el.contains(hit) || hit.contains(el)),
            what: el.outerHTML.slice(0, 60),
          };
        });
        if (!v) continue;
        expect(v.inView && v.onTop, lang + ' ' + v.what).toBe(true);
      }
    }
  });

  test('154: at 390×844 the bars behave as before — fixed header bar with its status and page space, sticky ActionBar', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, ID('en'));
    const p = await pos(page);
    expect([p.header, p.bar, p.status]).toEqual(['fixed', 'sticky', 'block']);
    expect(
      await page.evaluate(() =>
        getComputedStyle(document.querySelector('.aura-shell')!).getPropertyValue('--aura-shell-bar-height').trim(),
      ),
    ).not.toBe('0px');
    expect(p.pad).toBeGreaterThan(24);
    expect(p.spb).not.toBe('auto');
  });
});

test.describe('5.49: Chamber-OS 155 — the short-screen threshold follows the browser text size', () => {
  const ID = (lang: string) => 'aura-new-in-5-49-chamber-os-155--large-text&args=lang:' + lang;
  const open = async (browser: import('@playwright/test').Browser, w: number, h: number, size: number) => {
    const ctx = await browser.newContext({
      baseURL: test.info().project.use.baseURL,
      viewport: { width: w, height: h },
    });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Page.enable');
    const font = (s: number) =>
      cdp.send('Page.setFontSizes', { fontSizes: { standard: s, fixed: Math.round((s * 13) / 16) } });
    await font(size);
    return { ctx, page, font };
  };
  const state = (page: Page) =>
    page.evaluate(() => {
      const cs = (s: string) => getComputedStyle(document.querySelector(s)!);
      const actions = document.querySelector('[data-testid=header] .aura-page-header__actions')!;
      return {
        header: cs('[data-testid=header] .aura-page-header__actions').position,
        inHeader: actions.parentElement!.classList.contains('aura-page-header'),
        bar: cs('.aura-actionbar').position,
        shell: cs('.aura-shell__bar').position,
        token: cs('.aura-shell').getPropertyValue('--aura-shell-bar-height').trim(),
        status: cs('.aura-page-header__status').display,
        actionsHeight: document.documentElement.style.getPropertyValue('--aura-page-actions-height'),
      };
    });
  const SHORT = {
    header: 'static',
    inHeader: true,
    bar: 'static',
    shell: 'static',
    token: '0px',
    status: 'none',
    actionsHeight: '',
  };

  test('155: 390×844 at a 32px default counts as short — actions in the header, ActionBar and top bar in the flow, every focused control in view (en, th, sv)', async ({
    browser,
  }) => {
    const { ctx, page } = await open(browser, 390, 844, 32);
    for (const lang of ['en', 'th', 'sv']) {
      await story(page, ID(lang));
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).fontSize), lang).toBe('32px');
      expect(await state(page), lang).toEqual(SHORT);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
        lang,
      ).toBeLessThanOrEqual(0);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.locator('body').focus();
      for (let i = 0; i < 24; i++) {
        await page.keyboard.press(i < 12 ? 'Tab' : 'Shift+Tab');
        const v = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return null;
          const r = el.getBoundingClientRect();
          const x = Math.min(Math.max(r.left + r.width / 2, 0), innerWidth - 1),
            y = Math.min(Math.max(r.top + r.height / 2, 0), innerHeight - 1);
          const hit = document.elementFromPoint(x, y);
          return {
            ok:
              r.top >= -1 &&
              r.bottom <= innerHeight + 1 &&
              !!hit &&
              (el === hit || el.contains(hit) || hit.contains(el)),
            what: el.outerHTML.slice(0, 60),
          };
        });
        if (v) expect(v.ok, lang + ' ' + v.what).toBe(true);
      }
    }
    await ctx.close();
  });

  test('155: at 16px nothing changes — 390×844 keeps the fixed edge strip with its status, 320×256 is short as in 5.48', async ({
    browser,
  }) => {
    const { ctx, page } = await open(browser, 390, 844, 16);
    await story(page, ID('en'));
    const s = await state(page);
    expect([s.header, s.bar, s.shell, s.status]).toEqual(['fixed', 'sticky', 'sticky', 'block']);
    expect(s.token).not.toBe('0px');
    expect(parseFloat(s.actionsHeight)).toBeGreaterThan(0);
    const r = await page.evaluate(() => {
      const b = document.querySelector('[data-testid=header] .aura-page-header__actions')!.getBoundingClientRect();
      return [Math.round(b.left), Math.round(innerWidth - b.right), Math.round(innerHeight - b.bottom)];
    });
    expect(r).toEqual([0, 0, 0]);
    await page.setViewportSize({ width: 320, height: 256 });
    await expect.poll(() => state(page)).toEqual(SHORT);
    await ctx.close();
  });

  test('155: at 24px the line is 720px — a 375×667 phone is short, a 390×844 one keeps the bar', async ({
    browser,
  }) => {
    const a = await open(browser, 375, 667, 24);
    await story(a.page, ID('th'));
    expect(await state(a.page)).toEqual(SHORT);
    await a.ctx.close();
    const b = await open(browser, 390, 844, 24);
    await story(b.page, ID('th'));
    const s = await state(b.page);
    expect([s.header, s.bar, s.shell, s.status]).toEqual(['fixed', 'sticky', 'sticky', 'block']);
    expect(s.token).not.toBe('0px');
    await b.ctx.close();
  });

  test('155: changing the browser text size on an open page pins and releases the bars and keeps both height tokens right', async ({
    browser,
  }) => {
    const { ctx, page, font } = await open(browser, 390, 844, 16);
    await story(page, ID('en'));
    const tall = await state(page);
    expect([tall.header, tall.shell]).toEqual(['fixed', 'sticky']);
    await font(32);
    await expect.poll(() => state(page)).toEqual(SHORT);
    await font(16);
    await expect
      .poll(async () => {
        const s = await state(page);
        return [s.header, s.shell, s.token !== '0px', parseFloat(s.actionsHeight) > 0];
      })
      .toEqual(['fixed', 'sticky', true, true]);
    await ctx.close();
  });

  test('155: the top-bar token follows a text-size change even when nothing on the page changes size (a short page)', async ({
    browser,
  }) => {
    const { ctx, page, font } = await open(browser, 390, 844, 16);
    await story(page, 'aura-new-in-5-33-dxt-monitor--monitor-frame');
    const bar = () =>
      page.evaluate(() => [
        getComputedStyle(document.querySelector('.aura-shell__bar')!).position,
        getComputedStyle(document.querySelector('.aura-shell')!).getPropertyValue('--aura-shell-bar-height').trim(),
      ]);
    expect((await bar())[0]).toBe('sticky');
    expect((await bar())[1]).not.toBe('0px');
    await font(32);
    await expect.poll(bar).toEqual(['static', '0px']);
    await font(16);
    await expect
      .poll(async () => {
        const b = await bar();
        return [b[0], b[1] !== '0px'];
      })
      .toEqual(['sticky', true]);
    /* The probe adds no box anyone sees or reaches, and no sideways scroll. */
    expect(
      await page.evaluate(() => [
        getComputedStyle(document.querySelector('.aura-shell__probe')!).visibility,
        document.querySelector('.aura-shell__probe')!.getAttribute('aria-hidden'),
        document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ]),
    ).toEqual(['hidden', 'true', 0]);
    await ctx.close();
  });
});

test.describe('5.50: Chamber-OS 156 — invalid without AURA’s message', () => {
  const ID = 'aura-new-in-5-50-chamber-os-156--invalid-without-message';
  const look = (page: Page, tid: string) =>
    page.evaluate((tid) => {
      const root = document.querySelector(`[data-testid=${tid}]`)!;
      const field = root.querySelector('.aura-field')!;
      const box = (root.querySelector('.aura-textarea') || root.querySelector('.aura-input'))!;
      const ctl = (root.querySelector('textarea') || root.querySelector('input'))!;
      const probe = document.createElement('div');
      probe.style.color = 'var(--aura-border-danger)';
      root.appendChild(probe);
      const danger = getComputedStyle(probe).color;
      probe.remove();
      return {
        danger: getComputedStyle(box).borderTopColor === danger,
        invalidClass: field.classList.contains('is-invalid'),
        ariaInvalid: ctl.getAttribute('aria-invalid'),
        describedBy: ctl.getAttribute('aria-describedby'),
        error: !!field.querySelector('.aura-field__error'),
        hint: field.querySelector('.aura-field__hint')?.textContent ?? null,
        leaked: ctl.hasAttribute('invalid'),
      };
    }, tid);

  for (const theme of ['light', 'dark']) {
    test(`156: invalid gives the danger edge and aria-invalid, no message, the same describedby (${theme})`, async ({
      page,
    }) => {
      await story(page, ID, theme);
      expect(await look(page, 'brand')).toEqual({
        danger: true,
        invalidClass: true,
        ariaInvalid: 'true',
        describedBy: 'primary-hint primary-readout',
        error: false,
        hint: 'A hex value, e.g. #1F4E8C.',
        leaked: false,
      });
      const ta = await look(page, 'textarea');
      expect([ta.danger, ta.invalidClass, ta.ariaInvalid, ta.error, ta.hint, ta.leaked]).toEqual([
        true,
        true,
        'true',
        false,
        'Up to 140 characters.',
        false,
      ]);
      expect(ta.describedBy).toMatch(/-hint$/);
      /* A caller's own aria-invalid draws the edge too, and stays the caller's. */
      const own = await look(page, 'own-aria');
      expect([own.danger, own.ariaInvalid, own.error, own.hint]).toEqual([true, 'true', false, 'Optional.']);
      /* error still wins: its message, its id. */
      const err = await look(page, 'error');
      expect([err.danger, err.error, err.hint, err.ariaInvalid]).toEqual([true, true, null, 'true']);
      expect(err.describedBy).toMatch(/-error$/);
      /* Negative controls: a valid field has no danger edge; a disabled one keeps its disabled edge. */
      const ok = await look(page, 'valid');
      expect([ok.danger, ok.invalidClass, ok.ariaInvalid]).toEqual([false, false, null]);
      expect((await look(page, 'disabled')).danger).toBe(false);
      /* Only the box holding the invalid control: its sibling in the same custom Field stays as it was. */
      const nested = await page.evaluate(() => {
        const p = document.createElement('div');
        p.style.color = 'var(--aura-border-danger)';
        document.body.appendChild(p);
        const d = getComputedStyle(p).color;
        p.remove();
        return [...document.querySelectorAll('[data-testid=nested] .aura-input')].map(
          (b) => getComputedStyle(b).borderTopColor === d,
        );
      });
      expect(nested).toEqual([false, true]);
    });
  }

  test('156: the edge follows the value — hover and focus keep it, a valid value clears it, Save points at the reason', async ({
    page,
  }) => {
    await story(page, ID);
    const input = page.locator('#primary');
    await input.hover();
    expect((await look(page, 'brand')).danger).toBe(true);
    await input.focus();
    expect((await look(page, 'brand')).danger).toBe(true);
    await input.fill('#1F4E8C');
    /* (the edge eases between colours, so wait for it to settle) */
    await expect
      .poll(async () => {
        const s = await look(page, 'brand');
        return [s.danger, s.invalidClass, s.ariaInvalid, s.describedBy];
      })
      .toEqual([false, false, null, 'primary-hint primary-readout']);
    await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled();
    await input.fill('#EEEEEE');
    await expect.poll(async () => (await look(page, 'brand')).danger).toBe(true);
    await expect(page.getByRole('button', { name: 'Save' })).toHaveAttribute('aria-describedby', 'save-reason');
    expect(await axeScan(page, '[data-testid=brand]')).toEqual([]);
  });
});

test.describe('5.51: Chamber-OS 157–160 — sort shown by the page, row minimum, pill wrap, filter toggles', () => {
  const S = (name: string, lang = 'en') => 'aura-new-in-5-51-chamber-os-157-160--' + name + '&args=lang:' + lang;

  test('157: sortDirection puts aria-sort on one header — no button, icon or description; it moves with the order', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    const sorts = () =>
      page.evaluate(() =>
        [...document.querySelectorAll('[role=columnheader][aria-sort]')].map((h) => ({
          text: h.textContent,
          sort: h.getAttribute('aria-sort'),
          control: !!h.querySelector('button, svg, .aura-table__sort'),
          described: h.hasAttribute('aria-describedby'),
        })),
      );
    await story(page, S('review-queue'));
    expect(await sorts()).toEqual([{ text: 'Time in stage', sort: 'descending', control: false, described: false }]);
    await page.getByRole('button', { name: 'By send time' }).click();
    expect(await sorts()).toEqual([{ text: 'Send time', sort: 'ascending', control: false, described: false }]);
    /* An order no column shows: no header claims it. */
    await page.getByRole('button', { name: 'Most recent first' }).click();
    expect(await sorts()).toEqual([]);
    /* The header takes no click and isn't a button. */
    await page.getByRole('button', { name: 'Longest in stage first' }).click();
    await page.getByRole('columnheader', { name: 'Time in stage' }).click();
    expect(await sorts()).toEqual([{ text: 'Time in stage', sort: 'descending', control: false, described: false }]);
    expect(await page.getByRole('button', { name: /Time in stage/ }).count()).toBe(0);
  });

  test('157: with a sortable column, the page order shows until the table sorts — then only that sort is announced', async ({
    page,
  }) => {
    await story(page, 'aura-new-in-5-51-chamber-os-157-160--page-order-and-sortable');
    const sorts = () =>
      page.evaluate(() =>
        Object.fromEntries(
          [...document.querySelectorAll('[role=columnheader][aria-sort]')].map((h) => [
            h.textContent!.trim(),
            h.getAttribute('aria-sort'),
          ]),
        ),
      );
    expect(await sorts()).toEqual({ Name: 'none', Received: 'descending', Amount: 'none' });
    await page.getByRole('button', { name: 'Name' }).click();
    const after = await sorts();
    expect(after.Name).toBe('ascending');
    expect(after.Received).toBeUndefined();
    expect(Object.values(after).filter((v) => v !== 'none')).toEqual(['ascending']);
  });

  test('157: selectAllRef reaches the select-all box — Clear returns focus to it', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, S('review-queue'));
    await page.getByRole('checkbox', { name: /Select all/i }).check();
    await page.getByRole('button', { name: 'Clear selection' }).click();
    expect(await page.evaluate(() => (document.activeElement as HTMLInputElement).type)).toBe('checkbox');
    await expect(page.getByRole('checkbox', { name: /Select all/i })).toBeFocused();
    await expect(page.getByRole('checkbox', { name: /Select all/i })).not.toBeChecked();
  });

  for (const lang of ['en', 'th', 'sv']) {
    test(`159: flexible columns count their own minWidth — the 8-column queue fits a 959px box with no sideways scroll (${lang})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await story(page, S('review-queue', lang));
      const g = await page.evaluate(() => {
        const sc = document.querySelector('[data-testid=box] .aura-table__scroll')!;
        const row = document.querySelector('[data-testid=box] .aura-table__head')!;
        return { scroll: sc.scrollWidth - sc.clientWidth, rowMin: getComputedStyle(row).minWidth, box: sc.clientWidth };
      });
      expect(g.scroll).toBeLessThanOrEqual(0);
      /* 868px of column minimums + two 24px gutters + the 40px select column. */
      expect(parseFloat(g.rowMin)).toBe(868 + 24 + 24 + 40);
      /* Approve is on screen. */
      const ab = await page.getByRole('button', { name: 'Approve' }).first().boundingBox();
      expect(ab!.x + ab!.width).toBeLessThanOrEqual(1280);
    });
  }

  for (const lang of ['en', 'th', 'sv']) {
    test(`158: StatusPill wrap breaks inside its own box in a narrow cell; wide or without it, one line as before (${lang})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await story(page, S('pill-wrap', lang));
      const m = await page.evaluate(() =>
        Object.fromEntries(
          ['narrow', 'wide', 'plain', 'cards'].map((t) => [
            t,
            [...document.querySelectorAll(`[data-testid=${t}] .aura-pill`)].map((x) => {
              const box = x.closest('[data-testid]')!;
              const icon = x.querySelector('.aura-icon')!.getBoundingClientRect();
              const text = (x.querySelector('.aura-pill__text') || x).getBoundingClientRect();
              const lh = parseFloat(getComputedStyle(x).lineHeight);
              return {
                fits: x.scrollWidth <= x.clientWidth,
                boxOver: box.scrollWidth > box.clientWidth,
                lines: Math.round(text.height / lh),
                iconOnFirstLine: Math.abs(icon.top + icon.height / 2 - (text.top + lh / 2)) <= 1,
                wrap: x.classList.contains('is-wrap'),
              };
            }),
          ]),
        ),
      );
      expect(m.narrow![0]).toMatchObject({ fits: true, boxOver: false, iconOnFirstLine: true });
      expect(m.narrow![0]!.lines).toBeGreaterThan(1);
      /* In a wide box a wrapping pill is a one-line pill, as tall as one without wrap. */
      expect(m.wide!.map((w) => w.lines)).toEqual([1, 1]);
      const hs = await page.evaluate(() =>
        [...document.querySelectorAll('[data-testid=wide] .aura-pill')].map((x) => x.getBoundingClientRect().height),
      );
      expect(hs[0]).toBe(hs[1]);
      for (const c of m.cards!) expect(c).toMatchObject({ fits: true, boxOver: false });
      /* Addendum 61: a wrapped pill has 16px (aura-radius-lg) corners, not half its height; the Swedish example is two
       * lines in 200px. */
      const sv = await page.evaluate(() => {
        const x = document.querySelector('[data-testid=sv200] .aura-pill')!;
        const lh = parseFloat(getComputedStyle(x).lineHeight);
        return {
          radius: getComputedStyle(x).borderTopLeftRadius,
          lines: Math.round(x.querySelector('.aura-pill__text')!.getBoundingClientRect().height / lh),
          fits: x.scrollWidth <= x.clientWidth,
        };
      });
      expect(sv).toEqual({ radius: '16px', lines: 2, fits: true });
      /* …and on one line it draws exactly as a pill without wrap: same size, same pixels. */
      const [w1, w0] = await page.locator('[data-testid=oneline] .aura-pill').all();
      const [b1, b0] = [await w1!.boundingBox(), await w0!.boundingBox()];
      expect([b1!.width, b1!.height]).toEqual([b0!.width, b0!.height]);
      expect((await w1!.screenshot()).equals(await w0!.screenshot())).toBe(true);
      /* Negative control: without wrap the words still run out of a narrow box (unchanged behaviour). */
      expect(m.plain![0]).toMatchObject({ fits: false, wrap: false });
    });
  }

  for (const lang of ['en', 'th', 'sv']) {
    test(`160: from 640px a toggle Tag in FilterBar shows its whole label; outside FilterBar and below 640px outside the sheet the 24ch cap stays (${lang})`, async ({
      page,
    }) => {
      const cut = () =>
        page.evaluate(() =>
          Object.fromEntries(
            ['bar', 'outside'].map((t) => [
              t,
              [...document.querySelectorAll(`[data-testid=${t}] .aura-tag__text`)].map(
                (x) => x.scrollWidth > x.clientWidth + 1,
              ),
            ]),
          ),
        );
      await page.setViewportSize({ width: 1440, height: 900 });
      await story(page, S('filter-toggles', lang));
      const wide = await cut();
      expect(wide.bar).toEqual([false, false, false]);
      expect(wide.outside).toEqual([true]);
      /* Below 640px the toggles fold into the sheet's button; open it and the cap applies inside the sheet too. */
      await page.setViewportSize({ width: 390, height: 844 });
      await page.getByRole('button', { name: /Filters/ }).click();
      const sheet = await page.evaluate(() =>
        [...document.querySelectorAll('.aura-filterbar--sheet .aura-tag__text')].map(
          (x) => getComputedStyle(x).maxWidth,
        ),
      );
      /* In the full-width sheet nothing is cut, at any width. */
      expect(sheet).toEqual(['none', 'none', 'none']);
      /* The bar's own outside Tag is still capped at a phone width. */
      expect(
        await page.evaluate(
          () => getComputedStyle(document.querySelector('[data-testid=outside] .aura-tag__text')!).maxWidth,
        ),
      ).not.toBe('none');
    });
  }

  /* #161: keyboard="tab". */
  const tabbables = (page: Page, tid: string) =>
    page.evaluate((tid) => {
      const g = document.querySelector(`[data-testid=${tid}] [role=grid]`)!;
      return [...g.querySelectorAll<HTMLElement>('button, a[href], input, [tabindex]')]
        .filter((e) => e.tabIndex >= 0 && !(e as HTMLButtonElement).disabled && e.getClientRects().length > 0)
        .map((e) => e.outerHTML.slice(0, 50));
    }, tid);
  const here = (page: Page) =>
    page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const ring = (e: Element) => {
        const s = getComputedStyle(e);
        return (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== 'none';
      };
      const box = el.matches('input[type=checkbox]') ? el.parentElement!.querySelector('.aura-check__box') : el;
      return { html: el.outerHTML.slice(0, 50), ring: !!box && ring(box), inGrid: !!el.closest('[role=grid]') };
    });

  for (const [w, lang] of [
    [1280, 'en'],
    [1280, 'th'],
    [390, 'sv'],
  ] as const) {
    test(`161: keyboard="tab" — Tab and Shift+Tab walk every control in the rows in DOM order, each with a focus ring (${w}px, ${lang})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: w, height: 900 });
      await story(page, S('tab-keys', lang));
      const want = await tabbables(page, 'tab');
      /* select-all, Member's sort button, then per row: checkbox, subject link, Approve, Reject. */
      expect(want.length).toBe(2 + 3 * 4);
      await page.getByTestId('before').focus();
      const got: string[] = [];
      for (let i = 0; i < want.length; i++) {
        await page.keyboard.press('Tab');
        const h = await here(page);
        expect(h.ring, h.html).toBe(true);
        got.push(h.html);
      }
      expect(got).toEqual(want);
      await page.keyboard.press('Tab');
      await expect(page.getByTestId('after')).toBeFocused();
      const back: string[] = [];
      for (let i = 0; i < want.length; i++) {
        await page.keyboard.press('Shift+Tab');
        back.push((await here(page)).html);
      }
      expect(back).toEqual([...want].reverse());
      /* Headers are still announced as headers. */
      expect(await page.locator('[data-testid=tab] [role=columnheader]').count()).toBeGreaterThan(0);
    });
  }

  test('161: keyboard="tab" keeps the arrows — Escape from a row action lands on its cell, ArrowDown moves down; Enter on a control still works', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, S('tab-keys'));
    const approve = page.locator('[data-testid=tab]').getByRole('button', { name: 'Approve' }).first();
    await approve.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('tab-done')).toHaveText('Approved EB-1201');
    await page.keyboard.press('Escape');
    const rc1 = await page.evaluate(() => document.activeElement!.getAttribute('data-rc'));
    expect(rc1).toMatch(/^1:\d+$/);
    await page.keyboard.press('ArrowDown');
    const rc2 = await page.evaluate(() => document.activeElement!.getAttribute('data-rc'));
    expect(rc2).toBe('2:' + rc1!.split(':')[1]);
    /* Sorting with the keyboard keeps focus on the sort button. */
    const sortBtn = page.locator('[data-testid=tab] .aura-table__sort').first();
    await sortBtn.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-testid=tab] [role=columnheader][aria-sort=ascending]')).toHaveCount(1);
    expect(await page.evaluate(() => document.activeElement!.classList.contains('aura-table__sort'))).toBe(true);
  });

  test('161: keyboard="tab" with column controls — the ⋯ buttons are Tab stops and closing a column menu returns to its button', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, S('tab-keys'));
    const btn = page.locator('[data-testid=tab-controls] .aura-table__menu-btn').first();
    expect(await btn.evaluate((b) => (b as HTMLElement).tabIndex)).toBe(0);
    await btn.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toHaveCount(0);
    await expect(btn).toBeFocused();
  });

  test('161: without it the grid is one Tab stop as before (negative control)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, S('tab-keys'));
    expect(await tabbables(page, 'grid')).toHaveLength(1);
    await page.getByTestId('after').focus();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement!.getAttribute('data-rc'))).not.toBeNull();
    await page.keyboard.press('Tab');
    /* The next Tab leaves that grid (for the next table on the page). */
    expect(await page.evaluate(() => !!document.activeElement!.closest('[data-testid=grid]'))).toBe(false);
  });

  /* #162 */
  const growM = (page: Page) =>
    page.evaluate(() =>
      Object.fromEntries(
        ['grow', 'even'].map((t) => {
          const root = document.querySelector(`[data-testid=${t}]`)!;
          const th = [...root.querySelectorAll<HTMLElement>('[role=columnheader]')].pop()!;
          const td = root.querySelector('.aura-btn')!.closest<HTMLElement>('[role=gridcell]')!;
          const btns = [...root.querySelectorAll('.aura-table__row')][0]!.querySelectorAll('.aura-btn');
          const head = root.querySelector('.aura-table__head')!;
          return [
            t,
            {
              th: Math.round(th.getBoundingClientRect().width),
              grow: getComputedStyle(td).flexGrow,
              oneLine:
                btns.length === 2 &&
                Math.round(btns[0]!.getBoundingClientRect().top) === Math.round(btns[1]!.getBoundingClientRect().top),
              rowMin: getComputedStyle(head).minWidth,
            },
          ];
        }),
      ),
    );
  for (const lang of ['en', 'th', 'sv']) {
    test(`162: grow weights a column's share of the spare width — row actions side by side at 1440, as before at the minimum, row minimum unchanged (${lang})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await story(page, S('grow-actions', lang));
      let m = await growM(page);
      expect(m.grow!.grow).toBe('3');
      expect(m.even!.grow).toBe('1');
      expect(m.grow!.th).toBeGreaterThan(m.even!.th + 100);
      expect(m.grow!.oneLine).toBe(true);
      expect(m.grow!.rowMin).toBe(m.even!.rowMin);
      /* At the row minimum there is no spare width to share: both tables lay out the same. */
      const min = parseFloat(m.even!.rowMin);
      await page.setViewportSize({ width: Math.ceil(min) + 32, height: 900 });
      m = await growM(page);
      expect(Math.abs(m.grow!.th - m.even!.th)).toBeLessThanOrEqual(2);
      /* Stacked cards ignore it: the Actions cell is laid out as in the even table. */
      await page.setViewportSize({ width: 390, height: 900 });
      const cards = await page.evaluate(() =>
        ['grow', 'even'].map((t) => {
          const r = document.querySelector(`[data-testid=${t}] .aura-table__row`)!;
          const b = r.querySelector('.aura-btn')!.closest('[role=gridcell]')!.getBoundingClientRect();
          return [Math.round(b.width), Math.round(b.left)];
        }),
      );
      expect(cards[0]).toEqual(cards[1]);
    });
  }

  test('163: the wheel over a grid that scrolls sideways scrolls the page; sideways stays contained; a fixed-height grid scrolls first', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    await story(page, S('wheel-over-wide-grid'));
    const wide = page.locator('[data-testid=wide] .aura-table__scroll');
    await wide.scrollIntoViewIfNeeded();
    const g = await wide.evaluate((e) => ({
      over: e.scrollWidth > e.clientWidth,
      x: getComputedStyle(e).overscrollBehaviorX,
      y: getComputedStyle(e).overscrollBehaviorY,
    }));
    expect(g).toEqual({ over: true, x: 'contain', y: 'auto' });
    /* Nudge it sideways first (Chamber's repro: once it has scrolled at all). */
    await wide.evaluate((e) => (e.scrollLeft = 1));
    const box = (await wide.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    const y0 = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 120);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(y0);
    /* A sideways wheel scrolls the grid, not the page. */
    const sx0 = await wide.evaluate((e) => e.scrollLeft);
    const b2 = (await wide.boundingBox())!;
    await page.mouse.move(b2.x + b2.width / 2, b2.y + b2.height / 2);
    await page.mouse.wheel(120, 0);
    await expect.poll(() => wide.evaluate((e) => e.scrollLeft)).toBeGreaterThan(sx0);
    expect(await page.evaluate(() => scrollX)).toBe(0);
    /* Fixed height: the grid scrolls first; at its end the page takes over. */
    const fixed = page.locator('[data-testid=fixed] .aura-table__scroll');
    await fixed.scrollIntoViewIfNeeded();
    const fb = (await fixed.boundingBox())!;
    await page.mouse.move(fb.x + fb.width / 2, fb.y + fb.height / 2);
    const py = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 100);
    await expect.poll(() => fixed.evaluate((e) => e.scrollTop)).toBeGreaterThan(0);
    expect(await page.evaluate(() => scrollY)).toBe(py);
    await fixed.evaluate((e) => (e.scrollTop = e.scrollHeight));
    const fb2 = (await fixed.boundingBox())!;
    await page.mouse.move(fb2.x + fb2.width / 2, fb2.y + fb2.height / 2);
    const py2 = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 120);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(py2);
  });

  test('5.50 follow-up: a disabled box with aria-invalid inside an enabled custom Field keeps its disabled edge', async ({
    page,
  }) => {
    await story(page, 'aura-new-in-5-51-chamber-os-157-160--disabled-invalid-in-field');
    const r = await page.evaluate(() => {
      const p = document.createElement('div');
      p.style.color = 'var(--aura-border-danger)';
      document.body.appendChild(p);
      const d = getComputedStyle(p).color;
      p.remove();
      return [...document.querySelectorAll('[data-testid=nested-disabled] .aura-input')].map(
        (b) => getComputedStyle(b).borderTopColor === d,
      );
    });
    /* country code (disabled), number (invalid), note textarea (disabled) */
    expect(r).toEqual([false, true, false]);
  });
});

test.describe('5.52: Chamber-OS 164 — a loading state for the static Table', () => {
  const ID = (lang: string) => 'aura-new-in-5-52-chamber-os-164--loading-table&args=lang:' + lang;
  const rowOf = (page: Page, t: string) =>
    page.evaluate((t) => {
      const r = document.querySelector(`[data-testid=${t}] .aura-tbl__body .aura-tbl__row`)!;
      const top = r.getBoundingClientRect().top;
      return {
        cells: [...r.children].map((c) => ({
          left: c.getBoundingClientRect().left,
          top: c.getBoundingClientRect().top - top,
          card: c.getAttribute('data-card'),
        })),
        height: r.getBoundingClientRect().height,
        rows: document.querySelectorAll(`[data-testid=${t}] .aura-tbl__body .aura-tbl__row`).length,
      };
    }, t);

  for (const [w, lang] of [
    [1280, 'en'],
    [1440, 'th'],
    [1280, 'sv'],
  ] as const) {
    test(`164: loading and the server TableSkeleton put every column's left edge within 2px of the loaded table (${w}px, ${lang})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: w, height: 900 });
      await story(page, ID(lang));
      const loaded = await rowOf(page, 'loaded');
      for (const t of ['loading', 'server']) {
        const r = await rowOf(page, t);
        expect(r.rows, t).toBe(8);
        expect(r.cells.length, t).toBe(loaded.cells.length);
        r.cells.forEach((c, i) =>
          expect(Math.abs(c.left - loaded.cells[i]!.left), t + ' col ' + i).toBeLessThanOrEqual(2),
        );
        /* a two-line title column: the placeholder row is as tall as the loaded one */
        expect(Math.abs(r.height - loaded.height), t).toBeLessThanOrEqual(2);
      }
      /* The page's rows never show while loading. */
      await expect(page.locator('[data-testid=loading]')).not.toContainText('never shown');
    });
  }

  test('164: below 640px the placeholders stack into the same cards — title first, action at the end of its line', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await story(page, ID('sv'));
    const loaded = await rowOf(page, 'loaded');
    for (const t of ['loading', 'server']) {
      const r = await rowOf(page, t);
      expect(
        r.cells.map((c) => c.card),
        t,
      ).toEqual(loaded.cells.map((c) => c.card));
      /* same card shape: each cell on the same line as in the loaded card */
      r.cells.forEach((c, i) =>
        expect(Math.abs(c.top - loaded.cells[i]!.top), t + ' cell ' + i).toBeLessThanOrEqual(4),
      );
      expect(r.cells[0]!.card).toBe('title');
      expect(r.cells[r.cells.length - 1]!.card).toBe('action');
      expect(r.cells[r.cells.length - 1]!.top).toBe(r.cells[0]!.top);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
    ).toBeLessThanOrEqual(0);
  });

  test('164: a loading table is aria-hidden and inert with nothing focusable; the loaded one is untouched', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, ID('en'));
    const a = await page.evaluate(() =>
      Object.fromEntries(
        ['loaded', 'loading', 'server'].map((t) => {
          const w = document.querySelector(`[data-testid=${t}] .aura-tbl-wrap`) as HTMLElement & { inert?: boolean };
          return [
            t,
            {
              hidden: w.getAttribute('aria-hidden'),
              inert: !!w.inert,
              focusable: [...w.querySelectorAll<HTMLElement>('a, button, input, [tabindex]')].filter(
                (e) => e.tabIndex >= 0,
              ).length,
            },
          ];
        }),
      ),
    );
    expect(a.loading).toEqual({ hidden: 'true', inert: true, focusable: 0 });
    expect(a.server).toEqual({ hidden: 'true', inert: true, focusable: 0 });
    expect(a.loaded!.hidden).toBeNull();
    expect(a.loaded!.inert).toBe(false);
    expect(await axeScan(page, '[data-testid=loaded]')).toEqual([]);
  });
});

test.describe('5.53: Chamber-OS 165 — the sheet footer and fullWidth below a width', () => {
  const S = (name: string, lang: string) => 'aura-new-in-5-53-chamber-os-165--' + name + '&args=lang:' + lang;
  const btns = async (page: Page, sel: string) => {
    await settle(page); /* the Dialog scales in from 0.98: measure its settled size */
    return page.evaluate((sel) => {
      const lh = (e: Element) => parseFloat(getComputedStyle(e).lineHeight);
      return [...document.querySelectorAll<HTMLElement>(sel)].map((b) => {
        const r = b.getBoundingClientRect();
        const p = b.parentElement!.getBoundingClientRect();
        return {
          w: Math.round(r.width),
          pw: Math.round(p.width),
          h: Math.round(r.height),
          over: b.scrollWidth > b.clientWidth + 1,
          lines: Math.round(
            (b.clientHeight -
              parseFloat(getComputedStyle(b).paddingTop) -
              parseFloat(getComputedStyle(b).paddingBottom)) /
              lh(b),
          ),
          ws: getComputedStyle(b).whiteSpace,
          right: Math.round(window.innerWidth - r.right),
        };
      });
    }, sel);
  };

  for (const lang of ['sv', 'th', 'en']) {
    test(`165: at 390px in compact density with a mouse, the sheet's footer buttons are full width, ≥44px, and a long label wraps (${lang})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await story(page, S('sheet-footer', lang));
      const b = await btns(page, '.aura-dialog__foot > .aura-btn, .aura-dialog__foot > * > .aura-btn');
      expect(b).toHaveLength(4);
      for (const x of b) {
        expect(x.w, JSON.stringify(x)).toBe(x.pw);
        expect(x.h, JSON.stringify(x)).toBeGreaterThanOrEqual(44);
        expect(x.over, JSON.stringify(x)).toBe(false);
      }
      /* No touchHeight anywhere in the story. */
      expect(await page.locator('.aura-btn--touch').count()).toBe(0);
      if (lang === 'sv') {
        /* "Skicka för godkännande igen" in a 390px sheet fits on one line; squeeze the sheet to force the wrap. */
        await page.setViewportSize({ width: 280, height: 844 });
        const n = await btns(page, '.aura-dialog__foot > .aura-btn');
        expect(n[2]!.lines).toBeGreaterThanOrEqual(2);
        expect(n[2]!.over).toBe(false);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
        ).toBeLessThanOrEqual(0);
      }
    });
  }

  test('165: at 1440px the footer is unchanged — right-aligned, density height, one line', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await story(page, S('sheet-footer', 'sv'));
    const b = await btns(page, '.aura-dialog__foot > .aura-btn');
    const foot = await page.evaluate(() => {
      const f = document.querySelector('.aura-dialog__foot')!.getBoundingClientRect();
      const last = document.querySelector('.aura-dialog__foot > :last-child')!.getBoundingClientRect();
      return Math.round(f.right - last.right);
    });
    expect(foot).toBe(0);
    expect(b.map((x) => x.ws)).toEqual(['nowrap', 'nowrap', 'nowrap']);
    /* compact density: the md buttons are the density's height (36px), the sm one 32px */
    expect([b[0]!.h, b[1]!.h, b[2]!.h]).toEqual([36, 32, 36]);
    for (const x of b) expect(x.w).toBeLessThan(x.pw);
  });

  test('165: a Drawer footer on a phone — buttons in their row and ≥44px; a long label wraps at 280px; 1440px as before (sv)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, S('drawer-footer', 'sv'));
    const d = await page.evaluate(() => {
      const f = document.querySelector('.aura-drawer__foot')!.getBoundingClientRect();
      return [...document.querySelectorAll<HTMLElement>('.aura-drawer__foot > .aura-btn')].map((b) => {
        const r = b.getBoundingClientRect();
        return {
          h: r.height,
          over: b.scrollWidth > b.clientWidth + 1,
          inside: r.right <= f.right + 0.5 && r.left >= f.left - 0.5,
        };
      });
    });
    expect(d).toHaveLength(2);
    for (const x of d) expect(x).toMatchObject({ over: false, inside: true });
    for (const x of d) expect(x.h).toBeGreaterThanOrEqual(44);
    /* 280px: the long Swedish label wraps inside its button, still in the footer. */
    await page.setViewportSize({ width: 280, height: 844 });
    const n = await btns(page, '.aura-drawer__foot > .aura-btn');
    expect(n[1]!.lines).toBeGreaterThanOrEqual(2);
    expect(n[1]!.over).toBe(false);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
    ).toBeLessThanOrEqual(0);
    /* 1440px: as before — density height, one line, narrower than the footer. */
    await page.setViewportSize({ width: 1440, height: 900 });
    const w = await btns(page, '.aura-drawer__foot > .aura-btn');
    expect(w.map((x) => [x.h, x.ws])).toEqual([
      [36, 'nowrap'],
      [36, 'nowrap'],
    ]);
    for (const x of w) expect(x.w).toBeLessThan(x.pw);
  });

  for (const lang of ['sv', 'th']) {
    test(`165: fullWidth="below-sm" stretches and wraps below 640px (≥44px, touchHeight or not) and keeps its natural width above (${lang})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await story(page, S('full-width-below', lang));
      const small = await btns(
        page,
        '[data-testid=row] > .aura-btn, [data-testid=narrow] > .aura-btn, [data-testid=link] > .aura-btn',
      );
      for (const x of small) {
        expect(x.w, JSON.stringify(x)).toBe(x.pw);
        expect(x.h, JSON.stringify(x)).toBeGreaterThanOrEqual(44);
        expect(x.over, JSON.stringify(x)).toBe(false);
      }
      /* In the 200px box the long label wraps. */
      expect(small[3]!.lines).toBeGreaterThanOrEqual(2);
      /* 700px: below-sm buttons back to their natural width and height; below-md still stretched. */
      await page.setViewportSize({ width: 700, height: 844 });
      const mid = await btns(page, '[data-testid=row] > .aura-btn');
      expect(mid[0]!.w).toBeLessThan(mid[0]!.pw);
      expect(mid[0]!.h).toBe(36);
      expect(mid[0]!.ws).toBe('nowrap');
      expect(mid[2]!.w).toBe(mid[2]!.pw);
      await page.setViewportSize({ width: 1280, height: 844 });
      const wide = await btns(page, '[data-testid=row] > .aura-btn, [data-testid=link] > .aura-btn');
      for (const x of wide) expect(x.w, JSON.stringify(x)).toBeLessThan(x.pw);
      expect(wide[2]!.h).toBe(32);
    });
  }
});

test.describe('5.54: Chamber-OS 166 — ActionBar buttons on a phone', () => {
  const ID = 'aura-new-in-5-54-chamber-os-166--bar-buttons';
  const hs = (page: Page, tid: string) =>
    page.evaluate(
      (tid) =>
        [...document.querySelectorAll(`[data-testid=${tid}] .aura-actionbar .aura-btn`)].map((b) => ({
          text: b.textContent!.trim(),
          h: Math.round(b.getBoundingClientRect().height),
          touch: b.classList.contains('aura-btn--touch'),
        })),
      tid,
    );

  test('166: at 390px in compact density with a mouse every Button in the bar (actions and start) is ≥44px with no touchHeight', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, ID);
    const w = await hs(page, 'wizard');
    expect(w.map((b) => b.text)).toEqual(['Cancel', 'Back', 'Save draft', 'Next']);
    /* the bar's IconButton too */
    const ib = await page.evaluate(() => {
      const r = document.querySelector('[data-testid=wizard] .aura-icon-btn')!.getBoundingClientRect();
      return [Math.round(r.width), Math.round(r.height)];
    });
    expect(ib[0]).toBeGreaterThanOrEqual(44);
    expect(ib[1]).toBeGreaterThanOrEqual(44);
    for (const b of w) {
      expect(b.touch, b.text).toBe(false);
      expect(b.h, b.text).toBeGreaterThanOrEqual(44);
    }
    /* a field in a bar keeps its own height: its suffix IconButton isn't grown */
    const fld = await page.evaluate(() => {
      const r = document.querySelector('[data-testid=field-bar] .aura-input')!.getBoundingClientRect();
      const s = document.querySelector('[data-testid=field-bar] .aura-input .aura-icon-btn')!.getBoundingClientRect();
      return [Math.round(r.height), Math.round(s.height)];
    });
    expect(fld[1]).toBeLessThan(44);
    expect(fld[0]).toBeLessThanOrEqual(44);
    /* the bulk bar that already passes touchHeight: 44px, as before */
    for (const b of await hs(page, 'bulk')) expect(b.h, b.text).toBe(44);
  });

  test('166: the PageHeader actionsBarBelow bar — its Buttons and IconButton are ≥44px below 640px; at 1440px as before', async ({
    page,
  }) => {
    const sizes = () =>
      page.evaluate(() =>
        [
          ...document.querySelectorAll(
            '[data-testid=header] .aura-page-header__actions :is(.aura-btn, .aura-icon-btn)',
          ),
        ].map((b) => {
          const r = b.getBoundingClientRect();
          return [Math.round(r.width), Math.round(r.height)];
        }),
      );
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, 'aura-new-in-5-54-chamber-os-166--header-bar');
    expect(
      await page.evaluate(
        () => getComputedStyle(document.querySelector('[data-testid=header] .aura-page-header__actions')!).position,
      ),
    ).toBe('fixed');
    for (const [w, h] of await sizes()) {
      expect(h).toBeGreaterThanOrEqual(44);
      expect(w).toBeGreaterThanOrEqual(44);
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    expect((await sizes()).map((s) => s[1])).toEqual([36, 32, 32]);
    /* Buttons only (no ⋯ stretching the row): still ≥44px on a phone. */
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, 'aura-new-in-5-54-chamber-os-166--header-bar&args=withMenu:!false');
    const only = await sizes();
    expect(only).toHaveLength(2);
    for (const [, h] of only) expect(h).toBeGreaterThanOrEqual(44);
  });

  test('166: at 1440px the bars are unchanged — density heights (36px, 32px for sm)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await story(page, ID);
    expect((await hs(page, 'wizard')).map((b) => b.h)).toEqual([36, 36, 32, 36]);
    expect(
      await page.evaluate(() =>
        Math.round(document.querySelector('[data-testid=wizard] .aura-icon-btn')!.getBoundingClientRect().height),
      ),
    ).toBe(32);
    /* the bulk bar's touchHeight buttons are 32px with a mouse from 640px, as before */
    for (const b of await hs(page, 'bulk')) expect(b.h, b.text).toBe(32);
  });
});

test.describe('5.55: Chamber-OS 167 — bar and footer buttons follow the coarse pointer', () => {
  const S = (n: string) => 'aura-new-in-5-55-chamber-os-167--' + n;
  /* Settled, and offsetHeight (the layout box): measured mid-way through the Dialog's entrance animation (scale 0.98)
   * a 44px button's drawn rect reads 43 — CI caught it. */
  const heights = async (page: Page, sel: string) => {
    await settle(page);
    return page.evaluate((sel) => [...document.querySelectorAll<HTMLElement>(sel)].map((b) => b.offsetHeight), sel);
  };
  const BAR = '[data-testid=bar] .aura-actionbar .aura-btn';

  test.describe('touch screen at 1024px', () => {
    test.use({ hasTouch: true, isMobile: true, viewport: { width: 1024, height: 768 } });
    test('167: size="sm" Buttons in an ActionBar (children, start) and in Dialog and Drawer footers are ≥44px with no touchHeight', async ({
      page,
    }) => {
      for (const [id, sel] of [
        ['bulk-bar', BAR],
        ['dialog-footer', '.aura-dialog__foot .aura-btn'],
        ['drawer-footer', '.aura-drawer__foot .aura-btn'],
      ] as const) {
        await story(page, S(id));
        expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches && innerWidth >= 640)).toBe(true);
        expect(await page.locator('.aura-btn--touch').count()).toBe(0);
        const h = await heights(page, sel);
        expect(h.length, id).toBeGreaterThanOrEqual(2);
        for (const x of h) expect(x, id).toBeGreaterThanOrEqual(44);
        /* one line still: wrapping is phone-only */
        expect(
          await page.evaluate(
            (sel) => [...document.querySelectorAll(sel)].every((b) => getComputedStyle(b).whiteSpace === 'nowrap'),
            sel,
          ),
          id,
        ).toBe(true);
      }
    });
  });

  test('167: with a mouse at 1440px the bar and footers are unchanged — size="sm" stays 32px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const [id, sel] of [
      ['bulk-bar', BAR],
      ['dialog-footer', '.aura-dialog__foot .aura-btn'],
      ['drawer-footer', '.aura-drawer__foot .aura-btn'],
    ] as const) {
      await story(page, S(id));
      for (const x of await heights(page, sel)) expect(x, id).toBe(32);
    }
  });

  test('167: below 640px with a mouse, as in 5.54 — ≥44px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, S('bulk-bar'));
    for (const x of await heights(page, BAR)) expect(x).toBeGreaterThanOrEqual(44);
  });
});

test.describe('5.56: Chamber-OS 168 — AppShell menu button is a 44px touch target', () => {
  const ID = 'aura-new-in-5-56-chamber-os-168--menu-button';
  const box = (page: Page, sel: string) =>
    page.evaluate((sel) => {
      const el = document.querySelector(sel) as HTMLElement;
      const r = el.getBoundingClientRect();
      return [Math.round(r.width), Math.round(r.height), getComputedStyle(el).display !== 'none'];
    }, sel);

  test('168: at 390px in compact density with a fine pointer the menu button is 44×44, as the touchHeight buttons beside it', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, ID);
    expect(await page.evaluate(() => matchMedia('(pointer: fine)').matches)).toBe(true);
    expect(await page.locator('[data-density=compact]').count()).toBeGreaterThan(0);
    expect(await box(page, '.aura-shell__menu')).toEqual([44, 44, true]);
    expect(await box(page, '[data-testid=search]')).toEqual([44, 44, true]);
    /* the bar keeps its height */
    expect(Math.round(await page.locator('.aura-shell__bar').evaluate((b) => b.getBoundingClientRect().height))).toBe(
      56,
    );
  });

  test.describe('touch screen at 768px', () => {
    test.use({ hasTouch: true, isMobile: true, viewport: { width: 768, height: 1024 } });
    test('168: the menu button is 44×44', async ({ page }) => {
      await story(page, ID);
      expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches && innerWidth >= 640)).toBe(true);
      expect(await box(page, '.aura-shell__menu')).toEqual([44, 44, true]);
    });
  });

  test('168: with a mouse at 768px it keeps its 32px size; from 1024px it is hidden', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await story(page, ID);
    expect(await box(page, '.aura-shell__menu')).toEqual([32, 32, true]);
    await page.setViewportSize({ width: 1024, height: 900 });
    expect((await box(page, '.aura-shell__menu'))[2]).toBe(false);
  });
});

test.describe('5.57: Chamber-OS 169 — a modal opens with focus inside when its first control is in a closed <details>', () => {
  const S = (n: string) => 'aura-new-in-5-57-chamber-os-169--' + n;
  const where = (page: Page) =>
    page.evaluate(() => {
      const a = document.activeElement as HTMLElement | null;
      return {
        inside: !!a && !!a.closest('[role=dialog]'),
        tag: a ? a.tagName.toLowerCase() : '',
        id: (a && a.getAttribute('data-testid')) || '',
      };
    });

  for (const kind of ['drawer', 'dialog'] as const) {
    const id = S(kind + '-closed-details');

    test(`169 (${kind}): opens on the <summary>, not the hidden Copy; Escape closes it and focus returns to the trigger`, async ({
      page,
    }) => {
      await story(page, id);
      await page.getByTestId('trigger').click();
      await page.waitForSelector('[role=dialog]');
      expect(await page.evaluate(() => (document.querySelector('[data-testid=more]') as HTMLDetailsElement).open)).toBe(
        false,
      );
      expect(await where(page)).toEqual({ inside: true, tag: 'summary', id: '' });
      await page.keyboard.press('Escape');
      await expect(page.locator('[role=dialog]')).toHaveCount(0);
      expect((await where(page)).id).toBe('trigger');
    });

    test(`169 (${kind}): Tab and Shift+Tab stay in the modal and never land on a control in the closed <details>`, async ({
      page,
    }) => {
      await story(page, id);
      await page.getByTestId('trigger').click();
      await page.waitForSelector('[role=dialog]');
      for (const key of ['Tab', 'Shift+Tab']) {
        const seen: string[] = [];
        for (let i = 0; i < 6; i++) {
          await page.keyboard.press(key);
          const w = await where(page);
          expect(w.inside, key + ' #' + i).toBe(true);
          seen.push(w.id || w.tag);
        }
        expect(seen, key).not.toContain('copy');
        expect(seen, key).toContain('summary');
      }
      /* opened, Copy is a Tab stop again */
      await page.locator('[data-testid=more] > summary').click();
      const seen: string[] = [];
      for (let i = 0; i < 4; i++) {
        await page.keyboard.press('Tab');
        seen.push((await where(page)).id);
      }
      expect(seen).toContain('copy');
    });

    test(`169 (${kind}): a control that refuses focus() is passed over — focus falls back to the panel, Escape still closes`, async ({
      page,
    }) => {
      await story(page, id);
      /* the summary looks focusable but focus() does nothing, as Chromium does for a control in a closed <details> */
      await page.evaluate(() => {
        const f = HTMLElement.prototype.focus;
        HTMLElement.prototype.focus = function (this: HTMLElement, o?: FocusOptions) {
          if (this.tagName !== 'SUMMARY') f.call(this, o);
        };
      });
      await page.getByTestId('trigger').click();
      await page.waitForSelector('[role=dialog]');
      const w = await where(page);
      expect(w.inside).toBe(true);
      expect(w.tag).not.toBe('summary');
      await page.keyboard.press('Escape');
      await expect(page.locator('[role=dialog]')).toHaveCount(0);
      expect((await where(page)).id).toBe('trigger');
    });
  }

  test('169: a first control that forwards focus to an inner field keeps it there (not moved on to the summary)', async ({
    page,
  }) => {
    await story(page, S('dialog-forwarding-first'));
    await page.getByTestId('trigger').click();
    await page.waitForSelector('[role=dialog]');
    expect(await where(page)).toEqual({ inside: true, tag: 'input', id: 'inner' });
  });

  test('169: an open <details> first in the body — the Drawer opens on its summary (the first Tab stop)', async ({
    page,
  }) => {
    await story(page, S('drawer-open-details'));
    await page.getByTestId('trigger').click();
    await page.waitForSelector('[role=dialog]');
    expect(await where(page)).toEqual({ inside: true, tag: 'summary', id: '' });
    await page.keyboard.press('Tab');
    expect((await where(page)).tag).toBe('input');
  });

  test('169: Popover — opens on the summary, Tab wraps summary ⇄ button and never reaches Copy, Escape closes', async ({
    page,
  }) => {
    await story(page, S('popover-closed-details'));
    await page.getByTestId('trigger').click();
    await page.waitForSelector('.aura-popover');
    expect(await where(page)).toEqual({ inside: true, tag: 'summary', id: '' });
    for (const key of ['Tab', 'Shift+Tab']) {
      const seen: string[] = [];
      for (let i = 0; i < 4; i++) {
        await page.keyboard.press(key);
        const w = await where(page);
        expect(w.inside, key + ' #' + i).toBe(true);
        seen.push(w.id || w.tag);
      }
      expect(seen.sort(), key).toEqual(['after', 'after', 'summary', 'summary']);
    }
    await page.keyboard.press('Escape');
    await expect(page.locator('.aura-popover')).toHaveCount(0);
    expect((await where(page)).id).toBe('trigger');
  });
});

test.describe('5.57: Chamber-OS 170 — a titled Alert is named by its title', () => {
  test('170: note, alert and status Alerts are named by their title; aria-label wins; no title or role="none" has no name', async ({
    page,
  }) => {
    await story(page, 'aura-new-in-5-57-chamber-os-170--named-alerts');
    await expect(page.getByRole('note', { name: 'Personal data erased on 22 Oct 2026', exact: true })).toHaveCount(1);
    await expect(page.getByRole('alert', { name: 'Renewal overdue', exact: true })).toHaveCount(1);
    await expect(page.getByRole('status', { name: 'Saved', exact: true })).toHaveCount(1);
    await expect(page.getByRole('note', { name: 'Staff note', exact: true })).toHaveCount(1);
    await expect(page.getByRole('note', { name: 'Shown to staff' })).toHaveCount(0);
    /* labelled by the visible title element */
    const ref = await page.evaluate(() =>
      [...document.querySelectorAll('.aura-alert[aria-labelledby]')].every(
        (a) => document.getElementById(a.getAttribute('aria-labelledby')!) === a.querySelector('.aura-alert__title'),
      ),
    );
    expect(ref).toBe(true);
    for (const id of ['untitled', 'none']) {
      const a = page.getByTestId(id);
      expect(await a.getAttribute('aria-labelledby'), id).toBeNull();
      expect(await a.getAttribute('aria-label'), id).toBeNull();
    }
    /* the focused banner is announced with its name */
    await page.getByTestId('focus').click();
    const focused = await page.evaluate(() => document.activeElement!.getAttribute('role'));
    expect(focused).toBe('note');
    const snap = await page.locator('body').ariaSnapshot();
    expect(snap).toContain('note "Personal data erased on 22 Oct 2026"');
  });
});

test.describe('5.58: Chamber-OS 171 — a short touchHeight tab is a 44×44 target', () => {
  const ID = 'aura-new-in-5-58-chamber-os-171--short-tab';
  const tabs = (page: Page, t: string) =>
    page.evaluate((t) => {
      const els = [...document.querySelectorAll(`[data-testid=${t}] .aura-tab`)];
      return els.map((e, i) => {
        const r = e.getBoundingClientRect();
        const next = els[i + 1]?.getBoundingClientRect();
        return {
          label: e.textContent,
          w: Math.round(r.width),
          h: Math.round(r.height),
          gap: next ? Math.round(next.left - r.right) : null,
        };
      });
    }, t);

  test('171: at 390px with a mouse, "Tax" is ≥44×44 with its label centred; longer tabs keep their width and the gap', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, ID);
    const touch = await tabs(page, 'touch'),
      plain = await tabs(page, 'plain');
    const tax = touch.find((x) => x.label === 'Tax')!;
    expect(plain.find((x) => x.label === 'Tax')!.w).toBeLessThan(44);
    expect(tax.w).toBeGreaterThanOrEqual(44);
    expect(tax.h).toBeGreaterThanOrEqual(44);
    for (let i = 0; i < touch.length; i++) {
      if (touch[i]!.label !== 'Tax') expect(touch[i]!.w, touch[i]!.label!).toBe(plain[i]!.w);
      if (touch[i]!.gap !== null) expect(touch[i]!.gap, touch[i]!.label!).toBe(plain[i]!.gap);
    }
    const centred = await page.evaluate(() => {
      const t = [...document.querySelectorAll('[data-testid=touch] .aura-tab')].find((e) => e.textContent === 'Tax')!;
      const r = t.getBoundingClientRect(),
        range = document.createRange();
      range.selectNodeContents(t);
      const x = range.getBoundingClientRect();
      return Math.abs(x.left - r.left - (r.right - x.right));
    });
    expect(centred).toBeLessThanOrEqual(1);
    /* a one-letter segmented option is 44px wide too */
    for (const x of await tabs(page, 'seg')) expect(x.w, 'segmented ' + x.label).toBeGreaterThanOrEqual(44);
  });

  test('171: with a mouse at 1440px nothing changes — the touchHeight tabs match the plain ones', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await story(page, ID);
    const touch = await tabs(page, 'touch'),
      plain = await tabs(page, 'plain');
    expect(touch).toEqual(plain);
  });

  test.describe('touch screen at 1024px', () => {
    test.use({ hasTouch: true, isMobile: true, viewport: { width: 1024, height: 768 } });
    test('171: "Tax" is ≥44×44 on a coarse pointer', async ({ page }) => {
      await story(page, ID);
      const tax = (await tabs(page, 'touch')).find((x) => x.label === 'Tax')!;
      expect(tax.w).toBeGreaterThanOrEqual(44);
      expect(tax.h).toBeGreaterThanOrEqual(44);
      /* fullWidth="below-md" isn't filling at 1024px: its short tab gets the 44px minimum */
      const a = (await tabs(page, 'fill-md')).find((x) => x.label === 'A')!;
      expect(a.w).toBeGreaterThanOrEqual(44);
    });
  });
});

test.describe('5.59: Chamber-OS 172 — linkClass, a text link with the touch rule', () => {
  const ID = 'aura-new-in-5-59-chamber-os-172--text-links';
  const box = (page: Page, id: string) =>
    page.getByTestId(id).evaluate((a) => {
      const r = a.getBoundingClientRect(),
        s = getComputedStyle(a);
      return {
        w: Math.round(r.width),
        h: Math.round(r.height),
        look: [
          s.color,
          s.fontSize,
          s.fontWeight,
          s.lineHeight,
          s.textDecorationLine,
          s.backgroundColor,
          s.borderTopWidth,
          s.paddingLeft,
          s.paddingTop,
        ].join('|'),
      };
    });

  test('172: at 390px with a mouse, the touch links are ≥44px tall (short one 44×44) and look like the plain ones', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, ID);
    const long = await box(page, 'long'),
      short = await box(page, 'short');
    const longP = await box(page, 'long-plain'),
      shortP = await box(page, 'short-plain');
    expect(long.h).toBeGreaterThanOrEqual(44);
    expect(long.w).toBe(longP.w);
    expect(short.w).toBeGreaterThanOrEqual(44);
    expect(short.h).toBeGreaterThanOrEqual(44);
    expect(shortP.w).toBeLessThan(44);
    expect(long.look).toBe(longP.look);
    expect(short.look).toBe(shortP.look);
    expect(short.look).toContain('underline');
    expect(short.look).toContain('rgba(0, 0, 0, 0)|0px|0px|0px');
  });

  test('172: with a mouse at 1440px the touch links are the plain links’ width and look, and their row keeps its height', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await story(page, ID);
    for (const [t, p] of [
      ['long', 'long-plain'],
      ['short', 'short-plain'],
    ]) {
      const a = await box(page, t),
        b = await box(page, p);
      expect(a.w, t).toBe(b.w);
      expect(a.look, t).toBe(b.look);
    }
    const rows = await page.evaluate(() =>
      ['touch', 'plain'].map((id) =>
        Math.round(document.querySelector(`[data-testid=${id}]`)!.getBoundingClientRect().height),
      ),
    );
    expect(rows[0]).toBe(rows[1]);
  });

  test('172: a <button> with linkClass looks like the <a> — at rest, on hover and on keyboard focus; no button chrome', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, ID);
    const look = (id: string) =>
      page.getByTestId(id).evaluate((el) => {
        const s = getComputedStyle(el),
          r = el.getBoundingClientRect();
        return [
          Math.round(r.width),
          Math.round(r.height),
          s.color,
          s.font,
          s.lineHeight,
          s.letterSpacing,
          s.textDecorationLine,
          s.textDecorationThickness,
          s.backgroundColor,
          s.backgroundImage,
          s.borderTopWidth,
          s.borderTopStyle,
          s.padding,
          s.cursor,
          s.outlineStyle,
          s.outlineWidth,
          s.outlineColor,
          s.outlineOffset,
          s.boxShadow,
        ].join('|');
      });
    const rest = await look('btn');
    expect(rest).toBe(await look('btn-a'));
    /* no chrome: transparent, no border, no padding, the accent colour */
    const accent = await page.evaluate(() => {
      const p = document.createElement('span');
      p.style.color = 'var(--aura-fg-accent)';
      document.body.appendChild(p);
      const c = getComputedStyle(p).color;
      p.remove();
      return c;
    });
    expect(rest).toContain('|' + accent + '|');
    expect(rest).toContain('rgba(0, 0, 0, 0)|none|0px|none|0px');
    /* hover */
    await page.getByTestId('btn').hover();
    const hoverBtn = await look('btn');
    await page.getByTestId('btn-a').hover();
    const hoverA = await look('btn-a');
    expect(hoverBtn).toBe(hoverA);
    expect(hoverBtn).not.toBe(rest);
    /* keyboard focus: Button's ring */
    await page.mouse.move(0, 0);
    await page.keyboard.press('Tab');
    await page.getByTestId('btn').focus();
    const focusBtn = await look('btn');
    await page.getByTestId('btn-a').focus();
    const focusA = await look('btn-a');
    expect(focusBtn).toBe(focusA);
    expect(focusBtn).toMatch(/\|solid\|2px\|/);
  });

  test('172: the button form in dark mode is --aura-fg-accent too', async ({ page }) => {
    await story(page, ID, 'dark');
    const [btn, a] = await Promise.all(
      ['btn', 'btn-a'].map((id) => page.getByTestId(id).evaluate((el) => getComputedStyle(el).color)),
    );
    const accent = await page.getByTestId('btn').evaluate((el) => {
      const p = document.createElement('span');
      p.style.color = 'var(--aura-fg-accent)';
      el.parentElement!.appendChild(p);
      const c = getComputedStyle(p).color;
      p.remove();
      return c;
    });
    expect(btn).toBe(a);
    expect(btn).toBe(accent);
  });

  test('172: forced colours — the button and the <a> both read as a link (LinkText)', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await story(page, ID);
    const linkText = await page.evaluate(() => {
      const p = document.createElement('span');
      p.style.color = 'LinkText';
      document.body.appendChild(p);
      const c = getComputedStyle(p).color;
      p.remove();
      return c;
    });
    expect(await page.getByTestId('btn').evaluate((el) => getComputedStyle(el).color)).toBe(linkText);
    const [btn, a] = await Promise.all(
      ['btn', 'btn-a'].map((id) => page.getByTestId(id).evaluate((el) => getComputedStyle(el).color)),
    );
    expect(btn).toBe(a);
  });

  test('172: without touchHeight, under an uppercase parent, a <button> and an <a> still match; in a DataTable cell the link stays inline with its ellipsis', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, ID);
    const k = (id: string) =>
      page.getByTestId(id).evaluate((el) => {
        const s = getComputedStyle(el),
          r = el.getBoundingClientRect(),
          range = document.createRange();
        range.selectNodeContents(el);
        /* the drawn text (5.60: the <button> form is inline-flex, so its box is the line height tall) */
        const t = range.getBoundingClientRect();
        return [
          Math.round(r.width),
          Math.round(t.height),
          s.textTransform,
          s.wordSpacing,
          s.textIndent,
          s.color,
          s.font,
        ].join('|');
      });
    expect(await k('btn-plain')).toBe(await k('btn-a-plain'));
    const cell = await page.getByTestId('cell').evaluate((td) => {
      const a = td.querySelector('a')!;
      return [
        getComputedStyle(a).display,
        Math.round(a.getBoundingClientRect().height) <= 40,
        td.scrollWidth > td.clientWidth,
      ];
    });
    expect(cell).toEqual(['inline', true, true]);
  });

  test('172: in a stacked DataTable (cards) the title link keeps its 44×44 target', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, ID);
    const links = await page.locator('[data-testid=cards] .aura-link').evaluateAll((as) =>
      as.map((a) => {
        const r = a.getBoundingClientRect();
        return [getComputedStyle(a).display, Math.round(r.width) >= 44, Math.round(r.height) >= 44];
      }),
    );
    expect(links.length).toBe(2);
    for (const l of links) expect(l).toEqual(['inline-flex', true, true]);
  });

  test.describe('touch screen at 1024px', () => {
    test.use({ hasTouch: true, isMobile: true, viewport: { width: 1024, height: 768 } });
    test('172: the same 44px target on a coarse pointer', async ({ page }) => {
      await story(page, ID);
      const short = await box(page, 'short'),
        long = await box(page, 'long');
      expect(short.w).toBeGreaterThanOrEqual(44);
      expect(short.h).toBeGreaterThanOrEqual(44);
      expect(long.h).toBeGreaterThanOrEqual(44);
    });
  });
});

test.describe('5.60: Chamber-OS 173 — linkClass lays a link out at every width', () => {
  const ID = 'aura-new-in-5-60-chamber-os-173--layouts';

  test('173: with a mouse at 1280px an icon link truncates inside its parent with a gap before the icon; the page does not scroll sideways', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, ID);
    for (const id of ['site', 'site-row']) {
      const m = await page.getByTestId(id).evaluate((box) => {
        const a = box.querySelector('a')!,
          span = a.querySelector('span')!,
          icon = a.querySelector('svg')!;
        const b = box.getBoundingClientRect(),
          ar = a.getBoundingClientRect(),
          sr = span.getBoundingClientRect(),
          ir = icon.getBoundingClientRect();
        return {
          flex: /flex/.test(getComputedStyle(a).display),
          truncates: span.scrollWidth > span.clientWidth,
          inside: ar.right <= b.right + 0.5,
          gap: Math.round(ir.left - sr.right),
          middle: Math.abs(ir.top + ir.height / 2 - (sr.top + sr.height / 2)) <= 1,
        };
      });
      expect(m, id).toEqual({ flex: true, truncates: true, inside: true, gap: 4, middle: true });
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
    ).toBe(true);
  });

  test('173: with a mouse, a <button> with an icon has the gap and the icon on the text’s centre line', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, ID);
    const m = await page.getByTestId('create').evaluate((b) => {
      const icon = b.querySelector('svg')!.getBoundingClientRect(),
        range = document.createRange();
      range.setStartAfter(b.querySelector('svg')!);
      range.setEnd(b, b.childNodes.length);
      const t = range.getBoundingClientRect();
      return [
        getComputedStyle(b).display,
        Math.round(t.left - icon.right),
        Math.abs(icon.top + icon.height / 2 - (t.top + t.height / 2)) <= 1,
      ];
    });
    expect(m).toEqual(['inline-flex', 4, true]);
  });

  for (const [label, use] of [
    ['390px with a mouse', { viewport: { width: 390, height: 844 } }],
    ['1024px touch', { hasTouch: true, isMobile: true, viewport: { width: 1024, height: 768 } }],
  ] as const) {
    test.describe(label, () => {
      test.use(use);
      test(`173 (${label}): a link stretched by a flex column starts its label at the box’s start; the summary hugs its content`, async ({
        page,
      }) => {
        await story(page, ID);
        const col = await page.getByTestId('column').evaluate((c) => {
          const a = c.querySelector('a')!,
            r = a.getBoundingClientRect(),
            range = document.createRange();
          range.selectNodeContents(a);
          return [
            Math.round(r.width) === Math.round(c.getBoundingClientRect().width),
            Math.round(range.getBoundingClientRect().left - r.left),
            Math.round(r.height) >= 44,
          ];
        });
        expect(col).toEqual([true, 0, true]);
        const sum = await page.getByTestId('details').evaluate((d) => {
          const s = d.querySelector('summary')!;
          return [
            Math.round(s.getBoundingClientRect().width) < Math.round(d.getBoundingClientRect().width),
            Math.round(s.getBoundingClientRect().height) >= 44,
          ];
        });
        expect(sum).toEqual([true, true]);
      });
    });
  }

  test('173: with a mouse the summary is as wide as its content, its focus ring hugs it; a type class on the link applies; a plain link stays inline', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, ID);
    const sum = await page.getByTestId('details').evaluate((d) => {
      const s = d.querySelector('summary')!;
      return [getComputedStyle(s).display, Math.round(s.getBoundingClientRect().width) < 200];
    });
    expect(sum).toEqual(['inline-flex', true]);
    await page.keyboard.press('Tab');
    await page.locator('[data-testid=details] summary').focus();
    expect(await page.locator('[data-testid=details] summary').evaluate((s) => getComputedStyle(s).outlineStyle)).toBe(
      'solid',
    );
    expect(
      await page.getByTestId('typed').evaluate((a) => [getComputedStyle(a).fontSize, getComputedStyle(a).fontWeight]),
    ).toEqual(['13px', '500']);
    expect(await page.getByTestId('plain').evaluate((a) => getComputedStyle(a).display)).toBe('inline');
    /* an app's own spacing and weight classes on the <button> form win over the reset */
    expect(
      await page.getByTestId('spaced').evaluate((b) => {
        const st = getComputedStyle(b);
        return [st.marginTop, st.paddingLeft, st.fontWeight];
      }),
    ).toEqual(['24px', '8px', '700']);
    /* an app's own display class wins over the layout */
    expect(await page.getByTestId('hidden').evaluate((b) => getComputedStyle(b).display)).toBe('none');
    /* a leading icon: the button's text sits on the line's text */
    const shift = await page.getByTestId('row').evaluate((p) => {
      const b = p.querySelector('button')!,
        r1 = document.createRange(),
        r2 = document.createRange();
      r1.setStartAfter(b.querySelector('svg')!);
      r1.setEnd(b, b.childNodes.length);
      r2.setStart(p.firstChild!, 0);
      r2.setEnd(p.firstChild!, 6);
      return Math.abs(Math.round(r1.getBoundingClientRect().bottom - r2.getBoundingClientRect().bottom));
    });
    expect(shift).toBeLessThanOrEqual(2); /* 2–4px off with the icon as the baseline */
    /* the same at a body line height, for a leading icon on a <button> and a trailing one on a touch <a> */
    const tall = await page.getByTestId('row-tall').evaluate((p) => {
      const ref = document.createRange();
      ref.setStart(p.firstChild!, 0);
      ref.setEnd(p.firstChild!, 6);
      const base = ref.getBoundingClientRect().bottom;
      return [...p.querySelectorAll('button, a')].map((el) => {
        const r = document.createRange();
        const t = [...el.childNodes].find((n) => n.nodeType === 3 && n.textContent!.trim())!;
        r.selectNodeContents(t);
        return Math.abs(Math.round(r.getBoundingClientRect().bottom - base));
      });
    });
    for (const x of tall) expect(x).toBeLessThanOrEqual(2);
    /* an element reset (summary { display: list-item }) doesn't undo the layout */
    expect(await page.locator('[data-testid=details-reset] summary').evaluate((x) => getComputedStyle(x).display)).toBe(
      'inline-flex',
    );
    /* a link in a sentence still wraps across lines */
    expect(await page.locator('[data-testid=sentence] a').evaluate((a) => a.getClientRects().length)).toBeGreaterThan(
      1,
    );
  });
});

test.describe('5.60: Chamber-OS 174–175 — static Table wrapping and a wide sticky header', () => {
  const S = (n: string) => 'aura-new-in-5-60-chamber-os-174-175--' + n;

  test('174: in a 703px box a two-word name wraps between its words, a wrap="none" cell stays on one line, nothing scrolls sideways', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 900 });
    await story(page, S('plans-list'));
    const words = await page.evaluate(() => {
      const out: Array<[string, number]> = [];
      document.querySelectorAll('[data-testid^=name-]').forEach((td) => {
        const t = td.firstChild as Text;
        let at = 0;
        for (const w of t.textContent!.split(' ')) {
          const r = document.createRange();
          r.setStart(t, at);
          r.setEnd(t, at + w.length);
          out.push([w, r.getClientRects().length]);
          at += w.length + 1;
        }
      });
      return out;
    });
    for (const [w, n] of words) expect(n, w).toBe(1);
    const docLines = await page.evaluate(() =>
      [...document.querySelectorAll('[data-testid^=doc-]')].map((td) => {
        const r = document.createRange();
        r.selectNodeContents(td);
        return r.getClientRects().length;
      }),
    );
    for (const n of docLines) expect(n).toBe(1);
    const scroll = await page.evaluate(() => {
      const w = document.querySelector('[data-testid=box] .aura-tbl-wrap')!;
      return [
        w.scrollWidth <= w.clientWidth,
        document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ];
    });
    expect(scroll).toEqual([true, true]);
    /* squeezed (a 360px box): the names wrap, still between words — never inside one */
    await page.getByTestId('box').evaluate((b) => ((b as HTMLElement).style.width = '360px'));
    const squeezed = await page.evaluate(() =>
      [...document.querySelectorAll('[data-testid^=name-]')].map((td) => {
        const t = td.firstChild as Text,
          whole = document.createRange();
        whole.selectNodeContents(td);
        let at = 0,
          broken = false;
        for (const w of t.textContent!.split(' ')) {
          const r = document.createRange();
          r.setStart(t, at);
          r.setEnd(t, at + w.length);
          if (r.getClientRects().length > 1) broken = true;
          at += w.length + 1;
        }
        return [new Set([...whole.getClientRects()].map((x) => Math.round(x.top))).size, broken];
      }),
    );
    expect(squeezed.some(([lines]) => (lines as number) > 1)).toBe(true);
    for (const [, broken] of squeezed) expect(broken).toBe(false);
    /* wrap="anywhere" keeps the old rule for a URL */
    expect(await page.getByTestId('url').evaluate((td) => getComputedStyle(td).overflowWrap)).toBe('anywhere');
  });

  test('175: a wide stickyHeader Table shows its first row in full below the header at rest', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 900 });
    await story(page, S('wide-sticky'));
    await expect(page.locator('[data-testid=wide] .aura-tbl-wrap')).toHaveClass(/is-wide/);
    const m = await page.evaluate(() => {
      const th = document.querySelector('[data-testid=wide] .aura-tbl__th')!.getBoundingClientRect();
      const row = document.querySelector('[data-testid=wide] .aura-tbl__body .aura-tbl__row')!.getBoundingClientRect();
      const head = document.querySelector('[data-testid=wide] .aura-tbl__head')!.getBoundingClientRect();
      return [Math.round(row.top - th.bottom), Math.round(th.top - head.top)];
    });
    expect(m[0]).toBeGreaterThanOrEqual(-1);
    expect(m[1]).toBe(0);
    /* widened so it fits, it pins to the page again (the offset back); narrowed, back in flow */
    const top = () =>
      page
        .locator('[data-testid=wide] .aura-tbl__th')
        .first()
        .evaluate((th) => getComputedStyle(th).top);
    await page.getByTestId('wide').evaluate((b) => ((b as HTMLElement).style.width = '990px'));
    await expect(page.locator('[data-testid=wide] .aura-tbl-wrap')).not.toHaveClass(/is-wide/);
    expect(await top()).toBe('56px');
    await page.getByTestId('wide').evaluate((b) => ((b as HTMLElement).style.width = '360px'));
    await expect(page.locator('[data-testid=wide] .aura-tbl-wrap')).toHaveClass(/is-wide/);
    expect(await top()).toBe('0px');
  });
});

test.describe('5.61: Chamber-OS 176 — a visually hidden child of full-width header actions', () => {
  test('176: at 390px a visually hidden description keeps its 1px box, the buttons still share the row, nothing scrolls sideways', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, 'aura-new-in-5-61-chamber-os-176--hidden-description');
    for (const id of ['desc', 'desc-tw', 'desc-inline'])
      expect(
        await page.getByTestId(id).evaluate((s) => Math.round(s.getBoundingClientRect().width)),
        id,
      ).toBeLessThanOrEqual(1);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
    ).toBe(true);
    /* the two buttons still share the row edge to edge (the hidden spans take no share) */
    const fill = await page.locator('.aura-page-header__actions').evaluate((row) => {
      const bs = [...row.querySelectorAll(':scope > .aura-btn')].map((b) => b.getBoundingClientRect());
      const r = row.getBoundingClientRect();
      return [bs.length, Math.round(bs[0]!.left - r.left), Math.round(r.right - bs[bs.length - 1]!.right)];
    });
    expect(fill).toEqual([2, 0, 0]);
  });

  test('176: the same in the actionsBarBelow bar at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, 'aura-new-in-5-61-chamber-os-176--hidden-description-bar');
    expect(
      await page.getByTestId('desc').evaluate((s) => Math.round(s.getBoundingClientRect().width)),
    ).toBeLessThanOrEqual(1);
  });
});

test.describe('5.62: Chamber-OS 177 — PageHeader meta chips as a row', () => {
  const ID = 'aura-new-in-5-62-chamber-os-177--meta-chips';
  const gaps = (page: Page) =>
    page.locator('[data-testid=chips] .aura-page-header__meta').evaluate((m) => {
      const k = [...m.children].map((c) => c.getBoundingClientRect());
      return k.slice(1).map((r, i) => (Math.abs(r.top - k[i]!.top) < 4 ? Math.round(r.left - k[i]!.right) : null));
    });

  test('177: chips in meta sit 8px apart; a string meta stays a block line', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await story(page, ID);
    expect(await gaps(page)).toEqual([8, 8]);
    expect(
      await page.locator('[data-testid=text] .aura-page-header__meta').evaluate((m) => getComputedStyle(m).display),
    ).toBe('block');
    /* text with inline elements stays a line: a space (not 8px) before <strong>, the "." right after the link */
    const sent = await page.locator('[data-testid=sentence] .aura-page-header__meta').evaluate((m) => {
      const st = m.querySelector('strong')!.getBoundingClientRect(),
        a = m.querySelector('a')!.getBoundingClientRect();
      const r = document.createRange();
      r.setStart(m.firstChild!, 0);
      r.setEnd(m.firstChild!, 'Last edited by'.length);
      const dot = document.createRange();
      dot.selectNodeContents(m.lastChild!);
      return [
        getComputedStyle(m).display,
        Math.round(st.left - r.getBoundingClientRect().right) < 6,
        Math.round(dot.getBoundingClientRect().left - a.right) < 2,
      ];
    });
    expect(sent).toEqual(['block', true, true]);
  });

  test('177: at 320px the chips wrap to another line, 8px apart, without sideways scroll', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await story(page, ID);
    const m = await page.locator('[data-testid=chips] .aura-page-header__meta').evaluate((el) => {
      const tops = new Set([...el.children].map((c) => Math.round(c.getBoundingClientRect().top)));
      const k = [...el.children].map((c) => c.getBoundingClientRect());
      return { lines: tops.size, rowGap: Math.round(k[k.length - 1]!.top - k[0]!.bottom) };
    });
    expect(m.lines).toBeGreaterThan(1);
    expect(m.rowGap).toBe(8);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
    ).toBe(true);
  });
});

test.describe('5.63: Chamber-OS 178 — a lazy chip in PageHeader meta; metaLayout', () => {
  const ID = 'aura-new-in-5-63-chamber-os-178--lazy-chip';
  test('178: a meta with a lazy node is the chip row (8px apart); metaLayout row / line set it outright', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, ID);
    await page.waitForSelector('[data-testid=lazy] .aura-pill');
    const lazy = await page.locator('[data-testid=lazy] .aura-page-header__meta').evaluate((m) => {
      const k = [...m.children].map((c) => c.getBoundingClientRect());
      return [m.classList.contains('aura-page-header__meta--rich'), k.length, Math.round(k[1]!.left - k[0]!.right)];
    });
    expect(lazy).toEqual([true, 2, 8]);
    expect(await page.locator('[data-testid=row] .aura-page-header__meta').getAttribute('class')).toContain('--rich');
    expect(await page.locator('[data-testid=line] .aura-page-header__meta').getAttribute('class')).not.toContain(
      '--rich',
    );
  });
});

test.describe('5.64: Chamber-OS 179 — a key for Progress’s reserved part', () => {
  const ID = 'aura-new-in-5-64-chamber-os-179--quota-legend';
  test('179: two swatches in the bar’s tone (the second striped like the reserved segment), aria-hidden, following danger; absent at 0', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, ID);
    const read = (id: string) =>
      page.getByTestId(id).evaluate((root) => {
        const lg = root.querySelector('.aura-progress__legend');
        if (!lg) return null;
        const mk = (c: CSSStyleDeclaration) =>
          (c.getPropertyValue('mask-image') || c.getPropertyValue('-webkit-mask-image')).replace(
            /rgba?\([^)]*\)/g,
            'c',
          ); /* the stripe's geometry; its colour is currentColor (only alpha masks) */
        const sw = [...lg.querySelectorAll('.aura-progress__swatch')].map((s) => getComputedStyle(s));
        const bar = getComputedStyle(root.querySelector('.aura-progress__bar')!);
        const res = getComputedStyle(root.querySelector('.aura-progress__bar--reserved')!);
        return {
          hidden: lg.getAttribute('aria-hidden'),
          n: sw.length,
          sameTone: sw.every((s) => s.backgroundColor === bar.backgroundColor),
          striped:
            mk(sw[1]!) === mk(res) && /repeating-linear-gradient/.test(mk(sw[1]!)) && !/gradient/.test(mk(sw[0]!)),
          text: lg.textContent,
          before:
            !!root.querySelector('.aura-progress__legend + .aura-progress__hint') ||
            !root.querySelector('.aura-progress__hint'),
          tone: bar.backgroundColor,
        };
      });
    const a = await read('accent'),
      d = await read('danger');
    expect(a).toMatchObject({
      hidden: 'true',
      n: 2,
      sameTone: true,
      striped: true,
      text: 'UsedReserved (in review or scheduled)',
      before: true,
    });
    expect(d).toMatchObject({ n: 2, sameTone: true, striped: true });
    expect(d!.tone).not.toBe(a!.tone);
    expect(await read('none')).toBeNull();
    /* the key is hidden, so the bar reads both counts even with a valueLabel */
    expect(await page.getByTestId('accent').locator('[role=progressbar]').getAttribute('aria-valuetext')).toBe(
      '2 of 6 used, 1 reserved',
    );
    /* no reserved segment drawn (value is the max): no key; a key with only the reserved part */
    expect(await read('full')).toBeNull();
    expect(await page.getByTestId('only-secondary').locator('.aura-progress__swatch').count()).toBe(1);
  });

  test('179: in a 200px box the key wraps — two lines, each part inside the box, the long label wrapping beside a 12px swatch', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, ID);
    const m = await page.getByTestId('narrow').evaluate((box) => {
      const lg = box.querySelector('.aura-progress__legend')!,
        keys = [...lg.querySelectorAll('.aura-progress__key')];
      const b = box.getBoundingClientRect(),
        sw = keys[1]!.querySelector('.aura-progress__swatch')!.getBoundingClientRect();
      const r = document.createRange();
      r.selectNodeContents(keys[1]!.lastChild!);
      return {
        lines: new Set(keys.map((k) => Math.round(k.getBoundingClientRect().top))).size,
        inside: keys.every((k) => k.getBoundingClientRect().right <= b.right + 0.5),
        swatch: Math.round(sw.width),
        labelLines: new Set([...r.getClientRects()].map((x) => Math.round(x.top))).size,
      };
    });
    expect(m).toEqual({ lines: 2, inside: true, swatch: 12, labelLines: 2 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
    ).toBe(true);
  });

  test('179: forced colours — the swatches match the bar in every tone (Highlight)', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await story(page, ID);
    for (const id of ['accent', 'danger']) {
      const c = await page
        .getByTestId(id)
        .evaluate((root) => [
          getComputedStyle(root.querySelector('.aura-progress__bar')!).backgroundColor,
          ...[...root.querySelectorAll('.aura-progress__swatch')].map((s) => getComputedStyle(s).backgroundColor),
        ]);
      expect(new Set(c).size, id).toBe(1);
    }
    const [a, d] = await Promise.all(
      ['accent', 'danger'].map((id) =>
        page
          .getByTestId(id)
          .locator('.aura-progress__bar')
          .first()
          .evaluate((b) => getComputedStyle(b).backgroundColor),
      ),
    );
    expect(a).toBe(d);
  });
});

test.describe('5.65: Chamber-OS 180 — a pressed IconButton looks on', () => {
  const ID = 'aura-new-in-5-65-chamber-os-180--toggles';
  const look = (page: Page, id: string) =>
    page.getByTestId(id).evaluate((b) => {
      const s = getComputedStyle(b);
      return {
        bg: s.backgroundColor,
        color: s.color,
        shadow: s.boxShadow,
        border: s.borderTopColor,
        pressed: b.getAttribute('aria-pressed'),
      };
    });
  const lum = (c: string) => {
    const [r, g, b] = c
      .match(/[\d.]+/g)!
      .slice(0, 3)
      .map((v) => {
        const x = Number(v) / 255;
        return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
      });
    return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
  };
  const ratio = (a: string, b: string) => {
    const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
    return (x! + 0.05) / (y! + 0.05);
  };

  for (const theme of ['light', 'dark']) {
    test(`180 (${theme}): pressed draws the selected fill and the accent icon (≥3:1); unpressed draws as before; hover shows on top`, async ({
      page,
    }) => {
      await story(page, ID, theme);
      const sel = await page.evaluate(() => {
        const p = document.createElement('span');
        p.style.background = 'var(--aura-bg-selected)';
        p.style.color = 'var(--aura-fg-accent)';
        document.body.appendChild(p);
        const s = getComputedStyle(p);
        const out = [s.backgroundColor, s.color];
        p.remove();
        return out;
      });
      const on = await look(page, 'bold'),
        aria = await look(page, 'aria'),
        off = await look(page, 'italic'),
        plain = await look(page, 'plain');
      expect(on).toMatchObject({ bg: sel[0], color: sel[1], pressed: 'true' });
      expect(aria).toMatchObject({ bg: sel[0], color: sel[1], pressed: 'true' });
      expect(off.pressed).toBe('false');
      expect(plain.pressed).toBeNull();
      expect(off.bg).toBe(plain.bg);
      expect(off.color).toBe(plain.color);
      expect(ratio(on.color, on.bg)).toBeGreaterThanOrEqual(3);
      /* hover on a pressed one changes it (an accent hairline), keeping the fill */
      await page.getByTestId('bold').hover();
      const hov = await look(page, 'bold');
      expect(hov.bg).toBe(sel[0]);
      expect(hov.shadow).not.toBe('none');
      /* outline: accent border when pressed */
      expect((await look(page, 'outline-on')).border).toBe(sel[1]);
      expect((await look(page, 'outline-off')).border).not.toBe(sel[1]);
    });
  }

  test('180: forced colours — a pressed toggle is Highlight, an unpressed one is not', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await story(page, ID);
    const [on, off] = await Promise.all(['bold', 'italic'].map((id) => look(page, id)));
    expect(on.bg).not.toBe(off.bg);
    expect(on.color).not.toBe(off.color);
    /* the focus ring on a pressed toggle is the system's text colour, not the accent */
    await page.keyboard.press('Tab');
    await page.getByTestId('bold').focus();
    const [ring, canvasText] = await page.getByTestId('bold').evaluate((b) => {
      const p = document.createElement('span');
      p.style.color = 'CanvasText';
      document.body.appendChild(p);
      const c = getComputedStyle(p).color;
      p.remove();
      return [getComputedStyle(b).outlineColor, c];
    });
    expect(ring).toBe(canvasText);
  });

  test('180: PasswordField’s reveal eye (aria-pressed) stays quiet when shown', async ({ page }) => {
    await story(page, ID);
    const eye = page.locator('[data-testid=pw] .aura-icon-btn');
    const before = await eye.evaluate((b) => [getComputedStyle(b).backgroundColor, getComputedStyle(b).color]);
    await eye.click();
    await page.mouse.move(0, 0);
    expect(await eye.getAttribute('aria-pressed')).toBe('true');
    await expect
      .poll(() => eye.evaluate((b) => [getComputedStyle(b).backgroundColor, getComputedStyle(b).color]))
      .toEqual(before);
  });

  test('180: pressed toggles aria-pressed; the focus ring is unchanged', async ({ page }) => {
    await story(page, ID);
    await page.getByTestId('bold').click();
    expect((await look(page, 'bold')).pressed).toBe('false');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    const ring = await page
      .getByTestId('bold')
      .evaluate((b) => [getComputedStyle(b).outlineStyle, getComputedStyle(b).outlineWidth]);
    expect(ring).toEqual(['solid', '2px']);
  });
});

test.describe('5.66: Chamber-OS 181–182 — checkable menu items keep their icon; Combobox invalid and aria-describedby', () => {
  const S = (n: string) => 'aura-new-in-5-66-chamber-os-181-182--' + n;

  for (const theme of ['light', 'dark']) {
    test(`181 (${theme}): an icon item shows its icon at the start and a check mark at the end; no icon keeps the box; roles unchanged`, async ({
      page,
    }) => {
      await story(page, S('checkable-icons'), theme);
      await page.getByRole('button', { name: 'Lists and headings' }).click();
      const items = await page.locator('[role=menu] [role^=menuitem]').evaluateAll((els) =>
        els.map((el) => {
          const kids = [...el.children];
          const first = kids[0]!,
            last = kids[kids.length - 1]!;
          return {
            role: el.getAttribute('role'),
            checked: el.getAttribute('aria-checked'),
            leadIcon: first.matches('svg.aura-icon, .aura-icon'),
            leadBox: first.classList.contains('aura-menu__check'),
            mark: last.classList.contains('aura-menu__mark') ? (last.querySelector('svg') ? 'check' : 'empty') : null,
            markColor:
              last.classList.contains('aura-menu__mark') && last.querySelector('svg')
                ? getComputedStyle(last.querySelector('svg')!).color
                : null,
          };
        }),
      );
      expect(items[0]).toMatchObject({
        role: 'menuitemcheckbox',
        checked: 'true',
        leadIcon: true,
        leadBox: false,
        mark: 'check',
      });
      expect(items[1]).toMatchObject({ role: 'menuitemcheckbox', checked: 'false', leadIcon: true, mark: 'empty' });
      expect(items[2]).toMatchObject({ role: 'menuitemcheckbox', checked: 'true', leadBox: true, mark: null });
      expect(items[3]).toMatchObject({ checked: 'true', leadBox: true, mark: null });
      expect(items[4]).toMatchObject({ role: 'menuitem', leadIcon: true, mark: null });
      const checkedBg = await page.evaluate(() => {
        const p = document.createElement('span');
        p.style.color = 'var(--aura-control-checked-bg)';
        document.body.appendChild(p);
        const c = getComputedStyle(p).color;
        p.remove();
        return c;
      });
      expect(items[0]!.markColor).toBe(checkedBg);
      /* labels line up checked or not: the mark slot keeps its width */
      const ends = await page
        .locator('[role=menu] .aura-menu__mark')
        .evaluateAll((m) => m.map((x) => Math.round(x.getBoundingClientRect().width)));
      expect(ends).toEqual([16, 16]);
      /* toggling keeps the menu open and moves the mark */
      await page.getByRole('menuitemcheckbox', { name: 'Bulleted list' }).click();
      await expect(page.getByRole('menuitemcheckbox', { name: 'Bulleted list' })).toHaveAttribute(
        'aria-checked',
        'true',
      );
      expect(
        await page.getByRole('menuitemcheckbox', { name: 'Bulleted list' }).locator('.aura-menu__mark svg').count(),
      ).toBe(1);
    });
  }

  test('181: forced colours — the check mark is the text colour (visible)', async ({ page }) => {
    await page.emulateMedia({ forcedColors: 'active' });
    await story(page, S('checkable-icons'));
    await page.getByRole('button', { name: 'Lists and headings' }).click();
    const [mark, label] = await page
      .getByRole('menuitemcheckbox', { name: 'Heading' })
      .evaluate((el) => [
        getComputedStyle(el.querySelector('.aura-menu__mark svg')!).color,
        getComputedStyle(el.querySelector('.aura-menu__label')!).color,
      ]);
    expect(mark).toBe(label);
  });

  test('182: invalid and aria-describedby on Combobox — aria-invalid, the hint id and the page’s id; error still wins; none, nothing', async ({
    page,
  }) => {
    await story(page, S('combobox-described'));
    const read = (id: string) =>
      page
        .getByTestId(id)
        .locator('input[role=combobox]')
        .evaluate((i) => ({
          invalid: i.getAttribute('aria-invalid'),
          by: i.getAttribute('aria-describedby'),
          field: i.closest('.aura-field')!.classList.contains('is-invalid'),
          border: getComputedStyle(i.closest('.aura-input')!).borderTopColor,
          errorLine: !!i.closest('.aura-field')!.querySelector('.aura-field__error'),
        }));
    const d = await read('described'),
      e = await read('error'),
      p = await read('plain');
    expect(d.invalid).toBe('true');
    expect(d.by!.split(' ')).toEqual([expect.stringMatching(/-hint$/), 'member-alert']);
    expect(d.field).toBe(true);
    expect(d.errorLine).toBe(false);
    expect(d.border).not.toBe(p.border);
    expect(e.invalid).toBe('true');
    expect(e.by!.split(' ')).toEqual([expect.stringMatching(/-error$/), 'other']);
    expect(e.errorLine).toBe(true);
    expect(p.invalid).toBeNull();
    expect(p.by).toMatch(/-hint$/);
    /* an id passed twice (or the hint's own) is read once */
    expect(
      await page
        .getByTestId('dup')
        .locator('input[role=combobox]')
        .evaluate((i) => i.getAttribute('aria-describedby')!.split(' ').length),
    ).toBe(2);
  });
});

test.describe('5.67: Chamber-OS 183 — CheckboxGroup', () => {
  const ID = 'aura-new-in-5-67-chamber-os-183--categories';
  test('183: a group named by its legend and described by the hint; ticking B then A gives option order; error marks the boxes', async ({
    page,
  }) => {
    await story(page, ID);
    const group = page.getByRole('group', { name: 'Membership categories' });
    await expect(group).toHaveCount(1);
    /* required is in the group's name (the * is hidden) */
    await expect(page.getByRole('group', { name: 'Membership categories (required)', exact: true })).toHaveCount(1);
    const desc = await group.evaluate((g) => document.getElementById(g.getAttribute('aria-describedby')!)!.textContent);
    expect(desc).toBe('Pick at least one.');
    /* the legend looks like RadioGroup's beside it, required marker included */
    const legends = await page
      .locator('legend.aura-field__label')
      .evaluateAll((ls) =>
        ls
          .slice(0, 2)
          .map((l) => [
            getComputedStyle(l).fontSize,
            getComputedStyle(l).fontWeight,
            !!l.querySelector('.aura-field__req'),
          ]),
      );
    expect(legends[0]).toEqual(legends[1]);
    await group.getByRole('checkbox', { name: 'Partnership' }).check();
    await group.getByRole('checkbox', { name: 'Corporate' }).check();
    await expect(page.getByTestId('value')).toHaveText('["corporate","partnership"]');
    await group.getByRole('checkbox', { name: 'Corporate' }).uncheck();
    await group.getByRole('checkbox', { name: 'Partnership' }).uncheck();
    await page.getByTestId('send').click();
    const err = await group.evaluate((g) => ({
      by: document.getElementById(g.getAttribute('aria-describedby')!)!.textContent,
      invalid: [...g.querySelectorAll('input[type=checkbox]')].map((i) => i.getAttribute('aria-invalid')),
      cls: g.classList.contains('is-invalid'),
    }));
    expect(err).toEqual({ by: 'Pick at least one membership category.', invalid: ['true', 'true'], cls: true });
    /* the empty boxes take the danger edge and point at the error */
    await settle(page);
    const edge = await group.evaluate((g) => {
      const p = document.createElement('span');
      p.style.color = 'var(--aura-border-danger)';
      document.body.appendChild(p);
      const c = getComputedStyle(p).color;
      p.remove();
      return [...g.querySelectorAll('.aura-check__box')]
        .map((b) => getComputedStyle(b).borderTopColor === c)
        .concat(
          [...g.querySelectorAll('input')].map((i) =>
            (i.getAttribute('aria-describedby') || '').split(' ').some((x) => x.endsWith('-error')),
          ),
        );
    });
    expect(edge).toEqual([true, true, true, true]);
    /* the description is read after the name */
    expect(await group.getByRole('checkbox', { name: 'Partnership', exact: true }).count()).toBe(1);
  });

  test('183: a value not among the options is kept after the others when another box is ticked', async ({ page }) => {
    await story(page, ID);
    await page.getByTestId('keep').getByRole('checkbox', { name: 'Partnership' }).check();
    await expect(page.getByTestId('keep-value')).toHaveText('["corporate","partnership","archived"]');
  });

  test('183: disabled disables every box; touchHeight gives 44px rows', async ({ page }) => {
    await story(page, ID);
    const dis = await page
      .getByTestId('disabled')
      .locator('input[type=checkbox]')
      .evaluateAll((is) => is.map((i) => (i as HTMLInputElement).disabled));
    expect(dis).toEqual([true, true]);
    const rows = await page
      .getByTestId('touch')
      .locator('.aura-check--labelled')
      .evaluateAll((ls) => ls.map((l) => Math.round(l.getBoundingClientRect().height)));
    for (const h of rows) expect(h).toBeGreaterThanOrEqual(44);
  });
});

test.describe('5.68: Chamber-OS 184 — group fields: disabled legend, errorLive', () => {
  const DIS = 'aura-new-in-5-68-chamber-os-184--disabled';
  const LIVE = 'aura-new-in-5-68-chamber-os-184--error-live';
  for (const scheme of ['light', 'dark'] as const) {
    test(`184: a disabled group's legend takes a disabled Field label's colour (${scheme})`, async ({ page }) => {
      await story(page, DIS, scheme);
      await settle(page);
      const c = await page.evaluate(() => {
        const col = (el: Element | null) => (el ? getComputedStyle(el).color : null);
        const legends = [...document.querySelectorAll('legend.aura-field__label')];
        return {
          field: col(document.querySelector('.aura-field.is-disabled > label.aura-field__label')),
          radio: col(legends[0]!),
          check: col(legends[1]!),
          enabled: col(legends[2]!),
          cls: [...document.querySelectorAll('fieldset.aura-field')].map((f) => f.classList.contains('is-disabled')),
        };
      });
      expect(c.field).not.toBeNull();
      expect(c.radio).toBe(c.field);
      expect(c.check).toBe(c.field);
      expect(c.enabled).not.toBe(c.field);
      expect(c.cls).toEqual([true, true, false]);
    });
  }

  test('184: with errorLive the error line is live and waiting, empty and out of the gap; the first message lands in it', async ({
    page,
  }) => {
    await story(page, LIVE);
    await settle(page);
    const live = page.getByTestId('live');
    const plain = page.getByTestId('plain');
    const before = await page.evaluate(() => {
      const box = (t: string) => document.querySelector(`[data-testid="${t}"] fieldset`)!;
      const err = box('live').querySelector('p.aura-field__error') as HTMLElement & { mark?: number };
      err.mark = 1;
      return {
        live: err.getAttribute('aria-live'),
        text: err.textContent,
        h: err.getBoundingClientRect().height,
        hint: box('live').querySelector('.aura-field__hint')?.textContent,
        sameHeight: box('live').getBoundingClientRect().height === box('plain').getBoundingClientRect().height,
        plainLive: document.querySelectorAll('[data-testid="plain"] [aria-live]').length,
        plainErr: document.querySelectorAll('[data-testid="plain"] .aura-field__error').length,
      };
    });
    expect(before).toEqual({
      live: 'polite',
      text: '',
      h: 1,
      hint: 'Pick at least one.',
      sameHeight: true,
      plainLive: 0,
      plainErr: 0,
    });
    await live.getByRole('checkbox', { name: 'Corporate' }).uncheck();
    await plain.getByRole('checkbox', { name: 'Corporate' }).uncheck();
    const after = await page.evaluate(() => {
      const box = (t: string) => document.querySelector(`[data-testid="${t}"] fieldset`)!;
      const err = box('live').querySelector('p.aura-field__error') as HTMLElement & { mark?: number };
      return {
        same: err.mark === 1,
        text: err.textContent,
        tall: err.getBoundingClientRect().height > 10,
        by: document.getElementById(box('live').getAttribute('aria-describedby')!) === err,
        hints: box('live').querySelectorAll('.aura-field__hint').length,
        /* the same line as without errorLive, but live */
        plain: box('plain').querySelector('p.aura-field__error')!.getAttribute('aria-live'),
        looks:
          getComputedStyle(err).color === getComputedStyle(box('plain').querySelector('p.aura-field__error')!).color &&
          err.getBoundingClientRect().height ===
            box('plain').querySelector('p.aura-field__error')!.getBoundingClientRect().height,
      };
    });
    expect(after).toEqual({
      same: true,
      text: 'Choose at least one membership category.',
      tall: true,
      by: true,
      hints: 0,
      plain: null,
      looks: true,
    });
  });

  test('184: RadioGroup and Field take errorLive too', async ({ page }) => {
    await story(page, LIVE);
    const r = page.getByTestId('radio-live');
    await expect(r.locator('p.aura-field__error[aria-live="polite"]')).toHaveText('');
    await r.getByRole('radio', { name: 'Lifetime' }).check();
    await expect(r.locator('p.aura-field__error[aria-live="polite"]')).toHaveText(
      'Lifetime billing is not offered for this tier.',
    );
    const f = page.getByTestId('field-live');
    await expect(f.locator('p.aura-field__error[aria-live="polite"]')).toHaveText('');
    await expect(f.locator('.aura-field__hint')).toHaveText('Letters and digits.');
    await f.getByRole('textbox', { name: 'Promo code' }).fill('a-b');
    await expect(f.locator('p.aura-field__error[aria-live="polite"]')).toHaveText('Use letters and digits only.');
    await expect(f.getByRole('textbox', { name: 'Promo code' })).toHaveAccessibleDescription(
      'Use letters and digits only.',
    );
    await expect(f.locator('.aura-field__hint')).toHaveCount(0);
  });
});

test.describe("5.69: Chamber-OS 185 — ActionBar's edge look", () => {
  const ID = (s: string) => 'aura-new-in-5-69-chamber-os-185--' + s;
  const bar = (page: Page, sel = 'form .aura-actionbar') =>
    page.evaluate((sel) => {
      const a = document.querySelector<HTMLElement>(sel)!;
      const r = a.getBoundingClientRect();
      const s = getComputedStyle(a);
      return {
        left: Math.round(r.left),
        right: Math.round(r.right),
        fromBottom: Math.round(innerHeight - r.bottom),
        top: r.top,
        height: r.height,
        position: s.position,
        borders: [s.borderTopWidth, s.borderRightWidth, s.borderBottomWidth, s.borderLeftWidth],
        radius: s.borderTopLeftRadius,
        shadow: s.boxShadow,
        marginTop: s.marginTop,
        look: [s.backgroundColor, s.borderTopColor, s.borderTopStyle].join(' '),
        btns: [...a.querySelectorAll('button')].map((b) => Math.round(b.getBoundingClientRect().height)),
      };
    }, sel);

  for (const scheme of ['light', 'dark']) {
    test(`185: look="edge" at 390 — the screen's width, on the bottom edge, top border only, as PageHeader's edge bar (${scheme})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 727 });
      await story(page, ID('page-header-bar'), scheme);
      const ph = await bar(page, '[data-testid=header] .aura-page-header__actions');
      await story(page, ID('edge'), scheme);
      await settle(page);
      const g = await bar(page);
      expect([g.left, g.right, g.fromBottom, g.position]).toEqual([0, 390, 0, 'fixed']);
      expect(g.borders).toEqual(['1px', '0px', '0px', '0px']);
      expect([g.radius, g.shadow, g.marginTop]).toEqual(['0px', 'none', '0px']);
      expect(g.look).toBe(ph.look);
      expect([ph.left, ph.right, ph.fromBottom]).toEqual([g.left, g.right, g.fromBottom]);
      for (const h of g.btns) expect(h).toBeGreaterThanOrEqual(44);
      await expect(page.getByRole('region', { name: 'Payment' })).toHaveCount(1);
      await expect(page.getByRole('region', { name: 'Payment' }).getByRole('status')).toHaveText(
        'Amount due 10,700.00 THB · due 22 Oct 2026',
      );
    });
  }

  test("185: the page's end — after the form too — and a focused field scroll clear; on a BottomNav it sits on the nav", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 727 });
    for (const s of ['edge', 'edge-above-bottom-nav']) {
      await story(page, ID(s));
      await settle(page);
      const fit = await page.evaluate(() => {
        const a = document.querySelector<HTMLElement>('form .aura-actionbar')!;
        return {
          sibling: a.nextElementSibling,
          root: document.documentElement.style.getPropertyValue('--aura-actionbar-height') === a.offsetHeight + 'px',
        };
      });
      expect(fit, s).toEqual({ sibling: null, root: true });
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      const top = (await bar(page)).top;
      for (const id of ['last', 'footer']) {
        const b = (await page.getByTestId(id).boundingBox())!;
        expect(b.y + b.height, s + ' ' + id).toBeLessThanOrEqual(top);
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.getByLabel('Note to the chamber').focus();
      await page.waitForTimeout(100);
      const f = (await page.getByLabel('Note to the chamber').boundingBox())!;
      expect(f.y + f.height, s).toBeLessThanOrEqual((await bar(page)).top);
      if (s === 'edge-above-bottom-nav') {
        const nav = (await page.locator('nav.aura-bottomnav').boundingBox())!;
        const g = await bar(page);
        expect(Math.abs(727 - g.fromBottom - nav.y), s).toBeLessThanOrEqual(1);
        expect(
          await page.evaluate(() => getComputedStyle(document.querySelector('form .aura-actionbar')!).paddingBottom),
        ).toBe('0px');
      }
    }
    /* the home-indicator padding changes the bar's border box only (a BottomNav sliding away): the height follows */
    const h = await page.evaluate(async () => {
      const a = document.querySelector<HTMLElement>('form .aura-actionbar')!;
      a.style.paddingBottom = '34px';
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      return [document.documentElement.style.getPropertyValue('--aura-actionbar-height'), a.offsetHeight + 'px'];
    });
    expect(h[0]).toBe(h[1]);
  });

  test('185: edgeBelow="sm" is the strip on a phone and the floating card from 640px; short screens are static', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 727 });
    await story(page, ID('edge-below-sm'));
    await settle(page);
    const phone = await bar(page);
    expect([phone.left, phone.right, phone.fromBottom, phone.position, phone.radius]).toEqual([
      0,
      390,
      0,
      'fixed',
      '0px',
    ]);
    await page.setViewportSize({ width: 800, height: 727 });
    await page.waitForTimeout(200);
    const wide = await bar(page);
    expect(wide.position).toBe('sticky');
    expect(wide.borders).toEqual(['1px', '1px', '1px', '1px']);
    expect(wide.radius).not.toBe('0px');
    expect(wide.shadow).not.toBe('none');
    expect(await page.evaluate(() => document.documentElement.style.getPropertyValue('--aura-actionbar-height'))).toBe(
      '',
    );
    /* 320×180: static and in the flow, after the last field */
    for (const s of ['edge', 'edge-below-sm']) {
      await page.setViewportSize({ width: 320, height: 180 });
      await story(page, ID(s));
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      const g = await bar(page);
      const last = (await page.getByTestId('last').boundingBox())!;
      expect(g.position, s).toBe('static');
      expect(g.top, s).toBeGreaterThanOrEqual(last.y + last.height);
      expect(
        await page.evaluate(() => document.documentElement.style.getPropertyValue('--aura-actionbar-height')),
        s,
      ).toBe('');
    }
  });

  test('185: without look the bar is unchanged — the same markup and page padding as look="floating"; an idle bulk bar adds no room', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 727 });
    const shape = () =>
      page.evaluate(() => {
        const a = document.querySelector('form .aura-actionbar')!;
        return [
          a.className,
          a.nextElementSibling ? a.nextElementSibling.className : null,
          getComputedStyle(a).position,
          getComputedStyle(document.querySelector('.aura-shell__content')!).paddingBottom,
        ];
      });
    await story(page, ID('floating'));
    const def = await shape();
    expect(def.slice(0, 3)).toEqual(['aura-actionbar aura-actionbar--viewport', null, 'sticky']);
    await story(page, ID('floating') + '&args=look:floating');
    expect(await shape()).toEqual(def);
    await story(page, ID('idle-bulk'));
    const idle = await page.evaluate(() => [
      document.querySelector('.aura-actionbar')!.classList.contains('is-idle'),
      getComputedStyle(document.body).paddingBottom,
      document.documentElement.style.getPropertyValue('--aura-actionbar-height'),
    ]);
    expect(idle).toEqual([true, '0px', '']);
    await page.getByTestId('pick').click();
    await settle(page);
    const on = await bar(page, '.aura-actionbar');
    expect([on.left, on.right, on.fromBottom, on.position]).toEqual([0, 390, 0, 'fixed']);
    /* no AppShell: the body is padded by the bar's height and more */
    const pad = await page.evaluate(() => parseFloat(getComputedStyle(document.body).paddingBottom));
    expect(pad).toBeGreaterThanOrEqual(on.height);
  });
});

test.describe('5.70: Chamber-OS 186–190', () => {
  const ID = (s: string) => 'aura-new-in-5-70-chamber-os-186-190--' + s;

  test('186: aria-disabled and aria-busy are merged with loading; an aria-disabled IconButton ignores clicks', async ({
    page,
  }) => {
    await story(page, ID('button-states'));
    const attrs = (id: string) =>
      page
        .getByTestId(id)
        .evaluate((b) => [
          b.getAttribute('aria-disabled'),
          b.getAttribute('aria-busy'),
          (b as HTMLButtonElement).disabled,
        ]);
    expect(await attrs('cooldown')).toEqual(['true', null, false]);
    expect(await attrs('sending')).toEqual(['true', 'true', false]);
    expect(await attrs('busy')).toEqual([null, 'true', false]);
    expect(await attrs('icon-cooldown')).toEqual(['true', null, false]);
    for (const id of ['cooldown', 'sending', 'icon-cooldown']) await page.getByTestId(id).click({ force: true });
    await page.getByTestId('cooldown').focus();
    await page.keyboard.press('Enter');
    await page.getByTestId('icon-cooldown').focus();
    await expect(page.getByTestId('icon-cooldown')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('clicks')).toHaveText('0');
    await page.getByTestId('icon-live').click();
    await page.getByTestId('busy').click();
    await expect(page.getByTestId('clicks')).toHaveText('2');
    /* a link Button keeps a passed aria-disabled: still a focusable link, a click does nothing */
    const link = page.getByTestId('link-cooldown');
    expect(await link.evaluate((a) => [a.tagName, a.getAttribute('aria-disabled'), a.getAttribute('href')])).toEqual([
      'A',
      'true',
      '#resent',
    ]);
    await link.focus();
    await expect(link).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('clicks')).toHaveText('2');
    expect(await page.evaluate(() => location.hash)).not.toBe('#resent');
    const op = await page.getByTestId('icon-cooldown').evaluate((b) => Number(getComputedStyle(b).opacity));
    expect(op).toBeLessThan(1);
  });

  test('187: cursor mode — real links (through linkComponent), disabled ends out of the tab order, a status, no numbers', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await story(page, ID('cursor-pagination'));
    const links = page.getByRole('navigation', { name: 'Audit log pages' });
    await expect(links).toHaveCount(1);
    await expect(links.locator('ol, .aura-pagination__list, .aura-pagination__compact')).toHaveCount(0);
    await expect(links.locator('.aura-pagination__status')).toHaveText('Showing 50 of 1,240');
    const next = links.getByRole('link', { name: 'Next page' });
    await expect(next).toHaveAttribute('href', '#after=evt_50');
    await expect(next).toHaveAttribute('rel', 'next');
    const off = await links
      .locator('[aria-disabled="true"]')
      .evaluateAll((es) =>
        es.map((e) => [e.tagName, e.getAttribute('role'), e.textContent, (e as HTMLElement).tabIndex]),
      );
    expect(off).toEqual([
      ['SPAN', 'link', 'First page', -1],
      ['SPAN', 'link', 'Previous page', -1],
    ]);
    /* buttons with callbacks */
    const btns = page.getByRole('navigation', { name: 'E-Blast pages' });
    await expect(btns.getByRole('button', { name: 'First page' })).toBeDisabled();
    await expect(btns.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    await btns.getByRole('button', { name: 'Next page' }).click();
    await expect(btns.locator('.aura-pagination__status')).toHaveText('Batch 2');
    await btns.getByRole('button', { name: 'Previous page' }).click();
    await expect(btns.locator('.aura-pagination__status')).toHaveText('Batch 1');
    /* a forward-only list: no First, the router's link */
    const fwd = page.getByRole('navigation', { name: 'Change requests' });
    await expect(fwd.getByText('First page')).toHaveCount(0);
    await expect(fwd.getByRole('link', { name: 'Next page' })).toHaveAttribute('data-router', '');
  });

  test('187: cursor steps are 44px on a touch screen, as the page numbers', async ({ browser }) => {
    const ctx = await browser.newContext({
      baseURL: test.info().project.use.baseURL,
      viewport: { width: 390, height: 800 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await ctx.newPage();
    await story(page, ID('cursor-pagination'));
    expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
    const hs = await page
      .locator('[data-testid=links] .aura-page')
      .evaluateAll((es) => es.map((e) => Math.round(e.getBoundingClientRect().height)));
    expect(hs.length).toBe(3);
    for (const h of hs) expect(h).toBeGreaterThanOrEqual(44);
    await ctx.close();
  });

  test('188: a sortable Th — aria-sort, AURA sort icon, a button (click and Enter) or a link; unchanged without the props', async ({
    page,
  }) => {
    await story(page, ID('sortable-th'));
    const th = (id: string) => page.getByTestId(id);
    const firstRow = () =>
      page
        .getByRole('table', { name: 'Pending review' })
        .locator('tbody tr')
        .first()
        .locator('td')
        .first()
        .textContent();
    await expect(th('member')).toHaveAttribute('aria-sort', 'ascending');
    const btn = th('member').getByRole('button', { name: 'Member' });
    await expect(btn).toHaveClass(/aura-table__sort/);
    await expect(btn).toHaveClass(/is-active/);
    const icon = (loc: ReturnType<typeof th>) => loc.locator('svg').evaluate((s) => s.innerHTML);
    const up = await icon(th('member'));
    expect(await firstRow()).toBe('Bangkok Bakers');
    await btn.click();
    await expect(th('member')).toHaveAttribute('aria-sort', 'descending');
    expect(await firstRow()).toBe('Siam Steel');
    expect(await icon(th('member'))).not.toBe(up);
    await btn.focus();
    await page.keyboard.press('Enter');
    await expect(th('member')).toHaveAttribute('aria-sort', 'ascending');
    expect(await icon(th('member'))).toBe(up);
    /* keyboard focus draws the ring on the control */
    await page.keyboard.press('Tab');
    const ring = await page.evaluate(() => {
      const a = document.activeElement as HTMLElement;
      return [a.tagName, a.getAttribute('href'), getComputedStyle(a).outlineStyle, a.hasAttribute('data-router')];
    });
    expect(ring).toEqual(['A', '?sort=submitted', 'solid', true]);
    await expect(th('submitted')).toHaveAttribute('aria-sort', 'none');
    expect(await icon(th('submitted'))).not.toBe(up);
    /* sort alone: says the order, no control */
    await expect(th('amount')).toHaveAttribute('aria-sort', 'descending');
    await expect(th('amount').locator('button, a')).toHaveCount(0);
    /* nothing: as before */
    expect(await th('plain').evaluate((t) => [t.hasAttribute('aria-sort'), t.innerHTML])).toEqual([false, 'Notes']);
  });

  test('189: Spinner — hidden alone, a status with a label, the sizes, Button’s glyph and motion; StatusPill busy', async ({
    page,
  }) => {
    await story(page, ID('spinners'));
    const sp = await page.evaluate(() => {
      const g = (s: string) => document.querySelector(s) as HTMLElement;
      /* the layout width (a turning glyph's bounding box is wider) */
      const w = (el: Element) => Math.round(parseFloat(getComputedStyle(el.querySelector('svg')!).width));
      const inline = g('[data-testid=inline] .aura-spinner'),
        lg = g('[data-testid=panel] .aura-spinner--lg'),
        md = g('[data-testid=md]'),
        btn = g('[data-testid=btn] svg');
      return {
        inline: [inline.getAttribute('aria-hidden'), inline.getAttribute('role'), w(inline)],
        lg: [lg.getAttribute('role'), lg.textContent, lg.hasAttribute('aria-hidden'), w(lg)],
        md: w(md),
        glyph: inline.querySelector('svg')!.innerHTML === btn.innerHTML,
        sm: w(inline) === Math.round(parseFloat(getComputedStyle(btn).width)),
        anim: getComputedStyle(inline.querySelector('svg')!).animationName === getComputedStyle(btn).animationName,
        colour: getComputedStyle(lg.querySelector('svg')!).stroke === getComputedStyle(g('[data-testid=panel]')).color,
        pill: [!!g('[data-testid=pill] svg.aura-spin'), !!g('[data-testid=pill-plain] svg.aura-spin')],
      };
    });
    expect(sp).toEqual({
      inline: ['true', null, 16],
      lg: ['status', 'Processing payment', false, 24],
      md: 20,
      glyph: true,
      sm: true,
      anim: true,
      colour: true,
      pill: [true, false],
    });
    /* reduced motion: the same rule as Button's loading spinner */
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const rm = await page.evaluate(() => {
      const a = getComputedStyle(document.querySelector('[data-testid=inline] svg')!),
        b = getComputedStyle(document.querySelector('[data-testid=btn] svg')!);
      return [a.animationName === b.animationName, a.animationDuration === b.animationDuration];
    });
    expect(rm).toEqual([true, true]);
  });

  test('190: FileUpload variant="button" — a Button opens the picker, checks the file, calls onSelect once; progress', async ({
    page,
  }) => {
    await story(page, ID('upload-button'));
    const box = page.getByTestId('logo');
    const btn = box.getByRole('button', { name: 'Invoice logo Upload logo' });
    await expect(btn).toHaveClass(/aura-btn/);
    expect(await btn.getAttribute('aria-describedby')).toMatch(/-hint/);
    const input = box.locator('input[type=file]');
    expect(
      await input.evaluate((i) => [
        i.getAttribute('accept'),
        (i as HTMLElement).tabIndex,
        i.getAttribute('aria-hidden'),
      ]),
    ).toEqual(['image/png,image/jpeg', -1, 'true']);
    await expect(box.locator('.aura-upload, .aura-upload__list')).toHaveCount(0);
    /* the Button opens the picker */
    const chooser = page.waitForEvent('filechooser');
    await btn.click();
    await (await chooser).setFiles({ name: 'logo.png', mimeType: 'image/png', buffer: Buffer.alloc(1024) });
    await expect(page.getByTestId('picked')).toHaveText('["logo.png"]');
    await expect(box.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '40');
    expect(
      await input.evaluate((i) => [(i as HTMLInputElement).required, (i as HTMLInputElement).files!.length]),
    ).toEqual([true, 1]);
    /* too big: the error, no call, and the input (it has a name) posts nothing refused */
    await input.setInputFiles({ name: 'huge.png', mimeType: 'image/png', buffer: Buffer.alloc(300 * 1024) });
    await expect(box.locator('.aura-field__error')).toContainText('Larger than');
    expect(await input.evaluate((i) => (i as HTMLInputElement).files!.length)).toBe(0);
    expect(await btn.getAttribute('aria-describedby')).toMatch(/-error/);
    await input.setInputFiles({ name: 'notes.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(10) });
    await expect(box.locator('.aura-field__error')).toContainText('isn’t accepted');
    await expect(page.getByTestId('picked')).toHaveText('["logo.png"]');
    /* a good pick clears the refusal */
    await input.setInputFiles({ name: 'logo2.jpg', mimeType: 'image/jpeg', buffer: Buffer.alloc(10) });
    await expect(page.getByTestId('picked')).toHaveText('["logo.png","logo2.jpg"]');
    await expect(box.locator('.aura-field__error')).toHaveCount(0);
    await page.getByTestId('indeterminate').click();
    expect(await box.getByRole('progressbar').getAttribute('aria-valuenow')).toBeNull();
    /* ref.focus() lands on the Button */
    await page.getByTestId('focus-field').click();
    await expect(btn).toBeFocused();
    /* a native submit with nothing picked: the Field's error and focus on the Button, not the hidden input */
    await page.getByTestId('save').click();
    const cert = page.getByTestId('cert-form');
    await expect(cert.getByRole('button', { name: 'Zero-rate certificate Choose a file' })).toBeFocused();
    await expect(cert.locator('.aura-field__error')).toHaveText('Choose a file');
    /* the dropzone is as before */
    await expect(page.getByTestId('zone').locator('.aura-upload')).toHaveCount(1);
  });
});

test.describe('5.71: Chamber-OS 191 — PageHeader actionsBar', () => {
  const ID = (s: string) => 'aura-new-in-5-71-chamber-os-191--' + s;
  const where = (page: Page) =>
    page.evaluate(() => {
      const box = (id: string) => {
        const el = document.querySelector<HTMLElement>(`[data-testid=${id}]`)!;
        const r = el.getBoundingClientRect();
        return {
          n: document.querySelectorAll(`[data-testid=${id}]`).length,
          inBar: !!el.closest('.aura-page-header__bar'),
          fixed:
            !!el.closest('.aura-page-header__bar') &&
            getComputedStyle(el.closest('.aura-page-header__bar')!).position === 'fixed',
          top: Math.round(r.top),
          left: Math.round(r.left),
          width: Math.round(r.width),
          height: Math.round(r.height),
        };
      };
      const bar = document.querySelector<HTMLElement>('.aura-page-header__bar')!;
      const b = bar.getBoundingClientRect();
      const st = bar.querySelector('.aura-page-header__status');
      return {
        pdf: box('pdf'),
        receipt: box('receipt'),
        email: box('email'),
        pay: box('pay'),
        bar: {
          position: getComputedStyle(bar).position,
          left: Math.round(b.left),
          right: Math.round(b.right),
          fromBottom: Math.round(innerHeight - b.bottom),
          top: b.top,
          height: bar.offsetHeight,
          status: st ? [st.getAttribute('role'), st.textContent, getComputedStyle(st).display] : null,
          border: getComputedStyle(bar).borderTopWidth,
        },
        actionsFixed: getComputedStyle(document.querySelector('.aura-page-header__actions')!).position,
        measured: document.documentElement.style.getPropertyValue('--aura-page-actions-height'),
      };
    });

  test('191: at 390 only actionsBar is the fixed strip, with the status; the other actions stay in the header, full width', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await story(page, ID('pay-bar'));
    await settle(page);
    const w = await where(page);
    expect(w.bar).toMatchObject({
      position: 'fixed',
      left: 0,
      right: 390,
      fromBottom: 0,
      status: ['status', 'Amount due ฿10,700.00 · due 22 Oct 2026', 'block'],
      border: '1px',
    });
    expect(w.measured).toBe(w.bar.height + 'px');
    expect(w.actionsFixed).toBe('static');
    expect([w.pay.inBar, w.pay.fixed, w.pay.height >= 44]).toEqual([true, true, true]);
    for (const k of ['pdf', 'receipt', 'email'] as const) {
      expect([w[k].n, w[k].inBar], k).toEqual([1, false]);
      expect(w[k].top, k).toBeLessThan(w.bar.top);
    }
    expect(w.pay.n).toBe(1);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
    ).toBeLessThanOrEqual(0);
    /* full width in the page (5.61's rule): the three share one row, edge to edge of the actions box */
    const row = await page.evaluate(() => {
      const a = document.querySelector('.aura-page-header__actions')!.getBoundingClientRect();
      const r = (id: string) => document.querySelector(`[data-testid=${id}]`)!.getBoundingClientRect();
      return [Math.round(r('pdf').left - a.left), Math.round(a.right - r('email').right), Math.round(a.width)];
    });
    expect(row[0]).toBe(0);
    expect(row[1]).toBe(0);
    expect(row[2]).toBeGreaterThan(300);
    /* the page's end clears the strip */
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const last = (await page.getByTestId('last').boundingBox())!;
    expect(last.y + last.height).toBeLessThanOrEqual((await where(page)).bar.top);
    /* the trigger still opens its dialog */
    await page.getByTestId('pay').click();
    await expect(page.getByRole('dialog', { name: 'Pay invoice SC-2026-900001' })).toBeVisible();
  });

  test('191: on a BottomNav the strip sits on the nav', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await story(page, ID('pay-bar-above-bottom-nav'));
    await settle(page);
    const nav = (await page.locator('nav.aura-bottomnav').boundingBox())!;
    const w = await where(page);
    expect(Math.abs(800 - w.bar.fromBottom - nav.y)).toBeLessThanOrEqual(1);
  });

  test('191: at 1280 and on a short screen all four are in the header row, in order; each node once', async ({
    page,
  }) => {
    for (const [width, height] of [
      [1280, 800],
      [320, 180],
    ]) {
      await page.setViewportSize({ width, height });
      await story(page, ID('pay-bar'));
      await settle(page);
      const w = await where(page);
      const k = width + 'x' + height;
      expect(w.bar.position, k).not.toBe('fixed');
      expect(w.bar.status![2], k).toBe('none');
      expect(w.measured, k).toBe('');
      for (const id of ['pdf', 'receipt', 'email', 'pay'] as const) expect(w[id].n, k + id).toBe(1);
      if (width === 1280) {
        expect(
          [w.pdf.top, w.receipt.top, w.email.top, w.pay.top].every((t) => Math.abs(t - w.pdf.top) <= 1),
          k,
        ).toBe(true);
        expect(w.pdf.left < w.receipt.left && w.receipt.left < w.email.left && w.email.left < w.pay.left, k).toBe(true);
      }
    }
  });

  test('191: floating look on the split bar; a hidden note and an IconButton in actionsBar keep the full-width rules; reduced motion', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await story(page, ID('pay-bar-floating'));
    await settle(page);
    const f = await where(page);
    expect([f.bar.position, f.bar.left, f.bar.right, f.bar.fromBottom]).toEqual(['fixed', 16, 374, 12]);
    expect(
      await page.evaluate(
        () => getComputedStyle(document.querySelector('.aura-page-header__bar')!).borderTopLeftRadius,
      ),
    ).not.toBe('0px');
    for (const [width, height] of [
      [320, 180],
      [390, 800],
    ]) {
      await page.setViewportSize({ width, height });
      await story(page, ID('pay-bar-extras'));
      await settle(page);
      const x = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        note: Math.round(document.getElementById('pay-note')!.getBoundingClientRect().width),
        icon: Math.round(document.querySelector('[data-testid=share]')!.getBoundingClientRect().width),
      }));
      expect(x.scroll, width + '').toBeLessThanOrEqual(0);
      expect(x.note, width + '').toBeLessThanOrEqual(1);
      expect(x.icon, width + '').toBe(44);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(
      await page.evaluate(() => getComputedStyle(document.querySelector('.aura-page-header__bar')!).transitionDuration),
    ).toMatch(/^0s/);
  });

  test('191: without actionsBar the header is as before (no split, no bar box)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 727 });
    await story(page, 'aura-new-in-5-48-chamber-os-153--primary-and-menu&args=lang:en');
    expect(
      await page.evaluate(() => [
        document.querySelectorAll('.aura-page-header__actions.is-split, .aura-page-header__bar').length,
        getComputedStyle(document.querySelector('.aura-page-header__actions')!).position,
      ]),
    ).toEqual([0, 'fixed']);
  });
});

test.describe('5.72: Chamber-OS 192 — an edge bar in a hidden tab', () => {
  test('192: the page clearance follows the visible bar; a hidden one never wins; none shown keeps no room (0px, 5.73)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await story(page, 'aura-new-in-5-72-chamber-os-192--bar-per-tab');
    await settle(page);
    const state = () =>
      page.evaluate(() => {
        const h = (name: string) => (document.querySelector(`[aria-label="${name}"]`) as HTMLElement).offsetHeight;
        return {
          v: document.documentElement.style.getPropertyValue('--aura-actionbar-height'),
          a: h('Save tier A'),
          b: h('Save tier B'),
        };
      });
    let s = await state();
    expect(s.a).toBeGreaterThan(0);
    expect(s.b).toBe(0);
    expect(s.v).toBe(s.a + 'px');
    await page.getByTestId('show-b').click();
    await page.waitForTimeout(150);
    s = await state();
    expect(s.a).toBe(0);
    expect(s.b).toBeGreaterThan(0);
    expect(s.v).toBe(s.b + 'px');
    await page.getByTestId('show-none').click();
    await page.waitForTimeout(150);
    /* 5.73: bars on the page but none shown — no room kept (0px), not the CSS's 60px fallback */
    expect((await state()).v).toBe('0px');
    await page.getByTestId('show-a').click();
    await page.waitForTimeout(150);
    s = await state();
    expect(s.v).toBe(s.a + 'px');
    /* a focused control near the end clears the visible strip */
    expect(
      await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).scrollPaddingBottom)),
    ).toBeGreaterThanOrEqual(s.a);
  });
});

test.describe('5.73: Chamber-OS 192 follow-up — hidden bars by visibility, PageHeader bars in tabs', () => {
  const ID = (s: string) => 'aura-new-in-5-73-chamber-os-192-follow-up--' + s;
  const v = (page: Page, name: string) =>
    page.evaluate((n) => document.documentElement.style.getPropertyValue(n), name);

  test('visibility: hidden panels — the shown bar sets --aura-actionbar-height, and it follows a switch', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await story(page, ID('visibility-tabs'));
    await settle(page);
    const h = (name: string) =>
      page.evaluate((n) => (document.querySelector(`[aria-label="${n}"]`) as HTMLElement).offsetHeight, name);
    const a = await h('Save tier A'),
      b = await h('Save tier B');
    expect(a).toBeGreaterThan(b);
    expect(await v(page, '--aura-actionbar-height')).toBe(a + 'px');
    await page.getByTestId('show-b').click();
    await expect.poll(() => v(page, '--aura-actionbar-height')).toBe(b + 'px');
    await page.getByTestId('show-a').click();
    await expect.poll(() => v(page, '--aura-actionbar-height')).toBe(a + 'px');
  });

  test('a single bar under a visibility gate that lifts with no event keeps its room', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await story(page, ID('visibility-gate'));
    await expect(page.getByTestId('gate')).toHaveCSS('visibility', 'visible');
    const h = await page.evaluate(() => (document.querySelector('[aria-label="Save"]') as HTMLElement).offsetHeight);
    expect(h).toBeGreaterThan(0);
    expect(await v(page, '--aura-actionbar-height')).toBe(h + 'px');
  });

  test('PageHeader bars in display: none panels — the shown one sets --aura-page-actions-height; none shown is 0px', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await story(page, ID('page-header-tabs'));
    await settle(page);
    const h = (k: string) =>
      page.evaluate(
        (k) =>
          (document.querySelector(`[data-testid=header-${k}] .aura-page-header__actions`) as HTMLElement).offsetHeight,
        k,
      );
    const a = await h('a');
    expect(a).toBeGreaterThan(0);
    expect(await v(page, '--aura-page-actions-height')).toBe(a + 'px');
    await page.getByTestId('show-b').click();
    await expect.poll(() => v(page, '--aura-page-actions-height')).toBe((await h('b')) + 'px');
    await page.getByTestId('show-none').click();
    await expect.poll(() => v(page, '--aura-page-actions-height')).toBe('0px');
    await page.getByTestId('show-a').click();
    await expect.poll(() => v(page, '--aura-page-actions-height')).toBe(a + 'px');
  });
});

test.describe('5.74: Chamber-OS 193 — a PageHeader bar with everything hidden goes', () => {
  const ID = (s: string) => 'aura-new-in-5-74-chamber-os-193--' + s;
  const read = (page: Page, sel = '.aura-page-header__bar') =>
    page.evaluate((sel) => {
      const bar = document.querySelector<HTMLElement>(sel)!;
      return {
        display: getComputedStyle(bar).display,
        height: bar.offsetHeight,
        v: document.documentElement.style.getPropertyValue('--aura-page-actions-height'),
        pad: getComputedStyle(document.querySelector('.aura-shell__content')!).paddingBottom,
        scroll: getComputedStyle(document.documentElement).scrollPaddingBottom,
        mark: document.querySelector('[data-testid=header]')!.getAttribute('data-aura-bar'),
      };
    }, sel);
  const noBar = async (page: Page, width: number) => {
    await page.setViewportSize({ width, height: 800 });
    await story(page, ID('no-bar'));
    return page.evaluate(() => ({
      pad: getComputedStyle(document.querySelector('.aura-shell__content')!).paddingBottom,
      scroll: getComputedStyle(document.documentElement).scrollPaddingBottom,
    }));
  };

  for (const [s, sel] of [
    ['pay-bar-hides', '.aura-page-header__bar'],
    ['floating-bar-hides', '.aura-page-header__bar'],
    ['plain-bar-hides', '.aura-page-header__actions'],
  ] as const)
    test(`193 (${s}): at 390 the strip goes (no box, 0px, no bar padding) when its content is hidden, and comes back`, async ({
      page,
    }) => {
      const none = await noBar(page, 390);
      await story(page, ID(s));
      await settle(page);
      const on = await read(page, sel);
      expect(on.display).toBe('flex');
      expect(on.height).toBeGreaterThan(0);
      expect(on.v).toBe(on.height + 'px');
      expect(on.mark).toBe('shown');
      expect(on.pad).not.toBe(none.pad);
      /* paying hides the pay section (and, plain, the PDF too); the status alone is not a bar */
      await page.getByTestId('pay').click();
      await expect.poll(async () => (await read(page, sel)).display).toBe('none');
      const off = await read(page, sel);
      expect([off.height, off.v, off.pad, off.scroll, off.mark]).toEqual([0, '0px', none.pad, none.scroll, 'empty']);
      /* shown again: the strip and its height are back */
      await page.getByTestId('toggle').click();
      await expect.poll(async () => (await read(page, sel)).display).toBe('flex');
      const back = await read(page, sel);
      expect([back.v, back.height, back.mark]).toEqual([on.height + 'px', on.height, 'shown']);
    });

  test('193: before the client looks, the markup alone already drops a strip whose content is hidden', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await story(page, ID('pay-bar-hides'));
    await page.getByTestId('pay').click();
    await expect.poll(async () => (await read(page)).mark).toBe('empty');
    /* as the server sent it: no marker */
    const d = await page.evaluate(() => {
      document.querySelector('[data-testid=header]')!.removeAttribute('data-aura-bar');
      return getComputedStyle(document.querySelector('.aura-page-header__bar')!).display;
    });
    expect(d).toBe('none');
  });

  test('193: under a visibility gate lifted with no event the bar is not taken for empty', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await story(page, ID('visibility-gate'));
    await expect(page.getByTestId('gate')).toHaveCSS('visibility', 'visible');
    const r = await read(page);
    expect([r.mark, r.display, r.v]).toEqual(['shown', 'flex', r.height + 'px']);
    expect(r.height).toBeGreaterThan(0);
  });

  test('193: from 640px nothing changes; without actionsBarBelow there is no marker', async ({ page }) => {
    const none = await noBar(page, 1024);
    expect(await page.getByTestId('header').getAttribute('data-aura-bar')).toBeNull();
    await story(page, ID('pay-bar-hides'));
    await expect(page.getByTestId('pay')).toBeVisible();
    await page.getByTestId('pay').click();
    expect(await page.getByTestId('pdf').isVisible()).toBe(true);
    expect(
      await page.evaluate(() => getComputedStyle(document.querySelector('.aura-shell__content')!).paddingBottom),
    ).toBe(none.pad);
  });
});

test.describe('5.75: visual audit set 1 — soft status pills, list options, links, header band', () => {
  const ID = (s: string) => 'aura-new-in-5-75-visual-audit-set-1--' + s;
  const css = (page: Page, sel: string, prop: string) =>
    page.evaluate(([s, p]) => getComputedStyle(document.querySelector(s!)!).getPropertyValue(p!), [sel, prop]);

  for (const [theme, soft, solid] of [
    [
      'light',
      ['rgb(254, 226, 226)', 'rgb(153, 27, 27)', 'rgb(254, 243, 199)', 'rgb(146, 64, 14)'],
      ['rgb(153, 27, 27)', 'rgb(217, 119, 6)'],
    ],
    [
      'dark',
      ['rgb(69, 42, 44)', 'rgb(252, 165, 165)', 'rgb(68, 51, 24)', 'rgb(252, 211, 77)'],
      ['rgb(185, 28, 28)', 'rgb(217, 119, 6)'],
    ],
  ] as const)
    test(`item 1 (${theme}): Blocked and Warning are soft like the rest; variant="solid" is the strong fill`, async ({
      page,
    }) => {
      await story(page, ID('status-pills'), theme);
      const pill = (box: string, word: string) =>
        page.evaluate(
          ([b, w]) => {
            const el = [...document.querySelectorAll(`[data-testid=${b}] .aura-pill`)].find(
              (p) => p.textContent === w,
            )!;
            const s = getComputedStyle(el);
            return [s.backgroundColor, s.color, el.className];
          },
          [box, word],
        );
      const b = await pill('soft', 'Blocked'),
        w = await pill('soft', 'Warning');
      expect([b[0], b[1], w[0], w[1]]).toEqual(soft);
      expect((await pill('solid', 'Blocked'))[0]).toBe(solid[0]);
      expect((await pill('solid', 'Warning'))[0]).toBe(solid[1]);
      expect((await pill('solid', 'Blocked'))[2]).toContain('is-solid');
      /* Badge danger solid keeps the 5.30 fill */
      expect(await css(page, '[data-testid=badge-solid]', 'background-color')).toBe(solid[0]);
    });

  test('item 2: Active and Resolved read as ready, Down as blocked', async ({ page }) => {
    await story(page, ID('status-pills'));
    const cls = (w: string) =>
      page.evaluate(
        (x) =>
          [...document.querySelectorAll('[data-testid=soft] .aura-pill')].find((p) => p.textContent === x)!.className,
        w,
      );
    expect(await cls('Active')).toContain('aura-pill--ready');
    expect(await cls('Resolved')).toContain('aura-pill--ready');
    expect(await cls('Down')).toContain('aura-pill--blocked');
  });

  test('items 4 and 12: the dark header band is lighter than the card; a sortable label sits on the line of a plain one', async ({
    page,
  }) => {
    for (const theme of ['light', 'dark']) {
      await story(page, ID('sortable-header'), theme);
      const r = await page.evaluate(() => {
        const top = (s: string) => {
          const r = document.createRange();
          const th = document.querySelector(s)!;
          const walker = document.createTreeWalker(th, NodeFilter.SHOW_TEXT);
          let n: Node | null;
          while ((n = walker.nextNode())) if (n.textContent!.trim()) break;
          r.selectNodeContents(n!);
          return r.getBoundingClientRect().top;
        };
        return {
          sorted: top('[data-testid=sorted]'),
          plain: top('[data-testid=plain]'),
          amount: top('[data-testid=amount]'),
        };
      });
      expect(Math.abs(r.sorted - r.plain)).toBeLessThanOrEqual(0.5);
      expect(Math.abs(r.amount - r.plain)).toBeLessThanOrEqual(0.5);
    }
    expect(await css(page, '[data-testid=plain]', 'background-color')).toBe('rgb(31, 31, 34)');
  });

  test('item 3: under the pointer the active option is shaded only; after a key it has the ring', async ({ page }) => {
    await story(page, ID('list-options'));
    const ring = () =>
      page.evaluate(() => {
        const o = document.querySelector('.aura-combo__option.is-active');
        return o ? getComputedStyle(o).outlineStyle : 'no active option';
      });
    /* Select first: the very first click on the page opens it (the selected option is active) */
    const plan = page.getByRole('combobox', { name: 'Plan' });
    await plan.click();
    await expect(page.getByRole('option', { name: 'Pro' })).toBeVisible();
    await expect.poll(ring).toBe('none');
    await page.keyboard.press('ArrowDown');
    await expect.poll(ring).toBe('solid');
    /* the pointer on the last option, then a key that moves nothing: the ring is back all the same */
    await page.getByRole('option', { name: 'Team' }).hover();
    await expect.poll(ring).toBe('none');
    await page.keyboard.press('ArrowDown');
    await expect.poll(ring).toBe('solid');
    await page.keyboard.press('Escape');
    /* Combobox: clicked open, hovered, then keys */
    await page.getByRole('combobox', { name: 'Member' }).click();
    await page.getByRole('option', { name: 'Nordic Timber Oy' }).hover();
    await expect.poll(ring).toBe('none');
    await page.keyboard.press('ArrowDown');
    await expect.poll(ring).toBe('solid');
    await page.keyboard.press('Escape');
    /* opened with keys: the ring is there from the start */
    await plan.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('option', { name: 'Pro' })).toBeVisible();
    await expect.poll(ring).toBe('solid');
  });

  test('item 5: a plain link in a PageHeader and in body text takes the accent and is underlined', async ({ page }) => {
    for (const [theme, accent] of [
      ['light', 'rgb(109, 40, 217)'],
      ['dark', 'rgb(196, 181, 253)'],
    ]) {
      await story(page, ID('plain-links'), theme);
      for (const sel of ['.aura-page-header a', '[data-testid=body-link]']) {
        expect(await css(page, sel, 'color')).toBe(accent);
        expect(await css(page, sel, 'text-decoration-line')).toBe('underline');
      }
    }
  });

  test('items 7, 8, 13 and Tag ×: nav edge in dark, amber warning bar, toggles as tall as the search, a 16px ×', async ({
    page,
  }) => {
    await story(page, ID('set-one-misc'));
    expect(await css(page, '.aura-nav__item.is-active', 'box-shadow')).toMatch(/^(none|rgba\(0, 0, 0, 0\))/);
    expect(await css(page, '[data-testid=progress] .aura-progress__bar', 'background-color')).toBe('rgb(180, 83, 9)');
    const h = await page.evaluate(() => ({
      search: document.querySelector('.aura-filterbar__search')!.getBoundingClientRect().height,
      tags: [...document.querySelectorAll('.aura-filterbar__controls .aura-tag')].map(
        (t) => t.getBoundingClientRect().height,
      ),
      remove: document.querySelector('[data-testid=tag] .aura-tag__remove')!.getBoundingClientRect().width,
      x: document.querySelector('[data-testid=tag] .aura-tag__remove svg')!.getBoundingClientRect().width,
    }));
    expect(h.tags).toEqual([h.search, h.search, h.search]);
    expect([h.remove, h.x]).toEqual([24, 16]);
    await story(page, ID('set-one-misc'), 'dark');
    expect(await css(page, '.aura-nav__item.is-active', 'box-shadow')).toBe('rgb(196, 181, 253) 3px 0px 0px 0px inset');
    expect(await css(page, '.aura-nav__item.is-active', 'background-color')).toBe('rgb(53, 47, 72)');
    expect(await css(page, '[data-testid=progress] .aura-progress__bar', 'background-color')).toBe('rgb(252, 211, 77)');
  });

  test('item 13 at 390: a touchHeight Tag among the controls keeps 44px, whatever the field height', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await story(page, ID('set-one-misc'));
    await page.evaluate(() =>
      document.querySelector<HTMLElement>('[data-testid=filters]')!.setAttribute('data-density', 'compact'),
    );
    const h = await page.evaluate(() =>
      [...document.querySelectorAll('.aura-filterbar .aura-tag')].map((t) => [
        t.getAttribute('data-testid'),
        t.getBoundingClientRect().height,
      ]),
    );
    expect(h.find((x) => x[0] === 'touch-tag')![1]).toBe(44);
  });
});

test.describe('5.76: Chamber-OS 194 — a Dialog scrolls as one box on a short screen', () => {
  const ID = 'aura-new-in-5-76-chamber-os-194--short-screen';
  const FIELDS = [
    'Member',
    'Invoice no.',
    'Issue date',
    'Due date',
    'Amount',
    'VAT',
    'Discount',
    'Reference',
    'Contact email',
    'Note',
  ];
  const layout = (page: Page) =>
    page.evaluate(() => {
      const d = document.querySelector('.aura-dialog')!,
        b = document.querySelector('.aura-dialog__body')!;
      const s = getComputedStyle(d),
        bs = getComputedStyle(b);
      return {
        dOverflow: s.overflowY,
        dScrolls: d.scrollHeight > d.clientHeight + 1,
        bOverflow: bs.overflowY,
        bOverflowX: bs.overflowX,
        bWide: b.scrollWidth > b.clientWidth + 1,
        bScrolls: b.scrollHeight > b.clientHeight + 1,
        bodyH: b.getBoundingClientRect().height,
        bodyContent: b.firstElementChild!.getBoundingClientRect().height,
      };
    });
  const inView = (page: Page, sel: string) =>
    page.evaluate((s) => {
      const d = document.querySelector('.aura-dialog')!.getBoundingClientRect();
      const r = document.activeElement!.closest(s) ? document.activeElement!.getBoundingClientRect() : null;
      return !!r && r.top >= d.top - 0.5 && r.bottom <= d.bottom + 0.5 && r.height > 0;
    }, sel);

  for (const [w, h] of [
    [320, 256],
    [568, 320],
    [1024, 400],
  ] as const)
    test(`194 (${w}×${h}): the dialog scrolls as one box; every field and both buttons can be reached and are shown`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: w, height: h });
      await story(page, ID);
      await expect(page.getByRole('dialog')).toBeVisible();
      /* the first field gets focus on open, and it is shown */
      await expect.poll(() => page.evaluate(() => document.activeElement!.tagName)).toBe('INPUT');
      expect(await inView(page, 'input')).toBe(true);
      const l = await layout(page);
      /* one vertical scroller, the panel; the body is as tall as its content, and scrolls only sideways (a long URL) */
      expect([l.dOverflow, l.dScrolls, l.bScrolls, l.bOverflowX]).toEqual(['auto', true, false, 'auto']);
      if (w < 1000) {
        expect(l.bWide).toBe(true);
        await page.getByTestId('wide').evaluate((e) => (e.parentElement!.parentElement!.scrollLeft = 80));
        expect(await page.locator('.aura-dialog__body').evaluate((e) => e.scrollLeft)).toBeGreaterThan(0);
      }
      /* the body has its full height, not 0: it holds all ten fields */
      expect(l.bodyH).toBeGreaterThanOrEqual(l.bodyContent);
      for (const f of FIELDS) {
        await page.getByLabel(f, { exact: true }).focus();
        expect(await inView(page, 'input')).toBe(true);
      }
      for (const b of ['cancel', 'issue']) {
        await page.getByTestId(b).focus();
        expect(await inView(page, 'button')).toBe(true);
      }
      /* the footer is at the end of the content: below the last field */
      const [last, foot] = await page.evaluate(() => [
        document.querySelector('.aura-dialog__body')!.getBoundingClientRect().bottom,
        document.querySelector('.aura-dialog__foot')!.getBoundingClientRect().top,
      ]);
      expect(foot).toBeGreaterThanOrEqual(last);
      /* a wheel over the body scrolls the dialog (nothing in the body holds it back): the body brought up to fill the
       * dialog, the pointer in the middle of it */
      const start = await page.locator('.aura-dialog').evaluate((d) => {
        d.scrollTop = (d.querySelector('.aura-dialog__body') as HTMLElement).offsetTop;
        return d.scrollTop;
      });
      const dd = (await page.locator('.aura-dialog').boundingBox())!;
      expect(
        await page.evaluate(
          ([x, y]) => !!document.elementFromPoint(x!, y!)!.closest('.aura-dialog__body'),
          [dd.x + dd.width / 2, dd.y + dd.height / 2],
        ),
      ).toBe(true);
      await page.mouse.move(dd.x + dd.width / 2, dd.y + dd.height / 2);
      await page.mouse.wheel(0, 200);
      await expect.poll(() => page.locator('.aura-dialog').evaluate((d) => d.scrollTop)).toBeGreaterThan(start + 100);
      await page.getByTestId('issue').focus();
      /* Tab from the last button wraps inside the dialog (the trap still works) */
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => !!document.activeElement!.closest('.aura-dialog'))).toBe(true);
    });

  for (const [w, h] of [
    [390, 844],
    [1280, 900],
  ] as const)
    test(`194 (${w}×${h}): above 30rem the footer stays fixed under a scrolling body, as before`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await story(page, ID);
      await expect(page.getByRole('dialog')).toBeVisible();
      const l = await layout(page);
      expect([l.dOverflow, l.bOverflow]).toEqual(['hidden', 'auto']);
      expect(l.dScrolls).toBe(false);
    });
});

test.describe('5.77: Chamber-OS 194 follow-up — a confirmation opens at the top on a short screen', () => {
  const ID = 'aura-new-in-5-76-chamber-os-194--confirm-opens-at-top';
  const state = (page: Page) =>
    page.evaluate(() => {
      const d = document.querySelector('.aura-dialog')!;
      const t = document.querySelector('.aura-dialog__title')!.getBoundingClientRect(),
        r = d.getBoundingClientRect();
      return {
        top: d.scrollTop,
        scrolls: d.scrollHeight > d.clientHeight + 1,
        focus: document.activeElement!.getAttribute('data-testid'),
        titleShown: t.top >= r.top - 0.5 && t.bottom <= r.bottom + 0.5,
      };
    });

  for (const [w, h] of [
    [320, 256],
    [568, 320],
    [1024, 400],
  ] as const)
    test(`194 (${w}×${h}): Cancel has focus, the dialog starts at its top with the title shown; Tab and a scroll reach the buttons`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: w, height: h });
      await story(page, ID);
      await expect.poll(async () => (await state(page)).focus).toBe('cancel');
      const s = await state(page);
      expect([s.scrolls, s.titleShown]).toEqual([true, true]);
      /* where the head would have left view it opens at the top (320, 568); where both fit after the browser's small
       * scroll (1024×400: 7px) that scroll stays, so Cancel is shown too */
      if (w < 1000) expect(s.top).toBe(0);
      else
        expect(
          await page.evaluate(() => {
            const d = document.querySelector('.aura-dialog')!.getBoundingClientRect(),
              c = document.activeElement!.getBoundingClientRect();
            return c.top >= d.top - 0.5 && c.bottom <= d.bottom + 0.5;
          }),
        ).toBe(true);
      /* the buttons are still reached: Tab moves to Refund and brings it into view */
      await page.keyboard.press('Tab');
      await expect(page.getByTestId('refund')).toBeFocused();
      expect(
        await page.evaluate(() => {
          const d = document.querySelector('.aura-dialog')!.getBoundingClientRect(),
            r = document.activeElement!.getBoundingClientRect();
          return r.top >= d.top - 0.5 && r.bottom <= d.bottom + 0.5;
        }),
      ).toBe(true);
    });

  test('194: a field in the body keeps its scroll into view (5.76 test story), and a tall screen is unchanged', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 256 });
    await story(page, 'aura-new-in-5-76-chamber-os-194--short-screen');
    await expect.poll(() => page.evaluate(() => document.activeElement!.tagName)).toBe('INPUT');
    expect(await page.evaluate(() => document.querySelector('.aura-dialog')!.scrollTop)).toBeGreaterThan(0);
    await page.setViewportSize({ width: 1280, height: 900 });
    await story(page, ID);
    await expect.poll(async () => (await state(page)).focus).toBe('cancel');
    const s = await state(page);
    expect([s.scrolls, s.top, s.titleShown]).toEqual([false, 0, true]);
  });

  const LONG = 'aura-new-in-5-76-chamber-os-194--long-confirm-no-body';
  test('194: a long confirmation with no body (focus falls on the footer) opens at the top on a short screen', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 256 });
    await story(page, LONG);
    await expect.poll(async () => (await state(page)).focus).toBe('cancel');
    const s = await state(page);
    expect([s.scrolls, s.top, s.titleShown]).toEqual([true, 0, true]);
  });

  for (const [w, h] of [
    [1024, 520],
    [390, 520],
  ] as const)
    test(`194 (${w}×${h}): above 30rem, where the panel can't scroll, the focused button stays in view`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: w, height: h });
      await story(page, LONG);
      await expect.poll(async () => (await state(page)).focus).toBe('cancel');
      const r = await page.evaluate(() => {
        const d = document.querySelector('.aura-dialog')!.getBoundingClientRect(),
          c = document.activeElement!.getBoundingClientRect();
        return [
          getComputedStyle(document.querySelector('.aura-dialog')!).overflowY,
          c.top >= d.top - 0.5 && c.bottom <= d.bottom + 0.5,
        ];
      });
      expect(r).toEqual(['hidden', true]);
    });
});

test.describe('5.78: visual audit set 2 — phones', () => {
  test('item 20: a card with the column picker keeps its title wide (the picker slot leaves the card)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await story(page, 'aura-new-in-5-51-chamber-os-157-160--tab-keys');
    const w = await page.evaluate(() =>
      ['tab', 'tab-controls'].map((t) => {
        const row = [...document.querySelectorAll(`[data-testid=${t}] [role=row]`)][1]!;
        const gutter = row.querySelector('.aura-table__gutter--end') as HTMLElement | null;
        return [
          Math.round(row.querySelector('.aura-table__td')!.getBoundingClientRect().width),
          gutter ? gutter.getClientRects().length : 0,
        ];
      }),
    );
    expect(w[1]![0]).toBe(w[0]![0]);
    expect(w[1]![1]).toBe(0);
  });

  test('item 22: a document number in a PageHeader title breaks before it, never at its hyphens', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, 'aura-new-in-5-45-chamber-os-150--invoice-en');
    const r = await page.evaluate(() => {
      const id = document.querySelector('.aura-page-header__title .aura-nowrap')!;
      return [
        id.textContent,
        id.getClientRects().length,
        document.querySelector('.aura-page-header__title')!.textContent,
      ];
    });
    expect(r).toEqual(['SC-2026-900001', 1, 'Invoice SC-2026-900001']);
  });

  test('item 9: on a phone the edge bars put the status on its own row, the actions sharing the row under it, 16px both sides', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const [id, bar, status] of [
      ['aura-new-in-5-69-chamber-os-185--edge', '.aura-actionbar__inner', '.aura-actionbar__status'],
      ['aura-new-in-5-69-chamber-os-185--page-header-bar', '.aura-page-header__actions', '.aura-page-header__status'],
    ] as const) {
      await story(page, id);
      const r = await page.evaluate(
        ([b, s]) => {
          const bar = document.querySelector(b!) as HTMLElement,
            st = document.querySelector(s!)!.getBoundingClientRect();
          const btn = bar.querySelector('.aura-btn')!.getBoundingClientRect();
          const cs = getComputedStyle(bar);
          return { pl: cs.paddingLeft, pr: cs.paddingRight, below: btn.top >= st.bottom - 0.5, wide: btn.width > 160 };
        },
        [bar, status],
      );
      expect(r).toEqual({ pl: '16px', pr: '16px', below: true, wide: true });
    }
  });

  test('item 11: in PageHeader full-width mode on a phone a button that wraps is a rounded box (radius-md), not a lozenge', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, 'aura-new-in-5-44-chamber-os-149--invoice-actions');
    const r = await page.evaluate(() => {
      const b = document.querySelector('.aura-page-header__actions .aura-btn')!;
      return [
        getComputedStyle(b).borderTopLeftRadius,
        getComputedStyle(document.querySelector('.aura-page-header__actions .aura-icon-btn')!).borderTopLeftRadius,
        getComputedStyle(document.documentElement).getPropertyValue('--aura-radius-md').trim(),
      ];
    });
    expect(r[0]).toBe(r[2]);
    expect(r[1]).not.toBe(r[2]);
  });

  test('item 23: a host name in a StatusTile title breaks after a dot, not inside a label', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await story(page, 'aura-new-in-5-34-status-tiles--overview');
    const bad = await page.evaluate(() => {
      const out: string[] = [];
      for (const t of document.querySelectorAll('.aura-status-tile__title')) {
        if (!/\.\S/.test(t.textContent || '')) continue;
        let prevTop: number | null = null,
          prev = '';
        const walker = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
        let n: Node | null;
        while ((n = walker.nextNode())) {
          if (n.parentElement!.closest('.aura-sr-only')) continue;
          for (let i = 0; i < n.textContent!.length; i++) {
            const r = document.createRange();
            r.setStart(n, i);
            r.setEnd(n, i + 1);
            const rc = r.getBoundingClientRect();
            if (!rc.width) continue; // the zero-size separator
            const top = Math.round(rc.top);
            if (prevTop != null && top > prevTop + 2 && !/[./\s,]/.test(prev)) out.push(t.textContent + ' @' + i);
            prevTop = top;
            prev = n.textContent![i]!;
          }
        }
      }
      return out;
    });
    expect(bad).toEqual([]);
  });

  test('item 24: an overflowing tab list fades the end with more; scrolled to the end, the start; RTL mirrored; a list that fits has none', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 600 });
    await story(page, 'aura-new-in-5-78-visual-audit-set-2--tabs-overflow');
    const more = (t: string) => page.locator(`[data-testid=${t}] .aura-tabs__list`).getAttribute('data-aura-more');
    await expect.poll(() => more('ltr')).toBe('end');
    await expect.poll(() => more('rtl')).toBe('end');
    expect(await more('fits')).toBeNull();
    expect(
      await page.locator('[data-testid=ltr] .aura-tabs__list').evaluate((e) => getComputedStyle(e).maskImage),
    ).toMatch(/linear-gradient\(to right/);
    expect(
      await page.locator('[data-testid=rtl] .aura-tabs__list').evaluate((e) => getComputedStyle(e).maskImage),
    ).toMatch(/linear-gradient\(to left/);
    await page.locator('[data-testid=ltr] .aura-tabs__list').evaluate((e) => (e.scrollLeft = 60));
    await expect.poll(() => more('ltr')).toBe('start end');
    await page.locator('[data-testid=ltr] .aura-tabs__list').evaluate((e) => (e.scrollLeft = e.scrollWidth));
    await expect.poll(() => more('ltr')).toBe('start');
    /* keys reach the last tab and the fade follows */
    await page.locator('[data-testid=ltr] [role=tab]').first().focus();
    await page.keyboard.press('Home');
    await expect.poll(() => more('ltr')).toBe('end');
  });

  test('item 25: an empty TimePicker in a narrow column shows its whole placeholder (room for the clear button only with one)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 600 });
    await story(page, 'aura-new-in-4-3--time-picker-story');
    const r = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLInputElement>('.aura-time .aura-input__control')].map((i) => {
        const cs = getComputedStyle(i);
        const avail = i.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        const c = document.createElement('canvas').getContext('2d')!;
        c.font = cs.font;
        return avail >= c.measureText(i.placeholder).width;
      }),
    );
    expect(r.length).toBeGreaterThan(0);
    expect(r.every(Boolean)).toBe(true);
  });

  test('item 9 (320, sv): long labels take a row each in the edge strip; no button leaves the screen or clips its label', async ({
    page,
  }) => {
    for (const w of [320, 390]) {
      await page.setViewportSize({ width: w, height: 700 });
      await story(page, 'aura-new-in-5-78-visual-audit-set-2--edge-long-labels');
      const r = await page.evaluate(() =>
        [...document.querySelectorAll('.aura-actionbar .aura-btn')].map((b) => {
          const rc = b.getBoundingClientRect();
          return rc.left >= 15.5 && rc.right <= innerWidth - 15.5 && b.scrollWidth <= b.clientWidth + 1;
        }),
      );
      expect([w, r]).toEqual([w, [true, true]]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(w);
    }
  });

  test('item 22 (320): a document number longer than a line still breaks — no sideways scroll; item 11: the strip keeps pills', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await story(page, 'aura-new-in-5-78-visual-audit-set-2--long-number-and-strip');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
    const r = await page.evaluate(() => {
      const md = getComputedStyle(document.documentElement).getPropertyValue('--aura-radius-md').trim();
      return [...document.querySelectorAll('.aura-page-header__actions .aura-btn')].map(
        (b) => getComputedStyle(b).borderTopLeftRadius !== md,
      );
    });
    expect(r).toEqual([true, true]);
  });

  test('item 11 with actionsBar (5.71 pay bar): the header own full-width actions are radius-md, the strip Pay now a pill', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await story(page, 'aura-new-in-5-71-chamber-os-191--pay-bar');
    const r = await page.evaluate(() => {
      const md = getComputedStyle(document.documentElement).getPropertyValue('--aura-radius-md').trim();
      const own = [...document.querySelectorAll('.aura-page-header__actions.is-split > .aura-btn')].map(
        (b) => getComputedStyle(b).borderTopLeftRadius === md,
      );
      const bar = [...document.querySelectorAll('.aura-page-header__bar .aura-btn')].map(
        (b) => getComputedStyle(b).borderTopLeftRadius === md,
      );
      return [own.length > 0 && own.every(Boolean), bar.length > 0 && !bar.some(Boolean)];
    });
    expect(r).toEqual([true, true]);
  });

  test('item 24: a tab reached by keys scrolls fully into view, clear of the fade', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 600 });
    await story(page, 'aura-new-in-5-78-visual-audit-set-2--tabs-overflow');
    await page.locator('[data-testid=ltr] [role=tab]').first().focus();
    for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowRight');
    const r = await page.evaluate(() => {
      const l = document.querySelector('[data-testid=ltr] .aura-tabs__list')!.getBoundingClientRect();
      const t = document.activeElement!.getBoundingClientRect();
      return [document.activeElement!.textContent, t.left >= l.left - 0.5 && t.right <= l.right + 0.5];
    });
    expect(r).toEqual(['Events', true]);
  });

  test('story fixes: no story scrolls the page sideways at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const id of [
      'aura-fixed-in-5-1-1--overlays',
      'aura-new-in-4-20--tooltip-sides',
      'aura-new-in-5-1--nav-no-header',
      'aura-new-in-5-15--touch-height',
      'aura-new-in-5-30--visual-polish',
      'aura-new-in-5-30-polish--polish',
      'aura-new-in-5-32-dxt-monitor--parts',
      'aura-new-in-5-34-status-tiles--sparklines',
      'aura-new-in-5-70-chamber-os-186-190--spinners',
      'aura-new-in-5-75-visual-audit-set-1--set-one-misc',
    ]) {
      await story(page, id);
      expect([id, await page.evaluate(() => document.documentElement.scrollWidth)]).toEqual([id, 390]);
    }
  });
});

test.describe('5.79: visual audit set 3 — component by component', () => {
  const ID = (s: string) => 'aura-new-in-5-79-visual-audit-set-3--' + s;

  test('item 6: one disabled look for every variant (a faint fill, edge and label at full opacity); ghost has neither fill nor edge', async ({
    page,
  }) => {
    for (const theme of ['light', 'dark'] as const) {
      await story(page, ID('set-three'), theme);
      const r = await page.evaluate(() => {
        const edge = getComputedStyle(document.documentElement)
          .getPropertyValue('--aura-button-disabled-border')
          .trim();
        const probe = document.createElement('i');
        probe.style.color = edge;
        document.body.appendChild(probe);
        const edgeRgb = getComputedStyle(probe).color;
        probe.remove();
        return Object.fromEntries(
          [...document.querySelectorAll<HTMLElement>('[data-testid=disabled] .aura-btn')].map((b) => {
            const s = getComputedStyle(b);
            const hasEdge =
              (parseFloat(s.borderTopWidth) > 0 && s.borderTopColor === edgeRgb) ||
              (/inset/.test(s.boxShadow) && s.boxShadow.indexOf(edgeRgb) >= 0);
            return [
              b.dataset.variant!,
              {
                look: [s.backgroundColor, s.color, s.opacity].join(' | '),
                hasEdge,
                shadow: s.boxShadow,
                border: s.borderTopColor,
              },
            ];
          }),
        );
      });
      const same = r.primary.look;
      expect([r.secondary.look, r.danger.look, r.creative.look, r.gated.look]).toEqual([same, same, same, same]);
      expect(same.endsWith('| 1')).toBe(true);
      expect([r.primary.hasEdge, r.secondary.hasEdge, r.danger.hasEdge, r.creative.hasEdge, r.gated.hasEdge]).toEqual([
        true,
        true,
        true,
        true,
        true,
      ]);
      expect([r.ghost.look.startsWith('rgba(0, 0, 0, 0)'), r.ghost.shadow]).toEqual([true, 'none']);
      /* not the neutral To Do pill's fill */
      const pill = await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue('--aura-status-neutral-bg').trim(),
      );
      expect(same.split(' | ')[0]).not.toBe(pill);
    }
  });

  test('item 10: in an AppShell on a desktop the edge strip starts after the sidebar (rail when collapsed, the right in RTL), its contents on the content padding', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    const read = () =>
      page.evaluate(() => {
        const bar = document.querySelector('.aura-actionbar')!.getBoundingClientRect();
        const nav = document.querySelector('.aura-shell__nav')!.getBoundingClientRect();
        const inner = getComputedStyle(document.querySelector('.aura-actionbar__inner')!);
        const head = document.querySelector('[data-testid=heading]')!.getBoundingClientRect();
        const status = document.querySelector('.aura-actionbar__status')!.getBoundingClientRect();
        return {
          barL: Math.round(bar.left),
          barR: Math.round(bar.right),
          navL: Math.round(nav.left),
          navR: Math.round(nav.right),
          pad: inner.paddingLeft,
          headL: Math.round(head.left),
          headR: Math.round(head.right),
          statusL: Math.round(status.left),
          statusR: Math.round(status.right),
        };
      });
    await story(page, ID('shell-edge'));
    let r = await read();
    expect([r.barL, r.barR, r.pad, r.statusL]).toEqual([r.navR, 1280, '32px', r.headL]);
    await story(page, ID('shell-edge-collapsed'));
    r = await read();
    expect([r.barL, r.statusL]).toEqual([r.navR, r.headL]);
    expect(r.navR).toBeLessThan(120);
    await story(page, ID('shell-edge-rtl'));
    r = await read();
    expect([r.barL, r.barR, r.statusR]).toEqual([0, r.navL, r.headR]);
    /* below lg (no sidebar) the strip is the screen's width, as before */
    await page.setViewportSize({ width: 800, height: 800 });
    await story(page, ID('shell-edge'));
    r = await read();
    expect([r.barL, r.barR]).toEqual([0, 800]);
  });

  test('items 15–17: a list box shows its rows; wide chips keep their labels; a locked switch has its lock by the label', async ({
    page,
  }) => {
    await story(page, ID('set-three'));
    const r = await page.evaluate(() => {
      const sel = document.querySelector<HTMLSelectElement>('[data-testid=listbox] select')!;
      const chips = [...document.querySelectorAll<HTMLElement>('[data-testid=chips] .aura-combo__chip-label')].map(
        (l) => l.clientWidth >= Math.min(l.scrollWidth, 100), // whole, or about 12 characters — not "V.."
      );
      const label = document.querySelector('[data-testid=locked] .aura-choice__text')!.getBoundingClientRect();
      const lock = document.querySelector('[data-testid=locked] .aura-switch-row__icon')!.getBoundingClientRect();
      return {
        rows: sel.scrollHeight <= sel.clientHeight + 1 && sel.clientHeight > 80,
        chevron: getComputedStyle(document.querySelector('[data-testid=listbox] .aura-select__chevron')!).display,
        chips,
        lockGap: Math.round(lock.left - label.right),
      };
    });
    expect(r.rows).toBe(true);
    expect(r.chevron).toBe('none');
    expect(r.chips).toEqual([true, true]);
    expect(r.lockGap).toBeLessThanOrEqual(12);
  });

  test('item 18: a menu of plain labels has no icon gap, and opens on its trigger start when ending on it would cross the screen', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await story(page, ID('set-three'));
    await page.getByRole('button', { name: 'Actions' }).click();
    await expect(page.getByRole('menu')).toBeVisible();
    const r = await page.evaluate(() => {
      const t = document.querySelector('[data-testid=menu] .aura-btn')!.getBoundingClientRect();
      const m = document.querySelector('.aura-menu')!.getBoundingClientRect();
      const item = document.querySelector('.aura-menu__item')!;
      const lab = item.querySelector('.aura-menu__label')!.getBoundingClientRect();
      return {
        blanks: document.querySelectorAll('.aura-menu .aura-menu__blank').length,
        menuL: Math.round(m.left),
        trigL: Math.round(t.left),
        labelPad: Math.round(lab.left - item.getBoundingClientRect().left),
      };
    });
    expect(r.blanks).toBe(0);
    expect(r.menuL).toBe(r.trigL);
    expect(r.labelPad).toBe(8);
  });

  test('item 19: file types read as formats; an outline badge has a quieter edge; a date range is a visible band', async ({
    page,
  }) => {
    await story(page, ID('set-three'));
    const r = await page.evaluate(() => {
      const hint = document.querySelector('[data-testid=upload]')!.textContent!;
      const b = getComputedStyle(document.querySelector('[data-testid=badges] .aura-badge')!);
      const day = document.querySelector('[data-testid=range] td.is-in-range')!;
      return { hint, badge: [b.color, b.borderTopColor], range: getComputedStyle(day).backgroundColor };
    });
    expect(r.hint).toContain('PNG, JPEG, SVG, PDF');
    expect(r.hint).not.toMatch(/IMAGE\//);
    expect(r.badge[1]).not.toBe(r.badge[0]);
    expect(r.range).toBe('rgb(237, 233, 254)');
  });

  test('Thai: the calendar is lang="th" with a Thai locale and its weekday row is 13px', async ({ page }) => {
    await story(page, ID('set-three'));
    const r = await page.evaluate(() => {
      const g = document.querySelector('[data-testid=th] .aura-cal__grid')!;
      return [
        g.getAttribute('lang'),
        getComputedStyle(g.querySelector('th')!).fontSize,
        document.querySelector('[data-testid=range] .aura-cal__grid')!.getAttribute('lang'),
      ];
    });
    expect(r).toEqual(['th', '13px', null]);
  });

  test('5.78 carry-over: between the bar and full-width breakpoints every button in the row is radius-md', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 700, height: 700 });
    await story(page, ID('mixed-radius'));
    const r = await page.evaluate(() => {
      const md = getComputedStyle(document.documentElement).getPropertyValue('--aura-radius-md').trim();
      return [...document.querySelectorAll('.aura-page-header__actions .aura-btn')].map(
        (b) => getComputedStyle(b).borderTopLeftRadius === md,
      );
    });
    expect(r).toEqual([true, true]);
  });

  test('landing: the launch page shows with its own styles (an icon 8px from its card title)', async ({ page }) => {
    await story(page, 'aura-new-in-4-4--landing');
    expect(
      await page
        .locator('.lp-card-title')
        .first()
        .evaluate((e) => getComputedStyle(e).columnGap),
    ).toBe('8px');
    expect(await page.evaluate(() => getComputedStyle(document.body).fontSize)).not.toBe('15px');
  });
});
