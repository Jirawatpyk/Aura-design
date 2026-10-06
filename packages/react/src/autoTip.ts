import * as React from 'react';

/* 5.32: one shared tooltip for the names AURA used to put in a native `title` — IconButton, Pagination's arrows, an
 * icon-only SegmentedControl option, a cut Tag. An element carries its text in `data-aura-tip`; one set of document
 * listeners shows one AURA-styled tip for it on hover (after 400ms, at once while a tip is already up) and on keyboard
 * focus, and hides it on Escape, a press, blur or leave. No state per button, so a DataTable with a ⋯ in every row
 * costs nothing. The tip only repeats the element's accessible name, so it is aria-hidden and never joins
 * aria-describedby (no double reading).
 *
 * The tip lets clicks and hovers through (pointer-events: none), so it never covers the next row's button; it still
 * stays while the pointer is over it (WCAG 1.4.13), by geometry. A tip opened by keyboard focus stays until focus
 * leaves, whatever the mouse does. */

const ATTR = 'data-aura-tip';
let installed = false;
let tip: HTMLDivElement | null = null;
let cur: HTMLElement | null = null;
let byFocus = false;
let hiding = false;
let timer: ReturnType<typeof setTimeout> | undefined;
let watch: MutationObserver | null = null;
let gone: MutationObserver | null = null;

function targetOf(e: Event): EventTarget | null {
  /* Inside a shadow root the event is retargeted to the host: use the real element. */
  const path = typeof e.composedPath === 'function' ? e.composedPath() : null;
  return path && path.length ? path[0]! : e.target;
}

function source(t: EventTarget | null): HTMLElement | null {
  if (!t || typeof (t as Element).closest !== 'function') return null;
  const el = t as Element;
  /* Wrapped in an Aura.Tooltip: that one speaks. */
  if (el.closest('.aura-tooltip-anchor')) return null;
  let s = el.closest('[' + ATTR + ']') as HTMLElement | null;
  /* A Tag's padding, icon, or the focused toggle Tag: its cut text is a child. */
  if (!s) {
    const tag = el.closest('.aura-tag');
    if (tag) s = tag.querySelector('.aura-tag__text[' + ATTR + ']');
  }
  if (!s || !s.getAttribute(ATTR) || !s.isConnected) return null;
  /* A menu trigger whose menu is open. */
  if (s.getAttribute('aria-expanded') === 'true') return null;
  return s;
}

function place(): void {
  if (!tip || !cur) return;
  if (!cur.isConnected) {
    hide();
    return;
  }
  const r = cur.getBoundingClientRect(),
    t = tip.getBoundingClientRect(),
    vw = window.innerWidth,
    vh = window.innerHeight,
    gap = 8,
    m = 8;
  let top = r.top - t.height - gap;
  if (top < m && r.bottom + gap + t.height <= vh - m) top = r.bottom + gap;
  top = Math.max(m, Math.min(top, vh - t.height - m));
  const left = Math.max(m, Math.min(r.left + r.width / 2 - t.width / 2, vw - t.width - m));
  tip.style.top = top + 'px';
  tip.style.left = left + 'px';
}

/* The element, the tip and the gap between them. */
function inZone(x: number, y: number): boolean {
  if (!cur || !tip || !up()) return false;
  const a = cur.getBoundingClientRect(),
    b = tip.getBoundingClientRect();
  return (
    x >= Math.min(a.left, b.left) - 1 &&
    x <= Math.max(a.right, b.right) + 1 &&
    y >= Math.min(a.top, b.top) - 1 &&
    y <= Math.max(a.bottom, b.bottom) + 1
  );
}

function stop(): void {
  clearTimeout(timer);
  hiding = false;
}

function show(s: HTMLElement, focus: boolean): void {
  stop();
  if (!tip) {
    tip = document.createElement('div');
    tip.className = 'aura-tooltip aura-tooltip--auto';
    tip.setAttribute('aria-hidden', 'true');
  }
  cur = s;
  byFocus = focus;
  tip.textContent = s.getAttribute(ATTR);
  /* Thai and RTL rules follow the element's language. */
  const lang = s.closest('[lang]'),
    dir = s.closest('[dir]');
  tip.lang = lang ? lang.getAttribute('lang') || '' : '';
  tip.dir = dir ? dir.getAttribute('dir') || '' : '';
  tip.style.top = tip.style.left = '-9999px';
  if (!tip.isConnected) document.body.appendChild(tip);
  place();
  if (typeof MutationObserver === 'undefined') return;
  /* A label that changes while shown ("Copy" → "Copied") updates the tip; an opened menu hides it. */
  if (watch) watch.disconnect();
  watch = new MutationObserver(function () {
    if (!cur || !tip) return;
    const text = cur.getAttribute(ATTR);
    if (!text || cur.getAttribute('aria-expanded') === 'true') hide();
    else {
      tip.textContent = text;
      place();
    }
  });
  watch.observe(s, { attributes: true, attributeFilter: [ATTR, 'aria-expanded'] });
  /* The element leaves the page (a deleted row, a route change): so does the tip. */
  if (!gone) {
    gone = new MutationObserver(function () {
      if (cur && !cur.isConnected) hide();
    });
    gone.observe(document.body, { childList: true, subtree: true });
  }
}

function hide(): void {
  stop();
  if (watch) watch.disconnect();
  if (gone) gone.disconnect();
  watch = gone = null;
  cur = null;
  byFocus = false;
  if (tip && tip.isConnected) tip.remove();
}

function hideSoon(): void {
  if (hiding) return;
  clearTimeout(timer);
  hiding = true;
  timer = setTimeout(hide, 120);
}

function up(): boolean {
  return !!(tip && tip.isConnected);
}

function focusVisible(el: Element): boolean {
  try {
    return el.matches(':focus-visible');
  } catch (e) {
    return true;
  }
}

/** Installs the shared listeners once per page (client only), even with two copies of AURA loaded. */
export function installAutoTip(): void {
  if (installed || typeof document === 'undefined') return;
  installed = true;
  const w = window as unknown as Record<string, unknown>;
  if (w.__auraAutoTip) return;
  w.__auraAutoTip = true;
  document.addEventListener('pointerover', function (e) {
    if (e.pointerType === 'touch') return;
    const s = source(targetOf(e));
    if (s) {
      if (s === cur && up()) {
        stop();
        return;
      }
      stop();
      if (up()) show(s, false);
      else
        timer = setTimeout(function () {
          if (source(s) === s) show(s, false);
        }, 400);
      return;
    }
    /* Off any tip source: a pending show is dropped; a hover tip goes once the pointer leaves it and its element. */
    if (!cur) stop();
    else if (!byFocus && !inZone(e.clientX, e.clientY)) hideSoon();
  });
  document.addEventListener('pointermove', function (e) {
    if (!cur || byFocus || e.pointerType === 'touch') return;
    if (inZone(e.clientX, e.clientY)) stop();
    else hideSoon();
  });
  document.addEventListener('pointerout', function (e) {
    if (!cur) {
      /* Left the window before the tip showed. */
      if (!e.relatedTarget) stop();
      return;
    }
    if (byFocus) return;
    const to = e.relatedTarget as Node | null;
    if (to && (cur.contains(to) || inZone(e.clientX, e.clientY))) return;
    hideSoon();
  });
  document.addEventListener('focusin', function (e) {
    const t = targetOf(e),
      s = source(t);
    if (s && focusVisible(t as Element)) show(s, true);
    else if (cur) hide();
  });
  document.addEventListener('focusout', function (e) {
    const t = targetOf(e) as Node | null;
    if (cur && byFocus && t && (cur === t || cur.contains(t) || t.contains(cur))) hide();
  });
  document.addEventListener('pointerdown', hide);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && up()) hide();
  });
  window.addEventListener(
    'scroll',
    function () {
      if (up()) place();
    },
    true,
  );
  window.addEventListener('resize', function () {
    if (up()) place();
  });
}

/** Call in a component that renders `data-aura-tip`. */
export function useAutoTip(): void {
  React.useEffect(installAutoTip, []);
}
