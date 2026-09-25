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
  /* 5.0 (Chamber-OS item 51): the root formatDate() is the /server one — English and Gregorian by default, no warning. */
  const S = label === 'esm' ? await import('../dist/server/index.js') : require('../dist/server/index.cjs');
  const warns = [], origWarn = console.warn;
  console.warn = (m) => warns.push(String(m));
  const root = A.formatDate('2026-09-24'), server = S.formatDate('2026-09-24');
  console.warn = origWarn;
  if (root !== server || root !== '24 Sept 2026') { console.log(label, 'formatDate: root', root, 'vs /server', server); fail++; }
  if (A.formatDate('2026-09-24', { locale: 'th' }) !== '24 ก.ย. 2569') { console.log(label, 'formatDate th:', A.formatDate('2026-09-24', { locale: 'th' })); fail++; }
  if (warns.length) { console.log(label, 'formatDate warned:', warns); fail++; }
  /* 5.0.1: an unknown time zone or a malformed today doesn't crash; link Tabs mark no tab for a route without one. */
  try {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(A.todayIn('Asia/Bangkk'))) throw new Error('todayIn gave ' + A.todayIn('Asia/Bangkk'));
    renderToString(React.createElement(A.Calendar, { timeZone: 'Asia/Bangkk', today: 'soon', onSelect: () => {} }));
  } catch (e) { console.log(label, 'bad time zone:', e.message); fail++; }
  const tabsHtml = renderToString(React.createElement(A.Tabs, { label: 'T', value: 'sub', tabs: [{ id: 'a', label: 'A', href: '/a' }, { id: 'b', label: 'B', href: '/b' }] }));
  if (/aria-current/.test(tabsHtml)) { console.log(label, 'link Tabs marked a tab for an unmatched value'); fail++; }
}
process.exit(fail ? 1 : 0);
