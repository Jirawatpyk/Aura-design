/* WebKit check (5.35) — the scroll-away bars, tiles and sparklines in a real WebKit engine (Safari's), which Playwright's
 * own WebKit download can't reach from every network. Uses WebKitGTK's WebDriver from the OS packages; not in CI.
 *
 *   sudo apt-get install webkit2gtk-driver xvfb
 *   Xvfb :99 & DISPLAY=:99 WebKitWebDriver --port=4444 &
 *   npx http-server storybook-static -p 6006 -s &      (after `npx storybook build -o storybook-static`)
 *   node scripts/webkit-check.mjs
 *
 * WebKitGTK has no touch or coarse pointer, so the touch hit areas and rubber-banding are checked in Chromium and on a
 * device; this covers WebKit's scroll, focus and :has() / container-query behaviour. */
const WD = process.env.WEBKIT_DRIVER || 'http://127.0.0.1:4444';
const SB = process.env.STORYBOOK || 'http://localhost:6006';
const call = async (m, path, body) => {
  const r = await fetch(WD + path, { method: m, headers: { 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json();
  if (j.value && j.value.error) throw new Error(path + ': ' + j.value.error + ' ' + j.value.message);
  return j.value;
};
const binary = process.env.MINIBROWSER || '/usr/lib/x86_64-linux-gnu/webkit2gtk-4.1/MiniBrowser';
const s = await call('POST', '/session', { capabilities: { alwaysMatch: { 'webkitgtk:browserOptions': { binary, args: ['--automation'] } } } });
const S = (p) => '/session/' + s.sessionId + p;
const ex = (script, args = []) => call('POST', S('/execute/sync'), { script, args });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fails = [];
const check = (ok, what, got) => {
  console.log((ok ? 'ok   ' : 'FAIL ') + what + (ok ? '' : ' — got ' + JSON.stringify(got)));
  if (!ok) fails.push(what);
};
const go = async (id) => {
  await call('POST', S('/url'), { url: SB + '/iframe.html?viewMode=story&id=' + id });
  for (let i = 0; i < 50 && !(await ex('return !!document.querySelector("#storybook-root > *")')); i++) await sleep(200);
  await sleep(800);
};
const scrollSteps = async (from, to, step) => {
  for (let y = from; step > 0 ? y <= to : y >= to; y += step) {
    await ex('window.scrollTo(0, arguments[0])', [y]);
    await sleep(16);
  }
  await sleep(450);
};
const st = async () =>
  JSON.parse(
    await ex(`const bar = document.querySelector('.aura-shell__bar'), nav = document.querySelector('nav.aura-bottomnav');
      const th = document.querySelector('#storybook-root thead th');
      return JSON.stringify({ y: Math.round(scrollY), bar: bar.classList.contains('is-away'), token: document.querySelector('.aura-shell').style.getPropertyValue('--aura-shell-bar-height'),
        th: Math.round(th.getBoundingClientRect().top), nav: nav.classList.contains('is-away'), navShown: getComputedStyle(nav).display,
        off: getComputedStyle(document.documentElement).getPropertyValue('--aura-bottomnav-offset').trim() })`),
  );
const click = (text) => ex('[...document.querySelectorAll("button")].find((b) => b.textContent === arguments[0]).click()', [text]);
try {
  console.log('WebKit', s.capabilities.browserVersion);
  await call('POST', S('/window/rect'), { width: 390, height: 844 });

  /* 13–14: scroll away and back. */
  await go('aura-new-in-5-35-dxt-monitor-13-14--scroll-away');
  await scrollSteps(40, 900, 40);
  let x = await st();
  check(x.bar && x.nav && x.token === '0px' && x.th === 0 && x.off === '', 'scrolling down: both bars away, token 0, header pinned at 0, no offset', x);
  await scrollSteps(880, 820, -20);
  x = await st();
  check(!x.bar && !x.nav && x.token === '56px' && x.th === 56 && x.off !== '', 'scrolling up: both back, token 56, header under the bar', x);
  await scrollSteps(860, 1500, 40);
  await scrollSteps(1497, 1497, -1);
  x = await st();
  check(x.bar, 'a 3px jitter up does not bring the bar back', x);
  /* Shift+Tab from main into the away bar: WebKit scrolls after focusin; the page must end where it was. */
  await ex('document.getElementById("main").focus({ preventScroll: true })');
  const y0 = await ex('return scrollY');
  await call('POST', S('/actions'), {
    actions: [{ type: 'key', id: 'k', actions: [{ type: 'keyDown', value: '' }, { type: 'keyDown', value: '' }, { type: 'keyUp', value: '' }, { type: 'keyUp', value: '' }] }],
  });
  await sleep(600);
  x = await st();
  const focused = await ex('return document.activeElement.getAttribute("aria-label")');
  check(!x.bar && focused === 'Notifications' && Math.abs(x.y - y0) <= 1, 'Shift+Tab into the bar: shown, focused, page not moved', { ...x, y0, focused });
  /* Own bottom bar hides the tabs (:has); an idle bulk bar doesn't. */
  await ex('scrollTo(0, 0)');
  await sleep(300);
  await click('Toggle incident bar');
  await sleep(400);
  x = await st();
  const gap = await ex('const r = document.querySelector(".aura-actionbar[aria-label=Actions]").getBoundingClientRect(); return Math.round(innerHeight - r.bottom)');
  check(x.navShown === 'none' && x.off === '' && gap === 12, 'ActionBar hidesBottomNav: no tabs, bar 12px from the bottom', { ...x, gap });
  await click('Toggle incident bar');
  await sleep(300);
  x = await st();
  check(x.navShown !== 'none', 'idle bulk bar keeps the tabs', x);
  await click('Select one');
  await sleep(300);
  x = await st();
  check(x.navShown === 'none', 'bulk bar with a selection hides the tabs', x);

  /* 5.34 tiles at 390: container query, two-line clamp with tip, two columns, a tile in a flex row keeps its width. */
  await go('aura-new-in-5-34-status-tiles--overview');
  x = JSON.parse(
    await ex(`const t = document.querySelector('[data-testid=problem]');
      const v = t.querySelector('.aura-status-tile__value').getBoundingClientRect(), ti = t.querySelector('.aura-status-tile__title').getBoundingClientRect();
      const th = document.querySelector('[data-testid=grid-th] .aura-status-tile__title');
      return JSON.stringify({ under: v.top >= ti.bottom - 1, lines: Math.round(th.getBoundingClientRect().height / parseFloat(getComputedStyle(th).lineHeight)),
        tip: !!th.getAttribute('data-aura-tip'), cols: new Set([...document.querySelectorAll('[data-testid=grid] > li')].map((l) => Math.round(l.getBoundingClientRect().left))).size,
        row: Math.round(document.querySelector('[data-testid=row] .aura-status-tile').getBoundingClientRect().width) })`),
  );
  check(x.under && x.lines === 2 && x.tip && x.cols === 2 && x.row > 100, 'tiles: value under the title, 2-line clamp with tip, 2 columns, flex-row tile not collapsed', x);

  /* 5.36: no overflow-clip-margin in WebKit, so a ring in a table cell is drawn inside it, whole; align "end" cells. */
  await go('aura-new-in-5-36-dxt-monitor-15-16--cells');
  await call('POST', S('/window/rect'), { width: 1280, height: 900 });
  await sleep(300);
  await call('POST', S('/actions'), { actions: [{ type: 'key', id: 'k2', actions: [{ type: 'keyDown', value: '\uE008' }, { type: 'keyUp', value: '\uE008' }] }] });
  x = JSON.parse(
    await ex(`const out = {};
      for (const n of ['INC-1042', 'api.example.co.th']) {
        const a = [...document.querySelectorAll('[data-testid=incidents] a')].find((e) => e.textContent === n);
        a.focus();
        const s = getComputedStyle(a), td = a.closest('.aura-table__td').getBoundingClientRect(), r = a.getBoundingClientRect();
        out[n] = { fv: a.matches(':focus-visible'), style: s.outlineStyle, offset: s.outlineOffset, inside: r.left - parseFloat(s.outlineOffset) - parseFloat(s.outlineWidth) >= td.left - 0.5 };
      }
      const c = document.querySelector('[data-testid=incidents] .aura-table__td.is-end'), rg = document.createRange(); rg.selectNodeContents(c);
      out.endGap = Math.round(c.getBoundingClientRect().right - rg.getBoundingClientRect().right);
      return JSON.stringify(out)`),
  );
  check(
    x['INC-1042'].style === 'solid' && x['INC-1042'].inside && x['api.example.co.th'].style === 'solid' && x['api.example.co.th'].inside && x.endGap === 16,
    'table cells: rings drawn inside the cell (no clip margin in WebKit), AURA ring on a plain link, align end flush',
    x,
  );
  await call('POST', S('/window/rect'), { width: 390, height: 844 });

  /* 5.37: PageHeader actions span the row below md (two, then one, 12px apart); SegmentedControl touchHeight 44px. */
  await go('aura-new-in-5-37-dxt-monitor-17-18--header-actions');
  x = JSON.parse(
    /* WebKitGTK 2.52 won't make the window narrower than ~447px, where all three fit on one row; hold the header at
     * the width it has on a 390px phone (342px inside the page padding) so the check measures the wrap it means to. */
    await ex(`document.querySelector('[data-testid=md]').style.maxWidth = Math.min(innerWidth - 48, 342) + 'px';
      const h = document.querySelector('[data-testid=md]').getBoundingClientRect();
      const b = [...document.querySelectorAll('[data-testid=md] .aura-page-header__actions > *')].map((e) => e.getBoundingClientRect());
      return JSON.stringify({ row1: Math.round(b[0].top) === Math.round(b[1].top), gap: Math.round(b[1].left - b[0].right),
        ends: Math.round(b[1].right) === Math.round(h.right), third: Math.round(b[2].width) === Math.round(h.width), vgap: Math.round(b[2].top - b[0].bottom) })`),
  );
  check(x.row1 && x.gap === 12 && x.ends && x.third && x.vgap === 12, 'PageHeader actionsFullWidthBelow: two then one, 12px apart, to the edge', x);
  await go('aura-new-in-5-37-dxt-monitor-17-18--segmented-touch');
  x = await ex(`return ['type', 'start', 'icons', 'plain'].map((id) => Math.round(document.querySelector('[data-testid=' + id + '] [role=radio]').getBoundingClientRect().height))
    .concat(Math.round(document.querySelector('[data-testid=icons] [role=radio]').getBoundingClientRect().width))`);
  check(JSON.stringify(x) === '[44,44,44,38,44]', 'SegmentedControl touchHeight: 44px options at 390 (sm, icon square); plain 38', x);

  /* 5.38: touchHeight at 390 with a mouse — FilterBar search and FilterSelects, a Combobox and its two 44px buttons;
   * DataTable rowProps on a stacked card. */
  await go('aura-new-in-5-38-chamber-os-140-142--filter-bar-touch');
  x = await ex(`return [...document.querySelectorAll('[data-testid=touch] .aura-filterbar__search, [data-testid=touch] .aura-filterselect__face, [data-testid=plain] .aura-filterselect__face')].map((e) => Math.round(e.getBoundingClientRect().height))`);
  check(JSON.stringify(x) === '[44,44,44,36]', 'FilterBar touchHeight: search and FilterSelects 44px at 390, plain bar 36px', x);
  await go('aura-new-in-5-38-chamber-os-140-142--fields-touch');
  x = await ex(`const r = document.querySelector('[data-testid=combo]'), b = r.querySelector('.aura-input').getBoundingClientRect();
    const k = [...r.querySelectorAll('.aura-combo__clear, .aura-combo__toggle')].map((e) => e.getBoundingClientRect());
    return [Math.round(b.height), Math.round(k[0].width), Math.round(k[1].width), k[0].right <= k[1].left + 0.5, k[1].right <= b.right + 0.5]`);
  check(JSON.stringify(x) === '[44,44,44,true,true]', 'Combobox touchHeight: 44px box, clear and chevron 44px wide side by side', x);
  await go('aura-new-in-5-38-chamber-os-140-142--row-props');
  x = await ex(`const r = document.querySelector('[data-user-id="u_102"]'); return r && [r.id, r.getAttribute('role'), r.className]`);
  check(JSON.stringify(x) === '["user-u_102","row","aura-table__row"]', 'DataTable rowProps: data-* and id on a card, role and class kept', x);

  /* 5.39: Tabs touchHeight at 390 with a mouse — link, button and segmented tabs 44px; plain link tabs 36px (not 38). */
  await go('aura-new-in-5-39-chamber-os-143--tabs-touch');
  x = await ex(`return ['links', 'buttons', 'segmented', 'plain'].map((id) => Math.round(document.querySelector('[data-testid=' + id + '] .aura-tab').getBoundingClientRect().height))`);
  check(JSON.stringify(x) === '[44,44,44,36]', 'Tabs touchHeight: 44px link, button and segmented tabs at 390; plain link tab 36px', x);

  /* 5.41: data-aura-hide-menubutton hides the phone bar's menu button (:has in WebKit); titleHideBelow keeps the h1. */
  await go('aura-new-in-5-41-dxt-monitor-19-22--back-arrow-page');
  x = await ex(`const h = document.querySelector('[data-testid=header]');
    return [getComputedStyle(document.querySelector('.aura-shell__menu')).display, Math.round(h.querySelector('h1').getBoundingClientRect().width), getComputedStyle(h.querySelector('.aura-page-header__breadcrumb')).display]`);
  check(JSON.stringify(x) === '["none",1,"none"]', 'AppShell menu button hidden by the page mark; PageHeader title visually hidden, breadcrumb gone', x);

  /* 5.42: FilterBar collapseBelow — at a phone width the controls hide and "Filters (1)" shares the search's row;
   * the sheet holds the labelled fields (the bar's copy gone), Done closes it. */
  await go('aura-new-in-5-42-chamber-os-146--collapsed-filters');
  x = await ex(`const b = document.querySelector('[data-testid=members]'), s = b.querySelector('.aura-filterbar__search').getBoundingClientRect(), m = b.querySelector('.aura-filterbar__more'), r = m.getBoundingClientRect();
    return [getComputedStyle(b.querySelector('.aura-filterbar__controls')).display, getComputedStyle(b.querySelector('.aura-filterbar__lead')).display, Math.round(r.height), Math.round(r.top - s.top), m.querySelector('span[aria-hidden]').textContent]`);
  check(JSON.stringify(x) === '["none","flex",44,0,"Filters (1)"]', 'FilterBar collapseBelow: controls folded, Filters (1) beside the search, 44px', x);
  await ex(`document.querySelector('[data-testid=members] .aura-filterbar__more').click()`);
  await new Promise((r) => setTimeout(r, 400));
  x = await ex(`const d = document.querySelector('.aura-dialog'); return d ? [d.getAttribute('aria-labelledby') && document.getElementById(d.getAttribute('aria-labelledby')).textContent, [...d.querySelectorAll('.aura-field__label')].map((l) => l.textContent).join('|'), document.querySelectorAll('[data-testid=members] .aura-filterbar__controls').length, Math.round(d.querySelector('.aura-select').getBoundingClientRect().height)] : null`);
  check(JSON.stringify(x) === '["Filters","Status|Tier|Submitted",0,44]', 'FilterBar sheet: labelled 44px fields, rendered once', x);
  await click('Done');
  await new Promise((r) => setTimeout(r, 300));
  x = await ex(`return [document.querySelectorAll('.aura-dialog').length, document.activeElement.classList.contains('aura-filterbar__more')]`);
  check(JSON.stringify(x) === '[0,true]', 'FilterBar sheet: Done closes, focus back on the button', x);

  /* 5.48 (#153): the actionsBarBelow bar is an edge strip — full width, on the bottom edge, top border only. */
  await go('aura-new-in-5-48-chamber-os-153--two-actions-and-menu');
  x = await ex(`const a = document.querySelector('[data-testid=header] .aura-page-header__actions'), r = a.getBoundingClientRect(), s = getComputedStyle(a);
    return [Math.round(r.left), Math.round(r.right) === innerWidth, Math.round(innerHeight - r.bottom), s.borderTopWidth, s.borderLeftWidth, s.borderTopLeftRadius]`);
  check(JSON.stringify(x) === '[0,true,0,"1px","0px","0px"]', 'PageHeader actionsBarBelow: edge strip at the bottom', x);

  /* 5.48 (#154): on a short screen the header bar and the ActionBar leave the bottom edge. */
  await call('POST', S('/window/rect'), { width: 390, height: 400 });
  await go('aura-new-in-5-48-chamber-os-153--short-screen');
  x = await ex(`return [innerHeight <= 480, getComputedStyle(document.querySelector('[data-testid=header] .aura-page-header__actions')).position, getComputedStyle(document.querySelector('.aura-actionbar')).position]`);
  check(JSON.stringify(x) === '[true,"static","static"]', 'short screen: header actions and ActionBar in the flow', x);
  /* 5.49 (#155): the threshold is 30rem, which WebKit resolves against the default 16px: 480px here too. */
  x = await ex(`return [matchMedia('(max-height: 30rem)').matches, getComputedStyle(document.querySelector('.aura-shell__bar')).position]`);
  check(JSON.stringify(x) === '[true,"static"]', 'short screen: 30rem threshold, top bar in the flow', x);
  await call('POST', S('/window/rect'), { width: 390, height: 844 });

  /* 5.50 (#156): invalid (and a caller's own aria-invalid) draw the danger edge with no error line; a valid field none. */
  await go('aura-new-in-5-50-chamber-os-156--invalid-without-message');
  x = await ex(`const c = (t) => getComputedStyle(document.querySelector('[data-testid=' + t + '] .aura-input')).borderTopColor;
    return [c('brand') === c('error'), c('own-aria') === c('error'), c('valid') !== c('error'), !!document.querySelector('[data-testid=brand] .aura-field__error')]`);
  check(JSON.stringify(x) === '[true,true,true,false]', 'TextField invalid: danger edge, no message', x);

  /* 5.51 (#157–159): aria-sort from sortDirection, no horizontal scroll in a 959px box; StatusPill wrap stays inside a narrow box. */
  await call('POST', S('/window/rect'), { width: 1280, height: 900 });
  await go('aura-new-in-5-51-chamber-os-157-160--review-queue');
  x = await ex(`const sc = document.querySelector('[data-testid=box] .aura-table__scroll');
    return [[...document.querySelectorAll('[aria-sort]')].map((h) => h.getAttribute('aria-sort')).join(), innerWidth >= 1000, sc.scrollWidth <= sc.clientWidth]`);
  check(JSON.stringify(x) === '["descending",true,true]', 'DataTable sortDirection and row minimum (959px box)', x);
  await call('POST', S('/window/rect'), { width: 390, height: 844 });
  await go('aura-new-in-5-51-chamber-os-157-160--pill-wrap');
  x = await ex(`const p = document.querySelector('[data-testid=narrow] .aura-pill'); return [p.scrollWidth <= p.clientWidth, p.getBoundingClientRect().height > 30]`);
  check(JSON.stringify(x) === '[true,true]', 'StatusPill wrap: two lines inside a narrow box', x);
  /* 5.51 (#161): keyboard="tab" leaves the row controls tabbable (WebDriver can't press Tab reliably, so count them). */
  await go('aura-new-in-5-51-chamber-os-157-160--tab-keys');
  x = await ex(`const n = (t) => [...document.querySelector('[data-testid=' + t + '] [role=grid]').querySelectorAll('button, a[href], input, [tabindex]')].filter((e) => e.tabIndex >= 0 && e.getClientRects().length).length; return [n('tab'), n('grid')]`);
  check(JSON.stringify(x) === '[14,1]', 'DataTable keyboard="tab": 14 Tab stops vs 1 in the grid', x);
  /* 5.51 (#162): grow 3 makes the Actions column wider than the even table's at a desktop width. */
  await call('POST', S('/window/rect'), { width: 1440, height: 900 });
  await go('aura-new-in-5-51-chamber-os-157-160--grow-actions');
  x = await ex(`const w = (t) => [...document.querySelectorAll('[data-testid=' + t + '] [role=columnheader]')].pop().getBoundingClientRect().width; return [innerWidth >= 1200, w('grow') > w('even') + 100]`);
  check(JSON.stringify(x) === '[true,true]', 'DataTable grow: Actions takes three shares', x);
  /* 5.53 (#165): below 640px (the window is ~447px here) the sheet footer's buttons are ≥44px and fullWidth="below-sm" stretches. */
  await call('POST', S('/window/rect'), { width: 390, height: 844 });
  await go('aura-new-in-5-53-chamber-os-165--sheet-footer');
  x = await ex(`return [innerWidth < 640, [...document.querySelectorAll('.aura-dialog__foot > .aura-btn')].every((b) => b.getBoundingClientRect().height >= 44 && b.scrollWidth <= b.clientWidth + 1)]`);
  check(JSON.stringify(x) === '[true,true]', 'Dialog sheet footer: buttons ≥44px, nothing overflows', x);
  await go('aura-new-in-5-53-chamber-os-165--full-width-below');
  x = await ex(`const b = document.querySelector('[data-testid=narrow] > .aura-btn'); return [Math.round(b.getBoundingClientRect().width), b.getBoundingClientRect().height >= 44]`);
  check(JSON.stringify(x) === '[200,true]', 'Button fullWidth="below-sm": full width, ≥44px', x);

  /* 5.76 (#194): on a screen 30rem tall or less a Dialog scrolls as one box, the footer at the end. */
  await call('POST', S('/window/rect'), { width: 568, height: 320 });
  await go('aura-new-in-5-76-chamber-os-194--short-screen');
  await sleep(300);
  x = await ex(`const d = document.querySelector('.aura-dialog'), b = document.querySelector('.aura-dialog__body'); return [innerHeight <= 480, getComputedStyle(d).overflowY, getComputedStyle(b).overflowX, d.scrollHeight > d.clientHeight, b.scrollHeight <= b.clientHeight + 1]`);
  check(JSON.stringify(x) === '[true,"auto","auto",true,true]', 'Dialog on a short screen scrolls as one box', x);
  await call('POST', S('/window/rect'), { width: 390, height: 844 });

  /* 5.75 (visual audit set 1): a sortable header label on the line of a plain one; Blocked is a soft pill. */
  await go('aura-new-in-5-75-visual-audit-set-1--sortable-header');
  x = await ex(`const top = (s) => { const th = document.querySelector(s); const w = document.createTreeWalker(th, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) if (n.textContent.trim()) break; const r = document.createRange(); r.selectNodeContents(n); return r.getBoundingClientRect().top; }; return [Math.abs(top('[data-testid=sorted]') - top('[data-testid=plain]')) <= 0.5, getComputedStyle(document.querySelector('.aura-pill--blocked')).backgroundColor]`);
  check(JSON.stringify(x) === '[true,"rgb(254, 226, 226)"]', 'Sortable Th on the line; soft Blocked pill', x);

  /* 5.74 (#193): a PageHeader bar whose content is hidden goes, with its height. */
  await call('POST', S('/window/rect'), { width: 390, height: 844 });
  await go('aura-new-in-5-74-chamber-os-193--pay-bar-hides');
  await sleep(300);
  await ex(`document.querySelector('[data-testid=pay]').click()`);
  await sleep(300);
  x = await ex(`return [getComputedStyle(document.querySelector('.aura-page-header__bar')).display, document.documentElement.style.getPropertyValue('--aura-page-actions-height'), document.querySelector('[data-testid=header]').getAttribute('data-aura-bar')]`);
  check(JSON.stringify(x) === '["none","0px","empty"]', 'PageHeader empty bar goes', x);

  /* 5.73: a visibility: hidden tab's bar is skipped too, and a switch moves the height (no resize happens). */
  await call('POST', S('/window/rect'), { width: 390, height: 844 });
  await go('aura-new-in-5-73-chamber-os-192-follow-up--visibility-tabs');
  await sleep(300);
  await ex(`document.querySelector('[data-testid=show-b]').click()`);
  await sleep(300);
  x = await ex(`return document.documentElement.style.getPropertyValue('--aura-actionbar-height') === document.querySelector('[aria-label="Save tier B"]').offsetHeight + 'px'`);
  check(x === true, 'ActionBar visibility-hidden tab skipped, follows a switch', x);

  /* 5.72 (#192): an edge bar in a hidden tab doesn't set the page's clearance; the visible one does. */
  await call('POST', S('/window/rect'), { width: 390, height: 844 });
  await go('aura-new-in-5-72-chamber-os-192--bar-per-tab');
  await sleep(300);
  x = await ex(`return [document.documentElement.style.getPropertyValue('--aura-actionbar-height') === document.querySelector('[aria-label="Save tier A"]').offsetHeight + 'px', document.querySelector('[aria-label="Save tier B"]').offsetHeight]`);
  check(JSON.stringify(x) === '[true,0]', 'ActionBar hidden-tab bar skipped', x);

  /* 5.71 (#191): only actionsBar is the phone strip; the other actions stay in the header. */
  await call('POST', S('/window/rect'), { width: 390, height: 844 });
  await go('aura-new-in-5-71-chamber-os-191--pay-bar');
  await sleep(300);
  x = await ex(`const b = document.querySelector('.aura-page-header__bar'), r = b.getBoundingClientRect(); return [getComputedStyle(b).position, Math.round(r.left), Math.round(r.right) === innerWidth, !!document.querySelector('[data-testid=pay]').closest('.aura-page-header__bar'), !!document.querySelector('[data-testid=pdf]').closest('.aura-page-header__bar'), document.documentElement.scrollWidth <= document.documentElement.clientWidth]`);
  check(JSON.stringify(x) === '["fixed",0,true,true,false,true]', 'PageHeader actionsBar strip', x);

  /* 5.70 (#186–#190): cursor Pagination, a sortable Th, the Spinner and FileUpload's button. */
  await go('aura-new-in-5-70-chamber-os-186-190--cursor-pagination');
  x = await ex(`const n = document.querySelector('[data-testid=links] nav'); return [n.querySelectorAll('ol').length, n.querySelectorAll('[aria-disabled="true"]').length, n.querySelector('a[rel=next]').getAttribute('href')]`);
  check(JSON.stringify(x) === '[0,2,"#after=evt_50"]', 'cursor Pagination', x);
  await go('aura-new-in-5-70-chamber-os-186-190--sortable-th');
  await ex(`document.querySelector('[data-testid=member] button').click()`);
  await sleep(200);
  x = await ex(`return [document.querySelector('[data-testid=member]').getAttribute('aria-sort'), document.querySelector('table[aria-label="Pending review"] tbody td').textContent]`);
  check(JSON.stringify(x) === '["descending","Siam Steel"]', 'sortable Th', x);
  await go('aura-new-in-5-70-chamber-os-186-190--spinners');
  x = await ex(`const s = document.querySelector('[data-testid=inline] svg'); return [getComputedStyle(s).animationName, Math.round(parseFloat(getComputedStyle(s).width))]`);
  check(JSON.stringify(x) === '["aura-spin",16]', 'Spinner spins at 16px', x);
  await go('aura-new-in-5-70-chamber-os-186-190--upload-button');
  x = await ex(`const b = document.querySelector('[data-testid=logo] button'); return [b.className.includes('aura-btn'), document.querySelector('[data-testid=logo] input[type=file]').tabIndex]`);
  check(JSON.stringify(x) === '[true,-1]', 'FileUpload button variant', x);

  /* 5.69 (#185): ActionBar look="edge" at a phone width — the screen's width, on the bottom edge, top border only; the
   * page's end is padded past it. */
  await call('POST', S('/window/rect'), { width: 390, height: 844 });
  await go('aura-new-in-5-69-chamber-os-185--edge');
  await sleep(300);
  x = await ex(`const a = document.querySelector('form .aura-actionbar'), r = a.getBoundingClientRect(), s = getComputedStyle(a); return [Math.round(r.left), Math.round(r.right) === innerWidth, Math.round(innerHeight - r.bottom), s.position, s.borderTopWidth, s.borderLeftWidth, s.borderTopLeftRadius, parseFloat(getComputedStyle(document.querySelector('.aura-shell__content')).paddingBottom) >= r.height]`);
  check(JSON.stringify(x) === '[0,true,0,"fixed","1px","0px","0px",true]', 'ActionBar edge strip', x);

  /* 5.68 (#184): errorLive keeps an empty polite error line that takes no room; unticking the last box fills it. */
  await go('aura-new-in-5-68-chamber-os-184--error-live');
  x = await ex(`const f = (t) => document.querySelector('[data-testid=' + t + '] fieldset'); const p = f('live').querySelector('.aura-field__error'); const r = [p.getAttribute('aria-live'), p.textContent, f('live').getBoundingClientRect().height === f('plain').getBoundingClientRect().height]; f('live').querySelector('input').click(); return r`);
  await sleep(200);
  x = x.concat(await ex(`return [document.querySelector('[data-testid=live] .aura-field__error').textContent]`));
  check(JSON.stringify(x) === '["polite","",true,"Choose at least one membership category."]', 'errorLive: waiting empty line, then the message', x);

  /* 5.67 (#183): CheckboxGroup is a named group; ticking gives option order. */
  await go('aura-new-in-5-67-chamber-os-183--categories');
  await ex(`const g = document.querySelector('[data-testid=group]'); g.querySelectorAll('input')[1].click(); g.querySelectorAll('input')[0].click();`);
  await sleep(200);
  x = await ex(`return [document.querySelector('[data-testid=value]').textContent, document.querySelector('[data-testid=group] fieldset').getAttribute('aria-describedby') !== null]`);
  check(JSON.stringify(x) === '["[\\"corporate\\",\\"partnership\\"]",true]', 'CheckboxGroup option order, described', x);

  /* 5.66 (#181, #182): a checkable icon item keeps its icon with a trailing mark; Combobox invalid + describedby. */
  await go('aura-new-in-5-66-chamber-os-181-182--combobox-described');
  x = await ex(`const i = document.querySelector('[data-testid=described] input[role=combobox]'); return [i.getAttribute('aria-invalid'), / member-alert$/.test(i.getAttribute('aria-describedby'))]`);
  check(JSON.stringify(x) === '["true",true]', 'Combobox invalid and aria-describedby', x);

  /* 5.65 (#180): a pressed IconButton has the selected fill; an unpressed one is transparent. */
  await go('aura-new-in-5-65-chamber-os-180--toggles');
  x = await ex(`const s = (id) => getComputedStyle(document.querySelector('[data-testid=' + id + ']')); return [s('bold').backgroundColor !== s('plain').backgroundColor, s('bold').color !== s('plain').color, s('italic').backgroundColor === s('plain').backgroundColor]`);
  check(JSON.stringify(x) === '[true,true,true]', 'IconButton pressed looks on, unpressed as before', x);

  /* 5.64 (#179): Progress legend — two swatches in the bar's tone, hidden from AT; absent at 0. */
  await call('POST', S('/window/rect'), { width: 1280, height: 900 });
  await go('aura-new-in-5-64-chamber-os-179--quota-legend');
  x = await ex(`const lg = document.querySelector('[data-testid=accent] .aura-progress__legend'), bar = document.querySelector('[data-testid=accent] .aura-progress__bar'); return [lg.querySelectorAll('.aura-progress__swatch').length, lg.getAttribute('aria-hidden'), getComputedStyle(lg.querySelector('.aura-progress__swatch')).backgroundColor === getComputedStyle(bar).backgroundColor, !document.querySelector('[data-testid=none] .aura-progress__legend')]`);
  check(JSON.stringify(x) === '[2,"true",true,true]', 'Progress legend: two swatches, aria-hidden, bar tone, absent at 0', x);

  /* 5.63 (#178): a lazy chip still makes meta the chip row. */
  await call('POST', S('/window/rect'), { width: 1280, height: 900 });
  await go('aura-new-in-5-63-chamber-os-178--lazy-chip');
  await sleep(300);
  x = await ex(`const m = document.querySelector('[data-testid=lazy] .aura-page-header__meta'), k = [...m.children].map((c) => c.getBoundingClientRect()); return [m.classList.contains('aura-page-header__meta--rich'), k.length === 2 && Math.round(k[1].left - k[0].right)]`);
  check(JSON.stringify(x) === '[true,8]', 'PageHeader meta with a lazy chip is the row', x);

  /* 5.62 (#177): PageHeader meta chips sit 8px apart. */
  await call('POST', S('/window/rect'), { width: 1280, height: 900 });
  await go('aura-new-in-5-62-chamber-os-177--meta-chips');
  x = await ex(`const k = [...document.querySelector('[data-testid=chips] .aura-page-header__meta').children].map((c) => c.getBoundingClientRect()); return k.slice(1).map((r, i) => Math.round(r.left - k[i].right))`);
  check(JSON.stringify(x) === '[8,8]', 'PageHeader meta chips 8px apart', x);

  /* 5.61 (#176): a visually hidden child of full-width header actions keeps its 1px box; no sideways scroll at 390. */
  await call('POST', S('/window/rect'), { width: 390, height: 844 });
  await go('aura-new-in-5-61-chamber-os-176--hidden-description');
  x = await ex(`return [['desc', 'desc-tw', 'desc-inline'].every((id) => Math.round(document.querySelector('[data-testid=' + id + ']').getBoundingClientRect().width) <= 1), document.documentElement.scrollWidth <= document.documentElement.clientWidth]`);
  check(JSON.stringify(x) === '[true,true]', 'PageHeader full-width actions skip a visually hidden child', x);

  /* 5.60 (#174, #175): words wrap whole in a static Table; a wide sticky header sits above the first row. */
  await call('POST', S('/window/rect'), { width: 1024, height: 900 });
  await go('aura-new-in-5-60-chamber-os-174-175--plans-list');
  x = await ex(`const w = document.querySelector('[data-testid=box] .aura-tbl-wrap'); return [w.scrollWidth <= w.clientWidth, getComputedStyle(document.querySelector('[data-testid=name-0]')).overflowWrap]`);
  check(JSON.stringify(x) === '[true,"break-word"]', 'static Table at 703px fits, cells break-word', x);
  await go('aura-new-in-5-60-chamber-os-174-175--wide-sticky');
  await sleep(300);
  x = await ex(`const th = document.querySelector('[data-testid=wide] .aura-tbl__th').getBoundingClientRect(), row = document.querySelector('[data-testid=wide] .aura-tbl__body .aura-tbl__row').getBoundingClientRect(); return row.top - th.bottom >= -1`);
  check(x === true, 'wide stickyHeader Table: header above the first row', x);

  /* 5.60 (#173): with a mouse, an icon link truncates inside its parent with a 4px gap; a stretched link starts at its box. */
  await call('POST', S('/window/rect'), { width: 1280, height: 900 });
  await go('aura-new-in-5-60-chamber-os-173--layouts');
  x = await ex(`const box = document.querySelector('[data-testid=site]'), a = box.querySelector('a'), s = a.querySelector('span'), i = a.querySelector('svg');
    const c = document.querySelector('[data-testid=column] a'), r = document.createRange(); r.selectNodeContents(c);
    const d = document.querySelector('[data-testid=details]'), sm = d.querySelector('summary');
    return [s.scrollWidth > s.clientWidth, a.getBoundingClientRect().right <= box.getBoundingClientRect().right + 0.5, Math.round(i.getBoundingClientRect().left - s.getBoundingClientRect().right), Math.round(r.getBoundingClientRect().left - c.getBoundingClientRect().left), document.documentElement.scrollWidth <= document.documentElement.clientWidth, sm.getBoundingClientRect().width < d.getBoundingClientRect().width]`);
  check(JSON.stringify(x) === '[true,true,4,0,true,true]', 'linkClass layout with a mouse: truncates, 4px icon gap, label at the start, no sideways scroll', x);

  /* 5.59 (#172): linkClass touchHeight — a short text link is ≥44×44 at a phone width, still underlined. */
  await call('POST', S('/window/rect'), { width: 390, height: 844 });
  await go('aura-new-in-5-59-chamber-os-172--text-links');
  x = await ex(`const a = document.querySelector('[data-testid=short]'), r = a.getBoundingClientRect(); return [innerWidth < 640, r.width >= 44, r.height >= 44, getComputedStyle(a).textDecorationLine]`);
  check(JSON.stringify(x) === '[true,true,true,"underline"]', 'linkClass touchHeight ≥44×44 below 640px, underlined', x);
  x = await ex(`const k = (id) => { const e = document.querySelector('[data-testid=' + id + ']'), s = getComputedStyle(e), r = e.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), s.color, s.fontSize, s.backgroundColor, s.borderTopWidth, s.paddingLeft, s.textDecorationLine].join('|'); }; return [k('btn') === k('btn-a'), k('btn')]`);
  check(x[0] === true, 'linkClass on a <button> looks like the <a> (no button chrome)', x);

  /* 5.58 (#171): at a phone width a short touchHeight tab is ≥44px wide. */
  await call('POST', S('/window/rect'), { width: 390, height: 844 });
  await go('aura-new-in-5-58-chamber-os-171--short-tab');
  x = await ex(`const t = [...document.querySelectorAll('[data-testid=touch] .aura-tab')].find((e) => e.textContent === 'Tax').getBoundingClientRect(); return [innerWidth < 640, t.width >= 44, t.height >= 44]`);
  check(JSON.stringify(x) === '[true,true,true]', 'short touchHeight tab ≥44×44 below 640px', x);

  /* 5.57 (#170): a titled Alert is labelled by its title element. */
  await go('aura-new-in-5-57-chamber-os-170--named-alerts');
  x = await ex(`const a = [...document.querySelectorAll('.aura-alert[aria-labelledby]')]; return [a.length, a.every((n) => document.getElementById(n.getAttribute('aria-labelledby')) === n.querySelector('.aura-alert__title'))]`);
  check(JSON.stringify(x) === '[3,true]', 'titled Alerts labelled by their title', x);

  /* 5.57 (#169): a Drawer / Dialog whose only body control is in a closed <details> opens with focus inside (on the
   * summary or the panel), and Escape closes it back to the trigger. */
  await call('POST', S('/window/rect'), { width: 1280, height: 900 });
  for (const kind of ['drawer', 'dialog']) {
    await go('aura-new-in-5-57-chamber-os-169--' + kind + '-closed-details');
    /* focus first: Safari doesn't focus a button on click, so a keyboard user's path (focused trigger) is the test */
    await ex(`const t = document.querySelector('[data-testid=trigger]'); t.focus(); t.click()`);
    await sleep(400);
    x = await ex(`const a = document.activeElement; return [!!a.closest('[role=dialog]'), a.getAttribute('data-testid') !== 'copy']`);
    await call('POST', S('/actions'), { actions: [{ type: 'key', id: 'esc' + kind, actions: [{ type: 'keyDown', value: '\uE00C' }, { type: 'keyUp', value: '\uE00C' }] }] });
    await sleep(400);
    x = x.concat(await ex(`return [!document.querySelector('[role=dialog]'), document.activeElement.getAttribute('data-testid') === 'trigger']`));
    check(JSON.stringify(x) === '[true,true,true,true]', kind + ' with a closed <details>: focus inside, Escape closes to the trigger', x);
  }

  /* 5.56 (#168): AppShell's menu button is 44×44 at a phone width, in compact density. */
  await call('POST', S('/window/rect'), { width: 390, height: 844 });
  await go('aura-new-in-5-56-chamber-os-168--menu-button');
  x = await ex(`const r = document.querySelector('.aura-shell__menu').getBoundingClientRect(); return [innerWidth < 640, Math.round(r.width), Math.round(r.height)]`);
  check(JSON.stringify(x) === '[true,44,44]', 'AppShell menu button 44×44 below 640px', x);

  /* 5.54 (#166): below 640px the Buttons in an ActionBar are ≥44px with no touchHeight. */
  await call('POST', S('/window/rect'), { width: 390, height: 844 });
  await go('aura-new-in-5-54-chamber-os-166--bar-buttons');
  x = await ex(`return [innerWidth < 640, [...document.querySelectorAll('[data-testid=wizard] .aura-actionbar .aura-btn')].every((b) => b.getBoundingClientRect().height >= 44)]`);
  check(JSON.stringify(x) === '[true,true]', 'ActionBar buttons ≥44px below 640px', x);

  /* 5.52 (#164): a loading Table and the server TableSkeleton line up with the loaded table at a desktop width. */
  await call('POST', S('/window/rect'), { width: 1280, height: 900 });
  await go('aura-new-in-5-52-chamber-os-164--loading-table');
  x = await ex(`const L = (t) => [...document.querySelector('[data-testid=' + t + '] .aura-tbl__body .aura-tbl__row').children].map((c) => Math.round(c.getBoundingClientRect().left));
    const a = L('loaded'), b = L('loading'), c = L('server'); return [innerWidth >= 1200, a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= 2 && Math.abs(v - c[i]) <= 2), document.querySelector('[data-testid=loading] .aura-tbl-wrap').getAttribute('aria-hidden')]`);
  check(JSON.stringify(x) === '[true,true,"true"]', 'Table loading / TableSkeleton: columns line up, aria-hidden', x);
  await call('POST', S('/window/rect'), { width: 390, height: 844 });
  await go('aura-new-in-5-51-chamber-os-157-160--grow-actions');
  /* 5.51 (#163): only the sideways axis is contained. */
  x = await ex(`const s = getComputedStyle(document.querySelector('.aura-table__scroll')); return [s.overscrollBehaviorX || 'n/a', s.overscrollBehaviorY || 'n/a']`);
  check(JSON.stringify(x) === '["contain","auto"]' || JSON.stringify(x) === '["n/a","n/a"]', 'DataTable scroller: overscroll contained sideways only', x);
  await call('POST', S('/window/rect'), { width: 390, height: 844 });

  /* 5.47 (#152): compact 26px and hero 30px at a phone width, Thai keeps 1.4. */
  await go('aura-new-in-5-47-chamber-os-152--title-sizes');
  x = await ex(`const f = (id) => { const s = getComputedStyle(document.querySelector('[data-testid=' + id + '] .aura-page-header__title')); return [parseFloat(s.fontSize), Math.round(parseFloat(s.lineHeight) / parseFloat(s.fontSize) * 100) / 100]; };
    return [f('compact-en'), f('compact-th'), f('hero')]`);
  check(JSON.stringify(x) === '[[26,1.2],[26,1.4],[30,1.2]]', 'PageHeader compact and hero sizes at a phone width', x);

  /* 5.46 (#151): PageHeader subtitle and title addon on one line, chip eyebrow row, focusTitleOnMount. */
  await go('aura-new-in-5-46-chamber-os-151--subtitle-and-addon');
  x = await ex(`const p = document.querySelector('[data-testid=en]'), t = p.querySelector('.aura-page-header__title').getBoundingClientRect(), a = p.querySelector('.aura-page-header__title-addon').getBoundingClientRect(), s = p.querySelector('.aura-page-header__subtitle');
    return [a.left > t.right, Math.abs((a.top + a.bottom) / 2 - (t.top + t.bottom) / 2) <= 2, parseFloat(getComputedStyle(s).fontSize), s.getBoundingClientRect().top >= t.bottom - 1]`);
  check(JSON.stringify(x) === '[true,true,14,true]', 'PageHeader titleAddon beside the title, 14px subtitle under it', x);
  await go('aura-new-in-5-46-chamber-os-151--renewal-success');
  await new Promise((r) => setTimeout(r, 200));
  x = await ex(`return [document.activeElement.className, getComputedStyle(document.activeElement).outlineStyle]`);
  check(JSON.stringify(x) === '["aura-page-header__title","none"]', 'PageHeader focusTitleOnMount: the heading focused, no ring', x);

  /* 5.45 (#150): PageHeader actionsBarBelow — a fixed bar at a phone width, status above, ⋯ centred on the row; the
   * page's end scrolls clear of it. */
  await go('aura-new-in-5-45-chamber-os-150--invoice-en');
  await new Promise((r) => setTimeout(r, 300));
  x = await ex(`window.scrollTo(0, document.documentElement.scrollHeight);
    const a = document.querySelector('[data-testid=header] .aura-page-header__actions'), b = [...a.querySelectorAll('button')].map((e) => e.getBoundingClientRect());
    const s = a.querySelector('.aura-page-header__status').getBoundingClientRect(), last = document.querySelector('[data-testid=last]').getBoundingClientRect();
    return [getComputedStyle(a).position, s.bottom <= b[0].top, Math.abs((b[2].top + b[2].height / 2) - (b[0].top + b[0].height / 2)) <= 1, last.bottom <= a.getBoundingClientRect().top]`);
  check(JSON.stringify(x) === '["fixed",true,true,true]', 'PageHeader actionsBarBelow: fixed bar, status above, ⋯ centred, page end clear', x);

  /* 5.44 (#149): two outlined actions and a ⋯ share one row at a phone width (:has in WebKit), labels wrapping. */
  await go('aura-new-in-5-44-chamber-os-149--invoice-actions');
  x = await ex(`return ['en', 'sv'].map((id) => { const t = [...document.querySelectorAll('[data-testid=' + id + '] .aura-page-header__actions button')].map((b) => { const r = b.getBoundingClientRect(); return Math.round(r.top + r.height / 2); }); return Math.max(...t) - Math.min(...t) <= 1; })`);
  check(JSON.stringify(x) === '[true,true]', 'PageHeader actionsFullWidthBelow: actions and the ⋯ on one row (en, sv)', x);

  /* 5.43 (#148): a collapsing bar with no search — the Filters button fills its row at a phone width. */
  await go('aura-new-in-5-43-chamber-os-148--no-search');
  x = await ex(`const w = (t, s) => Math.round(document.querySelector('[data-testid=' + t + '] ' + s).getBoundingClientRect().width);
    return [w('timeline', '.aura-filterbar__more') === w('timeline', '.aura-filterbar'), w('with-search', '.aura-filterbar__more') < 160]`);
  check(JSON.stringify(x) === '[true,true]', 'FilterBar collapseBelow without a search: the button fills the row; beside a search it does not', x);

  /* 5.42 (#147): with the root font doubled (as a 32px default does) a TextField in a grid cell
   * keeps to the page; with 5.41's sizing put back it doesn't (the control). */
  for (const id of ['aura-new-in-5-31-addendum-41--label-addon']) {
    await go(id);
    x = await ex(`const s = document.createElement('style'); s.textContent = 'html { font-size: 200% }'; document.head.appendChild(s);
      const now = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      const r = document.createElement('style'); r.textContent = '.aura-input__control { width: auto !important } .aura-input { min-width: auto !important }'; document.head.appendChild(r);
      const old = document.documentElement.scrollWidth - document.documentElement.clientWidth; r.remove(); s.remove(); return [now, old]`);
    check(x[0] <= 0 && x[1] > 0, 'fields at a doubled root font stay on the page (' + id + ')', x);
  }

  /* Sparkline geometry. */
  await go('aura-new-in-5-34-status-tiles--sparklines');
  x = await ex(`const g = document.querySelector('[data-testid=gaps]'), r = g.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height), g.querySelector('path').getAttribute('d').split('M').length - 1]`);
  check(x[0] === 80 && x[1] === 24 && x[2] === 3, 'sparkline 80×24, three runs', x);
} finally {
  await call('DELETE', S(''));
}
if (fails.length) {
  console.log(fails.length + ' failed');
  process.exit(1);
}
console.log('WebKit check OK');
