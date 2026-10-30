/* Development warnings that need a real layout (5.78, visual audit 21): a DataTable or Table that scrolls sideways on
 * a phone without stackBelow warns once, in development only; with stackBelow, or on a wide screen, it doesn't.
 * Client-rendered with React in development mode, opened in Chromium. Run after `npm run build`. */
import { build } from 'esbuild';
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aura-devwarn-'));
const css = fs.readFileSync(path.join(root, 'dist/styles.css'), 'utf8');
const APP = (stack: boolean) => `
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import * as A from ${JSON.stringify(path.join(root, 'dist/esm/index.js'))};
const h = React.createElement;
const rows = Array.from({ length: 3 }, (_, i) => ({ id: 'INV-' + (1001 + i), member: 'Nordic Foods AB', status: 'Paid', amount: '12,400 THB' }));
const cols = [{ key: 'id', label: 'Invoice', width: 140 }, { key: 'member', label: 'Member', width: 220 }, { key: 'status', label: 'Status', width: 120 }, { key: 'amount', label: 'Amount', width: 140 }];
createRoot(document.getElementById('root')).render(h('div', null,
  h(A.DataTable, { label: 'Invoices', rows, columns: cols, stackBelow: ${stack ? 640 : 'undefined'} }),
  h(A.Table, { 'aria-label': 'Lines', stackBelow: ${stack ? "'sm'" : 'undefined'} },
    h(A.THead, null, h(A.Tr, null, ['Q1', 'Q2', 'Q3', 'Q4', 'Year', 'Budget'].map((c) => h(A.Th, { key: c }, c)))),
    h(A.TBody, null, h(A.Tr, null, ['12,400,000.00', '9,800,000.00', '11,050,000.00', '13,200,000.00', '46,450,000.00', '45,000,000.00'].map((c, i) => h(A.Td, { key: i }, c)))))));
setTimeout(() => { window.__done = true; }, 600);
`;
async function page(name: string, stack: boolean) {
  fs.writeFileSync(path.join(dir, name + '-entry.mjs'), APP(stack));
  await build({
    entryPoints: [path.join(dir, name + '-entry.mjs')],
    bundle: true,
    outfile: path.join(dir, name + '.js'),
    format: 'iife',
    define: { 'process.env.NODE_ENV': '"development"' },
    logLevel: 'error',
    nodePaths: [path.join(root, 'node_modules'), path.join(root, '../../node_modules')],
  });
  fs.writeFileSync(
    path.join(dir, name + '.html'),
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}</style></head><body style="margin:0;padding:16px"><div id="root"></div><script src="${name}.js"></script></body></html>`,
  );
}
await page('plain', false);
await page('stacked', true);

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const fails: string[] = [];
async function warnings(name: string, width: number): Promise<string[]> {
  const ctx = await browser.newContext({ viewport: { width, height: 800 } });
  const p = await ctx.newPage();
  const seen: string[] = [];
  p.on('console', (m) => {
    if (/\[AURA\].*scrolls sideways/.test(m.text())) seen.push(m.text());
  });
  await p.goto('file://' + path.join(dir, name + '.html'));
  await p.waitForFunction(() => (window as unknown as { __done?: boolean }).__done, null, { timeout: 15000 });
  await ctx.close();
  return seen;
}
const narrow = await warnings('plain', 390);
if (narrow.length !== 2 || !narrow.some((t) => /DataTable "Invoices"/.test(t)) || !narrow.some((t) => /Table "Lines"/.test(t)))
  fails.push('390px without stackBelow: expected one DataTable and one Table warning, got ' + JSON.stringify(narrow));
if (!narrow.every((t) => /stackBelow/.test(t) && /6\.0/.test(t))) fails.push('the warnings name stackBelow and 6.0: ' + JSON.stringify(narrow));
const wide = await warnings('plain', 1280);
if (wide.length) fails.push('1280px: no warning expected, got ' + JSON.stringify(wide));
const stacked = await warnings('stacked', 390);
if (stacked.length) fails.push('390px with stackBelow: no warning expected, got ' + JSON.stringify(stacked));
await browser.close();
if (fails.length) {
  console.error('Dev warnings FAIL:\n  ' + fails.join('\n  '));
  process.exit(1);
}
console.log('Dev warnings OK — a table that scrolls sideways at 390px without stackBelow warns (DataTable and Table); with stackBelow or at 1280px it does not.');
