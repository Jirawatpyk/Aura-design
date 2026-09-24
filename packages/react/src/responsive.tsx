import * as React from 'react';
import type { Breakpoint, Responsive, Space } from './types.js';

import { breakpoints } from './breakpoints.js';
export { breakpoints };

const ORDER: Breakpoint[] = ['base', 'sm', 'md', 'lg', 'xl'];

/** The widest breakpoint the window currently meets: 'base' | 'sm' | 'md' | 'lg' | 'xl'. 'lg' during server render. */
export function useBreakpoint(): Breakpoint {
  return React.useSyncExternalStore<Breakpoint>(subscribe, current, function () {
    return 'lg';
  });
}

function current(): Breakpoint {
  let w = window.innerWidth,
    bp: Breakpoint = 'base';
  ORDER.slice(1).forEach(function (k) {
    if (w >= breakpoints[k as Exclude<Breakpoint, 'base'>]) bp = k;
  });
  return bp;
}

function subscribe(cb: () => void) {
  window.addEventListener('resize', cb);
  return function () {
    window.removeEventListener('resize', cb);
  };
}

/** Pick a value for the current breakpoint from { base, sm, md, lg, xl } (falls back to the next smaller one). */
export function useResponsive<T>(value: Responsive<T>): T | undefined {
  const bp = useBreakpoint();
  if (value == null || typeof value !== 'object') return value as T;
  const map = value as Partial<Record<Breakpoint, T>>;
  for (let i = ORDER.indexOf(bp); i >= 0; i--) if (map[ORDER[i]] !== undefined) return map[ORDER[i]];
  return undefined;
}

export function respVars<T>(
  prefix: string,
  value: Responsive<T> | null | undefined,
  map?: (v: T) => unknown,
): Record<string, unknown> {
  /* Every breakpoint gets an explicit value (carried up from the last one given), so a nested Stack never
   * inherits its parent's custom properties. */
  const style: Record<string, unknown> = {};
  if (value == null) return style;
  if (typeof value !== 'object') value = { base: value };
  let byBp = value as Partial<Record<Breakpoint, T>>,
    cur: unknown;
  ORDER.forEach(function (k) {
    if (byBp[k] !== undefined) cur = map ? map(byBp[k] as T) : byBp[k];
    if (cur !== undefined) style['--' + prefix + '-' + k] = cur;
  });
  return style;
}

export const space = function (v: Space) {
  return typeof v === 'number' ? 'var(--aura-space-' + v + ')' : v;
};
