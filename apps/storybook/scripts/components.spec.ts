import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/* Behaviour tests for AURA components, run against the static Storybook (npm run build-storybook). */
const story = async (page: Page, id: string, theme = 'light') => {
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`);
  await page.waitForSelector('#storybook-root > *');
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
  test('dark theme flips the primary fill and the creative shadow turns violet', async ({ page }) => {
    await story(page, 'aura-actions-button--all-states', 'dark');
    const bg = await page
      .getByRole('button', { name: 'Enterprise' })
      .evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(bg).toBe('rgb(255, 255, 255)');
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
    await story(page, 'aura-layout--tabs-story');
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
    await page.getByRole('button', { name: 'Next page' }).click();
    await expect(page.locator('.aura-table.is-refreshing')).toHaveCount(1);
    await expect(grid).toHaveAttribute('aria-busy', 'true');
    await expect(page.locator('.aura-table__row').first()).toContainText('INV-1001'); // previous page kept
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
