import * as React from 'react';
import { cx, uid, useIsoLayoutEffect } from './internal.js';
import type { TableCellProps, TableProps, TableSectionProps, TableRowProps } from './types.js';

/* Table family (4.20): plain <table> markup with AURA's type and spacing, for small fixed tables (invoice line items,
 * a VAT breakdown). Text wraps; there is no sorting, paging or virtualisation — use DataTable for data grids. */

/** A static table. Scrolls sideways inside its own box when it is wider than its container. */
export const Table = React.forwardRef<HTMLTableElement, TableProps>(function Table(props, ref) {
  const { caption, captionHidden, density, className, children, ...rest } = props;
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
      className="aura-tbl-wrap"
      data-density={density}
      tabIndex={scrolls ? 0 : undefined}
      /* A region needs a name: the caption, else the table's aria-label (5.1.1: an unnamed region before). */
      role={scrolls && (caption != null || rest['aria-label']) ? 'region' : undefined}
      aria-labelledby={scrolls && caption != null ? capId : undefined}
      aria-label={scrolls && caption == null ? rest['aria-label'] : undefined}
    >
      <table ref={ref} className={cx('aura-tbl', className)} {...rest}>
        {caption != null ? (
          <caption id={capId} className={cx('aura-tbl__caption', captionHidden && 'aura-sr-only')}>
            {caption}
          </caption>
        ) : null}
        {children}
      </table>
    </div>
  );
});

function section(tag: 'thead' | 'tbody' | 'tfoot', cls: string) {
  const C = React.forwardRef<HTMLTableSectionElement, TableSectionProps>(function TableSection(props, ref) {
    const { className, ...rest } = props;
    return React.createElement(tag, Object.assign({ ref: ref, className: cx(cls, className) }, rest));
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
  const { className, ...rest } = props;
  return <tr ref={ref} className={cx('aura-tbl__row', className)} {...rest} />;
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
  const { align, numeric, mono, className, scope, ...rest } = props;
  return <th ref={ref} scope={scope || 'col'} className={cellClass('aura-tbl__th', props)} {...rest} />;
});

/** Data cell. `numeric` right-aligns with tabular figures (money, counts). */
export const Td = React.forwardRef<HTMLTableCellElement, TableCellProps>(function Td(props, ref) {
  const { align, numeric, mono, className, scope, ...rest } = props;
  return <td ref={ref} className={cellClass('aura-tbl__td', props)} {...rest} />;
});
