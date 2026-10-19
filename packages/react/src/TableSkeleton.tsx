import * as React from 'react';
import { cx } from './classes.js';
import type { TableSkeletonColumn, TableSkeletonProps } from './types.js';

/* 5.52 (Chamber-OS 164): a loading Table — the same frame, columns and stacked cards as the Table it stands in for,
 * with placeholder rows. Stateless (no hooks or context), so it renders in a Server Component; the client Table's
 * `loading` uses the same pieces under its own head. */

const h = React.createElement;

/* `inert` is a boolean prop from React 19; React 18 passes it through only as a string. */
export function inertProps(): Record<string, unknown> {
  return { inert: parseInt(React.version, 10) >= 19 ? true : '', 'aria-hidden': true };
}

function widthOf(w: string | number | undefined): string | undefined {
  return w == null || w === '' ? undefined : typeof w === 'number' ? w + 'px' : w;
}

export function skeletonColgroup(cols: TableSkeletonColumn[]): React.ReactElement {
  return h(
    'colgroup',
    null,
    cols.map(function (c, i) {
      const w = widthOf(c.width);
      return h('col', { key: i, style: w ? { width: w } : undefined });
    }),
  );
}

function placeholder(c: TableSkeletonColumn): React.ReactNode {
  const s = c.skeleton || {};
  if (s.kind === 'pill') return h('span', { className: 'aura-skel aura-skel--pill' });
  if (s.kind === 'action') return h('span', { className: cx('aura-skel aura-skel--action', s.touch && 'is-touch') });
  if (s.lines === 2)
    return h(
      'span',
      { className: 'aura-skel-lines' },
      h('span', { className: 'aura-skel aura-skel--text', style: { width: '100%' } }),
      h('span', { className: 'aura-skel aura-skel--text', style: { width: '60%' } }),
    );
  return h('span', { className: 'aura-skel aura-skel--text', style: { width: '80%' } });
}

function cellCls(base: string, c: TableSkeletonColumn): string {
  const align = c.align || (c.numeric ? 'end' : undefined);
  return cx(base, align === 'end' && 'is-end', align === 'center' && 'is-center', c.numeric && 'is-numeric');
}

/** The placeholder rows: `n` rows of one cell per column; stacked, each cell keeps its label and card role. */
export function skeletonBody(cols: TableSkeletonColumn[], n: number, stacked: boolean): React.ReactElement {
  const rows: React.ReactElement[] = [];
  for (let r = 0; r < n; r++)
    rows.push(
      h(
        'tr',
        { key: r, className: 'aura-tbl__row aura-tbl__row--skeleton', role: stacked ? 'row' : undefined },
        cols.map(function (c, i) {
          const slot = stacked && (c.card === 'title' || c.card === 'action') ? c.card : undefined;
          return h(
            'td',
            {
              key: i,
              className: cellCls('aura-tbl__td', c),
              role: stacked ? 'cell' : undefined,
              'data-label': stacked && !slot && c.label ? c.label : undefined,
              'data-card': slot,
            },
            placeholder(c),
          );
        }),
      ),
    );
  return h(
    'tbody',
    { key: 'aura-skeleton', className: 'aura-tbl__body', role: stacked ? 'rowgroup' : undefined },
    rows,
  );
}

/** Classes of the Table's box, shared so the skeleton's frame is the Table's. */
export function tableWrapClass(p: {
  stackBelow?: 'sm' | 'md' | undefined;
  bordered?: boolean | undefined;
  bleed?: boolean | undefined;
  bleedEnd?: boolean | undefined;
  cards: boolean;
}): string {
  return cx(
    'aura-tbl-wrap',
    p.stackBelow && 'is-stackable',
    p.bordered === false && 'is-flush',
    p.bleed && 'aura-bleed-frame',
    p.bleed && !p.cards && 'aura-bleed',
    p.bleed && p.bleedEnd && !p.cards && 'aura-bleed-end',
  );
}
export function tableClass(p: {
  stackBelow?: 'sm' | 'md' | undefined;
  align?: 'top' | 'middle' | undefined;
  rowHeight?: 'density' | undefined;
  cards: boolean;
  className?: string | undefined;
}): string {
  return cx(
    'aura-tbl',
    p.stackBelow && 'aura-tbl--stack-' + p.stackBelow,
    (p.align === 'middle' || (p.rowHeight === 'density' && p.align !== 'top')) && 'aura-tbl--middle',
    p.rowHeight === 'density' && 'aura-tbl--row-density',
    p.cards && 'aura-tbl--cards',
    p.className,
  );
}
export function cardsFrame(
  el: React.ReactElement,
  p: {
    stackBelow?: 'sm' | 'md' | undefined;
    bleed?: boolean | undefined;
    bleedEnd?: boolean | undefined;
    cards: boolean;
  },
): React.ReactElement {
  return p.cards
    ? h(
        'div',
        {
          className: cx(
            'aura-tbl-cards aura-tbl-cards--' + p.stackBelow,
            p.bleed && 'aura-bleed',
            p.bleed && p.bleedEnd && 'aura-bleed-end',
          ),
        },
        el,
      )
    : el;
}

/** A loading Table (5.52, Chamber-OS 164), for Server Components — e.g. a route's loading.tsx. `aria-hidden` and
 * `inert`: announce the load in the page's own status line. */
export function TableSkeleton(props: TableSkeletonProps): React.ReactElement {
  const cols = props.columns || [];
  const n = props.rows != null ? Math.max(0, props.rows) : 5;
  const stacked = !!props.stackBelow;
  const cards = stacked && props.stackStyle === 'cards';
  const head = h(
    'thead',
    { className: 'aura-tbl__head', role: stacked ? 'rowgroup' : undefined },
    h(
      'tr',
      { className: 'aura-tbl__row', role: stacked ? 'row' : undefined },
      cols.map(function (c, i) {
        return h(
          'th',
          { key: i, scope: 'col', className: cellCls('aura-tbl__th', c), role: stacked ? 'columnheader' : undefined },
          c.label,
        );
      }),
    ),
  );
  const table = h(
    'div',
    Object.assign(
      {
        className: tableWrapClass({
          stackBelow: props.stackBelow,
          bordered: props.bordered,
          bleed: props.bleed,
          bleedEnd: props.bleedEnd,
          cards: cards,
        }),
        'data-density': props.density || 'comfortable',
      },
      inertProps(),
    ),
    h(
      'table',
      {
        className: cx(
          tableClass({
            stackBelow: props.stackBelow,
            align: props.align,
            rowHeight: props.rowHeight,
            cards: cards,
            className: props.className,
          }),
          'aura-tbl--skeleton',
        ),
        role: stacked ? 'table' : undefined,
      },
      skeletonColgroup(cols),
      head,
      skeletonBody(cols, n, stacked),
    ),
  );
  return cardsFrame(table, {
    stackBelow: props.stackBelow,
    bleed: props.bleed,
    bleedEnd: props.bleedEnd,
    cards: cards,
  });
}
