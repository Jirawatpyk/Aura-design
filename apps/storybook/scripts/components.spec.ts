import { test, expect, Page } from '@playwright/test';

/* Behaviour tests for AURA components, run against the static Storybook (npm run build-storybook). */
const story = async (page: Page, id: string, theme = 'light') => {
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`);
  await page.waitForSelector('#storybook-root > *');
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
    const s = page.getByLabel('Team');
    await expect(s).toHaveValue('');
    await s.selectOption('Mobile');
    await expect(s).toHaveValue('Mobile');
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
    await expect(page.locator('.aura-table__card')).toHaveCount(5);
    await expect(page.getByRole('grid')).toHaveCount(0);
    await page.setViewportSize({ width: 1000, height: 800 });
    await expect(page.getByRole('grid')).toBeVisible();
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
