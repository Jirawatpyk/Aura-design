import * as React from 'react';
import { useStrings, useAuraLocale } from './locale.js';
import { cx } from './internal.js';
import { IconButton } from './IconButton.js';
import { Drawer } from './Dialog.js';
import type { AppShellProps, Breakpoint, GridProps, Responsive, Space, StackProps } from './types.js';

/** Centred page column. */
export interface ContainerProps {
  /** `narrow` caps it at aura-container-narrow (720px). Default `default` (1280px). */
  size?: 'default' | 'narrow';
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
const h = React.createElement;

/* Breakpoints (min-width, px) — mirror the aura-bp-* tokens. CSS media queries can't read variables, so the values live here too. */
/** Min-width breakpoints in px, mirroring the aura-bp-* tokens. */
export const breakpoints: { sm: 640; md: 768; lg: 1024; xl: 1280 } = { sm: 640, md: 768, lg: 1024, xl: 1280 };
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
function respVars<T>(
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
const space = function (v: Space) {
  return typeof v === 'number' ? 'var(--aura-space-' + v + ')' : v;
};

/** Stack — one direction, even gaps. direction and gap may be responsive: { base: 'column', md: 'row' }. */
export const Stack = React.forwardRef<HTMLElement, StackProps>(function Stack(props, ref) {
  const style = Object.assign(
    {},
    respVars('aura-stack-dir', props.direction || 'column'),
    respVars('aura-stack-gap', props.gap == null ? 4 : props.gap, space),
    respVars('aura-stack-align', props.align || 'stretch'),
    props.justify ? { justifyContent: props.justify } : null,
    props.wrap ? { flexWrap: 'wrap' } : null,
    props.style,
  );
  return h(props.as || 'div', { ref: ref, className: cx('aura-stack', props.className), style: style }, props.children);
});

/** Grid — equal columns. columns may be responsive ({ base: 1, md: 2, lg: 3 }), or use minItemWidth to fit as many as fit. */
export const Grid = React.forwardRef<HTMLElement, GridProps>(function Grid(props, ref) {
  const style = Object.assign(
    {},
    respVars('aura-grid-gap', props.gap == null ? 6 : props.gap, space),
    props.minItemWidth
      ? { gridTemplateColumns: 'repeat(auto-fill, minmax(min(' + props.minItemWidth + 'px, 100%), 1fr))' }
      : respVars('aura-grid-cols', props.columns || 1),
    props.style,
  );
  return h(
    props.as || 'div',
    { ref: ref, className: cx('aura-grid-layout', props.minItemWidth && 'is-auto', props.className), style: style },
    props.children,
  );
});

/** Container — centres content up to aura-container-max (1280px) with responsive side padding. */
export const Container = React.forwardRef<HTMLElement, ContainerProps>(function Container(props, ref) {
  return h(
    props.as || 'div',
    {
      ref: ref,
      className: cx('aura-container', props.size === 'narrow' && 'is-narrow', props.className),
      style: props.style,
    },
    props.children,
  );
});

/** AppShell — side navigation + top bar + content. The nav is fixed from lg (1024px) up and a Drawer below it. */
export const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(function AppShell(props, ref) {
  const t = useStrings();
  const bp = useBreakpoint();
  const compact = bp === 'base' || bp === 'sm' || bp === 'md';
  const st = React.useState(false),
    open = st[0],
    setOpen = st[1];
  React.useEffect(
    function () {
      if (!compact) setOpen(false);
    },
    [compact],
  );
  const navEl = props.nav as React.ReactElement<{ onChange?: (id: string) => void; className?: string }> | undefined;
  const nav =
    props.nav && React.isValidElement(props.nav) && compact
      ? React.cloneElement(navEl!, {
          onChange: function (id: string) {
            if (navEl!.props.onChange) navEl!.props.onChange(id);
            setOpen(false);
          },
          className: cx(navEl!.props.className, 'is-in-drawer'),
        })
      : props.nav;
  return (
    <div ref={ref} className={cx('aura-shell', compact && 'is-compact', props.className)}>
      {!compact ? <div className="aura-shell__nav">{nav}</div> : null}
      {compact ? (
        <Drawer
          open={open}
          onClose={function () {
            setOpen(false);
          }}
          side="left"
          size="nav"
          aria-label={props.navLabel || t.navigation}
          dismissible={true}
        >
          {nav}
        </Drawer>
      ) : null}
      <div className="aura-shell__main">
        {props.header || compact ? (
          <header className="aura-shell__bar">
            {compact ? (
              <IconButton
                icon="menu"
                label={props.menuLabel || t.openNav}
                size="md"
                onClick={function () {
                  setOpen(true);
                }}
                aria-expanded={open}
              />
            ) : null}
            <div className="aura-shell__bar-content">{props.header}</div>
          </header>
        ) : null}
        <main className="aura-shell__content" id={props.mainId || 'main'}>
          {props.children}
        </main>
      </div>
    </div>
  );
});
