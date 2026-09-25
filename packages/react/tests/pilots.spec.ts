/* Behaviour + axe checks for pilot 2 (settings: form-heavy, react-hook-form) and pilot 3 (landing: Creative, themed).
 * npm run test:pilots -w packages/react */
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { axe, colorScheme, compact, example, failOnPageErrors, scrollWidth, setTheme } from './helpers.ts';

const settle = (page: Page) => page.waitForTimeout(500);
const width = async (page: Page, l: ReturnType<Page['getByRole']>) => (await l.boundingBox())!.width;

failOnPageErrors();

test.describe('settings', () => {
  test.use({ viewport: { width: 1440, height: 1000 } });
  test.beforeEach(async ({ page }) => {
    await page.goto(example('settings'));
    await settle(page);
  });
  const TABS = ['Profile', 'Notifications', 'Team', 'Billing', 'Audit log'];

  test('s_axe_all_tabs', async ({ page }) => {
    for (const th of ['light', 'dark'] as const) {
      await setTheme(page, th);
      for (const t of TABS) {
        await page.getByRole('tab', { name: new RegExp('^' + t) }).click();
        await page.waitForTimeout(450);
        await axe(page, `${t} ${th}`);
      }
    }
  });
  test('s_rhf_validation', async ({ page }) => {
    const save = page.getByRole('button', { name: 'Save changes' });
    await expect(save).toBeDisabled(); // nothing changed yet
    const name = page.getByRole('textbox', { name: /^Full name/ });
    await name.fill('');
    const email = page.getByRole('textbox', { name: /^Email/ });
    await email.fill('not-an-email');
    await save.click();
    await expect(page.getByText('Enter your name')).toBeVisible();
    await expect(page.getByText('Use an address like name@company.com')).toBeVisible();
    await expect(name).toBeFocused(); // RHF focuses the first error via the forwarded ref
    await expect(name).toHaveAttribute('aria-invalid', 'true');
    const hours = page.getByRole('spinbutton', { name: /^Working hours/ });
    await hours.fill('70');
    await save.click();
    await expect(page.getByText('Up to 60 hours a week')).toBeVisible(); // RHF rule on a NumberField (Controller)
    await hours.fill('38');
    const stepper = page.getByRole('navigation', { name: 'Workspace setup' });
    await expect(stepper.locator('[aria-current="step"]')).toContainText('Invite your team');
    await name.fill('Tao Pyk');
    await email.fill('tao@acme.co');
    await save.click();
    await expect(page.getByText('Profile saved')).toBeVisible();
    await expect(save).toBeDisabled();
  });
  test('s_time_and_zone', async ({ page }) => {
    const tz = page.getByRole('combobox', { name: 'Time zone' });
    await tz.fill('tok');
    await tz.press('Enter');
    await expect(tz).toHaveValue('Asia/Tokyo');
    const from = page.getByRole('combobox', { name: 'From' });
    await from.fill('23');
    await from.press('Enter');
    await expect(from).toHaveValue('23:00');
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeEnabled();
  });
  test('s_checkbox_labels', async ({ page }) => {
    await page.getByRole('tab', { name: 'Notifications' }).click();
    const cb = page.getByRole('checkbox', { name: 'Product news' });
    await expect(cb).not.toBeChecked();
    await page.getByText('Product news', { exact: true }).click();
    await expect(cb).toBeChecked();
    await expect(page.getByRole('checkbox', { name: 'Mentions' })).toHaveAttribute(
      'aria-describedby',
      'n-mention-desc',
    );
    await page.getByRole('radio', { name: /^Weekly/ }).check();
    await expect(page.getByRole('radio', { name: /^Weekly/ })).toBeChecked();
  });
  test('s_team', async ({ page }) => {
    await page.getByRole('tab', { name: /^Team/ }).click();
    await page.getByRole('button', { name: 'Remove Mai K' }).click();
    const ad = page.getByRole('alertdialog');
    await expect(ad).toBeVisible();
    await ad.getByRole('button', { name: 'Remove Member' }).click();
    await expect(page.getByText('Mai K removed')).toBeVisible();
    await expect(page.getByText('2 of 5 seats')).toBeVisible();
    const f = page.getByRole('textbox', { name: 'Add a domain' });
    await f.fill('Acme.io');
    await f.press('Enter');
    await expect(page.getByText('acme.io', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Remove example.com' }).click();
    await expect(page.getByText('example.com', { exact: true })).toHaveCount(0);
  });
  test('s_billing', async ({ page }) => {
    await page.getByRole('tab', { name: 'Billing' }).click();
    await expect(page.getByRole('progressbar', { name: 'Storage' })).toHaveAttribute('aria-valuetext', '7.4 of 10 GB');
    const head = page.getByRole('button', { name: /^Single sign-on/ });
    await expect(head).toHaveAttribute('aria-expanded', 'false');
    await head.click();
    await expect(head).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('region', { name: /^Single sign-on/ })).toContainText('Business plan');
    await head.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('button', { name: /^Delete workspace/ })).toBeFocused();
    await page.keyboard.press('Home');
    await expect(page.getByRole('button', { name: /^Export all data/ })).toBeFocused();
    await expect(page.getByRole('heading', { name: 'No API keys yet' })).toBeVisible();
  });
  test('s_audit', async ({ page }) => {
    await page.getByRole('tab', { name: 'Audit log' }).click();
    await settle(page);
    const nav = page.getByRole('navigation', { name: 'Audit log pages' });
    const events = page.getByRole('list', { name: 'Audit events' }).locator('li');
    const first = await events.first().innerText();
    await nav.getByRole('button', { name: 'Page 3' }).click();
    await expect(nav.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
    expect(await events.first().innerText()).not.toBe(first);
    const info = page.getByRole('button', { name: "What's recorded" });
    await info.click();
    const pop = page.getByRole('dialog', { name: "What's recorded" });
    await expect(pop).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(pop).toHaveCount(0);
    await expect(info).toBeFocused();
  });
  test('s_color_scheme', async ({ page }) => colorScheme(page, 'Colour scheme', 'Dark', 'System', settle));
  test('s_compact', async ({ page }) => compact(page, 'settings'));
});

test.describe('settings, phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('s_phone', async ({ page }) => {
    await page.goto(example('settings'));
    await settle(page);
    expect(await scrollWidth(page)).toBeLessThanOrEqual(390);
    await page.getByRole('tab', { name: 'Audit log' }).click();
    await settle(page);
    await expect(page.getByRole('navigation', { name: 'Audit log pages' }).getByText('Page 1 of 6')).toBeVisible(); // compact pager
    await axe(page, 'audit phone');
    await page.getByRole('tab', { name: /^Team/ }).click();
    await page.waitForTimeout(300);
    const f = page.getByRole('textbox', { name: 'Add a domain' });
    const b = page.getByRole('button', { name: 'Add', exact: true });
    expect(
      Math.abs((await width(page, f)) - (await width(page, b))),
      'stacked field and button should be full width on phones',
    ).toBeLessThanOrEqual(3);
  });
});

test.describe('landing', () => {
  test.use({ viewport: { width: 1440, height: 900 } });
  test.beforeEach(async ({ page }) => {
    await page.goto(example('landing'));
    await settle(page);
  });
  test('l_axe_brands', async ({ page }) => {
    for (const brand of ['AURA', 'Sky', 'Rose', 'Emerald']) {
      await page.getByRole('button', { name: brand, exact: true }).click();
      for (const th of ['light', 'dark'] as const) {
        await setTheme(page, th);
        await axe(page, `${brand} ${th}`);
      }
    }
  });
  test('l_theme_switch', async ({ page }) => {
    const acc = () =>
      page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--aura-fg-accent').trim());
    const a = await acc();
    await page.getByRole('button', { name: 'Sky', exact: true }).click();
    expect(await acc()).not.toBe(a);
    await expect(page.getByRole('button', { name: 'Sky', exact: true })).toHaveAttribute('aria-pressed', 'true');
    const bg = await page
      .getByRole('button', { name: 'ทดลองใช้ฟรี 14 วัน' })
      .evaluate((e) => getComputedStyle(e).backgroundColor);
    expect(bg).toBe('rgb(255, 255, 255)'); // Creative stays white on the mesh
  });
  test('l_surface_light_in_dark', async ({ page }) => {
    await setTheme(page, 'dark');
    const col = await page.getByRole('button', { name: 'นัดดูเดโม' }).evaluate((e) => getComputedStyle(e).color);
    expect(['rgb(24, 24, 27)', 'rgb(9, 9, 11)'], 'secondary button on the mesh should use light-theme ink').toContain(
      col,
    );
  });
  test('l_signup', async ({ page }) => {
    const submit = page.getByRole('button', { name: 'รับลิงก์ทดลองใช้' });
    await expect(submit).toBeDisabled();
    await page.getByText('ยอมรับเงื่อนไขการใช้งาน').click();
    await expect(submit).toBeEnabled();
    const email = page.getByRole('textbox', { name: 'อีเมลที่ทำงาน' });
    await email.fill('abc');
    await submit.click();
    await expect(page.getByText('ใส่อีเมลแบบ name@company.com')).toBeVisible();
    await email.fill('tao@wren.co');
    await submit.click();
    await expect(page.getByRole('alert').or(page.locator('.aura-alert')).first()).toContainText('tao@wren.co');
  });
  test('l_hero_cta_focus', async ({ page }) => {
    await page.getByRole('button', { name: 'ทดลองใช้ฟรี 14 วัน' }).click();
    await expect(page.getByRole('textbox', { name: 'อีเมลที่ทำงาน' })).toBeFocused();
  });
  test('l_color_scheme', async ({ page }) => colorScheme(page, 'โหมดสี', 'มืด', 'ตามระบบ', settle));
  test('l_compact', async ({ page }) => compact(page, 'landing'));
});

test.describe('landing, phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('l_phone', async ({ page }) => {
    await page.goto(example('landing'));
    await settle(page);
    expect(await scrollWidth(page)).toBeLessThanOrEqual(390);
    for (const th of ['light', 'dark'] as const) {
      await setTheme(page, th);
      await axe(page, 'phone ' + th);
    }
    const f = page.getByRole('textbox', { name: 'อีเมลที่ทำงาน' });
    const b = page.getByRole('button', { name: 'รับลิงก์ทดลองใช้' });
    expect(Math.abs((await width(page, f)) - (await width(page, b)))).toBeLessThanOrEqual(3);
  });
});
