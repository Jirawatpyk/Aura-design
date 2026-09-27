/* 5.9, getting ready for 6.0: per-icon components, registerIcons, locale packs, their notices and the icon codemod.
 * Each notice check runs in its own process (a notice prints once per process). Run after `npm run build`. */
import * as React from 'react';
import { renderToStaticMarkup as html } from 'react-dom/server';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const e = React.createElement;
const scenario = process.argv[2];
const build = process.argv[3] || 'esm';
const load = async (esmPath: string, cjsPath: string) => (build === 'esm' ? await import(esmPath) : require(cjsPath));
const A = await load('../dist/esm/index.js', '../dist/cjs/index.cjs');
const I = await load('../dist/esm/icons.js', '../dist/icons/index.cjs');
const TH = await load('../dist/esm/strings.th.js', '../dist/locales/th.cjs');
const SV = await load('../dist/esm/strings.sv.js', '../dist/locales/sv.cjs');
const warns: string[] = [];
console.warn = (m: unknown) => warns.push(String(m));
const out = (o: unknown) => process.stdout.write(JSON.stringify(o));

/* Every component that draws an icon of its own, with no icon from the app. */
function internals() {
  const rows = [{ id: 'a', n: 1 }, { id: 'b', n: 2 }];
  return e(
    'div',
    null,
    ...['info', 'success', 'warning', 'danger'].map((t) => e(A.Alert, { key: t, tone: t, onDismiss: () => {}, title: 't' }, 'x')),
    ...['neutral', 'progress', 'ready', 'warning', 'blocked'].map((t) => e(A.StatusPill, { key: t, tone: t }, t)),
    e(A.EmptyState, { title: 'x' }),
    e(A.Button, { loading: true }, 'x'),
    e(A.Checkbox, { label: 'c', indeterminate: true }),
    e(A.Checkbox, { label: 'd', defaultChecked: true }),
    e(A.DataTable, { label: 'T', rows, columns: [{ key: 'id', label: 'ID', sortable: true, width: 80 }, { key: 'n', label: 'N' }], pageSize: 1, reorderable: true }),
    e(A.DataTable, { label: 'E', rows: [], columns: [{ key: 'id', label: 'ID' }] }),
    e(A.Pagination, { pageCount: 5 }),
    e(A.DatePicker, { label: 'd', defaultValue: '2026-09-18', clearable: true }),
    e(A.Select, { label: 's', options: ['a'] }),
    e(A.Combobox, { label: 'c', options: ['a'] }),
    e(A.TimePicker, { label: 't' }),
    e(A.NumberField, { label: 'n' }),
    e(A.PasswordField, { label: 'p' }),
    e(A.TextField, { label: 't', error: 'bad' }),
    e(A.FileUpload, { label: 'f' }),
    e(A.Tag, { onRemove: () => {} }, 'x'),
    e(A.Stat, { label: 'a', value: 1, delta: 5 }),
    e(A.Breadcrumb, { items: [{ label: 'a', href: '/a' }, { label: 'b' }] }),
    e(A.SideNav, { collapsible: true, items: [{ id: 'g', label: 'G', children: [{ id: 'c', label: 'C' }] }] }),
    e(A.Accordion, { items: [{ id: 'a', title: 'A', content: 'x' }] }),
    e(A.Stepper, { steps: ['a', 'b'], current: 1 }),
    e(A.Dialog, { open: true, title: 'x', onClose: () => {} }, 'x'),
    e(A.AppShell, { nav: e('nav'), header: 'h' }, 'x'),
    e(A.FormErrorSummary, { errors: { a: 'x' } }),
    e(A.ColorSchemeToggle || 'span'),
  );
}

if (scenario === 'internal-quiet') {
  /* AURA's own icons never trigger the icon-name notice; an app's name does, once. */
  html(internals());
  const quiet = warns.filter((w) => /registerIcons/.test(w)).length;
  html(e(A.Button, { icon: 'plus' }, 'a'));
  html(e(A.Button, { icon: 'users' }, 'b'));
  out({ quiet, after: warns.filter((w) => /registerIcons/.test(w)) });
} else if (scenario === 'registered') {
  A.registerIcons(I.allIcons);
  const h = html(e(A.Button, { icon: 'plus' }, 'a'));
  out({ warns, plus: /M5 12h14/.test(h) });
} else if (scenario === 'partial') {
  /* Only the registered names are ready for 6.0: another name still gets the notice. */
  A.registerIcons([I.IconUsers]);
  html(e(A.Button, { icon: 'users' }, 'a'));
  const quiet = warns.length;
  html(e(A.Button, { icon: 'plus' }, 'b'));
  out({ quiet, warns });
} else if (scenario === 'locale') {
  const r: Record<string, number> = {};
  const count = () => warns.filter((w) => /locales\//.test(w)).length;
  html(e(A.AuraProvider, { locale: 'en' }, e(A.Pagination, { pageCount: 3 })));
  r.en = count();
  html(e(A.AuraProvider, { locale: 'th', strings: TH.th }, e(A.Pagination, { pageCount: 3 })));
  html(e(A.AuraProvider, { locale: 'sv', strings: SV.sv }, e(A.Pagination, { pageCount: 3 })));
  r.withPack = count();
  html(e(A.AuraProvider, { locale: 'th', strings: { close: 'x' } }, e(A.Pagination, { pageCount: 3 })));
  html(e(A.AuraProvider, { locale: 'th' }, e(A.Pagination, { pageCount: 3 })));
  r.thNoPack = count();
  out({ r, warns });
} else {
  let fail = 0;
  const bad = (...m: unknown[]) => {
    console.log(...m);
    fail++;
  };
  const run = (s: string, b: string) => {
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), s, b], { encoding: 'utf8' });
    if (r.status !== 0) throw new Error(s + ' ' + b + ' exited ' + r.status + ': ' + r.stderr);
    return JSON.parse(r.stdout);
  };
  for (const b of ['esm', 'cjs']) {
    const q = run('internal-quiet', b);
    if (q.quiet !== 0 || q.after.length !== 1 || !/icon="plus"/.test(q.after[0]))
      bad(b, 'icon-name notice: internal', q.quiet, 'after an app name', q.after);
    const r = run('registered', b);
    if (r.warns.length || !r.plus) bad(b, 'registerIcons(allIcons): notice', r.warns, 'plus drawn', r.plus);
    const pr = run('partial', b);
    if (pr.quiet !== 0 || pr.warns.length !== 1 || !/icon="plus"/.test(pr.warns[0])) bad(b, 'registerIcons([IconUsers]) then "plus":', pr);
    const l = run('locale', b);
    if (l.r.en !== 0 || l.r.withPack !== 0 || l.r.thNoPack !== 1) bad(b, 'locale-pack notice', l.r, l.warns);
  }

  /* Every icon: the name, the component and the component passed as the name give the same <svg>. */
  const shapes = A.ICONS as Record<string, unknown>;
  const names = (I.allIcons as Array<{ iconName: string; auraShapes: unknown }>).map((c) => c.iconName);
  if (names.length !== Object.keys(shapes).length || names.length !== A.iconNames.length) bad('icon count', names.length, Object.keys(shapes).length);
  const pascal = (n: string) => 'Icon' + n.split('-').map((p) => p[0]!.toUpperCase() + p.slice(1)).join('');
  A.registerIcons([]);
  for (const c of I.allIcons as Array<{ iconName: string; auraShapes: unknown }>) {
    const n = c.iconName;
    if (JSON.stringify(shapes[n]) !== JSON.stringify(c.auraShapes)) bad('ICONS copy differs from the component:', n);
    if (I[pascal(n)] !== c) bad('export name', pascal(n));
    const variants: Array<Record<string, unknown>> = [{}, { size: 'lg', label: 'L', className: 'k', strokeWidth: 3 }, { size: 13 }];
    for (const p of variants) {
      const C = c as unknown as React.ElementType;
      const byName = html(e(A.Icon, { name: n, ...p }));
      const comp = html(e(C, p));
      const asName = html(e(A.Icon, { name: e(C), ...p }));
      const inner = html(e(A.Icon, { name: e(C, p) }));
      /* Passed from a Server Component, the icon arrives already rendered: its <svg>. */
      const drawn = html(e(A.Icon, { name: (c as unknown as { render: (p: object, r: null) => React.ReactElement }).render({}, null), ...p }));
      if (byName !== comp || byName !== asName || byName !== inner || byName !== drawn) bad('icon markup differs:', n, JSON.stringify(p), byName, comp, asName, inner, drawn);
    }
  }
  /* The element's own className and the Icon's both apply; Icon's size wins. */
  const both = html(e(A.Icon, { name: e(I.IconUsers, { className: 'own', size: 'lg' }), className: 'outer', size: 'sm' }));
  if (!/class="aura-icon own outer"/.test(both) || !/width="16"/.test(both)) bad('merged props', both);
  /* Your own <svg> whose class merely ends in "aura-icon" is still your element (wrapped), not taken for AURA's. */
  if (!/aura-icon--custom/.test(html(e(A.Icon, { name: e('svg', { className: 'my-aura-icon' }) })))) bad('own svg with a similar class');
  /* A button with a component icon renders what the name gave. */
  if (html(e(A.Button, { icon: e(I.IconPlus) }, 'a')) !== html(e(A.Button, { icon: 'plus' }, 'a'))) bad('Button icon element');

  /* Locale packs are the built-in strings, and render the same. */
  for (const [l, pack] of [['th', TH.th], ['sv', SV.sv]] as const) {
    if (JSON.stringify(Object.keys(pack)) !== JSON.stringify(Object.keys(A.STRINGS[l]))) bad(l, 'pack keys differ');
    const a = html(e(A.AuraProvider, { locale: l }, e(A.Pagination, { pageCount: 3 }), e(A.FileUpload, { label: 'f', accept: 'image/*', maxSize: 2048 })));
    const b = html(e(A.AuraProvider, { locale: l, strings: pack }, e(A.Pagination, { pageCount: 3 }), e(A.FileUpload, { label: 'f', accept: 'image/*', maxSize: 2048 })));
    if (a !== b) bad(l, 'pack renders differently');
  }

  /* The codemod (TypeScript AST): what it rewrites, and what it must leave alone. */
  const { transform } = await import('./aura-icons-codemod.mjs');
  const src = [
    "'use client';",
    "import * as React from 'react';",
    "import { Button, Icon as AuraIcon, SideNav } from '@jirawatpyk/aura-react';",
    "import * as Aura from '@jirawatpyk/aura-react';",
    "import { Other } from 'other-lib';",
    "import { IconUsers as TablerUsers, IconX } from '@tabler/icons-react';",
    "type Item = { icon: 'plus' | 'minus'; label: string };",
    "const chart = { icon: 'circle', data: [] };",
    "const nav = [{ id: 'h', label: 'Home', icon: 'house' }];",
    "const snippet = `",
    "import x from 'y';",
    "<Button icon=\"plus\">`;",
    'export const A = ({ it }) => (',
    '  <>',
    '    <AuraIcon size={20} name="users" />',
    '    <AuraIcon name="globe"></AuraIcon>',
    "    <Button title=\"a > b\" onClick={() => go(1)} icon='plus' iconRight={'arrow-right'}>New</Button>",
    '    <Button icon="no-such-icon">x</Button>',
    '    <Button icon="x">close</Button>',
    '    <Other icon="users" />',
    '    <Aura.Badge icon="check">ok</Aura.Badge>',
    '    <Aura.Icon name="bell" />',
    "    <SideNav items={[...nav, { id: 'x', label: 'X', icon: it.icon }]} />",
    '    <Button icon={it.icon}>y</Button>',
    '  </>',
    ');',
  ].join('\n');
  const r = transform(src, 'a.tsx');
  const want = [
    "import { Button, SideNav } from '@jirawatpyk/aura-react';",
    "import { IconArrowRight, IconBell, IconCheck, IconGlobe, IconHouse, IconPlus, IconUsers } from '@jirawatpyk/aura-react/icons';\ntype Item",
    "type Item = { icon: 'plus' | 'minus'; label: string };",
    "const chart = { icon: 'circle', data: [] };",
    "const nav = [{ id: 'h', label: 'Home', icon: <IconHouse /> }];",
    "import x from 'y';\n<Button icon=\"plus\">`;",
    '    <IconUsers size={20} />',
    '    <IconGlobe></IconGlobe>',
    "    <Button title=\"a > b\" onClick={() => go(1)} icon={<IconPlus />} iconRight={<IconArrowRight />}>New</Button>",
    '    <Button icon="no-such-icon">x</Button>',
    '    <Button icon="x">close</Button>',
    '    <Other icon="users" />',
    '    <Aura.Badge icon={<IconCheck />}>ok</Aura.Badge>',
    '    <IconBell />',
  ];
  for (const w of want) if (r.code.indexOf(w) < 0) bad('codemod: missing', JSON.stringify(w), '\n' + r.code);
  const leftText = r.left.join('\n');
  for (const w of ['IconX is already a name', "icon: 'circle'", 'icon: it.icon', 'icon={it.icon}'])
    if (leftText.indexOf(w) < 0) bad('codemod: expected a note on', w, r.left);
  if (transform(r.code, 'a.tsx').code !== r.code) bad('codemod is not idempotent');
  if (transform("import { Other } from 'x';\n<Other icon=\"users\" />", 'b.tsx').code.indexOf('Icon') >= 0) bad('codemod touched a file without AURA');
  /* /server-only files, CRLF, merging into an existing icons import, .ts files reported not changed. */
  const srv = transform("import { Alert } from '@jirawatpyk/aura-react/server';\r\nimport { IconX } from '@jirawatpyk/aura-react/icons';\r\nexport const B = () => <Alert icon=\"clock\">x</Alert>;\r\n", 'b.tsx');
  if (srv.code !== "import { Alert } from '@jirawatpyk/aura-react/server';\r\nimport { IconClock, IconX } from '@jirawatpyk/aura-react/icons';\r\nexport const B = () => <Alert icon={<IconClock />}>x</Alert>;\r\n")
    bad('codemod /server + merge:', JSON.stringify(srv.code));
  const crlf = transform("import { Button } from '@jirawatpyk/aura-react';\r\nexport const C = () => <Button icon=\"plus\" />;\r\n", 'c.tsx');
  if (crlf.code.indexOf("aura-react';\r\nimport { IconPlus } from '@jirawatpyk/aura-react/icons';\r\n") < 0) bad('codemod CRLF:', JSON.stringify(crlf.code));
  /* A type-only icons import is not merged into; a local IconUsers inside a component blocks that name; a config
   * object whose title is an object is not an item; a .js file with JSX is converted; a trailing comment stays. */
  const edge = transform(
    [
      "import { Button, SideNav } from '@jirawatpyk/aura-react'; // AURA",
      "import type { AuraIcon } from '@jirawatpyk/aura-react/icons';",
      'export function P({ p }) {',
      '  const IconUsers = p.i;',
      "  const chart = { title: { text: 'x' }, icon: 'circle' };",
      '  return <><Button icon="users" /><Button icon="plus" /><SideNav items={[{ id: 1, label: p.l, icon: \'house\' }]} /></>;',
      '}',
    ].join('\n'),
    'p.tsx',
  );
  const edgeWant = [
    "import type { AuraIcon } from '@jirawatpyk/aura-react/icons';\nimport { IconHouse, IconPlus } from '@jirawatpyk/aura-react/icons';",
    "// AURA\nimport type",
    '<Button icon="users" />',
    '<Button icon={<IconPlus />} />',
    "icon: 'circle'",
    'icon: <IconHouse />',
  ];
  for (const w of edgeWant) if (edge.code.indexOf(w) < 0) bad('codemod edge: missing', JSON.stringify(w), '\n' + edge.code);
  const js = transform("import { Button } from '@jirawatpyk/aura-react';\nexport const J = () => <Button icon=\"plus\" />;\nexport const items = [{ label: 'A', icon: 'house' }];\n", 'j.js');
  if (js.code.indexOf('icon={<IconPlus />}') < 0 || js.code.indexOf('icon: <IconHouse />') < 0) bad('codemod .js with JSX:', js.code);
  const cm = transform("import { Button } from '@jirawatpyk/aura-react'; // AURA\nexport const K = () => <Button icon=\"plus\" />;\n", 'k.tsx');
  if (cm.code.indexOf("aura-react'; // AURA\nimport { IconPlus } from '@jirawatpyk/aura-react/icons';\n") < 0) bad('codemod trailing comment:', JSON.stringify(cm.code));
  const tsFile = "import type { MenuItem } from '@jirawatpyk/aura-react';\nexport const items: MenuItem[] = [{ label: 'Edit', icon: 'pencil' }];\n";
  const tr = transform(tsFile, 'items.ts');
  if (tr.code !== tsFile || !/needs JSX/.test(tr.left.join())) bad('codemod .ts file:', tr);

  if (fail) process.exit(1);
  console.log(`5.9 prep OK — ${names.length} icons match by name and component (ESM/CJS), notices once and only for app names, locale packs, codemod.`);
}
