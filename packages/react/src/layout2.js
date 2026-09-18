import * as React from 'react';
import { useStrings, useAuraLocale } from './locale.js';
import { cx } from './internal.js';
import { IconButton } from './IconButton.js';
import { Drawer } from './Dialog.js';
const h = React.createElement;

/* Breakpoints (min-width, px) — mirror the aura-bp-* tokens. CSS media queries can't read variables, so the values live here too. */
export var breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280 };
var ORDER = ['base', 'sm', 'md', 'lg', 'xl'];

/** The widest breakpoint the window currently meets: 'base' | 'sm' | 'md' | 'lg' | 'xl'. 'lg' during server render. */
export function useBreakpoint() {
  return React.useSyncExternalStore(subscribe, current, function () { return 'lg'; });
}
function current() {
  var w = window.innerWidth, bp = 'base';
  ORDER.slice(1).forEach(function (k) { if (w >= breakpoints[k]) bp = k; });
  return bp;
}
function subscribe(cb) { window.addEventListener('resize', cb); return function () { window.removeEventListener('resize', cb); }; }
/** Pick a value for the current breakpoint from { base, sm, md, lg, xl } (falls back to the next smaller one). */
export function useResponsive(value) {
  var bp = useBreakpoint();
  if (value == null || typeof value !== 'object') return value;
  for (var i = ORDER.indexOf(bp); i >= 0; i--) if (value[ORDER[i]] !== undefined) return value[ORDER[i]];
  return undefined;
}
function respVars(prefix, value, map) {
  /* Every breakpoint gets an explicit value (carried up from the last one given), so a nested Stack never
   * inherits its parent's custom properties. */
  var style = {};
  if (value == null) return style;
  if (typeof value !== 'object') value = { base: value };
  var cur;
  ORDER.forEach(function (k) { if (value[k] !== undefined) cur = map ? map(value[k]) : value[k]; if (cur !== undefined) style['--' + prefix + '-' + k] = cur; });
  return style;
}
var space = function (v) { return typeof v === 'number' ? 'var(--aura-space-' + v + ')' : v; };

/** Stack — one direction, even gaps. direction and gap may be responsive: { base: 'column', md: 'row' }. */
export const Stack = React.forwardRef(function Stack(props, ref) {
  var style = Object.assign({}, respVars('aura-stack-dir', props.direction || 'column'), respVars('aura-stack-gap', props.gap == null ? 4 : props.gap, space),
    respVars('aura-stack-align', props.align || 'stretch'), props.justify ? { justifyContent: props.justify } : null, props.wrap ? { flexWrap: 'wrap' } : null, props.style);
  return h(props.as || 'div', { ref: ref, className: cx('aura-stack', props.className), style: style }, props.children);
});

/** Grid — equal columns. columns may be responsive ({ base: 1, md: 2, lg: 3 }), or use minItemWidth to fit as many as fit. */
export const Grid = React.forwardRef(function Grid(props, ref) {
  var style = Object.assign({}, respVars('aura-grid-gap', props.gap == null ? 6 : props.gap, space),
    props.minItemWidth ? { gridTemplateColumns: 'repeat(auto-fill, minmax(min(' + props.minItemWidth + 'px, 100%), 1fr))' } : respVars('aura-grid-cols', props.columns || 1), props.style);
  return h(props.as || 'div', { ref: ref, className: cx('aura-grid-layout', props.minItemWidth && 'is-auto', props.className), style: style }, props.children);
});

/** Container — centres content up to aura-container-max (1280px) with responsive side padding. */
export const Container = React.forwardRef(function Container(props, ref) {
  return h(props.as || 'div', { ref: ref, className: cx('aura-container', props.size === 'narrow' && 'is-narrow', props.className), style: props.style }, props.children);
});

/** AppShell — side navigation + top bar + content. The nav is fixed from lg (1024px) up and a Drawer below it. */
export const AppShell = React.forwardRef(function AppShell(props, ref) {
  var t = useStrings();
  var bp = useBreakpoint();
  var compact = (bp === 'base' || bp === 'sm' || bp === 'md');
  var st = React.useState(false), open = st[0], setOpen = st[1];
  React.useEffect(function () { if (!compact) setOpen(false); }, [compact]);
  var nav = props.nav && React.isValidElement(props.nav) && compact
    ? React.cloneElement(props.nav, { onChange: function (id) { if (props.nav.props.onChange) props.nav.props.onChange(id); setOpen(false); }, className: cx(props.nav.props.className, 'is-in-drawer') })
    : props.nav;
  return h('div', { ref: ref, className: cx('aura-shell', compact && 'is-compact', props.className) },
    !compact ? h('div', { className: 'aura-shell__nav' }, nav) : null,
    compact ? h(Drawer, { open: open, onClose: function () { setOpen(false); }, side: 'left', size: 'nav', 'aria-label': props.navLabel || t.navigation, dismissible: true }, nav) : null,
    h('div', { className: 'aura-shell__main' },
      props.header || compact ? h('header', { className: 'aura-shell__bar' },
        compact ? h(IconButton, { icon: 'menu', label: props.menuLabel || t.openNav, size: 'md', onClick: function () { setOpen(true); }, 'aria-expanded': open }) : null,
        h('div', { className: 'aura-shell__bar-content' }, props.header)) : null,
      h('main', { className: 'aura-shell__content', id: props.mainId || 'main' }, props.children)));
});
