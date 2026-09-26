/* Server-render every component (ESM and CJS builds). Fails on any throw or a component missing from the fixtures. */
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { createRequire } from 'node:module';
import { fixtures } from './fixtures.ts';
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
    catch (e) { console.log(label, name, 'FAILED:', (e as Error).message); fail++; }
  }
  console.log(`${label}: ${Object.keys(fx).length} components server-rendered`);
  /* 5.0 (Chamber-OS item 51): the root formatDate() is the /server one — English and Gregorian by default, no warning. */
  const S = label === 'esm' ? await import('../dist/server/index.js') : require('../dist/server/index.cjs');
  const warns: string[] = [], origWarn = console.warn;
  console.warn = (m: unknown) => warns.push(String(m));
  const root = A.formatDate('2026-09-24'), server = S.formatDate('2026-09-24');
  console.warn = origWarn;
  if (root !== server || root !== '24 Sept 2026') { console.log(label, 'formatDate: root', root, 'vs /server', server); fail++; }
  if (A.formatDate('2026-09-24', { locale: 'th' }) !== '24 ก.ย. 2569') { console.log(label, 'formatDate th:', A.formatDate('2026-09-24', { locale: 'th' })); fail++; }
  if (warns.length) { console.log(label, 'formatDate warned:', warns); fail++; }
  /* 5.3: before hydration (and with JavaScript off) Select is the real <select>, labelled and usable; no button yet. */
  {
    const html = renderToString(React.createElement(A.Select, { id: 'sz', label: 'Size', name: 'size', placeholder: 'Pick', options: ['S', 'M'] }));
    if (!/<label[^>]*for="sz"/.test(html) || !/<select[^>]*id="sz"[^>]*class="aura-input__control"|<select[^>]*class="aura-input__control"[^>]*id="sz"/.test(html) || /role="combobox"|<button/.test(html)) {
      console.log(label, 'Select server HTML is not the native <select>:', html); fail++;
    }
  }
  /* 5.6: rows isRowSelectable rejects render no checkbox in the server HTML (JavaScript off). */
  {
    const html = renderToString(React.createElement(A.DataTable, { label: 'Q', selectable: true, isRowSelectable: (r: { ok: boolean }) => r.ok,
      rows: [{ id: 'a', ok: true }, { id: 'b', ok: false }, { id: 'c', ok: false }], columns: [{ key: 'id', label: 'ID' }] }));
    const boxes = (html.match(/type="checkbox"/g) || []).length;
    if (boxes !== 2) { console.log(label, 'isRowSelectable: expected 2 checkboxes (header + 1 row), got', boxes); fail++; }
  }
  /* 5.0.1: an unknown time zone or a malformed today doesn't crash; link Tabs mark no tab for a route without one. */
  try {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(A.todayIn('Asia/Bangkk'))) throw new Error('todayIn gave ' + A.todayIn('Asia/Bangkk'));
    renderToString(React.createElement(A.Calendar, { timeZone: 'Asia/Bangkk', today: 'soon', onSelect: () => {} }));
  } catch (e) { console.log(label, 'bad time zone:', (e as Error).message); fail++; }
  const tabsHtml = renderToString(React.createElement(A.Tabs, { label: 'T', value: 'sub', tabs: [{ id: 'a', label: 'A', href: '/a' }, { id: 'b', label: 'B', href: '/b' }] }));
  if (/aria-current/.test(tabsHtml)) { console.log(label, 'link Tabs marked a tab for an unmatched value'); fail++; }
  /* 5.1: Checkbox label without children warns once (6.0 shows it); hideLabel is quiet and keeps a description. */
  {
    const w: string[] = [], ow = console.warn;
    console.warn = (m: unknown) => w.push(String(m));
    renderToString(React.createElement(A.Checkbox, { label: 'Row 1', hideLabel: true, id: 'c1', description: 'Owner: Tao' }));
    const quiet = w.length;
    renderToString(React.createElement(A.Checkbox, { label: 'Row 2' }));
    renderToString(React.createElement(A.Checkbox, { label: 'Row 3' }));
    console.warn = ow;
    if (quiet || w.length !== 1 || !/6\.0/.test(w[0])) { console.log(label, 'Checkbox label notice:', w); fail++; }
    const html = renderToString(React.createElement(A.Checkbox, { label: 'Row 1', hideLabel: true, id: 'c1', description: 'Owner: Tao' }));
    if (!/id="c1-desc"/.test(html)) { console.log(label, 'hideLabel dropped the description target'); fail++; }
  }
  /* 5.1.1: tenant data can't break out of ThemeStyle's <style>; a bad colour or selector renders nothing, no crash. */
  {
    const w: string[] = [], ow = console.warn;
    console.warn = (m: unknown) => w.push(String(m));
    let html = '';
    try {
      html =
        renderToString(React.createElement(A.ThemeStyle, { brand: '#0ea5e9', name: 'Acme</style><script>alert(1)</script>*/ body{display:none} /*' })) +
        renderToString(React.createElement(A.ThemeStyle, { brand: '#0ea5e9', selector: '.t</style><script>x</script>' })) +
        renderToString(React.createElement(A.ThemeStyle, { brand: 'rgb(1,2,3)' }));
    } catch (e) { console.log(label, 'ThemeStyle threw:', (e as Error).message); fail++; }
    console.warn = ow;
    const css = (html.match(/<style[^>]*>([\s\S]*?)<\/style>/) || [])[1] || '';
    const comment = css.slice(0, css.indexOf('*/') + 2);
    if (/<|>/.test(css) || /\*\//.test(comment.slice(2, -2)) || !/^\/\* AURA theme/.test(css)) { console.log(label, 'ThemeStyle injection:', css.slice(0, 200)); fail++; }
    if ((html.match(/<style/g) || []).length !== 1) { console.log(label, 'ThemeStyle: expected only the safe one to render', html.length); fail++; }
    /* A nested provider inherits the locale; ColorSchemeScript escapes its key and follows the OS in system mode. */
    const nested = renderToString(
      React.createElement(A.AuraProvider, { locale: 'th' }, React.createElement(A.AuraProvider, { density: 'compact' }, React.createElement(A.DatePicker, { label: 'd', defaultValue: '2026-09-18' }))),
    );
    if (!/18 ก\.ย\. 2569/.test(nested)) { console.log(label, 'nested AuraProvider lost Thai'); fail++; }
    const script = A.colorSchemeScript({ storageKey: 'k</script><script>x' });
    if (/<\/script/i.test(script) || !/addEventListener\('change'/.test(script)) { console.log(label, 'colorSchemeScript:', script); fail++; }
    renderToString(React.createElement(A.Tooltip, { content: 'tip', open: true }, React.createElement('button', null, 'b')));
    /* Pieces that join into "*" + "/" after cleaning, and real selectors that must still work. */
    for (const name of ['Acme *<>/ body{display:none} /*', 'x **// y{} /*', 'a\\*/b']) {
      const c = A.createTheme({ brand: '#7c3aed', name }).css();
      if (c.indexOf('*/') !== c.indexOf('. Load after') + '. Load after aura.css. Generated by createTheme. '.length) { console.log(label, 'theme name escaped the comment:', c.slice(0, 120)); fail++; }
    }
    for (const sel of ['.tenant-acme', '[data-tenant^="acme"]', '[lang|="th"]', '.tenant\\:acme', '.ร้าน', ':where(.x) .brand', '#app > .brand']) {
      try { A.createTheme({ brand: '#7c3aed' }).css(sel); } catch (e) { console.log(label, 'selector refused:', sel); fail++; }
    }
    /* 5.2: parseDate reads eras anywhere and eight digits; no 1900s for years 0–99; no rollover; 12-hour times are 1–12. */
    const P = {
      '18 ก.ย. พ.ศ. 2569': '2026-09-18', '18092569': '2026-09-18', '20260918': '2026-09-18', '01/01/2450 ค.ศ.': '2450-01-01',
      '0024-05-01': '0024-05-01', '31/02/2026': null, '2026-02-31': null, '18/09/2569': '2026-09-18',
      '20120112': '2012-01-12', '19100515': '1910-05-15', '18 ก.ย. 2569BE': '2026-09-18', '18 ก.ย. 2569': '2026-09-18',
      '18 sep. 2026': '2026-09-18', '2026-09-18': '2026-09-18',
    };
    for (const [txt, want] of Object.entries(P)) if (A.parseDate(txt) !== want) { console.log(label, 'parseDate', txt, '→', A.parseDate(txt), 'want', want); fail++; }
    if (A.formatDate('2026-02-31') !== '') { console.log(label, 'formatDate rolled 2026-02-31 over:', A.formatDate('2026-02-31')); fail++; }
    if (A.parseTime && (A.parseTime('13pm') !== null || A.parseTime('0am') !== null || A.parseTime('12am') !== '00:00' || A.parseTime('1:30 pm') !== '13:30')) { console.log(label, 'parseTime 12-hour:', A.parseTime('13pm'), A.parseTime('0am'), A.parseTime('12am'), A.parseTime('1:30 pm')); fail++; }
    for (const sel of ['.a{}</style>', '.a;b', '.a /* x */']) {
      let threw = false;
      try { A.createTheme({ brand: '#7c3aed' }).css(sel); } catch (e) { threw = true; }
      if (!threw) { console.log(label, 'unsafe selector accepted:', sel); fail++; }
    }
  }
}
process.exit(fail ? 1 : 0);
