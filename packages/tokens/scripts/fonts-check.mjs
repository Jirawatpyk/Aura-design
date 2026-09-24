#!/usr/bin/env node
/* Self-hosted fonts under a strict CSP: serves this package, loads a page with `font-src 'self'` and
 * aura-fonts.local.css, and checks that Fraunces, Inter, JetBrains Mono and Noto Sans Thai (Thai text) all load
 * with no CSP violation. Control: the same page with the Google aura-fonts.css must be blocked.
 * Usage: node scripts/fonts-check.mjs   (CHROMIUM=/path/to/chrome to use a given browser) */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = { '.css': 'text/css', '.woff2': 'font/woff2', '.html': 'text/html' };
const CSP = "default-src 'none'; style-src 'self'; font-src 'self'";
const page = (fonts) => `<!doctype html><html><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<link rel="stylesheet" href="/aura.css"><link rel="stylesheet" href="/${fonts}"></head><body>
<p class="aura-text-display">Aura display</p><p class="aura-text-body">Inter 400 Å</p>
<p class="aura-text-label">Inter 500</p><p class="aura-text-h2">Inter 600</p>
<p class="aura-text-mono">AURA-001</p><p class="aura-text-body">ภาษาไทย ๑๒๓</p></body></html>`;
const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (url.startsWith('/page-')) { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(page(url.slice(6))); }
  const file = path.join(root, path.normalize(url));
  if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const base = 'http://127.0.0.1:' + server.address().port;
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
async function run(fonts) {
  const p = await browser.newPage();
  const violations = [];
  p.on('console', (m) => { if (/Content Security Policy/i.test(m.text())) violations.push(m.text()); });
  await p.goto(base + '/page-' + fonts);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(200);
  const loaded = await p.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '')));
  await p.close();
  return { loaded: [...new Set(loaded)].sort(), violations };
}
const fails = [];
const local = await run('aura-fonts.local.css');
for (const fam of ['Fraunces', 'Inter', 'JetBrains Mono', 'Noto Sans Thai']) if (!local.loaded.includes(fam)) fails.push(`${fam} did not load from aura-fonts.local.css`);
if (local.violations.length) fails.push('CSP violations with aura-fonts.local.css:\n    ' + local.violations.join('\n    '));
const google = await run('aura-fonts.css');
if (!google.violations.length) fails.push('control: the Google aura-fonts.css was not blocked by the CSP — the check is not testing anything');
await browser.close();
server.close();
if (fails.length) { console.error('Self-hosted fonts FAIL:\n  ' + fails.join('\n  ')); process.exit(1); }
console.log(`Self-hosted fonts OK — ${local.loaded.join(', ')} load under "${CSP}" with no violation; the Google @import is blocked (${google.violations.length} violation(s)).`);
