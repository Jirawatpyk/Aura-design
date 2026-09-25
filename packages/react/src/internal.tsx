import * as React from 'react';
import type { Tone } from './types.js';

export function cx(...parts: Array<string | number | bigint | boolean | null | undefined>): string;
export function cx(): string {
  return Array.prototype.filter.call(arguments, Boolean).join(' ');
}
export function omit<T extends object, K extends string>(src: T, keys: readonly K[]): Omit<T, K> {
  const out: Record<string, unknown> = {};
  for (const k in src)
    if (Object.prototype.hasOwnProperty.call(src, k) && (keys as readonly string[]).indexOf(k) < 0)
      out[k] = (src as Record<string, unknown>)[k];
  return out as Omit<T, K>;
}

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
    container.querySelectorAll<HTMLElement>(FOCUSABLE),
    function (el: HTMLElement) {
      return el.tabIndex >= 0 && el.offsetParent !== null;
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

/* Badge / Progress tone → class suffix. */
const TONES: string[] = ['neutral', 'accent', 'success', 'warning', 'danger'];

export function tone(t: Tone | undefined): string {
  return TONES.indexOf(t as string) >= 0 ? (t as string) : 'neutral';
}

/* Development-only notices, once per key (5.1). Bundlers replace process.env.NODE_ENV; without one (the window.Aura
 * script) the lookup throws and nothing is printed. */
declare const process: { env: { NODE_ENV?: string } };
const warned: Record<string, boolean> = {};
/* A plain left click: not Ctrl/⌘/Shift/Alt (open in a new tab or window) and not already handled (5.1.1). */
export function plainClick(e: React.MouseEvent): boolean {
  return !e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}
export function devWarnOnce(key: string, message: string): void {
  if (warned[key]) return;
  let dev = false;
  try {
    dev = process.env.NODE_ENV !== 'production';
  } catch (e) {
    dev = false;
  }
  if (!dev) return;
  warned[key] = true;
  console.warn('[AURA] ' + message);
}
