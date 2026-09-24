/* Layout before hydration (4.16): server-renders an AppShell with a SideNav and a `stackBelow` DataTable, then opens
 * it in Chromium at 390 × 844 and 1280 × 800 — first with JavaScript off (the server's HTML alone must already be
 * the right layout), then hydrated (cumulative layout shift must be 0, one table layout left, no console problems).
 * Run after `npm run build`. CHROMIUM=/path/to/chrome to use a given browser. */
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { build } from 'esbuild';
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aura-layout-'));
const APP = `
export function App(A, React) {
  const h = React.createElement;
  const rows = Array.from({ length: 8 }, (_, i) => ({ id: 'INV-' + (1001 + i), member: ['Acme AB', 'Nordic Rail', 'Siam Foods'][i % 3], status: ['Paid', 'Draft', 'Overdue'][i % 3], amount: (1200 + i * 350).toLocaleString('en-US') + ' THB' }));
  return h(A.AppShell, {
    header: h('strong', null, 'Chamber OS'),
    nav: h(A.SideNav, { value: 'inv', items: [{ id: 'home', label: 'Dashboard', icon: 'layout-dashboard' }, { id: 'inv', label: 'Invoices', icon: 'file-text' }, { id: 'mem', label: 'Members', icon: 'users' }] }),
  }, h(A.DataTable, { label: 'Invoices', stackBelow: 640, rows, columns: [
      { key: 'id', label: 'INVOICE', width: 120, mono: true }, { key: 'member', label: 'MEMBER', width: 200 },
      { key: 'status', label: 'STATUS', width: 112, pill: true }, { key: 'amount', label: 'AMOUNT', align: 'end' }] }));
}`;
fs.writeFileSync(path.join(dir, 'app.mjs'), APP);
const { App } = await import(path.join(dir, 'app.mjs'));
const A = await import('../dist/esm/index.js');
const html = renderToString(App(A, React));
fs.writeFileSync(path.join(dir, 'entry.mjs'), `
import * as React from 'react';
import { hydrateRoot } from 'react-dom/client';
import * as A from ${JSON.stringify(path.join(root, 'dist/esm/index.js'))};
import { App } from './app.mjs';
window.__cls = 0;
new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
hydrateRoot(document.getElementById('root'), App(A, React), { onRecoverableError: (e) => console.error('recoverable: ' + (e && e.message)) });
setTimeout(() => { window.__hydrated = true; }, 600);
`);
await build({ entryPoints: [path.join(dir, 'entry.mjs')], bundle: true, outfile: path.join(dir, 'app.js'), format: 'iife',
  define: { 'process.env.NODE_ENV': '"production"' }, logLevel: 'error', nodePaths: [path.join(root, 'node_modules'), path.join(root, '../../node_modules')] });
const css = ['../tokens/aura.css', 'styles/components.css'].map((f) => fs.readFileSync(path.join(root, f), 'utf8')).join('\n');
fs.writeFileSync(path.join(dir, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}</style></head><body style="margin:0"><div id="root">${html}</div><script src="app.js"></script></body></html>`);

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const fails = [];
const shows = (p, sel) => p.evaluate((s) => [...document.querySelectorAll(s)].some((e) => e.getClientRects().length > 0), sel);
async function check(width, height, js) {
  const ctx = await browser.newContext({ viewport: { width, height }, javaScriptEnabled: js });
  const p = await ctx.newPage();
  const problems = [];
  p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') problems.push(m.text().slice(0, 300)); });
  await p.goto('file://' + path.join(dir, 'index.html'));
  if (js) await p.waitForFunction(() => window.__hydrated, null, { timeout: 15000 });
  const phone = width < 1024;
  const where = `${width}px, JavaScript ${js ? 'on' : 'off'}`;
  const expect = async (sel, visible, what) => { if ((await shows(p, sel)) !== visible) fails.push(`${where}: ${what} should be ${visible ? 'visible' : 'hidden'}`); };
  await expect('.aura-shell__nav', !phone, 'the sidebar');
  await expect('.aura-shell__menu', phone, 'the menu button');
  await expect('.aura-table--stacked', width < 640, 'the cards');
  await expect('.aura-table:not(.aura-table--stacked)', width >= 640, 'the grid');
  if (js) {
    const cls = await p.evaluate(() => window.__cls);
    if (cls > 0) fails.push(`${where}: cumulative layout shift ${cls.toFixed(4)}, expected 0`);
    if (await p.evaluate(() => document.querySelectorAll('.aura-table-dual').length)) fails.push(`${where}: both table layouts still in the page after hydration`);
    for (const m of problems) fails.push(`${where}: console: ${m}`);
  } else if (!(await p.evaluate(() => document.querySelectorAll('.aura-table-dual').length))) fails.push(`${where}: server HTML has no dual table`);
  await ctx.close();
}
for (const js of [false, true]) { await check(390, 844, js); await check(1280, 800, js); }
await browser.close();
if (fails.length) { console.error(`Layout before hydration FAIL (React ${React.version}):\n  ` + fails.join('\n  ')); process.exit(1); }
console.log(`Layout before hydration OK (React ${React.version}) — AppShell and a stackBelow DataTable are right at 390 and 1280px with JavaScript off, and hydrate with CLS 0.`);
