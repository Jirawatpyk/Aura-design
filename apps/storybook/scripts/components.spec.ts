import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/* Behaviour tests for AURA components, run against the static Storybook (npm run build-storybook). */
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
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
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
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
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
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
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
    await expect(close).toHaveAttribute('title', 'Close payment drawer');
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
      await expect(fees).toHaveAttribute('aria-label', 'Fees, has errors');
      await expect(fees.locator('.aura-sr-only')).toHaveText(', has errors');
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
      /* The lock sits at the row's end, the field icon's size and colour; the state keeps full colour (no fade). */
      const icon = row.locator('.aura-switch-row__icon');
      const ib = (await icon.boundingBox())!;
      const fieldIcon = (await page.locator('.aura-input__icon').first().boundingBox())!;
      expect(Math.round(ib.width)).toBe(Math.round(fieldIcon.width));
      expect(Math.abs(rb.x + rb.width - (ib.x + ib.width))).toBeLessThanOrEqual(1);
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
      expect([h.compact, h.plain, h.remove]).toEqual([32, 32, 20]);
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
    l.locator('.aura-tag__text').evaluate((el) => [el.scrollWidth > el.clientWidth + 1, el.getAttribute('title')]);

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
    expect(Math.round((await c.locator('.aura-tag__remove').boundingBox())!.width)).toBe(20);
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
    await expect(w.locator('.aura-tag__text')).toHaveAttribute('title', /Branch Office, Chiang Mai/);
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
    const head = page.locator('.aura-table__head').first();
    expect(await css(head, 'background-color')).toBe('rgb(17, 17, 20)');
    expect(await css(page.locator('.aura-tbl__head .aura-tbl__th').first(), 'background-color')).toBe(
      'rgb(17, 17, 20)',
    );
  });

  test('light: Blocked is red-800, the neutral pill and badge show on the canvas, the header band is the canvas', async ({
    page,
  }) => {
    await story(page, ID);
    const pills = page.getByTestId('pills');
    expect(await css(pills.locator('.aura-pill').filter({ hasText: 'Overdue' }), 'background-color')).toBe(
      'rgb(153, 27, 27)',
    );
    expect(await css(pills.locator('.aura-pill').filter({ hasText: 'Lapsed' }), 'background-color')).toBe(
      'rgb(228, 228, 231)',
    );
    expect(await css(pills.locator('.aura-badge'), 'background-color')).toBe('rgb(228, 228, 231)');
    expect(await css(page.locator('.aura-table__head').first(), 'background-color')).toBe('rgb(250, 250, 250)');
  });

  test('a disabled filled button is a grey fill at full opacity; outline buttons keep the fade', async ({ page }) => {
    for (const theme of ['light', 'dark'] as const) {
      await story(page, ID, theme);
      for (const name of ['Disabled primary', 'Disabled danger', 'Disabled creative']) {
        const b = page.getByRole('button', { name });
        expect(await css(b, 'opacity')).toBe('1');
        expect(await css(b, 'background-color')).toBe(theme === 'light' ? 'rgb(228, 228, 231)' : 'rgb(39, 39, 42)');
        expect(await css(b, 'box-shadow')).toBe('none');
      }
      expect(await css(page.getByRole('button', { name: 'Disabled secondary' }), 'opacity')).toBe('0.5');
      /* An aria-disabled (focusable, gated) primary gets the same grey fill, also on hover. */
      const gated = page.getByRole('button', { name: 'Gated primary' });
      await gated.hover();
      expect(await css(gated, 'background-color')).toBe(theme === 'light' ? 'rgb(228, 228, 231)' : 'rgb(39, 39, 42)');
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
    /* …and a long email still breaks to fit a 600px box instead of widening the table. */
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

  test('14, 17, 18: quiet show-password icon, a 14px chip ×, plain links in the accent colour', async ({ page }) => {
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
      expect(Math.round((await x.boundingBox())!.width)).toBe(14);
      expect(await css(page.getByTestId('prose').getByRole('link'), 'color')).toBe(
        theme === 'light' ? 'rgb(109, 40, 217)' : 'rgb(196, 181, 253)',
      );
    }
  });
});
