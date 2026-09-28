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
  /* 5.7: a breadcrumb segment with no href or onClick is text; AppShell's <main> can take focus. */
  {
    const crumbs = renderToString(React.createElement(A.Breadcrumb, { items: [{ label: 'Settings', href: '/s' }, { label: 'Renewals' }, { label: 'Schedules' }] }));
    if (/<button/.test(crumbs) || !/aura-crumbs__text">Renewals</.test(crumbs)) { console.log(label, 'Breadcrumb text item:', crumbs); fail++; }
    const shell = renderToString(React.createElement(A.AppShell, { mainId: 'main-content' }, 'x'));
    if (!/<main[^>]*tabindex="-1"/.test(shell)) { console.log(label, 'AppShell main tabindex:', shell); fail++; }
  }
  /* 5.10.1: a Tag's remove button is named from rich children. */
  {
    const tag = renderToString(React.createElement(A.Tag, { onRemove: () => {} }, React.createElement('strong', null, 'Acme'), ' AB'));
    if (!/aria-label="Remove Acme AB"/.test(tag)) { console.log(label, 'Tag remove name:', tag); fail++; }
  }
  /* 5.12 (Chamber-OS 79): FilterSelect's server HTML is its face with a real, named <select> over it; searchGrow. */
  {
    const opts = [{ value: 'all', label: 'All statuses' }, { value: 'active', label: 'Active' }];
    const all = renderToString(React.createElement(A.FilterSelect, { id: 'st', label: 'Status', allLabel: 'All', options: opts, value: 'all', onChange: () => {} }));
    const act = renderToString(React.createElement(A.FilterSelect, { id: 'st', label: 'Status', allLabel: 'All', options: opts, defaultValue: 'active' }));
    const face = (html: string) => (html.match(/<span class="aura-filterselect__face" aria-hidden="true">([\s\S]*?)<svg/) || [])[1] || '';
    const text = (html: string) => face(html).replace(/<[^>]+>/g, '|').replace(/\|+/g, '|');
    if (text(all) !== '|Status|All|All statuses|' || text(act) !== '|Status|Active|') { console.log(label, 'FilterSelect face:', text(all), text(act)); fail++; }
    if (!/<select[^>]*aria-label="Status"[^>]*class="aura-filterselect__native"|<select[^>]*class="aura-filterselect__native"[^>]*aria-label="Status"/.test(all) || /aura-field|<label/.test(all)) { console.log(label, 'FilterSelect select:', all); fail++; }
    const kids = renderToString(
      React.createElement(A.FilterSelect, { label: 'Kind', allLabel: 'All', defaultValue: 'b' },
        React.createElement('option', { value: '' }, 'All kinds'),
        React.createElement('optgroup', { label: 'G' }, React.createElement('option', { value: 'b' }, 'Bra', 'vo')),
      ),
    );
    const kidsAll = renderToString(
      React.createElement(A.FilterSelect, { label: 'Kind', allLabel: 'All' }, React.createElement('option', { value: '' }, 'All kinds'), React.createElement('option', { value: 'b' }, 'Bravo')),
    );
    const frag = renderToString(
      React.createElement(A.FilterSelect, { label: 'Kind', defaultValue: 'b' }, React.createElement(React.Fragment, null, React.createElement('option', { value: 'a' }, 'Alpha'), React.createElement('option', { value: 'b' }, 'Bravo'))),
    );
    const skip = renderToString(
      React.createElement(A.FilterSelect, { label: 'Kind', allLabel: 'All' }, React.createElement('option', { value: '', disabled: true }, 'Pick'), React.createElement('option', { value: 'a' }, 'Alpha')),
    );
    if (text(frag) !== '|Kind|Bravo|' || text(skip) !== '|Kind|Alpha|') { console.log(label, 'FilterSelect fragment / disabled first:', text(frag), text(skip)); fail++; }
    if (text(kids) !== '|Kind|Bravo|' || text(kidsAll) !== '|Kind|All|All kinds|') { console.log(label, 'FilterSelect <option> children face:', text(kids), text(kidsAll)); fail++; }
    const grow = renderToString(React.createElement(A.FilterBar, { onSearchChange: () => {}, searchGrow: true }));
    const plainBar = renderToString(React.createElement(A.FilterBar, { onSearchChange: () => {} }));
    if (!/class="aura-filterbar aura-filterbar--grow"/.test(grow) || /--grow/.test(plainBar)) { console.log(label, 'FilterBar searchGrow:', grow); fail++; }
  }
  /* 5.11 (Chamber-OS 75, 76, 78): row box names, merged describedby, auto row height — default output unchanged. */
  {
    const rows = [{ id: 'M-1', company: 'Acme AB' }];
    const columns = [{ key: 'id', label: 'ID', width: 96 }, { key: 'company', label: 'COMPANY' }];
    const named = renderToString(React.createElement(A.DataTable, { label: 'M', rows, columns, selectable: true, rowSelectLabel: (r: { company: string }) => 'Select ' + r.company }));
    if ((named.match(/aria-label="Select Acme AB"/g) || []).length !== 2 || /Select row M/.test(named)) { console.log(label, 'rowSelectLabel:', named); fail++; }
    const blank = renderToString(React.createElement(A.DataTable, { label: 'M', rows, columns, selectable: true, rowSelectLabel: () => '' }));
    if ((blank.match(/aria-label="Select M-1"/g) || []).length !== 2) { console.log(label, 'empty rowSelectLabel should fall back:', blank); fail++; }
    const plain = renderToString(React.createElement(A.DataTable, { label: 'M', rows, columns, selectable: true }));
    if (/--auto|aura-table__cell/.test(plain)) { console.log(label, 'default DataTable changed:', plain); fail++; }
    const auto = renderToString(React.createElement(A.DataTable, { label: 'M', rows, columns, rowHeight: 'auto' }));
    if (!/class="aura-table__row aura-table__row--auto"/.test(auto) || (auto.match(/class="aura-table__td aura-table__td--auto"/g) || []).length !== 2 || (auto.match(/<span class="aura-table__cell">/g) || []).length !== 2) { console.log(label, 'rowHeight auto:', auto); fail++; }
    const w: string[] = [], ow = console.warn;
    console.warn = (m: unknown) => w.push(String(m));
    const virt = renderToString(React.createElement(A.DataTable, { label: 'M', rows, columns, rowHeight: 'auto', height: 300 }));
    console.warn = ow;
    if (/--auto|aura-table__cell/.test(virt) || !w.some((m) => /rowHeight="auto"` is ignored with `height`/.test(m))) { console.log(label, 'rowHeight auto + height:', w); fail++; }
    const both = renderToString(React.createElement(A.Checkbox, { id: 'k', 'aria-describedby': 'hint', description: 'D' }, 'Terms'));
    const own = renderToString(React.createElement(A.Checkbox, { id: 'k2', 'aria-describedby': 'hint' }, 'Terms'));
    const none = renderToString(React.createElement(A.Checkbox, { id: 'k3' }, 'Terms'));
    if (!/aria-describedby="hint k-desc"/.test(both) || !/aria-describedby="hint"/.test(own) || /aria-describedby/.test(none)) { console.log(label, 'Checkbox describedby:', both, own, none); fail++; }
  }
  /* 5.9 (Chamber-OS 71): keepMounted renders every panel, the inactive ones hidden; per-tab attributes reach the tab. */
  {
    const tabs = [
      { id: 'card', label: 'Card', content: 'C', tabProps: { 'aria-label': 'Card — switch payment method', 'data-testid': 'tab-card' } },
      { id: 'pp', label: 'PromptPay', content: 'P' },
    ];
    const kept = renderToString(React.createElement(A.Tabs, { label: 'Method', tabs, keepMounted: true }));
    const panels = kept.match(/role="tabpanel"[^>]*/g) || [];
    if (panels.length !== 2 || /hidden/.test(panels[0]!) || !/hidden/.test(panels[1]!)) { console.log(label, 'keepMounted panels:', panels); fail++; }
    if (!/data-testid="tab-card"[^>]*role="tab"|role="tab"[^>]*data-testid="tab-card"/.test(kept) || !/aria-label="Card — switch payment method"/.test(kept)) { console.log(label, 'tabProps:', kept); fail++; }
    const plain = renderToString(React.createElement(A.Tabs, { label: 'Method', tabs }));
    /* 5.10 (Chamber-OS 72): the segmented look is classes on the same DOM; the default output has none of them. */
    const seg = renderToString(React.createElement(A.Tabs, { label: 'Method', tabs, variant: 'segmented', fullWidth: true }));
    if (!/class="aura-tabs aura-tabs--segmented"/.test(seg) || !/role="tablist"[^>]*class="aura-tabs__list aura-segmented is-full"|class="aura-tabs__list aura-segmented is-full"[^>]*role="tablist"/.test(seg) || !/aura-tab is-active aura-segmented__option is-selected/.test(seg)) { console.log(label, 'segmented Tabs:', seg); fail++; }
    if (/segmented/.test(plain)) { console.log(label, 'default Tabs changed:', plain); fail++; }
    if ((plain.match(/role="tabpanel"/g) || []).length !== 1) { console.log(label, 'default Tabs should render one panel'); fail++; }
  }
  /* 5.8 (Chamber-OS 66, 68, 69): /server display components give the root's HTML; attributes reach the root. */
  {
    const { renderToStaticMarkup: m } = require('react-dom/server');
    const e = React.createElement;
    const cases: Array<[string, Record<string, unknown>]> = [
      ['Card', { title: 'Renewal', titleId: 'rp-t', id: 'renewal-prefs', 'data-testid': 'history-item', description: 'd', footer: 'f', children: 'b' }],
      ['Card', { 'aria-labelledby': 'outer', children: 'b', variant: 'creative', interactive: true, as: 'article' }],
      ['StatusPill', { 'data-state': 'decided', 'data-outcome': 'approved', children: 'Approved' }],
      ['Alert', { tone: 'danger', role: 'status', icon: 'clock', title: 'Pending review', 'data-testid': 'a', id: 'n1', children: 'x', action: e('button', null, 'Go') }],
      ['Alert', { tone: 'warning', children: 'y' }],
      ['Badge', { tone: 'success', icon: 'check', 'data-x': '1', children: '3' }],
      ['EmptyState', { title: 'Nothing', description: 'yet', icon: 'search', size: 'sm', bordered: true, headingLevel: 2 }],
    ];
    for (const [n, p] of cases) {
      const a = m(e(A[n], p)), b = m(e(S[n], p));
      if (a !== b) { console.log(label, n, '/server markup differs:\n  root  ', a, '\n  server', b); fail++; }
    }
    const card = m(e(A.Card, cases[0]![1])), pill = m(e(A.StatusPill, cases[2]![1])), alert = m(e(A.Alert, cases[3]![1]));
    if (!/id="renewal-prefs"/.test(card) || !/data-testid="history-item"/.test(card) || !/aria-labelledby="rp-t"/.test(card)) { console.log(label, 'Card attributes:', card); fail++; }
    if (!/aria-labelledby="outer"/.test(m(e(A.Card, cases[1]![1])))) { console.log(label, 'Card keeps a caller aria-labelledby without a title'); fail++; }
    if (!/data-state="decided"/.test(pill) || !/data-outcome="approved"/.test(pill)) { console.log(label, 'StatusPill attributes:', pill); fail++; }
    if (!/role="status"/.test(alert) || !/data-testid="a"/.test(alert) || !/id="n1"/.test(alert)) { console.log(label, 'Alert role/attributes:', alert); fail++; }
    const clock = m(e(A.Icon, { name: 'clock' })), withIcon = m(e(A.Alert, { tone: 'danger', icon: 'clock' }));
    if (withIcon.indexOf(clock.replace('<svg ', '<svg ').slice(0, 20)) < 0 || !/aria-hidden="true"/.test(withIcon)) { console.log(label, 'Alert icon:', withIcon); fail++; }
    const custom = m(e(A.Alert, { icon: e('svg', { 'data-mine': '1' }) }));
    if (!/data-mine="1"/.test(custom) || !/aura-icon--custom[^>]*aria-hidden="true"/.test(custom)) { console.log(label, 'Alert custom icon element:', custom); fail++; }
    /* With none of the new props, the output is what 5.7.3 gave. */
    const plain = m(e(A.Alert, { tone: 'danger', title: 'T', children: 'x' }));
    if (!/^<div class="aura-alert aura-alert--danger" role="alert"><svg/.test(plain)) { console.log(label, 'Alert default markup:', plain); fail++; }
    /* 67: labels from THead (fragments opened, aria-hidden parts skipped, colSpan counted); Td label wins; a nested
     * plain table takes no labels or roles. */
    const tbl = m(
      e(A.Table, { caption: 'Diff', stackBelow: 'sm' },
        e(React.Fragment, null, e(A.THead, null, e(A.Tr, null, e(A.Th, null, 'Field'), e(A.Th, { colSpan: 2 }, 'Seen ', e('span', { 'aria-hidden': true }, '↑')), e(A.Th, null, 'Proposed')))),
        e(A.TBody, null, e(A.Tr, null, e(A.Th, { scope: 'row' }, 'Address'), e(React.Fragment, null, e(A.Td, null, 'a'), e(A.Td, null, 'b')), e(A.Td, { label: 'New' }, e(A.Table, { caption: 'inner' }, e(A.TBody, null, e(A.Tr, null, e(A.Td, null, 'x')))))))),
    );
    const got = (tbl.match(/data-label="[^"]*"/g) || []).join(' ');
    if (got !== 'data-label="Seen" data-label="Seen" data-label="New"' || !/role="table"/.test(tbl) || !/role="rowheader"/.test(tbl)) { console.log(label, 'Table stack labels:', got, tbl); fail++; }
    if ((tbl.match(/role="table"/g) || []).length !== 1 || /<td class="aura-tbl__td" role="cell">x/.test(tbl)) { console.log(label, 'nested table took the outer labels or roles:', tbl); fail++; }
    if (S.buttonClass({ variant: 'secondary', size: 'sm', fullWidth: true }) !== 'aura-btn aura-btn--secondary aura-btn--sm aura-btn--full') { console.log(label, 'buttonClass'); fail++; }
    if (m(e(A.Button, { href: '/x', variant: 'secondary' }, 'Go')).indexOf('class="' + S.buttonClass({ variant: 'secondary' }) + '"') < 0) { console.log(label, 'Button class != buttonClass'); fail++; }
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
