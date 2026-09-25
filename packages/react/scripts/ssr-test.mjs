/* Server-render every component (ESM and CJS builds). Fails on any throw or a component missing from the fixtures. */
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { createRequire } from 'node:module';
import { fixtures } from './fixtures.mjs';
const require = createRequire(import.meta.url);
let fail = 0;
const origError = console.error;
console.error = (...a) => { fail++; origError('console.error:', ...a); };
for (const [label, A] of [['esm', await import('../dist/esm/index.js')], ['cjs', require('../dist/cjs/index.cjs')]]) {
  const fx = fixtures(A, React);
  const comps = Object.keys(A).filter((k) => /^[A-Z][a-z]/.test(k));
  const missing = comps.filter((c) => !fx[c]);
  if (missing.length) { console.log(label, 'no fixture:', missing.join(', ')); fail++; }
  for (const [name, el] of Object.entries(fx)) {
    try { const html = renderToString(el); if (!html && !['Toaster', 'Dialog', 'Drawer', 'Menu', 'Command'].includes(name)) throw new Error('empty output'); }
    catch (e) { console.log(label, name, 'FAILED:', e.message); fail++; }
  }
  console.log(`${label}: ${Object.keys(fx).length} components server-rendered`);
  /* 4.20: the root formatDate() warns once, in development, when called without a locale (its default changes in 5.0). */
  const warns = [], origWarn = console.warn;
  console.warn = (m) => warns.push(String(m));
  A.formatDate('2026-09-24', { locale: 'th' });
  const noLocale = A.formatDate('2026-09-24');
  A.formatDate('2026-09-24');
  console.warn = origWarn;
  if (warns.length !== 1 || !/5\.0/.test(warns[0])) { console.log(label, 'formatDate warning: expected one, got', warns); fail++; }
  if (noLocale !== A.formatDate('2026-09-24', { locale: 'th' })) { console.log(label, 'formatDate default changed before 5.0:', noLocale); fail++; }
}
process.exit(fail ? 1 : 0);
