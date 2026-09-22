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
    const bg = await page.getByRole('button', { name: 'Enterprise' }).evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(bg).toBe('rgb(255, 255, 255)');
    const sh = await page.getByRole('button', { name: 'Creative' }).evaluate((e) => getComputedStyle(e).boxShadow);
    expect(sh).toContain('167, 139, 250');
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
    await sw.focus(); await page.keyboard.press('Space');
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
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' }).locator('[aria-current="page"]')).toHaveText('Tokens');
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
    await grid(page).evaluate((g) => { g.scrollTop = 48 * 1500; });
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
    await cb.press('Escape'); await cb.press('Escape');
    await expect(page.getByText('Value: null')).toBeVisible();
  });
});

test.describe('DatePicker', () => {
  test('shows พ.ศ., accepts typed Buddhist and Christian years, keeps ISO', async ({ page }) => {
    await story(page, 'aura-pickers--date-picker-story');
    const f = page.getByRole('textbox', { name: 'วันที่ส่ง' });
    await expect(f).toHaveValue('18 ก.ย. 2569');
    await f.fill('05/12/2569'); await f.press('Enter');
    await expect(page.getByText('ISO: 2026-12-05')).toBeVisible();
    await f.fill('2026-10-01'); await f.press('Tab');
    await expect(f).toHaveValue('1 ต.ค. 2569');
  });
  test('calendar: focus moves in, arrows move, Enter picks, Escape returns focus', async ({ page }) => {
    await story(page, 'aura-pickers--date-picker-story');
    await page.getByRole('button', { name: 'เปิดปฏิทิน' }).first().click();
    await expect(page.getByRole('dialog', { name: 'วันที่ส่ง' })).toBeVisible();
    await expect(page.locator(':focus')).toHaveAttribute('data-date', '2026-09-18');
    await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
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
    for (let i = 0; i < 12; i++) { await page.keyboard.press('Tab'); expect(await page.evaluate(() => !!document.activeElement?.closest('.aura-drawer, .aura-cal__popover, .aura-combo__popover'))).toBe(true); }
    await page.keyboard.press('Escape');
    await expect(dr).toHaveCount(0);
    await expect(opener).toBeFocused();
  });
  test('dropdown opens with ArrowDown, runs the item, focus returns', async ({ page }) => {
    await story(page, 'aura-overlays--dropdown-menu-story');
    const trigger = page.getByRole('button', { name: 'Actions for ORD-1042' });
    await trigger.focus(); await page.keyboard.press('ArrowDown');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
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
    await page.getByRole('dialog').getByRole('button', { name: /Team/ }).or(page.getByRole('dialog').getByRole('link', { name: /Team/ })).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
  test('Stack and Grid follow breakpoints', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await story(page, 'aura-responsive--stack-grid');
    await expect(page.getByTestId('bp')).toHaveText('Breakpoint: base');
    const dir = () => page.locator('.aura-stack .aura-stack').first().evaluate((e) => getComputedStyle(e).flexDirection);
    expect(await dir()).toBe('column');
    await page.setViewportSize({ width: 1100, height: 800 });
    await expect(page.getByTestId('bp')).toHaveText('Breakpoint: lg');
    expect(await dir()).toBe('row');
    const cols = await page.locator('.aura-grid-layout').first().evaluate((e) => getComputedStyle(e).gridTemplateColumns.split(' ').length);
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
    await f.fill('930'); await f.press('Enter');
    await expect(page.getByText('Value: 09:30')).toBeVisible();
    await f.fill('7'); await f.press('Enter');
    await expect(page.getByText('Choose a time between 08:00 and 18:00')).toBeVisible();
    await f.fill(''); await f.press('Escape');
    await f.press('ArrowDown');
    await expect(page.getByRole('option', { name: '12:00' })).toHaveAttribute('aria-disabled', 'true');
    await page.getByRole('option', { name: '11:30' }).click();
    await expect(page.getByText('Value: 11:30')).toBeVisible();
    await f.press('ArrowDown'); await f.press('ArrowDown');       // skips 12:00 and 12:30
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
    await chip.click(); await expect(chip).toHaveAttribute('aria-pressed', 'true');
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
    const a = page.getByRole('button', { name: 'Do I need a card?' }), b = page.getByRole('button', { name: 'Where is my data?' });
    await expect(a).toHaveAttribute('aria-expanded', 'true');
    await b.click(); await expect(a).toHaveAttribute('aria-expanded', 'true'); await expect(b).toHaveAttribute('aria-expanded', 'true');
    await b.focus(); await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('button', { name: 'Buddhist calendar?' })).toBeFocused();
  });
  test('Popover: focus in, Tab stays inside, Escape returns focus', async ({ page }) => {
    await story(page, 'aura-new-in-4-4--popover-story');
    const trigger = page.getByRole('button', { name: 'Filters' });
    await trigger.click();
    await expect(page.getByRole('dialog', { name: 'Filters' })).toBeVisible();
    for (let i = 0; i < 6; i++) { await page.keyboard.press('Tab'); expect(await page.evaluate(() => !!document.activeElement?.closest('.aura-popover'))).toBe(true); }
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  });
  test('Theme: scoped brand reaches buttons, links and focus ring', async ({ page }) => {
    await story(page, 'aura-new-in-4-4--themed-story');
    const bg = await page.getByRole('button', { name: 'New Project' }).evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(bg).not.toBe('rgb(24, 24, 27)');
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
