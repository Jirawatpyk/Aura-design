import * as React from 'react';
import type { Breakpoint, Responsive } from './types.js';

import { breakpoints, respVars, space } from './breakpoints.js';
export { breakpoints, respVars, space };

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
