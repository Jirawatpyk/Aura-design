import * as React from 'react';
import { cx, devWarnOnce, uid, useIsoLayoutEffect } from './internal.js';
import type { TableCellProps, TableProps, TableSectionProps, TableRowProps } from './types.js';

/* Table family (4.20): plain <table> markup with AURA's type and spacing, for small fixed tables (invoice line items,
 * a VAT breakdown). Text wraps; there is no sorting, paging or virtualisation — use DataTable for data grids. */

/* 5.8 (Chamber-OS 67): a stacked table tells its cells their column labels, and each row tells its cells their
 * column, through context — so the labels are in the server's HTML and nothing shifts on hydration. */
const StackLabels = React.createContext<Array<string | undefined> | null>(null);
const ColumnIndex = React.createContext<number>(-1);

/* Children with fragments opened up, so cells or a THead inside <>…</> still count. */
function flat(children: React.ReactNode): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  React.Children.toArray(children).forEach(function (c) {
    if (React.isValidElement(c) && c.type === React.Fragment)
      out.push.apply(out, flat((c.props as { children?: React.ReactNode }).children));
    else out.push(c);
  });
  return out;
}
/* A header's visible text for its label; aria-hidden parts (sort arrows, icons) are left out. */
function text(node: React.ReactNode): string | undefined {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) {
    const parts = node.map(text).filter(function (x) {
      return x != null;
    });
    return parts.length ? parts.join('') : undefined;
  }
  if (React.isValidElement(node)) {
    const p = node.props as { children?: React.ReactNode; 'aria-hidden'?: unknown };
    if (p['aria-hidden'] === true || p['aria-hidden'] === 'true') return undefined;
    return text(p.children);
  }
  return undefined;
}
/* The header labels: the first row of THead, one entry per column (a Th's `label`, else its text). */
function headerLabels(children: React.ReactNode): Array<string | undefined> {
  let out: Array<string | undefined> = [];
  flat(children).forEach(function (c) {
    if (out.length || !React.isValidElement(c) || c.type !== THead) return;
    const row = flat((c.props as TableSectionProps).children).find(function (r) {
      return React.isValidElement(r);
    }) as React.ReactElement<TableRowProps> | undefined;
    if (!row) return;
    flat(row.props.children).forEach(function (cell) {
      if (!React.isValidElement(cell)) return;
      const p = cell.props as TableCellProps & { children?: React.ReactNode };
      const t = text(p.children);
      const label = p.label != null ? p.label : t != null ? t.replace(/\s+/g, ' ').trim() || undefined : undefined;
      const span = Math.max(1, Number(p.colSpan) || 1);
      for (let i = 0; i < span; i++) out.push(label);
    });
  });
  return out;
}

/** A static table. Scrolls sideways inside its own box when it is wider than its container. */
export const Table = React.forwardRef<HTMLTableElement, TableProps>(function Table(props, ref) {
  const { caption, captionHidden, density, stackBelow, className, children, ...rest } = props;
  const labels = stackBelow ? headerLabels(children) : null;
  if (labels && !labels.length)
    devWarnOnce(
      'tbl-stack-labels',
      'Table stackBelow: no THead > Tr > Th found among its children, so cells have no labels. Pass `label` on each Td.',
    );
  /* A plain table inside a stacked one's cell must not take its labels or roles. */
  const outer = React.useContext(StackLabels);
  const capId = uid();
  const wrap = React.useRef<HTMLDivElement | null>(null);
  /* When it has to scroll sideways (a narrow phone), the box becomes a named, focusable region so keyboard users
   * can scroll it too. */
  const sc = React.useState(false),
    scrolls = sc[0];
  useIsoLayoutEffect(function () {
    const el = wrap.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    function check() {
      sc[1](el!.scrollWidth > el!.clientWidth + 1);
    }
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return function () {
      ro.disconnect();
    };
  }, []);
  return (
    <div
      ref={wrap}
      className={cx('aura-tbl-wrap', stackBelow && 'is-stackable')}
      data-density={density}
      tabIndex={scrolls ? 0 : undefined}
      /* A region needs a name: the caption, else the table's aria-label (5.1.1: an unnamed region before). */
      role={scrolls && (caption != null || rest['aria-label']) ? 'region' : undefined}
      aria-labelledby={scrolls && caption != null ? capId : undefined}
      aria-label={scrolls && caption == null ? rest['aria-label'] : undefined}
    >
      <table
        ref={ref}
        className={cx('aura-tbl', stackBelow && 'aura-tbl--stack-' + stackBelow, className)}
        /* Stacked rows are display: block; explicit roles keep the table for screen readers (Safari drops it). */
        role={stackBelow ? 'table' : undefined}
        {...rest}
      >
        {caption != null ? (
          <caption id={capId} className={cx('aura-tbl__caption', captionHidden && 'aura-sr-only')}>
            {caption}
          </caption>
        ) : null}
        {labels ? (
          <StackLabels.Provider value={labels}>{children}</StackLabels.Provider>
        ) : outer ? (
          <StackLabels.Provider value={null}>{children}</StackLabels.Provider>
        ) : (
          children
        )}
      </table>
    </div>
  );
});

function section(tag: 'thead' | 'tbody' | 'tfoot', cls: string) {
  const C = React.forwardRef<HTMLTableSectionElement, TableSectionProps>(function TableSection(props, ref) {
    const { className, ...rest } = props;
    const stacked = React.useContext(StackLabels) != null;
    return React.createElement(
      tag,
      Object.assign({ ref: ref, className: cx(cls, className), role: stacked ? 'rowgroup' : undefined }, rest),
    );
  });
  return C;
}
export const THead = section('thead', 'aura-tbl__head');
THead.displayName = 'THead';
export const TBody = section('tbody', 'aura-tbl__body');
TBody.displayName = 'TBody';
export const TFoot = section('tfoot', 'aura-tbl__foot');
TFoot.displayName = 'TFoot';

export const Tr = React.forwardRef<HTMLTableRowElement, TableRowProps>(function Tr(props, ref) {
  const { className, children, ...rest } = props;
  const stacked = React.useContext(StackLabels) != null;
  let col = 0;
  return (
    <tr ref={ref} className={cx('aura-tbl__row', className)} role={stacked ? 'row' : undefined} {...rest}>
      {stacked
        ? flat(children).map(function (c) {
            const at = col;
            if (React.isValidElement(c)) col += Math.max(1, Number((c.props as TableCellProps).colSpan) || 1);
            return (
              <ColumnIndex.Provider key={React.isValidElement(c) && c.key != null ? c.key : at} value={at}>
                {c}
              </ColumnIndex.Provider>
            );
          })
        : children}
    </tr>
  );
});

function cellClass(base: string, p: TableCellProps) {
  const align = p.align || (p.numeric ? 'end' : undefined);
  return cx(
    base,
    align === 'end' && 'is-end',
    align === 'center' && 'is-center',
    p.numeric && 'is-numeric',
    p.mono && 'aura-table__mono',
    p.className,
  );
}

/** Header cell. `scope` defaults to `col`; pass `scope="row"` for a row header in the body. */
export const Th = React.forwardRef<HTMLTableCellElement, TableCellProps>(function Th(props, ref) {
  const { align, numeric, mono, className, scope, label, ...rest } = props;
  const stacked = React.useContext(StackLabels) != null;
  return (
    <th
      ref={ref}
      scope={scope || 'col'}
      className={cellClass('aura-tbl__th', props)}
      role={stacked ? (scope === 'row' ? 'rowheader' : 'columnheader') : undefined}
      {...rest}
    />
  );
});

/** Data cell. `numeric` right-aligns with tabular figures (money, counts). */
export const Td = React.forwardRef<HTMLTableCellElement, TableCellProps>(function Td(props, ref) {
  const { align, numeric, mono, className, scope, label, ...rest } = props;
  const labels = React.useContext(StackLabels),
    col = React.useContext(ColumnIndex);
  const shown = labels ? (label != null ? label : col >= 0 ? labels[col] : undefined) : undefined;
  return (
    <td
      ref={ref}
      className={cellClass('aura-tbl__td', props)}
      role={labels ? 'cell' : undefined}
      data-label={shown || undefined}
      {...rest}
    />
  );
});
