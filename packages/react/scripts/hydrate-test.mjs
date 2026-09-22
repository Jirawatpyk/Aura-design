/* Hydration test: server-render every fixture, then hydrate the same markup in a real browser with the
 * development build of React. Fails on any console error or warning (hydration mismatch, key warning,
 * deprecated API) and on any recoverable error. Needs a Playwright Chromium (`npx playwright install chromium`
 * or CHROMIUM=/path/to/chrome). Run after `npm run build`. */
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { build } from 'esbuild';
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fixtures } from './fixtures.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const A = await import('../dist/esm/index.js');
const fx = fixtures(A, React);
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'aura-hydrate-'));

const body = Object.entries(fx).map(([n, el]) => `<div data-fx="${n}">${renderToString(el)}</div>`).join('\n');
fs.writeFileSync(path.join(dir, 'entry.mjs'), `
import * as React from 'react';
import { hydrateRoot } from 'react-dom/client';
import * as A from ${JSON.stringify(path.join(root, 'dist/esm/index.js'))};
import { fixtures } from ${JSON.stringify(path.join(root, 'scripts/fixtures.mjs'))};
const fx = fixtures(A, React);
document.querySelectorAll('[data-fx]').forEach((d) => hydrateRoot(d, fx[d.dataset.fx], {
  onRecoverableError: (e) => console.error('recoverable error in ' + d.dataset.fx + ': ' + (e && e.message)),
}));
setTimeout(() => { window.__hydrated = document.querySelectorAll('[data-fx]').length; }, 500);
`);
await build({ entryPoints: [path.join(dir, 'entry.mjs')], bundle: true, outfile: path.join(dir, 'app.js'), format: 'iife',
  define: { 'process.env.NODE_ENV': '"development"' }, logLevel: 'error', nodePaths: [path.join(root, 'node_modules'), path.join(root, '../../node_modules')] });
fs.writeFileSync(path.join(dir, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"></head><body>${body}<script src="app.js"></script></body></html>`);

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const page = await browser.newPage();
const problems = [];
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') problems.push(`${m.type()}: ${m.text().slice(0, 400)}`); });
page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
await page.goto('file://' + path.join(dir, 'index.html'));
await page.waitForFunction(() => window.__hydrated > 0, null, { timeout: 15000 });
const n = await page.evaluate(() => window.__hydrated);
await browser.close();
console.log(`React ${React.version}: ${n} fixtures hydrated, ${problems.length} console problem(s)`);
for (const p of problems) console.log('  ' + p);
process.exit(problems.length ? 1 : 0);
