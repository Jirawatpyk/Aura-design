/* @jirawatpyk/aura-react/server: no 'use client', no React, and the helpers work where React Server Components run
 * (Node's `react-server` condition, where React has no createContext or hooks). Run after `npm run build`:
 * node --conditions=react-server scripts/server-entry-test.ts */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const fails = [];
for (const f of ['dist/server/index.js', 'dist/server/index.cjs']) {
  const code = fs.readFileSync(path.join(root, f), 'utf8');
  if (/use client/.test(code)) fails.push(f + " contains 'use client'");
  if (/require\(["']react|from ["']react/.test(code)) fails.push(f + ' imports react');
}
const esm = await import(path.join(root, 'dist/server/index.js'));
const cjs = createRequire(import.meta.url)(path.join(root, 'dist/server/index.cjs'));
for (const [name, A] of [
  ['esm', esm],
  ['cjs', cjs],
]) {
  const en = A.formatDate('2026-09-24');
  if (!/2026/.test(en) || !/Sep/.test(en))
    fails.push(`${name}: formatDate('2026-09-24') = "${en}", expected English Gregorian`);
  const th = A.formatDate('2026-09-24', { locale: 'th' });
  if (!/2569/.test(th)) fails.push(`${name}: formatDate(…, { locale: 'th' }) = "${th}", expected Buddhist-era 2569`);
  if (A.formatDate('2026-09-24', { locale: undefined }) !== en)
    fails.push(`${name}: locale: undefined should keep the English default`);
  if (A.parseDate('24/09/2569') !== '2026-09-24') fails.push(`${name}: parseDate('24/09/2569')`);
  if (A.parseTime('9.30') !== '09:30') fails.push(`${name}: parseTime('9.30')`);
  if (A.formatBytes(1536) !== '1.5 KB') fails.push(`${name}: formatBytes(1536)`);
  if (A.statusTone('Ready') !== 'ready') fails.push(`${name}: statusTone('Ready')`);
  if (A.STRINGS.th.close == null) fails.push(`${name}: STRINGS.th`);
  const theme = A.createTheme({ brand: '#0ea5e9' });
  if (!/--aura-/.test(theme.css()) || !theme.checks.every((c: { pass: boolean }) => c.pass)) fails.push(`${name}: createTheme`);
  if (!/data-theme/.test(A.colorSchemeScript())) fails.push(`${name}: colorSchemeScript`);
  if (A.breakpoints.lg !== 1024) fails.push(`${name}: breakpoints`);
}
if (fails.length) {
  console.error('Server entry FAIL:\n  ' + fails.join('\n  '));
  process.exit(1);
}
console.log(
  `Server entry OK — no 'use client', no React; formatDate('2026-09-24') = "${esm.formatDate('2026-09-24')}"; every helper works (ESM and CJS).`,
);
