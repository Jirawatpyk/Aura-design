import * as React from 'react';
const h = React.createElement;

export function cx(...parts: Array<string | false | null | undefined | 0>): string;
export function cx(): string { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
export function omit<T extends object, K extends string>(src: T, keys: readonly K[]): Omit<T, K> {
  var out: Record<string, unknown> = {};
  for (var k in src) if (Object.prototype.hasOwnProperty.call(src, k) && (keys as readonly string[]).indexOf(k) < 0) out[k] = (src as Record<string, unknown>)[k];
  return out as Omit<T, K>;
}

/* Controlled-or-not state: use the prop when given, else keep it here. */
export function useMaybeControlled<T>(value: T | undefined, initial: T, onChange?: ((next: T) => void) | null): [T, (next: T) => void] {
  var s = React.useState<T>(initial);
  var controlled = value !== undefined;
  return [controlled ? value as T : s[0], function (next: T) { if (!controlled) s[1](next); if (onChange) onChange(next); }];
}

export var collator = typeof Intl !== 'undefined' ? new Intl.Collator(['th', 'en'], { numeric: true, sensitivity: 'base' }) : null;
export function compare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return collator ? collator.compare(String(a), String(b)) : String(a).localeCompare(String(b));
}

export const uid: () => string = React.useId || function () { const r = React.useRef<string | null>(null); if (!r.current) r.current = 'aura-' + Math.random().toString(36).slice(2, 9); return r.current; };
export var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/* True after the first client render: portals wait for it so server rendering (Next.js) never touches document. */
/* false on the server and while hydrating, true for components mounted fresh on the client (a menu opened on click),
 * so they render their portal in the first pass. React's useSyncExternalStore picks the right snapshot. */
function noopSubscribe() { return function () {}; }
function yes() { return true; }
function no() { return false; }
export function useMounted() {
  return React.useSyncExternalStore(noopSubscribe, yes, no);
}

/* useLayoutEffect in the browser, useEffect on the server (no SSR warning). */
export var useIsoLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/* Keep Tab inside a popover (date picker dialogs): wraps from last to first and back. */
export function trapTab(e: React.KeyboardEvent | KeyboardEvent, container: HTMLElement | null): void {
  if (e.key !== 'Tab' || !container) return;
  var list = Array.prototype.filter.call(container.querySelectorAll<HTMLElement>(FOCUSABLE), function (el: HTMLElement) { return el.tabIndex >= 0 && el.offsetParent !== null; });
  if (!list.length) return;
  var first = list[0], last = list[list.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

/* One ref callback that feeds several refs (the consumer's forwarded ref and our own). */
export function useMergedRef<T>(a: React.Ref<T> | undefined, b: React.Ref<T> | undefined): (node: T | null) => void {
  return React.useCallback(function (node: T | null) {
    [a, b].forEach(function (r) { if (!r) return; if (typeof r === 'function') r(node); else (r as React.MutableRefObject<T | null>).current = node; });
  }, [a, b]);
}
