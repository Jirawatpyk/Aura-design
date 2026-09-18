import * as React from 'react';
const h = React.createElement;

export function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
export function omit(src, keys) {
  var out = {};
  for (var k in src) if (Object.prototype.hasOwnProperty.call(src, k) && keys.indexOf(k) < 0) out[k] = src[k];
  return out;
}

/* Controlled-or-not state: use the prop when given, else keep it here. */
export function useMaybeControlled(value, initial, onChange) {
  var s = React.useState(initial);
  var controlled = value !== undefined;
  return [controlled ? value : s[0], function (next) { if (!controlled) s[1](next); if (onChange) onChange(next); }];
}

export var collator = typeof Intl !== 'undefined' ? new Intl.Collator(['th', 'en'], { numeric: true, sensitivity: 'base' }) : null;
export function compare(a, b) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return collator ? collator.compare(String(a), String(b)) : String(a).localeCompare(String(b));
}

export const uid = React.useId || function () { const r = React.useRef(null); if (!r.current) r.current = 'aura-' + Math.random().toString(36).slice(2, 9); return r.current; };
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
export function trapTab(e, container) {
  if (e.key !== 'Tab' || !container) return;
  var list = Array.prototype.filter.call(container.querySelectorAll(FOCUSABLE), function (el) { return el.tabIndex >= 0 && el.offsetParent !== null; });
  if (!list.length) return;
  var first = list[0], last = list[list.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

/* One ref callback that feeds several refs (the consumer's forwarded ref and our own). */
export function useMergedRef(a, b) {
  return React.useCallback(function (node) {
    [a, b].forEach(function (r) { if (!r) return; if (typeof r === 'function') r(node); else r.current = node; });
  }, [a, b]);
}
