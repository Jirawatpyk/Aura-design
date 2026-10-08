import type { Breakpoint, Responsive, Space } from './types.js';
/* Breakpoints (min-width, px) — mirror the aura-bp-* tokens. CSS media queries can't read variables, so the values
 * live here too. No React (shared by useBreakpoint and the server entry). */
/** Min-width breakpoints in px, mirroring the aura-bp-* tokens. */
export const breakpoints: { sm: 640; md: 768; lg: 1024; xl: 1280 } = { sm: 640, md: 768, lg: 1024, xl: 1280 };

/* Moved from responsive.tsx (5.34) so the server entry's TileGrid can use them: no React. */
const ORDER: Breakpoint[] = ['base', 'sm', 'md', 'lg', 'xl'];

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
