import * as React from 'react';
import { Icon } from './Icon.js';
import { cx } from './classes.js';
import { respVars } from './breakpoints.js';
import { STRINGS } from './strings.js';
import { IconCircleAlert, IconCircleCheck, IconTriangleAlert, IconWrench } from './icons.js';
import type { AuraIcon } from './iconSvg.js';
import type { AuraStrings } from './strings.js';
import type { SparklineProps, StatusTileProps, StatusTileStatus, TileGridProps, TileTone } from './types.js';

/* 5.34 (DxT Monitor, Overview S06): StatusTile, TileGrid and Sparkline. No hooks or context here, so the server entry
 * renders the same HTML; StatusTile.tsx adds the provider's link component, locale words and the marker tips. */

const h = React.createElement;

const STATUS_ICON: Record<StatusTileStatus, AuraIcon> = {
  down: IconCircleAlert,
  problem: IconTriangleAlert,
  maintenance: IconWrench,
  ok: IconCircleCheck,
};
const STATUS_TONE: Record<StatusTileStatus, TileTone> = {
  down: 'danger',
  problem: 'warning',
  maintenance: 'accent',
  ok: 'default',
};
const STATUS_WORD: Record<StatusTileStatus, keyof AuraStrings> = {
  down: 'statusDown',
  problem: 'statusProblem',
  maintenance: 'statusMaintenance',
  ok: 'statusOk',
};

/** The status word for a tile, from a strings table. */
export function statusWord(status: StatusTileStatus, t: AuraStrings): string {
  return String(t[STATUS_WORD[status]] || STATUS_WORD[status]);
}

function attrs(props: object): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  Object.keys(props).forEach(function (k: string) {
    if (k === 'id' || k === 'style' || k === 'lang' || k === 'dir' || /^(aria|data)-/.test(k))
      out[k] = (props as Record<string, unknown>)[k];
  });
  return out;
}

/* A comma for screen readers at the end of a part ("Checkout, Problem"). It stays inline (zero-size text, not the
 * absolutely placed sr-only box), or the name would get a space before it ("Checkout , Problem"). */
const comma = h('span', { className: 'aura-status-tile__sep' }, ',');

/* The tile's name comes from its content (WCAG 2.5.3: what is shown is what is read), in reading order — title,
 * status, value, meta, markers — with commas for screen readers only. An `aria-label` you pass still wins. */
export function statusTileElement(
  props: StatusTileProps,
  ref: React.Ref<HTMLElement> | undefined,
  Link: React.ElementType,
  t: AuraStrings,
  titleRef?: React.Ref<HTMLSpanElement>,
): React.ReactElement {
  const status = STATUS_ICON[props.status] ? props.status : 'ok';
  const valueTone = props.valueTone || STATUS_TONE[status];
  const word = props.statusLabel || statusWord(status, t);
  const markers = (props.markers || []).filter(Boolean);
  const has = function (v: unknown) {
    return v != null && v !== false && v !== '';
  };
  const hasValue = has(props.value),
    hasMeta = has(props.meta);
  const Tag = (props.href ? Link : 'div') as React.ElementType;
  return h(
    Tag,
    Object.assign(attrs(props), {
      ref: ref,
      href: props.href,
      className: cx('aura-status-tile', 'aura-status-tile--' + status, props.href && 'is-interactive', props.className),
    }),
    h(
      'span',
      { className: 'aura-status-tile__head' },
      h(Icon, { name: h(STATUS_ICON[status]), size: 16, className: 'aura-status-tile__icon' }),
      h('span', { className: 'aura-status-tile__title', ref: titleRef }, props.title, comma),
      h('span', { className: 'aura-sr-only' }, word + (hasValue || hasMeta || markers.length ? ',' : '')),
      hasValue
        ? h(
            'span',
            { className: cx('aura-status-tile__value', 'is-' + valueTone) },
            props.value,
            hasMeta || markers.length ? comma : null,
          )
        : null,
    ),
    hasMeta || markers.length
      ? h(
          'span',
          { className: 'aura-status-tile__foot' },
          hasMeta
            ? h('span', { className: 'aura-status-tile__meta' }, props.meta, markers.length ? comma : null)
            : null,
          markers.length
            ? h(
                'span',
                { className: 'aura-status-tile__markers' },
                markers.map(function (m, i) {
                  return h(
                    'span',
                    {
                      key: i,
                      className: cx('aura-status-tile__marker', 'is-' + (m.tone || 'neutral')),
                      'data-aura-tip': m.label,
                    },
                    h(Icon, { name: m.icon, size: 14 }),
                    h('span', { className: 'aura-sr-only' }, m.label + (i < markers.length - 1 ? ',' : '')),
                  );
                }),
              )
            : null,
        )
      : null,
  );
}

export function ServerStatusTile(props: StatusTileProps): React.ReactElement {
  return statusTileElement(props, undefined, props.linkComponent || 'a', STRINGS.en);
}

/* TileGrid: a list of equal columns, 8px apart. Each child is one item. */
export const TileGrid = React.forwardRef<HTMLUListElement, TileGridProps>(function TileGrid(props, ref) {
  const style = Object.assign(
    {},
    respVars('aura-grid-cols', props.columns == null ? { base: 2, md: 3 } : props.columns),
    props.style,
  );
  return h(
    'ul',
    Object.assign(attrs(props), {
      ref: ref,
      role: 'list',
      className: cx('aura-grid-layout', 'aura-tile-grid', props.className),
      style: style,
    }),
    /* toArray drops null and booleans and keys each element; a Fragment's children are items too. */
    flat(props.children).map(function (c, i) {
      return h('li', { key: React.isValidElement(c) && c.key != null ? c.key : i }, c);
    }),
  );
});

function flat(children: React.ReactNode): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  React.Children.toArray(children).forEach(function (c) {
    if (React.isValidElement(c) && c.type === React.Fragment)
      flat((c.props as { children?: React.ReactNode }).children).forEach(function (x) {
        out.push(React.isValidElement(x) ? React.cloneElement(x, { key: String(c.key) + '/' + String(x.key) }) : x);
      });
    else if (c !== '') out.push(c);
  });
  return out;
}

/* Sparkline: a small line, no axes. Null points break it; a point with no neighbour is a dot. */
const SIZES = { sm: [80, 24], md: [120, 32] } as const;
const PAD = 2;
function r(n: number): number {
  return Math.round(n * 100) / 100;
}
function num(v: unknown): number | null {
  return typeof v === 'number' && isFinite(v) ? v : null;
}

export const Sparkline = React.forwardRef<SVGSVGElement, SparklineProps>(function Sparkline(props, ref) {
  const wh = SIZES[props.size || 'sm'] || SIZES.sm;
  const W = wh[0],
    H = wh[1];
  const data = (props.data || []).map(num);
  const n = data.length;
  const vals = data.filter(function (v): v is number {
    return v != null;
  });
  let lo = num(props.min),
    hi = num(props.max);
  if (lo == null) lo = vals.length ? Math.min.apply(null, vals) : 0;
  if (hi == null) hi = vals.length ? Math.max.apply(null, vals) : 0;
  if (lo > hi) {
    const s = lo;
    lo = hi;
    hi = s;
  }
  const step = n > 1 ? (W - 2 * PAD) / (n - 1) : 0;
  const x = function (i: number) {
    return n > 1 ? PAD + i * step : W / 2;
  };
  const y = function (v: number) {
    if (hi === lo) return H / 2;
    const k = Math.max(0, Math.min(1, (v - lo!) / (hi! - lo!)));
    return H - PAD - k * (H - 2 * PAD);
  };
  let d = '';
  const dots: React.ReactNode[] = [];
  data.forEach(function (v, i) {
    if (v == null) return;
    const prev = i > 0 && data[i - 1] != null,
      next = i < n - 1 && data[i + 1] != null;
    if (!prev && !next) dots.push(h('circle', { key: 'd' + i, cx: r(x(i)), cy: r(y(v)), r: 1.5 }));
    else d += (prev ? 'L' : 'M') + r(x(i)) + ' ' + r(y(v));
  });
  const mode = props.failures || 'none';
  const fails: React.ReactNode[] = [];
  if (mode !== 'none' && props.failed)
    data.forEach(function (_v, i) {
      if (!props.failed![i]) return;
      if (mode === 'band') {
        const w = Math.max(2, step || W),
          left = Math.max(0, x(i) - w / 2),
          right = Math.min(W, x(i) + w / 2);
        fails.push(h('rect', { key: 'f' + i, x: r(left), y: 0, width: r(right - left), height: H }));
      } else
        fails.push(
          h('rect', {
            key: 'f' + i,
            x: r(Math.max(0, Math.min(W - 1.5, x(i) - 0.75))),
            y: H - 6,
            width: 1.5,
            height: 6,
          }),
        );
    });
  const named = !!props.label;
  return h(
    'svg',
    Object.assign(attrs(props), {
      ref: ref,
      className: cx('aura-sparkline', 'is-' + (props.tone || 'neutral'), props.className),
      width: W,
      height: H,
      viewBox: '0 0 ' + W + ' ' + H,
      role: named ? 'img' : undefined,
      'aria-label': named ? props.label : undefined,
      'aria-hidden': named ? undefined : true,
      focusable: 'false',
    }),
    fails.length && mode === 'band' ? h('g', { className: 'aura-sparkline__band' }, fails) : null,
    d ? h('path', { className: 'aura-sparkline__line', d: d }) : null,
    dots.length ? h('g', { className: 'aura-sparkline__dots' }, dots) : null,
    fails.length && mode === 'ticks' ? h('g', { className: 'aura-sparkline__ticks' }, fails) : null,
  );
});
