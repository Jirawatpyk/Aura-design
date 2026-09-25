/* Behaviour + axe tests for the orders pilot (examples/orders/dist/index.html), at 1440, 820 and 390px.
 * npm run test:pilots -w packages/react */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { activeAttr, axe, colorScheme, compact, example, failOnPageErrors, scrollWidth, setTheme } from './helpers.ts';

const URL = example('orders');
const here = path.dirname(fileURLToPath(import.meta.url));
async function ready(page: Page) {
  await page.goto(URL);
  await page.waitForSelector(
    '.aura-table__scroll:not([aria-busy]) > .aura-table__row:not(.aura-table__row--skeleton)',
    {
      timeout: 5000,
    },
  );
}
const countText = (page: Page) => page.locator('.aura-table__foot [aria-live]').innerText();
const firstId = (page: Page) => page.locator('.aura-table__row').first().locator('[data-rc$=":1"]').innerText();
const activeDate = (page: Page) =>
  page.evaluate(() => (document.activeElement as HTMLElement | null)?.dataset.date ?? '');

failOnPageErrors();
test.beforeEach(async ({ page }) => ready(page));

test.describe('desktop 1440', () => {
  test.use({ viewport: { width: 1440, height: 1000 } });

  test('d_axe', async ({ page }) => {
    await axe(page, 'light');
    await setTheme(page, 'dark');
    await axe(page, 'dark');
    await setTheme(page, null);
  });
  test('d_thai_strings', async ({ page }) => {
    expect(await countText(page)).toContain('จาก 48');
    await expect(page.getByText('หน้า 1 / 5')).toBeVisible();
  });
  test('d_combobox', async ({ page }) => {
    const cb = page.getByRole('combobox', { name: 'ผู้ดูแล' });
    await cb.fill('kamon');
    await expect(page.getByRole('option', { name: /กมล/ })).toBeVisible();
    expect(await page.getByRole('listbox').getByRole('option').count()).toBe(1);
    await cb.press('Enter');
    await expect(cb).toHaveValue('กมล ศรีวงศ์');
    const cells = await page.locator('.aura-table__row [data-rc$=":4"]').allInnerTexts();
    expect(cells.length).toBeGreaterThan(0);
    expect(
      cells.every((c) => c === 'กมล ศรีวงศ์'),
      cells.join(', '),
    ).toBe(true);
    await cb.press('Escape');
    await expect(cb).toHaveValue(''); // Escape clears the value
  });
  test('d_range_typed', async ({ page }) => {
    const f = page.getByLabel('ช่วงวันที่', { exact: true });
    await f.fill('01/09/2569 – 05/09/2569');
    await f.press('Enter');
    await expect(f).toHaveValue('1 ก.ย. 2569 – 5 ก.ย. 2569');
    const dates = await page.locator('.aura-table__row [data-rc$=":3"]').allInnerTexts();
    expect(dates.length).toBeGreaterThan(0);
    expect(
      dates.every((d) => /^[1-5] ก\.ย\. 2569/.test(d)),
      dates.join(', '),
    ).toBe(true);
    await page.getByRole('button', { name: 'ล้างช่วงวันที่' }).click();
    await expect(f).toHaveValue('');
  });
  test('d_calendar_keys', async ({ page }) => {
    await page.getByRole('button', { name: 'เปิดปฏิทิน' }).first().click();
    const dlg = page.getByRole('dialog', { name: 'ช่วงวันที่' });
    await expect(dlg).toBeVisible();
    const focused = await activeDate(page);
    expect(focused, 'focus not in grid').not.toBe('');
    await page.keyboard.press('ArrowRight');
    const next = await activeDate(page);
    expect(next > focused, `${focused} → ${next}`).toBe(true);
    await page.keyboard.press('PageDown');
    expect((await activeDate(page)).slice(0, 7) > next.slice(0, 7)).toBe(true);
    for (let i = 0; i < 12; i++) {
      // Tab stays inside the popover
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => !!document.activeElement?.closest('.aura-cal__popover'))).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(dlg).toHaveCount(0);
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('f-range');
  });
  test('d_row_menu_drawer', async ({ page }) => {
    const rid = await firstId(page);
    await page.getByRole('button', { name: 'จัดการ ' + rid }).click();
    await page.getByRole('menuitem', { name: 'ดูรายละเอียด' }).click();
    const dr = page.getByRole('dialog', { name: rid });
    await expect(dr).toBeVisible();
    const box = (await dr.boundingBox())!;
    expect(Math.abs(box.x + box.width - 1440), JSON.stringify(box)).toBeLessThan(2);
    await page.keyboard.press('Escape');
    await expect(dr).toHaveCount(0);
  });
  test('d_cell_enter', async ({ page }) => {
    const cell = page.locator('.aura-table__row').first().locator('[data-rc$=":7"]');
    await cell.focus();
    await page.keyboard.press('Enter');
    expect(await activeAttr(page, 'aria-label')).toBe('จัดการ ' + (await firstId(page)));
    await page.keyboard.press('Escape');
    expect(await activeAttr(page, 'data-rc')).toMatch(/:7$/);
  });
  test('d_new_order', async ({ page }) => {
    await page.getByRole('button', { name: 'สร้างคำสั่งซื้อ' }).click();
    const dlg = page.getByRole('dialog', { name: 'สร้างคำสั่งซื้อ' });
    await expect(dlg).toBeVisible();
    expect(
      await page.evaluate(() => !!(document.activeElement?.closest('.aura-field') && document.activeElement.id)),
      'autofocus',
    ).toBe(true);
    await page.getByRole('button', { name: 'บันทึกคำสั่งซื้อ' }).click();
    await expect(dlg.getByText('ใส่ชื่อลูกค้า')).toBeVisible();
    await expect(dlg.getByText(/เลือกผู้ดูแล/)).toBeVisible();
    await expect(dlg.getByText('ใส่ยอดเงิน')).toBeVisible();
    const amount = dlg.getByRole('spinbutton', { name: /^ยอด/ });
    await amount.fill('2450');
    await amount.press('ArrowUp');
    await expect(amount).toHaveValue('2,550'); // typed, then +step (100), formatted
    await dlg.getByRole('textbox', { name: /^ลูกค้า/ }).fill('คุณทดสอบ ระบบ');
    const cb = dlg.getByRole('combobox', { name: /^ผู้ดูแล/ });
    await cb.fill('ธนพร');
    await cb.press('Enter');
    // the calendar popover opens above the dialog (z-index) and picks a date
    await dlg.getByRole('button', { name: 'เปิดปฏิทิน' }).click();
    const cal = page.locator('.aura-cal__popover');
    await expect(cal).toBeVisible();
    const b = (await cal.boundingBox())!;
    const top = await page.evaluate(
      ([x, y]) => document.elementFromPoint(x!, y!)?.closest('.aura-cal__popover') != null,
      [b.x + b.width / 2, b.y + b.height / 2],
    );
    expect(top, 'calendar is under the dialog').toBe(true);
    await cal.locator('[data-date="2026-09-25"]').click();
    await expect(dlg.getByRole('textbox', { name: /^วันที่ส่ง/ })).toHaveValue('25 ก.ย. 2569');
    const tp = dlg.getByRole('combobox', { name: /^เวลาส่ง/ });
    await tp.fill('19');
    await tp.press('Enter');
    await expect(dlg.getByText('เลือกเวลาระหว่าง 08:00–18:00 น.')).toBeVisible(); // out of range is refused, with a reason
    await tp.fill('930');
    await tp.press('Enter');
    await expect(tp).toHaveValue('09:30');
    await tp.press('ArrowDown');
    await expect(page.getByRole('listbox', { name: /^เวลาส่ง/ })).toBeVisible();
    await tp.press('ArrowDown');
    await tp.press('Enter');
    await expect(tp).toHaveValue('10:00');
    await page.getByRole('button', { name: 'บันทึกคำสั่งซื้อ' }).click();
    await expect(page.getByText('บันทึก ORD-1088 แล้ว')).toBeVisible();
    await expect(dlg).toHaveCount(0);
    expect(await countText(page)).toContain('จาก 49');
    await page.getByRole('button', { name: 'ปิดการแจ้งเตือน' }).first().click();
    await expect(page.locator('.aura-toast')).toHaveCount(0);
  });
  test('d_past_date', async ({ page }) => {
    await page.getByRole('button', { name: 'สร้างคำสั่งซื้อ' }).click();
    const dlg = page.getByRole('dialog', { name: 'สร้างคำสั่งซื้อ' });
    const f = dlg.getByRole('textbox', { name: /^วันที่ส่ง/ });
    await f.fill('2026-09-01');
    await f.press('Tab');
    await page.getByRole('button', { name: 'บันทึกคำสั่งซื้อ' }).click();
    // 5.1.1: DatePicker refuses a typed date before min itself and says so (the app's own check stays as a backstop)
    await expect(dlg.getByText('เลือกวันที่นี้ไม่ได้')).toBeVisible();
    await expect(f).toHaveValue('');
    await page.keyboard.press('Escape');
  });
  test('d_cancel_undo', async ({ page }) => {
    let row = page
      .locator('.aura-table__row')
      .filter({ hasNot: page.locator('.aura-pill', { hasText: 'ยกเลิก' }) })
      .nth(1);
    const rid = await row.locator('[data-rc$=":1"]').innerText();
    const before = await row.locator('.aura-pill').innerText();
    await page.getByRole('button', { name: 'จัดการ ' + rid }).click();
    await page.getByRole('menuitem', { name: 'ยกเลิกคำสั่งซื้อ' }).click();
    const ad = page.getByRole('alertdialog');
    await expect(ad).toBeVisible();
    await ad.getByRole('button', { name: 'ยกเลิกคำสั่งซื้อ' }).click();
    row = page.locator('.aura-table__row', { hasText: rid });
    await expect(row.getByText('ยกเลิก', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'เลิกทำ' }).click();
    await expect(row.locator('.aura-pill')).toHaveText(before);
  });
  test('d_upload', async ({ page }) => {
    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64',
    );
    await page.getByRole('button', { name: 'สร้างคำสั่งซื้อ' }).click();
    const dlg = page.getByRole('dialog', { name: 'สร้างคำสั่งซื้อ' });
    await dlg.getByLabel(/^ไฟล์แนบ/).setInputFiles([
      { name: 'kitchen.png', mimeType: 'image/png', buffer: png },
      { name: 'huge.png', mimeType: 'image/png', buffer: Buffer.alloc(6 * 1024 * 1024, '0') },
      { name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('hi') },
    ]);
    const items = dlg.locator('.aura-upload__item');
    await expect(items).toHaveCount(3);
    await expect(items.nth(0).locator('img')).toHaveCount(1); // image thumbnail
    await expect(items.nth(1)).toContainText('ไฟล์ใหญ่เกิน 5 MB');
    await expect(items.nth(2)).toContainText('ไม่รองรับไฟล์ชนิดนี้');
    await dlg.getByRole('button', { name: 'ลบ notes.txt' }).click();
    await expect(items).toHaveCount(2);
    expect(await page.evaluate(() => (document.activeElement as HTMLInputElement | null)?.type)).toBe('file'); // focus goes back to the input
    await page.getByRole('button', { name: 'บันทึกคำสั่งซื้อ' }).click();
    await expect(dlg.getByText('ลบไฟล์ที่มีปัญหาก่อนบันทึก')).toBeVisible();
  });
  test('d_grid_one_tab_stop', async ({ page }) => {
    await page.locator('.aura-table__row').first().locator('[data-rc$=":1"]').focus();
    await page.keyboard.press('Tab');
    expect(
      await page.evaluate(() => !!document.activeElement?.closest('[role=grid]')),
      'Tab stayed inside the grid',
    ).toBe(false);
    await page.keyboard.press('Shift+Tab');
    expect(await activeAttr(page, 'role')).toBe('gridcell');
    const n = await page.evaluate(
      () =>
        [...document.querySelectorAll<HTMLElement>('[role=grid] .aura-table__td button')].filter((b) => b.tabIndex >= 0)
          .length,
    );
    expect(n, `${n} buttons in cells still in the tab order`).toBe(0);
  });
  test('d_stats', async ({ page }) => {
    const stats = page.locator('.aura-stat');
    await expect(stats).toHaveCount(4);
    await expect(stats.nth(1).locator('.aura-stat__change.is-negative')).toContainText('+3'); // a rise that is bad news
    await expect(stats.nth(3).locator('.aura-stat__change.is-positive')).toContainText('+12%');
  });
  test('d_themes', async ({ page }) => {
    /* THEMES: a folder, or a pattern like themes/*.css */
    const given = process.env.THEMES || path.join(here, 'themes');
    const dir = given.includes('*') ? path.dirname(given) : given;
    const glob = path.basename(given);
    const pattern = given.includes('*')
      ? new RegExp(
          '^' +
            glob
              .split('*')
              .map((p) => p.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
              .join('.*') +
            '$',
        )
      : /\.css$/;
    for (const f of fs
      .readdirSync(dir)
      .filter((n) => pattern.test(n))
      .sort()) {
      const css = fs.readFileSync(path.join(dir, f), 'utf8');
      await page.evaluate((c) => {
        let s = document.getElementById('t');
        if (!s) {
          s = document.createElement('style');
          s.id = 't';
          document.head.appendChild(s);
        }
        s.textContent = c;
      }, css);
      for (const th of ['light', 'dark'] as const) {
        await setTheme(page, th);
        await page.waitForTimeout(350); // let colour transitions finish before measuring
        await axe(page, f + ' ' + th);
      }
    }
    await setTheme(page, null);
  });
  test('d_color_scheme', async ({ page }) => colorScheme(page, 'โหมดสี', 'มืด', 'ตามระบบ', ready));
  test('d_new_filters', async ({ page }) => {
    // 4.9 on the pilot: multi-select category filter, and the delivery-scope segmented control
    const before = await countText(page);
    const cat = page.getByRole('combobox', { name: 'ประเภท', exact: true });
    await cat.click();
    const lst = page.getByRole('listbox', { name: 'ประเภท' });
    await lst.getByRole('option', { name: 'บริการ' }).click();
    await lst.getByRole('option', { name: 'ค่าติดตั้ง' }).click();
    await cat.press('Escape');
    expect(await countText(page), 'category filter did not narrow the table').not.toBe(before);
    const clear = page.getByRole('button', { name: 'ล้าง', exact: true });
    if (await clear.count()) await clear.click();
    const seg = page.getByRole('radiogroup', { name: 'กำหนดส่ง' });
    await seg.getByRole('radio', { name: 'ทั้งหมด' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(seg.getByRole('radio', { name: 'วันนี้' })).toHaveAttribute('aria-checked', 'true');
    const dates = await page.locator('.aura-table__row [data-rc$=":3"]').allInnerTexts();
    expect(dates.length).toBeGreaterThan(0);
    expect(
      dates.every((d) => d.startsWith('18 ก.ย.')),
      dates.join(', '),
    ).toBe(true);
  });
  test('d_compact', async ({ page }) => {
    await compact(page, 'orders');
    await page.evaluate(() => document.documentElement.setAttribute('data-density', 'compact'));
    const rows = await page.evaluate(() =>
      [...document.querySelectorAll('.aura-table__row')].slice(0, 3).map((r) => r.getBoundingClientRect().height),
    );
    expect(
      rows.every((h) => Math.abs(h - 40) < 0.6),
      rows.join(', '),
    ).toBe(true);
  });
});

test.describe('tablet 820', () => {
  test.use({ viewport: { width: 820, height: 1100 } });
  test('t_table_fits', async ({ page }) => {
    const headers = await page.locator('[role=columnheader]').allInnerTexts();
    expect(
      headers.some((x) => x.includes('ผู้ดูแล') || x.includes('ยอด')),
      headers.join(', '),
    ).toBe(false);
    const over = await page.evaluate(() => {
      const g = document.querySelector('[role=grid]')!;
      return g.scrollWidth - g.clientWidth;
    });
    expect(over, `table scrolls sideways by ${over}px`).toBeLessThanOrEqual(1);
    expect(await scrollWidth(page)).toBeLessThanOrEqual(820);
  });
  test('t_axe', async ({ page }) => axe(page, 'tablet'));
});

test.describe('phone 390', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  /* 4.20: phone cards are the grid's own rows, laid out as cards by a container query. */
  const CARD = '.aura-table__scroll > .aura-table__row:not(.aura-table__head)';
  test('p_no_overflow', async ({ page }) => expect(await scrollWidth(page)).toBeLessThanOrEqual(390));
  test('p_axe', async ({ page }) => axe(page, 'phone'));
  test('p_nav_drawer', async ({ page }) => {
    await page.getByRole('button', { name: 'เปิดเมนู' }).click();
    const nav = page.getByRole('dialog', { name: 'เมนูหลัก' });
    await expect(nav).toBeVisible();
    const asButton = nav.getByRole('button', { name: /ทีม/ });
    await ((await asButton.count()) ? asButton : nav.getByRole('link', { name: /ทีม/ })).click();
    await expect(nav).toHaveCount(0);
  });
  test('p_filters', async ({ page }) => {
    await page.getByRole('button', { name: 'ตัวกรอง' }).click();
    const dr = page.getByRole('dialog', { name: 'ตัวกรอง' });
    await expect(dr).toBeVisible();
    expect((await dr.boundingBox())!.width).toBeGreaterThanOrEqual(389);
    await dr.getByRole('combobox', { name: 'สถานะ' }).click(); // 5.3: AURA's own list, not the browser's
    await page.getByRole('option', { name: 'เสร็จสิ้น' }).click();
    await dr.getByRole('button', { name: 'ดูผลลัพธ์' }).click();
    await expect(page.getByRole('button', { name: 'ตัวกรอง (1)' })).toBeVisible();
    const pills = await page.locator(CARD + ' .aura-pill').allInnerTexts();
    expect(pills.length).toBeGreaterThan(0);
    expect([...new Set(pills)]).toEqual(['เสร็จสิ้น']);
    await page.getByRole('button', { name: 'ล้าง', exact: true }).click();
  });
  test('p_card_detail', async ({ page }) => {
    await page.locator(CARD).first().locator('[data-card="field"]').first().click();
    const dr = page.getByRole('dialog', { name: /^ORD-/ });
    await expect(dr).toBeVisible();
    expect((await dr.boundingBox())!.width).toBeGreaterThanOrEqual(389);
    await page.keyboard.press('Escape');
  });
  test('p_card_menu', async ({ page }) => {
    await page
      .locator(CARD)
      .first()
      .getByRole('button', { name: /^จัดการ/ })
      .click();
    await expect(page.getByRole('menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0); // opening the menu did not also open the detail drawer
  });
  test('p_bottom_sheet', async ({ page }) => {
    await page.getByRole('button', { name: 'สร้างคำสั่งซื้อ' }).click();
    const b = (await page.getByRole('dialog', { name: 'สร้างคำสั่งซื้อ' }).boundingBox())!;
    expect(Math.abs(b.y + b.height - 844), JSON.stringify(b)).toBeLessThan(2);
    expect(b.width).toBeGreaterThanOrEqual(389);
    const save = (await page.getByRole('button', { name: 'บันทึกคำสั่งซื้อ' }).boundingBox())!;
    expect(save.y + save.height, 'Save below the fold').toBeLessThanOrEqual(844);
    await expect(page.getByRole('dialog', { name: 'สร้างคำสั่งซื้อ' }).getByText('(ไม่บังคับ)').first()).toBeVisible();
    await page.getByRole('button', { name: 'ยกเลิก', exact: true }).click();
  });
});
