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
