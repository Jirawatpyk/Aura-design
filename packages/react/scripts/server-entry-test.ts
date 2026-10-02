/* @jirawatpyk/aura-react/server: no 'use client', no hooks, and the helpers and (5.8) display components work where
 * React Server Components run (Node's `react-server` condition, where React has no createContext or hooks — calling
 * one throws, so rendering the components here proves they use none). Run after `npm run build`:
 * node --conditions=react-server scripts/server-entry-test.ts */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
/* React 18's stable build refuses the react-server condition ("not yet supported outside of experimental channels";
 * Next.js ships its own React for Server Components). Then check without the condition; React 19 runs the real thing. */
try {
  createRequire(import.meta.url)('react');
} catch (e) {
  if (!/experimental channels/.test((e as Error).message)) throw e;
  console.log('React 18: no react-server build to load; checking the server entry without the condition.');
  const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url)], { stdio: 'inherit' });
  process.exit(r.status ?? 1);
}
const fails = [];
for (const f of [
  'dist/server/index.js',
  'dist/server/index.cjs',
  'dist/esm/icons.js',
  'dist/esm/iconSvg.js',
  'dist/esm/classes.js',
  'dist/icons/index.cjs',
  'dist/esm/strings.th.js',
  'dist/locales/sv.cjs',
]) {
  const code = fs.readFileSync(path.join(root, f), 'utf8');
  if (/use client/.test(code)) fails.push(f + " contains 'use client'");
  if (/react-dom|createContext|use(State|Effect|LayoutEffect|Context|Ref|Memo|Callback|Id)\b/.test(code))
    fails.push(f + ' uses react-dom, context or a hook');
}
/* A tiny server renderer: calls function and forwardRef components (no hooks allowed) and prints tags and attributes. */
function tree(n: any): string {
  if (n == null || n === false || n === true) return '';
  if (Array.isArray(n)) return n.map(tree).join('');
  if (typeof n !== 'object') return String(n);
  const t = n.type;
  if (typeof t === 'function') return tree(t(n.props));
  if (t && typeof t === 'object' && typeof t.render === 'function') return tree(t.render(n.props, null));
  if (typeof t === 'symbol') return tree(n.props.children);
  const attrs = Object.keys(n.props)
    .filter((k) => k !== 'children' && n.props[k] != null && typeof n.props[k] !== 'object')
    .map((k) => ` ${k === 'className' ? 'class' : k}="${n.props[k]}"`)
    .join('');
  return `<${t}${attrs}>${tree(n.props.children)}</${t}>`;
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
  if (!/--aura-/.test(theme.css()) || !theme.checks.every((c: { pass: boolean }) => c.pass))
    fails.push(`${name}: createTheme`);
  if (!/data-theme/.test(A.colorSchemeScript())) fails.push(`${name}: colorSchemeScript`);
  if (A.breakpoints.lg !== 1024) fails.push(`${name}: breakpoints`);
  /* 5.8: the display components render under react-server (a hook or context would throw there). */
  try {
    const html = [
      tree(A.Card({ id: 'renewal-prefs', 'data-testid': 'card', title: 'Renewal', titleId: 't1', children: 'Body' })),
      tree(A.StatusPill({ 'data-state': 'decided', children: 'Ready' })),
      tree(A.Alert({ tone: 'danger', role: 'status', icon: 'clock', title: 'Paused', children: 'Benefits paused' })),
      tree(A.Badge({ tone: 'success', children: '3' })),
      tree(A.EmptyState({ title: 'Nothing yet' })),
      /* 5.14 (Chamber-OS 88, 103) */
      tree(A.Stat({ label: 'Membership', headingLevel: 2, value: 'Active' })),
      tree(A.Stat({ label: 'Quota', loading: true })),
      tree(A.Avatar({ name: 'Anna Berg' })),
      /* 5.27 (Chamber-OS 131): Container, a forwardRef component, rendered through its render function. */
      tree(
        A.Container.render(
          {
            as: 'section',
            size: 'narrow',
            align: 'start',
            'data-slot': 'layout-container',
            'data-variant': 'form',
            children: 'Column',
          },
          null,
        ),
      ),
    ].join('');
    for (const want of [
      'id="renewal-prefs"',
      'data-testid="card"',
      'aria-labelledby="t1"',
      'aura-pill--ready',
      'data-state="decided"',
      'role="status"',
      'aura-alert--danger',
      'aura-badge--success',
      'aura-empty',
      '<h2 class="aura-stat__label">Membership</h2>',
      'aura-stat__skel',
      'aura-avatar',
      '>AB<',
      'class="aura-container is-narrow is-start"',
      'data-slot="layout-container"',
      'data-variant="form"',
      '<section',
    ])
      if (html.indexOf(want) < 0) fails.push(`${name}: display components: missing ${want} in ${html}`);
    if (A.buttonClass({ variant: 'secondary', size: 'sm' }) !== 'aura-btn aura-btn--secondary aura-btn--sm')
      fails.push(`${name}: buttonClass gave "${A.buttonClass({ variant: 'secondary', size: 'sm' })}"`);
  } catch (e) {
    fails.push(`${name}: display components threw under react-server: ${(e as Error).message}`);
  }
}
/* 5.9: the per-icon components render under react-server too, alone and through the server Alert. */
{
  const I = await import(path.join(root, 'dist/esm/icons.js'));
  const e = createRequire(import.meta.url)('react').createElement;
  try {
    const html =
      tree(e(I.IconUsers, { size: 20, label: 'Members' })) + tree(esm.Alert({ icon: e(I.IconClock), children: 'x' }));
    for (const want of ['width="20"', 'aria-label="Members"', 'class="aura-icon aura-alert__icon"'])
      if (html.indexOf(want) < 0) fails.push(`icons: missing ${want} in ${html}`);
  } catch (e) {
    fails.push(`icons threw under react-server: ${(e as Error).message}`);
  }
}
if (fails.length) {
  console.error('Server entry FAIL:\n  ' + fails.join('\n  '));
  process.exit(1);
}
console.log(
  `Server entry OK — no 'use client', no hooks, display components render; formatDate('2026-09-24') = "${esm.formatDate('2026-09-24')}"; every helper works (ESM and CJS).`,
);
