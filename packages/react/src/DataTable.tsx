import * as React from 'react';
import { createPortal } from 'react-dom';
import { useStrings, useAuraLocale, useLinkComponent } from './locale.js';
import { cx, omit, useMaybeControlled, compare, useIsoLayoutEffect, useMergedRef } from './internal.js';
import { Icon } from './Icon.js';
import { IconButton } from './IconButton.js';
import { Checkbox } from './Checkbox.js';
import { Menu } from './Menu.js';
import { StatusPill, toneFor, TONE_ORDER } from './StatusPill.js';
import type {
  DataTableColumn,
  DataTableEmpty,
  DataTableProps,
  DataTableSort,
  MenuItem,
  StatusPillProps,
} from './types.js';

type Col = DataTableColumn;
type Row = Record<string, any>;
type RowKey = string | number;
/* A cell to focus after the next render: row, column index, or a column key (after reordering). */
type PendingFocus = { r: number; c?: number | undefined; key?: string | null | undefined };
type MenuState = {
  kind: 'col' | 'picker';
  key: string | null;
  anchor: HTMLElement;
  rc?: { r: number; c: number } | undefined;
};
type DragState = { key: string; over?: string | undefined; after?: boolean | undefined };
const BP: Record<string, number> = { sm: 640, md: 768, lg: 1024, xl: 1280 };

const DEFAULT_COLUMNS: Col[] = [
  { key: 'id', label: 'ID', width: 96, mono: true },
  { key: 'name', label: 'NAME', width: 160 },
  { key: 'status', label: 'STATUS', width: 112, pill: true },
  { key: 'owner', label: 'OWNER' },
];

const SKELETON_WIDTHS = ['72%', '56%', '84%', '44%', '64%'];
/* Width queries before hydration (4.20): each threshold (stackBelow, and up to three distinct hideBelow widths) gets a
 * wrapper whose width is the table's width × Q / threshold, with `container-type: inline-size`. A fixed container
 * query in the stylesheet, `(width < Q px)`, is then true exactly when the table is narrower than the threshold —
 * any threshold, no per-table CSS. The table inside is scaled back to its real width. */
const Q = 10000;
const MAX_HIDE_LEVELS = 3;
/* Narrower than a threshold, exactly as the stylesheet decides it: `(width < 9999.5px)` on a box Q / threshold times the
 * table's width. Sub-pixel layout widths (699.98 for 700) then land on the same side in CSS and here. */
function below(w: number, threshold: number): boolean {
  return w < threshold * (1 - 0.5 / Q);
}
function hidePx(c: Col): number | undefined {
  if (c.hideBelow == null) return undefined;
  const px = typeof c.hideBelow === 'number' ? c.hideBelow : BP[c.hideBelow];
  return px != null && px > 0 ? px : undefined;
}
const ROW_H_DEFAULT = 48,
  OVERSCAN = 8,
  FLEX_MIN = 160;

/** Enterprise data table: 48px rows, hairline dividers, mono header band. */
export const DataTable = React.forwardRef<HTMLDivElement, DataTableProps>(function DataTable(props, ref) {
  const t = useStrings();
  const columns = props.columns || DEFAULT_COLUMNS;
  const byKey: Record<string, Col> = {};
  columns.forEach(function (c: Col) {
    byKey[c.key] = c;
  });
  const rows: Row[] = props.rows || [];
  const rowKey =
    props.rowKey || (columns[0] ? columns[0].key : 'id'); /* columns={[]} rendered nothing but crashed (5.1.1) */
  const manual = !!props.manual;
  const Link = useLinkComponent(props.linkComponent);
  /* busy: a load is under way. manual + rows already shown → keep them (refreshing); otherwise skeleton rows (loading). */
  const busy = !!props.loading;
  const refreshing = busy && manual && rows.length > 0;
  const loading = busy && !refreshing;
  const selectable = !!props.selectable;
  const reorderable = props.reorderable !== false && !!props.columnControls;
  const controls = !!props.columnControls;

  /* With onStateChange, sort and page report through it alone (one callback per click); see emit(). */
  const oneCallback = !!props.onStateChange;
  const sortState = useMaybeControlled<DataTableSort | null>(
    props.sort,
    props.defaultSort || null,
    oneCallback ? null : props.onSortChange,
  );
  const sort = sortState[0],
    setSort = sortState[1];
  const selState = useMaybeControlled<RowKey[]>(props.selected, props.defaultSelected || [], props.onSelectionChange);
  const selected = selState[0],
    setSelected = selState[1];
  const pageState = useMaybeControlled<number>(
    props.page,
    props.defaultPage || 1,
    oneCallback ? null : props.onPageChange,
  );
  const orderState = useMaybeControlled<string[]>(
    props.columnOrder,
    columns.map(function (c: Col) {
      return c.key;
    }),
    props.onColumnOrderChange,
  );
  const hiddenState = useMaybeControlled<string[]>(
    props.hiddenColumns,
    columns
      .filter(function (c: Col) {
        return c.hidden;
      })
      .map(function (c: Col) {
        return c.key;
      }),
    props.onHiddenColumnsChange,
  );
  const pinState = useMaybeControlled<string[]>(
    props.pinnedColumns,
    columns
      .filter(function (c: Col) {
        return c.pinned;
      })
      .map(function (c: Col) {
        return c.key;
      }),
    props.onPinnedColumnsChange,
  );
  const widthState = React.useState<Record<string, number>>({});
  const widths = widthState[0],
    setWidths = widthState[1];
  const activeState = React.useState({ r: 1, c: 0 });
  const scrollState = React.useState(0);
  const scrollTop = scrollState[0],
    setScrollTop = scrollState[1];
  const scrolledX = React.useState(false);
  const menuState = React.useState<MenuState | null>(null);
  const menu = menuState[0],
    setMenu = menuState[1];
  const dragState = React.useState<DragState | null>(null);
  const drag = dragState[0],
    setDrag = dragState[1];
  const gridRef = React.useRef<HTMLDivElement | null>(null);
  const wrapRef = React.useRef<HTMLDivElement | null>(null),
    wrapMerged = useMergedRef(ref, wrapRef);
  /* The table's own width: drives stackBelow (cards) and per-column hideBelow. */
  const boxWidth = React.useState<number | null>(null);
  const measure =
    !!props.stackBelow ||
    columns.some(function (c: Col) {
      return c.hideBelow != null;
    });
  /* The wrapper depth (width-query levels) decides which node is the table: re-measure when it changes (5.0.1). */
  const levelShape =
    (props.stackBelow ? 's' : '') +
    Math.min(
      MAX_HIDE_LEVELS,
      columns.map(hidePx).filter(function (px: number | undefined, i: number, a: Array<number | undefined>) {
        return px != null && a.indexOf(px) === i;
      }).length,
    );
  React.useEffect(
    function () {
      if (!measure || !wrapRef.current || typeof ResizeObserver === 'undefined') return;
      const ro = new ResizeObserver(function (en: ResizeObserverEntry[]) {
        /* Border-box width: the same width the stylesheet's container queries compare (4.20). */
        const bb = en[0].borderBoxSize && en[0].borderBoxSize[0];
        boxWidth[1](bb ? bb.inlineSize : (en[0].target as HTMLElement).getBoundingClientRect().width);
      });
      ro.observe(wrapRef.current);
      return function () {
        ro.disconnect();
      };
    },
    [measure, levelShape],
  );
  const stacked = !!props.stackBelow && boxWidth[0] != null && below(boxWidth[0], props.stackBelow);
  useIsoLayoutEffect(
    function () {
      if (measure && wrapRef.current) boxWidth[1](wrapRef.current.getBoundingClientRect().width);
    },
    [measure, levelShape],
  );
  /* Distinct hideBelow widths, widest first; the first MAX_HIDE_LEVELS also work before hydration (in CSS). */
  const hideLevels: number[] = [];
  columns.forEach(function (c: Col) {
    const px = hidePx(c);
    if (px != null && hideLevels.indexOf(px) < 0) hideLevels.push(px);
  });
  hideLevels.sort(function (a: number, b: number) {
    return b - a;
  });
  hideLevels.length = Math.min(hideLevels.length, MAX_HIDE_LEVELS);
  const levels: Array<{ name: string; px: number }> = [];
  if (props.stackBelow && props.stackBelow > 0) levels.push({ name: 'stack', px: props.stackBelow });
  hideLevels.forEach(function (px: number, i: number) {
    levels.push({ name: 'h' + (i + 1), px: px });
  });
  function hideLevel(c: Col): number | undefined {
    const px = hidePx(c);
    const i = px == null ? -1 : hideLevels.indexOf(px);
    return i < 0 ? undefined : i + 1;
  }
  function tooNarrow(c: Col): boolean {
    if (c.hideBelow == null || boxWidth[0] == null || stacked) return false;
    const px = hidePx(c);
    return px != null && below(boxWidth[0], px);
  }
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  /* Row height comes from CSS (--aura-table-row-height: 48, 40 in compact density, 48 again on touch), so the
   * virtual window always matches what the browser draws. Server render assumes 48. */
  /* Full text of a truncated cell (4.19): shown on hover or keyboard focus when the text is cut off by the ellipsis.
   * aria-hidden — screen readers already read the whole cell. */
  const tipState = React.useState<{ text: string; left: number; top: number } | null>(null),
    tip = tipState[0],
    setTip = tipState[1];
  function showFull(e: React.SyntheticEvent<HTMLElement>) {
    const el = (e.target as HTMLElement).closest
      ? ((e.target as HTMLElement).closest('.aura-table__td') as HTMLElement | null)
      : null;
    if (!el || el.scrollWidth <= el.clientWidth + 1 || el.querySelector('button, input, .aura-pill'))
      return setTip(null);
    const r = el.getBoundingClientRect();
    setTip({ text: (el.textContent || '').trim(), left: r.left, top: r.top });
  }
  function hideFull() {
    setTip(null);
  }
  const tipEl =
    tip && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="aura-tooltip aura-tooltip--above"
            aria-hidden="true"
            style={{ left: tip.left, top: tip.top - 6 }}
          >
            {tip.text}
          </div>,
          document.body,
        )
      : null;
  const rowH = React.useState(ROW_H_DEFAULT);
  const ROW_H = rowH[0];
  useIsoLayoutEffect(function () {
    const el = wrapRef.current;
    if (!el || typeof getComputedStyle === 'undefined') return;
    const v = parseFloat(getComputedStyle(el).getPropertyValue('--aura-table-row-height'));
    if (v > 0 && v !== rowH[0]) rowH[1](v);
  });
  const pending = React.useRef<PendingFocus | null>(null);
  const resizing = React.useRef(false);

  /* Buttons and links inside cells are reached with Enter (APG grid), not Tab: the grid stays one tab stop. */
  useIsoLayoutEffect(function () {
    if (!gridRef.current) return;
    const els = gridRef.current.querySelectorAll<HTMLElement>(
      '.aura-table__td button, .aura-table__td a[href], .aura-table__td input, .aura-table__td select, .aura-table__td textarea, .aura-table__td [tabindex="0"]',
    );
    for (let i = 0; i < els.length; i++) if (els[i].tabIndex !== -1) els[i].tabIndex = -1;
  });
  function widthOf(c: Col): number | undefined {
    return widths[c.key] != null ? widths[c.key] : c.width;
  }

  /* columns: order → hide → pinned first. Only sized columns can pin. */
  const order = orderState[0].filter(function (k: string) {
    return byKey[k];
  });
  columns.forEach(function (c: Col) {
    if (order.indexOf(c.key) < 0) order.push(c.key);
  });
  const hidden = hiddenState[0],
    pinnedKeys = pinState[0];
  const shown = order
    .filter(function (k: string) {
      return hidden.indexOf(k) < 0;
    })
    .map(function (k: string) {
      return byKey[k];
    })
    .filter(function (c: Col) {
      return !tooNarrow(c);
    });
  function isPinned(c: Col): boolean {
    return pinnedKeys.indexOf(c.key) >= 0 && c.width != null;
  }
  const vis = shown.filter(isPinned).concat(
    shown.filter(function (c: Col) {
      return !isPinned(c);
    }),
  );
  const nPinned = vis.filter(isPinned).length;
  /* Card layout (below stackBelow): the first column is the title, the first other pill column sits beside it,
   * `actions` columns go top-right, and the rest become label/value fields. The markup is the same in both layouts. */
  const pillKey = (
    vis.filter(function (c: Col, i: number) {
      return i > 0 && c.pill;
    })[0] || { key: '' }
  ).key;
  function cardPart(c: Col, i: number): 'title' | 'pill' | 'actions' | 'field' {
    return i === 0 ? 'title' : c.key === pillKey ? 'pill' : c.actions ? 'actions' : 'field';
  }
  function cardAttrs(c: Col, i: number): Record<string, string | undefined> {
    const part = cardPart(c, i),
      lv = hideLevel(c);
    return {
      'data-card': part,
      'data-label': part === 'field' ? c.label || undefined : undefined,
      'data-hide': lv ? String(lv) : undefined,
    };
  }
  const hasFields = vis.some(function (c: Col, i: number) {
    return cardPart(c, i) === 'field';
  });
  const hasFlex = vis.some(function (c: Col) {
    return widthOf(c) == null;
  });
  /* Minimum row width. A column that CSS may hide before hydration (hideBelow) counts only while it shows. */
  let fixedSum = 0,
    hideTerms = '';
  vis.forEach(function (c: Col) {
    const w = widthOf(c) != null ? widthOf(c)! : FLEX_MIN,
      lv = hideLevel(c);
    if (lv && boxWidth[0] == null) hideTerms += ' + ' + w + 'px * var(--aura-h' + lv + '-on, 1)';
    else fixedSum += w;
  });
  /* Offsets of pinned columns as CSS terms: before hydration a pinned column that hideBelow hides counts as 0
   * (its * var(--aura-hN-on, 1) term), so the next pinned column doesn't jump (5.2). */
  let pinOffsets: Record<string, string> = {},
    acc = '0px';
  vis.forEach(function (c: Col) {
    if (isPinned(c)) {
      pinOffsets[c.key] = acc;
      const lv = hideLevel(c);
      acc += ' + ' + widthOf(c)! + 'px' + (lv && boxWidth[0] == null ? ' * var(--aura-h' + lv + '-on, 1)' : '');
    }
  });
  const selW = selectable ? ' + var(--aura-table-select-width)' : '';
  const gutterR = controls ? 'var(--aura-space-12)' : 'var(--aura-space-6)';
  const rowMinWidth = 'calc(' + fixedSum + 'px' + hideTerms + ' + var(--aura-space-6) + ' + gutterR + selW + ')';

  /* Sizes go in custom properties, not inline width/flex, so the card layout (4.20, in CSS) can override them. */
  function cellStyle(c: Col, i: number): React.CSSProperties {
    const w = widthOf(c),
      s: Record<string, string> = {};
    if (w == null) {
      s['--aura-cell-flex'] = '1 1 0';
      s['--aura-cell-min'] = (c.minWidth || FLEX_MIN) + 'px';
    } else {
      s['--aura-cell-flex'] = !hasFlex && i === vis.length - 1 ? '1 0 auto' : 'none';
      s['--aura-cell-w'] = w + 'px';
    }
    if (isPinned(c)) s['--aura-cell-left'] = 'calc(var(--aura-space-6)' + selW + ' + ' + pinOffsets[c.key] + ')';
    return s as React.CSSProperties;
  }

  /* sort (memoised: thousands of rows). 5.1.1: also re-sorts when the sort column's sortValue / pill / tones change. */
  const sortCol = sort && sort.key ? byKey[sort.key] : undefined;
  const view = React.useMemo(
    function () {
      if (manual || !sort || !sort.key || !byKey[sort.key]) return rows;
      const col = byKey[sort.key];
      const val =
        col.sortValue ||
        (col.pill
          ? function (r: Row) {
              return TONE_ORDER[(col.tones && col.tones[r[col.key]]) || toneFor(r[col.key])];
            }
          : function (r: Row) {
              return r[col.key];
            });
      const dir = sort.dir === 'desc' ? -1 : 1;
      return rows
        .map(function (r: Row, i: number): [Row, number] {
          return [r, i];
        })
        .sort(function (a: [Row, number], b: [Row, number]) {
          return compare(val(a[0]), val(b[0])) * dir || a[1] - b[1];
        })
        .map(function (p: [Row, number]) {
          return p[0];
        });
    },
    [
      rows,
      manual,
      sort && sort.key,
      sort && sort.dir,
      !!sortCol,
      sortCol && sortCol.sortValue,
      sortCol && sortCol.pill,
      sortCol && sortCol.tones,
    ],
  );
  function nextSort(key: string): DataTableSort | null {
    if (!sort || sort.key !== key) return { key: key, dir: 'asc' };
    if (sort.dir === 'asc') return { key: key, dir: 'desc' };
    return null;
  }

  /* page */
  const pageSize = props.pageSize || 0;
  /* manual: the server pages. Without totalRows, assume one more page while a page comes back full. */
  const total = manual
    ? props.totalRows != null
      ? props.totalRows
      : (Math.max(1, pageState[0] || 1) - 1) * pageSize + rows.length + (pageSize && rows.length >= pageSize ? 1 : 0)
    : view.length;
  /* Without totalRows the requested page is never clamped: an empty page past the end stays that page, with the
   * pager to go back (5.1.1). */
  const pageCount = pageSize
    ? Math.max(1, Math.ceil(total / pageSize), manual && props.totalRows == null ? pageState[0] || 1 : 1)
    : 1;
  const page = Math.min(Math.max(1, pageState[0] || 1), pageCount);
  const first = pageSize ? (page - 1) * pageSize : 0;
  const pageRows = pageSize && !manual ? view.slice(first, first + pageSize) : view;
  const canSortAny = !busy && (manual ? total > 1 : rows.length > 1);
  const shownTotal = manual && props.totalRows == null ? first + rows.length : total;
  /* The page count shrank under the page being shown (a filter left one page, totalRows dropped): report the
   * clamped page, so the app's page state and URL match the screen (5.2). Only a shrink counts — a page restored
   * from the URL while rows are still loading (count 1 at first) is kept. */
  const prevCount = React.useRef(pageCount);
  React.useEffect(
    function () {
      if (busy) return; /* compare settled counts only: a refetch's empty rows are not a shrink */
      const before = prevCount.current;
      prevCount.current = pageCount;
      const asked = pageState[0] || 1;
      if (asked === page || pageCount >= before || asked > before) return;
      if (props.getPageHref && !props.onPageChange && !props.onStateChange) return;
      pageState[1](page);
      emit(sort, page);
    },
    [pageState[0], page, busy, pageCount],
  );
  /* Pager links (getPageHref) with no onPageChange: the URL is the page state, so keyboard paging follows the link. */
  const linkPaging = !!props.getPageHref && !props.onPageChange && !oneCallback;
  const prevLink = React.useRef<HTMLElement | null>(null),
    nextLink = React.useRef<HTMLElement | null>(null),
    jumpLink = React.useRef<HTMLElement | null>(null);
  /* A page that isn't next to this one (sorting from page 3 back to 1): render its link, then follow it (5.1.1). */
  const jumpState = React.useState<number | null>(null);
  React.useEffect(
    function () {
      if (jumpState[0] == null) return;
      if (jumpLink.current) jumpLink.current.click();
      jumpState[1](null);
    },
    [jumpState[0]],
  );
  function emit(s: DataTableSort | null, p: number) {
    if (props.onStateChange) props.onStateChange({ sort: s, page: p });
  }
  function goPage(p: number, focus?: PendingFocus, quiet?: boolean): boolean {
    const next = Math.min(Math.max(1, p), pageCount);
    if (next === page) return false;
    if (!quiet) emit(sort, next);
    if (linkPaging) {
      const a = next === page - 1 ? prevLink.current : next === page + 1 ? nextLink.current : null;
      if (a) a.click();
      else jumpState[1](next);
      return false;
    }
    if (focus) pending.current = focus;
    pageState[1](next);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    return true;
  }
  function sortBy(key: string) {
    applySort(nextSort(key));
  }
  /* A new sort starts at page 1: one onStateChange carrying both, or onSortChange then onPageChange(1). */
  function applySort(s: DataTableSort | null) {
    setSort(s);
    if (!(manual && linkPaging)) goPage(1, undefined, true);
    emit(s, 1);
  }
  /* Row links: the first column's content is the link; a click or Enter elsewhere on the row follows it. */
  const rowHref = props.getRowHref;
  function followRow(el: HTMLElement | null, e?: React.MouseEvent | React.KeyboardEvent) {
    const a = el && el.querySelector<HTMLElement>('.aura-table__row-link');
    if (!a) return;
    a.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
        ctrlKey: !!(e && e.ctrlKey),
        metaKey: !!(e && e.metaKey),
        shiftKey: !!(e && e.shiftKey),
        altKey: !!(e && e.altKey),
      }),
    );
  }
  function rowLinkWrap(r: Row, content: React.ReactNode): React.ReactNode {
    return rowHref ? (
      <Link href={rowHref(r)} className="aura-table__row-link">
        {content}
      </Link>
    ) : (
      content
    );
  }

  /* virtual window */
  const height = props.height || 0;
  /* Cards have their own heights, so a stacked table renders every row of the page. */
  const virtual = !!height && !loading && pageRows.length > 0 && !stacked;
  /* A sticky totals row covers the bottom of the scroll area: keep focused rows above it (5.1.1). */
  const stickyTotal = !!(props.footer && props.stickyFooter && rows.length && !loading);
  const bodyH = Math.max(ROW_H, height - ROW_H - (stickyTotal ? ROW_H : 0));
  let start = 0,
    end = pageRows.length;
  if (virtual) {
    start = Math.max(0, Math.floor(scrollTop / ROW_H) - OVERSCAN);
    end = Math.min(pageRows.length, Math.ceil((scrollTop + bodyH) / ROW_H) + OVERSCAN);
  }
  const visibleRows = Math.max(1, Math.floor(bodyH / ROW_H));

  /* grid geometry: r 0 = header, 1..N = rows; c 0.. = [select?] + vis */
  const nCols = vis.length + (selectable ? 1 : 0);
  const nRows = loading ? 0 : pageRows.length;
  /* The totals row is grid row nRows + 1 (5.2): arrow keys reach it, so screen readers in grid mode hear it. */
  const hasTotal = !!(props.footer && rows.length && !loading),
    T = nRows + 1,
    lastR = nRows + (hasTotal ? 1 : 0);
  const active = activeState[0];
  const ar = Math.min(active.r, lastR),
    ac = Math.min(active.c, nCols - 1);
  const activeRendered = ar === 0 || (hasTotal && ar === T) || (ar - 1 >= start && ar - 1 < end);
  function colAt(ci: number): Col | null {
    return selectable ? (ci === 0 ? null : vis[ci - 1]) : vis[ci];
  }
  function tabFor(r: number, c: number): number {
    if (!activeRendered) return r === 0 && c === ac ? 0 : -1;
    return r === ar && c === ac ? 0 : -1;
  }

  React.useEffect(function () {
    const p = pending.current;
    if (!p || !gridRef.current) return;
    let c = p.c;
    if (p.key) {
      let at = -1;
      vis.forEach(function (x: Col, i: number) {
        if (x.key === p!.key) at = i;
      });
      c = at >= 0 ? at + (selectable ? 1 : 0) : Math.min(p.c || 0, nCols - 1);
    }
    /* 5.1.1: only if focus is still in the table (or nowhere): the person may have moved on while a page loaded. */
    const ae = document.activeElement;
    if (ae && ae !== document.body && !gridRef.current.contains(ae)) {
      pending.current = null;
      return;
    }
    const el = gridRef.current.querySelector<HTMLElement>('[data-rc="' + p.r + ':' + c + '"]');
    if (el) {
      pending.current = null;
      el.focus();
    }
  });
  function focusCell(r: number, c: number) {
    r = Math.max(0, Math.min(r, lastR));
    c = Math.max(0, Math.min(c, nCols - 1));
    /* Cards: the header row is for screen readers only, except the select-all box. Keep focus on the cards. */
    if (stacked && r === 0 && nRows > 0 && !(selectable && c === 0)) r = 1;
    /* A cell the layout hides (a blank totals cell in the card layout) is skipped for the nearest shown one in the row
     * (5.2), so the grid never parks its tab stop on something invisible. */
    if (gridRef.current && r === T && hasTotal) {
      const shown = function (cc: number) {
        const e = gridRef.current!.querySelector<HTMLElement>('[data-rc="' + r + ':' + cc + '"]');
        return !!e && e.getClientRects().length > 0;
      };
      if (!shown(c))
        for (let d = 1; d < nCols; d++) {
          if (c + d < nCols && shown(c + d)) {
            c = c + d;
            break;
          }
          if (c - d >= 0 && shown(c - d)) {
            c = c - d;
            break;
          }
        }
    }
    activeState[1]({ r: r, c: c });
    pending.current = { r: r, c: c };
    if (virtual && hasTotal && r === T && !props.stickyFooter) {
      const sc = scrollRef.current!;
      sc.scrollTop = sc.scrollHeight;
      setScrollTop(sc.scrollTop);
    } else if (virtual && r > 0 && r <= nRows) {
      const sc = scrollRef.current!,
        top = (r - 1) * ROW_H;
      if (top < sc.scrollTop) sc.scrollTop = top;
      else if (top + ROW_H > sc.scrollTop + bodyH) sc.scrollTop = top + ROW_H - bodyH;
      setScrollTop(sc.scrollTop);
    }
    const el = gridRef.current && gridRef.current.querySelector<HTMLElement>('[data-rc="' + r + ':' + c + '"]');
    if (el) {
      pending.current = null;
      el.focus();
    }
  }

  /* select */
  const pageKeys = pageRows.map(function (r: Row): RowKey {
    return r[rowKey];
  });
  const selSet: Record<string, boolean> = {};
  selected.forEach(function (k: RowKey) {
    selSet[String(k)] = true;
  });
  const nSel = pageKeys.filter(function (k: RowKey) {
    return selSet[String(k)];
  }).length;
  const all = nSel > 0 && nSel === pageKeys.length;
  function toggle(k: RowKey, on: boolean) {
    setSelected(
      on
        ? selected.concat([k])
        : selected.filter(function (x: RowKey) {
            return String(x) !== String(k); /* '1' from a URL and 1 from the data are the same row (5.1.1) */
          }),
    );
  }
  function toggleAll() {
    setSelected(
      all
        ? selected.filter(function (k: RowKey) {
            return !pageKeys.some(function (p: RowKey) {
              return String(p) === String(k);
            });
          })
        : selected.concat(
            pageKeys.filter(function (k: RowKey) {
              return !selSet[String(k)];
            }),
          ),
    );
  }

  /* resize */
  function canResize(c: Col): boolean {
    return !!props.resizable && c.resizable !== false && c.width != null;
  }
  function clampW(c: Col, w: number): number {
    return Math.round(Math.min(c.maxWidth || 480, Math.max(c.minWidth || 64, w)));
  }
  function setW(c: Col, w: number, done?: boolean) {
    const nw = clampW(c, w);
    setWidths(function (prev: Record<string, number>) {
      const o = Object.assign({}, prev);
      o[c.key] = nw;
      return o;
    });
    if (done && props.onColumnResize) props.onColumnResize(c.key, nw);
  }
  function startResize(c: Col, e: React.PointerEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();
    resizing.current = true;
    let x0 = e.clientX,
      w0 = widthOf(c) as number,
      last = w0;
    const el = e.currentTarget;
    el.classList.add('is-dragging');
    document.body.style.cursor = 'col-resize';
    function move(ev: PointerEvent) {
      last = clampW(c, w0 + ev.clientX - x0);
      setW(c, last);
    }
    function up() {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      el.classList.remove('is-dragging');
      document.body.style.cursor = '';
      setTimeout(function () {
        resizing.current = false;
      }, 0);
      if (props.onColumnResize) props.onColumnResize(c.key, last);
    }
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  /* reorder / pin / hide */
  function moveCol(key: string, delta: number): boolean {
    const c = byKey[key],
      group = vis.filter(function (x: Col) {
        return isPinned(x) === isPinned(c);
      });
    const gi = group.indexOf(c),
      target = group[gi + delta];
    if (!target) return false;
    const o = order.slice(),
      from = o.indexOf(key),
      to = o.indexOf(target.key);
    o.splice(from, 1);
    o.splice(to, 0, key);
    orderState[1](o);
    return true;
  }
  function dropCol(key: string, targetKey: string, after?: boolean) {
    if (key === targetKey) return;
    const a = byKey[key],
      b = byKey[targetKey];
    if (isPinned(a) !== isPinned(b)) return;
    const o = order.slice();
    o.splice(o.indexOf(key), 1);
    const to = o.indexOf(targetKey) + (after ? 1 : 0);
    o.splice(to, 0, key);
    orderState[1](o);
  }
  function togglePin(key: string) {
    pinState[1](
      pinnedKeys.indexOf(key) >= 0
        ? pinnedKeys.filter(function (k: string) {
            return k !== key;
          })
        : pinnedKeys.concat([key]),
    );
  }
  function setHidden(key: string, hide: boolean) {
    if (hide && shown.length <= 1) return;
    hiddenState[1](
      hide
        ? hidden.concat([key])
        : hidden.filter(function (k: string) {
            return k !== key;
          }),
    );
  }
  function resetColumns() {
    orderState[1](
      columns.map(function (c: Col) {
        return c.key;
      }),
    );
    hiddenState[1](
      columns
        .filter(function (c: Col) {
          return c.hidden;
        })
        .map(function (c: Col) {
          return c.key;
        }),
    );
    pinState[1](
      columns
        .filter(function (c: Col) {
          return c.pinned;
        })
        .map(function (c: Col) {
          return c.key;
        }),
    );
    setWidths({});
  }

  function columnMenuItems(c: Col): MenuItem[] {
    const group = vis.filter(function (x: Col) {
        return isPinned(x) === isPinned(c);
      }),
      gi = group.indexOf(c);
    const items: MenuItem[] = [];
    if (c.sortable)
      items.push(
        {
          label: t.sortAsc,
          icon: 'arrow-up',
          onSelect: function () {
            applySort({ key: c.key, dir: 'asc' });
          },
        },
        {
          label: t.sortDesc,
          icon: 'arrow-down',
          onSelect: function () {
            applySort({ key: c.key, dir: 'desc' });
          },
        },
        { separator: true },
      );
    if (c.width != null)
      items.push({
        label: isPinned(c) ? t.unpin : t.pin,
        icon: isPinned(c) ? 'pin-off' : 'pin',
        onSelect: function () {
          togglePin(c.key);
        },
      });
    if (reorderable)
      items.push(
        {
          label: t.moveLeft,
          icon: 'arrow-left',
          disabled: gi <= 0,
          onSelect: function () {
            moveCol(c.key, -1);
          },
        },
        {
          label: t.moveRight,
          icon: 'arrow-right',
          disabled: gi >= group.length - 1,
          onSelect: function () {
            moveCol(c.key, 1);
          },
        },
      );
    items.push(
      { separator: true },
      {
        label: t.hideColumn,
        icon: 'eye-off',
        disabled: shown.length <= 1,
        onSelect: function () {
          setHidden(c.key, true);
        },
      },
    );
    return items;
  }
  function pickerItems(): MenuItem[] {
    return order
      .map(function (k: string): MenuItem {
        const c = byKey[k],
          on = hidden.indexOf(k) < 0;
        return {
          label: c.label || (c.actions ? t.actions : c.key),
          checked: on,
          keepOpen: true,
          disabled: on && shown.length <= 1,
          onSelect: function () {
            setHidden(k, on);
          },
        };
      })
      .concat([{ separator: true }, { label: t.resetColumns, icon: 'rotate-ccw', onSelect: resetColumns }]);
  }
  function openMenu(kind: MenuState['kind'], key: string | null, anchor: HTMLElement, rc?: MenuState['rc']) {
    setMenu({ kind: kind, key: key, anchor: anchor, rc: rc });
  }
  function closeMenu(restore: boolean) {
    const m = menu;
    setMenu(null);
    if (restore && m) {
      if (m.kind === 'col') pending.current = { r: 0, key: m.key, c: m.rc ? m.rc.c : 0 };
      else if (m.anchor) m.anchor.focus();
    }
  }

  /* keyboard: the grid is one tab stop; arrows move a cell at a time */
  function onGridKey(e: React.KeyboardEvent) {
    const target = e.target as HTMLElement;
    if (!gridRef.current || !gridRef.current.contains(target)) return;
    const rc = target.getAttribute && target.getAttribute('data-rc');
    if (!rc) {
      /* Escape from a control inside a cell (row-action button, link) goes back to the cell. */
      const cell = e.key === 'Escape' && target.closest && target.closest<HTMLElement>('[data-rc]');
      if (cell) {
        e.preventDefault();
        cell.focus();
      }
      return;
    }
    const p = rc.split(':'),
      r = +p[0],
      c = +p[1],
      k = e.key,
      col = colAt(c);
    const row = r > 0 && r <= nRows ? pageRows[r - 1] : null,
      isTotal = hasTotal && r === T;
    let handled = true;
    if (r === 0 && col && e.altKey && (k === 'ArrowLeft' || k === 'ArrowRight') && canResize(col))
      setW(col, widthOf(col)! + (k === 'ArrowLeft' ? -1 : 1) * (e.shiftKey ? 48 : 16), true);
    else if (r === 0 && col && e.ctrlKey && e.shiftKey && (k === 'ArrowLeft' || k === 'ArrowRight') && reorderable) {
      if (moveCol(col.key, k === 'ArrowLeft' ? -1 : 1)) pending.current = { r: 0, key: col.key, c: c };
    } else if (
      r === 0 &&
      col &&
      ((e.altKey && k === 'ArrowDown') || k === 'ContextMenu' || (e.shiftKey && k === 'F10')) &&
      controls
    )
      openMenu('col', col.key, target, { r: 0, c: c });
    else if (k === 'ArrowRight') focusCell(r, c + 1);
    else if (k === 'ArrowLeft') focusCell(r, c - 1);
    else if (k === 'ArrowDown') {
      if (r < lastR) focusCell(r + 1, c);
      else if (pageSize && page < pageCount && goPage(page + 1, { r: 1, c: c })) activeState[1]({ r: 1, c: c });
    } else if (k === 'ArrowUp') {
      if (r > 1 || (r === 1 && !(pageSize && page > 1))) focusCell(r - 1, c);
      else if (r === 1 && goPage(page - 1, { r: pageSize, c: c })) activeState[1]({ r: pageSize, c: c });
    } else if (k === 'Home') focusCell(e.ctrlKey ? 1 : r, 0);
    else if (k === 'End') focusCell(e.ctrlKey ? lastR : r, nCols - 1);
    else if (k === 'PageDown') {
      if (pageSize) {
        if (goPage(page + 1, { r: 1, c: c })) activeState[1]({ r: 1, c: c });
      } else focusCell(Math.min(lastR, r + visibleRows), c);
    } else if (k === 'PageUp') {
      if (pageSize) {
        if (goPage(page - 1, { r: 1, c: c })) activeState[1]({ r: 1, c: c });
      } else focusCell(Math.max(1, r - visibleRows), c);
    } else if (isTotal && (k === ' ' || k === 'Enter' || k === 'F2')) {
      handled = false;
    } else if (k === 'F2' && r > 0) {
      /* F2 (like Enter) moves into a control inside the cell; Escape brings focus back to the cell. */
      const inner = target.querySelector<HTMLElement>('button, a[href], input, select, textarea');
      if (inner) inner.focus();
      else handled = false;
    } else if (k === ' ' || k === 'Enter') {
      if (r === 0 && !col && selectable && nRows) toggleAll();
      else if (r === 0 && col && col.sortable && canSortAny) sortBy(col.key);
      else if (r > 0 && k === ' ' && selectable) toggle(row![rowKey], !selSet[row![rowKey]]);
      else if (
        r > 0 &&
        k === 'Enter' &&
        rowHref &&
        !target.querySelector('button, a[href]:not(.aura-table__row-link), input, select, textarea')
      )
        followRow(target.closest<HTMLElement>('[role="row"]'), e);
      else if (r > 0 && k === 'Enter' && target.querySelector('button, a[href], input, select, textarea'))
        target.querySelector<HTMLElement>('button, a[href], input, select, textarea')!.focus();
      else if (r > 0 && k === 'Enter' && props.onRowActivate) props.onRowActivate(row!);
      else handled = false;
    } else handled = false;
    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  /* header */
  const head: React.ReactElement[] = [<span key="__gl" className="aura-table__gutter" aria-hidden={true} />];
  if (selectable)
    head.push(
      <span
        key="__sel"
        role="columnheader"
        aria-colindex={1}
        className={cx('aura-table__sel', nPinned && 'is-pinned')}
        tabIndex={tabFor(0, 0)}
        data-rc="0:0"
        aria-label={t.selectRows}
        onFocus={function () {
          activeState[1]({ r: 0, c: 0 });
        }}
      >
        {nRows ? (
          <Checkbox
            hideLabel
            checked={all}
            indeterminate={nSel > 0 && !all}
            tabIndex={-1}
            label={all ? t.deselectAllRows : t.selectAllRows}
            onChange={toggleAll}
          />
        ) : null}
        {/* Shown only in the card layout, beside the select-all box. */}
        {nRows ? (
          <span className="aura-table__sel-text">{nSel ? t.selectedCount(nSel) : t.selectAll}</span>
        ) : (
          <span className="aura-sr-only">{t.selectRows}</span>
        )}
      </span>,
    );
  vis.forEach(function (c: Col, i: number) {
    const ci = i + (selectable ? 1 : 0);
    const isSorted = sort && sort.key === c.key;
    const canSort = c.sortable && canSortAny;
    const ariaSort: React.AriaAttributes['aria-sort'] =
      isSorted && canSort ? (sort!.dir === 'desc' ? 'descending' : 'ascending') : canSort ? 'none' : undefined;
    const pin = isPinned(c),
      edge = pin && i === nPinned - 1;
    head.push(
      <span
        key={c.key}
        role="columnheader"
        aria-sort={ariaSort}
        aria-colindex={ci + 1}
        style={cellStyle(c, i)}
        data-hide={hideLevel(c) ? String(hideLevel(c)) : undefined}
        tabIndex={tabFor(0, ci)}
        data-rc={'0:' + ci}
        className={cx(
          'aura-table__th',
          c.align === 'end' && 'is-end',
          pin && 'is-pinned',
          edge && 'is-pin-edge',
          drag && drag.over === c.key && (drag.after ? 'is-drop-after' : 'is-drop-before'),
          drag && drag.key === c.key && 'is-dragging',
        )}
        draggable={reorderable && !busy ? true : undefined}
        onFocus={function (e: React.FocusEvent) {
          if (e.target === e.currentTarget) activeState[1]({ r: 0, c: ci });
        }}
        onDragStart={function (e: React.DragEvent) {
          if (resizing.current) {
            e.preventDefault();
            return;
          }
          e.dataTransfer.effectAllowed = 'move';
          try {
            e.dataTransfer.setData('text/plain', c.key);
          } catch (x) {}
          setDrag({ key: c.key });
        }}
        onDragOver={function (e: React.DragEvent<HTMLElement>) {
          if (!drag || drag.key === c.key || isPinned(byKey[drag.key]) !== pin) return;
          e.preventDefault();
          const b = e.currentTarget.getBoundingClientRect(),
            after = e.clientX > b.left + b.width / 2;
          if (drag.over !== c.key || drag.after !== after) setDrag({ key: drag.key, over: c.key, after: after });
        }}
        onDrop={function (e: React.DragEvent) {
          e.preventDefault();
          if (drag && drag.over) dropCol(drag.key, drag.over, drag.after);
          setDrag(null);
        }}
        onDragEnd={function () {
          setDrag(null);
        }}
      >
        <span className="aura-table__th-inner">
          {canSort ? (
            <button
              type="button"
              tabIndex={-1}
              className={cx('aura-table__sort', isSorted && 'is-active')}
              onClick={function () {
                sortBy(c.key);
                activeState[1]({ r: 0, c: ci });
              }}
            >
              {c.label}
              <Icon name={isSorted ? (sort!.dir === 'desc' ? 'arrow-down' : 'arrow-up') : 'arrow-up-down'} size={12} />
            </button>
          ) : (
            <span className={cx('aura-table__th-label', !c.label && 'aura-sr-only')}>
              {c.label || (c.actions ? t.actions : c.key)}
            </span>
          )}
          {pin ? <Icon name="pin" size={12} className="aura-table__pin-icon" label={t.pinned} /> : null}
          {controls ? (
            <button
              type="button"
              tabIndex={-1}
              className="aura-table__menu-btn"
              aria-label={t.columnOptions(c.label)}
              aria-haspopup="menu"
              aria-expanded={menu && menu.key === c.key ? true : undefined}
              onClick={function (e: React.MouseEvent<HTMLButtonElement>) {
                e.stopPropagation();
                openMenu('col', c.key, e.currentTarget, { r: 0, c: ci });
              }}
            >
              <Icon name="ellipsis" />
            </button>
          ) : null}
        </span>
        {canResize(c) ? (
          <span
            className="aura-table__resize"
            role="separator"
            aria-orientation="vertical"
            aria-hidden={true}
            onPointerDown={function (e: React.PointerEvent<HTMLElement>) {
              startResize(c, e);
            }}
            onClick={function (e: React.MouseEvent) {
              e.stopPropagation();
            }}
            onDoubleClick={function () {
              setW(c, c.width as number, true);
            }}
          />
        ) : null}
      </span>,
    );
  });
  head.push(
    <span
      key="__gr"
      className={cx('aura-table__gutter aura-table__gutter--end', controls && 'has-picker')}
      aria-hidden={true}
    />,
  );

  /* body */
  function cellContent(c: Col, r: Row): React.ReactNode {
    const v = r[c.key];
    return c.render ? (
      c.render(r)
    ) : c.pill ? (
      <StatusPill {...({ tone: c.tones && c.tones[v] } as StatusPillProps)}>{v}</StatusPill>
    ) : (
      v
    );
  }
  function rowCells(r: Row, i: number, k: RowKey, isSel: boolean): React.ReactElement[] {
    const ri = i + 1;
    const cells: React.ReactElement[] = [<span key="__gl" className="aura-table__gutter" aria-hidden={true} />];
    if (selectable)
      cells.push(
        <span
          key="__sel"
          role="gridcell"
          aria-colindex={1}
          className={cx('aura-table__sel', nPinned && 'is-pinned')}
          tabIndex={tabFor(ri, 0)}
          data-rc={ri + ':0'}
          aria-label={t.selectRow(k)}
          onFocus={function (e: React.FocusEvent) {
            if (e.target === e.currentTarget) activeState[1]({ r: ri, c: 0 });
          }}
        >
          <Checkbox
            hideLabel
            checked={isSel}
            tabIndex={-1}
            label={t.selectRow(k)}
            onChange={function (on: boolean) {
              toggle(k, on);
            }}
          />
        </span>,
      );
    vis.forEach(function (c: Col, j: number) {
      const ci = j + (selectable ? 1 : 0),
        v = r[c.key],
        pin = isPinned(c);
      cells.push(
        <span
          key={c.key}
          role="gridcell"
          aria-colindex={ci + 1}
          tabIndex={tabFor(ri, ci)}
          data-rc={ri + ':' + ci}
          className={cx(
            'aura-table__td',
            c.mono && 'aura-table__mono',
            c.align === 'end' && 'is-end',
            pin && 'is-pinned',
            pin && j === nPinned - 1 && 'is-pin-edge',
          )}
          style={cellStyle(c, j)}
          {...cardAttrs(c, j)}
          onFocus={function () {
            if (activeState[0].r !== ri || activeState[0].c !== ci) activeState[1]({ r: ri, c: ci });
          }}
        >
          {j === 0 ? rowLinkWrap(r, cellContent(c, r)) : cellContent(c, r)}
        </span>,
      );
    });
    if (hasFields) cells.push(<span key="__br" className="aura-table__break" aria-hidden={true} />);
    cells.push(
      <span
        key="__gr"
        className={cx('aura-table__gutter aura-table__gutter--end', controls && 'has-picker')}
        aria-hidden={true}
      />,
    );
    return cells;
  }

  let body: React.ReactNode;
  const rowStyle = { ['--aura-row-min' as string]: rowMinWidth } as React.CSSProperties;
  if (loading) {
    const n = pageSize || props.skeletonRows || 5;
    const skRows: React.ReactElement[] = (body = []);
    for (let i = 0; i < n; i++) {
      const sk: React.ReactElement[] = [<span key="__gl" className="aura-table__gutter" />];
      if (selectable)
        sk.push(
          <span key="__sel" className={cx('aura-table__sel', nPinned && 'is-pinned')}>
            <span className="aura-skel aura-skel--box" />
          </span>,
        );
      vis.forEach(function (c: Col, j: number) {
        sk.push(
          <span
            key={c.key}
            className={cx('aura-table__td', c.align === 'end' && 'is-end', isPinned(c) && 'is-pinned')}
            style={cellStyle(c, j)}
            {...cardAttrs(c, j)}
            data-label={undefined}
          >
            <span
              className={cx('aura-skel', c.pill && 'aura-skel--pill')}
              style={c.pill ? undefined : { width: SKELETON_WIDTHS[(i + j) % SKELETON_WIDTHS.length] }}
            />
          </span>,
        );
      });
      if (hasFields) sk.push(<span key="__br" className="aura-table__break" />);
      sk.push(
        <span key="__gr" className={cx('aura-table__gutter aura-table__gutter--end', controls && 'has-picker')} />,
      );
      skRows.push(
        <div key={'sk' + i} className="aura-table__row aura-table__row--skeleton" aria-hidden={true} style={rowStyle}>
          {sk}
        </div>,
      );
    }
  } else if (!rows.length) {
    const em: DataTableEmpty = props.empty || {};
    body = (
      <div className="aura-table__empty" role="row">
        <div role="gridcell">
          <span className="aura-table__empty-icon">
            <Icon name={em.icon || 'inbox'} size="lg" />
          </span>
          <p className="aura-table__empty-title">{em.title || t.empty}</p>
          {em.description ? <p className="aura-table__empty-text">{em.description}</p> : null}
          {em.action ? <div className="aura-table__empty-action">{em.action}</div> : null}
        </div>
      </div>
    );
  } else {
    const bodyRows: React.ReactElement[] = (body = []);
    if (virtual && start > 0)
      bodyRows.push(
        <div key="__top" className="aura-table__spacer" style={{ height: start * ROW_H + 'px' }} aria-hidden={true} />,
      );
    for (let ri = start; ri < end; ri++) {
      (function (r: Row, i: number) {
        const k = r[rowKey],
          isSel = !!selSet[k];
        bodyRows.push(
          <div
            key={k}
            role="row"
            aria-rowindex={first + i + 2}
            aria-selected={selectable ? isSel : undefined}
            className={cx(
              'aura-table__row',
              isSel && 'is-selected',
              (props.onRowActivate || rowHref) && 'is-actionable',
            )}
            style={rowStyle}
            onClick={function (e: React.MouseEvent<HTMLElement>) {
              const el = e.target as HTMLElement;
              if (el.closest && el.closest('.aura-check, button, a, input')) return;
              if (rowHref) followRow(e.currentTarget, e);
              else if (props.onRowActivate) props.onRowActivate(r);
            }}
          >
            {rowCells(r, i, k, isSel)}
          </div>,
        );
      })(pageRows[ri], ri);
    }
    if (virtual && end < pageRows.length)
      bodyRows.push(
        <div
          key="__bot"
          className="aura-table__spacer"
          style={{ height: (pageRows.length - end) * ROW_H + 'px' }}
          aria-hidden={true}
        />,
      );
  }

  /* footer */
  let foot: React.ReactElement | null = null;
  function pagerButton(dir: -1 | 1): React.ReactElement {
    const p = page + dir,
      off = busy || (dir < 0 ? page <= 1 : page >= pageCount),
      label = dir < 0 ? t.prevPage : t.nextPage,
      icon = dir < 0 ? 'chevron-left' : 'chevron-right';
    if (props.getPageHref && !off)
      return (
        <Link
          ref={dir < 0 ? prevLink : nextLink}
          href={props.getPageHref(p)}
          className="aura-icon-btn"
          aria-label={label}
          onClick={function (e: React.MouseEvent) {
            if (props.onPageChange || oneCallback) {
              e.preventDefault();
              pageState[1](p);
              emit(sort, p);
            }
          }}
        >
          <Icon name={icon} />
        </Link>
      );
    return (
      <IconButton
        icon={icon}
        label={label}
        disabled={off}
        onClick={function () {
          goPage(p);
        }}
      />
    );
  }
  /* 5.1.1: an empty later page (a server page past the end) keeps the pager, so there is a way back. */
  /* Without totalRows, while pages come back full there may be more: don't state a total (5.2). */
  const openTotal = manual && props.totalRows == null && !!pageSize && rows.length >= pageSize;
  if (pageSize && (rows.length || busy || page > 1)) {
    const from = rows.length ? first + 1 : 0,
      to = manual ? first + rows.length : Math.min(first + pageSize, view.length);
    foot = (
      <div className="aura-table__foot">
        <span aria-live="polite">
          {busy ? t.loading : openTotal ? t.rangeOpen(from, to) : t.range(from, to, shownTotal)}
        </span>
        <span className="aura-table__pager">
          <span>{openTotal ? t.pageOpen(page) : t.page(page, pageCount)}</span>
          {pagerButton(-1)}
          {pagerButton(1)}
        </span>
      </div>
    );
  } else if (height && rows.length && !loading) {
    foot = (
      <div className="aura-table__foot">
        <span>{t.rowCount(shownTotal)}</span>
        {selectable && selected.length ? <span>{t.selectedCount(selected.length)}</span> : <span />}
      </div>
    );
  }

  /* Totals row (4.19): the body's widths and alignment, after the last row; sticky with stickyFooter. */
  const totalRow =
    props.footer && rows.length && !loading ? (
      <div
        role="row"
        aria-rowindex={shownTotal + 2}
        aria-label={t.totals}
        className={cx('aura-table__row aura-table__total', props.stickyFooter && 'is-sticky')}
        style={rowStyle}
      >
        <span className="aura-table__gutter" aria-hidden={true} />
        {selectable ? (
          <span
            role="gridcell"
            aria-colindex={1}
            className={cx('aura-table__sel', nPinned && 'is-pinned')}
            tabIndex={tabFor(T, 0)}
            data-rc={T + ':0'}
            onFocus={function () {
              activeState[1]({ r: T, c: 0 });
            }}
          />
        ) : null}
        {vis.map(function (c: Col, j: number) {
          const pin = isPinned(c),
            ci = j + (selectable ? 1 : 0);
          return (
            <span
              key={c.key}
              role="gridcell"
              aria-colindex={j + (selectable ? 2 : 1)}
              tabIndex={tabFor(T, ci)}
              data-rc={T + ':' + ci}
              onFocus={function () {
                if (activeState[0].r !== T || activeState[0].c !== ci) activeState[1]({ r: T, c: ci });
              }}
              className={cx(
                'aura-table__td',
                c.mono && 'aura-table__mono',
                c.align === 'end' && 'is-end',
                pin && 'is-pinned',
                pin && j === nPinned - 1 && 'is-pin-edge',
                props.footer![c.key] == null && 'is-blank',
              )}
              style={cellStyle(c, j)}
              {...cardAttrs(c, j)}
              data-label={j === 0 ? undefined : c.label || t.totals}
            >
              {props.footer![c.key]}
            </span>
          );
        })}
        {hasFields ? <span className="aura-table__break" aria-hidden={true} /> : null}
        <span
          className={cx('aura-table__gutter aura-table__gutter--end', controls && 'has-picker')}
          aria-hidden={true}
        />
      </div>
    ) : null;
  const scrollStyle: React.CSSProperties = {
    scrollPaddingLeft: 'calc(var(--aura-space-6)' + selW + ' + ' + acc + ')',
    scrollPaddingTop: ROW_H + 'px',
    scrollPaddingBottom: stickyTotal ? ROW_H + 'px' : undefined,
  };
  if (height) (scrollStyle as Record<string, string>)['--aura-table-h'] = height + 'px';

  const gridEl = (
    <div
      ref={levels.length ? wrapRef : wrapMerged}
      data-density={props.density}
      className={cx(
        'aura-table',
        stacked && 'aura-table--stacked',
        scrolledX[0] && 'is-scrolled-x',
        refreshing && 'is-refreshing',
        !levels.length && props.className,
      )}
      style={
        levels.length
          ? ({ ['--aura-q-back' as string]: String(levels[levels.length - 1].px / Q) } as React.CSSProperties)
          : undefined
      }
    >
      {refreshing ? <span className="aura-table__busy-bar" aria-hidden={true} /> : null}
      <div
        ref={function (el: HTMLDivElement | null): void {
          scrollRef.current = el;
          gridRef.current = el;
        }}
        className="aura-table__scroll"
        onMouseOver={showFull}
        onMouseLeave={hideFull}
        onFocus={showFull}
        onBlur={hideFull}
        style={scrollStyle}
        role="grid"
        aria-label={props.label}
        aria-busy={busy || undefined}
        aria-rowcount={
          loading || (manual && props.totalRows == null && pageSize && rows.length >= pageSize)
            ? -1 /* total unknown (5.1.1) */
            : shownTotal + 1 + (totalRow ? 1 : 0)
        }
        aria-colcount={nCols}
        aria-multiselectable={selectable || undefined}
        onKeyDown={onGridKey}
        onScroll={function (e: React.UIEvent<HTMLDivElement>) {
          const t = e.currentTarget;
          if (virtual && Math.abs(t.scrollTop - scrollTop) >= ROW_H / 2) setScrollTop(t.scrollTop);
          else if (virtual && (t.scrollTop === 0 || t.scrollTop + t.clientHeight >= t.scrollHeight - 1))
            setScrollTop(t.scrollTop);
          const sx = t.scrollLeft > 0;
          if (sx !== scrolledX[0]) scrolledX[1](sx);
        }}
      >
        <div
          className={cx('aura-table__head', selectable && nRows > 0 && !busy && 'has-select-all')}
          role="row"
          aria-rowindex={1}
          style={rowStyle}
        >
          {head}
        </div>
        {body}
        {totalRow}
      </div>
      {busy ? (
        <span className="aura-sr-only" role="status">
          {t.loadingRows}
        </span>
      ) : null}
      {controls ? (
        <div className="aura-table__picker">
          <IconButton
            icon="columns-3"
            label={t.showHideColumns}
            aria-haspopup="menu"
            onClick={function (e: React.MouseEvent<HTMLButtonElement>) {
              openMenu('picker', null, e.currentTarget);
            }}
          />
        </div>
      ) : null}
      {foot}
      {menu ? (
        <Menu
          anchor={menu.anchor}
          onClose={closeMenu}
          label={menu.kind === 'picker' ? t.columns : t.column(byKey[menu.key!] && byKey[menu.key!].label)}
          items={menu.kind === 'picker' ? pickerItems() : byKey[menu.key!] ? columnMenuItems(byKey[menu.key!]) : []}
        />
      ) : null}
      {tipEl}
      {jumpState[0] != null && props.getPageHref ? (
        <Link ref={jumpLink} href={props.getPageHref(jumpState[0])} hidden={true} tabIndex={-1} aria-hidden={true} />
      ) : null}
    </div>
  );
  if (!levels.length) return gridEl;
  /* Nested width-query boxes, outermost first (see Q above). The outer box takes the ref and className. */
  let out: React.ReactElement = gridEl;
  for (let i = levels.length - 1; i >= 0; i--) {
    const prev = i === 0 ? Q : levels[i - 1].px;
    out = (
      <div
        className={cx('aura-table-q', 'aura-table-q--' + levels[i].name)}
        style={{ ['--aura-q-scale' as string]: String(prev / levels[i].px) } as React.CSSProperties}
      >
        {out}
      </div>
    );
  }
  return (
    <div ref={ref} className={cx('aura-table-box', props.className)}>
      {out}
    </div>
  );
});
