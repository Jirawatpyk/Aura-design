import * as React from 'react';

export { cx, omit, tone, devWarnOnce, isDev, touchClass } from './classes.js';

/* Controlled-or-not state: use the prop when given, else keep it here.
 * 5.1.1: the setter is stable and always calls the latest onChange, so effects that keep it (outside-click handlers)
 * don't call a stale callback. */
export function useMaybeControlled<T>(
  value: T | undefined,
  initial: T,
  onChange?: ((next: T) => void) | null,
): [T, (next: T) => void] {
  const s = React.useState<T>(initial);
  /* Controlled → undefined (a form reset() with no defaultValues): start again from the default, uncontrolled, so the
   * box shows the default and later clicks still work (a Popover that was forced open, then released). Only the
   * defined-ness is tracked, so a new array each render can't loop. */
  const wasSet = React.useState(value !== undefined);
  if (value !== undefined && !wasSet[0]) wasSet[1](true);
  else if (value === undefined && wasSet[0]) {
    wasSet[1](false);
    s[1](initial);
  }
  const controlled = value !== undefined;
  const latest = React.useRef({ controlled: controlled, onChange: onChange, set: s[1] });
  latest.current = { controlled: controlled, onChange: onChange, set: s[1] };
  const set = React.useCallback(function (next: T) {
    const l = latest.current;
    if (!l.controlled) l.set(next);
    if (l.onChange) l.onChange(next);
  }, []);
  return [controlled ? (value as T) : s[0], set];
}

export const collator =
  typeof Intl !== 'undefined' ? new Intl.Collator(['th', 'en'], { numeric: true, sensitivity: 'base' }) : null;
export function compare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return collator ? collator.compare(String(a), String(b)) : String(a).localeCompare(String(b));
}

export const uid: () => string =
  React.useId ||
  function () {
    const r = React.useRef<string | null>(null);
    if (!r.current) r.current = 'aura-' + Math.random().toString(36).slice(2, 9);
    return r.current;
  };
export const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/* 5.57 (Chamber-OS 169): inside a closed <details> only its own <summary> is shown. Chromium still gives the hidden
 * controls a client rect and tabIndex 0, but focus() on them does nothing, so a focus trap or a dialog's first-focus
 * pick has to skip them by hand. */
export function inClosedDetails(el: Element): boolean {
  for (let p = el.parentElement; p; p = p.parentElement) {
    if (p.tagName !== 'DETAILS' || (p as HTMLDetailsElement).open) continue;
    let s: Element | null = null;
    for (let c = p.firstElementChild; c; c = c.nextElementSibling)
      if (c.tagName === 'SUMMARY') {
        s = c;
        break;
      }
    if (!s || !(s === el || s.contains(el))) return true;
  }
  return false;
}

/* 5.57: Tab stops for focus traps and first focus — FOCUSABLE plus a <details>'s own <summary>. */
export const TAB_STOPS = FOCUSABLE + ',details > summary';
/* Reachable by Tab: not tabindex=-1, laid out (unless the page has no layout at all — jsdom — and the caller allows
 * it), not inside a closed <details>. */
export function isTabStop(c: HTMLElement, layoutless?: boolean): boolean {
  return c.tabIndex >= 0 && (layoutless || c.getClientRects().length > 0) && !inClosedDetails(c);
}
/* 5.57 (Chamber-OS 169): focus the first candidate that takes focus. A control can pass every check and still refuse
 * focus() (a browser hiding it in a way the checks miss), so only stop once focus is inside the container — on the
 * candidate or wherever its focus handler forwarded it. Candidates are tried lazily, in order. Returns whether focus
 * landed; the caller then focuses the container itself. A candidate whose focus handler sends focus out of the container
 * counts as not landed, and the next one is tried. */
export function focusFirst(
  container: HTMLElement,
  auto: HTMLElement | null,
  lists: ArrayLike<HTMLElement>[],
  layoutless?: boolean,
): boolean {
  const took = function (c: HTMLElement) {
    c.focus();
    const a = document.activeElement;
    return !!a && a !== container && container.contains(a);
  };
  if (auto && took(auto)) return true;
  for (let l = 0; l < lists.length; l++)
    for (let i = 0; i < lists[l].length; i++) if (isTabStop(lists[l][i], layoutless) && took(lists[l][i])) return true;
  return false;
}

/* True after the first client render: portals wait for it so server rendering (Next.js) never touches document. */
/* false on the server and while hydrating, true for components mounted fresh on the client (a menu opened on click),
 * so they render their portal in the first pass. React's useSyncExternalStore picks the right snapshot. */
function noopSubscribe() {
  return function () {};
}
function yes() {
  return true;
}
function no() {
  return false;
}
export function useMounted() {
  return React.useSyncExternalStore(noopSubscribe, yes, no);
}

/* useLayoutEffect in the browser, useEffect on the server (no SSR warning). */
export const useIsoLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/* Keep Tab inside a popover (date picker dialogs): wraps from last to first and back. */
export function trapTab(e: React.KeyboardEvent | KeyboardEvent, container: HTMLElement | null): void {
  if (e.key !== 'Tab' || !container) return;
  const list = Array.prototype.filter.call(
    container.querySelectorAll<HTMLElement>(TAB_STOPS),
    function (el: HTMLElement) {
      return el.tabIndex >= 0 && el.offsetParent !== null && !inClosedDetails(el);
    },
  );
  if (!list.length) return;
  const first = list[0],
    last = list[list.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

/* One ref callback that feeds several refs (the consumer's forwarded ref and our own). */
export function useMergedRef<T>(a: React.Ref<T> | undefined, b: React.Ref<T> | undefined): (node: T | null) => void {
  return React.useCallback(
    function (node: T | null) {
      [a, b].forEach(function (r) {
        if (!r) return;
        if (typeof r === 'function') r(node);
        else (r as React.MutableRefObject<T | null>).current = node;
      });
    },
    [a, b],
  );
}

/* A plain left click: not Ctrl/⌘/Shift/Alt (open in a new tab or window) and not already handled (5.1.1). */
export function plainClick(e: React.MouseEvent): boolean {
  return !e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

/* 5.42 (Chamber-OS 146): true inside FilterBar's phone "Filters" sheet, where FilterSelect and FilterDateRange show
 * their name as a visible label above a full-width field instead of the compact face. */
export const FilterSheet = React.createContext(false);

/* 5.45, shared since 5.69 (PageHeader's bar, ActionBar's edge strip): `position: fixed` is relative to an ancestor with a transform, filter, perspective, will-change or paint
 * or layout containment, not to the screen. */
export function fixedTrapped(el: HTMLElement): boolean {
  for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
    const s = getComputedStyle(p);
    if (
      s.transform !== 'none' ||
      s.filter !== 'none' ||
      (s.backdropFilter || 'none') !== 'none' ||
      (s as unknown as { contentVisibility?: string }).contentVisibility === 'auto' ||
      s.perspective !== 'none' ||
      /transform|filter|perspective/.test(s.willChange) ||
      /paint|layout|strict|content/.test(s.contain)
    )
      return true;
  }
  return false;
}

/* 5.73 (Chamber-OS 192 follow-up): the fixed bottom bars (ActionBar's edge strip, PageHeader's actionsBarBelow) on
 * the page, oldest first. The newest one that is pinned and on screen writes its height to a variable on <html>, which
 * pads the page's end and scroll-padding-bottom. One with no box (a display: none tab panel), visibility: hidden, or
 * inside content-visibility: hidden (hidden="until-found") loses to it; see write() for when none is on screen. A
 * ResizeObserver per bar catches display and size changes; a visibility change resizes nothing, so the stack is also
 * re-read after any click, key press, focus move, transition, find-in-page reveal or history change. */
export interface BarStack {
  add(el: HTMLElement): void;
  remove(el: HTMLElement): void;
  write(): void;
}
function onScreen(el: HTMLElement): boolean {
  if (el.offsetHeight <= 0 || el.getClientRects().length === 0) return false;
  const check = (el as unknown as { checkVisibility?: (o?: Record<string, boolean>) => boolean }).checkVisibility;
  if (typeof check === 'function') return check.call(el, { visibilityProperty: true });
  const v = getComputedStyle(el).visibility;
  return v !== 'hidden' && v !== 'collapse';
}
/** `onMany` runs when two or more bars are on screen at once (they overlap at the bottom); `onRead` before each
 * re-read (5.74: PageHeader re-checks whether its bar is empty). */
export function barStack(name: string, onMany?: () => void, onRead?: () => void): BarStack {
  const els: HTMLElement[] = [];
  let frame = 0;
  const docEvents = ['click', 'keydown', 'focusin', 'transitionend', 'beforematch'];
  const winEvents = ['hashchange', 'popstate'];
  function write() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (onRead) onRead();
    const root = document.documentElement;
    let shown: HTMLElement | null = null,
      boxed: HTMLElement | null = null,
      pinned = false,
      many = 0;
    for (let i = els.length - 1; i >= 0; i--) {
      const el = els[i]!;
      if (getComputedStyle(el).position !== 'fixed') continue;
      pinned = true;
      if (onScreen(el)) {
        many++;
        if (!shown) shown = el;
      } else if (!boxed && el.offsetHeight > 0) boxed = el;
    }
    if (many > 1 && onMany) onMany();
    /* On screen first; else a pinned bar that still has a box (hidden by visibility — a gate that may lift with no
     * event, so keep its room: too much space is cosmetic, too little hides content); else, every pinned bar has no
     * box (display: none tab panels): no room. No bar pinned (a wide or short screen): no variable, as before. */
    const use = shown || boxed;
    if (use) root.style.setProperty(name, use.offsetHeight + 'px');
    else if (pinned) root.style.setProperty(name, '0px');
    else root.style.removeProperty(name);
  }
  function later() {
    if (!frame) frame = requestAnimationFrame(write);
  }
  /* A focus move reads scroll-padding at once: write now (keyboard focus lands after this), and again next frame. */
  function now() {
    write();
    later();
  }
  function listen(on: boolean) {
    docEvents.forEach(function (t: string) {
      const f = t === 'focusin' ? now : later;
      if (on) document.addEventListener(t, f, true);
      else document.removeEventListener(t, f, true);
    });
    winEvents.forEach(function (t: string) {
      if (on) window.addEventListener(t, later);
      else window.removeEventListener(t, later);
    });
  }
  return {
    add: function (el: HTMLElement) {
      els.push(el);
      if (els.length === 1) listen(true);
      write();
    },
    remove: function (el: HTMLElement) {
      const i = els.indexOf(el);
      if (i >= 0) els.splice(i, 1);
      if (!els.length) {
        listen(false);
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
      }
      write();
    },
    write: write,
  };
}

/* 5.75 (visual audit): how the user last moved — keys or a pointer — for listbox options, whose active row is
 * aria-activedescendant (focus stays in the field, so :focus-visible can't tell). The page's <html> carries
 * data-aura-modality="pointer" after a pointer press or a hover over an option, and loses it at the next key, so an
 * open list follows at once (no re-render needed). One pair of capture listeners for the page, added when the first
 * Select, Combobox or TimePicker mounts — before anyone can click it open. */
let modalityOn = false;
function setModality(m: 'key' | 'pointer'): void {
  const root = document.documentElement;
  if (m === 'pointer') {
    if (root.getAttribute('data-aura-modality') !== 'pointer') root.setAttribute('data-aura-modality', 'pointer');
  } else if (root.hasAttribute('data-aura-modality')) root.removeAttribute('data-aura-modality');
}
export function useInputModality(): void {
  React.useEffect(function () {
    if (modalityOn) return;
    modalityOn = true;
    document.addEventListener(
      'keydown',
      function () {
        setModality('key');
      },
      true,
    );
    document.addEventListener(
      'pointerdown',
      function () {
        setModality('pointer');
      },
      true,
    );
  }, []);
}
/** An option hovered by the pointer: the list is under the pointer now, until the next key. */
export function pointerModality(): void {
  setModality('pointer');
}

/* 5.78 (visual audit 24): a row that scrolls sideways (Tabs) says which ends have more — data-aura-more="start",
 * "end" or "start end" — so CSS can fade that edge. Logical: in RTL "start" is the right. Re-read on scroll (once a
 * frame) and when the row or a child resizes (fonts, a label change). */
export function useScrollEdges(r: React.RefObject<HTMLElement | null>, key?: unknown): void {
  /* key: re-attach when the element is a different one (Tabs switching between its link list and its tablist). */
  React.useEffect(
    function () {
      const el = r.current;
      if (!el || typeof ResizeObserver === 'undefined') return;
      let raf = 0;
      const mark = function () {
        raf = 0;
        const max = el.scrollWidth - el.clientWidth;
        const x = Math.abs(el.scrollLeft);
        const v = ((x > 1 ? 'start ' : '') + (x < max - 1 ? 'end' : '')).trim();
        if ((el.getAttribute('data-aura-more') || '') === v) return;
        if (v) el.setAttribute('data-aura-more', v);
        else el.removeAttribute('data-aura-more');
      };
      const on = function () {
        if (!raf) raf = requestAnimationFrame(mark);
      };
      mark();
      el.addEventListener('scroll', on, { passive: true });
      const ro = new ResizeObserver(on);
      ro.observe(el);
      Array.prototype.forEach.call(el.children, function (c: Element) {
        ro.observe(c);
      });
      /* a tab added or removed later */
      const mo = new MutationObserver(function () {
        Array.prototype.forEach.call(el.children, function (c: Element) {
          ro.observe(c);
        });
        on();
      });
      mo.observe(el, { childList: true });
      return function () {
        cancelAnimationFrame(raf);
        el.removeEventListener('scroll', on);
        ro.disconnect();
        mo.disconnect();
      };
    },
    [key],
  );
}
