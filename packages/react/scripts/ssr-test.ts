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
  /* 5.22 (Chamber-OS 118): a card: 'footer' column's cells carry data-card="footer"; other columns unchanged. */
  {
    const e = React.createElement;
    const dt = renderToString(e(A.DataTable, { label: 'R', rows: [{ id: 1, m: 'Kiruna' }], rowKey: 'id', stackBelow: 640, columns: [{ key: 'm', label: 'MEMBER' }, { key: 'a', label: '', actions: true, card: 'footer', render: () => e('button', null, 'Send') }] }));
    if (!/data-card="footer"/.test(dt) || !/data-card="title"/.test(dt) || /data-card="actions"/.test(dt)) { console.log(label, 'DataTable card footer:', dt.slice(0, 600)); fail++; }
  }
  /* 5.21 (Chamber-OS 117): Table rowHeight="density" adds its class; the default doesn't. */
  {
    const e = React.createElement;
    const t = (p: Record<string, unknown>) => renderToString(e(A.Table, p, e(A.TBody, null, e(A.Tr, null, e(A.Td, null, 'x')))));
    const on = t({ rowHeight: 'density', align: 'middle' });
    if (!/<table class="aura-tbl aura-tbl--middle aura-tbl--row-density">/.test(on) || /rowheight|rowHeight/i.test(on.replace('row-density', ''))) { console.log(label, 'Table rowHeight:', on); fail++; }
    if (/row-density|tbl--middle/.test(t({}))) { console.log(label, 'Table default changed'); fail++; }
    if (!/aura-tbl--middle aura-tbl--row-density/.test(t({ rowHeight: 'density' })) || /tbl--middle/.test(t({ rowHeight: 'density', align: 'top' }))) { console.log(label, 'Table rowHeight centring'); fail++; }
  }
  /* 5.20 (Chamber-OS 115, 116): a Table takes the provider's density; ActionBar's start slot. Defaults unchanged. */
  {
    const e = React.createElement;
    const bad = (what: string, html: string) => { console.log(label, what, html); fail++; };
    const tbl = (p: Record<string, unknown>) => e(A.Table, p, e(A.TBody, null, e(A.Tr, null, e(A.Td, null, 'x'))));
    const inCompact = renderToString(e(A.AuraProvider, { density: 'compact' }, tbl({})));
    if (!/<div class="aura-tbl-wrap" data-density="compact">/.test(inCompact)) bad('Table in a compact provider:', inCompact);
    const own = renderToString(e(A.AuraProvider, { density: 'compact' }, tbl({ density: 'comfortable' })));
    if (!/<div class="aura-tbl-wrap" data-density="comfortable">/.test(own)) bad('Table density prop wins:', own);
    const plain = renderToString(tbl({}));
    if (/data-density/.test(plain)) bad('Table default changed:', plain);
    const ab = renderToString(e(A.ActionBar, { status: 'Unsaved', start: e('button', null, 'Cancel') }, e('button', null, 'Next')));
    if (!/<div class="aura-actionbar__inner has-start"><div class="aura-actionbar__status" role="status">Unsaved<\/div><div class="aura-actionbar__start"><button>Cancel<\/button><\/div><div class="aura-actionbar__actions"><button>Next<\/button><\/div>/.test(ab)) bad('ActionBar start:', ab);
    const ab0 = renderToString(e(A.ActionBar, null, e('button', null, 'Next')));
    if (/has-start|__start/.test(ab0)) bad('ActionBar default changed:', ab0);
    for (const empty of [false, true, '', null]) {
      const h = renderToString(e(A.ActionBar, { start: empty }, e('button', null, 'Next')));
      if (/has-start|__start/.test(h)) bad('ActionBar empty start renders:', h);
    }
    const idle = renderToString(e(A.ActionBar, { selected: 0, start: e('button', null, 'Cancel') }));
    if (/Cancel/.test(idle)) bad('ActionBar idle shows start:', idle);
  }
  /* 5.19 (Chamber-OS 113, 114): read-only Switch and Select; defaults unchanged. */
  {
    const e = React.createElement;
    const bad = (what: string, html: string) => { console.log(label, what, html); fail++; };
    const sw = renderToString(e(A.Switch, { id: 's', label: 'M2M benefits access', checked: true, readOnly: true, icon: 'lock', description: 'd', 'aria-describedby': 'note' }));
    if (!/^<div class="aura-switch-row is-readonly">/.test(sw) || !/aria-readonly="true"/.test(sw) || !/aria-describedby="s-desc note"/.test(sw) || !/class="aura-icon aura-switch-row__icon" aria-hidden="true"/.test(sw) || /disabled/.test(sw)) bad('Switch readOnly:', sw);
    const sw0 = renderToString(e(A.Switch, { id: 's', label: 'L', 'aria-describedby': 'note' }));
    if (!/aria-describedby="note"/.test(sw0) || /readonly|s-ro|switch-row__icon/.test(sw0)) bad('Switch default / describedby merge:', sw0);
    const swd = renderToString(e(A.Switch, { id: 's', label: 'L', readOnly: true, disabled: true }));
    if (/readonly|-ro"/.test(swd) || !/disabled=""/.test(swd)) bad('Switch disabled wins over readOnly:', swd);
    const opts = [{ value: 'person', label: 'Person' }, { value: 'company', label: 'Company' }];
    const se = renderToString(e(A.AuraProvider, { locale: 'th' }, e(A.Select, { id: 't', label: 'Member type', value: 'company', options: opts, readOnly: true, 'aria-describedby': 'note', onChange: () => {} })));
    if (!/class="aura-input aura-select is-readonly"/.test(se) || !/aria-readonly="true"/.test(se) || !/aria-describedby="note"/.test(se) || !/<option value="person" disabled="">Person<\/option><option value="company" selected="">Company<\/option>/.test(se) || /aura-select__chevron/.test(se)  || /readonly=""/i.test(se)) bad('Select readOnly:', se);
    const se1 = renderToString(e(A.Select, { label: 'T', options: opts, readOnly: true }));
    if (/disabled=""/.test(se1)) bad('Select readOnly with no value disables options:', se1);
    const se0 = renderToString(e(A.Select, { label: 'T', value: 'company', options: opts, onChange: () => {} }));
    if (/readonly|disabled=""|-ro"/i.test(se0) || !/aura-select__chevron/.test(se0)) bad('Select default changed:', se0);
  }
  /* 5.18 (Chamber-OS 112): an error step keeps its state and says so; steps without status are unchanged. */
  {
    const e = React.createElement;
    const steps = [
      { id: 'basics', label: 'Basics' },
      { id: 'fees', label: 'Fees', status: 'error' as const },
      { id: 'benefits', label: 'Benefits' },
      { id: 'review', label: 'Review' },
    ];
    const s = renderToString(e(A.Stepper, { current: 'review', steps, onStepClick: () => {} }));
    const fees = s.split('<li class').find((li) => li.includes('Fees')) || '';
    const basics = s.split('<li class').find((li) => li.includes('Basics')) || '';
    if (!/^="aura-stepper__item is-done is-error"/.test(fees) || !/<button type="button" class="aura-stepper__step aura-focusable" aria-label="Fees, has errors">/.test(fees) || !/<span class="aura-stepper__label">Fees<span class="aura-sr-only">, has errors<\/span><\/span>/.test(fees) || /completed/.test(fees) || /aura-stepper__marker[^>]*>2</.test(fees)) { console.log(label, 'Stepper error step:', fees); fail++; }
    if (!/^="aura-stepper__item is-done"/.test(basics) || !/aria-label="Basics, completed"/.test(basics) || !/<span class="aura-stepper__label">Basics<span class="aura-sr-only">, completed<\/span><\/span>/.test(basics)) { console.log(label, 'Stepper done step changed:', basics); fail++; }
    if (/— has errors/.test(s)) { console.log(label, 'Stepper compact says errors for a clean current step:', s); fail++; }
    /* The current step with errors: still aria-current, not a button, and the phone line says so; in Thai too. */
    /* A description is the button's description; a label that isn't text keeps the content name (no aria-label). */
    const d = renderToString(e(A.Stepper, { current: 'b', onStepClick: () => {}, steps: [{ id: 'a', label: 'Basics', description: 'Name and period' }, { id: 'b', label: 'Fees' }] }));
    const dm = /aria-label="Basics, completed" aria-describedby="([^"]+)"/.exec(d);
    if (!dm || !new RegExp('<span class="aura-stepper__desc" id="' + dm[1] + '">Name and period</span>').test(d)) { console.log(label, 'Stepper description:', d); fail++; }
    const el = renderToString(e(A.Stepper, { current: 'b', onStepClick: () => {}, steps: [{ id: 'a', label: e('em', null, 'Basics'), status: 'error' }, { id: 'b', label: 'Fees' }] }));
    if (/aria-label|aria-describedby/.test(el) || !/<em>Basics<\/em><span class="aura-sr-only">, has errors<\/span>/.test(el)) { console.log(label, 'Stepper element label:', el); fail++; }
    const cur = renderToString(e(A.AuraProvider, { locale: 'th' }, e(A.Stepper, { current: 'fees', steps, onStepClick: () => {} })));
    const feesCur = cur.split('<li class').find((li) => li.includes('Fees')) || '';
    if (!/^="aura-stepper__item is-current is-error" aria-current="step"/.test(feesCur) || /<button/.test(feesCur) || !/>Fees<span class="aura-sr-only">, มีข้อผิดพลาด</.test(feesCur) || /aria-label/.test(feesCur) || !/ขั้นที่ 2 จาก 4<span class="aura-stepper__count-error"> — มีข้อผิดพลาด<\/span>/.test(cur)) { console.log(label, 'Stepper current error step:', cur); fail++; }
  }
  /* 5.17 (Chamber-OS 110, 111): exact markup of the new options; defaults unchanged. */
  {
    const m = renderToString;
    const e = React.createElement;
    const bad = (what: string, ...html: unknown[]) => { console.log(label, what, ...html); fail++; };
    const st = m(e(A.Stat, { label: 'Membership', value: 'Gold', href: '/m', headingLevel: 2, linkArea: 'label', status: 'Active · renews 1 Jan', 'data-testid': 'stat-card', 'data-variant': 'warning' }));
    if (!/^<div data-testid="stat-card" data-variant="warning" class="aura-stat is-interactive aura-stat--label-link"><div class="aura-stat__head"><h2 class="aura-stat__label"><a href="\/m" class="aura-stat__link">Membership<\/a><\/h2>/.test(st) || !/<span class="aura-stat__status">Active · renews 1 Jan<\/span>/.test(st) || (st.match(/<a /g) || []).length !== 1) bad('Stat 5.17:', st);
    /* Review: onClick with the label link nests nothing; only documented attributes reach the root; what names the link goes to the link. */
    const stc = m(e(A.Stat, { label: 'M', value: 1, href: '/m', linkArea: 'label', headingLevel: 2, onClick: () => {}, 'aria-label': 'Membership details', tone: 'danger', title: 't' } as Record<string, unknown>));
    if (!/^<div class="aura-stat is-interactive aura-stat--label-link"><div class="aura-stat__head"><h2 class="aura-stat__label"><a aria-label="Membership details" href="\/m" class="aura-stat__link">M<\/a><\/h2>/.test(stc) || /<button|tone=|title=/.test(stc)) bad('Stat label link with onClick / leakage:', stc);
    const st0 = m(e(A.Stat, { label: 'Invoices', value: 3, href: '/i' }));
    if (!/^<a class="aura-stat is-interactive" href="\/i">/.test(st0) || /status|label-link/.test(st0)) bad('default Stat changed:', st0);
    if (!/aria-hidden="true"/.test(m(e(A.Stat, { label: 'E', loading: true, 'aria-hidden': true }))) || /aura-stat__status/.test(m(e(A.Stat, { label: 'E', loading: true, status: 'x' })))) bad('Stat aria-hidden / loading status');
    const pv = m(e(A.Progress, { label: 'E', value: 2, max: 6, secondaryValue: 1, showValue: true, valueLabel: '2 of 6 used', valueText: '2 used, 1 reserved, 3 remaining of 6' }));
    if (!/aria-valuetext="2 used, 1 reserved, 3 remaining of 6"/.test(pv) || !/aura-progress__value">2 of 6 used</.test(pv)) bad('Progress valueText:', pv);
  }
  /* 5.16 (Chamber-OS 95, 96, 98, 101, 105): exact markup of the new options; defaults unchanged. */
  {
    const m = renderToString;
    const e = React.createElement;
    const bad = (what: string, ...html: unknown[]) => { console.log(label, what, ...html); fail++; };
    const items = [{ id: 'a', label: 'Members' }, { id: 'g', label: 'Admin', children: [{ id: 'r', label: 'Roles' }] }, { id: 'out', label: 'Sign out', selectable: false, onSelect: () => {} }];
    const sn = m(e(A.SideNav, { value: 'out', items, chevron: 'right', collapsible: true, collapseToggle: 'row' }));
    if (!/class="aura-nav aura-nav--chevron-right"/.test(sn) || !/<button type="button" class="aura-nav__item aura-nav__item--action">(?:(?!aria-current).)*Sign out/.test(sn) || /aria-current/.test(sn) || !/<div class="aura-nav__toggle aura-nav__toggle--row"><button type="button" class="aura-nav__item aura-nav__item--action">.*Collapse sidebar<\/span><\/button><\/div>/.test(sn)) bad('SideNav 5.16:', sn);
    const sn0 = m(e(A.SideNav, { value: 'a', items: items.slice(0, 2), collapsible: true }));
    if (/chevron-right|--action|toggle--row/.test(sn0) || !/aria-current="page"/.test(sn0) || !/<div class="aura-nav__toggle"><button type="button"[^>]*class="aura-icon-btn"/.test(sn0)) bad('default SideNav changed:', sn0);
    const dt = m(e(A.Dialog, { trigger: e(A.Button, { variant: 'secondary' }, 'Add contact'), title: 'T', 'data-testid': 'd' }, 'x'));
    if (!/^<button aria-haspopup="dialog" aria-expanded="false" data-aura-trigger="[^"]+" type="button" class="aura-btn aura-btn--secondary">Add contact<\/button>$/.test(dt)) bad('Dialog trigger SSR:', dt);
    if (m(e(A.Dialog, { open: false, onClose: () => {}, title: 'T' }, 'x')) !== '') bad('closed Dialog renders');
    const cc = m(e(A.Combobox, { label: 'P', options: ['Bangkok'], allowCustomValue: true, defaultValue: 'Västra Götaland' }));
    const cc0 = m(e(A.Combobox, { label: 'P', options: ['Bangkok'], defaultValue: 'Västra Götaland' }));
    if (!/role="combobox"[^>]*value="Västra Götaland"/.test(cc) || /value="Västra Götaland"/.test(cc0.replace(/type="hidden"[^>]*/g, ''))) bad('Combobox custom value SSR:', cc, cc0);
  }
  /* 5.15 (Chamber-OS 85, 87, 89, 90, 92–94, 99, 100): exact markup of the new options; defaults unchanged. */
  {
    const m = renderToString;
    const e = React.createElement;
    const bad = (what: string, ...html: unknown[]) => { console.log(label, what, ...html); fail++; };
    /* 87, 93 */
    const pill = e(A.StatusPill, { tone: 'warning' }, 'Pending');
    const ch = m(e(A.Card, { header: pill, title: 'Ignored', titleId: 't1', flushBelow: 'lg' }, 'b'));
    if (!/^<section class="aura-card aura-card--flush-below-lg"><div class="aura-card__head"><div class="aura-card__heading"><span class="aura-pill/.test(ch) || /<h\d|Ignored|aria-labelledby/.test(ch)) bad('Card header/flushBelow:', ch);
    if (m(e(S.Card, { header: pill, flushBelow: 'lg' }, 'b')) !== m(e(A.Card, { header: pill, flushBelow: 'lg' }, 'b'))) bad('/server Card header differs');
    const c0 = m(e(A.Card, { title: 'T', titleId: 't1' }, 'b'));
    if (!/^<section class="aura-card" aria-labelledby="t1"><div class="aura-card__head"><div class="aura-card__heading"><h3 class="aura-card__title" id="t1">T<\/h3>/.test(c0)) bad('default Card changed:', c0);
    /* 89 */
    const pr = m(e(A.Progress, { label: 'E', value: 2, secondaryValue: 1, max: 6 }));
    if (!/aria-valuetext="2 of 6 used, 1 reserved"/.test(pr) || !/class="aura-progress__bar aura-progress__bar--reserved" style="left:33\.3+\d*%;width:16\.6+\d*%"/.test(pr)) bad('Progress reserved:', pr);
    const pr0 = m(e(A.Progress, { label: 'E', value: 2, max: 6 })), prZero = m(e(A.Progress, { label: 'E', value: 2, secondaryValue: 0, max: 6 }));
    if (/reserved|aria-valuetext/.test(pr0) || prZero !== pr0) bad('default Progress changed:', pr0, prZero);
    /* 90 */
    const tabs = [{ id: 'a', label: 'A', content: 'x' }, { id: 'b', label: 'B', content: 'y' }];
    const tl = (p: Record<string, unknown>) => (/class="(aura-tabs__list[^"]*)"/.exec(m(e(A.Tabs, Object.assign({ label: 'L', tabs }, p)))) || [])[1];
    const got = [tl({}), tl({ fullWidth: true }), tl({ fullWidth: 'below-lg' }), tl({ variant: 'segmented', fullWidth: true }), tl({ variant: 'segmented', fullWidth: 'below-md' })];
    const want = ['aura-tabs__list', 'aura-tabs__list is-fill', 'aura-tabs__list is-fill-below-lg', 'aura-tabs__list aura-segmented is-full', 'aura-tabs__list aura-segmented is-full-below-md'];
    if (JSON.stringify(got) !== JSON.stringify(want)) bad('Tabs fullWidth classes:', got);
    /* 92 */
    const fb = (p: Record<string, unknown>) => (/class="(aura-filterbar[^"]*)"/.exec(m(e(A.FilterBar, Object.assign({ search: '', onSearchChange: () => {} }, p), 'x'))) || [])[1];
    if (fb({ controlsLayout: 'fill', stackBelow: 'lg' }) !== 'aura-filterbar aura-filterbar--fill aura-filterbar--stack-lg' || fb({ controlsLayout: 'auto', stackBelow: 'md' }) !== 'aura-filterbar') bad('FilterBar classes');
    /* 94 */
    const items = [{ label: 'Admin', href: '/a', itemProps: { 'data-slot': 'item' } }, { label: 'Members', href: '/m' }, { label: 'Acme', linkProps: { 'data-slot': 'page' } }];
    const bc = m(e(A.Breadcrumb, { collapseBelow: 'sm', items }));
    if (!/<nav aria-label="Breadcrumb" class="aura-crumbs aura-crumbs--collapse-sm"><ol><li data-slot="item"><a href="\/a">Admin<\/a>.*?<\/li><li class="aura-crumbs__more"><button type="button" aria-label="Show the full path">…<\/button>.*?<\/li><li class="aura-crumbs__middle"><a href="\/m">Members/.test(bc) || !/<span data-slot="page" aria-current="page" class="aura-crumbs__current">Acme<\/span>/.test(bc)) bad('Breadcrumb collapse:', bc);
    const bc2 = m(e(A.Breadcrumb, { collapseBelow: 'sm', items: items.slice(1) })), bc0 = m(e(A.Breadcrumb, { items: [{ label: 'Admin', href: '/a' }, { label: 'Members', href: '/m' }, { label: 'Acme' }] }));
    if (/collapse|__more|__middle/.test(bc2) || /collapse|__more|__middle|class=""/.test(bc0) || !/<li><a href="\/a">Admin/.test(bc0)) bad('Breadcrumb defaults:', bc2, bc0);
    /* 99 */
    const cb = m(e(A.Checkbox, { label: 'Approve', hideLabel: true, hitArea: { x: 12, y: 8 } }));
    const cbT = m(e(A.Checkbox, { label: 'Approve', hideLabel: true, hitArea: 'target' }));
    const cbL = m(e(A.Checkbox, { hitArea: { x: 12, y: 8 } }, 'Approve')), cb0 = m(e(A.Checkbox, { label: 'Approve', hideLabel: true, hitArea: 'box' }));
    if (!/class="aura-check has-hit" style="--aura-check-hit-x:12px;--aura-check-hit-y:8px"/.test(cb) || !/--aura-check-hit-x:4px;--aura-check-hit-y:4px/.test(cbT) || /has-hit|--aura-check/.test(cbL + cb0)) bad('Checkbox hitArea:', cb, cbL);
    /* 100 */
    const bt = m(e(A.Button, { size: 'sm', touchHeight: true }, 'Pay')), bl = m(e(A.Button, { href: '/i', size: 'sm', touchHeight: true }, 'View'));
    const ib = m(e(A.IconButton, { icon: 'x', label: 'Close', touchHeight: true }));
    if (!/class="aura-btn aura-btn--primary aura-btn--sm aura-btn--touch"/.test(bt) || !/class="aura-btn aura-btn--primary aura-btn--sm aura-btn--touch"/.test(bl) || !/class="aura-icon-btn aura-icon-btn--touch"/.test(ib) || /touchheight/i.test(bt + bl + ib)) bad('touchHeight:', bt, bl, ib);
    if (S.buttonClass({ size: 'sm', touchHeight: true }) !== 'aura-btn aura-btn--primary aura-btn--sm aura-btn--touch') bad('buttonClass touchHeight');
    /* 85 */
    const head = e(A.THead, null, e(A.Tr, null, e(A.Th, null, 'Member')));
    const body = e(A.TBody, null, e(A.Tr, null, e(A.Td, null, 'Acme')));
    const tc = m(e(A.Table, { caption: 'Q', stackBelow: 'sm', stackStyle: 'cards' }, head, body));
    const tc0 = m(e(A.Table, { caption: 'Q', stackBelow: 'sm', stackStyle: 'list' }, head, body)), tcNo = m(e(A.Table, { caption: 'Q', stackStyle: 'cards' }, head, body));
    if (!/^<div class="aura-tbl-cards aura-tbl-cards--sm"><div class="aura-tbl-wrap is-stackable"><table class="aura-tbl aura-tbl--stack-sm aura-tbl--cards"/.test(tc) || /cards/.test(tc0 + tcNo)) bad('Table stackStyle:', tc, tc0, tcNo);
  }
  /* 5.14 (Chamber-OS 86, 88, 97, 102, 104, 107): exact markup of the new options; defaults unchanged. */
  {
    const m = renderToString;
    const e = React.createElement;
    const es = m(e(A.EmptyState, { title: 'No benefits', headingLevel: false }));
    if (!/<p class="aura-empty__title">No benefits<\/p>/.test(es) || /<h\d/.test(es)) { console.log(label, 'EmptyState headingLevel false:', es); fail++; }
    if (!/<h3 class="aura-empty__title">/.test(m(e(A.EmptyState, { title: 'x' })))) { console.log(label, 'EmptyState default heading changed'); fail++; }
    const st = m(e(A.Stat, { label: 'Membership', headingLevel: 2, value: 'Active' }));
    const st0 = m(e(A.Stat, { label: 'Membership', value: 'Active' }));
    const w: string[] = [], ow = console.warn;
    console.warn = (x: unknown) => w.push(String(x));
    const stBtn = m(e(A.Stat, { label: 'Membership', headingLevel: 2, value: 'Active', onClick: () => {} }));
    console.warn = ow;
    if (!/<h2 class="aura-stat__label">Membership<\/h2>/.test(st) || !/<span class="aura-stat__label">Membership<\/span>/.test(st0) || /<h2/.test(stBtn) || !w.some((x) => /headingLevel` is ignored with `onClick`/.test(x))) { console.log(label, 'Stat headingLevel:', st, stBtn, w); fail++; }
    const sh = m(e(A.AppShell, { header: 'H', contentPadding: false }, 'c')), sh0 = m(e(A.AppShell, { header: 'H' }, 'c'));
    if (!/class="aura-shell__content is-flush"/.test(sh) || /is-flush/.test(sh0)) { console.log(label, 'AppShell contentPadding:', sh); fail++; }
    if (!/class="aura-shell aura-shell--no-bar"/.test(m(e(A.AppShell, null, 'c'))) || /--no-bar|--menu-bar/.test(sh0)) { console.log(label, 'AppShell bar classes'); fail++; }
    const gated = m(e(A.Button, { 'aria-disabled': true }, 'Erase')), plainBtn = m(e(A.Button, null, 'Erase'));
    const busy = m(e(A.Button, { loading: true }, 'Erase'));
    if (!/aria-disabled="true"/.test(gated) || /disabled=""/.test(gated) || /aria-disabled/.test(plainBtn) || !/aria-disabled="true"/.test(busy)) { console.log(label, 'Button aria-disabled:', gated, busy); fail++; }
    const tabs = [{ id: 'a', label: 'Contacts', href: '#contacts' }, { id: 'b', label: 'Invoices', href: '#invoices' }];
    const loc = m(e(A.Tabs, { label: 'On this page', value: 'a', tabs, current: 'location' })), pg = m(e(A.Tabs, { label: 'On this page', value: 'a', tabs }));
    if (!/aria-current="location"/.test(loc) || !/aria-current="page"/.test(pg)) { console.log(label, 'Tabs current:', loc); fail++; }
  }
  /* 5.13 (Chamber-OS 80–82, 84): card options, static Table align/bordered/card slots, EmptyState tone. */
  {
    const rows = [{ co: 'Acme', no: 'M-1', flag: 'SE', plan: 'Gold' }];
    const dt = renderToString(React.createElement(A.DataTable, { label: 'M', rows, selectable: true, hideSelectionInCards: true, stackBelow: 640,
      columns: [{ key: 'co', label: 'CO' }, { key: 'flag', label: 'F', width: 60, card: 'hide' }, { key: 'plan', label: 'P', width: 80, cardOrder: 2 }, { key: 'no', label: 'NO', width: 80, cardOrder: 1 }] }));
    if (!/aura-table--cards-nosel/.test(dt) || (dt.match(/data-card="hide"/g) || []).length !== 2 || !/--aura-card-order:6[^>]*data-card="field" data-label="P"/.test(dt) || !/--aura-card-order:5[^>]*data-card="field" data-label="NO"/.test(dt)) { console.log(label, 'DataTable card options:', dt); fail++; }
    const dt0 = renderToString(React.createElement(A.DataTable, { label: 'M', rows, selectable: true, stackBelow: 640, columns: [{ key: 'co', label: 'CO' }, { key: 'plan', label: 'P', width: 80 }] }));
    if (/cards-nosel|--aura-card-order|data-card="hide"/.test(dt0)) { console.log(label, 'default DataTable changed:', dt0); fail++; }
    const cells = (card?: string) => [React.createElement(A.Td, { card: card, key: 'a' }, 'Acme'), React.createElement(A.Td, { key: 'b' }, 'x')];
    const head = React.createElement(A.THead, null, React.createElement(A.Tr, null, React.createElement(A.Th, null, 'Member'), React.createElement(A.Th, null, 'Type')));
    const tbl = (p: Record<string, unknown>, card?: string) => renderToString(React.createElement(A.Table, Object.assign({ caption: 'Q' }, p), head, React.createElement(A.TBody, null, React.createElement(A.Tr, null, cells(card)))));
    const slots = tbl({ stackBelow: 'sm', align: 'middle', bordered: false }, 'title');
    if (!/class="aura-tbl-wrap is-stackable is-flush"/.test(slots) || !/class="aura-tbl aura-tbl--stack-sm aura-tbl--middle"/.test(slots) || !/<td class="aura-tbl__td" role="cell" data-card="title">Acme/.test(slots) || !/data-label="Type">x/.test(slots)) { console.log(label, 'Table 5.13:', slots); fail++; }
    const plainTbl = tbl({}, 'title');
    if (/is-flush|--middle|data-card/.test(plainTbl)) { console.log(label, 'default Table changed:', plainTbl); fail++; }
    const empty = renderToString(React.createElement(A.EmptyState, { tone: 'danger', bordered: true, title: 'Failed', id: 'e1', 'data-testid': 'x', role: 'alert' }));
    const empty0 = renderToString(React.createElement(A.EmptyState, { title: 'None' }));
    if (!/^<div id="e1" data-testid="x" role="alert" class="aura-empty is-bordered is-danger">/.test(empty) || !/^<div class="aura-empty"><span class="aura-empty__icon"/.test(empty0)) { console.log(label, 'EmptyState 5.13:', empty, empty0); fail++; }
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
      /* 5.14 (Chamber-OS 86, 88, 103) */
      ['EmptyState', { title: 'No benefits', headingLevel: false }],
      ['Stat', { label: 'Membership', headingLevel: 2, value: 'Active', caption: 'Gold · renews Oct', change: { value: '+2', direction: 'up' } }],
      ['Stat', { label: 'E-Blasts', value: '4,200', unit: 'sent', loading: true }],
      ['Stat', { label: 'Invoices', value: 3, href: '/invoices', headingLevel: 3 }],
      /* 5.17 (Chamber-OS 110) */
      ['Stat', { label: 'Membership', value: 'Gold', href: '/m', headingLevel: 2, linkArea: 'label', status: 'Active', 'data-testid': 'stat-card', 'aria-describedby': 'x' }],
      ['Avatar', { name: 'Anna Berg', size: 'lg', status: 'online' }],
      ['Avatar', { name: 'Somchai', src: '/a.png' }],
    ];
    for (const [n, p] of cases) {
      const a = m(e(A[n], p)), b = m(e(S[n], p));
      if (a !== b) { console.log(label, n, '/server markup differs:\n  root  ', a, '\n  server', b); fail++; }
    }
    /* A heading label sits in a div row (not a span); a /server Stat drops a click handler passed at runtime. */
    const stH = m(e(S.Stat, { label: 'Membership', headingLevel: 2, value: 'Active' })), stS = m(e(S.Stat, { label: 'M', value: 1 }));
    const stClick = m(e(S.Stat, { label: 'M', value: 1, onClick: () => {} }));
    if (!/<div class="aura-stat__head"><h2 /.test(stH) || !/<span class="aura-stat__head"><span /.test(stS) || stClick !== stS) { console.log(label, 'Stat head/onClick:', stH, stClick); fail++; }
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
