/* Layout before hydration (4.16, 4.19, 4.20): server-renders two pages and opens them in Chromium — first with
 * JavaScript off (the server's HTML alone must already be the right layout), then hydrated (cumulative layout shift
 * 0, no console problems).
 * 1. An AppShell with a SideNav, BottomNav, a `stackBelow` DataTable and an ActionBar, at 320, 390 and 1280px.
 * 2. A DataTable with stackBelow={700} and a hideBelow={900} column at 390, 700, 900 and 1100px (Chamber-OS item 50):
 *    cards, grid without the column, grid with it — and every row in the HTML once.
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
if (process.env.KEEP) console.log('pages in', dir);
const APP = `
export function App(A, React) {
  const h = React.createElement;
  const rows = Array.from({ length: 8 }, (_, i) => ({ id: 'INV-' + (1001 + i), member: ['Acme AB', 'Nordic Rail', 'Siam Foods'][i % 3], status: ['Paid', 'Draft', 'Overdue'][i % 3], amount: (1200 + i * 350).toLocaleString('en-US') + ' THB' }));
  return h(A.AppShell, {
    header: h('strong', null, 'Chamber OS'),
    bottomNav: h(A.BottomNav, { value: 'inv', items: [{ id: 'home', label: 'Home', icon: 'house', href: '#home' }, { id: 'inv', label: 'Invoices', icon: 'file-text', href: '#inv' },
      { id: 'ev', label: 'Events', icon: 'calendar', href: '#ev' }, { id: 'in', label: 'Inbox', icon: 'inbox', href: '#in', count: 12 }, { id: 'me', label: 'Account', icon: 'user', href: '#me' }] }),
    nav: h(A.SideNav, { value: 'inv', items: [{ id: 'home', label: 'Dashboard', icon: 'layout-dashboard' }, { id: 'inv', label: 'Invoices', icon: 'file-text' }, { id: 'mem', label: 'Members', icon: 'users' }] }),
  }, h(A.DataTable, { label: 'Invoices', stackBelow: 640, rows, columns: [
      { key: 'id', label: 'INVOICE', width: 120, mono: true }, { key: 'member', label: 'MEMBER', width: 200 },
      { key: 'status', label: 'STATUS', width: 112, pill: true }, { key: 'amount', label: 'AMOUNT', align: 'end' }] }),
    h('form', { style: { marginTop: 24 } }, h(A.TextField, { label: 'Note', id: 'last-field' }),
      h(A.ActionBar, { status: 'Total 107,000.00 THB' }, h(A.Button, { type: 'submit' }, 'Save'))));
}`;
const APP2 = `
export function App(A, React) {
  const h = React.createElement;
  const rows = Array.from({ length: 6 }, (_, i) => ({ id: 'INV-' + (2001 + i), member: ['Acme AB', 'Nordic Rail', 'Siam Foods'][i % 3], status: ['Paid', 'Draft', 'Overdue'][i % 3], amount: (1200 + i * 350).toLocaleString('en-US') + ' THB' }));
  return h('div', { style: { padding: 0 } }, h(A.DataTable, { label: 'Register', stackBelow: 700, rows, columns: [
      { key: 'id', label: 'INVOICE', width: 140, mono: true }, { key: 'member', label: 'MEMBER', width: 260, hideBelow: 900 },
      { key: 'status', label: 'STATUS', width: 120, pill: true }, { key: 'amount', label: 'AMOUNT', align: 'end' }] }));
}`;
/* 5.0.1: a virtual (`height`) table with stackBelow. Before hydration the server only knows the first window of rows;
 * in cards the scroll box grows, so its spacers must not show as a blank gap. Hydrated, every row is a card. */
const APP3 = `
export function App(A, React) {
  const h = React.createElement;
  const rows = Array.from({ length: 60 }, (_, i) => ({ id: 'V-' + (3001 + i), member: ['Acme AB', 'Nordic Rail'][i % 2], amount: String(100 + i) }));
  return h(A.DataTable, { label: 'Virtual', stackBelow: 700, height: 360, rows, columns: [
    { key: 'id', label: 'ID', width: 120, mono: true }, { key: 'member', label: 'MEMBER', width: 200 }, { key: 'amount', label: 'AMOUNT', align: 'end' }] });
}`;
const A = await import('../dist/esm/index.js');
const css = ['../tokens/aura.css', 'styles/components.css']
  .map((f) => fs.readFileSync(path.join(root, f), 'utf8'))
  .join('\n');
const serverHtml = {};
async function makePage(name, source) {
  fs.writeFileSync(path.join(dir, name + '.mjs'), source);
  const { App } = await import(path.join(dir, name + '.mjs'));
  const html = renderToString(App(A, React));
  serverHtml[name] = html;
  fs.writeFileSync(
    path.join(dir, name + '-entry.mjs'),
    `
import * as React from 'react';
import { hydrateRoot } from 'react-dom/client';
import * as A from ${JSON.stringify(path.join(root, 'dist/esm/index.js'))};
import { App } from './${name}.mjs';
window.__cls = 0;
new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
hydrateRoot(document.getElementById('root'), App(A, React), { onRecoverableError: (e) => console.error('recoverable: ' + (e && e.message)) });
setTimeout(() => { window.__hydrated = true; }, 600);
`,
  );
  await build({
    entryPoints: [path.join(dir, name + '-entry.mjs')],
    bundle: true,
    outfile: path.join(dir, name + '.js'),
    format: 'iife',
    define: { 'process.env.NODE_ENV': '"production"' },
    logLevel: 'error',
    nodePaths: [path.join(root, 'node_modules'), path.join(root, '../../node_modules')],
  });
  fs.writeFileSync(
    path.join(dir, name + '.html'),
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}</style></head><body style="margin:0"><div id="root">${html}</div><script src="${name}.js"></script></body></html>`,
  );
}
await makePage('shell', APP);
await makePage('table', APP2);
await makePage('virtual', APP3);

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const fails = [];
const shows = (p, sel) =>
  p.evaluate((s) => [...document.querySelectorAll(s)].some((e) => e.getClientRects().length > 0), sel);
/* Cards or grid: a body row wraps its cells in the card layout. */
const layoutOf = (p) =>
  p.evaluate(() => {
    const r = document.querySelector('.aura-table__scroll > .aura-table__row:not(.aura-table__head)');
    if (!r) return document.querySelector('.aura-table__card') ? 'cards' : 'none';
    return r && getComputedStyle(r).flexWrap === 'wrap' ? 'cards' : 'grid';
  });
async function open(name, width, height, js) {
  const ctx = await browser.newContext({ viewport: { width, height }, javaScriptEnabled: js });
  const p = await ctx.newPage();
  const problems = [];
  p.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') problems.push(m.text().slice(0, 300));
  });
  await p.goto('file://' + path.join(dir, name + '.html'));
  if (js) await p.waitForFunction(() => window.__hydrated, null, { timeout: 15000 });
  return { ctx, p, problems };
}
async function afterHydration(p, problems, where) {
  const cls = await p.evaluate(() => window.__cls);
  if (cls > 0) fails.push(`${where}: cumulative layout shift ${cls.toFixed(4)}, expected 0`);
  for (const m of problems) fails.push(`${where}: console: ${m}`);
}
async function check(width, height, js) {
  const { ctx, p, problems } = await open('shell', width, height, js);
  const phone = width < 1024;
  const where = `${width}px, JavaScript ${js ? 'on' : 'off'}`;
  const expect = async (sel, visible, what) => {
    if ((await shows(p, sel)) !== visible) fails.push(`${where}: ${what} should be ${visible ? 'visible' : 'hidden'}`);
  };
  await expect('.aura-shell__nav', !phone, 'the sidebar');
  await expect('.aura-shell__menu', phone, 'the menu button');
  const lay = await layoutOf(p);
  if (lay !== (width < 640 ? 'cards' : 'grid')) fails.push(`${where}: the table is ${lay}`);
  await expect('.aura-bottomnav', phone, 'the bottom nav');
  /* 4.19: five tabs fit with whole labels, each at least 44px; at the end of the page the ActionBar sits above the
   * bottom nav and below the last field. */
  const bn = await p.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
    const r = (s) => document.querySelector(s).getBoundingClientRect();
    const items = [...document.querySelectorAll('.aura-bottomnav__item')].map((e) => {
      const b = e.getBoundingClientRect(),
        l = e.querySelector('.aura-bottomnav__label');
      return { w: b.width, h: b.height, clipped: l.scrollWidth > l.clientWidth };
    });
    return {
      items,
      nav: r('.aura-bottomnav'),
      bar: r('.aura-actionbar'),
      field: r('#last-field'),
      vh: innerHeight,
      docW: document.documentElement.scrollWidth,
    };
  });
  if (bn.docW > width) fails.push(`${where}: page scrolls sideways (${bn.docW}px)`);
  if (phone) {
    if (bn.items.length !== 5 || bn.items.some((i) => i.w < 44 || i.h < 44))
      fails.push(`${where}: bottom nav targets ${JSON.stringify(bn.items)}`);
    if (bn.items.some((i) => i.clipped)) fails.push(`${where}: a bottom nav label is cut off`);
    if (Math.round(bn.nav.bottom) !== bn.vh) fails.push(`${where}: bottom nav not at the bottom (${bn.nav.bottom})`);
    if (bn.bar.bottom > bn.nav.top)
      fails.push(`${where}: ActionBar (${bn.bar.bottom}) overlaps the bottom nav (${bn.nav.top})`);
  }
  if (bn.bar.top < bn.field.bottom)
    fails.push(`${where}: ActionBar (${bn.bar.top}) covers the last field (${bn.field.bottom})`);
  if (js) await afterHydration(p, problems, where);
  await ctx.close();
}
/* Page 2: stackBelow={700}, MEMBER hideBelow={900}. */
async function checkTable(width, js) {
  const { ctx, p, problems } = await open('table', width, 800, js);
  const where = `table at ${width}px, JavaScript ${js ? 'on' : 'off'}`;
  const want = width < 700 ? 'cards' : 'grid';
  const lay = await layoutOf(p);
  if (lay !== want) fails.push(`${where}: ${lay}, expected ${want}`);
  const m = await p.evaluate(() => {
    const vis = (el) => !!el && el.getClientRects().length > 0;
    const head = [...document.querySelectorAll('.aura-table__th')].find((e) => /MEMBER/.test(e.textContent));
    const cell = [...document.querySelectorAll('.aura-table__td')].find((e) => e.textContent === 'Acme AB');
    const sc = document.querySelector('.aura-table__scroll');
    const table = document.querySelector('.aura-table').getBoundingClientRect();
    return {
      member: vis(cell),
      header: vis(head),
      sideways: sc ? sc.scrollWidth - sc.clientWidth : 0,
      width: table.width,
      doc: document.documentElement.scrollWidth,
    };
  });
  /* Cards show every field; the grid drops MEMBER below 900. */
  const memberShown = width < 700 || width >= 900;
  if (m.member !== memberShown) fails.push(`${where}: MEMBER cells ${m.member ? 'shown' : 'hidden'}`);
  if (want === 'grid' && m.header !== memberShown)
    fails.push(`${where}: MEMBER header ${m.header ? 'shown' : 'hidden'}`);
  if (want === 'grid' && m.sideways > 1) fails.push(`${where}: the grid scrolls sideways by ${m.sideways}px`);
  if (Math.abs(m.width - width) > 1) fails.push(`${where}: table is ${m.width}px wide`);
  if (m.doc > width) fails.push(`${where}: page scrolls sideways (${m.doc}px)`);
  if (js) await afterHydration(p, problems, where);
  await ctx.close();
}
async function checkVirtual(js) {
  const { ctx, p, problems } = await open('virtual', 390, 800, js);
  const where = `virtual table at 390px, JavaScript ${js ? 'on' : 'off'}`;
  const m = await p.evaluate(() => ({
    gap: [...document.querySelectorAll('.aura-table__scroll > div[aria-hidden]:not(.aura-table__row)')].reduce(
      (s, e) => s + e.getBoundingClientRect().height,
      0,
    ),
    rows: document.querySelectorAll('.aura-table__scroll > .aura-table__row:not(.aura-table__head)').length,
  }));
  if (m.gap > 0) fails.push(`${where}: ${m.gap}px of blank spacer in the card layout`);
  if (js && m.rows !== 60) fails.push(`${where}: ${m.rows} cards, expected all 60`);
  if (js) for (const x of problems) fails.push(`${where}: console: ${x}`);
  await ctx.close();
}
/* One markup: each row is in the server's HTML once. */
for (const id of ['INV-2001', 'INV-2006']) {
  const n = serverHtml.table.split(id).length - 1;
  if (n !== 1) fails.push(`server HTML has ${id} ${n} times, expected once`);
}
for (const js of [false, true]) {
  await check(320, 640, js);
  await check(390, 844, js);
  await check(1280, 800, js);
  for (const w of [390, 699, 700, 899, 900, 1100]) await checkTable(w, js);
  await checkVirtual(js);
}
await browser.close();
if (fails.length) {
  console.error(`Layout before hydration FAIL (React ${React.version}):\n  ` + fails.join('\n  '));
  process.exit(1);
}
console.log(
  `Layout before hydration OK (React ${React.version}) — AppShell with a BottomNav and ActionBar, and a stackBelow DataTable, are right at 320, 390 and 1280px; a stackBelow={700} table with a hideBelow={900} column is cards / grid without it / grid with it at 390–1100px, each row once in the HTML. JavaScript off and hydrated, CLS 0.`,
);
